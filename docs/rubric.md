# Rubric for evaluating the documentation tool

Two parts. The audit is what I check against external ground truth. The reader's guide is what you bring to the doc for your own team.

The audit checks whether the system did what it promised. The reader's guide is where "good for our team" gets evaluated, and only your team can do that evaluation.

---

## Part 1 — System audit

Two checks with external ground truth. These are the checks I run against generated output.

### 1. Source fidelity

Every factual claim in the generated doc traces back to a line in the source.

**Sources:** raw MDX from shadcn/ui, Radix UI, or Base UI repos (fetched at generation time); a pasted JSON schema; or a TSX/JSX source file.

**Failure modes this catches:**
- Hallucinated props (a `loading` prop the component doesn't have)
- Invented keyboard shortcuts (Escape closing a component that doesn't listen for it)
- Fabricated ARIA attributes (recommending `aria-pressed` on a non-toggle)
- Wrong sub-component names (`DialogClose` vs `Dialog.Close`)
- Renamed values reverting to upstream (calling a fork's `critical` variant `destructive` because the model recalled it from training data)
- Do's and Don'ts rules sourced from model training knowledge rather than schema or source docs

**How I audit:** read each claim, find the matching line in the source. Anything that doesn't trace is a hallucination, a generalization the source doesn't support, or a guess pulled from training data.

### 1b. Platform evidence fidelity

Every item in the "Platform compliance checklist" traces to a reviewed evidence excerpt in `src/platform/evidence/`.

**Failure modes this catches:**
- Platform checklist items generated from training knowledge rather than injected evidence
- Evidence IDs cited in the output that don't exist in the evidence files
- Platform guidance appearing when `reviewState` is not `current`

**How I audit:** for each platform checklist item, confirm the cited `evidence id` exists in the matching evidence file and that the file has `reviewState: "current"`. Follow the canonical URL to verify the evidence excerpt reflects what the live source actually says.

### 2. Prompt conformance

The output obeys every rule in `src/prompt.js` and `src/style-guide.js`.

**Rules this covers:**
- Section structure: required sections present, omitted sections absent (Badge is non-interactive, so no Keyboard interactions section)
- Framing: positive guidance before negative (Do before Don't)
- Output budget: per-section sentence and bullet limits
- Style: no em-dashes, no passive voice, no Latin abbreviations, no `should`/`may`, no "Click here"
- Editorial: every guideline carries a "why"

**Failure modes this catches:**
- Drift between what the prompt asks for and what the model produces
- Style regressions introduced by a prompt change
- Section omission rules misapplied (Component contracts on a single-element component)

**How I audit:** read the output against the prompt files. Note each rule the output violates. Some of this is already automated in `eval/cases.js` via substring matching. The audit is the higher-level pass that catches what substring matching can't: subtle passive voice, weak whys, sentences that nominally fit the budget but pad.

---

## Part 2 — Reader's guide

Four questions to hold while reading the output for your own team. Not scored, because scoring them honestly would require knowing your team, your PM, your design system maturity, and your tolerance for editorial versus structural guidance. The questions do real work. Numbers attached to them would not.

### Decision support

Does each guideline carry a "why" you could cite while defending or overriding the choice in a design review? Pure description ("the close button appears in the top-right") leaves you nothing to argue. Reasoning you can quote ("close in the top-right keeps the dismiss target reachable on small screens") gives you something to point at.

### Editorial guidelines for in-component text

Does the doc give you specific, actionable rules for the text inside the component (title length, confirm-button verbs, destructive-action phrasing) with reasoning? Generic copy advice gets ignored. Specific rules with whys earn their place in a review.

### PM-legibility

Could a non-engineer on your team read this and identify what decisions are being made and why? A concrete test: skim the doc for any section in plain prose or a checklist a PM could read without translation. If everything is code, tables, or ARIA-speak, the answer is no, and your design reviews will run with one less voice.

### Canonical pattern vs variant boundaries

Does the doc name the canonical default and tell you when to depart from it? "Use the standard Dialog unless X, Y, or Z, in which case use Sheet, Drawer, or inline form." Without a named default, every variant looks equally valid, which is how teams end up with three different overlay patterns in the same product.

---

## Known limitations

This is a considered artifact, not a measurement instrument. Naming the limitations so any use is read with the right posture.

### Why the reader's-guide questions aren't scored

Decision support, editorial guidelines, PM-legibility, and canonical-vs-variants are real qualities of a good design system doc. None of them have external ground truth. A score on any of them would be reading attention dressed up as a number. Leaving them as questions does two things: it keeps the rubric from overclaiming, and it enrolls the user in the same reading I'd do.

### Why the audit doesn't measure "is this a good doc"

Source fidelity and prompt conformance check whether the system did what it promised. Neither tells you the resulting doc is good for your team. Useful, accurate, and on-spec is a precondition for good, not the same thing as good.

### Scope gap: capacity and cuttability signaling

The Amazon pattern that motivated this tool was engineering pushing back on design proposals under capacity pressure. An ideal decision-support doc helps a team reason about effort: which rules are structural contracts (cannot be cut), which are editorial preferences (can be deferred to v2), which variants require what implementation effort. Prompt conformance covers part of this by labeling contracts as non-negotiable in the template, but the rest of the doc isn't framed as explicitly deferrable. Open question for a future version.

### Where this overlaps with established design system docs

Several questions in this rubric map to conventions documented by Polaris, Material, Apple HIG, Fluent, and Lightning:

| This rubric | Matching convention |
|---|---|
| Decision support | Polaris Best Practices, Fluent correct usage, Lightning Guidelines |
| Editorial guidelines | Polaris Content guidelines, Lightning voice/tone |
| Canonical vs variants | Fluent state variations |

The overlap is evidence the underlying questions aren't idiosyncratic. Source fidelity has no direct equivalent in those systems, because they own their components and don't face the AI-fork problem this tool addresses. PM-legibility, the default/override rule shape, and the audit framing itself come from the cross-functional argument pattern this tool is built for, which the published systems don't design for.
