// Curated rules from the project style guide, scoped to what applies to component documentation.
// Full guide is in docs/style-guide.md.

export const styleGuide = `
## Style guide

Apply every rule in this section to every word you write.

### Voice and structure

- Address the reader as "you." Write in the second person throughout.
- Use active voice. Never passive.
- Use present tense. Use future tense only when an event happens later than, not immediately after, the action described.
- Use imperative sentences where possible. They are shorter and more direct.
- Put the goal before the task within each sentence. Start with the goal: "To avoid this issue, perform this task." Not: "Perform this task to avoid this issue."
- Document what the user does with the component, not what the component is.

### Word economy

Remove any word that doesn't add meaning. Replace the following phrases with their shorter equivalents:

- "have the opportunity to" → "can"
- "have the option to" → "can"
- "in order to" → "to"
- "must be able to" → "must"
- "whether or not" → "whether"
- "will be able to" → "can"
- "won't be able to" → "can't"
- "would like to" → "want to"
- "Note that" → omit entirely
- "Please" → omit entirely
- "You should" → omit entirely

### Modal verbs

- "can": use to express capability
- "must": use to express obligation
- "need to": use to express a requirement
- "might": use to express possibility
- Never use: may, shall, ought to, should, would, recommend, advise
- Replace "have to" with "must" or "need to"

### Sentences

- Keep sentences to 15-20 words or fewer where possible.
- Use complete sentences.
- Avoid gerunds. Use "use," not "using"; "run," not "running."
- Avoid nominalizations. "Decide" not "make a decision"; "fail" not "experience a failure."
- Keep adjectives and adverbs close to the words they modify.
- Use precise words with one meaning. Avoid "once" and "may."

### Tone

- Be helpful, not bossy.
- Use common contractions for a conversational tone. Avoid compound contractions.
- Prefer specific over general, concrete over abstract, definite over vague.
- Use standard terminology consistently. Choose one term and use it every time.

### Lists

- Use bulleted lists for items with no required order. Use numbered lists only for sequential steps.
- Make list items parallel in grammar and structure.
- Capitalize the first word of each list item.
- End list items with a period only if the item is a complete sentence. If one item needs a period, all items in the list need a period.
- Always introduce a list with a lead-in sentence ending in a colon.

### Headings

- Use sentence case for all headings (not title case). Capitalize only the first word and proper nouns.
- Never stack headings without body text between them.
- Don't use these headings: introduction, conclusion, summary, abstract.

### Numbers

- Spell out numbers one through nine. Use numerals for 10 and higher.
- Use numerals for all measurements. Include a space between the number and the unit.
- Use a comma separator for numbers of four digits or more.

### Inclusive language

Never use these terms. Use the inclusive alternative instead:

- blacklist → deny list
- whitelist → allow list
- master → primary, main, or control
- slave → replica or secondary
- grandfathered → pre-approved or legacy

Don't assume binary gender. Don't use he/she pronouns. Don't use ableist language.
Don't use "enable" when referring to a person.

### Accessibility language

- Use device-agnostic verbs. Use "select" not "click"; "enter" not "type."
- Don't use "see." Use "refer to."
- Don't use "above" or "below" to refer to content location. Use "preceding" or "following."
- Refer to UI elements by their label, not their color or shape.

### Latin and jargon

- No Latin abbreviations or phrases. Not "i.e.," "e.g.," "etc.," or "via."
- No slang, jargon, or colloquialisms.
- No foreign phrases if an everyday English equivalent exists.

### Acronyms

Spell out acronyms on first use, followed by the acronym in parentheses. On subsequent use, use the acronym alone.

Do not spell out these common acronyms: API, HTML, JSON, UI, URL, SDK, REST, SQL, AI, HTTPS, ID.
`;
