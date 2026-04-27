# Component documentation for humans and AI agents

The documentation layer between your component library and everything that reads it. Generate readable markdown docs and structured agent context files (CLAUDE.md, AGENTS.md, llms.txt) from a JSON schema, a TSX file, or a live shadcn/ui component. One source of truth for the engineers, designers, and AI agents working on your design system.

**[Live demo](https://shadcn-docs-from-schema.vercel.app/)**

---

## Contents

- [What it does](#what-it-does)
- [How it works](#how-it-works)
  - [Three input modes](#three-input-modes)
  - [Schema-level reasoning](#schema-level-reasoning)
  - [Platform evidence pipeline](#platform-evidence-pipeline)
  - [Semantic evidence pipeline](#semantic-evidence-pipeline)
  - [The prompt is the core artifact](#the-prompt-is-the-core-artifact)
  - [Two output representations](#two-output-representations)
  - [Agent context file export](#agent-context-file-export)
  - [Batch CLI](#batch-cli)
  - [Output still requires human review](#output-still-requires-human-review)
- [Examples](#examples)
  - [Custom Button (divergence from upstream)](#example-custom-button-divergence-from-upstream)
- [Does it work? Audit system](#does-it-work-audit-system)
- [Background and motivation](#background-and-motivation)
  - [Origin](#origin)
  - [The problem has shifted](#the-problem-has-shifted)
  - [Component adoption outpaces component governance](#component-adoption-outpaces-component-governance)
  - [AI agents need documentation to write correct code](#ai-agents-need-documentation-to-write-correct-code)
  - [Accessibility breaks through inconsistency, not ignorance](#accessibility-breaks-through-inconsistency-not-ignorance)
  - [Design quality degrades without a shared reference](#design-quality-degrades-without-a-shared-reference)
  - [What this tool demonstrates](#what-this-tool-demonstrates)
- [Development](#development)
  - [Stack](#stack)
  - [Prompt eval system](#prompt-eval-system)
  - [Prompt changelog](#prompt-changelog)
- [What's next](#whats-next)

---

## What it does

Component documentation has two audiences now: the people on your team and the AI tools writing code with your components. Most documentation only serves the first. This tool generates both, from the same source.

- **Markdown documentation** for engineers, designers, and PMs. Usage guidance, variant logic, accessibility specs, and editorial standards in a hybrid template you can publish anywhere markdown is read (Mintlify, GitBook, your repo's `docs/`).
- **Compact YAML** for AI agents, wrapped as **CLAUDE.md**, **AGENTS.md**, or **llms.txt**. The same content stripped to its semantic structure, so coding tools like Claude Code, Cursor, and v0 can reference your actual component API instead of hallucinating one from training data.

Give it a JSON schema, a TSX file, or any live shadcn/ui component name. It pulls (or extracts) the schema, runs it through a versioned prompt, and emits both representations from the same source of truth.

---

## How it works

The pipeline:

```
input  →  schema  →  prompt  →  markdown  →  compact YAML  →  agent context file
```

Three inputs feed the same downstream path. The prompt assembles from versioned modules (template, style guide, platform guidelines, semantic guidelines), generates markdown via Claude (sonnet-4-6), and a deterministic post-processor transforms that markdown into compact YAML. No second API call, no drift between the two representations. The YAML is then wrapped in CLAUDE.md, AGENTS.md, or llms.txt envelopes for distribution.

### Three input modes

**Fetch from docs:** type any shadcn/ui component name and the tool pulls raw MDX directly from the shadcn/ui, Radix UI, and Base UI GitHub repositories. The live source content becomes the grounding material for generation. The tool tries both the `base/` and `radix/` subdirectories in the shadcn repo and combines what it finds. This means the output reflects current documentation, not a snapshot from training data.

**Custom schema:** paste a JSON schema for any component. The schema determines what sections are generated and what gets covered. This is the no-hallucination constraint for custom libraries: the tool doesn't invent props or variants that aren't in the schema.

**Paste source:** paste a component's TSX/JSX source code directly. The tool extracts a JSON schema from the source using regex-based prop extraction (interfaces, type aliases, cva variants, forwardRef patterns, destructuring defaults) and generates documentation from the result. This is the path for teams whose components exist only as code, with no schema or upstream docs to fetch.

### Schema-level reasoning

Two optional schema fields let you encode the "why" behind your component's decisions directly in the schema:

- Add a `reason` field to any prop to explain why it exists or what decision it encodes. The model uses this as the "because" clause in the corresponding guideline.
- Add a `rules` array at the component level for design decisions that should generate Do's directly. Each entry takes a `rule`, a `reason`, and an optional `override` field. The model turns each into a Do bullet in default/override form.

```json
{
  "component": "Button",
  "props": {
    "variant": {
      "type": "enum",
      "values": ["default", "critical"],
      "reason": "critical replaces destructive to match our severity scale — user research found destructive tested as alarming for low-severity actions"
    }
  },
  "rules": [
    {
      "rule": "Use the critical variant only for actions that permanently delete data or cannot be undone.",
      "reason": "critical is the highest severity on the product scale — applying it to reversible actions trains users to ignore the warning.",
      "override": "Use the default variant when the action can be undone within the same session, such as archiving with an undo affordance."
    }
  ]
}
```

These fields are optional and additive. Schemas without them still generate complete documentation. Add them where your team has made decisions that the model would otherwise have to guess.

### Platform evidence pipeline

The tool generates a "Platform compliance checklist" section at the end of each doc. This section is a checklist of things to confirm before you start building — each item tied to a specific, reviewed excerpt from Apple HIG or Material Design, with a source ID and a direct URL.

The distinction from a typical AI doc generator: the tool does not synthesize platform guidance from training knowledge. It only injects platform checklist items when a human-reviewed evidence excerpt backs them up. If no reviewed evidence exists for a component, the section is omitted rather than filled with unverifiable claims.

The evidence pipeline lives in `src/platform/`:

- **`sources.json`** — a registry of canonical HIG and Material source URLs, organized by component type
- **`evidence/*.json`** — reviewed excerpts from those sources, each with a source ID, a quoted or paraphrased passage, and the checklist item it supports
- **`validate-evidence.js`** — checks that all evidence files are structurally valid and that source IDs resolve in the registry
- **`refresh-sources.js`** — checks whether source URLs are still reachable and flags any whose content appears to have changed

Run `node src/platform/validate-evidence.js` to check all files. The generator will not inject evidence that isn't marked `current`.

**Adding evidence for your own component types.** Add an entry to `sources.json` with the canonical URL, create an evidence file in `src/platform/evidence/`, and set `reviewState: "current"` once you've verified the excerpts against the live source. Any component type with current evidence will automatically get a platform verification section in its generated doc.

### Semantic evidence pipeline

The ARIA requirements and Keyboard interactions sections follow the same evidence-backed model as the platform checklist. When reviewed excerpts from a canonical accessibility source exist for a component, those sections cite the source with an ID and URL. When no reviewed evidence exists, those sections generate from absorbed knowledge (the structural and semantic guidelines) and add a note: *Generated from training knowledge. No verified source excerpts available for this component.*

The semantic evidence pipeline lives in `src/semantic/`:

- **`sources.json`** — a registry of canonical source URLs organized by component type. Source families: WAI-ARIA APG, Radix UI docs, MDN, HTML spec.
- **`evidence/*.json`** — reviewed excerpts from those sources. Each excerpt has a `section` field that routes it to the correct doc section (`aria-requirements`, `keyboard-interactions`, or `accessibility`).
- **`validate-evidence.js`** — checks that all evidence files are structurally valid and that source IDs resolve in the registry. Run: `node src/semantic/validate-evidence.js`
- **`refresh-sources.js`** — checks whether source URLs are still reachable and flags any whose content appears to have changed. Run: `node src/semantic/refresh-sources.js`

The generator will not inject evidence that isn't marked `current`. Initial evidence covers dialog, select, and tabs across WAI-ARIA APG and Radix UI docs.

**Adding evidence for your own component types.** Add an entry to `sources.json`, create an evidence file in `src/semantic/evidence/`, and set `reviewState: "current"` once you've verified the excerpts against the live source. Each excerpt must have: `id`, `section`, `topic`, `evidence` (the source text), and `supportsGuideline` (the pre-phrased doc requirement).

**What semantic evidence does not cover.** The compound component composition rules and known AI agent failure patterns in `src/semantic-guidelines.js` are curated empirical knowledge — they're not spec-verifiable against a canonical URL. They remain as absorbed reference material and power Component contracts and Common mistakes sections.

### The prompt is the core artifact

`[src/prompt.js](src/prompt.js)` is where the documentation philosophy becomes machine-readable: the section structure, the framing rules, the editorial standards, and the instruction to lead with positive framing and always include the "why." Most AI tools treat the prompt as an implementation detail. Here it's the primary design artifact: versioned, readable, and separable from the platform knowledge layer so both can be maintained independently.

The prompt assembles from four modules, injected in this order:

1. **Formatting rules and framing philosophy** (inline in `prompt.js`) — four non-negotiable constraints (no em-dashes, no "should"/"may", no Latin abbreviations, schema-defined names only) plus framing philosophy: positive guidance before negative, every rule carries a "why," and guidelines use default/override form when the source provides a reason
2. **Template with section structure** (inline in `prompt.js`) — the exact heading names and section omission rules that make the output deterministically parseable by the compact format converter
3. **Output budget** (inline in `prompt.js`) — sentence and bullet limits per section, calibrated to produce first drafts that are tight enough to use as agent context without post-editing
4. **Style guide** (`[src/style-guide.js](src/style-guide.js)`) and **semantic guidelines** (`[src/semantic-guidelines.js](src/semantic-guidelines.js)`) — injected as reference material; **semantic evidence** (`[src/semantic/](src/semantic/)`) and **platform evidence** (`[src/platform/](src/platform/)`) — loaded per component and injected only when reviewed evidence exists

The modules are separate so each can be versioned, tested, and updated independently. The heading names in the template are the same heading names the compact format parser splits on, which is why both must be maintained together.

### Two output representations

The tool generates markdown documentation and a compact YAML representation. Both contain the same content, governed by the same editorial rules. The compact format is not a summary or a degraded version.

The compact format strips the presentation layer: heading syntax, bold markers, blank lines, the visual hierarchy designed for humans scanning a rendered page. What it adds is structural predictability. Every component uses the same short keys (`use_when`, `do`, `dont`, `keyboard`, `aria`, `a11y`, `mistakes`) in the same order. Sections that don't apply are absent, not empty. Bullet lists become arrays. An agent can extract `keyboard:` or `aria:` without parsing markdown headings.

Token savings are modest, roughly 3-5%. The original hypothesis was 30-50%, but that holds for API specifications with deep structural nesting, not prose documentation where content dominates format overhead. The value is parseability, not compression. Consistent keys, predictable schema, no formatting noise.

The UI shows both formats side by side with token estimates so you can see the tradeoff directly.

### Agent context file export

The compact YAML can be exported as:

- **CLAUDE.md** — fenced YAML block with usage instructions for Claude Code
- **AGENTS.md** — AI agent context wrapper
- **llms.txt** — plain text format with summary extraction

These are the files you'd commit to a repo so that AI coding tools consuming your component library get structured documentation as context. The export wraps the same compact YAML in the conventions each format expects.

### Batch CLI

`node src/batch.js --components button,dialog,tabs --format both --output ./docs/generated/` generates documentation for multiple components in sequence, writing `.md` and `.yaml` files to the output directory. Add `--combine claude` (or `agents` / `llms`) to merge all components into a single CLAUDE.md / AGENTS.md / llms.txt for whole-library context. This is the path for generating a full component library's documentation in one pass.

### Output still requires human review

The tool generates first drafts. Engineers verify technical accuracy. Writers edit for voice, edge cases, and anything the source docs don't capture. This is intentional: the goal is to automate the mechanical scaffolding so the human work, judgment, accuracy, audience awareness, can happen faster.

---

## Examples

### Example: Custom Button (divergence from upstream)

This is the scenario the tool is built for. Your team forked shadcn's Button and renamed `destructive` to `critical`, added `loading`/`loadingText` for async states, and added `focusTrap` for modal contexts. Upstream docs don't cover any of this.

**Input schema (paste source or custom schema):**

```json
{
  "component": "Button",
  "props": {
    "variant": { "type": "enum", "values": ["default", "critical", "outline", "ghost"], "default": "default" },
    "size": { "type": "enum", "values": ["sm", "default", "lg"], "default": "default" },
    "loading": { "type": "boolean", "default": false },
    "loadingText": { "type": "string" },
    "focusTrap": { "type": "boolean" }
  },
  "element": "button"
}
```

**Generated output mentions `critical` (not `destructive`), documents the custom props, and surfaces accessibility implications:**

```markdown
**`critical`**: Use for actions that permanently delete data or can't be reversed.

**`loading`**: Set to `true` while an async operation is in progress to block repeat submissions.

**`loadingText`**: Provide a short label, such as "Saving…", to replace the button label
while `loading` is `true`. This keeps sighted users informed of progress.
```

**Compact YAML (for CLAUDE.md / AGENTS.md):**

```yaml
component: Button
props:
  variant: enum [default, critical, outline, ghost] = "default"
  loading: boolean = false
  loadingText: string
  focusTrap: boolean
keyboard:
  Enter: activates the button
  Space: activates the button
aria:
  aria-busy: set when loading is true
  aria-disabled: use instead of disabled attribute
mistakes:
  - using disabled instead of aria-disabled when explanation is needed
  - omitting loadingText when loading is true
```

The AI agent that consumes this file will never hallucinate `destructive` or miss `loadingText` — both are specified explicitly from the actual component source.

---

## Does it work? Audit system

The tool ships with an assisted-reading audit system for verifying generated output. It checks two things:

**Source fidelity.** Every factual claim in the generated doc traces back to a line in the source — fetched MDX, JSON schema, or TSX. The audit catches hallucinated props, invented keyboard shortcuts, fabricated ARIA attributes, and wrong sub-component names.

**Prompt conformance.** The output follows every rule in `src/prompt.js` and `src/style-guide.js`. The audit catches em-dashes, passive voice in guidelines, missing sections, and sections that should have been omitted.

Running `node eval/audit.js <component>` generates a doc, fetches the source, runs substring scans for the style rules, and pre-extracts every prop, variant, ARIA attribute, keyboard key, and sub-component the doc mentions into checklist rows. The reading and verdicts are filled in by hand. Audit files are written to `evaluation/audits/`.

The rubric that defines these checks, including the reader's guide for evaluating output against your own team's needs, lives in [`docs/rubric.md`](docs/rubric.md).

- **Rubric**: [`docs/rubric.md`](docs/rubric.md)
- **Audit guide**: [`docs/audit-guide.md`](docs/audit-guide.md)
- **Prompt evolution**: [`PROMPT_CHANGELOG.md`](PROMPT_CHANGELOG.md)

---

## Background and motivation

### Origin

I built the [first version of this](https://andiechoi.com/work/mobiledocs) while at Amazon, for a mobile app team with no designated writer. I referenced Apple's HIG, Material Design, and Shopify's Polaris principles to create an AI agent that cut documentation time from 3+ hours to 30 minutes per component.

Its main friction point was that every draft started with copy-pasting a component's JSON schema into the generator. I wanted to see if I could rebuild the tool on my own, remove that step, and make something that could stand on its own. The public version pulls component schemas directly from shadcn/ui's GitHub repos. Users search for a component the same way they would on the shadcn docs site and get structured design documentation back.

### The problem has shifted

The original tool solved a translation problem: non-technical people couldn't read the technical docs. That problem is more...specific now. Designers are becoming design engineers. PMs are becoming tech leads. The roles that needed translation are gaining technical fluency or folding into engineering entirely.

The new problem is worse, and it's accelerating.

### Component adoption outpaces component governance

shadcn/ui is one of the most widely used component systems in the React ecosystem. Its docs are clear about what it is: "This is NOT a component library. It's a collection of re-usable components that you can copy and paste into your apps." That's the whole point. You take the code and make it yours.

The problem starts the moment you do. A developer runs `npx shadcn@latest add button`, changes the padding, adds a `loading` prop, renames `destructive` to `critical`. The official shadcn docs are now 80% correct and 20% dangerous. The team's actual component system is undocumented, living only in the codebase. Brad Frost called this clearly: "Once the pattern library ceases to reflect the current state of the products it serves, it becomes obsolete." The Sparkbox Design Systems Survey (2022) backs it up: 39% of subscribers said their system was documented poorly, and 35% said it was unclear what was old, broken, or coming soon.

This isn't new. Software engineering has a name for it: documentation drift. Aghajani et al. analyzed Stack Overflow and GitHub data at ICSE 2019 and found documentation-code inconsistency was a top problem. But "copy and paste" component libraries like shadcn make the drift structural, not incidental. The architecture assumes mutation. Every team that adopts it will diverge.

### AI agents need documentation to write correct code

Here's where it compounds. We're in an era where AI agents write production UI. v0, Cursor, Claude Code, Bolt. A tech lead prompts one tool to build a settings page; another prompts a different tool to build onboarding. Both get working UI. Neither gets consistency.

The AI doesn't know your team renamed `destructive` to `critical`, that your Dialog has a custom focus trap, or that you've added a `loading` prop that doesn't exist upstream. Without structured documentation of the actual component system, AI agents generate plausible but wrong code. The 0xminds team tested this directly: across 50 prompts, 34% of AI-generated shadcn components had API errors. With structured documentation provided as context, that dropped to 3%.

This is a recognized problem at every level of the ecosystem. Andrew Ng described it plainly: "Agentic coding systems often make mistakes because they're not aware of tools, API calls, and the like that came out after they were trained." Birgitta Bockeler, writing on Martin Fowler's site, framed the emerging discipline of "context engineering" as "curating what the model sees so that you get a better result." shadcn itself built Skills and an MCP server specifically to give AI tools structured access to component metadata. Their docs describe a registry as "a distribution specification designed to pass context from your design system to AI Models."

The pattern is clear. AGENTS.md, CLAUDE.md, .cursorrules, llms.txt: all different implementations of the same idea. AI tools that generate code from components need a structured reference for those components. Steve Sewell at Builder.io documented the adoption: n8n (178K stars), llama.cpp (97K stars), Bun (82K stars), all shipping agent context files. The question isn't whether this layer is needed. It's who produces it and how.

Helge Sverre named the failure mode: "agentic drift," the gradual, invisible divergence that happens when parallel autonomous agents work on related parts of a codebase without coordination. Three agents independently implemented dynamic model discovery three different ways. Code compiled. Tests passed. The merged result was semantic noise. The TypeUI team at Creative Tim described the same thing from the design side: "The first component looks great, the second one drifts, and by the third prompt your buttons have different padding, your fonts have changed."

### Accessibility breaks through inconsistency, not ignorance

shadcn/ui is accessible by default because it's built on Radix. But "accessible by default" is a black box. A DevUnionX audit found that AI tools "mostly don't automatically add important parts like DialogTrigger or SheetDescription" and that "elements like SheetDescription that seem unnecessary are actually for accessibility. AI generally skips these."

This isn't hypothetical. The shadcn/ui issue tracker documents the same failure pattern across four separate bug reports (#4302, #5474, #5746, #6284), all reporting the same accessibility error: missing `SheetTitle` or `SheetDescription` in component implementations, triggering the Radix warning "DialogContent requires a DialogTitle for the component to be accessible for screen reader users." These weren't filed as AI bugs. They're the exact class of error that AI tools reproduce when generating components without understanding the semantic contracts underneath.

Radix itself enforces these contracts strictly. When `DialogDescription` is absent, Radix generates a dangling `aria-describedby` pointing to a non-existent ID. That's a broken ARIA reference, inherited silently by every AI-generated component that skips the sub-component.

Nobody on the team is ignorant of accessibility. The problem is that nobody is checking whether three independently generated features handle focus management, keyboard interactions, and ARIA labels the same way. Accessibility breaks not from missing knowledge but from missing coordination. Structured documentation that surfaces "this component traps focus, requires a visible title, and responds to Escape" gives both humans and AI agents the spec they need to stay consistent.

### Design quality degrades without a shared reference

Accessibility failures are invisible until someone runs an audit. Design principle violations are visible immediately, and they compound the same way.

The OverlayQA team ran structured QA passes on apps built by Bolt, Lovable, and Figma Make. They found an average of 160 issues per AI-generated app: layout and spacing errors, incorrect CSS values, missing design token usage. AI-generated code introduced 1.7x more visual issues than human-written code. Their core finding: "AI app builders optimize for functional correctness. They do not optimize for visual fidelity."

The pattern is predictable. AI tools default to their training data, not your design system. Anna Arteeva, former Head of Product Design at Payoneer, described the mechanism directly: "AI tools tend to be biased toward the frameworks and styles they were trained on. If your system deviates from those defaults, extra work is needed to teach the AI your design tokens, components, and patterns, or coding agents will fall back to infamous AI slop." Addy Osmani found the same thing evaluating v0: it "re-themes designs towards its default look instead of faithfully matching a given spec." The tool overrides your design intent with its own aesthetic preferences.

This isn't just about aesthetics. GitClear analyzed 211 million changed lines of code from 2020 to 2024, across repos owned by Google, Microsoft, and Meta. Refactored code dropped from 24.1% of changes to 9.5%, a 60% decline. Copy-pasted code surpassed refactoring for the first time in 2024. Duplicated code blocks saw an eightfold increase. These patterns map directly to UI code: inline styles instead of tokens, duplicated component variants instead of reuse, hardcoded values instead of design system references. The code works. It just doesn't cohere.

Nielsen Norman Group's "State of UX 2026" report frames the broader consequence: "UI is cheaper to produce due to standardization" but "visual output alone has stopped being a differentiator." Their separate evaluation of AI design tools found that even Figma's First Draft produced output with "poor information and visual hierarchy, even for a wireframe." Their conclusion: "Only a human designer can balance the design, business, and user needs that go into a great visual design."

The DOC piece ties it together. "AI didn't create the craft crisis. It exposed the technical literacy gap that's been eroding strategic influence for over a decade." When Figma Sites produced 210 WCAG violations, it wasn't because the tool lacked capability. It was because there was no spec for it to follow. The same applies to spacing, hierarchy, variant logic, and every other design decision that lives in someone's head instead of in documentation.

This is the same problem as the accessibility section, with a different symptom. No shared reference means no consistency. Accessibility breaks fail screen readers. Design drift fails users' eyes. Both get worse when multiple AI agents generate UI independently. Both are solved by the same artifact: structured component documentation that encodes not just what the components are but when and how to use them.

### What this tool demonstrates

The demo pulls from shadcn/ui's GitHub repos and generates structured documentation for any component in the library. The output covers usage guidance, variant logic, accessibility specs, and editorial standards, in a format that serves both humans scanning for answers and AI agents generating code.

The shadcn fetch is proof of concept. The thesis is that every team running a customized component system needs this layer, and it needs to be generated from their actual codebase, not the upstream library. The process I identified at Amazon, reading a schema, writing the same sections in the same order, applying the same editorial standards, is the same process. The reason it matters has changed. It's no longer about translating for non-technical people. It's about producing the shared reference that keeps a team and its tools aligned when components ship faster than anyone can write documentation by hand.

---

## Development

### Stack

- Next.js on Vercel
- Anthropic API (claude-sonnet-4-6)
- Live doc fetching from GitHub raw content (shadcn/ui, Radix UI, Base UI)
- Regex-based TypeScript/JSX prop extraction (no build tooling dependency)
- Deterministic markdown-to-YAML post-processing (no second API call)

### Prompt eval system

The `eval/` directory contains a lightweight evaluation framework for testing prompt changes against expected output quality. Each test case defines traits the output must contain and antitraits it must not. Run `node eval/run.js` after changing the prompt, style guide, or any file in `src/platform/` or `src/semantic/` to check for regressions.

See `[eval/README.md](eval/README.md)` for details.

### Prompt changelog

[`PROMPT_CHANGELOG.md`](PROMPT_CHANGELOG.md) documents the two versions of the prompt: the Amazon origin and the current version, with a description of what changed between them.

---

## What's next

- Run audits against more components (Select, Toast, Sheet) using `eval/audit.js` to check whether the prompt generalizes past Dialog and Button
- Support for OpenAPI specs as input alongside JSON schemas and TSX source
- CI integration: regenerate the component library's agent context on every PR that touches component source

