# Design philosophy: why narrative documentation works better

*Originally written April 2025, proposing the transition from Do's and Don'ts lists to narrative format for Amazon Selling Partner Services mobile app component documentation. This document is the intellectual foundation for the template and prompt architecture in this tool.*

---

## The problem with Do's and Don'ts lists

The standard two-column Do's and Don'ts format is scannable but shallow. Related guidelines get fragmented across bullets with no context linking them. A designer reading the list knows *what* to do, but not *why*. Without the why, they can't make a good judgment call when the situation doesn't perfectly match the rule.

The format also has an accessibility problem: two-column layouts are harder to navigate for users on screen readers or keyboard-only navigation.

## Why framing matters

There is strong evidence from behavioral science that how we phrase information has a measurable impact on how people understand it, remember it, and act on it.

**Positive vs negative framing:** Tversky and Kahneman (1981) showed that identical outcomes are perceived differently based on whether they're framed as gains or losses. In documentation, leading with what to do, not what not to do, produces more confident decision-making. Kuvaas and Selart (2004) found that negative framing (warnings, "don't" messages) produced better recall but lower confidence, while positive framing produced slightly lower recall but significantly higher confidence. In documentation, confidence matters more than perfect retention.

**Context improves application:** Allen et al. (2022) show that when instructions are presented clearly, in context, and using actionable language, people follow through more successfully, especially when multitasking or under cognitive load. Designers using component documentation are usually doing all three.

**Language shapes behavior:** Flusberg et al. (2024) establish framing as fundamental to how people interpret meaning and decide what to do next. Small language choices, like focusing on what to do rather than what not to do, make a measurable difference in how effectively documentation supports real decision-making.

## The hybrid format

Pure narrative was proposed. Engineering pushed back: they wanted something scannable, maintainable in version control without restructuring paragraphs, and easy to update with a single bullet addition.

The compromise that worked: **Do's and Don'ts at the top for quick reference, followed by structured narrative sections** (Anatomy, Options, Placement, Editorial, Accessibility) that give designers the context they need. Each section uses bolded key points for scannability, with explanation following.

This serves both audiences: engineers can scan and maintain; designers get the reasoning they need to make confident decisions.

## What the template encodes

Every section exists for a reason:

- **When to use:** answers the first question a designer actually asks: is this the right component for my situation?
- **Do's and Don'ts:** preserved for scannability and quick reference; kept short and action-oriented
- **Anatomy:** names visible parts so designers and engineers share a vocabulary
- **Variants and options:** explains *when* to choose each option, not just what it looks like
- **Placement:** spatial rules that prevent common layout mistakes
- **Editorial guidelines:** specific character limits, capitalization rules, and punctuation, concrete enough to act on without follow-up questions
- **Accessibility:** practical, component-specific guidance tied to real keyboard and screen reader behavior, not abstract WCAG citations

## What this tool automates

The documentation process for each component was mechanical in places: read the JSON schema, identify properties and variants, write the same sections in the same order using the same conventions. That pattern was encodable.

The prompt translates this template into instructions an AI can follow, encoding the section structure, the framing philosophy (positive first, context always, specificity over generality), and the editorial standards. The output still requires human review. Engineers verify technical accuracy. Writers edit for voice and edge cases. But the starting point is dramatically better than a blank page, and the time cost of producing a first draft drops from hours to minutes.

---

## References

Allen, Richard J., Amanda H. Waterman, Tian-xiao Yang, and Agnieszka J. Jaroslawska. "Working Memory in Action: Remembering and Following Instructions." In *Memory in Science for Society*, edited by R. H. Logie et al. Oxford: Oxford University Press, 2022.

Flusberg, Stephen J., Kevin J. Holmes, Paul H. Thibodeau, Robin L. Nabi, and Teenie Matlock. "The Psychology of Framing: How Everyday Language Shapes the Way We Think, Feel, and Act." *Psychological Science in the Public Interest* 25, no. 3 (2024): 105-161.

Kuvaas, Bård, and Marcus Selart. "Effects of Attribute Framing on Cognitive Processing and Evaluation." *Organizational Behavior and Human Decision Processes* 95, no. 2 (2004): 198-207.

Tversky, Amos, and Daniel Kahneman. "The Framing of Decisions and the Psychology of Choice." *Science* 211, no. 4481 (1981): 453-58.
