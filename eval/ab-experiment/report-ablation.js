// Compares the framing-stripped ablation (B'), platform-guidelines-stripped
// ablation (B''), and any other ablations to the main B condition and to A.
//
// Ablations are discovered from results/scored-ablation-<label>.json files.
// Each one is loaded and compared against the main scored.json.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { COMPONENTS } from "./components.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS = join(__dirname, "results");

function logFactorial(n) { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; }
function logChoose(n, k) { if (k < 0 || k > n) return -Infinity; return logFactorial(n) - logFactorial(k) - logFactorial(n - k); }
function binomLogPMF(n, k, p) { if (p <= 0) return k === 0 ? 0 : -Infinity; if (p >= 1) return k === n ? 0 : -Infinity; return logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p); }
function binomCDF(n, k, p) { if (k < 0) return 0; if (k >= n) return 1; let s = 0; for (let i = 0; i <= k; i++) s += Math.exp(binomLogPMF(n, i, p)); return s; }
function bisectP(fn, target) { let lo = 0, hi = 1; for (let i = 0; i < 200 && hi - lo > 1e-6; i++) { const mid = (lo + hi) / 2; if (fn(mid) > target) lo = mid; else hi = mid; } return (lo + hi) / 2; }
function clopperPearson(k, n, alpha = 0.05) {
  if (n === 0) return { lower: 0, upper: 1 };
  const lower = k === 0 ? 0 : bisectP((p) => binomCDF(n, k - 1, p), 1 - alpha / 2);
  const upper = k === n ? 1 : bisectP((p) => binomCDF(n, k, p), alpha / 2);
  return { lower, upper };
}
function bootstrapMeanCI(values, iters = 1000) {
  if (!values.length) return { mean: 0, lower: 0, upper: 0 };
  const n = values.length;
  const means = new Array(iters);
  for (let i = 0; i < iters; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += values[Math.floor(Math.random() * n)];
    means[i] = s / n;
  }
  means.sort((a, b) => a - b);
  const mean = values.reduce((s, v) => s + v, 0) / n;
  return { mean, lower: means[Math.floor(0.025 * iters)], upper: means[Math.floor(0.975 * iters)] };
}
function fmtPct(x) { return (x * 100).toFixed(1) + "%"; }
function formatCI(p, lo, hi) { return `${fmtPct(p)} [${fmtPct(lo)}, ${fmtPct(hi)}]`; }

function buildMarkerTable(scored, condition) {
  const out = {};
  for (const run of scored.runs) {
    if (run.condition !== condition) continue;
    if (!out[run.componentName]) out[run.componentName] = {};
    for (const r of run.results) {
      if (!out[run.componentName][r.id]) out[run.componentName][r.id] = [];
      out[run.componentName][r.id].push(r.satisfied ? 1 : 0);
    }
  }
  return out;
}

function aggregateTable(table) {
  let k = 0, n = 0;
  for (const comp of Object.keys(COMPONENTS)) {
    for (const marker of COMPONENTS[comp].markers) {
      const arr = (table[comp] || {})[marker.id] || [];
      k += arr.reduce((s, v) => s + v, 0);
      n += arr.length;
    }
  }
  return { k, n };
}

function markerLevelDeltas(baseline, variant) {
  const out = [];
  for (const comp of Object.keys(COMPONENTS)) {
    for (const marker of COMPONENTS[comp].markers) {
      const baseArr = (baseline[comp] || {})[marker.id] || [];
      const varArr = (variant[comp] || {})[marker.id] || [];
      const pBase = baseArr.length ? baseArr.reduce((s, v) => s + v, 0) / baseArr.length : 0;
      const pVar = varArr.length ? varArr.reduce((s, v) => s + v, 0) / varArr.length : 0;
      out.push({ component: comp, id: marker.id, tier: marker.tier, pBase, pVar, delta: pVar - pBase });
    }
  }
  return out;
}

function componentAgg(table) {
  const out = {};
  for (const comp of Object.keys(COMPONENTS)) {
    let k = 0, n = 0;
    for (const marker of COMPONENTS[comp].markers) {
      const arr = (table[comp] || {})[marker.id] || [];
      k += arr.reduce((s, v) => s + v, 0);
      n += arr.length;
    }
    out[comp] = { k, n, p: n ? k / n : 0 };
  }
  return out;
}

function findAblations() {
  const files = readdirSync(RESULTS).filter((f) => f.startsWith("scored-ablation-") && f.endsWith(".json"));
  return files.map((f) => ({
    label: f.replace(/^scored-ablation-/, "").replace(/\.json$/, ""),
    path: join(RESULTS, f),
  }));
}

function labelToShort(label) {
  return {
    "no-framing": "B′ (framing stripped)",
    "no-platform-guidelines": "B″ (platform-guidelines stripped)",
  }[label] || `B (${label})`;
}

function main() {
  const main = JSON.parse(readFileSync(join(RESULTS, "scored.json"), "utf8"));
  const mA = buildMarkerTable(main, "A");
  const mB = buildMarkerTable(main, "B");
  const aggA = aggregateTable(mA);
  const aggB = aggregateTable(mB);

  const ablations = findAblations();
  const ablTables = ablations.map((abl) => {
    const data = JSON.parse(readFileSync(abl.path, "utf8"));
    return { label: abl.label, short: labelToShort(abl.label), table: buildMarkerTable(data, "B") };
  });

  // Per-component aggregates
  const compA = componentAgg(mA);
  const compB = componentAgg(mB);
  const compAbl = ablTables.map(({ table, short }) => ({ short, agg: componentAgg(table) }));

  const lines = [];
  lines.push(`# Ablations report`);
  lines.push("");
  lines.push(`Ablations loaded: ${ablations.map((a) => a.label).join(", ")}. Each variant regenerates the 10 CLAUDE.md files with one section of \`prompt.js\` removed, then runs 100 B-condition generations with those CLAUDE.md files as context. Comparisons are against the main B (full CLAUDE.md) and A (no CLAUDE.md) baselines from the primary matrix.`);
  lines.push("");
  lines.push(`## Headline`);
  lines.push("");
  const aggRows = [];
  const pA = aggA.k / aggA.n;
  const pB = aggB.k / aggB.n;
  const ciA = clopperPearson(aggA.k, aggA.n);
  const ciB = clopperPearson(aggB.k, aggB.n);
  aggRows.push(`| A (no CLAUDE.md) | ${formatCI(pA, ciA.lower, ciA.upper)} | — | — |`);
  aggRows.push(`| B (full prompt.js) | ${formatCI(pB, ciB.lower, ciB.upper)} | ${fmtPct(pB - pA)} | — |`);
  for (const { short, table } of ablTables) {
    const agg = aggregateTable(table);
    const p = agg.k / agg.n;
    const ci = clopperPearson(agg.k, agg.n);
    const deltas = markerLevelDeltas(mB, table).map((r) => r.delta);
    const boot = bootstrapMeanCI(deltas);
    aggRows.push(`| ${short} | ${formatCI(p, ci.lower, ci.upper)} | ${fmtPct(p - pA)} | ${fmtPct(boot.mean)} [${fmtPct(boot.lower)}, ${fmtPct(boot.upper)}] |`);
  }
  lines.push(`| Condition | Satisfaction rate | Δ vs A | Mean marker-level Δ vs B (bootstrap 95% CI) |`);
  lines.push(`| --- | --- | --- | --- |`);
  lines.push(...aggRows);
  lines.push("");

  lines.push(`## Per-component`);
  lines.push("");
  const compsSorted = Object.keys(COMPONENTS).sort((a, b) =>
    (compB[b].p - compA[b].p) - (compB[a].p - compA[a].p)
  );
  const header = ["Component", "A", "B"];
  for (const ab of ablTables) header.push(ab.short);
  lines.push(`| ${header.join(" | ")} |`);
  lines.push(`| ${header.map(() => "---").join(" | ")} |`);
  for (const comp of compsSorted) {
    const row = [comp, fmtPct(compA[comp].p), fmtPct(compB[comp].p)];
    for (const ab of compAbl) row.push(fmtPct(ab.agg[comp].p));
    lines.push(`| ${row.join(" | ")} |`);
  }
  lines.push("");

  // Per-marker for each ablation — only show markers where |variant - B| >= 10pp
  for (const { short, table, label } of ablTables) {
    lines.push(`## Per-marker: ${short} vs. full B (moved ≥ 10pp)`);
    lines.push("");
    const deltas = markerLevelDeltas(mB, table);
    const moved = deltas.filter((r) => Math.abs(r.delta) >= 0.1);
    moved.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    if (moved.length === 0) {
      lines.push(`_No markers moved by 10pp or more._`);
      lines.push("");
      continue;
    }
    lines.push(`| Component | Marker | Tier | B (full) | ${short} | Δ |`);
    lines.push(`| --- | --- | --- | --- | --- | --- |`);
    for (const r of moved) {
      lines.push(`| ${r.component} | \`${r.id}\` | ${r.tier} | ${fmtPct(r.pBase)} | ${fmtPct(r.pVar)} | ${fmtPct(r.delta)} |`);
    }
    lines.push("");
  }

  mkdirSync(RESULTS, { recursive: true });
  const outPath = join(RESULTS, "ablation-report.md");
  writeFileSync(outPath, lines.join("\n"));
  console.log(`Wrote ${outPath}`);
  console.log(`\nHeadline:`);
  console.log(`  A: ${fmtPct(pA)}`);
  console.log(`  B: ${fmtPct(pB)}`);
  for (const { short, table } of ablTables) {
    const agg = aggregateTable(table);
    const p = agg.k / agg.n;
    console.log(`  ${short}: ${fmtPct(p)}  (Δ vs B: ${fmtPct(p - pB)})`);
  }
}

main();
