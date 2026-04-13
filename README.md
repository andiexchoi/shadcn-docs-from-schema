# What does this shadcn/ui component do?

Type a shadcn/ui component name and get structured documentation written for designers and product managers — not engineers. The tool fetches live docs directly from the shadcn/ui, Radix UI, and Base UI GitHub repositories, so the output is grounded in current source material, not training data.

You can also paste a JSON schema directly, which is useful if you're working with a custom or internal component library.

**[Live demo →](https://shadcn-docs-from-schema.vercel.app/)**

---

## Origin

I built the first version of this at Amazon, for the Selling Partner Services Mobile App team.

The team had developed an internal component framework for the seller app, but the system could only auto-generate raw technical references from JSON schemas. What was missing was the content that product managers and designers actually needed: when to use a component, when not to, how to handle edge cases, and what accessibility considerations applied.

There was no designated writer on the team. Engineers were writing guidance ad hoc, or not writing it at all. The result was inconsistent quality, missing sections, and a framework that was technically functional but hard for non-engineers to adopt.

I sat with engineers, reviewed JSON schemas, set up an iOS simulator to see components in context, and studied how PMs and designers were actually using the existing documentation. Then I noticed something: my own documentation process was mechanical in places. I was reading the same schema fields, writing the same sections in the same order, applying the same editorial standards every time. That pattern was encodable.

I built an AI agent that accepts a component's JSON schema and generates a structured first draft. Documentation time dropped from 3+ hours to 30 minutes per component. Engineers went from writing documentation to verifying it.

That tool was internal and couldn't be shown publicly. This is the rebuilt version, generalized to work with any component library, starting with shadcn/ui.

> *"Andie quickly stepped up to bridge that gap. She took the initiative to learn our components, defined a complete documentation process, partnered with me on priorities and timelines, worked closely with developers to fact-check details, and owned the publishing workflow from review to approval. Her work became a key enabler for the successful adoption of our new platform. Demonstrating the Learn and Be Curious leadership principle, she went further by developing an AI-powered tool that generates first-draft design documentation from a component's JSON input."*
>
> — Cecilia Fung, Senior Technical Product Manager, Amazon

---

## The design problem

Most component documentation fails designers in the same way: it tells them what a component does, not when to use it or why the rules are the rules.

The standard Do's and Don'ts format is scannable but shallow. Related guidelines get fragmented across bullets with no context linking them. A designer reading the list knows *what* to do but not *why*. Without the why, they can't make a good judgment call when their situation doesn't perfectly match the rule.

Research on instructional framing backs this up. Kuvaas and Selart (2004) found that positive framing produces lower recall but significantly higher confidence. In documentation, confidence matters more than perfect retention. You need to feel clear on the right action, not anxious about the wrong one. Tversky and Kahneman's framing effect research reinforces the same point: how you present information changes how people act on it, even when the content is identical.

The template this tool uses is designed around those findings.

---

## How the template works

The output follows a hybrid structure, developed after a format debate with the Mosaic engineering team:

**Do's and Don'ts at the top:** preserved for quick reference. Engineers can scan and maintain these without restructuring paragraphs. Designers get a fast answer when they're in a hurry.

**Structured sections below:** When to use, Anatomy, Variants and options, Placement, Editorial guidelines, Accessibility. Each section explains not just what to do but why, grounded in the component's real behavior. Sections are omitted when they don't apply: a simple Text component doesn't need a Placement section.

The full design rationale is in [`docs/design-philosophy.md`](docs/design-philosophy.md).

---

## How the tool is built

### Two input modes

**Fetch from docs:** type any shadcn/ui component name and the tool pulls raw MDX directly from the shadcn/ui, Radix UI, and Base UI GitHub repositories. The live source content becomes the grounding material for generation. The tool tries both the `base/` and `radix/` subdirectories in the shadcn repo and combines what it finds. This means the output reflects current documentation, not a snapshot from training data.

**Custom schema:** paste a JSON schema for any component. The schema determines what sections are generated and what gets covered. This is the no-hallucination constraint for custom libraries: the tool doesn't invent props or variants that aren't in the schema.

### The platform guidelines drive the reasoning

A curated knowledge layer in [`src/platform-guidelines.js`](src/platform-guidelines.js) contains best practices from Apple's Human Interface Guidelines and Google's Material Design: touch target sizes, disabled state guidance, label conventions, accessibility requirements, and more. This layer is injected into every prompt as a reference.

The model draws from this encoded knowledge rather than recalling best practices from training data. The result is guidance that's grounded and auditable: if something looks wrong, you can check it against the source file.

### The prompt is the core artifact

[`src/prompt.js`](src/prompt.js) is where the documentation philosophy becomes machine-readable: the section structure, the framing rules, the editorial standards, and the instruction to lead with positive framing and always include the "why." Most AI tools treat the prompt as an implementation detail. Here it's the primary design artifact: versioned, readable, and separable from the platform knowledge layer so both can be maintained independently.

### Output still requires human review

The tool generates first drafts. Engineers verify technical accuracy. Writers edit for voice, edge cases, and anything the source docs don't capture. This is intentional: the goal is to automate the mechanical scaffolding so the human work — judgment, accuracy, audience awareness — can happen faster.

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

**Generated output (excerpted):**

```markdown
# Button

Triggers a single, discrete action wherever a user needs to confirm, submit, or initiate something.

## When to use

Use a button when a user action produces an immediate result, like submitting a form, saving changes,
or opening a dialog. For link-style navigation to another page, use the `link` variant or a plain
anchor. For toggling between states, consider a toggle or checkbox instead.

## Variants and options

**Default:** the primary action. Use once per view for the most important thing the user can do.

**Destructive:** for actions that delete data or cannot be undone. Always pair with a confirmation dialog.

**Ghost:** low-emphasis actions where a filled or outlined button would compete with more important UI.

**Icon (size):** use only when the icon is universally understood. Always include an `aria-label`.

## Accessibility

Set `aria-label` on every icon-only button. The label names the action, not the icon: "Close dialog," not "X."

Use `aria-disabled="true"` instead of the HTML `disabled` attribute to keep the element in the tab
order while communicating that it's unavailable.

Use `aria-pressed` when the button toggles between two states. Update the value on each selection.

Both Enter and Space activate a button. Don't override or block these key bindings.
```

---

## Stack

- React + Vite
- Anthropic API (claude-sonnet-4-6)
- Live doc fetching from GitHub raw content (shadcn/ui, Radix UI, Base UI)
- Deployed on Vercel

---

## What's next

- Prompt versioning with change notes
- Eval system: test inputs with expected quality criteria, flag regressions
- Support for OpenAPI specs and TypeScript prop types as input formats
- Export to MDX
