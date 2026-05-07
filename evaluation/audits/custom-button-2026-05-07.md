---
component: Custom Button
date: 2026-05-07
input_mode: example schema
model: claude-sonnet-4-6
---

# Audit: Custom Button

Assisted-reading audit for one generation of the Custom Button doc. Part 1 (Source fidelity) and Part 2 (Prompt conformance) are the checks defined in [`docs/rubric.md`](../../docs/rubric.md). The script generated the doc, fetched the source, ran the substring scans, and pre-extracted claim rows. Verdicts and notes are filled in by hand.

---

## Generated doc

```markdown
# Button

Triggers an action or event when selected, and is the right reach when you need a clickable control that submits a form, initiates an async operation, or confirms a user decision.

## When to use

Use Button when the user's selection triggers an immediate action: submitting a form, saving changes, deleting a record, or starting an async process. It works for both synchronous and async flows through the `loading` prop.

**Use an alternative when:**
- Link: the action navigates to a new URL rather than triggering a function.
- IconButton or another control: the surface calls for a toggle, checkbox, or switch that represents a persistent state rather than a one-time action.

## Do's and don'ts

**Do**
- Default: use the `critical` variant only for actions that permanently delete data or cannot be undone. Override with the `default` variant when the action can be undone within the same session, such as archiving a record with an undo affordance, because `critical` is the highest severity on the product scale and applying it to reversible actions trains users to ignore the visual warning.
- Default: provide `loadingText` when `loading` is true on a button with a short label. Override by omitting `loadingText` when the button label is already a verb phrase that describes the in-progress state, such as "Uploading file," because a spinner replacing a one-word label gives users no information about what is happening.

**Don't**
- Don't use the variant name `destructive`. This component renames that upstream variant to `critical` to match the product severity scale. Using `destructive` will not resolve to a valid variant.

## Anatomy

Button consists of a label, an optional leading icon, and an optional loading spinner. The spinner renders at the inline-start position when `loading` is true. The button locks its minimum width during loading to prevent layout shift when `loadingText` replaces the visible label. In `icon` size, the button renders as a square and contains only an icon with no label.

## Variants and patterns

- **`default` variant:** use for the primary action in a view, the most likely positive action a user will take.
- **`secondary` variant:** use for supporting actions that sit alongside a primary action.
- **`outline` variant:** use for medium-emphasis actions that need less visual weight than `default`.
- **`ghost` variant:** use for low-emphasis actions in toolbars or dense UI where a bordered button would create visual noise.
- **`link` variant:** use when the action has the visual weight of inline text but still triggers a function rather than navigating.
- **`critical` variant:** use for permanent, irreversible actions such as deleting a record. This variant replaces the upstream `destructive` variant.
- **Loading state:** set `loading` to `true` with an async action to block double-submission and show a spinner. Pair with `loadingText` on short labels.
- **Icon-only button:** set `size` to `icon` and include a single icon child. Always add an `aria-label` because there is no visible text label.
- **`focusTrap` pattern:** set `focusTrap` to `true` when the button is the only focusable element in a modal footer, so Tab wraps back to it instead of escaping the modal.
- **`asChild` pattern:** set `asChild` to `true` to merge button props onto a custom child element, such as a router link that must render as a `<button>`.

## Placement and layout

Place the primary action button on the trailing side of a button group. When two buttons appear together, limit prominent variants to one. In modal footers, pair `focusTrap` with this placement so focus does not escape to background content.

## Editorial guidelines

- Start button labels with an action verb: "Save changes," "Delete record," "Upload file."
- Keep labels under 30 characters.
- Use sentence case: capitalize only the first word and proper nouns.
- Write `loadingText` as a present-progressive verb phrase to signal an in-progress state: "Saving…," "Deleting…," "Uploading…."

## Keyboard interactions

- `Enter`: activates the button.
- `Space`: activates the button.

*Generated from training knowledge. No verified source excerpts available for this component.*

## ARIA requirements

- `role="button"`: applied to the root element automatically by the native `<button>` element.
- `aria-disabled`: set automatically to `true` when `loading` is `true`. Do not set `disabled` on the element directly during loading, as it removes the element from the accessibility tree.
- `aria-busy="true"`: set automatically during loading to signal an in-progress operation to screen readers.
- `aria-label`: required on icon-only buttons (`size="icon"`) because there is no visible text label for screen readers to announce.

*Generated from training knowledge. No verified source excerpts available for this component.*

## Accessibility

Screen readers announce the `loadingText` value when loading begins. When `loadingText` is omitted, `aria-busy` alone signals the state change, which provides less context. To support users who prefer reduced motion, ensure any spinner animation respects the `prefers-reduced-motion` media query at the CSS layer.

## Common mistakes

- **Using `disabled` instead of `loading` for async actions:** setting the native `disabled` attribute removes the button from the tab order and accessibility tree. Use `loading={true}` instead, which sets `aria-disabled` and `aria-busy` while keeping the element focusable and announced.
- **Using the variant name `destructive`:** this component renames the upstream shadcn/ui variant to `critical`. Passing `variant="destructive"` will not match any defined variant. Use `variant="critical"`.
- **Omitting `aria-label` on icon-only buttons:** `size="icon"` renders a square button with no visible text. Without `aria-label`, screen readers have nothing to announce. Add a concise `aria-label` that names the action.
- **Setting `loadingText` to a noun phrase instead of a verb phrase:** `loadingText="Save"` duplicates the idle label and adds no information. Use a present-progressive phrase like "Saving…" to communicate that the action is in progress.

## Decisions to verify

- Is `variant` set to `critical` only for actions that are permanent and cannot be undone?
- Is `loading` paired with `loadingText` on buttons whose idle label is a single word or short phrase?
- Does every icon-only button (`size="icon"`) have an `aria-label`?
- Is `focusTrap` enabled only when the button is the sole focusable element in a modal footer?
- Is `asChild` used with a child component that forwards refs and spreads props, so focus management and keyboard behavior are preserved?
- Are prominent variants (`default`, `critical`) limited to one or two per view?

## Platform compliance checklist

- Verify that buttons trigger instantaneous actions and clearly communicate their function through style, content, and role. Assign the primary role to the most likely non-destructive action, and never assign the primary role to a destructive action even if it is the most likely choice.
  Source: Apple HIG · `apple-hig-buttons-purpose`, `apple-hig-buttons-role-primary`, `apple-hig-buttons-destructive`
  URL: https://developer.apple.com/design/human-interface-guidelines/buttons

- Verify that the `critical` variant receives destructive styling and is never treated as the primary action. On Apple platforms, destructive buttons use system red. On Material Design 3 platforms, do not assign filled-button emphasis to destructive actions.
  Source: Apple HIG · `apple-hig-buttons-destructive`
  URL: https://developer.apple.com/design/human-interface-guidelines/buttons

- Verify that prominent button styles are reserved for the most likely actions and limited to one or two per view. Use style, not size, to distinguish the preferred choice among a set of options.
  Source: Apple HIG · `apple-hig-buttons-hierarchy`, `apple-hig-buttons-choice-styling`
  URL: https://developer.apple.com/design/human-interface-guidelines/buttons

- Verify that button labels describe the action that occurs when activated. On Apple platforms, consider starting with a verb and use title-style capitalization. On Material Design 3 platforms, keep labels brief (ideally 1–3 words) and use sentence case.
  Source: Apple HIG · `apple-hig-buttons-labeling` / URL: https://developer.apple.com/design/human-interface-guidelines/buttons
  Source: Material Design 3 · `material3-buttons-labeling` / URL: https://m3.material.io/components/buttons/guidelines

- Verify that icon buttons use familiar symbols that clearly communicate the action, and that when an icon accompanies a text label, the icon is placed on the leading side before the label text.
  Source: Apple HIG · `apple-hig-buttons-icon`
  URL: https://developer.apple.com/design/human-interface-guidelines/buttons
  Source: Material Design 3 · `material3-buttons-icon-placement`
  URL: https://m3.material.io/components/buttons/guidelines

- Verify that buttons triggering actions that do not complete instantly display a loading indicator, and where helpful, an updated label. Verify that buttons have a hit region of at least 44×44 pt (60×60 pt in visionOS) and include a visible press state.
  Source: Apple HIG · `apple-hig-buttons-loading-state`, `apple-hig-buttons-touch-target`, `apple-hig-buttons-press-state`
  URL: https://developer.apple.com/design/human-interface-guidelines/buttons
```

---

## Source

Schema input from `src/examples/index.js` (`Custom Button`).

```json
{
  "component": "Button",
  "description": "Triggers an action or event when clicked. Customized from the upstream shadcn/ui Button with loading states, a renamed destructive variant, and focus trap behavior for modal contexts.",
  "props": {
    "variant": {
      "type": "enum",
      "values": [
        "default",
        "outline",
        "ghost",
        "critical",
        "secondary",
        "link"
      ],
      "default": "default",
      "description": "Controls the visual style of the button. 'critical' replaces the upstream 'destructive' variant to align with the product's severity taxonomy.",
      "reason": "'critical' was renamed from 'destructive' after user research in Q3 2024 found that 'destructive' tested as alarming for low-severity actions like archiving a record. The product severity scale is info, warning, critical — this variant maps to critical."
    },
    "size": {
      "type": "enum",
      "values": [
        "default",
        "sm",
        "lg",
        "icon"
      ],
      "default": "default",
      "description": "Controls the size of the button. Icon size produces a square button for icon-only use."
    },
    "loading": {
      "type": "boolean",
      "default": false,
      "description": "Shows a spinner and disables interaction. The button retains its dimensions to prevent layout shift.",
      "reason": "Prevents double-submission on async actions. The button stays in place visually so the user knows their action was received."
    },
    "loadingText": {
      "type": "string",
      "default": null,
      "description": "Replaces the button label while loading is true. If omitted, the original label remains visible next to the spinner."
    },
    "focusTrap": {
      "type": "boolean",
      "default": false,
      "description": "When true, pressing Tab from this button wraps focus back to it instead of moving to the next element. Use inside modal footers where the button is the only focusable element."
    },
    "asChild": {
      "type": "boolean",
      "default": false,
      "description": "Merges props onto the child element instead of rendering a button."
    }
  },
  "attributes": {
    "data-loading": {
      "values": [
        "true"
      ],
      "description": "Present when loading is true. Use for CSS-only loading styles."
    }
  },
  "rules": [
    {
      "rule": "Use the critical variant only for actions that permanently delete data or cannot be undone.",
      "reason": "critical is the highest severity on the product scale. Applying it to reversible actions trains users to ignore the visual warning.",
      "override": "Override with the default variant when the action can be undone within the same session, such as archiving a record with an undo affordance."
    },
    {
      "rule": "Always provide loadingText when loading is true on a button with a short label.",
      "reason": "A spinner replacing a one-word label gives users no information about what is happening. loadingText like 'Saving...' or 'Deleting...' closes that gap.",
      "override": "Omit loadingText when the button label is already a verb phrase that describes the in-progress state ('Uploading file'), because the label already communicates progress."
    }
  ],
  "notes": {
    "upstreamDivergence": "This component diverges from upstream shadcn/ui Button in three ways: (1) 'destructive' variant renamed to 'critical', (2) loading and loadingText props added, (3) focusTrap prop added for modal contexts. Upstream docs do not cover these props.",
    "loading": "The loading spinner renders inside the button at inline-start position. The button's min-width is locked to prevent layout shift when loadingText changes the label length.",
    "critical": "The 'critical' variant uses the same visual treatment as upstream 'destructive' but is renamed to match the product severity scale: info, warning, critical."
  },
  "accessibility": {
    "role": "button",
    "keyboardInteraction": [
      "Enter",
      "Space"
    ],
    "ariaAttributes": [
      "aria-disabled (set automatically when loading is true)",
      "aria-busy (set to true during loading)"
    ],
    "loadingBehavior": "Screen readers announce the loadingText value when loading begins. If no loadingText is set, aria-busy alone signals the state change."
  }
}
```

---

## Part 1 — Source fidelity

Every factual claim in the generated doc traces back to a line in the source. Verify each row by finding the matching line in the source above (or noting that no match exists).

### Props, variants, and option values mentioned

| Claim | Source line / file | Verdict | Notes |
|---|---|---|---|
| `apple-hig-buttons-choice-styling` |  | ✓ / ✗ |  |
| `apple-hig-buttons-destructive` |  | ✓ / ✗ |  |
| `apple-hig-buttons-hierarchy` |  | ✓ / ✗ |  |
| `apple-hig-buttons-icon` |  | ✓ / ✗ |  |
| `apple-hig-buttons-labeling` |  | ✓ / ✗ |  |
| `apple-hig-buttons-loading-state` |  | ✓ / ✗ |  |
| `apple-hig-buttons-press-state` |  | ✓ / ✗ |  |
| `apple-hig-buttons-purpose` |  | ✓ / ✗ |  |
| `apple-hig-buttons-role-primary` |  | ✓ / ✗ |  |
| `apple-hig-buttons-touch-target` |  | ✓ / ✗ |  |
| `asChild` |  | ✓ / ✗ |  |
| `critical` |  | ✓ / ✗ |  |
| `default` |  | ✓ / ✗ |  |
| `destructive` |  | ✓ / ✗ |  |
| `disabled` |  | ✓ / ✗ |  |
| `focusTrap` |  | ✓ / ✗ |  |
| `ghost` |  | ✓ / ✗ |  |
| `icon` |  | ✓ / ✗ |  |
| `link` |  | ✓ / ✗ |  |
| `loading` |  | ✓ / ✗ |  |
| `loadingText` |  | ✓ / ✗ |  |
| `material3-buttons-icon-placement` |  | ✓ / ✗ |  |
| `material3-buttons-labeling` |  | ✓ / ✗ |  |
| `outline` |  | ✓ / ✗ |  |
| `prefers-reduced-motion` |  | ✓ / ✗ |  |
| `secondary` |  | ✓ / ✗ |  |
| `size` |  | ✓ / ✗ |  |
| `true` |  | ✓ / ✗ |  |
| `variant` |  | ✓ / ✗ |  |

### ARIA attributes mentioned

| Claim | Source line / file | Verdict | Notes |
|---|---|---|---|
| `aria-busy` |  | ✓ / ✗ |  |
| `aria-disabled` |  | ✓ / ✗ |  |
| `aria-label` |  | ✓ / ✗ |  |

### Keyboard keys mentioned

| Claim | Source line / file | Verdict | Notes |
|---|---|---|---|
| `Delete` |  | ✓ / ✗ |  |
| `Enter` |  | ✓ / ✗ |  |
| `Space` |  | ✓ / ✗ |  |
| `Tab` |  | ✓ / ✗ |  |

### Sub-components mentioned

| Claim | Source line / file | Verdict | Notes |
|---|---|---|---|
| `Enter` |  | ✓ / ✗ |  |
| `IconButton` |  | ✓ / ✗ |  |
| `Space` |  | ✓ / ✗ |  |

### Other claims (add rows for anything the extractor missed)

| Claim | Source line / file | Verdict | Notes |
|---|---|---|---|
|  |  | ✓ / ✗ |  |

---

## Part 2 — Prompt conformance

### Style rules (auto-scanned)

- **No em-dashes**: ✓ pass (no hits)
- **No "should"**: ✓ pass (no hits)
- **No "may"**: ✓ pass (no hits)
- **No Latin abbreviations (i.e., e.g., etc.)**: ✓ pass (no hits)
- **No "is/are displayed/rendered/shown"**: ✓ pass (no hits)
- **No "Click here"**: ✓ pass (no hits)
- **No "Note that" / "Please" / "You should"**: ✓ pass (no hits)

### Structural rules (auto-scanned)

- **Component heading present**: ✗ (got `# Button`)
- **Sections present** (12):
  - When to use
  - Do's and don'ts
  - Anatomy
  - Variants and patterns
  - Placement and layout
  - Editorial guidelines
  - Keyboard interactions
  - ARIA requirements
  - Accessibility
  - Common mistakes
  - Decisions to verify
  - Platform compliance checklist
- **Do appears before Don't**: ✓
- **Alternatives listed**: 2 ✓
- **Variants listed**: 10 ✓
- **Decisions to verify**: 6 ✓

### Section omission rules (verified by hand)

For each section that *is* present, was it required for this component? For each *expected* section that's absent, was the omission justified by the rules in `src/prompt.js`?

| Section | Present? | Should be present? | Verdict |
|---|---|---|---|
| When to use | | | |
| Do's and don'ts | | | |
| Anatomy | | | |
| Component contracts | | | |
| Variants and patterns | | | |
| Placement and layout | | | |
| Editorial guidelines | | | |
| Keyboard interactions | | | |
| ARIA requirements | | | |
| Accessibility | | | |
| Common mistakes | | | |
| Decisions to verify | | | |
| Platform compliance checklist | | | |

### Editorial rules (read by hand)

- **Every guideline carries a "why"**: ✓ / ✗ — Notes:
- **Default/override form used in Do's, Editorial, Variants, Placement, Common mistakes**: ✓ / ✗ — Notes:
- **Quantitative thresholds named where rules depend on quantity**: ✓ / ✗ — Notes:
- **Output budget per section respected (no sprawl past caps)**: ✓ / ✗ — Notes:

---

## Summary

- **Source fidelity verdict**:
- **Prompt conformance verdict**:
- **Other observations**:
