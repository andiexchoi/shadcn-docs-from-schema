import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { COMPONENTS, buildSystemPrompt, buildUserPrompt } from "./components.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const CLAUDE_MD_CACHE = join(ROOT, "claude-md");
const RUNS_DIR = join(ROOT, "runs", "direct");
const RESULTS_DIR = join(ROOT, "results");

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 8192;
const CONCURRENCY = 10;
const MAX_RETRIES = 2;

// Sonnet 4.6 public pricing as of April 2026. Adjust if the pricing page
// disagrees at run time — scoring doesn't depend on this number, it's only
// for the operator's cost tracker.
const PRICE_INPUT_PER_M = 3;
const PRICE_OUTPUT_PER_M = 15;

function parseArgs(argv) {
  const args = {
    components: null, // null → all
    runs: 10,
    condition: null, // null → both
    startRun: 1,
    label: "matrix",
    skipExisting: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const flag = argv[i];
    const next = argv[i + 1];
    if (flag === "--components") { args.components = next.split(","); i++; }
    else if (flag === "--runs") { args.runs = Number(next); i++; }
    else if (flag === "--condition") { args.condition = next; i++; }
    else if (flag === "--start-run") { args.startRun = Number(next); i++; }
    else if (flag === "--label") { args.label = next; i++; }
    else if (flag === "--skip-existing") { args.skipExisting = true; }
    else if (flag === "--help") {
      console.log(`Usage: node harness.js [--components a,b] [--runs N] [--condition A|B] [--start-run N] [--label LBL] [--skip-existing]`);
      process.exit(0);
    }
  }
  return args;
}

function loadClaudeMd(componentName) {
  const path = join(CLAUDE_MD_CACHE, `${componentName}.md`);
  if (!existsSync(path)) {
    throw new Error(`CLAUDE.md cache missing for "${componentName}". Run cache-claude-md.js first.`);
  }
  return readFileSync(path, "utf8");
}

function stripMarkdownFences(text) {
  // Model is instructed to emit raw TSX. If it wraps in fences despite the
  // instruction, strip the outermost pair.
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:tsx|typescript|ts|jsx|javascript|js)?\s*\n([\s\S]*?)\n```\s*$/);
  if (fenceMatch) return { stripped: true, content: fenceMatch[1] };
  return { stripped: false, content: trimmed };
}

function looksLikeTsx(text) {
  const head = text.trim().slice(0, 200);
  return (
    head.startsWith(`"use client"`) ||
    head.startsWith(`'use client'`) ||
    head.startsWith("import ") ||
    head.startsWith("/*") ||
    head.startsWith("//") ||
    head.startsWith("export ") ||
    head.startsWith("const ") ||
    head.startsWith("function ") ||
    head.startsWith("type ") ||
    head.startsWith("interface ") ||
    head.startsWith("React")
  );
}

async function generateOne({ client, component, condition, runId, log }) {
  const claudeMdContent = condition === "B" ? loadClaudeMd(component.batchName) : null;
  const system = buildSystemPrompt({ component, claudeMdContent });
  const user = buildUserPrompt(component);

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        messages: [{ role: "user", content: user }],
      });
      const text = response.content.map((c) => c.text || "").join("");
      const { stripped, content } = stripMarkdownFences(text);

      if (!looksLikeTsx(content)) {
        log(`  retry ${attempt}: response doesn't look like TSX (head: ${JSON.stringify(content.slice(0, 80))})`);
        if (attempt > MAX_RETRIES) return { ok: false, reason: "bad-format" };
        continue;
      }

      return {
        ok: true,
        content,
        strippedFences: stripped,
        inputTokens: response.usage?.input_tokens || 0,
        outputTokens: response.usage?.output_tokens || 0,
        cacheReadTokens: response.usage?.cache_read_input_tokens || 0,
        cacheCreationTokens: response.usage?.cache_creation_input_tokens || 0,
      };
    } catch (err) {
      log(`  retry ${attempt}: ${err.message}`);
      if (attempt > MAX_RETRIES) return { ok: false, reason: `error: ${err.message}` };
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  return { ok: false, reason: "exhausted-retries" };
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
    console.error("ANTHROPIC_API_KEY not set. Did you source .env?");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const componentNames = args.components || Object.keys(COMPONENTS);
  const conditions = args.condition ? [args.condition] : ["A", "B"];

  const tasks = [];
  let skipped = 0;
  for (const componentName of componentNames) {
    const component = COMPONENTS[componentName];
    if (!component) {
      console.error(`Unknown component "${componentName}". Valid: ${Object.keys(COMPONENTS).join(", ")}`);
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
        tasks.push({ component, componentName, condition, runId });
      }
    }
  }

  console.log(`[${args.label}] ${tasks.length} tasks: ${componentNames.join(", ")} × [${conditions.join(",")}] × ${args.runs} runs, concurrency=${CONCURRENCY}${args.skipExisting ? ` (skipped ${skipped} existing)` : ""}`);

  mkdirSync(RESULTS_DIR, { recursive: true });
  const startedAt = new Date().toISOString();

  let totalInput = 0;
  let totalOutput = 0;
  let failures = 0;
  let succeeded = 0;
  const log = new Array(tasks.length);

  await runPool(tasks, CONCURRENCY, async (task, i) => {
    const { component, componentName, condition, runId } = task;
    const runDir = join(RUNS_DIR, componentName, condition);
    mkdirSync(runDir, { recursive: true });
    const outPath = join(runDir, `run-${runId}.tsx`);

    const perRunLog = [];
    const result = await generateOne({
      client,
      component,
      condition,
      runId,
      log: (msg) => perRunLog.push(msg),
    });

    const entry = {
      index: i,
      componentName,
      condition,
      runId,
      outPath,
      ok: result.ok,
      reason: result.reason,
      strippedFences: result.strippedFences,
      inputTokens: result.inputTokens || 0,
      outputTokens: result.outputTokens || 0,
      notes: perRunLog,
    };

    if (result.ok) {
      writeFileSync(outPath, result.content);
      totalInput += result.inputTokens || 0;
      totalOutput += result.outputTokens || 0;
      succeeded++;
      process.stdout.write(".");
    } else {
      failures++;
      process.stdout.write("x");
    }

    log[i] = entry;
  });

  process.stdout.write("\n");

  const finishedAt = new Date().toISOString();
  const estimatedCostUsd =
    (totalInput / 1_000_000) * PRICE_INPUT_PER_M +
    (totalOutput / 1_000_000) * PRICE_OUTPUT_PER_M;

  const summary = {
    label: args.label,
    startedAt,
    finishedAt,
    model: MODEL,
    components: componentNames,
    conditions,
    runsPerCell: args.runs,
    totalTasks: tasks.length,
    succeeded,
    failures,
    totalInputTokens: totalInput,
    totalOutputTokens: totalOutput,
    estimatedCostUsd: Number(estimatedCostUsd.toFixed(4)),
    log,
  };

  const summaryPath = join(RESULTS_DIR, `generation-log-${args.label}.json`);
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`\n[${args.label}] summary`);
  console.log(`  succeeded: ${succeeded}/${tasks.length}`);
  console.log(`  failures:  ${failures}`);
  console.log(`  tokens in: ${totalInput.toLocaleString()}`);
  console.log(`  tokens out: ${totalOutput.toLocaleString()}`);
  console.log(`  est. cost: $${estimatedCostUsd.toFixed(4)}`);
  console.log(`  log: ${summaryPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
