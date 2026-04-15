# Prompt changelog

Documents what changed in the prompt, why, and what effect it had on output quality. Each entry corresponds to a meaningful change in `src/prompt.js`, `src/style-guide.js`, or `src/platform-guidelines.js`.

---

## v5 — Audience reframe and semantic layer (2026)

**What changed:** Rewrote audience framing from "product managers and designers" to "engineers, design engineers, and AI coding agents." Added four new template sections: Component contracts, Keyboard interactions, ARIA requirements, Common mistakes. Created `src/semantic-guidelines.js` as a new knowledge layer covering compound component composition, ARIA patterns by type, and known AI agent failure patterns. Extracted shared prompt content into a helper function to eliminate duplication between `buildPrompt` and `buildPromptFromDocs`. Increased max_tokens from 2000 to 4000. Added explicit section omission rules for non-interactive components. Added six new eval cases (12 total).

**Why:** The project thesis shifted. The original tool solved a translation problem: non-technical people couldn't read technical docs. That problem is shrinking as roles converge. The new problem is that component adoption outpaces component governance. Teams mutate shadcn/ui the moment they adopt it, and AI coding agents generate inconsistent UI when they lack structured documentation of the actual component system. Research shows 34% of AI-generated shadcn components had API errors without structured docs as context (0xminds, 2026). The shadcn/ui issue tracker documents the same accessibility failure pattern (missing DialogTitle/SheetDescription) across four separate bug reports. The prompt now generates documentation that serves as both a human reference and an AI agent context layer.

**Effect:** Output now includes structural contracts (required sub-components, composition rules), explicit keyboard mappings, specific ARIA attributes per element, and common implementation mistakes. Complex components like Dialog generate all new sections. Simple components like Badge correctly omit them. The old "product managers and designers" framing no longer appears in output.

---

## v4 — Live doc fetching mode (2024)

**What changed:** Added `buildPromptFromDocs()`, a second prompt path that accepts fetched MDX documentation instead of a JSON schema. Source documentation is injected as a grounding section at the end of the prompt.

**Why:** Schema-only generation worked well for internal libraries where schemas were the canonical source. For public libraries like shadcn/ui, the real documentation contains behavior details, composition patterns, and accessibility guidance that no schema captures. Feeding the model live docs instead of (or alongside) a schema produces richer, more accurate output.

**Effect:** Output for shadcn/ui components now references real composition patterns (e.g., Dialog > DialogTrigger + DialogContent), keyboard interactions from the actual Radix docs, and specific prop behaviors that weren't in any schema.

---

## v3 — Style guide integration (2024)

**What changed:** Extracted writing rules into `src/style-guide.js` and injected them as a separate prompt section. Added rules for modal verbs (never "should," "may," "shall"), word economy replacements, goal-before-task sentence structure, and inclusive language.

**Why:** The prompt was accumulating formatting rules inline, making it hard to maintain. Separating the style guide means editorial standards and template structure evolve independently. Also: early outputs used "should" and "may" heavily, which weakened the authority of the guidance. Switching to "must" and "can" made the output more direct.

**Effect:** Output became noticeably tighter. "Should" and "may" eliminated. Sentences shortened. Latin abbreviations disappeared.

---

## v2 — Em-dash ban and formatting enforcement (2024)

**What changed:** Added explicit ban on em-dashes. Added sentence-length cap (15-20 words). Added rule to always lead with positive framing and include a "why" for every guideline.

**Why:** Early outputs used em-dashes heavily, which created a recognizably AI-generated tone. Sentence length was creeping above 25 words, reducing scannability. The positive framing rule was added after reading Kuvaas and Selart (2004) on instructional framing: positive framing produces higher confidence in decision-making, which matters more than recall for documentation.

**Effect:** Output reads less like AI-generated text and more like a human-written style guide. Do's and Don'ts sections improved significantly — they now lead with clear guidance instead of a list of warnings.

---

## v1 — Initial prompt (2024)

**What changed:** First version of the prompt. Defined the template structure: component name, one-line summary, When to use, Do's and Don'ts, Anatomy, Variants, Placement, Editorial, Accessibility. Included the platform guidelines (Apple HIG, Material Design) as an inline reference.

**Why:** Built to replace the manual documentation process I was using at Amazon. The template mirrors the section structure I wrote by hand for 15+ components, encoded so the model follows the same editorial decisions consistently.

**Effect:** Generated first drafts that followed the correct structure and covered the right topics. Quality was uneven — some outputs were too long, some used passive voice, some hallucinated props. Each subsequent version addressed a specific failure mode.
