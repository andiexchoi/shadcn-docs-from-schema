# Design philosophy: from narrative documentation to machine-native context

*Originally written April 2025 for Amazon Selling Partner Services. Updated April 2026 to cover the compact format and the shift from human-first translation to dual-audience component governance.*

---

## Part one: the editorial foundation

### The problem with Do's and Don'ts lists

The standard two-column Do's and Don'ts format is scannable but shallow. Related guidelines get fragmented across bullets with no context linking them. A designer reading the list knows *what* to do, but not *why*. Without the why, they can't make a good judgment call when the situation doesn't perfectly match the rule.

The format also has an accessibility problem: two-column layouts are harder to navigate for users on screen readers or keyboard-only navigation.

### Why framing matters

There is strong evidence from behavioral science that how we phrase information has a measurable impact on how people understand it, remember it, and act on it.

**Positive vs negative framing:** Tversky and Kahneman (1981) showed that identical outcomes are perceived differently based on whether they're framed as gains or losses. In documentation, leading with what to do, not what not to do, produces more confident decision-making. Kuvaas and Selart (2004) found that negative framing (warnings, "don't" messages) produced better recall but lower confidence, while positive framing produced slightly lower recall but significantly higher confidence. In documentation, confidence matters more than perfect retention.

**Context improves application:** Allen et al. (2022) show that when instructions are presented clearly, in context, and using actionable language, people follow through more successfully, especially when multitasking or under cognitive load. Designers using component documentation are usually doing all three.

**Language shapes behavior:** Flusberg et al. (2024) establish framing as fundamental to how people interpret meaning and decide what to do next. Small language choices, like focusing on what to do rather than what not to do, make a measurable difference in how effectively documentation supports real decision-making.

### The hybrid format

Pure narrative was proposed. Engineering pushed back: they wanted something scannable, maintainable in version control without restructuring paragraphs, and easy to update with a single bullet addition.

The compromise that worked: Do's and Don'ts at the top for quick reference, followed by structured sections that give the reasoning behind each guideline. Each section uses bolded key points for scannability, with explanation following.

This serves both audiences: engineers can scan and maintain; designers get the reasoning they need to make confident decisions.

### What the template encodes

Every section exists for a reason:

- **When to use:** answers the first question a reader actually asks: is this the right component for my situation?
- **Do's and Don'ts:** preserved for scannability and quick reference; kept short and action-oriented
- **Anatomy:** names visible parts so everyone shares a vocabulary
- **Component contracts:** required sub-components, composition rules, and nesting patterns that break accessibility or functionality when violated
- **Variants and options:** explains *when* to choose each option, not just what it looks like
- **Placement:** spatial rules that prevent common layout mistakes
- **Editorial guidelines:** specific character limits, capitalization rules, and punctuation, concrete enough to act on without follow-up questions
- **Keyboard interactions:** explicit key-to-action mappings for interactive components
- **ARIA requirements:** specific attributes, elements, and values, precise enough that a coding agent can emit correct markup
- **Accessibility:** focus management, screen reader behavior, and motion considerations not covered by the keyboard and ARIA sections
- **Common mistakes:** implementation errors specific to the component, targeted at patterns AI coding agents get wrong

---

## Part two: the compact format as a second representation

### The audience expanded

The original template served humans reading documentation on a screen. The v5 reframe added a second audience: AI coding agents consuming component docs as context. The README documents why this matters: 34% of AI-generated shadcn components had API errors without structured docs as context (0xminds, 2026). The shadcn/ui issue tracker shows the same accessibility failure pattern across four separate bug reports.

Both audiences need the same information. They need it in different containers.

### What the compact format preserves

The compact YAML output is not a summary or a degraded version. It contains every section the markdown contains. The editorial decisions that differentiate this tool's output, always include the "why," lead with positive framing, be specific rather than general, name concrete values rather than abstract guidance, carry through unchanged.

What the compact format strips is the *presentation layer*: markdown heading syntax, bold markers, blank lines between sections, the visual hierarchy designed for a human scanning a rendered page. An AI agent parsing component docs for context doesn't need `## Keyboard interactions` as a rendered heading. It needs `keyboard:` as a parseable key.

### Why structure matters more than token count

The compact format reduces character count by roughly 3-5% compared to the markdown. This is modest. The original hypothesis, that YAML would save 30-50% over markdown, holds for API specifications with deep structural nesting (OpenAPI), not for prose documentation where content dominates format overhead.

The real value is structural:

- **Consistent keys.** Every component's compact output uses the same key names in the same order. An agent can extract `keyboard:` or `aria:` without parsing markdown headings.
- **Predictable schema.** Sections that don't apply to a component are absent, not empty. An agent checking whether a component has keyboard interactions checks for the key's existence.
- **No formatting noise.** No bold markers, heading prefixes, or blank lines that a model must parse through to reach the content.
- **Array extraction.** Bullet lists become YAML arrays. An agent can iterate over `do:` items or `mistakes:` items without parsing markdown list syntax.

### The editorial philosophy in both formats

The same rules govern both outputs because both are generated from the same prompt:

| Rule | Why it matters for humans | Why it matters for agents |
|:---|:---|:---|
| Every guideline includes a "why" | Enables judgment calls beyond the literal rule | Provides the context an agent needs to apply the guideline to situations the rule doesn't anticipate |
| Positive framing first | Produces more confident decision-making | Reduces ambiguity in the instruction; "do X" is a clearer signal than "don't do Y" |
| Specific over general | "Under 30 characters" is actionable; "keep it short" isn't | Concrete values can be validated programmatically; vague guidance can't |
| One sentence per variant | Forces precision; prevents explanations from drifting | Keeps each array item self-contained; no multi-paragraph entries to parse |
| Section omission rules | Avoids placeholder content that wastes attention | Avoids empty keys that waste tokens and introduce false signals |

The format changes. The philosophy doesn't.

---

## References

Allen, Richard J., Amanda H. Waterman, Tian-xiao Yang, and Agnieszka J. Jaroslawska. "Working Memory in Action: Remembering and Following Instructions." In *Memory in Science for Society*, edited by R. H. Logie et al. Oxford: Oxford University Press, 2022.

Flusberg, Stephen J., Kevin J. Holmes, Paul H. Thibodeau, Robin L. Nabi, and Teenie Matlock. "The Psychology of Framing: How Everyday Language Shapes the Way We Think, Feel, and Act." *Psychological Science in the Public Interest* 25, no. 3 (2024): 105-161.

Kuvaas, Bard, and Marcus Selart. "Effects of Attribute Framing on Cognitive Processing and Evaluation." *Organizational Behavior and Human Decision Processes* 95, no. 2 (2004): 198-207.

Tversky, Amos, and Daniel Kahneman. "The Framing of Decisions and the Psychology of Choice." *Science* 211, no. 4481 (1981): 453-58.
