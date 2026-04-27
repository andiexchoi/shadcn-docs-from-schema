# Prompt changelog

Two entries: the original prompt I wrote at Amazon in 2025, and the current prompt in 2026.

---

## 2026 — Current prompt

**What it is.** A modular prompt assembled from separable layers, each versioned independently:

- `src/prompt.js` — template structure, section omission rules, output budget, framing philosophy (default/override rule shape, quantitative thresholds, required alternatives and variants, reviewer-facing checklist).
- `src/style-guide.js` — editorial rules for voice, tense, modal verbs, sentence economy, inclusive language.
- `src/semantic-guidelines.js` — compound component composition rules and known AI agent failure patterns. Permanent curated knowledge, not spec-verifiable.
- `src/platform/` — human-reviewed excerpts from Apple HIG and Material Design, organized by component type. Injected as `<platform-evidence>` when reviewed evidence exists for a component; powers the Platform compliance checklist section only.
- `src/semantic/` — human-reviewed excerpts from WAI-ARIA APG and Radix UI docs. Injected as `<semantic-evidence>` when reviewed evidence exists; powers ARIA requirements, Keyboard interactions, and Accessibility sections with source citations.

**What it does differently than the 2025 version.**

- **Dual audience.** The output serves engineers, designers, PMs, and AI coding agents — not just mobile designers translating PRDs. Section structure, heading names, and omission rules are designed so the markdown can be deterministically parsed into compact YAML for agent context files (CLAUDE.md, AGENTS.md, llms.txt).
- **Evidence-backed citations.** Platform guidance and ARIA/keyboard requirements cite specific reviewed excerpts with source IDs and URLs, rather than recalling platform knowledge from training data. The generator omits a section rather than filling it with unverifiable claims when no reviewed evidence exists.
- **Decision-support framing.** The prompt requires a minimum of two named alternative components, a minimum of three named variants with trigger conditions, and a "Decisions to verify" checklist at the end of every doc. Rules in designated sections express as **default + override + reason** so overriding a pattern becomes a visible decision, not silent drift.
- **Quantitative thresholds.** Editorial rules use concrete numbers ("no more than two primary actions," "one or two sentences") instead of vague adjectives ("keep it short").
- **Source flexibility.** The prompt accepts three input modes — JSON schema, TSX source, or live MDX fetched from a component library's GitHub — and produces the same downstream structure.

**How it was tested.** One component (Dialog), two generations: full prompt vs. external references only. The comparison surfaced gaps in alternatives, variants, and reviewer checklists; five targeted prompt changes closed them. Ongoing verification uses the audit system in `eval/audit.js` against the rubric in [`docs/rubric.md`](docs/rubric.md).

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
