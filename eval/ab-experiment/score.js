// Scoring orchestrator. Walks runs/direct/<component>/<condition>/run-*.tsx,
// applies structural + behavioral + semantic markers per component, writes
// per-run scores to results/scored.json.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { COMPONENTS } from "./components.js";
import { scoreStructural } from "./scorers/structural.js";
import { scoreBehavioral } from "./scorers/behavioral.js";
import { scoreSemanticBatch, createJudgeClient } from "./scorers/semantic.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const RUNS_DIR = join(ROOT, "runs", "direct");
const RESULTS_DIR = join(ROOT, "results");

function parseArgs(argv) {
  const args = {
    components: null,
    condition: null,
    skipSemantic: false,
    output: "scored.json",
  };
  for (let i = 2; i < argv.length; i++) {
    const flag = argv[i];
    const next = argv[i + 1];
    if (flag === "--components") { args.components = next.split(","); i++; }
    else if (flag === "--condition") { args.condition = next; i++; }
    else if (flag === "--skip-semantic") { args.skipSemantic = true; }
    else if (flag === "--output") { args.output = next; i++; }
  }
  return args;
}

function scoreOneRun({ marker, source }) {
  if (marker.tier === "structural") return scoreStructural(marker, source);
  if (marker.tier === "behavioral") return scoreBehavioral(marker, source);
  return null; // semantic handled in batch below
}

async function scoreOneFile({ judgeClient, componentName, condition, runId, filePath, skipSemantic }) {
  const component = COMPONENTS[componentName];
  const source = readFileSync(filePath, "utf8");
  const markers = component.markers;

  const regexResults = [];
  for (const marker of markers) {
    if (marker.tier === "semantic") continue;
    regexResults.push(scoreOneRun({ marker, source }));
  }

  let semanticResults = [];
  if (!skipSemantic) {
    try {
      semanticResults = await scoreSemanticBatch({ client: judgeClient, markers, source });
    } catch (err) {
      console.error(`  semantic scoring failed for ${componentName}/${condition}/${runId}: ${err.message}`);
      // Fill with judge-missing placeholders so the marker count stays consistent
      semanticResults = markers
        .filter((m) => m.tier === "semantic")
        .map((m) => ({
          id: m.id,
          tier: "semantic",
          direction: m.direction,
          satisfied: false,
          reason: `JUDGE_ERROR: ${err.message.slice(0, 120)}`,
          judgeError: true,
        }));
    }
  }

  return {
    componentName,
    condition,
    runId,
    filePath,
    sourceLength: source.length,
    results: [...regexResults, ...semanticResults],
  };
}

function enumerateRuns({ componentsFilter, conditionFilter }) {
  const entries = [];
  const componentNames = componentsFilter || Object.keys(COMPONENTS);
  for (const componentName of componentNames) {
    if (!COMPONENTS[componentName]) continue;
    for (const condition of conditionFilter ? [conditionFilter] : ["A", "B"]) {
      const dir = join(RUNS_DIR, componentName, condition);
      if (!existsSync(dir)) continue;
      const files = readdirSync(dir).filter((f) => f.endsWith(".tsx")).sort();
      for (const f of files) {
        const match = f.match(/^run-(\d+)\.tsx$/);
        if (!match) continue;
        entries.push({
          componentName,
          condition,
          runId: match[1],
          filePath: join(dir, f),
        });
      }
    }
  }
  return entries;
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
  mkdirSync(RESULTS_DIR, { recursive: true });

  const runs = enumerateRuns({ componentsFilter: args.components, conditionFilter: args.condition });
  if (runs.length === 0) {
    console.error("No run files found. Did the harness complete?");
    process.exit(1);
  }
  console.log(`Scoring ${runs.length} runs (skipSemantic=${args.skipSemantic})`);

  const judgeClient = args.skipSemantic ? null : createJudgeClient();

  const scored = await runPool(runs, 5, async (entry) => {
    const result = await scoreOneFile({
      judgeClient,
      skipSemantic: args.skipSemantic,
      ...entry,
    });
    process.stdout.write(".");
    return result;
  });

  process.stdout.write("\n");

  const outPath = join(RESULTS_DIR, args.output);
  writeFileSync(outPath, JSON.stringify({
    scoredAt: new Date().toISOString(),
    skipSemantic: args.skipSemantic,
    runs: scored,
  }, null, 2));
  console.log(`Wrote ${outPath}`);

  const summary = summarize(scored);
  console.log("\n" + summary);
}

function summarize(scored) {
  const byCell = {};
  for (const run of scored) {
    const key = `${run.componentName}/${run.condition}`;
    if (!byCell[key]) byCell[key] = { total: 0, satisfied: 0 };
    for (const r of run.results) {
      byCell[key].total += 1;
      if (r.satisfied) byCell[key].satisfied += 1;
    }
  }
  const lines = ["Cell summary (satisfied / total):"];
  for (const [key, v] of Object.entries(byCell)) {
    lines.push(`  ${key}: ${v.satisfied}/${v.total} (${((v.satisfied / v.total) * 100).toFixed(1)}%)`);
  }
  return lines.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
