// Aggregates scored.json into headline statistics and writes report.md.
// Per-marker Clopper-Pearson 95% CIs on each condition's proportion;
// per-marker delta; sign test across marker-level deltas; bootstrap 95% CI
// on the mean marker-level delta. High-variance markers flagged.
//
// Outputs:
//   results/report.md       markdown tables + headline claim
//   results/aggregate.json   structured aggregate for programmatic reuse

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { COMPONENTS } from "./components.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const RESULTS_DIR = join(ROOT, "results");

function logFactorial(n) {
  let sum = 0;
  for (let i = 2; i <= n; i++) sum += Math.log(i);
  return sum;
}
function logChoose(n, k) {
  if (k < 0 || k > n) return -Infinity;
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}
function binomLogPMF(n, k, p) {
  if (p <= 0) return k === 0 ? 0 : -Infinity;
  if (p >= 1) return k === n ? 0 : -Infinity;
  return logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
}
function binomCDF(n, k, p) {
  if (k < 0) return 0;
  if (k >= n) return 1;
  let sum = 0;
  for (let i = 0; i <= k; i++) sum += Math.exp(binomLogPMF(n, i, p));
  return sum;
}

// Bisect on p to find where fn(p) = target. fn is assumed monotonic.
function bisectP(fn, target, decreasing = true, tol = 1e-6) {
  let lo = 0, hi = 1;
  for (let i = 0; i < 200 && hi - lo > tol; i++) {
    const mid = (lo + hi) / 2;
    const v = fn(mid);
    if (decreasing ? v > target : v < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function clopperPearson(k, n, alpha = 0.05) {
  if (n === 0) return { lower: 0, upper: 1 };
  const lower = k === 0
    ? 0
    : bisectP((p) => binomCDF(n, k - 1, p), 1 - alpha / 2, true);
  const upper = k === n
    ? 1
    : bisectP((p) => binomCDF(n, k, p), alpha / 2, true);
  return { lower, upper };
}

// Two-sided sign test: null = median of differences is 0. Tests P(X ≥ k) in
// Binomial(n, 0.5) + P(X ≤ n - k). Discards ties.
function signTest(deltas) {
  const nonzero = deltas.filter((d) => d !== 0);
  const n = nonzero.length;
  const pos = nonzero.filter((d) => d > 0).length;
  const extreme = Math.max(pos, n - pos);
  let pTwoSided = 0;
  for (let k = extreme; k <= n; k++) pTwoSided += Math.exp(binomLogPMF(n, k, 0.5));
  for (let k = 0; k <= n - extreme; k++) pTwoSided += Math.exp(binomLogPMF(n, k, 0.5));
  // Clip at 1 (the two tails can overlap when extreme = n/2)
  pTwoSided = Math.min(1, pTwoSided);
  return { n, positive: pos, negative: n - pos, pValue: pTwoSided };
}

function bootstrapMeanCI(values, iterations = 1000, alpha = 0.05) {
  if (values.length === 0) return { mean: 0, lower: 0, upper: 0 };
  const n = values.length;
  const means = new Array(iterations);
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) sum += values[Math.floor(Math.random() * n)];
    means[i] = sum / n;
  }
  means.sort((a, b) => a - b);
  const loIdx = Math.floor((alpha / 2) * iterations);
  const hiIdx = Math.floor((1 - alpha / 2) * iterations);
  const mean = values.reduce((s, v) => s + v, 0) / n;
  return { mean, lower: means[loIdx], upper: means[hiIdx] };
}

function parseArgs(argv) {
  const args = { input: "scored.json", output: "report.md" };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--input") { args.input = argv[++i]; }
    else if (argv[i] === "--output") { args.output = argv[++i]; }
  }
  return args;
}

function fmtPct(p) { return (p * 100).toFixed(1) + "%"; }
function fmtPctNoSign(p) { return (p * 100).toFixed(1); }

function formatCI(p, lo, hi) {
  return `${fmtPct(p)} [${fmtPct(lo)}, ${fmtPct(hi)}]`;
}

function main() {
  const args = parseArgs(process.argv);
  const inPath = join(RESULTS_DIR, args.input);
  const raw = JSON.parse(readFileSync(inPath, "utf8"));
  const runs = raw.runs;

  // byMarker[component][markerId] = { A: [boolean], B: [boolean], tier, direction, description }
  const byMarker = {};
  for (const run of runs) {
    const comp = run.componentName;
    if (!byMarker[comp]) byMarker[comp] = {};
    for (const r of run.results) {
      if (!byMarker[comp][r.id]) {
        // Look up marker metadata from COMPONENTS
        const markerDef = COMPONENTS[comp].markers.find((m) => m.id === r.id);
        byMarker[comp][r.id] = {
          tier: r.tier,
          direction: r.direction,
          description: markerDef ? markerDef.description : "(not in current components.js)",
          A: [],
          B: [],
        };
      }
      byMarker[comp][r.id][run.condition].push(r.satisfied);
    }
  }

  // Compute per-marker stats
  const markerStats = [];
  for (const [comp, markers] of Object.entries(byMarker)) {
    for (const [id, v] of Object.entries(markers)) {
      const kA = v.A.filter(Boolean).length;
      const nA = v.A.length;
      const kB = v.B.filter(Boolean).length;
      const nB = v.B.length;
      const pA = nA ? kA / nA : NaN;
      const pB = nB ? kB / nB : NaN;
      const ciA = clopperPearson(kA, nA);
      const ciB = clopperPearson(kB, nB);
      const delta = pB - pA;
      const highVariance =
        (pA >= 0.3 && pA <= 0.7) || (pB >= 0.3 && pB <= 0.7);
      markerStats.push({
        component: comp,
        id,
        tier: v.tier,
        direction: v.direction,
        description: v.description,
        kA, nA, pA, ciA,
        kB, nB, pB, ciB,
        delta,
        highVariance,
      });
    }
  }

  const deltas = markerStats.map((m) => m.delta).filter((d) => !Number.isNaN(d));
  const signT = signTest(deltas);
  const bootCI = bootstrapMeanCI(deltas, 1000);

  // Aggregate by component
  const byComponent = {};
  for (const m of markerStats) {
    if (!byComponent[m.component]) byComponent[m.component] = { markers: 0, kA: 0, nA: 0, kB: 0, nB: 0 };
    byComponent[m.component].markers += 1;
    byComponent[m.component].kA += m.kA;
    byComponent[m.component].nA += m.nA;
    byComponent[m.component].kB += m.kB;
    byComponent[m.component].nB += m.nB;
  }

  // Aggregate by tier
  const byTier = { structural: [], behavioral: [], semantic: [] };
  for (const m of markerStats) byTier[m.tier].push(m);
  const tierAgg = {};
  for (const [tier, ms] of Object.entries(byTier)) {
    const kA = ms.reduce((s, m) => s + m.kA, 0);
    const nA = ms.reduce((s, m) => s + m.nA, 0);
    const kB = ms.reduce((s, m) => s + m.kB, 0);
    const nB = ms.reduce((s, m) => s + m.nB, 0);
    const deltasTier = ms.map((m) => m.delta);
    tierAgg[tier] = {
      markers: ms.length,
      kA, nA, pA: nA ? kA / nA : 0,
      kB, nB, pB: nB ? kB / nB : 0,
      ciA: clopperPearson(kA, nA),
      ciB: clopperPearson(kB, nB),
      meanDelta: deltasTier.length ? deltasTier.reduce((s, d) => s + d, 0) / deltasTier.length : 0,
      bootstrap: bootstrapMeanCI(deltasTier, 1000),
      signTest: signTest(deltasTier),
    };
  }

  // Overall
  const overallKA = markerStats.reduce((s, m) => s + m.kA, 0);
  const overallNA = markerStats.reduce((s, m) => s + m.nA, 0);
  const overallKB = markerStats.reduce((s, m) => s + m.kB, 0);
  const overallNB = markerStats.reduce((s, m) => s + m.nB, 0);
  const overall = {
    pA: overallNA ? overallKA / overallNA : 0,
    pB: overallNB ? overallKB / overallNB : 0,
    ciA: clopperPearson(overallKA, overallNA),
    ciB: clopperPearson(overallKB, overallNB),
    meanMarkerDelta: bootCI.mean,
    bootstrap: bootCI,
    signTest: signT,
  };

  // Write aggregate JSON
  const aggregate = {
    scoredAt: raw.scoredAt,
    skipSemantic: raw.skipSemantic,
    overall,
    byTier: tierAgg,
    byComponent,
    markers: markerStats,
  };
  writeFileSync(join(RESULTS_DIR, "aggregate.json"), JSON.stringify(aggregate, null, 2));

  // Render markdown
  const md = renderMarkdown({ overall, tierAgg, byComponent, markerStats, runs });
  writeFileSync(join(RESULTS_DIR, args.output), md);
  console.log(`Wrote ${join(RESULTS_DIR, args.output)}`);
  console.log(`\nHeadline:\n  overall: A ${fmtPct(overall.pA)}, B ${fmtPct(overall.pB)}, delta ${fmtPct(overall.pB - overall.pA)}`);
  console.log(`  mean marker-level delta: ${fmtPct(bootCI.mean)} (95% CI [${fmtPct(bootCI.lower)}, ${fmtPct(bootCI.upper)}])`);
  console.log(`  sign test: ${signT.positive} positive / ${signT.negative} negative of ${signT.n}, p=${signT.pValue.toFixed(4)}`);
}

function renderMarkdown({ overall, tierAgg, byComponent, markerStats, runs }) {
  const lines = [];
  lines.push(`# A/B Experiment Results`);
  lines.push("");
  lines.push(`*Generated from \`${runs.length}\` scored runs. See \`PRE_REGISTRATION.md\` for methodology.*`);
  lines.push("");
  lines.push(`## Headline`);
  lines.push("");
  lines.push(`Across **${markerStats.length} markers × ${runs.length / 2} runs per condition × 2 conditions**, CLAUDE.md changed the fraction of pre-registered guidelines satisfied:`);
  lines.push("");
  lines.push(`- **Condition A (no CLAUDE.md):** ${formatCI(overall.pA, overall.ciA.lower, overall.ciA.upper)}`);
  lines.push(`- **Condition B (CLAUDE.md in system prompt):** ${formatCI(overall.pB, overall.ciB.lower, overall.ciB.upper)}`);
  lines.push(`- **Overall absolute delta (B − A):** ${fmtPct(overall.pB - overall.pA)}`);
  lines.push(`- **Mean marker-level delta (bootstrap 95% CI, 1000 resamples over markers):** ${fmtPct(overall.bootstrap.mean)} [${fmtPct(overall.bootstrap.lower)}, ${fmtPct(overall.bootstrap.upper)}]`);
  lines.push(`- **Sign test (null: median marker-level delta = 0):** ${overall.signTest.positive} positive / ${overall.signTest.negative} negative of ${overall.signTest.n} non-zero markers, two-sided p = ${overall.signTest.pValue.toFixed(4)}`);
  lines.push("");

  lines.push(`## By tier`);
  lines.push("");
  lines.push(`| Tier | Markers | A: k/n (p, 95% CI) | B: k/n (p, 95% CI) | Mean Δ | Bootstrap 95% CI | Sign test p |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- |`);
  for (const [tier, t] of Object.entries(tierAgg)) {
    if (t.markers === 0) continue;
    lines.push(
      `| ${tier} | ${t.markers} | ${t.kA}/${t.nA} (${formatCI(t.pA, t.ciA.lower, t.ciA.upper)}) | ${t.kB}/${t.nB} (${formatCI(t.pB, t.ciB.lower, t.ciB.upper)}) | ${fmtPct(t.meanDelta)} | [${fmtPct(t.bootstrap.lower)}, ${fmtPct(t.bootstrap.upper)}] | ${t.signTest.pValue.toFixed(4)} |`
    );
  }
  lines.push("");

  lines.push(`## By component`);
  lines.push("");
  lines.push(`| Component | Markers | A: k/n (%) | B: k/n (%) | Δ |`);
  lines.push(`| --- | --- | --- | --- | --- |`);
  for (const [comp, c] of Object.entries(byComponent)) {
    const pA = c.nA ? c.kA / c.nA : 0;
    const pB = c.nB ? c.kB / c.nB : 0;
    lines.push(`| ${comp} | ${c.markers} | ${c.kA}/${c.nA} (${fmtPct(pA)}) | ${c.kB}/${c.nB} (${fmtPct(pB)}) | ${fmtPct(pB - pA)} |`);
  }
  lines.push("");

  lines.push(`## Per-marker breakdown`);
  lines.push("");
  lines.push(`Markers with p ∈ [30%, 70%] in either condition are flagged as **noisy** (high variance at this sample size).`);
  lines.push("");
  lines.push(`| Component | Marker | Tier | A: p (95% CI) | B: p (95% CI) | Δ | Noisy |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- |`);
  const sorted = markerStats.slice().sort((a, b) => b.delta - a.delta);
  for (const m of sorted) {
    lines.push(
      `| ${m.component} | \`${m.id}\` | ${m.tier} | ${formatCI(m.pA, m.ciA.lower, m.ciA.upper)} | ${formatCI(m.pB, m.ciB.lower, m.ciB.upper)} | ${fmtPct(m.delta)} | ${m.highVariance ? "⚠︎" : ""} |`
    );
  }
  lines.push("");

  return lines.join("\n");
}

main();
