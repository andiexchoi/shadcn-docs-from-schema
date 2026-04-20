# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## checkbox

```yaml
component: Checkbox
summary: Lets a user toggle a single binary choice on or off, most often within a form or settings panel.
use_when:
  - Use a checkbox when a user can independently enable or disable an option without affecting other options in the same set.
  - For mutually exclusive choices, use a radio group instead.
do:
  - Pair every checkbox with a visible label using Field and FieldLabel.
  - Use defaultChecked for uncontrolled checkboxes and checked + onCheckedChange for controlled ones.
  - Group related checkboxes with multiple Field components to form a list.
dont:
  - "Don't use onClick to manage checked state; use onCheckedChange to keep Radix's internal state in sync."
  - "Don't substitute placeholder text or screen-reader-only text for a visible label."
anatomy: The checkbox consists of a control (the toggleable box), an optional indicator (the check icon rendered when checked), and a label associated through Field and FieldLabel. An optional description renders below the label using FieldContent and FieldDescription. The field wrapper (Field) carries data-disabled and data-invalid attributes that drive disabled and error styles across all child elements.
contracts:
  - Wrap each Checkbox in a Field component. Field provides the data-disabled and data-invalid propagation that drives visual states across the label and description.
  - Associate a label with FieldLabel inside Field. A checkbox without a visible label fails accessibility requirements.
  - To show an error state, set aria-invalid on Checkbox and data-invalid on Field. Setting only one produces incomplete styling.
variants:
  - "defaultChecked: Use for uncontrolled checkboxes where you don't need to track state in React."
  - "checked + onCheckedChange: Use for controlled checkboxes where external state drives the value."
  - "disabled: Prevents interaction; pair with data-disabled on Field to apply disabled styles to the label and description."
  - "aria-invalid: Triggers error styles on the control; pair with data-invalid on Field for full error styling."
placement: Place the checkbox to the left of its label. When building a checkbox group, stack Field components vertically with consistent spacing between each item.
editorial:
  - Write labels as short noun phrases or sentence fragments, not full sentences.
  - Use sentence case. Do not capitalize every word.
  - Do not end labels with a period.
  - Keep labels to five words or fewer where possible.
keyboard:
  - "Space: Toggles the checkbox between checked and unchecked."
  - "Tab: Moves focus to the checkbox."
  - "Shift+Tab: Moves focus away from the checkbox in reverse order."
aria:
  - "aria-invalid=\"true\": Set on Checkbox to signal an error state to screen readers."
  - "aria-checked: Managed automatically by the primitive; do not set manually."
  - "aria-labelledby or a wrapping label: Required on every checkbox; use FieldLabel inside Field to satisfy this automatically."
a11y:
  - Never use color alone to indicate an error state; always pair the error color with aria-invalid so screen readers announce the invalid condition.
  - "The check indicator is decorative and must be hidden from screen readers with aria-hidden=\"true\" if rendered as a standalone icon element."
mistakes:
  - "Using onClick instead of onCheckedChange: This breaks Radix's internal state, causing the component to desync from external interactions such as form reset. Use onCheckedChange exclusively."
  - "Omitting Field and FieldLabel: Without Field, the data-disabled and data-invalid attributes don't propagate, so disabled and error styles only apply to the control, not the label or description."
  - "Setting aria-invalid without data-invalid on Field (or vice versa): The error styles are split between the control and the field wrapper; you must set both to render a complete error state."
```
