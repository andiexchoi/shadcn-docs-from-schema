# Prompt changelog

Documents what changed in the prompt, why, and what effect it had on output quality. Each entry corresponds to a meaningful change in `src/prompt.js`, `src/style-guide.js`, `src/platform-guidelines.js`, or `src/semantic-guidelines.js`.

---

## v5 — Audience reframe and semantic layer (2026)

- **What changed:** Reframed the audience from "product managers and designers" to "engineers, design engineers, and AI coding agents," added four template sections (Component contracts, Keyboard interactions, ARIA requirements, Common mistakes), introduced `src/semantic-guidelines.js`, extracted shared content into `buildSharedPromptBody`, added explicit section omission rules, raised `max_tokens` from 2000 to 4000, and expanded eval coverage by six cases.
- **Why:** Component adoption now outpaces component governance — AI coding agents generate wrong UI without structured context for team-mutated component systems, and research shows 34% of AI-generated shadcn components have API errors without structured docs as context (0xminds, 2026).
- **Effect:** Output now specifies structural contracts, keyboard mappings, ARIA attributes, and common-mistake callouts; complex components like Dialog emit all the new sections while simple ones like Badge correctly omit them.

---

## v4 — Live doc fetching mode (2024)

- **What changed:** Added `buildPromptFromDocs()` alongside `buildPrompt()`, accepting fetched MDX as the grounding source instead of a JSON schema.
- **Why:** Schemas alone miss behavior details, composition patterns, and accessibility guidance that live in each library's actual documentation.
- **Effect:** Output for shadcn/ui components now references real composition patterns, keyboard behaviors, and prop semantics pulled from the current upstream docs rather than schema inference.

---

## v3 — Style guide integration (2024)

- **What changed:** Extracted editorial rules into `src/style-guide.js` and added constraints on modal verbs, word economy, goal-before-task ordering, and inclusive language.
- **Why:** Inline formatting rules were hard to maintain, and "should"/"may"-heavy outputs weakened the authority of the guidance.
- **Effect:** Output tightened noticeably — "should" and "may" disappeared, sentences shortened, Latin abbreviations were eliminated.

---

## v2 — Em-dash ban and formatting enforcement (2024)

- **What changed:** Added an em-dash ban, a 15–20 word sentence cap, and rules to lead with positive framing and include a "why" for every guideline.
- **Why:** Early outputs had an em-dash-heavy, sentence-bloated, recognizably AI-generated tone, and positive framing was added after Kuvaas and Selart (2004) showed it produces higher confidence in decision-making.
- **Effect:** Output reads more like a human-written style guide; Do's and Don'ts sections lead with clear guidance instead of a list of warnings.

---

## v1 — Initial prompt (2024)

- **What changed:** First version of the prompt, defining the template (component name, one-line summary, When to use, Do's and Don'ts, Anatomy, Variants, Placement, Editorial, Accessibility) with Apple HIG and Material Design as inline references.
- **Why:** Replaced the manual documentation process I used at Amazon by encoding the same editorial structure the team had written by hand across 15+ components.
- **Effect:** Generated first drafts in the correct structure; quality was uneven — some too long, some passive, some with hallucinated props — which each subsequent version addressed.
