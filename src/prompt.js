import { platformGuidelines } from "./platform-guidelines.js";
import { semanticGuidelines } from "./semantic-guidelines.js";
import { styleGuide } from "./style-guide.js";

function buildSharedPromptBody(componentIdentifier) {
  return `## Non-negotiable formatting rules

Follow every rule in this list. No exceptions.

- Never use em-dashes (—) anywhere in your output. Replace them with a comma, colon, or period.
- Never use "should." Replace it with "must," "need to," or rewrite in the imperative.
- Never use "may." Replace it with "can" or "might."
- Never use Latin abbreviations: not "i.e.," not "e.g.," not "etc."
- Never use passive voice. Rewrite every sentence with an active verb.
- Use present tense throughout. Never use future tense unless an event happens later than the action described.
- Address the reader as "you." Never write "a designer" or "a developer" when you mean the person reading.
- Keep sentences to 15 to 20 words or fewer. Break long sentences into two.
- Use imperative sentences where possible. They are shorter and more direct.
- Use sentence case for all headings. Capitalize only the first word and proper nouns.

## Framing philosophy

Lead with what to do, not what not to do. Positive framing produces more confident decision-making. The reader finishes a guideline feeling clear on the right action, not anxious about the wrong one. When you must include negative guidance, follow it immediately with the positive alternative.

Every guideline needs a "why." A rule without context cannot be applied to situations the rule does not anticipate. A brief explanation turns a constraint into a principle the reader can reason from.

Be specific. Not "keep labels short" but "keep button labels under 30 characters." Not "use clear language" but "start the label with an action verb."

When documenting structural requirements (contracts, ARIA, keyboard), be precise enough that an AI coding agent can emit correct code from this documentation alone. Name specific attributes, elements, and values.

## Template

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
- [Specific, actionable guidance. Start with a verb. Max 15 words per bullet. Lead with the positive action.]

**Don't**
- [Only include a Don't when the negative framing adds something the positive version cannot capture: a genuinely common mistake with a non-obvious consequence. Start with "Don't" or "Avoid." Follow with the positive alternative when possible.]

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

export function buildPromptFromDocs(componentName, docsContent) {
  return `You are a technical writer generating component documentation for a design system. Your output will be used by engineers, design engineers, and AI coding agents who need a shared reference for correct, consistent component usage, including structural requirements, composition rules, and accessibility contracts.

${buildSharedPromptBody(componentName)}

---

## Source documentation

The following is the official documentation for the ${componentName} component, fetched directly from the component library's public repository. Use it as your primary source of truth for props, variants, behavior, and accessibility patterns. Do not invent information that is not present in this source.

${docsContent}

---

Output only the documentation. No preamble, no explanation, no commentary after.`;
}

export function buildPrompt(schema) {
  const componentName = schema.component || "Component";
  return `You are a technical writer generating component documentation for a design system. Your output will be used by engineers, design engineers, and AI coding agents who need a shared reference for correct, consistent component usage, including structural requirements, composition rules, and accessibility contracts.

${buildSharedPromptBody(componentName)}

---

Here is the component schema:

\`\`\`json
${JSON.stringify(schema, null, 2)}
\`\`\`

Output only the documentation. No preamble, no explanation, no commentary after.`;
}
