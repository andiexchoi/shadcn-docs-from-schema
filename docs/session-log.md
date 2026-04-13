# Session log: what we changed and why

This document walks through every change made to the project in preparation for the Vercel Technical Content Engineer application. Each section explains what was done, how it works, and why it matters for the role.

---

## 1. Removed legacy code from the Vite-to-Next.js migration

### What we did

Deleted five files that were left over from when the project ran on Vite + Express:

- `src/App.jsx` — the original Vite frontend component
- `src/App.css` — the original Vite styles
- `src/index.css` — base reset styles for Vite
- `api/generate.js` — the old Vercel serverless function (pre-Next.js)
- `server/index.js` — an Express dev proxy used during local development

### Why it matters

The project had been migrated to Next.js, but the old files were still in the repo. `src/App.jsx` was nearly identical to `app/page.jsx`. `api/generate.js` did the same thing as `app/api/generate/route.js`. Anyone reviewing the repo would see duplicate code and wonder which version was canonical.

### How it works now

The app runs entirely on Next.js:

- **Frontend:** `app/page.jsx` — a React client component (marked `"use client"` at the top, which tells Next.js to run it in the browser). It handles all the UI: the input modes, autocomplete, source selection, and output display.
- **Backend:** `app/api/generate/route.js` — a Next.js API route. When the frontend calls `fetch("/api/generate", ...)`, Next.js routes it here. This file talks to the Anthropic API and returns the generated markdown.
- **Shared logic:** The `src/` folder still holds the prompt, style guide, platform guidelines, doc fetcher, and examples. Both the frontend and backend import from it.

### What to say in an interview

"The project was originally built with Vite and Express, and I migrated it to Next.js for Vercel deployment. The migration left duplicate files in the repo — two copies of the main component, two API handlers. I cleaned those up so there's a single source of truth for each piece. The app now uses Next.js app directory: `app/page.jsx` for the frontend, `app/api/generate/route.js` for the backend."

---

## 2. Verified the API key isn't exposed

### What we checked

The `.env.local` file holds the Anthropic API key. We confirmed it's listed in `.gitignore` (under `.env*.local`) and that `git ls-files --cached .env.local` returns nothing, meaning git isn't tracking it.

### Why it matters

An API key in git history is a security issue. Even if the file is gitignored now, if it was ever committed, it's still in the history. We confirmed it was never tracked.

### What to say in an interview

"I checked that the API key file was properly gitignored and never committed to history. It's stored in `.env.local`, which Vercel reads from its environment variables settings in production."

---

## 3. Built a prompt eval system

### What we built

A new `eval/` directory with three files:

- **`eval/cases.js`** — Six test cases, each targeting a specific prompt behavior
- **`eval/run.js`** — A runner that generates documentation for each case and checks the output
- **`eval/README.md`** — Usage instructions

### How it works

Each test case has:

- **`input`**: either a component name (which triggers live doc fetching) or a JSON schema
- **`traits`**: strings the output must contain (case-insensitive substring match). For example, `"## When to use"` checks that the section heading exists.
- **`antitraits`**: strings the output must NOT contain. For example, `"—"` (em-dash) checks that the style guide rule is being followed.
- **`customCheck`** (optional): a function that runs custom logic on the output. For example, one case checks that the `**Do**` section appears before `**Don't**` to verify positive framing.

The runner (`run.js`) loops through each case, calls the Anthropic API with the same prompt the real app uses, then checks every trait and antitrait. It prints PASS/FAIL per check and exits with code 1 if anything fails.

### What the six test cases cover

1. **Button (schema) — basic structure**: Does the output have the right section headings? Does it mention aria-label? Does it avoid em-dashes, "should," and Latin abbreviations?
2. **Button (schema) — positive framing**: Does the Do section appear before the Don't section? (Custom check function.)
3. **Dialog (fetch) — accessibility depth**: When fed live Radix docs, does the output mention focus management, Escape key, and ARIA attributes?
4. **Badge (schema) — omits irrelevant sections**: A simple component shouldn't generate Placement or Editorial sections. This checks that the prompt correctly skips sections that don't apply.
5. **Output budget — sentence length**: Is the opening line after the heading actually one sentence, not three? (Custom check.)
6. **Style guide — no passive voice**: Does the output avoid passive constructions like "is displayed," "is rendered," "is shown"?

### Why it matters for the Vercel role

The job posting says "track performance, learn what people (and models) pick up, and iterate." An eval system is how you do that for AI-generated content. Without it, every prompt change is a guess — you edit the prompt, regenerate a few things by hand, eyeball it, and hope nothing regressed. With the eval, you can change the prompt and run `node eval/run.js` to check whether the change broke something.

This also demonstrates thinking about content as an engineering discipline. The eval cases encode your editorial standards as testable assertions.

### What to say in an interview

"I built a lightweight eval framework that tests the prompt against specific quality criteria. Each test case checks for structural requirements (are the right sections present?), style compliance (no em-dashes, no passive voice), and editorial standards (positive framing comes before negative). It runs against the real API with the real prompt, so it catches actual regressions, not just theoretical ones. You run it after any prompt change to make sure you didn't break something."

---

## 4. Added a prompt changelog

### What we built

`PROMPT_CHANGELOG.md` in the project root. Four entries (v1 through v4), each documenting:

- **What changed** in the prompt
- **Why** — the specific problem or insight that motivated the change
- **Effect** — what happened to the output quality

### Why this exists

The README already listed "prompt versioning with change notes" as a planned feature. The git history had the commits where the prompt changed, but no structured record of *why* or *what effect it had*. The changelog fills that gap.

### The four versions

- **v1 (initial):** Defined the template structure. Output followed the right sections but quality was uneven — too long, sometimes passive, sometimes hallucinated props.
- **v2:** Banned em-dashes, capped sentence length, added the positive framing rule. Output stopped reading like AI-generated text.
- **v3:** Extracted the style guide into its own file. Banned "should" and "may." Output got tighter and more authoritative.
- **v4:** Added the live doc fetching prompt path. Output for shadcn/ui components became grounded in real documentation instead of just schemas.

### What to say in an interview

"I treat the prompt like a versioned artifact, the same way you'd version an API or a design system. The changelog records what changed, why, and what it did to the output. This matters because prompt changes can have non-obvious effects — banning em-dashes also changed the sentence rhythm, for example. Without a record, you lose that institutional knowledge."

---

## 5. Fixed accessibility in the UI

### What we changed

Added ARIA attributes and focus styles throughout `app/page.jsx` and `app/globals.css`.

### The specific changes and why each one matters

**Component name input (the autocomplete):**
- Added `role="combobox"` — tells screen readers this input has an associated dropdown
- Added `aria-autocomplete="list"` — tells screen readers the input offers suggestions
- Added `aria-expanded={suggestions.length > 0}` — tells screen readers whether the dropdown is open
- Added `aria-label="Component name"` — gives the input an accessible name (it had no visible `<label>` element)

**Autocomplete suggestions dropdown:**
- Added `role="listbox"` on the `<ul>` — tells screen readers this is a list of selectable options
- Added `role="option"` on each `<li>` — tells screen readers each item is a selectable option
- Added `aria-selected={i === activeSuggestion}` — tells screen readers which option is currently highlighted

**Source pills (shadcn/ui, Radix UI, Base UI toggle buttons):**
- Added `role="group"` and `aria-label="Documentation sources"` on the container — groups the pills and labels the group
- Added `aria-pressed={selectedSources.includes(s.id)}` on each pill — tells screen readers whether the source is toggled on or off. Without this, a screen reader user has no way to know which sources are selected.

**Schema textarea:**
- Added `aria-label="JSON schema input"` — gives it an accessible name

**Output format tabs (Markdown / Preview):**
- Added `role="tablist"` on the container, `role="tab"` on each button, `aria-selected` on the active tab — implements the WAI-ARIA tabs pattern so screen readers announce "tab 1 of 2, selected" instead of just "button"

**Error messages:**
- Added `role="alert"` — screen readers announce errors immediately when they appear, without the user having to navigate to them

**Loading state:**
- Added `aria-live="polite"` — screen readers announce the loading message when it appears, but wait until the current announcement finishes (unlike `role="alert"`, which interrupts)

**Focus styles (CSS):**
- Added `:focus-visible` outlines on all interactive elements — makes keyboard navigation visible. The browser only shows these outlines when navigating by keyboard, not when clicking with a mouse, so it doesn't affect the visual design for mouse users.

### Why this matters for the Vercel role

The tool generates accessibility documentation for components. If the tool itself has accessibility gaps, that's a credibility problem. A reviewer checking the source pills with a keyboard would find them unfocusable. A screen reader user would have no idea which sources were selected. These are exactly the kinds of issues the generated documentation warns against.

### What to say in an interview

"The tool generates accessibility guidelines for components, so the tool itself needs to follow them. I added ARIA roles and attributes to the autocomplete, source toggles, tabs, error messages, and loading states. I also added focus-visible outlines so keyboard navigation is visible. The specific patterns follow WAI-ARIA — combobox for the autocomplete, tablist for the output format, aria-pressed for the toggle buttons."

---

## 6. Added "Copy as MDX" export

### What we built

A button in the output header that copies the generated documentation as MDX (Markdown with frontmatter) to the clipboard.

### How it works

The `toMdx()` function (line 14 of `app/page.jsx`) wraps the raw markdown output in YAML frontmatter:

```
---
title: "Component documentation"
description: "Generated with shadcn-docs-from-schema"
---

[generated markdown here]
```

The `copyMdx()` function calls `navigator.clipboard.writeText()` to copy this to the clipboard, then shows "Copied" for 2 seconds as confirmation.

### Why it matters

MDX is the standard format for docs sites built with Next.js (including Vercel's own docs). Without this button, a user would copy the raw markdown, manually add frontmatter, and save it as `.mdx`. The button eliminates that friction. It also signals that the tool is designed for a real workflow — not just generation, but integration into an existing publishing pipeline.

### What to say in an interview

"I added an MDX export button because the output needs to go somewhere. Most Next.js docs sites use MDX, so wrapping the generated markdown in frontmatter and copying it to the clipboard means the output can drop directly into a docs directory. It's a small feature, but it shows the tool is designed for a content pipeline, not just a demo."

---

## How the project looks now (file structure)

```
app/
  page.jsx              ← frontend (React client component)
  layout.jsx            ← Next.js root layout
  globals.css           ← all styles
  api/generate/route.js ← API endpoint (talks to Anthropic)

src/
  prompt.js             ← the prompt (the core artifact)
  style-guide.js        ← writing rules injected into the prompt
  platform-guidelines.js ← Apple HIG + Material Design best practices
  fetchDocs.js          ← fetches live MDX from GitHub repos
  shadcn-components.js  ← component list + fuzzy search
  examples/index.js     ← example schemas for the UI

eval/
  cases.js              ← test cases for prompt quality
  run.js                ← eval runner
  README.md             ← usage instructions

docs/
  design-philosophy.md  ← why the template is designed this way
  style-guide.md        ← full writing style guide
  session-log.md        ← this file

PROMPT_CHANGELOG.md     ← version history for prompt changes
README.md               ← project overview
```

---

## The three-layer architecture (for explaining the system design)

When someone asks "how does this work?", the answer is three layers:

1. **The prompt layer** (`src/prompt.js`) — defines the template structure, section order, framing rules, and output budgets. This is where editorial decisions live. "Lead with what to do, not what not to do." "Keep sentences to 15-20 words." "Every guideline needs a why."

2. **The knowledge layer** (`src/platform-guidelines.js` + `src/style-guide.js`) — curated best practices from Apple HIG and Material Design, plus writing rules. Injected into every prompt as reference material. The model draws from this instead of recalling from training data, so the output is auditable: if something looks wrong, you check the source file.

3. **The source layer** (`src/fetchDocs.js` or user-provided JSON schema) — the actual component data. For shadcn/ui components, it's live MDX fetched from GitHub. For custom components, it's the JSON schema the user pastes in. Either way, the source material is explicit, not inferred.

These three layers are independent. You can change the writing style without touching the platform guidelines. You can add a new component library without changing the prompt. You can update the HIG guidance without restructuring the template. That separation is the core design decision.

### Why this architecture matters for the Vercel role

The job posting asks you to "build the system, agents, and tools that make great content repeatable." This three-layer separation is exactly that: a system where editorial standards, domain knowledge, and source material are each maintained independently, combined at generation time, and testable in isolation. It's not just "call the AI" — it's a content pipeline with clear boundaries and auditable components.
