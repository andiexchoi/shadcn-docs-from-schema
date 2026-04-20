"""Render three figures from results/aggregate.json:

1. figure_1_by_component.png — per-component A vs B bar chart
2. figure_2_by_tier.png — tier breakdown
3. figure_3_forest.png — per-marker delta forest plot with 95% Wilson CIs

Run: /tmp/figs-venv/bin/python3 eval/ab-experiment/figures.py
"""
import json
import os
import math
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

ROOT = Path(__file__).parent
AGG = ROOT / "results" / "aggregate.json"
FIG_DIR = ROOT / "results" / "figures"
FIG_DIR.mkdir(parents=True, exist_ok=True)

# Muted, print-safe palette. Blue for A (baseline), orange for B (CLAUDE.md).
COLOR_A = "#5b7ea1"
COLOR_B = "#d18a4e"
COLOR_DELTA_POS = "#4f7d5e"
COLOR_DELTA_NEG = "#a04a4a"
COLOR_MUTED = "#888888"
COLOR_AXIS = "#333333"

plt.rcParams.update({
    "font.family": "sans-serif",
    "font.size": 10,
    "axes.edgecolor": COLOR_AXIS,
    "axes.labelcolor": COLOR_AXIS,
    "xtick.color": COLOR_AXIS,
    "ytick.color": COLOR_AXIS,
    "axes.spines.top": False,
    "axes.spines.right": False,
})


def pct(x):
    return f"{x * 100:.1f}%"


def load():
    return json.loads(AGG.read_text())


def figure_by_component(agg):
    comps = list(agg["byComponent"].keys())
    # Sort by delta descending
    def delta(c):
        v = agg["byComponent"][c]
        return (v["kB"] / max(v["nB"], 1)) - (v["kA"] / max(v["nA"], 1))
    comps.sort(key=delta, reverse=True)

    pA = [agg["byComponent"][c]["kA"] / agg["byComponent"][c]["nA"] for c in comps]
    pB = [agg["byComponent"][c]["kB"] / agg["byComponent"][c]["nB"] for c in comps]

    y = np.arange(len(comps))
    height = 0.38

    fig, ax = plt.subplots(figsize=(9, 5.5))
    ax.barh(y + height / 2, pA, height, color=COLOR_A, label="No CLAUDE.md")
    ax.barh(y - height / 2, pB, height, color=COLOR_B, label="With CLAUDE.md")
    for i, c in enumerate(comps):
        ax.text(pA[i] + 0.005, y[i] + height / 2, pct(pA[i]), va="center", fontsize=8, color=COLOR_AXIS)
        ax.text(pB[i] + 0.005, y[i] - height / 2, pct(pB[i]), va="center", fontsize=8, color=COLOR_AXIS)
        d = pB[i] - pA[i]
        sign = "+" if d >= 0 else ""
        col = COLOR_DELTA_POS if d > 0 else (COLOR_DELTA_NEG if d < 0 else COLOR_MUTED)
        ax.text(1.22, y[i], f"Δ {sign}{d * 100:.1f}pp", va="center", fontsize=9, color=col, fontweight="bold")

    ax.set_yticks(y)
    ax.set_yticklabels(comps)
    ax.invert_yaxis()
    ax.set_xlabel("Proportion of markers satisfied")
    ax.set_xlim(0, 1.16)
    ax.set_xticks(np.arange(0, 1.01, 0.2))
    ax.set_xticklabels(["0%", "20%", "40%", "60%", "80%", "100%"])
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.08), ncol=2, frameon=False)
    ax.set_title("Guideline adherence by component", loc="left", fontweight="bold", pad=14)
    plt.subplots_adjust(left=0.13, right=0.82, top=0.91, bottom=0.18)

    out = FIG_DIR / "figure_1_by_component.png"
    fig.savefig(out, dpi=180)
    plt.close(fig)
    print(f"wrote {out}")


def figure_by_tier(agg):
    tiers = ["structural", "behavioral", "semantic"]
    labels = ["Structural\n(regex: primitive/prop presence)",
              "Behavioral\n(regex: prop wiring, anti-patterns)",
              "Semantic\n(LLM-as-judge: editorial/a11y)"]

    pA, pB, lowA, hiA, lowB, hiB, deltas, dLo, dHi = [], [], [], [], [], [], [], [], []
    for t in tiers:
        tdata = agg["byTier"][t]
        pA.append(tdata["pA"])
        pB.append(tdata["pB"])
        lowA.append(tdata["pA"] - tdata["ciA"]["lower"])
        hiA.append(tdata["ciA"]["upper"] - tdata["pA"])
        lowB.append(tdata["pB"] - tdata["ciB"]["lower"])
        hiB.append(tdata["ciB"]["upper"] - tdata["pB"])
        deltas.append(tdata["meanDelta"])
        dLo.append(tdata["meanDelta"] - tdata["bootstrap"]["lower"])
        dHi.append(tdata["bootstrap"]["upper"] - tdata["meanDelta"])

    y = np.arange(len(tiers))
    height = 0.35

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.5), gridspec_kw={"width_ratios": [1.5, 1]})

    # Left: A vs B per tier with CIs
    ax1.barh(y + height / 2, pA, height, color=COLOR_A, label="No CLAUDE.md",
             xerr=[lowA, hiA], error_kw={"elinewidth": 1.2, "capsize": 3, "ecolor": COLOR_AXIS})
    ax1.barh(y - height / 2, pB, height, color=COLOR_B, label="With CLAUDE.md",
             xerr=[lowB, hiB], error_kw={"elinewidth": 1.2, "capsize": 3, "ecolor": COLOR_AXIS})
    ax1.set_yticks(y)
    ax1.set_yticklabels(labels)
    ax1.invert_yaxis()
    ax1.set_xlabel("Proportion satisfied (95% Clopper-Pearson CI)")
    ax1.set_xlim(0, 1)
    ax1.set_xticks(np.arange(0, 1.01, 0.2))
    ax1.set_xticklabels(["0%", "20%", "40%", "60%", "80%", "100%"])
    ax1.legend(loc="upper center", bbox_to_anchor=(0.5, -0.18), ncol=2, frameon=False)
    ax1.set_title("By tier: baseline vs. CLAUDE.md", loc="left", fontweight="bold")

    # Right: mean marker-level delta with bootstrap CI
    colors = [COLOR_DELTA_POS if d > 0 else COLOR_DELTA_NEG for d in deltas]
    ax2.barh(y, deltas, height * 1.8, color=colors,
             xerr=[dLo, dHi], error_kw={"elinewidth": 1.2, "capsize": 3, "ecolor": COLOR_AXIS})
    ax2.set_yticks(y)
    ax2.set_yticklabels([""] * len(tiers))
    ax2.invert_yaxis()
    ax2.axvline(0, color=COLOR_MUTED, linewidth=0.8)
    ax2.set_xlabel("Mean marker-level delta\n(95% bootstrap CI, 1000 resamples)")
    max_d = max(abs(d) for d in deltas + dLo + dHi)
    ax2.set_xlim(-max_d * 1.55, max_d * 1.55)
    ticks = [-0.10, 0, 0.10, 0.20]
    ax2.set_xticks(ticks)
    ax2.set_xticklabels(["−10pp", "0", "+10pp", "+20pp"])
    for i, d in enumerate(deltas):
        sign = "+" if d >= 0 else ""
        ax2.text(d + (dHi[i] if d >= 0 else -dLo[i]) + max_d * 0.06, i,
                 f"{sign}{d * 100:.1f}pp", va="center", fontsize=9, color=COLOR_AXIS, fontweight="bold")
    ax2.set_title("Mean Δ per tier", loc="left", fontweight="bold")

    plt.tight_layout()
    out = FIG_DIR / "figure_2_by_tier.png"
    fig.savefig(out, dpi=180)
    plt.close(fig)
    print(f"wrote {out}")


def figure_forest(agg):
    markers = agg["markers"]
    # Drop markers that are at ceiling in both conditions (no room to move).
    # Those tell us nothing about CLAUDE.md's effect — they're components the
    # model already gets right unsolicited. Keeping them would waste vertical
    # space on flat lines.
    informative = [m for m in markers if not (m["pA"] == 1.0 and m["pB"] == 1.0 and m["delta"] == 0)]
    # Sort by delta. Put positive at top.
    markers = sorted(informative, key=lambda m: -m["delta"])

    # Compute per-marker delta CI using Wilson score interval on Newcombe
    # method for difference of two proportions.
    def wilson(p, n, alpha=0.05):
        if n == 0:
            return 0, 1
        z = 1.959963984540054  # 95%
        denom = 1 + z * z / n
        center = (p + z * z / (2 * n)) / denom
        half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denom
        return max(0, center - half), min(1, center + half)

    def newcombe(pA, nA, pB, nB):
        lA, uA = wilson(pA, nA)
        lB, uB = wilson(pB, nB)
        d = pB - pA
        lo = d - math.sqrt((pB - lB) ** 2 + (uA - pA) ** 2)
        hi = d + math.sqrt((uB - pB) ** 2 + (pA - lA) ** 2)
        return lo, hi

    y = np.arange(len(markers))
    deltas = [m["delta"] for m in markers]
    cis = [newcombe(m["pA"], m["nA"], m["pB"], m["nB"]) for m in markers]
    lo = [d - c[0] for d, c in zip(deltas, cis)]
    hi = [c[1] - d for d, c in zip(deltas, cis)]

    fig, ax = plt.subplots(figsize=(11, max(6, len(markers) * 0.28)))

    for i, m in enumerate(markers):
        color = COLOR_DELTA_POS if m["delta"] > 0 else (COLOR_DELTA_NEG if m["delta"] < 0 else COLOR_MUTED)
        ax.errorbar(m["delta"], i, xerr=[[lo[i]], [hi[i]]], fmt="o", color=color,
                    ecolor=color, elinewidth=1.2, capsize=2.5, markersize=4)
        label = f"{m['component']:>13}  {m['id']}"
        ax.text(-1.14, i, label, va="center", fontsize=8, color=COLOR_AXIS, family="monospace")
        tier_tag = {"structural": "S", "behavioral": "B", "semantic": "M"}[m["tier"]]
        ax.text(1.14, i, tier_tag, va="center", fontsize=8, color=COLOR_MUTED, family="monospace")
        sign = "+" if m["delta"] >= 0 else ""
        ax.text(1.22, i, f"{sign}{m['delta'] * 100:.0f}pp", va="center", fontsize=8, color=color, fontweight="bold")

    ax.axvline(0, color=COLOR_MUTED, linewidth=0.8)
    ax.set_yticks([])
    ax.set_xlim(-1.15, 1.28)
    ax.set_xticks(np.arange(-1, 1.01, 0.25))
    ax.set_xticklabels(["−100pp", "−75pp", "−50pp", "−25pp", "0", "+25pp", "+50pp", "+75pp", "+100pp"])
    ax.invert_yaxis()
    ax.set_xlabel("Condition B − Condition A (with 95% Newcombe CI)")
    ax.set_title(f"Per-marker forest plot. {len(markers)} informative markers, ceiling-only omitted.",
                 loc="left", fontweight="bold", pad=12)
    ax.set_ylim(len(markers) + 0.5, -0.5)

    plt.subplots_adjust(left=0.38, right=0.90, top=0.96, bottom=0.07)
    out = FIG_DIR / "figure_3_forest.png"
    fig.savefig(out, dpi=160)
    plt.close(fig)
    print(f"wrote {out}")


def figure_ablation(agg):
    """Three-way comparison: A / B (full CLAUDE.md) / B' (framing stripped)."""
    abl_path = ROOT / "results" / "ablation-report.md"
    scored_abl_path = ROOT / "results" / "scored-ablation-no-framing.json"
    if not abl_path.exists() or not scored_abl_path.exists():
        print("  ablation data not found, skipping figure")
        return

    abl = json.loads(scored_abl_path.read_text())
    # Aggregate B' per component
    bpByComp = {}
    for run in abl["runs"]:
        c = run["componentName"]
        if c not in bpByComp:
            bpByComp[c] = {"k": 0, "n": 0}
        for r in run["results"]:
            bpByComp[c]["n"] += 1
            if r["satisfied"]:
                bpByComp[c]["k"] += 1

    comps = list(agg["byComponent"].keys())
    # Sort by B − A descending
    def delta_main(c):
        v = agg["byComponent"][c]
        return (v["kB"] / max(v["nB"], 1)) - (v["kA"] / max(v["nA"], 1))
    comps.sort(key=delta_main, reverse=True)

    pA = [agg["byComponent"][c]["kA"] / agg["byComponent"][c]["nA"] for c in comps]
    pB = [agg["byComponent"][c]["kB"] / agg["byComponent"][c]["nB"] for c in comps]
    pBp = [bpByComp[c]["k"] / bpByComp[c]["n"] for c in comps]

    y = np.arange(len(comps))
    h = 0.27

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.barh(y + h, pA, h, color=COLOR_A, label="A: no CLAUDE.md")
    ax.barh(y, pB, h, color=COLOR_B, label="B: full CLAUDE.md")
    ax.barh(y - h, pBp, h, color="#8b6eb4", label="B': framing stripped")
    for i, c in enumerate(comps):
        ax.text(pA[i] + 0.005, y[i] + h, pct(pA[i]), va="center", fontsize=7.5, color=COLOR_AXIS)
        ax.text(pB[i] + 0.005, y[i], pct(pB[i]), va="center", fontsize=7.5, color=COLOR_AXIS)
        ax.text(pBp[i] + 0.005, y[i] - h, pct(pBp[i]), va="center", fontsize=7.5, color=COLOR_AXIS)

    ax.set_yticks(y)
    ax.set_yticklabels(comps)
    ax.invert_yaxis()
    ax.set_xlabel("Proportion of markers satisfied")
    ax.set_xlim(0, 1.1)
    ax.set_xticks(np.arange(0, 1.01, 0.2))
    ax.set_xticklabels(["0%", "20%", "40%", "60%", "80%", "100%"])
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.08), ncol=3, frameon=False)
    ax.set_title("Ablation: framing philosophy stripped from prompt.js", loc="left", fontweight="bold", pad=14)
    plt.subplots_adjust(left=0.14, right=0.96, top=0.92, bottom=0.16)

    out = FIG_DIR / "figure_4_ablation.png"
    fig.savefig(out, dpi=180)
    plt.close(fig)
    print(f"wrote {out}")


if __name__ == "__main__":
    agg = load()
    figure_by_component(agg)
    figure_by_tier(agg)
    figure_forest(agg)
    figure_ablation(agg)
    print("\ndone. figures in", FIG_DIR)
