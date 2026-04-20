// Ablation: prompt.js with the "Non-negotiable formatting rules" and
// "Framing philosophy" sections removed. Everything else (Template, Output
// budget, style guide, platform guidelines, semantic guidelines) stays.
//
// This isolates whether the opening framing + formatting rules are doing
// real work or just ceremonial throat-clearing. If the ablated prompt
// produces CLAUDE.md files with a similar downstream effect on model
// output, those two sections are deadweight. If the effect shrinks, they
// matter.

import { platformGuidelines } from "../../../src/platform-guidelines.js";
import { semanticGuidelines } from "../../../src/semantic-guidelines.js";
import { styleGuide } from "../../../src/style-guide.js";

function buildSharedPromptBodyNoFraming(componentIdentifier) {
  return `## Template

Generate documentation for the ${componentIdentifier} component using exactly this structure, in this order. Omit any section that does not apply to this component. Do not write placeholder content for empty sections.

Section omission rules:
- Component contracts: omit for single-element components with no sub-components or composition requirements.
- Keyboard interactions: omit for non-interactive, display-only components (badges, avatars, separators).
- ARIA requirements: omit for non-interactive components that need no ARIA attributes.
- Placement and layout: omit when placement is unconstrained and obvious.
- Editorial guidelines: omit when the component contains no user-facing text.
- Common mistakes: omit when there are no common implementation pitfalls specific to this component.

---

# ${componentIdentifier}

[One sentence: what this component does and when you would reach for it. Be specific. Do not write "A [component] is a UI element that..."]

## When to use

[2 to 4 sentences on the specific scenarios where this is the right component. Name real use cases. If there is a meaningfully different alternative you might confuse this with, note when to choose each.]

## Do's and don'ts

**Do**
- [Specific, actionable guidance. Start with a verb. Max 15 words per bullet.]

**Don't**
- [Only include a Don't when the negative framing adds something the positive version cannot capture: a genuinely common mistake with a non-obvious consequence. Start with "Don't" or "Avoid."]

## Anatomy

[Describe the component's visible parts and what each does. Name each part: label, icon, badge, close button, etc. One paragraph or short named list. Explain behavior for variable-length content, truncation, or overflow if relevant.]

## Component contracts

[Required sub-components and their nesting rules. Composition patterns: which elements must wrap which. Required props or attributes that the underlying primitive enforces even if TypeScript allows omitting them. asChild and ref forwarding requirements. Omit this section for single-element components with no composition requirements.]

## Variants and options

[For each prop that changes the component's appearance or behavior, explain what it is for and when you would choose it, not just what it looks like. Skip internal implementation props like className, asChild, ref, onOpenChange. Bold the variant name, then explain in 1 to 3 sentences.]

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

---

## Output budget

This is a first draft, not a finished document. Write tight. Apply these rules:

- Opening sentence: one sentence only.
- When to use: two sentences maximum.
- Do's and Don'ts: three bullets maximum per list. One clause per bullet.
- Anatomy: three to five sentences. Name the parts, describe their behavior. Stop.
- Component contracts: two to four points maximum. Name the required sub-component or rule, explain why.
- Variants and options: one sentence per variant. Name it, say when to use it. Nothing more.
- Placement and layout: two to three sentences maximum.
- Editorial guidelines: three to four rules maximum, each one sentence.
- Keyboard interactions: one line per key or key combination. No prose paragraphs.
- ARIA requirements: one line per attribute. Name the attribute, the element, and the value.
- Accessibility: two to three points maximum, only for what Keyboard and ARIA sections did not cover.
- Common mistakes: two to four items maximum, each one to two sentences.
- Every section you start must end cleanly. A section that ends mid-thought is worse than a section that was never written. If you are running low on space, finish the current section and stop. Do not begin a new section you cannot complete.

${styleGuide}

---

${platformGuidelines}

---

${semanticGuidelines}`;
}

export function buildPromptFromDocsNoFraming(componentName, docsContent) {
  return `You are a technical writer generating component documentation for a design system. Your output will be used by engineers, design engineers, and AI coding agents who need a shared reference for correct, consistent component usage, including structural requirements, composition rules, and accessibility contracts.

${buildSharedPromptBodyNoFraming(componentName)}

---

## Source documentation

The following is the official documentation for the ${componentName} component, fetched directly from the component library's public repository. Use it as your primary source of truth for props, variants, behavior, and accessibility patterns. Do not invent information that is not present in this source.

${docsContent}

---

Output only the documentation. No preamble, no explanation, no commentary after.`;
}
