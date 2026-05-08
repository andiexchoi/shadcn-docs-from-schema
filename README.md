# Component documentation for humans and AI agents

## Align your team and your AI agents on what to ship and why

Both the human-facing doc and the AI-facing context come from one generation, so they don't drift apart when the component changes. Both surface the reasoning behind each guideline — default, override, and the why — so the human in a design review and the AI coding agent see the same decision logic instead of flat rules.

**[Live demo](https://shadcn-docs-from-schema.vercel.app/)**

---

## Background

I built [the first version of this](https://andiechoi.com/work/mobiledocs) at Amazon, for a mobile app team with no designated writer. It cut documentation time from 3+ hours per component to about 30 minutes by reading a JSON schema and producing structured guidelines cross-referenced against Apple HIG, Material Design, and Polaris.

This rebuild started because I wanted to see if I could remake the tool myself, without leaning on any Amazon internal resources. Two key improvements I wanted to make in this update were:

**Replace the copy-paste with a live fetch.** The original required someone to paste a JSON schema into the generator, so the input could drift from the actual component over time. The new version fetches docs straight from a popular component library (shadcn/ui) at request time, so the input stays in sync with the actual source.

**Replace the monolithic prompt with a modular one.** The original ran on one prompt that was hard to test, update, or fork. The new prompt assembles from versioned pieces — template, style guide, evidence files, formatting rules — so a team can adapt it for their own conventions without rewriting the whole thing.

The result runs inside a docs repo or CI pipeline rather than as a one-off paste into a generator.

---

## What it does

For each component, the tool produces two files from one generation:

- **Markdown documentation** for engineers, designers, and PMs. When-to-use guidance, variant rules, accessibility requirements, and editorial standards in a template you can publish to Mintlify, GitBook, or your repo's `docs/` folder.
- **A compact YAML version of the same content** for AI agents, wrapped as `CLAUDE.md`, `AGENTS.md`, or `llms.txt`. The AI coding tool that reads it (Claude Code, Cursor, v0) then references your actual component API instead of guessing at it from training data.

---

## How it works

```
input  →  schema  →  prompt  →  markdown  →  compact YAML  →  agent context file
```

All three inputs converge on a schema. The tool combines that schema with four reference files — a section template, an editorial style guide, and two folders of reviewed excerpts from platform docs (Apple HIG, Material) and accessibility specs (WAI-ARIA, Radix) — into a single prompt. Claude (sonnet-4-6) reads the prompt and writes the markdown doc. A JavaScript parser then converts that markdown into compact YAML.

### Three input modes

- **Fetch from docs**: Type a shadcn/ui component name and the tool downloads the raw documentation file from the shadcn/ui, Radix UI, or Base UI GitHub repo at the moment you ask. You always get current docs, not a snapshot from training data.
- **Custom schema**: Paste a JSON description of the component (its props, variants, defaults). The tool generates a doc only for what's in the schema; it won't invent fields that aren't there.
- **Paste source**: Paste a TSX or JSX component file. The tool reads the source with regex patterns and extracts the schema automatically, picking up TypeScript interfaces, type aliases, `cva` variant definitions, and `forwardRef` patterns. This is the path for teams whose components live only as code, with no schema or upstream docs to fetch.

### Schema-level reasoning (optional)

Two optional fields let you bake your own design reasoning directly into the schema. A `reason` field on any prop becomes the "why" sentence in that prop's documentation. A `rules` array at the component level becomes Do bullets in the generated doc, with optional `override` conditions for when the rule has exceptions. Without either field, the doc still generates from the schema's structure alone — these fields just hand the model your team's reasoning so it doesn't have to guess at one.

```json
{
  "component": "Button",
  "props": {
    "variant": {
      "type": "enum",
      "values": ["default", "critical"],
      "reason": "critical replaces destructive — user research found destructive tested as alarming for low-severity actions"
    }
  },
  "rules": [
    {
      "rule": "Use the critical variant only for actions that permanently delete data or cannot be undone.",
      "reason": "critical is the highest severity on the product scale.",
      "override": "Use default when the action can be undone within the same session."
    }
  ]
}
```

### Two outputs from one generation

One API call to Claude returns the markdown doc. Then , a JavaScript parser at `[src/markdown-to-compact.js](src/markdown-to-compact.js)` walks that markdown, renames the headings to short stable keys (`## When to use` → `use_when:`, `## ARIA requirements` → `aria:`), strips the bold/italic/backtick markup, and converts bullet lists to YAML arrays. The alternative would be a second API call asking the model to rewrite the markdown as YAML, so this method saves some cost and ensures continuity between the two outputs.

The YAML payload then wraps in three different envelopes:`CLAUDE.md`, `AGENTS.md`, and `llms.txt`.

### Evidence-backed citations

When the doc cites Apple HIG, Material Design, the WAI-ARIA spec, or Radix's official docs, it's quoting from text excerpts I've reviewed first hand and saved to disk, so it's not paraphrasing what the model remembers from its training. Each cited fact has a source ID and a working URL.

The excerpts live in two folders:

- `src/platform/` — Apple HIG and Material Design excerpts. Currently covers buttons, dialogs, and inputs.
- `src/semantic/` — WAI-ARIA APG and Radix UI excerpts. Currently covers dialog, select, and tabs.

If no reviewed excerpt exists for a component, the corresponding section of the doc is left empty rather than filled in from the model's training knowledge.

To check excerpt structure, run `node src/platform/validate-evidence.js` and `node src/semantic/validate-evidence.js`. The generator only injects excerpts marked `reviewState: "current"`. To add a new component type: add an entry in the matching `sources.json`, drop a reviewed JSON file in `evidence/`, and set `reviewState: "current"`.

### The prompt is the main artifact

[`src/prompt.js`](src/prompt.js) is the centerpiece of this repo. Two design choices in it do most of the work:

**A reasoning shape for rules.** Where a rule has a source-backed reason, the prompt requires it in the form "Default: X. Override with Y when Z, because [reason]." Flat rules become decision artifacts: the reader sees what choice is being made, what conditions justify departing from it, and the reasoning behind both. This is what makes the generated docs useful in design review, not just style enforcement.

**A traceability contract.** ARIA, keyboard, and platform-compliance sections cite specific reviewed excerpts with source IDs and URLs. When no reviewed excerpt exists for a component, the section is omitted, not filled in from the model's training knowledge. The output is auditable against the prompt — every claim came from either the schema, the upstream docs, or a reviewed evidence file.

The prompt assembles from four pieces:

- **Formatting rules** — what the output can never contain (no em-dashes, no "should," no Latin abbreviations, schema-defined names only).
- **Template** — 13 possible sections with explicit omission rules per section, so a Badge gets no Keyboard Interactions section and a Separator gets no Decisions to Verify section.
- **Output budget** — sentence and bullet caps per section, calibrated so the first draft is tight enough to use as AI agent context without re-editing.
- **Style guide** — voice, tense, modal verbs, sentence economy.

At runtime, evidence excerpts from `src/platform/` and `src/semantic/` are injected into the prompt for any component that has reviewed evidence.

### Batch CLI

```
node src/batch.js --components button,dialog,tabs --format both --output ./docs/generated/
```

Add `--combine claude` (or `agents` / `llms`) to merge components into a single agent-context file for whole-library context.

### Output requires human review

The tool generates first drafts. Engineers verify accuracy. Writers edit for voice and edge cases. The goal is to automate scaffolding, not judgment.

---

## Example: custom Button (divergence from upstream)

The scenario the tool is built for. Your team forked shadcn's Button, renamed `destructive` to `critical`, added `loading`/`loadingText` for async states, and added `focusTrap` for modal contexts. Upstream docs don't cover any of this.

**Input (paste source or custom schema):**

```json
{
  "component": "Button",
  "props": {
    "variant": { "type": "enum", "values": ["default", "critical", "outline", "ghost"], "default": "default" },
    "loading": { "type": "boolean", "default": false },
    "loadingText": { "type": "string" },
    "focusTrap": { "type": "boolean" }
  }
}
```

**Generated markdown surfaces the custom behavior:**

```markdown
**`critical`**: Use for actions that permanently delete data or can't be reversed.

**`loading`**: Set to `true` while an async operation is in progress to block repeat submissions.

**`loadingText`**: Provide a short label, such as "Saving…", to replace the button label
while `loading` is `true`. This keeps sighted users informed of progress.
```

**Compact YAML for agents:**

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

The agent consuming this file uses the variant names and contracts your schema defines, so it won't substitute `destructive` for `critical` or invent props you don't have. Broader claims the model adds — alternative components, generic accessibility patterns, editorial thresholds — still need a human pass before shipping. The audit at `eval/audit.js` flags structural drift; the rubric in [`docs/rubric.md`](docs/rubric.md) covers what it can't.

---

## Does it work?

The repo has an assisted-reading audit system for verifying that generated output is sound. It checks two things:

1. **Source fidelity.** Every fact the doc states (props, variants, keyboard shortcuts, ARIA attributes, sub-component names) traces back to a specific line in the source — the fetched MDX file, the JSON schema, or the TSX you pasted. If the doc claims a `loading` prop the schema doesn't have, the audit catches it.
2. **Prompt conformance.** Every output follows every rule in `src/prompt.js` and `src/style-guide.js` — no em-dashes, no passive voice, required sections present, output budget respected.

Running `node eval/audit.js <component>` does the mechanical part: generates a doc, runs substring scans for the style rules, and pre-extracts every prop, variant, ARIA attribute, keyboard key, and sub-component the doc mentions into checklist rows. The actual reading — comparing each claim to the source and writing pass/fail — is done by hand. Output files write to `evaluation/audits/`.

The full rubric, plus a reader's guide for evaluating output against your team's specific needs, is in `[docs/rubric.md](docs/rubric.md)`.

- Rubric: `[docs/rubric.md](docs/rubric.md)`
- Audit guide: `[docs/audit-guide.md](docs/audit-guide.md)`
- Prompt evolution: `[PROMPT_CHANGELOG.md](PROMPT_CHANGELOG.md)`
- Eval system: `[eval/README.md](eval/README.md)`

---

## Known limitations

**Variant headers can paraphrase short non-standard enum values.** When a schema defines an enum with short identifiers that aren't standard accessibility vocabulary (e.g., `severity: "info" | "success" | "warning" | "danger"`), the model sometimes renders `info` as "Informational" or `danger` as "Error" in variant section headings, even though the prompt rules require literal values. Standard-English values like `success` and `warning` come through literal. The audit at `eval/audit.js` flags the substitution.

**Workaround.** In the **Custom schema** input mode, add a `description` field on the prop that names the literal values in prose:

```json
{
  "severity": {
    "type": "enum",
    "values": ["info", "success", "warning", "danger"],
    "description": "Use `info` for low-urgency announcements, `success` for confirmations, `warning` for non-blocking issues, `danger` for blocking failures."
  }
}
```

When values appear by name in description prose, the model anchors to them and preserves them through the output. (The Custom Button example uses this pattern to keep `critical` literal.) For TSX paste mode, the parser does not yet extract JSDoc comments, so descriptions written in source don't reach the prompt — paste a JSON schema with descriptions instead.

---

## Use this for your own team

To fork this tool for your team's component library, see [`FORKING.md`](FORKING.md). The recipe walks through the five files you'll touch and the friction points to know about up front.

---

## Quick start

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-..." > .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Stack

- Next.js on Vercel
- Anthropic API (claude-sonnet-4-6)
- Live doc fetching from GitHub raw content (shadcn/ui, Radix UI, Base UI)
- Regex-based TSX/JSX prop extraction (no build dependency)
- Deterministic markdown-to-YAML post-processor (no second API call)

---

## What's next

- Expand evidence coverage in `src/platform/` and `src/semantic/`. The current set (buttons, dialogs, and inputs for platform; dialog, select, and tabs for semantic) is too narrow for a team to actually adopt — evidence needs to cover the broader set of components a real product ships.
- Detect when component source changes — whether on a PR branch or on main, in shadcn/ui upstream or your own repo — and auto-regenerate the markdown and agent context to a configured output location, so the docs never lag the source.
- Run audits against more components (Select, Toast, Sheet) using `eval/audit.js`.
- Extract JSDoc comments from TSX source so prop descriptions reach the prompt and anchor unusual enum values (closes the gap noted in Known limitations).
- Support OpenAPI specs as input alongside JSON schemas and TSX source.
- Centralize default fetch sources into a single `DEFAULT_SOURCES` constant. Today the default lives in five places (`fetchDocs.js` registry and signature, `generate.js`, `batch.js`, `app/page.jsx`); a forker has to find each one.
- Rename `src/shadcn-components.js` to a library-agnostic name and update importers. The file's job is "registry of supported components," not anything shadcn-specific.
- Sync the UI pitch in `app/page.jsx` with the README pitch (or generate one from the other) so they don't drift.
- Add a progress indicator during generation. Right now the UI hangs for 10–20 seconds with no feedback.
- Improve the "No documentation found" error to name the sources tried and the URLs hit, so a forker debugging a misconfigured URL pattern can diagnose without reading source.
- Document the `searchComponents` export contract in `src/shadcn-components.js`, or refactor so a forker doesn't need to read the consumer to know it exports a function plus an array with a specific object shape.

