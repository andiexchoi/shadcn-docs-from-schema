# Style Guide

This style guide is composed of rules for technical content. All of the rules in this document must be followed:

- Write a good introductory paragraph: A good introductory paragraph starts a topic in an interesting, informative way. Don't just repeat the title, provide information such as why you might want to do this task.

- Document the user's task, not the feature: Customers want to know what to do with a new feature. Write headings to make clear the task that the feature performs.

- Within each sentence, put the goal first and then the task: To place readers, start how-to sentences with descriptions of the goal they will accomplish first (what or why) and then describe the actions to do it (how). For example: "To do *this task*, use *this approach*." and "To avoid *this issue*, perform this *task*.".

## Language

- Always use active voice. Avoid passive voice.
- Use strong verbs.
- Prefer the specific to the general, the definite to the vague, and the concrete to the abstract.
- Always use present tense. Only use future tense when an event happens later than, not immediately after, the action under discussion.
- Always use inclusive and accessible language.
- If it is possible to remove a word without compromising clarity, always remove it.
- Don't use slashes to indicate multiple terms (such as and/or).
- Write only in the second person because you are directly addressing users. Always refer to the user as *you*.
- Don't use Latin abbreviations or phrases (also known as *Latinisms*).
- Hyphenate two or more words in the following circumstances:
  - Two or more words form compound adjectives that precede a noun.
  - Two words precede a noun and the second word ends in -ed or -ing.
  - One or two words preceding a noun is a number or a single letter; this includes compound fractions.
- Never use parentheses to indicate plural, such as (s) or (es). For example, the horse(s) and the peach(es). Use only the pluralized version of the words instead. For example, the horses and the peaches.
- Use a consistence voice and tone.
- Use imperative sentences when possible because they are shorter and more direct.
- Avoid excessive words. Be courteous but not wordy.
- Use contractions carefully for a more casual tone. Use common contractions. Avoid future tense (I'll). Don't use archaic ('twas), colloquial (ain't), or compound (couldn't've) contractions.
- Be careful to make your tone helpful, not bossy.
- Use modal verbs as follows:
  - be able to: Avoid.
  - can: Use to express capability.
  - could: Don't use could to mean *can* or *might*. Okay to use for something that already happened or that's in the past (for example, the server couldn't load).
  - have to: Replace with *must* or *need to*.
  - may: Avoid. Don't use *may* to mean *might* or *can*.
  - might: Use to express possibility. Don't substitute with *may*, which might be interpreted as providing permission.
  - must: Use to assert obligation.
  - need to: Use to express needs and requirements.
  - ought to: Don't use.
  - shall: Don't use.
  - should: Don't use.
  - will: Avoid if you can use present tense instead.
  - would: Avoid.
  - recommend: Avoid.
  - advise: Don't use.
- Don't use the following unnecessary words:
  - Have the opportunity to (use *can*)
  - Have the option to (use *can*)
  - In order to (use *to*)
  - Must be able to (use *must*)
  - Whether or not (use *whether*)
  - Will be able to (use *can*)
  - Won't be able to (use *can't*)
  - Would like to (use *want to*)
  - Note that (don't use)
  - Please (don't use)
  - You should (don't use)

## Global English

- Write for a global audience.
- Use American English.
- Use short words, short sentences, and short paragraphs. Where possible, limit your sentences to 25 words or fewer.
- Use complete sentences.
- Avoid foreign phrases, scientific words, or jargon words if an everyday English equivalent is available.
- Avoid gerunds and verbs that end with "ing". For example, use *work*, don't use *working*; use *run*, don't use *running*.
- Be careful with verb-like words that end in ed because they can be ambiguous. Add a determiner to clarify function.
- Keep adjectives and adverbs close to the words that they modify. Watch out for adverbs such as successfully and automatically and especially the word only.
- Avoid slang, jargon, and colloquialisms.
- Use standard terminology and formats: Don't try to find new, more interesting, or idiomatic ways to say the same thing. Choose one term, define it, and then use that same term every time.
- Use precise words that have only one meaning. Don't use these terms: once, may.
- Use clarifying pronouns: who, that.
- Use clarifying delimiters: a, an, the, this, such as, which.
- Avoid nominalizations where possible. Nominalizations make it difficult to identify the subject and action of a sentence. This makes translation and localization of the text more difficult. Nominalizations can also change a sentence to the passive voice.

## Titles

- Use title case for page titles and use sentence case for all other headings.
- When you write a title, think of it as your first and only opportunity to concisely communicate what your topic has to offer. In many contexts, a title might be the first and last thing that the reader will notice for a topic.
- Avoid titles that start with an article, such as a, an, or the.
- Keep titles short, descriptive, and unique. Use titles that are 50-60 characters for comprehension and discoverability.
- Don't stack headings. Be sure to include explanatory text in between headings.
- Don't use these headings: introduction, conclusion, summary, abstract.

## Tables

- Keep tables simple. Complex tables aren't accessible and can make it harder for users to understand.
- Include a lead-in sentence before a table.
- Use the last (rightmost) column for the longest or largest volume text, to prevent rendering issues.
- Use sentence case capitalization for column headings.
- Use column headers so a screen reader can locate rows and columns quicker.
- Use the words *Not applicable* or *None* in a cell when you need to indicate an empty or blank cell. Don't use *NA*, *N/A*, or dashes because these are not universally understood.
- Don't use tables as a way to format or stylize paragraphs; for example, to act as a banner or to right align text.
- Don't use rowspans in headings because this impacts accessibility. Instead, split a complex table with rowspans into multiple tables.
- Don't use notes and warnings in tables.
- Don't use screenshots or complex graphics in tables. You can use icons, if necessary, for scanability or for a visual reference.

## Code

- Format all API operations and API parameters in code tags to distinguish these from main text.
- Every word that is in snake case (snake_case), camel case (camelCase), kebab case (kebab-case), and Pascal case (PascalCase) must be in code tags (either "<code>exampleWord</code>" or "`exampleWord`").
- For every code block, specify its code language (in lowercase) to ensure the code renders correctly.

## Images

- Avoid images if possible. If you use an image, you must write descriptive alt text.
- Write lead-in content to introduce the image.
- Follow these guidelines for alt text:
  - State the most relevant point of the image, because alt text can't be structured.
  - To keep alt text brief, try to keep a maximum character count of 125, including spaces.
  - Always end alt text with a period, so that screen readers know when the alt text ends.
  - Don't start alt text with "Screenshot of," "Illustration of," or "Graphic of" because screen readers say this by default.
  - Don't start alt text with "A" followed by an acronym. To a screen reader, "A TV" sounds like "ATV."
  - Don't use color as a descriptor in alt text. For example, *a blue button*."
  - Don't describe markings that were added to images for visual location, such as a circle around a menu item.

## Accessibility

- Refer to a user interface (UI) label or title in an interface, not the color of the UI element.
- Refer to the actual text in a replaceable text example.
- Refer to the object label name in a graphical image, not the shape.
- Use colors that pass the minimum contrast for their size.
- Don't refer to the shape alone.
- Don't use sound as a reference point.
- Use the <span class="notranslate"> tag for UI labels. UI labels are in bold font. For example, *Select the <span class="notranslate">**Submit**</span> button.*
- For all bold font that is not surrounded by <span class="notranslate"></span> tags, ask if there should be <span class="notranslate"> tags.
- Use the terms *preceding*, *previous*, or *following* to refer to content or component locations on the same page.
- Direct customers to something in an interface, and use verbatim reference to the UI label or heading.
- Use consistent names and labels.
- Don't use the terms *above* or *below* in documentation, such as "the example above" or "the table below."
- Use device-agnostic verbs: Not everyone uses a mouse or keyboard, so use device-agnostic (independent) verbs. For example, use *choose* or *select* instead of *click*, and use *enter* instead of *type*.
- Use the correct headings hierarchy in topics to help screen readers properly map content.
- Don't use the word *see* in documentation. Use *refer to* instead.

## Links

Use link text that describes the target page's topic, such as the title of the page. Don't use vague or device-specific wording, such as *click here* or *this link*.

## Acronyms

- Spell out acronyms the first time that you use them on a page and follow them with the acronym in parentheses. Use the format: *spelled-out term (acronym)*. On subsequent use, use the acronym alone. If the first use of an acronym is in a heading, retain the acronym in the heading. Then write out the term in the following body text, followed by the acronym in parentheses. Don't spell out the term in the heading with the acronym included in parentheses.

The following lists common acronyms that we recommend you don't spell out.

- 3D: three-dimensional
- AI: artificial intelligence
- API: application programming interface
- HTML: hypertext markup language
- HTTP: hypertext transfer protocol
- HTTPS: hypertext transfer protocol secure
- ID: identifier
- JSON: JavaScript Object Notation
- REST: Representational State Transfer
- SDK: software development kit
- SQL: structured query language
- UI: user interface
- URL: uniform resource locator

## Formatting

- Structure content so that users can easily skim it. Dense content is difficult for users to digest.
- Use all caps for file format abbreviations, for example HTML. However, when you refer to an actual file name (such as `your_file.html`), use all lowercase letters and include the period. Put file names in code tags.
- For dates, use the format: month day, year. For example, October 1, 2022.

## Inclusive language

Language that's not inclusive can be harmful, exclusionary, or reinforce stereotypes.

| Non-inclusive terms (don't use) | Inclusive terms (use) |
|:---|:---|
| black day | blocked day |
| blacklist | deny list |
| grandfathered | pre-approved, pre-existing agreement, legacy approval |
| master | primary, main, control, leader, manager, root |
| slave | replica, secondary, standby |
| whitelist | allow list |

- Don't assume binary gender identities or he/she pronouns
- Don't use ableist terms that could cause harm to people with mental or physical health conditions
- Don't use language that could be perceived as derogatory or violent toward a particular person or group
- Don't use the term *enable* with respect to a human.

## Lists

- Only use numbered lists for tasks or items that must be in a specific order. Use bulleted lists for items that can appear in any order.
- Make lists parallel in grammar, content, and structure. Don't mix single words with phrases, don't start some phrases with a noun and others with a verb, and don't mix verb forms.
- Avoid callouts and notes within lists.
- Present items in alphabetical order if the order of items is arbitrary.
- Capitalize the first letter of the first word of each list item.
- Punctuate each list item with a period if a list item has more than one sentence. Don't punctuate list items that are not complete sentences.
- Punctuate list items consistently. If at least one item in a list requires a period, use a period for all items in that list.
- Use introductory sentences for lists.
- Introductory sentences for lists should end with a colon if the list does not have a title.

## Numbers

- Spell out cardinal numbers from one through nine.
- Use numerals for cardinal numbers 10 and higher.
- Spell out ordinal numbers. For example, first and second.
- Use a comma separator for numbers of four digits or more.
- Use numerals for all measurement-based references, including time. Include a space between the number and the abbreviation for the unit of measure.
