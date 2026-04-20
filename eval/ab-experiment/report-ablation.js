// Compares the framing-stripped ablation (B') to the full-framing baseline (B)
// and the no-CLAUDE.md condition (A). Writes results/ablation-report.md.

import { readFileSync, writeFileSync, mkdirSync } from "fs";
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
  // byMarker[component][markerId] = [satisfied, ...]
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

function main() {
  const main = JSON.parse(readFileSync(join(RESULTS, "scored.json"), "utf8"));
  const abl = JSON.parse(readFileSync(join(RESULTS, "scored-ablation-no-framing.json"), "utf8"));

  const mA = buildMarkerTable(main, "A");
  const mB = buildMarkerTable(main, "B");
  const mBp = buildMarkerTable(abl, "B");

  // Per-marker comparison
  const rows = [];
  for (const component of Object.keys(COMPONENTS)) {
    const markers = COMPONENTS[component].markers;
    for (const marker of markers) {
      const a = (mA[component] || {})[marker.id] || [];
      const b = (mB[component] || {})[marker.id] || [];
      const bp = (mBp[component] || {})[marker.id] || [];
      const pA = a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0;
      const pB = b.length ? b.reduce((s, v) => s + v, 0) / b.length : 0;
      const pBp = bp.length ? bp.reduce((s, v) => s + v, 0) / bp.length : 0;
      rows.push({ component, id: marker.id, tier: marker.tier, pA, pB, pBp, deltaB: pB - pA, deltaBp: pBp - pA, deltaAbl: pBp - pB });
    }
  }

  // Overall aggregates
  const byCond = { A: { k: 0, n: 0 }, B: { k: 0, n: 0 }, Bp: { k: 0, n: 0 } };
  for (const component of Object.keys(COMPONENTS)) {
    for (const marker of COMPONENTS[component].markers) {
      const a = (mA[component] || {})[marker.id] || [];
      const b = (mB[component] || {})[marker.id] || [];
      const bp = (mBp[component] || {})[marker.id] || [];
      byCond.A.k += a.reduce((s, v) => s + v, 0); byCond.A.n += a.length;
      byCond.B.k += b.reduce((s, v) => s + v, 0); byCond.B.n += b.length;
      byCond.Bp.k += bp.reduce((s, v) => s + v, 0); byCond.Bp.n += bp.length;
    }
  }

  const pA = byCond.A.k / byCond.A.n;
  const pB = byCond.B.k / byCond.B.n;
  const pBp = byCond.Bp.k / byCond.Bp.n;
  const ciA = clopperPearson(byCond.A.k, byCond.A.n);
  const ciB = clopperPearson(byCond.B.k, byCond.B.n);
  const ciBp = clopperPearson(byCond.Bp.k, byCond.Bp.n);

  // Bootstrap CIs on marker-level deltas
  const deltasB = rows.map((r) => r.deltaB);
  const deltasBp = rows.map((r) => r.deltaBp);
  const deltasAbl = rows.map((r) => r.deltaAbl);
  const bootB = bootstrapMeanCI(deltasB);
  const bootBp = bootstrapMeanCI(deltasBp);
  const bootAbl = bootstrapMeanCI(deltasAbl);

  // Per-component summary
  const byComp = {};
  for (const r of rows) {
    if (!byComp[r.component]) byComp[r.component] = { nA: 0, kA: 0, nB: 0, kB: 0, nBp: 0, kBp: 0 };
    byComp[r.component].kA += r.pA * 10; byComp[r.component].nA += 10;
    byComp[r.component].kB += r.pB * 10; byComp[r.component].nB += 10;
    byComp[r.component].kBp += r.pBp * 10; byComp[r.component].nBp += 10;
  }

  // Render markdown
  const lines = [];
  lines.push(`# Ablation: framing philosophy stripped from prompt.js`);
  lines.push("");
  lines.push(`What it tests: whether the "Non-negotiable formatting rules" and "Framing philosophy" sections in prompt.js are doing real work, or whether the CLAUDE.md's downstream effect survives without them. Everything else in prompt.js (template, output budget, style-guide, platform-guidelines, semantic-guidelines) stays. Rerun: regenerate the 10 CLAUDE.md files with \`ablations/prompt-no-framing.js\`, then run the 100-generation B condition using those CLAUDE.md's. No changes to the rubric or the A condition.`);
  lines.push("");
  lines.push(`## Headline`);
  lines.push("");
  lines.push(`| Condition | Satisfaction rate | Δ vs A | Mean marker-level Δ (bootstrap 95% CI) |`);
  lines.push(`| --- | --- | --- | --- |`);
  lines.push(`| A (no CLAUDE.md) | ${formatCI(pA, ciA.lower, ciA.upper)} | — | — |`);
  lines.push(`| B (full CLAUDE.md) | ${formatCI(pB, ciB.lower, ciB.upper)} | ${fmtPct(pB - pA)} | ${fmtPct(bootB.mean)} [${fmtPct(bootB.lower)}, ${fmtPct(bootB.upper)}] |`);
  lines.push(`| B' (framing stripped) | ${formatCI(pBp, ciBp.lower, ciBp.upper)} | ${fmtPct(pBp - pA)} | ${fmtPct(bootBp.mean)} [${fmtPct(bootBp.lower)}, ${fmtPct(bootBp.upper)}] |`);
  lines.push("");
  lines.push(`**B' − B: ${fmtPct(pBp - pB)} overall**, mean marker-level delta ${fmtPct(bootAbl.mean)} (95% CI [${fmtPct(bootAbl.lower)}, ${fmtPct(bootAbl.upper)}]).`);
  lines.push("");
  lines.push(`## Per-component`);
  lines.push("");
  lines.push(`| Component | A | B | B' | B−A | B'−A | B'−B |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- |`);
  for (const [comp, v] of Object.entries(byComp)) {
    const pA = v.kA / v.nA;
    const pB = v.kB / v.nB;
    const pBp = v.kBp / v.nBp;
    lines.push(`| ${comp} | ${fmtPct(pA)} | ${fmtPct(pB)} | ${fmtPct(pBp)} | ${fmtPct(pB - pA)} | ${fmtPct(pBp - pA)} | ${fmtPct(pBp - pB)} |`);
  }
  lines.push("");
  lines.push(`## Per-marker (sorted by |B' − B|)`);
  lines.push("");
  lines.push(`Only markers where the ablation moved the result by 10pp or more in either direction.`);
  lines.push("");
  lines.push(`| Component | Marker | Tier | A | B | B' | B'−B |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- |`);
  const filtered = rows.filter((r) => Math.abs(r.deltaAbl) >= 0.1);
  filtered.sort((a, b) => Math.abs(b.deltaAbl) - Math.abs(a.deltaAbl));
  for (const r of filtered) {
    lines.push(`| ${r.component} | \`${r.id}\` | ${r.tier} | ${fmtPct(r.pA)} | ${fmtPct(r.pB)} | ${fmtPct(r.pBp)} | ${fmtPct(r.deltaAbl)} |`);
  }
  lines.push("");

  mkdirSync(RESULTS, { recursive: true });
  const outPath = join(RESULTS, "ablation-report.md");
  writeFileSync(outPath, lines.join("\n"));
  console.log(`Wrote ${outPath}`);
  console.log(`\nHeadline: A ${fmtPct(pA)}, B ${fmtPct(pB)}, B' ${fmtPct(pBp)}`);
  console.log(`B' − B: ${fmtPct(pBp - pB)} (bootstrap 95% CI [${fmtPct(bootAbl.lower)}, ${fmtPct(bootAbl.upper)}])`);
}

main();
