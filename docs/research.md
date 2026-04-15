# Research: sources and citations

Last updated: April 2026

This document backs the three core claims in the case study and README. Sources are organized by claim, verified for accuracy, and flagged where limitations exist.

---

## Thesis (3 → 1 → 2)

1. **Documentation as context for AI agents.** AI coding tools generate wrong code when they lack structured documentation of the actual component system.
2. **Shadow design system.** Teams mutate shadcn/ui the moment they adopt it. The official docs become partially wrong. The actual system is undocumented.
3. **Hidden accessibility specs.** Radix handles accessibility by default, but when AI tools or multiple engineers generate UI independently, they skip the semantic sub-components that make it work.

---

## Claim 1: Documentation as context for AI agents

### Birgitta Bockeler, "Context Engineering for Coding Agents"
- **URL:** https://martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html
- **Publication:** Martin Fowler's site
- **Date:** February 5, 2026
- **Key quote:** "Context engineering is curating what the model sees so that you get a better result." (attributed to colleague Bharani Subramaniam)
- **Relevance:** Full primer on CLAUDE.md, .cursorrules, MCP servers as context mechanisms for coding agents. Fowler called context engineering "a huge part of the developer experience of modern LLM tools."

### Andrew Ng, "Crowdsourced Context for Coding Agents"
- **URL:** https://www.deeplearning.ai/the-batch/crowdsourced-context-for-coding-agents/
- **Publication:** DeepLearning.AI / The Batch
- **Date:** March 6, 2026
- **Key quote:** "Agentic coding systems often make mistakes because they're not aware of tools, API calls, and the like that came out after they were trained."
- **Relevance:** Describes Context Hub (chub), an open-source tool for giving coding agents up-to-date documentation. Ng's example: even Claude Opus defaults to wrong APIs without current docs.

### 0xminds, "shadcn/skills Setup: Stop AI Hallucinations"
- **URL:** https://0xminds.com/blog/guides/shadcn-skills-setup-ai-agent-prompts-guide
- **Publication:** 0xminds (Fardino Team)
- **Date:** March 13, 2026
- **Key data:** Tested across 50 prompts. Without structured docs: 34% of components had API errors. With docs: 3%. Correct variants: 61% → 98%. First-try success: 45% → 89%.
- **Key quote:** "AI tools lack accurate knowledge of component libraries. When asked to build shadcn components, they generate fabricated APIs by mixing memory fragments from multiple UI libraries."

### shadcn/ui official Skills documentation
- **URL:** https://ui.shadcn.com/docs/skills
- **Publication:** shadcn/ui (official)
- **Relevance:** shadcn built Skills specifically because AI assistants struggle to generate correct shadcn/ui code without project context. Also publishes llms.txt (https://ui.shadcn.com/llms.txt) for AI consumption. The docs describe a registry as "a distribution specification designed to pass context from your design system to AI Models."

### Steve Sewell, "Improve your AI code output with AGENTS.md"
- **URL:** https://www.builder.io/blog/agents-md
- **Publication:** Builder.io
- **Date:** September 9, 2025
- **Key quote:** "AGENTS.md is a small markdown file at the root of your repo that tells AI tools how your project works."
- **Relevance:** Documents the emerging cross-tool pattern. After adding structured guidance: "UI is more accurate, tokens and dark mode are correct, and the code is cleaner." Adopted by n8n (178K stars), awesome-go (167K stars), llama.cpp (97K stars), Bun (82K stars).

### Surge AI, "When Coding Agents Spiral Into 693 Lines of Hallucinations"
- **URL:** https://surgehq.ai/blog/when-coding-agents-spiral-into-693-lines-of-hallucinations
- **Author:** Logan Ritchie
- **Date:** February 2026
- **Key finding:** Gemini 2.5 Pro invented a nonexistent `BaseWriter` parent class when file contents were truncated. Conjured phantom methods like `_get_col_str_iters()`. "Claude and GPT-5 succeeded partly by re-inspecting code when encountering discrepancies."
- **Relevance:** Demonstrates that models fill context gaps with training-data guesses. Structured documentation closes those gaps.

### Anthropic, "2026 Agentic Coding Trends Report"
- **URL:** https://resources.anthropic.com/2026-agentic-coding-trends-report
- **Publication:** Anthropic
- **Date:** 2026
- **Key finding:** Engineers use AI in roughly 60% of their work but can fully delegate only 0-20% of tasks. The shift is from writing code to orchestrating agents. Case studies from Rakuten, CRED, TELUS, Zapier.
- **Note:** Gated PDF. Landing page verified, specific stats may require download.

### DigitalOcean, "Best Practices for Context Management when Generating Code with AI Agents"
- **URL:** https://docs.digitalocean.com/products/gradient-ai-platform/concepts/context-management/
- **Publication:** DigitalOcean (official docs)
- **Key quote:** "Insufficient context may cause AI agents to hallucinate, increasing the likelihood of low quality responses with nonexistent APIs and packages, incorrect configurations, or generic boilerplate code."
- **Relevance:** Recommends llms.txt files to reduce hallucinations. States they "prevent AI from inventing non-existent APIs or features."

---

## Claim 2: Shadow design system (documentation rot)

### shadcn/ui homepage positioning
- **URL:** https://ui.shadcn.com/
- **Key quote:** "This is NOT a component library. It's a collection of re-usable components that you can copy and paste into your apps."
- **Relevance:** The architecture assumes mutation. Every team that adopts shadcn/ui will have divergent component code. The official docs describe the upstream library, not what the team actually shipped.

### Sparkbox Design Systems Survey (2022)
- **URL:** https://designsystemssurvey.sparkbox.com/2022/
- **Publication:** Sparkbox
- **Date:** 2022
- **Respondents:** 219 (183 creators/maintainers, 37 subscribers)
- **Key stats (subscriber challenges, select all that apply, 31 respondents):**
  - 39% said "It's documented poorly"
  - 35% said "It's unclear what is old, broken, or coming soon"
  - 19% said "It's out of date"
- **Subscriber quote:** "There are a lot of repeating design patterns that are not documented, as well as plenty of one-off patterns that are not documented either. It is hard to decide whether to use an existing pattern or not because the system lacks a documented thought process behind higher-level patterns and templates."

### Brad Frost, Atomic Design Chapter 5 ("Maintaining Design Systems")
- **URL:** https://atomicdesign.bradfrost.com/chapter-5/
- **Date:** 2016
- **Key quotes:**
  - "Once the pattern library ceases to reflect the current state of the products it serves, it becomes obsolete."
  - "If it's difficult and time-consuming to update patterns, documentation, and applications, people will eventually get so frustrated that they stop making the effort."
  - "The biggest existential threat to any system is neglect." (attributed to Alex Schleifer, Airbnb)

### Nathan Curtis, "Documenting Components"
- **URL:** https://medium.com/eightshapes-llc/documenting-components-9fe59b80c015
- **Publication:** EightShapes on Medium
- **Date:** March 20, 2018
- **Key quotes:**
  - "Good doc isn't free. It takes planning, effort, and process to make examples and guidelines that make a difference."
  - "Effective design reference can be very costly, skimped to achieve only basics, or skipped altogether."

### shadcn/ui GitHub Discussion #6699
- **URL:** https://github.com/shadcn-ui/ui/discussions/6699
- **Date:** February 20, 2025
- **Original poster:** sabadomi (designer)
- **Key quotes:**
  - "I'm struggling a bit about how shadcnui is structured and how (as a designer) i can adopt it and use it for my company's design system."
  - "Using shadcnui is a real struggle for us, designers, cause it can change everything in our working flow."
  - Developer haus23 responding: "Shadcn-ui is for you not relevant... you would have to rewrite every component."

### Aghajani et al., "Software Documentation Issues Unveiled"
- **Publication:** ICSE 2019 (International Conference on Software Engineering)
- **Key finding:** Analyzed Stack Overflow and GitHub data. Documentation-code inconsistency identified as a top documentation problem in software engineering.

### IEEE, "A Review on Detecting and Managing Documentation Drift"
- **URL:** https://ieeexplore.ieee.org/document/11196773/
- **Date:** 2023
- **Relevance:** Literature review establishing "documentation drift" as a recognized phenomenon in software engineering research.
- **Note:** Full text behind IEEE paywall.

### Helge Sverre, "Agentic Drift"
- **URL:** https://dev.to/helgesverre/agentic-drift-its-hard-to-be-multiple-developers-at-once-4872
- **Publication:** DEV Community
- **Date:** March 2, 2025
- **Key quote:** "The gradual, invisible divergence that happens when parallel autonomous agents work on related parts of a codebase without coordination."
- **Concrete example:** Three agents independently implemented dynamic model discovery three different ways. Code compiled and tests passed, but the merged result contained semantic conflicts.

### Market validation (supplemental)
- **Zeroheight:** $10M Series A (2022, led by Tribe Capital). Design system documentation platform. Pitch: "Keep your design system documentation in sync with design and code."
- **Supernova:** $4.2M seed (2021). Design system documentation and management.
- **Knapsack:** VC-funded design system platform.
- Three companies raised $15M+ specifically to solve "design system documentation is out of sync with code."

---

## Claim 3: Hidden accessibility specs

### DevUnionX, "5 Things AI Can't Do, Even in ShadcnUI"
- **URL:** https://dev.to/devunionx/5-things-ai-cant-do-even-inshadcnui-6k0
- **Publication:** DEV Community
- **Date:** March 2026
- **Key quotes:**
  - "AI mostly doesn't automatically add important parts like DialogTrigger or SheetDescription or wraps wrong elements."
  - Console warnings: `DialogContent requires a DialogTitle for the component to be accessible for screen reader users.`
  - "Elements like SheetDescription that seem unnecessary are actually for accessibility. AI generally skips these."

### shadcn/ui GitHub Issue #4302
- **URL:** https://github.com/shadcn-ui/ui/issues/4302
- **Filed by:** stefandevo
- **Date:** July 16, 2024
- **Error:** Sheet component generates accessibility warnings about missing `DialogTitle` and `aria-describedby`. Foundational bug that AI tools reproduce when generating Sheet components without SheetTitle/SheetDescription.

### shadcn/ui GitHub Issues #5474, #5746, #6284
- **URLs:** https://github.com/shadcn-ui/ui/issues/5474, https://github.com/shadcn-ui/ui/issues/5746, https://github.com/shadcn-ui/ui/issues/6284
- **Dates:** October 2024, November 2024, January 2025
- **Pattern:** Three separate issues, all the same accessibility error: missing SheetTitle/SheetDescription in mobile sidebar implementations. Same bug recurring independently across different reporters.

### Radix UI Issue #2986
- **URL:** https://github.com/radix-ui/primitives/issues/2986
- **Date:** July 1, 2024
- **Relevance:** DialogTitle became mandatory in DialogContent after an update, breaking abstraction patterns. This is the upstream Radix enforcement that AI tools fail to account for.

### Radix UI Issue #3007
- **URL:** https://github.com/radix-ui/primitives/issues/3007
- **Relevance:** When DialogDescription is absent, Radix generates a dangling `aria-describedby` pointing to a non-existent ID. Broken ARIA reference inherited silently by AI-generated code.

### TypeUI / Creative Tim, "The Design Layer for AI Coding Agents"
- **URL:** https://blogct.creative-tim.com/blog/ai-agent/typeui-the-design-layer-for-ai-coding-agents/
- **Author:** Zoltan Szogyenyi
- **Date:** April 9, 2026
- **Key quote:** "The first component looks great, the second one drifts, and by the third prompt your buttons have different padding, your fonts have changed."
- **Relevance:** Developers "spending more time fixing design inconsistencies than actually shipping." TypeUI encodes "an entire design system in a format that AI agents can read and follow."

### Addy Osmani, "AI-Driven Prototyping: v0, Bolt, and Lovable Compared"
- **URL:** https://addyo.substack.com/p/ai-driven-prototyping-v0-bolt-and
- **Publication:** Substack
- **Date:** January 11, 2025
- **Key quotes:**
  - "I asked AI to fix one bug and it introduced two others."
  - References "the 70% problem" where AI gets you most of the way but complex patterns break.
  - On v0: "Component generation can be inconsistent with complex UI patterns."

### Easton, "shadcn/ui and Radix: How to Maintain Accessibility When Customizing Components"
- **URL:** https://eastondev.com/blog/en/posts/dev/20260330-shadcn-radix-accessibility/
- **Date:** March 30, 2026
- **Key finding:** Wrapping `<div>` around Tooltip.Trigger breaks keyboard navigation. Radix warning: "if you were to switch it to a div, it would no longer be accessible."
- **Relevance:** Documents the exact customization patterns that AI tools get wrong.

---

## Claim 4: Design quality degrades without a shared reference

### OverlayQA, "Bolt, Lovable & Figma Make: ~160 Bugs Per App"
- **URL:** https://overlayqa.com/blog/ai-app-builders-visual-bugs/
- **Publication:** OverlayQA Blog
- **Date:** 2025
- **Key data:**
  - Average of ~160 issues per AI-generated app
  - Most common categories: layout and spacing errors, incorrect CSS values, missing design token usage
  - AI-generated code introduces 1.7x more visual issues than human-written code
  - Lovable produces cleaner component structure but struggles with responsive edge cases; Bolt generates more complete features but with higher CSS specificity conflicts and hardcoded values; Figma Make produces layout-faithful output at the reference viewport but breaks at other sizes and consistently ignores interaction states
- **Key quote:** "AI app builders optimize for functional correctness. They do not optimize for visual fidelity."

### Nielsen Norman Group, "AI Design Tools Are Marginally Better: Status Update"
- **URL:** https://www.nngroup.com/articles/ai-design-tools-update-2/
- **Author:** Megan Brown (NN/g research team)
- **Date:** May 2025
- **Key quotes:**
  - "As of May 2025, AI design tools' usefulness has improved, but we're still nowhere near the AI-powered design tools we've been promised"
  - Figma's First Draft produced "generic" output with "poor information and visual hierarchy, even for a wireframe"
  - "Currently, only a human designer can balance the design, business, and user needs that go into a great visual design"

### Nielsen Norman Group, "State of UX 2026: Design Deeper to Differentiate"
- **URL:** https://www.nngroup.com/articles/state-of-ux-2026/
- **Publication:** Nielsen Norman Group
- **Date:** February 2026
- **Key quotes:**
  - "UI is cheaper to produce due to standardization" but "UI will gradually become less of a differentiator"
  - "Visual output alone has stopped being a differentiator"
  - "Standardization can reduce differentiation among digital products and stifle UX innovation"

### Anna Arteeva, "Design Systems for the Vibe-Coding Era"
- **URL:** https://www.designsystemscollective.com/design-systems-for-the-vibe-coding-era-42282e1affef
- **Author:** Anna Arteeva (former Head of Product Design, Payoneer)
- **Date:** 2025
- **Publication:** Design Systems Collective (Medium)
- **Key quote:** "AI tools tend to be biased toward the frameworks and styles they were trained on. If your system deviates from those defaults, extra work is needed to teach the AI your design tokens, components, and patterns, or coding agents will fall back to infamous AI slop."

### DOC, "Why AI Is Exposing Design's Craft Crisis"
- **URL:** https://www.doc.cc/articles/craft-crisis
- **Author:** DOC (Dolphia)
- **Date:** 2025
- **Publication:** doc.cc / UX Collective
- **Key quotes:**
  - "AI didn't create the craft crisis. It exposed the technical literacy gap that's been eroding strategic influence for over a decade."
  - UXPin research cited within: "62% of developers spend significant time redoing designs due to communication breakdowns"
  - When Figma Sites produced 210 WCAG violations, it showed that "accessibility knowledge wasn't widespread enough to catch obviously broken output"

### GitClear, "AI Copilot Code Quality 2025"
- **URL:** https://www.gitclear.com/ai_assistant_code_quality_2025_research
- **Publication:** GitClear
- **Date:** February 2025
- **Key data (211 million changed lines of code, 2020-2024, repos owned by Google, Microsoft, Meta):**
  - Refactored code dropped from 24.1% of changes in 2020 to 9.5% in 2024 (60% decline)
  - Copy-pasted code rose from 8.3% to 12.3%; 2024 was the first year copy-paste surpassed refactoring
  - Eightfold increase in duplicated code blocks (5+ duplicated lines) compared to two years prior
  - 7.9% of newly added code was revised within two weeks (up from 5.5% in 2020)
- **Relevance:** Patterns (duplication over modularity, declining refactoring) map directly to UI code: inline styles instead of tokens, duplicated component variants instead of reuse, hardcoded values instead of design system references.

---

## Sources that were dropped

- **Google DORA 2025 "9% bug rate increase":** Landing page exists but the specific stat isn't verifiable from the public URL. May be in the gated PDF.
- **AFFiNE blog "Best Data Flow Diagram Maker 2026":** SEO marketing post. Not credible.
- **Cherryleaf "5 Reasons Why the Future...":** Consultancy opinion piece. Not research.
- **Flow BDD / Bit-Smart.io "Zero Drift":** Niche methodology branding, not established terminology.
- **NN/g "Design Systems 101" (Fessenden, 2021):** Exists and is verified but lacks depth on documentation specifically. Usable as a supporting cite, not a primary one.

## Sources that don't exist

- No survey with "X% of teams customize their component libraries" (shadcn's own positioning is the best proxy)
- No direct Vercel/shadcn team quote saying "AI tools struggle with our components" (their investments in Skills, MCP, llms.txt say it implicitly)
- No Kent C. Dodds or Ryan Florence writing on this intersection
- No peer-reviewed study specifically measuring whether structured component docs reduce AI hallucination rates (the 0xminds 50-prompt test is the closest)

---

## Works cited (MLA 9th edition)

### Claim 1: Documentation as context for AI agents

Bockeler, Birgitta. "Context Engineering for Coding Agents." *MartinFowler.com*, 5 Feb. 2026, martinfowler.com/articles/exploring-gen-ai/context-engineering-coding-agents.html.

Ng, Andrew. "Crowdsourced Context for Coding Agents." *The Batch*, DeepLearning.AI, 6 Mar. 2026, www.deeplearning.ai/the-batch/crowdsourced-context-for-coding-agents/.

Fardino Team. "shadcn/skills Setup: Stop AI Hallucinations." *0xminds*, 13 Mar. 2026, 0xminds.com/blog/guides/shadcn-skills-setup-ai-agent-prompts-guide.

"Skills." *shadcn/ui*, ui.shadcn.com/docs/skills. Accessed 14 Apr. 2026.

Sewell, Steve. "Improve Your AI Code Output with AGENTS.md." *Builder.io Blog*, 9 Sept. 2025, www.builder.io/blog/agents-md.

Ritchie, Logan. "When Coding Agents Spiral Into 693 Lines of Hallucinations." *Surge AI Blog*, Feb. 2026, surgehq.ai/blog/when-coding-agents-spiral-into-693-lines-of-hallucinations.

*2026 Agentic Coding Trends Report*. Anthropic, 2026, resources.anthropic.com/2026-agentic-coding-trends-report.

"Best Practices for Context Management When Generating Code with AI Agents." *DigitalOcean Documentation*, docs.digitalocean.com/products/gradient-ai-platform/concepts/context-management/. Accessed 14 Apr. 2026.

### Claim 2: Shadow design system (documentation rot)

"Introduction." *shadcn/ui*, ui.shadcn.com/. Accessed 14 Apr. 2026.

*Design Systems Survey 2022*. Sparkbox, 2022, designsystemssurvey.sparkbox.com/2022/.

Frost, Brad. "Maintaining Design Systems." *Atomic Design*, atomicdesign.bradfrost.com/chapter-5/. Accessed 14 Apr. 2026.

Curtis, Nathan. "Documenting Components." *EightShapes*, Medium, 20 Mar. 2018, medium.com/eightshapes-llc/documenting-components-9fe59b80c015.

sabadomi. "How to Use Shadcn as Design System for the Whole Team." *GitHub Discussions*, shadcn-ui/ui, 20 Feb. 2025, github.com/shadcn-ui/ui/discussions/6699.

Aghajani, Emad, et al. "Software Documentation Issues Unveiled." *Proceedings of the 41st International Conference on Software Engineering*, IEEE/ACM, 2019.

"A Review on Detecting and Managing Documentation Drift in Software Development." *IEEE Xplore*, 2023, ieeexplore.ieee.org/document/11196773/.

Sverre, Helge. "Agentic Drift: It's Hard to Be Multiple Developers at Once." *DEV Community*, 2 Mar. 2025, dev.to/helgesverre/agentic-drift-its-hard-to-be-multiple-developers-at-once-4872.

### Claim 3: Hidden accessibility specs

DevUnionX. "5 Things AI Can't Do, Even in ShadcnUI." *DEV Community*, Mar. 2026, dev.to/devunionx/5-things-ai-cant-do-even-inshadcnui-6k0.

stefandevo. "[bug]: Sheet Error for Screen Reader Users." *GitHub Issues*, shadcn-ui/ui, no. 4302, 16 July 2024, github.com/shadcn-ui/ui/issues/4302.

bearbricknik. "[bug]: SheetTitle Error on Sidebar." *GitHub Issues*, shadcn-ui/ui, no. 5474, 20 Oct. 2024, github.com/shadcn-ui/ui/issues/5474.

acomanescu. "[bug]: Sidebar on Mobile Requires a DialogTitle." *GitHub Issues*, shadcn-ui/ui, no. 5746, 6 Nov. 2024, github.com/shadcn-ui/ui/issues/5746.

Arunbalaji07. "[bug]: Sidebar Issue in Mobile View." *GitHub Issues*, shadcn-ui/ui, no. 6284, 6 Jan. 2025, github.com/shadcn-ui/ui/issues/6284.

Zerebokep. "Dialog Abstraction Throws DialogContent Requires a DialogTitle Since Last Update." *GitHub Issues*, radix-ui/primitives, no. 2986, 1 July 2024, github.com/radix-ui/primitives/issues/2986.

Szogyenyi, Zoltan. "TypeUI: The Design Layer for AI Coding Agents." *Creative Tim Blog*, 9 Apr. 2026, blogct.creative-tim.com/blog/ai-agent/typeui-the-design-layer-for-ai-coding-agents/.

Osmani, Addy. "AI-Driven Prototyping: v0, Bolt, and Lovable Compared." *Substack*, 11 Jan. 2025, addyo.substack.com/p/ai-driven-prototyping-v0-bolt-and.

Easton. "shadcn/ui and Radix: How to Maintain Accessibility When Customizing Components." *BetterLink Blog*, 30 Mar. 2026, eastondev.com/blog/en/posts/dev/20260330-shadcn-radix-accessibility/.

### Claim 4: Design quality degradation

"AI App Builders: ~160 Bugs Per App." *OverlayQA Blog*, 2025, overlayqa.com/blog/ai-app-builders-visual-bugs/.

Brown, Megan. "AI Design Tools Are Marginally Better: Status Update." *Nielsen Norman Group*, May 2025, www.nngroup.com/articles/ai-design-tools-update-2/.

"State of UX 2026: Design Deeper to Differentiate." *Nielsen Norman Group*, Feb. 2026, www.nngroup.com/articles/state-of-ux-2026/.

Arteeva, Anna. "Design Systems for the Vibe-Coding Era." *Design Systems Collective*, Medium, 2025, www.designsystemscollective.com/design-systems-for-the-vibe-coding-era-42282e1affef.

DOC. "Why AI Is Exposing Design's Craft Crisis." *doc.cc*, 2025, www.doc.cc/articles/craft-crisis.

*AI Copilot Code Quality 2025*. GitClear, Feb. 2025, www.gitclear.com/ai_assistant_code_quality_2025_research.
