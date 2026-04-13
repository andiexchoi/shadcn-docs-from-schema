# shadcn docs from schema

Generate structured component documentation from a JSON schema. Built for designers and product managers who need to know *when* and *how* to use a component, not how it's built.

**[Live demo →](https://shadcn-docs-from-schema.vercel.app/)**

---

## Origin

I built the first version of this at Amazon, for the Mosaic mobile team.

The team had developed an internal component framework for the seller app, but the system could only auto-generate raw technical references from JSON schemas. What was missing was the content that product managers and designers actually needed: when to use a component, when not to, how to handle edge cases, what accessibility considerations applied.

There was no designated writer on the team. Engineers were writing guidance ad hoc — or not writing it at all. The result was inconsistent quality, missing sections, and a framework that was technically functional but hard for non-engineers to adopt.

I sat with engineers, reviewed JSON schemas, set up an iOS simulator to see components in context, and studied how PMs and designers were actually using the existing documentation. Then I noticed something: my own documentation process was mechanical in places. I was reading the same schema fields, writing the same sections in the same order, applying the same editorial standards every time. That pattern was encodable.

I built an AI agent that accepts a component's JSON schema and generates a structured first draft. Documentation time dropped from 3+ hours to 30 minutes per component. Engineers went from writing documentation to verifying it.

That tool was internal and couldn't be shown publicly. This is the rebuilt version — generalized to work with any component library, starting with shadcn/ui.

> *"Andie quickly stepped up to bridge that gap. She took the initiative to learn our components, defined a complete documentation process, partnered with me on priorities and timelines, worked closely with developers to fact-check details, and owned the publishing workflow from review to approval. Her work became a key enabler for the successful adoption of our new platform. Demonstrating the Learn and Be Curious leadership principle, she went further by developing an AI-powered tool that generates first-draft design documentation from a component's JSON input."*
>
> — Cecilia Fung, Senior Technical Product Manager, Amazon

---

## The design problem

Most component documentation fails designers in the same way: it tells them what a component does, not when to use it or why the rules are the rules.

The standard Do's and Don'ts format is scannable but shallow. Related guidelines get fragmented across bullets with no context linking them. A designer reading the list knows *what* to do but not *why* — and without the why, they can't make a good judgment call when their situation doesn't perfectly match the rule.

Research on instructional framing backs this up. Kuvaas and Selart (2004) found that positive framing produces lower recall but significantly higher confidence. In documentation, confidence matters more than perfect retention — a designer needs to feel clear on the right action, not anxious about the wrong one. Tversky and Kahneman's framing effect research reinforces the same point: how you present information changes how people act on it, even when the content is identical.

The template this tool uses is designed around those findings.

---

## How the template works

The output follows a hybrid structure, developed after a format debate with the Mosaic engineering team:

**Do's and Don'ts at the top** — preserved for quick reference. Engineers can scan and maintain these without restructuring paragraphs. Designers get a fast answer when they're in a hurry.

**Structured sections below** — When to use, Anatomy, Variants and options, Placement, Editorial guidelines, Accessibility. Each section explains not just what to do but why, grounded in the component's real behavior. Sections are omitted when they don't apply — a simple Text component doesn't need a Placement section.

The full design rationale is in [`docs/design-philosophy.md`](docs/design-philosophy.md).

---

## How the tool is built

### The schema drives the structure

The component's JSON schema determines what sections are generated and what gets covered. This is the no-hallucination constraint: the tool doesn't invent props or variants that aren't in the schema.

### The platform guidelines drive the reasoning

A curated knowledge layer in [`src/platform-guidelines.js`](src/platform-guidelines.js) contains best practices from Apple's Human Interface Guidelines and Google's Material Design — touch target sizes, disabled state guidance, label conventions, accessibility requirements, and more. This is injected into the prompt as a reference layer.

The model draws from this encoded knowledge rather than recalling best practices from training data. The result is guidance that's grounded and auditable: if something looks wrong, you can check it against the source file.

### The prompt is the core artifact

[`src/prompt.js`](src/prompt.js) is where the documentation philosophy becomes machine-readable: the section structure, the framing rules, the editorial standards, the instruction to lead with positive framing and always include the "why." Most AI tools treat the prompt as an implementation detail. Here it's the primary design artifact — versioned, readable, and separable from the platform knowledge layer so both can be maintained independently.

### Output still requires human review

The tool generates first drafts. Engineers verify technical accuracy. Writers edit for voice, edge cases, and anything the schema doesn't capture. This is intentional: the goal is to automate the mechanical scaffolding so the human work — judgment, accuracy, audience awareness — can happen faster.

> *"You did a darn good job running things and keeping us in check."*
>
> — Matt Caruano, Engineering, Amazon, after a documentation sprint

---

## Example: Button

**Input schema:**

```json
{
  "component": "Button",
  "props": {
    "variant": {
      "type": "enum",
      "values": ["default", "destructive", "outline", "secondary", "ghost", "link"],
      "default": "default"
    },
    "size": {
      "type": "enum",
      "values": ["default", "sm", "lg", "icon"],
      "default": "default"
    },
    "disabled": {
      "type": "boolean",
      "default": false
    }
  }
}
```

**Generated output:**

```markdown
# Button

Triggers a single action. Use when you need a clear, tappable call to action — 
submitting a form, confirming a choice, or navigating to the next step.

## When to use

Use a button when the action is the primary thing you want the user to do. 
For navigation between pages, use a link. For actions inside a form that 
aren't submission, consider whether a button or an inline control is more 
appropriate.

## Do's and don'ts

**Do**
- Use verb-noun labels that describe the outcome: "Save changes," "Delete account"
- Keep labels under 3 words — never let a button label wrap to two lines
- Use one primary (filled) button per view

**Don't**
- Don't use vague labels like "OK," "Yes," or "Submit" without context
- Don't use a disabled button as a loading state — use a loading indicator instead

## Variants and options

**Default** — the primary action. Use once per view for the most important thing 
you want the user to do.

**Destructive** — for actions that delete data or cannot be undone. Always pair 
with a confirmation dialog before executing the action.

**Outline** — secondary actions that sit alongside a primary button.

**Ghost** — low-emphasis actions where the visual weight of a filled or outlined 
button would compete with more important UI.

**Link** — for navigation, not actions. If pressing it routes the user somewhere 
rather than doing something, use a link variant.

**Icon (size)** — use only when the icon is universally understood in context. 
Always include an accessible label.

## Accessibility

Every button needs an accessible name — use the visible label text where 
possible. For icon-only buttons, add aria-label describing the action.

Buttons are keyboard-activatable with Enter and Space. Do not intercept 
these keys for other purposes.

Avoid disabled buttons where possible. If you must disable a button, 
make it clear why — and how to enable it. An unexplained disabled button 
is a dead end.

Minimum touch target: 44×44pt on iOS, 48×48dp on Android. Use padding 
to extend the tap area rather than increasing the visible button size.
```

---

## Quick start

```bash
git clone https://github.com/andieschoi/shadcn-docs-from-schema
cd shadcn-docs-from-schema
npm install
echo "ANTHROPIC_API_KEY=your-key-here" > .env
npm run dev
```

Open `localhost:5173`. Select a component from the examples bar or paste your own JSON schema.

---

## Stack

- React + Vite
- Anthropic API (claude-sonnet-4-6)
- Deployed on Vercel

---

## What's next

- Prompt versioning with change notes
- Eval system: test inputs with expected quality criteria, flag regressions
- Support for OpenAPI specs and TypeScript prop types as input formats
- Export to MDX
