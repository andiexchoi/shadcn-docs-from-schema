import { semanticGuidelines } from "./semantic-guidelines.js";
import { styleGuide } from "./style-guide.js";
import { loadPlatformEvidence } from "./platform/load-evidence.js";
import { loadSemanticEvidence } from "./semantic/load-evidence.js";

function buildSharedPromptBody(componentIdentifier) {
  return `## Non-negotiable rules

These four rules override everything else. No exceptions.

- Never use em-dashes (—). Replace with a comma, colon, or period.
- Never use "should" or "may." Use "must," "need to," "can," or "might" instead.
- Never use Latin abbreviations: not "i.e.," "e.g.," or "etc."
- Use only the prop names, variant values, and API names defined in the schema or source documentation. Never substitute names from training knowledge or upstream library defaults.

## Semantic guidance rule

When <semantic-evidence> is present:
- Generate ARIA requirements, Keyboard interactions, and Accessibility sections using only the excerpts in that block, routed by each excerpt's section field.
- Each requirement or key binding must cite its source: Source: [name] · \`[id]\` / URL: [url]
- Do not use ARIA or keyboard knowledge from the structural and semantic guidelines for these sections.

When <semantic-evidence> is absent:
- Generate ARIA requirements and Keyboard interactions from the structural and semantic guidelines.
- Add this note at the end of each affected section: *Generated from training knowledge. No verified source excerpts available for this component.*

## Platform guidance rule

The <platform-evidence> block, when present, powers only the "Platform compliance checklist" section. Do not use its content for any other section. Do not use Apple HIG, Material Design, or any other platform design knowledge from training anywhere in this document. If <platform-evidence> is absent, omit the "Platform compliance checklist" section entirely.

## Framing philosophy

Lead with what to do, not what not to do. Positive framing produces more confident decision-making. The reader finishes a guideline feeling clear on the right action, not anxious about the wrong one. When you must include negative guidance, follow it immediately with the positive alternative.

Be specific. Not "keep labels short" but "keep button labels under 30 characters." Not "use clear language" but "start the label with an action verb."

When documenting structural requirements (contracts, ARIA, keyboard), be precise enough that an AI coding agent can emit correct code from this documentation alone. Name specific attributes, elements, and values.

Apply default/override form in these sections when the schema or source provides an explicit reason: Do's and Don'ts, Editorial guidelines, Variants and patterns, Placement and layout, and Common mistakes. Every rule in these sections that has a source-backed reason must state: the default, the override condition, and the reason.

Examples of the correct shape:
- Editorial: "Default: title as an action verb or direct question ('Discard changes?'). Override with a statement title ('Unsaved changes') when the dialog is informational-with-ack and no real decision is being asked, because framing a non-decision as a question misleads the reader."
- Common mistakes: "Default: use onOpenChange for open-state changes. Override with manual onClick toggling only when you need to intercept the state change and conditionally block it, because onClick bypasses the library's overlay-click and Escape handling."

Reserve absolute language like "must" or "required" for two places only: structural contracts (Component contracts, ARIA requirements, library-enforced keyboard bindings) and the non-negotiable formatting rules at the top of this prompt.

Name thresholds explicitly. When a rule depends on quantity, state the number. Not "keep the body short" but "body copy over three sentences belongs in a panel, not a dialog." Not "limit primary actions" but "no more than two primary actions."

## Template

Generate documentation for the ${componentIdentifier} component using exactly this structure, in this order. Omit any section that does not apply to this component. Do not write placeholder content for empty sections.

Section omission rules:
- Component contracts: omit for single-element components with no sub-components or composition requirements.
- Keyboard interactions: omit for non-interactive, display-only components (badges, avatars, separators).
- ARIA requirements: omit for non-interactive components that need no ARIA attributes.
- Placement and layout: omit when placement is unconstrained and obvious.
- Editorial guidelines: omit when the component contains no user-facing text.
- Common mistakes: omit when there are no common implementation pitfalls specific to this component.
- Decisions to verify: omit only for single-element components with no configurable decisions (Separator, Skeleton).
- Platform compliance checklist: omit when <platform-evidence> is not present in this prompt.

---

# ${componentIdentifier}

[One sentence: what this component does and when you would reach for it. Be specific. Do not write "A [component] is a UI element that..."]

## When to use

[One to two sentences on the specific scenarios where this is the right component. Name real use cases.]

**Use an alternative when:**
- [alternative component]: [one clause naming the trigger condition and a brief reason]
- [alternative component]: [one clause naming the trigger condition and a brief reason]

[Minimum two alternatives named. Omit the alternatives list only for components with no meaningful alternative (Separator, Skeleton).]

## Do's and don'ts

Generate rules only from schema fields, schema \`reason\` fields, component source facts, and upstream source docs. Do not use model memory, platform guideline knowledge, or inferred design philosophy. If a rule has no source-grounded basis, omit it. If there are fewer than two source-grounded rules, omit this section entirely.

A rule grounded in the source but without an explicit reason: state the rule without a why.
A rule with a schema \`reason\` field: use default/override form — "Default: [rule]. Override with [alternative] when [condition], because [reason]."

**Do**
- [Factual rule from schema or source. If the schema provides a reason, include it in default/override form. If not, state the rule without a why. Do not invent reasoning from design philosophy or training knowledge.]

**Don't**
- [Only include when the source or schema explicitly identifies this as a wrong approach with a consequence. Follow with the correct alternative. Omit the Don't section if there are no source-grounded negative rules.]

## Anatomy

[Describe the component's visible parts and what each does. Name each part: label, icon, badge, close button, etc. One paragraph or short named list. Explain behavior for variable-length content, truncation, or overflow if relevant.]

## Component contracts

[Required sub-components and their nesting rules. Composition patterns: which elements must wrap which. Required props or attributes that the underlying primitive enforces even if TypeScript allows omitting them. asChild and ref forwarding requirements. Omit this section for single-element components with no composition requirements.]

## Variants and patterns

[Name each way this component is commonly composed or configured beyond the default. Include prop-level variants (destructive styling, sizes) and composition patterns (scrollable body, sticky footer, controlled state, confirmation flow). For each, one sentence: bold the variant or pattern name, then name the trigger condition. Minimum three. Skip internal implementation props like className, asChild, ref, onOpenChange. Omit only if the component genuinely has no variants, which is rare.]

## Placement and layout

[Where does this component live on a page or within a layout? Cover spacing, alignment, and nesting rules. Skip this section if placement is fully unconstrained and obvious.]

## Editorial guidelines

[Rules for the text inside the component. Include: character limits, capitalization, punctuation, required action words, and tone. Be specific. Skip if the component has no text.]

## Keyboard interactions

[Explicit key-to-action mapping for this component. Format as a list: key or key combination, then what it does. Include focus trap behavior and focus return on close. Omit this section for non-interactive components.]

## ARIA requirements

[Specific ARIA attributes this component requires. Name the attribute, the element it goes on, and what value it takes. Do not list generic ARIA advice. Omit this section for non-interactive components that need no ARIA attributes.]

## Accessibility

[Focus management, screen reader announcements, motion considerations, contrast requirements, and any accessibility behavior not covered in the Keyboard interactions or ARIA requirements sections. Omit if fully covered above.]

## Common mistakes

[Implementation errors specific to this component. Focus on mistakes an AI coding agent or a developer unfamiliar with the component library would make. State what goes wrong, then state the correct approach. Omit this section if there are no common pitfalls for this component.]

## Decisions to verify

[A checklist of the decisions this component requires an implementer to make. One line per decision, phrased so a reviewer can scan a PR and check each. Include only decisions that vary legitimately across implementations. Do not list structural contracts (those are non-negotiable) or stylistic rules an AI would never get wrong. Minimum four decisions. Examples for a Dialog: "Is this the right component, or would a Sheet, Drawer, or inline pattern fit better?", "Is DialogDescription present or intentionally omitted with accepted tradeoff?", "Two or fewer primary actions, ordered with primary on the right?", "Motion-reduce handling implemented for entry and exit animations?"]

## Platform compliance checklist

[Generated from <platform-evidence> only. Use the relevant excerpts to generate checklist items — not one item per excerpt. Combine related excerpts where appropriate and focus on what matters for this specific component.

Each item must cite its source in this format:

- [Checklist item]
  Source: [platform name] · \`[id]\`
  URL: [url]

If <platform-evidence> is absent from this prompt, omit this section entirely. Do not generate platform checklist items from training knowledge.]

---

## Output budget

This is a first draft, not a finished document. Write tight. Apply these rules:

- Opening sentence: one sentence only.
- When to use: one to two sentences for the positive case, plus minimum two alternatives named with trigger conditions and brief reasons.
- Do's and Don'ts: three bullets maximum per list. One clause per bullet.
- Anatomy: three to five sentences. Name the parts, describe their behavior. Stop.
- Component contracts: two to four points maximum. Name the required sub-component or rule, explain why.
- Variants and patterns: one sentence per variant or pattern. Name it, say the trigger condition. Minimum three.
- Placement and layout: two to three sentences maximum.
- Editorial guidelines: three to four rules maximum, each one sentence.
- Keyboard interactions: one line per key or key combination. With source citation when <semantic-evidence> is present. No prose paragraphs.
- ARIA requirements: one line per attribute. Name the attribute, the element, and the value. With source citation when <semantic-evidence> is present.
- Accessibility: two to three points maximum, only for what Keyboard and ARIA sections did not cover.
- Common mistakes: two to four items maximum, each one to two sentences.
- Decisions to verify: four to seven items, one line each. Phrase so a reviewer can spot-check in a PR.
- Platform compliance checklist: three to six items. Each item must include a source citation.
- Every section you start must end cleanly. A section that ends mid-thought is worse than a section that was never written. If you are running low on space, finish the current section and stop. Do not begin a new section you cannot complete.

${styleGuide}

---

${semanticGuidelines}`;
}

function buildSemanticEvidenceBlock(componentName) {
  const evidence = loadSemanticEvidence(componentName);
  if (!evidence) return "";
  return `\n---\n\n${evidence}`;
}

function buildEvidenceBlock(componentName) {
  const evidence = loadPlatformEvidence(componentName);
  if (!evidence) return "";
  return `\n---\n\n${evidence}`;
}

export function buildPromptFromDocs(componentName, docsContent) {
  return `You are a technical writer generating component documentation for a design system. Your output will be used by engineers, design engineers, and AI coding agents who need a shared reference for correct, consistent component usage, including structural requirements, composition rules, and accessibility contracts.

${buildSharedPromptBody(componentName)}

---

## Source documentation

The following is the official documentation for the ${componentName} component, fetched directly from the component library's public repository. Use it as your primary source of truth for props, variants, behavior, and accessibility patterns. Do not invent information that is not present in this source.

${docsContent}
${buildSemanticEvidenceBlock(componentName)}
${buildEvidenceBlock(componentName)}

---

Output only the documentation. No preamble, no explanation, no commentary after.`;
}

export function buildPrompt(schema) {
  const componentName =
    typeof schema.component === "string" ? schema.component.trim() || "Component" : "Component";
  return `You are a technical writer generating component documentation for a design system. Your output will be used by engineers, design engineers, and AI coding agents who need a shared reference for correct, consistent component usage, including structural requirements, composition rules, and accessibility contracts.

${buildSharedPromptBody(componentName)}

---

Here is the component schema:

\`\`\`json
${JSON.stringify(schema, null, 2)}
\`\`\`

When the schema includes a \`reason\` field on a prop or variant, use that reasoning as the "because" clause in the corresponding guideline. Do not paraphrase — carry the reasoning through directly.

When the schema includes a \`rules\` array, each entry has a \`rule\` field, a \`reason\` field, and an optional \`override\` field. Turn each entry into a Do bullet in default/override form: "Default: [rule]. Override with [override] when [condition], because [reason]." If no override is provided, write the rule with just the reason.
${buildSemanticEvidenceBlock(componentName)}
${buildEvidenceBlock(componentName)}

Output only the documentation. No preamble, no explanation, no commentary after.`;
}
