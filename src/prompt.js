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

Apply default/override form in these sections: Do's and Don'ts, Editorial guidelines, Variants and patterns, Placement and layout, and Common mistakes. These sections cover preferences and conventions where edge cases legitimately call for something else. Every rule in these sections must state: the default, the override condition, and the reason the rule exists so a reviewer can judge whether the override applies.

Examples of the correct shape:
- Editorial: "Default: title as an action verb or direct question ('Discard changes?'). Override with a statement title ('Unsaved changes') when the dialog is informational-with-ack and no real decision is being asked, because framing a non-decision as a question misleads the reader."
- Common mistakes: "Default: use onOpenChange for open-state changes. Override with manual onClick toggling only when you need to intercept the state change and conditionally block it, because onClick bypasses the library's overlay-click and Escape handling."

Reserve absolute language like "must" or "required" for two places only: structural contracts (Component contracts, ARIA requirements, library-enforced keyboard bindings) and the non-negotiable formatting rules at the top of this prompt. If a rule in Do's and Don'ts, Editorial guidelines, Variants, Placement, or Common mistakes reads as absolute, rewrite it in default/override form before emitting.

Name thresholds explicitly. When a rule depends on quantity, state the number. Not "keep the body short" but "body copy over three sentences belongs in a panel, not a dialog." Not "limit primary actions" but "no more than two primary actions." Teams argue about numbers they have not agreed on. Naming the number makes the argument resolvable.

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

**Do**
- [Specific, actionable guidance. Start with a verb. Max 15 words per bullet. Lead with the positive action.]

**Don't**
- [Only include a Don't when the negative framing adds something the positive version cannot capture: a genuinely common mistake with a non-obvious consequence. Start with "Don't" or "Avoid." Follow with the positive alternative when possible.]

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
- Keyboard interactions: one line per key or key combination. No prose paragraphs.
- ARIA requirements: one line per attribute. Name the attribute, the element, and the value.
- Accessibility: two to three points maximum, only for what Keyboard and ARIA sections did not cover.
- Common mistakes: two to four items maximum, each one to two sentences.
- Decisions to verify: four to seven items, one line each. Phrase so a reviewer can spot-check in a PR.
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

export function buildRawRefsPrompt(componentName, docsContent) {
  return `You are generating component documentation for ${componentName}. The audience is engineers, design engineers, and AI coding agents.

## Source documentation

${docsContent}

---

${platformGuidelines}

---

${semanticGuidelines}

---

Using the source documentation and the platform and semantic guidelines above, write documentation for ${componentName}. Output only the documentation.`;
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
