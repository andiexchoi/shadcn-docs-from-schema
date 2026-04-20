// Agentic replication harness. For each (component, condition, run) in the
// small replication tranche, builds a real scaffold directory and invokes
// `claude -p --bare --model sonnet` inside it. Claude Code reads the scaffold
// files, optionally reads CLAUDE.md (condition B only), and writes the
// component file. We then copy the resulting file to a collector location.
//
// Scope per pre-registration §Sample size:
//   2 components (dialog, field) × 2 conditions × 5 runs = 20 generations.

import { spawn } from "child_process";
import { mkdirSync, existsSync, readFileSync, writeFileSync, rmSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { COMPONENTS } from "./components.js";
import { buildScaffold } from "./scaffold.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const SCAFFOLDS_DIR = join(ROOT, "scaffolds-agentic");
const RUNS_DIR = join(ROOT, "runs", "agentic");
const RESULTS_DIR = join(ROOT, "results");

const CONCURRENCY = 3;
const PER_RUN_BUDGET_USD = 0.5;
const MAX_RETRIES = 1;

const REPLICATION_COMPONENTS = ["dialog", "field"];
const RUNS_PER_CELL = 5;

function parseArgs(argv) {
  const args = {
    components: REPLICATION_COMPONENTS,
    runs: RUNS_PER_CELL,
    condition: null,
    startRun: 1,
    label: "agentic",
    keepScaffolds: false,
    skipExisting: true,
  };
  for (let i = 2; i < argv.length; i++) {
    const flag = argv[i];
    const next = argv[i + 1];
    if (flag === "--components") { args.components = next.split(","); i++; }
    else if (flag === "--runs") { args.runs = Number(next); i++; }
    else if (flag === "--condition") { args.condition = next; i++; }
    else if (flag === "--start-run") { args.startRun = Number(next); i++; }
    else if (flag === "--label") { args.label = next; i++; }
    else if (flag === "--keep-scaffolds") { args.keepScaffolds = true; }
    else if (flag === "--no-skip-existing") { args.skipExisting = false; }
  }
  return args;
}

// Invoke `claude -p --bare` and wait for exit. Returns parsed result.
async function runClaudeOnce({ scaffoldDir, userPrompt }) {
  return new Promise((resolve) => {
    const args = [
      "-p",
      "--bare",
      "--model", "sonnet",
      "--dangerously-skip-permissions",
      "--add-dir", scaffoldDir,
      "--max-budget-usd", String(PER_RUN_BUDGET_USD),
      "--output-format", "json",
      userPrompt,
    ];

    const child = spawn("claude", args, {
      cwd: scaffoldDir,
      env: { ...process.env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });

    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

async function generateOne({ component, componentName, condition, runId, scaffoldDir, outPath }) {
  buildScaffold({
    scaffoldDir,
    component,
    includeClaudeMd: condition === "B",
  });

  const userPrompt = `${component.prompt}\n\nWrite the implementation as \`components/${component.slug}.tsx\`.`;
  const expectedFile = join(scaffoldDir, "components", `${component.slug}.tsx`);

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    const { code, stdout, stderr } = await runClaudeOnce({ scaffoldDir, userPrompt });

    if (existsSync(expectedFile)) {
      copyFileSync(expectedFile, outPath);
      let sessionInfo = null;
      try {
        const parsed = JSON.parse(stdout);
        sessionInfo = {
          total_cost_usd: parsed.total_cost_usd,
          duration_ms: parsed.duration_ms,
          num_turns: parsed.num_turns,
          session_id: parsed.session_id,
        };
      } catch {}
      return { ok: true, sessionInfo };
    }

    if (attempt <= MAX_RETRIES) {
      console.log(`  retry ${attempt} for ${componentName}/${condition}/${runId}: no file at ${expectedFile}, exit=${code}`);
    } else {
      return {
        ok: false,
        reason: `no file after ${attempt} attempts, last exit=${code}`,
        stderrTail: stderr.slice(-500),
        stdoutTail: stdout.slice(-500),
      };
    }
  }
}

async function runPool(tasks, concurrency, worker) {
  const results = new Array(tasks.length);
  let cursor = 0;
  async function runNext() {
    while (true) {
      const i = cursor++;
      if (i >= tasks.length) return;
      results[i] = await worker(tasks[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, runNext));
  return results;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set.");
    process.exit(1);
  }

  const conditions = args.condition ? [args.condition] : ["A", "B"];
  const tasks = [];
  let skipped = 0;
  for (const componentName of args.components) {
    const component = COMPONENTS[componentName];
    if (!component) {
      console.error(`Unknown component "${componentName}".`);
      process.exit(1);
    }
    for (const condition of conditions) {
      for (let r = 0; r < args.runs; r++) {
        const runId = String(args.startRun + r).padStart(2, "0");
        const outPath = join(RUNS_DIR, componentName, condition, `run-${runId}.tsx`);
        if (args.skipExisting && existsSync(outPath)) {
          skipped++;
          continue;
        }
        const scaffoldDir = join(SCAFFOLDS_DIR, `${componentName}-${condition}-${runId}`);
        tasks.push({ component, componentName, condition, runId, scaffoldDir, outPath });
      }
    }
  }

  console.log(`[${args.label}] ${tasks.length} tasks: ${args.components.join(", ")} × [${conditions.join(",")}] × ${args.runs} runs, concurrency=${CONCURRENCY}${args.skipExisting ? ` (skipped ${skipped} existing)` : ""}`);
  mkdirSync(RESULTS_DIR, { recursive: true });

  const startedAt = new Date().toISOString();
  let succeeded = 0;
  let failed = 0;
  const log = [];

  await runPool(tasks, CONCURRENCY, async (task) => {
    const { componentName, condition, runId, outPath } = task;
    mkdirSync(dirname(outPath), { recursive: true });

    const result = await generateOne(task);
    log.push({
      componentName,
      condition,
      runId,
      outPath,
      ...result,
    });

    if (result.ok) {
      succeeded++;
      process.stdout.write(".");
    } else {
      failed++;
      process.stdout.write("x");
    }

    if (!args.keepScaffolds && result.ok) {
      try { rmSync(task.scaffoldDir, { recursive: true, force: true }); } catch {}
    }
  });

  process.stdout.write("\n");
  const finishedAt = new Date().toISOString();

  const summary = {
    label: args.label,
    startedAt,
    finishedAt,
    components: args.components,
    conditions,
    runsPerCell: args.runs,
    totalTasks: tasks.length,
    succeeded,
    failed,
    totalCostUsd: log
      .filter((e) => e.ok && e.sessionInfo?.total_cost_usd)
      .reduce((s, e) => s + (e.sessionInfo.total_cost_usd || 0), 0),
    log,
  };

  const summaryPath = join(RESULTS_DIR, `generation-log-${args.label}.json`);
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n[${args.label}] summary`);
  console.log(`  succeeded: ${succeeded}/${tasks.length}`);
  console.log(`  failed:    ${failed}`);
  console.log(`  est. cost: $${summary.totalCostUsd.toFixed(4)}`);
  console.log(`  log: ${summaryPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
