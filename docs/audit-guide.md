# Manual audit guide

A manual audit complements the automated eval (`eval/run.js`). The eval catches structure and style problems via substring matching. A manual audit catches what substring matching can't: whether every claim in the output traces back to a line in the source, whether evidence citations are accurate, and whether the reasoning in each guideline is strong enough to use in a design review.

## When to run

- After adding or updating evidence files — verify the output actually cites them correctly
- After a significant prompt change — check framing, structure, and output budget in practice
- Periodic spot-checks on component types the automated cases don't cover

## Running the audit script

The script generates a doc, extracts claims, runs style-rule scans, and writes an audit file to `evaluation/audits/`.

By component name (fetches live docs from shadcn/ui and Radix):

```
ANTHROPIC_API_KEY=sk-... node eval/audit.js dialog
ANTHROPIC_API_KEY=sk-... node eval/audit.js select
```

By example schema (uses a schema from `src/examples/index.js`):

```
ANTHROPIC_API_KEY=sk-... node eval/audit.js --example "Custom Button"
```

By schema file:

```
ANTHROPIC_API_KEY=sk-... node eval/audit.js --schema path/to/schema.json
```

## What the audit file contains

1. **The generated doc** — full model output, unedited.
2. **The source** — the fetched MDX or the schema JSON used as input.
3. **Part 1 — Source fidelity** — pre-extracted tables of every prop, ARIA attribute, keyboard key, and sub-component the doc mentions. Each row needs a verdict: does it trace to the source?
4. **Part 2 — Prompt conformance** — auto-scanned style rule results (em-dashes, "should," Latin abbreviations, etc.) and structural checks (sections present, alternative count, decision count). Some rows need hand-filled verdicts.

## What to check

The full rubric and its failure mode catalog are in `docs/rubric.md`. The areas substring matching can't cover:

**Source fidelity**

Read each claim row and find the matching line in the source. A claim with no match is a hallucination: an invented prop, a keyboard shortcut the component doesn't handle, or a sub-component name pulled from training data rather than the source.

When semantic evidence is present (dialog, select, tabs), the ARIA requirements and Keyboard interactions sections cite evidence IDs in the format:

```
Source: WAI-ARIA APG · `wai-aria-apg-dialog-role`
URL: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
```

For each citation, confirm the ID exists in `src/semantic/evidence/` and that the excerpt text matches what the live URL actually says.

When platform evidence is present (button, dialog, input), the Platform compliance checklist cites evidence IDs in the format:

```
Source: Apple HIG · `apple-hig-buttons-hierarchy`
URL: https://developer.apple.com/design/human-interface-guidelines/buttons
```

Spot-check one or two: confirm the ID is in `src/platform/evidence/`, the file has `reviewState: "current"`, and the excerpt matches the live source.

**Prompt conformance (beyond the auto-scans)**

- Every Do and Don't bullet carries a "why." A rule without a reason is a conformance failure.
- Do's and Don'ts, Editorial guidelines, Variants and patterns, and Common mistakes use default/override form when the schema or source provides a reason. Rules without an override condition are incomplete.
- Output budget respected per section. The caps are listed under "Output budget" in `src/prompt.js`.

## After the audit

Fill in the summary at the bottom of the audit file:

- **Source fidelity verdict** — pass or fail, with notes on any claim that didn't trace.
- **Prompt conformance verdict** — pass or fail, with notes on specific rule violations.
- **Other observations** — anything the automated eval would miss.

If the audit finds a hallucination or a wrong evidence citation, fix the evidence file or schema. If it finds a prompt conformance failure, check whether `eval/cases.js` already covers it. If not, add a case.
