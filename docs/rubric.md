# Rubric for scoring Dialog documentation

A prior standard, committed to before generating either version. Each criterion is scored 0, 1, or 2 against the generated doc. Comments cite specific lines.

**Scoring key**
- **0** — absent, wrong, or actively misleading
- **1** — present but generic, incomplete, or not actionable
- **2** — specific, correct, and usable for a decision

---

## 1. Decision support
Does the doc help a reader defend a choice, not just describe behavior? A good doc tells you *what you are deciding against* — so if someone overrides the pattern, the override is visible and arguable.

- 0: pure description, no normative guidance
- 1: says what's "recommended" but gives no reasoning a reader could use in an argument
- 2: each guideline carries a "why" that a designer, engineer, or PM could cite when defending or overriding the choice

## 2. Accessibility coverage
Does the doc name the load-bearing a11y behaviors for this component? For Dialog specifically: focus trap on open, focus return on close, Escape-to-dismiss, `role="dialog"` or `role="alertdialog"`, `aria-labelledby`, `aria-describedby`, motion-reduce for animations, scrim/overlay behavior with screen readers.

- 0: a11y not mentioned, or only a generic "make it accessible"
- 1: some attributes named but key behaviors missing (e.g., names ARIA but not focus trap)
- 2: covers focus management, keyboard, ARIA attributes with specific values, and motion sensitivity

## 3. Contract specificity
Are the structural requirements precise enough that an AI coding agent could emit correct code from the doc alone? Named attributes, named elements, named values, named sub-components, composition rules.

- 0: vague ("wrap content appropriately")
- 1: names components but not the nesting rules or required props
- 2: names every required sub-component, its nesting, and the props that are structurally required even if TypeScript lets you omit them

## 4. Failure modes named
Does the doc tell you when *not* to use Dialog, and what breaks when you misuse it? Common pitfalls. When to choose a sheet, a drawer, a popover, an inline form instead.

- 0: no failure modes mentioned
- 1: lists alternatives without saying when each applies
- 2: names specific misuses (e.g., nested dialogs, dialogs for non-blocking UI, using dialog for confirmation when a toast would do) and the consequence of each

## 5. Editorial guidelines for in-component text
For Dialog: title length/phrasing, whether titles are questions or statements, confirm-button labels ("Delete" vs "OK"), destructive-action conventions, description text length.

- 0: no guidance on text inside the component
- 1: mentions text exists, no specific rules
- 2: specific, actionable rules (char limits, required verbs, destructive-action phrasing) with reasoning

## 6. PM-legibility
Could a non-engineer read this and identify what decisions are being made and why? Not "can a PM implement it" — "can a PM use this doc to participate in a design review."

- 0: reads as pure engineering reference; a PM would bounce off
- 1: structure is legible but reasoning is buried in implementation detail
- 2: a PM reading this could say "we are deciding X against Y because Z" for any guideline in the doc

## 7. Canonical pattern vs variant boundaries
Does the doc distinguish between the canonical Dialog pattern and its variants (alert dialog, confirmation, form dialog, fullscreen modal)? Can a reader tell which is the default and when to depart from it?

- 0: treats all variants equally, no default named
- 1: names variants but not when to choose each
- 2: names the canonical default, names each variant's trigger condition, and explains when a custom pattern is warranted

## 8. Signal density
Is the doc tight? Every sentence earning its place? No filler, no restatement, no "a dialog is a UI element that..."

- 0: significant filler, restatement, or generic prose
- 1: mostly tight, some sections padded
- 2: every sentence carries weight; cuttable content has been cut

---

## Synthesis questions (after scoring)

After scoring both versions across all 8 criteria, answer these:

1. Which criteria did the editorial layer actually move? Where do V1 and V2 diverge most?
2. Where did the editorial layer add *nothing*? (Be honest — this is the finding the piece is organized around.)
3. Is there a criterion where V1 (external refs only) scored *higher* than V2? If so, why — is the editorial layer getting in the way?
4. If you had to defend V2 over V1 to a skeptical senior designer, what's the one thing you'd point at?
5. If V1 and V2 score roughly the same, what does that tell you about what your editorial judgment is actually doing?

---

## Total score

| Criterion | V1 (external refs only) | V2 (full pipeline) |
|---|---|---|
| 1. Decision support | | |
| 2. Accessibility coverage | | |
| 3. Contract specificity | | |
| 4. Failure modes named | | |
| 5. Editorial guidelines | | |
| 6. PM-legibility | | |
| 7. Canonical vs variants | | |
| 8. Signal density | | |
| **Total (out of 16)** | | |

---

## Known limitations of this rubric

This rubric is a considered artifact, not a measurement tool. It reflects what I think a cross-functional decision-support component doc should do, based on watching teams argue at Amazon and Snowflake. A different writer would make a different rubric. These limitations are named here so any use of the rubric is read with the right posture.

### Definitional weaknesses (surfaced by internal re-read)

1. **Criterion 4 conflates two things.** "Failure modes named" mixes "when not to use this component" (pick an alternative instead) with "common implementation pitfalls" (what breaks if you misuse it). These are different. A doc can cover one and miss the other. When scoring, treat the primary measure as alternative-component guidance; common mistakes bleed into Criterion 3 (Contract specificity).

2. **Criterion 6 is subjective without a concrete test.** "Could a PM read this and participate in a design review" depends on the PM. A tighter operational definition: score 2 if at least one section uses prose or a plain-language checklist a non-engineer can skim (Anatomy as prose, Decisions-to-verify as questions). Score 1 if everything is code, tables, or ARIA-speak.

3. **Criterion 8 is felt, not measured.** "Every sentence earns its place" is aesthetic judgment. A concrete proxy: score 2 if no section visibly exceeds its output-budget cap; score 1 if one or more sections sprawl past their cap.

4. **Criteria 1 and 5 can double-count.** An editorial rule with a "why" satisfies both Decision support (Criterion 1) and Editorial guidelines (Criterion 5). When scoring, Criterion 1 should weight structural decision support (contracts labeled default/override, alternatives named, decisions-to-verify checklist) and leave the editorial whys to Criterion 5.

### Scope gap (surfaced by Amazon-pattern mapping)

The rubric doesn't directly measure **capacity / cuttability signaling**. The Amazon pattern that motivated this tool was engineering pushing back on design proposals under capacity pressure. An ideal decision-support doc would help a team reason about effort — which rules are structural contracts (cannot be cut), which are editorial preferences (can be deferred to v2), which variants require what implementation effort. Criterion 3 (Contract specificity) covers part of this by labeling contracts as non-negotiable, but the rubric doesn't frame the rest of the doc as explicitly deferrable. This is a known limitation for the audience the tool is built for and a future-revision candidate.

### Overlap with published design-system doc philosophies

Six of the eight criteria map to conventions documented by Polaris, Material, Apple HIG, Fluent, and Lightning:

| Criterion | Matching convention |
|---|---|
| 1. Decision support | Polaris Best Practices, Fluent correct usage, Lightning Guidelines |
| 2. Accessibility coverage | WCAG required by all five |
| 3. Contract specificity | Lightning component blueprints, Fluent I/O parameters, Material tokens |
| 5. Editorial guidelines | Polaris Content guidelines, Lightning voice/tone |
| 7. Canonical vs variants | Fluent state variations |
| 8. Signal density | Clarity principle in Polaris, HIG, Lightning |

Four criteria or rule-shapes are novel to this rubric and come from the cross-functional argument pattern, not from any published system: **PM-legibility (Criterion 6), default/override rule shape, reviewer-facing checklist (Decisions to verify section), and quantitative thresholds**. Treat the overlap as evidence the rubric isn't idiosyncratic; treat the divergences as where the rubric is doing original work, targeted at a cross-functional audience the published systems don't design for.
