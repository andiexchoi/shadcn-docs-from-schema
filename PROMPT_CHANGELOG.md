# Prompt changelog

Two entries: the original prompt I wrote at Amazon in 2025, and the current prompt in 2026.

---

## 2026 — Current prompt

**What it is.** A modular prompt assembled from four separable layers, each versioned independently:

- `src/prompt.js` — template structure, section omission rules, output budget, framing philosophy (default/override rule shape, quantitative thresholds, required alternatives and variants, reviewer-facing "Decisions to verify" checklist).
- `src/style-guide.js` — editorial rules for voice, tense, modal verbs, sentence economy, inclusive language.
- `src/platform-guidelines.js` — curated chunks of Apple HIG and Material Design by component type.
- `src/semantic-guidelines.js` — WCAG-derived accessibility rules (focus management, ARIA contracts, keyboard interactions, motion preferences).

**What it does differently than the 2025 version.**

- **Dual audience.** The output is written to serve engineers, designers, PMs, and AI coding agents reading the doc as a reference — not just mobile designers translating PRDs. Section structure, heading names, and omission rules are designed so the markdown can be deterministically parsed into compact YAML for agent context files (CLAUDE.md, AGENTS.md, llms.txt).
- **Modular references.** Platform and semantic guidelines are separate data files the prompt injects, not inline passages. The model draws from encoded references instead of recalling from training data. Each source is auditable and replaceable.
- **Decision-support framing.** The prompt requires a minimum of two named alternative components, a minimum of three named variants with trigger conditions, and a "Decisions to verify" checklist at the end of every doc. Rules in designated sections express as **default + override + reason** so that overriding a pattern becomes a visible decision, not silent drift.
- **Quantitative thresholds.** Editorial rules use concrete numbers ("no more than two primary actions," "one or two sentences") instead of vague adjectives ("keep it short").
- **Source flexibility.** The prompt accepts three input modes — JSON schema, TSX source, or live MDX fetched from a component library's GitHub — and produces the same downstream structure.

**How it was tested.** One component (Dialog), two generations: full prompt vs. external references only. Both scored 14/16 against an 8-criterion rubric. The comparison surfaced gaps in alternatives, variants, and reviewer checklists; five targeted prompt changes closed them. Revised prompt scored 16/16. See [`docs/rubric.md`](docs/rubric.md) and [`evaluation/dialog/`](evaluation/dialog/).

---

## 2025 — Amazon origin prompt

**What it was.** A single-file prompt I wrote while embedded with a mobile app team at Amazon that had no dedicated technical writer. The team produced components faster than documentation could keep up, and the upstream sources they were drawing from (Apple HIG, Material Design, internal style guide) were too scattered to reference in review. The prompt was my attempt to collapse the editorial work I was doing by hand into a first-draft generator.

**What it drew from.**

- **My team's internal style guide.** Voice, tense, modal verb rules, sentence economy — the rules I'd been enforcing in review were encoded directly into the prompt.
- **Apple Human Interface Guidelines.** The sections I'd been pulling from most often in reviews — touch target sizes, modal presentation, destructive action conventions.
- **Material Design.** Component conventions for the Android side of the app.
- **Team preferences.** The specific sections the mobile team wanted in every doc and the editorial conventions they'd already agreed on.

**What it did.** Given a JSON schema pasted in by hand, it produced a first-draft markdown doc with the sections the team had standardized on. It cut documentation time from roughly three hours per component to about thirty minutes — the remaining work was verification, edge cases, and anything the schema didn't capture.

**Limits.** One input mode (manually pasted schema). Audience was internal mobile design. No accessibility layer beyond what was in the style guide. No external reference injection — the model recalled HIG and Material content from training data rather than drawing from source text. Single-file, not modular.

I don't have the original artifact. The 2026 version is a rebuild from scratch for a different audience and a different set of constraints.
