# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## checkbox

```yaml
component: Checkbox
summary: A binary toggle control that lets users select or deselect a single option independently of other options on the page.
use_when:
  - Use a checkbox when a user needs to turn a setting on or off, or select one or more items from a list.
  - Reach for a radio group instead when only one option can be active at a time.
do:
  - Pair every checkbox with a visible label using Field and FieldLabel.
  - Use defaultChecked for uncontrolled state and checked with onCheckedChange for controlled state.
  - Group related checkboxes together using multiple Field components inside a shared container.
dont:
  - "Don't use onClick to manage checked state. Use onCheckedChange instead, or you'll break Escape key behavior and external close triggers."
anatomy: "The checkbox has two visible parts: the control and the label. The control is the square toggle that displays a checkmark when selected. The label, rendered via FieldLabel, identifies the option. Add a FieldDescription inside FieldContent when the option needs clarifying text below the label. In a disabled state, set the disabled prop on the checkbox and add data-disabled to the Field wrapper to apply disabled styles correctly."
contracts:
  - Wrap each Checkbox in a Field component. Field provides layout, labeling context, and state styling hooks.
  - Use FieldLabel as the visible label. Do not substitute placeholder text or adjacent plain text.
  - To show invalid state, set aria-invalid directly on the Checkbox and set data-invalid on the Field wrapper.
  - To show disabled state, set disabled on the Checkbox and set data-disabled on the Field wrapper.
variants:
  - "defaultChecked: Use for uncontrolled checkboxes where you don't need to track state in React."
  - "checked + onCheckedChange: Use for controlled checkboxes where your component owns the state."
  - "disabled: Prevents user interaction. Pair with data-disabled on the Field wrapper for correct styling."
  - "aria-invalid: Triggers invalid visual state. Pair with data-invalid on the Field wrapper."
placement: Place the checkbox control to the left of its label. In a checkbox group, stack fields vertically with consistent spacing between each Field wrapper.
editorial:
  - "Start the label with a noun or verb that clearly names the option: \"Enable notifications,\" not \"Notifications.\""
  - Use sentence case. Capitalize only the first word and proper nouns.
  - Keep labels under 60 characters. Move longer explanations into FieldDescription.
  - Do not end labels with a period.
keyboard:
  - "Space: Toggles the checkbox between checked and unchecked."
  - "Tab: Moves focus to the next focusable element."
  - "Shift+Tab: Moves focus to the preceding focusable element."
aria:
  - "role=\"checkbox\": The primitive sets this automatically on the control element."
  - "aria-checked: Set to \"true\" when checked, \"false\" when unchecked, \"mixed\" for indeterminate state."
  - "aria-invalid: Set directly on the Checkbox element when the field has a validation error."
  - "aria-labelledby or a wrapping label: FieldLabel handles this association. Do not remove FieldLabel and substitute aria-label alone."
a11y: Ensure visible focus indicators remain on the checkbox control. Do not suppress the outline without providing an equivalent custom focus style. Convey invalid state with both aria-invalid and a visible error message, not color alone, to meet WCAG AA contrast requirements.
mistakes:
  - "Omitting Field and FieldLabel: Rendering <Checkbox /> alone leaves the control without an accessible name. Always wrap the checkbox in Field and pair it with FieldLabel."
  - "Using onClick instead of onCheckedChange: onClick bypasses the primitive's internal state management. This breaks keyboard toggling and causes the visual state to desync from the actual value."
  - "Forgetting data-disabled or data-invalid on Field: The disabled and aria-invalid props update the control, but the Field wrapper needs its own data attributes to apply the correct surrounding styles."
```
