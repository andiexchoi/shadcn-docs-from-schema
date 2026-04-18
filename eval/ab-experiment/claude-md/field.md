# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## field

```yaml
component: Field
summary: Wrap a form control with its label, helper text, and validation message to produce a fully accessible, consistently spaced form field.
use_when:
  - Use Field whenever you pair a control (input, select, switch, checkbox) with a visible label.
  - Use FieldSet with FieldLegend when you need to group related fields, such as an address block or notification preferences.
do:
  - Connect FieldLabel to its control with a matching htmlFor and id pair.
  - Add data-invalid to Field and aria-invalid to the input together when a field fails validation.
  - Use FieldSet and FieldLegend to group related controls so screen readers announce the group name.
dont:
  - "Don't use placeholder text as a substitute for FieldLabel. Placeholder text disappears on focus and isn't reliably announced by screen readers. Use a visible FieldLabel instead."
  - "Don't render FieldError without also setting aria-invalid on the input. Without aria-invalid, assistive technologies won't associate the error state with the control."
anatomy: Field wraps a single control and its supporting text. It contains FieldLabel (above the control), the control itself, an optional FieldDescription (helper text), and an optional FieldError (validation message). FieldContent groups label and description as a flex column, useful when the label sits beside the control. FieldGroup stacks multiple Field components. FieldSet wraps a group with a semantic fieldset element, and FieldLegend provides its caption.
contracts:
  - FieldLabel must receive an htmlFor prop that matches the id on the control. This is the only mechanism that associates the label with the control.
  - FieldError must appear after the control, or inside FieldContent, to keep the error message visually and semantically adjacent to the input.
  - When you use FieldSet, place FieldLegend as the first child. Screen readers announce the legend as the group name, and browsers enforce this order in the HTML fieldset model.
  - "Use FieldContent only when you need to align a description beside a control in a horizontal layout. It's not required for vertical fields with no description."
variants:
  - "orientation=\"vertical\" (default):: Stacks label, control, and helper text. Use this for most form layouts, especially on mobile."
  - "orientation=\"horizontal\":: Places the label and control side by side. Use this for toggle-style controls like switches and checkboxes where the label reads naturally beside the control."
  - "orientation=\"responsive\":: Switches between vertical and horizontal based on container width. Apply @container/field-group to a parent FieldGroup to activate breakpoint-aware switching."
  - "FieldLegend variant=\"legend\" (default):: Renders standard legend sizing. Use inside a top-level FieldSet."
  - "FieldLegend variant=\"label\":: Applies label sizing and alignment. Use inside a nested FieldSet where the legend must align with surrounding field labels."
placement: Place Field inside FieldGroup when stacking multiple fields. Use FieldSeparator sparingly between sections within a FieldGroup to mark logical boundaries without fragmenting the reading order for screen reader users.
editorial:
  - "Start FieldLabel text with a noun that names the data, not a verb: \"Full name,\" not \"Enter your full name.\""
  - Write FieldDescription text as a complete sentence. End it with a period.
  - "Write FieldError messages to describe what went wrong and how to fix it: \"Email must include @,\" not \"Invalid input.\""
  - "Mark required fields with explicit \"(required)\" text in the label or a legend that explains your asterisk convention."
aria:
  - "aria-invalid: on the input element, set to true when the field is in an error state."
  - "aria-invalid + data-invalid: these two attributes must be set together. data-invalid drives visual error styling on Field; aria-invalid signals the error to assistive technologies on the control."
  - "role=\"group\": Field renders this automatically. Do not override it."
a11y:
  - Pair color-based error styling with FieldError text and an icon. Color alone does not meet WCAG contrast requirements for users with color blindness.
  - "FieldSet and FieldLegend produce a semantic fieldset/legend pair. Screen readers announce the legend before each control inside the group, giving context that individual FieldLabel elements alone can't provide."
mistakes:
  - "Omitting aria-invalid when using data-invalid: Setting only data-invalid on Field changes the visual state but does not communicate the error to assistive technologies. Always set aria-invalid on the input element at the same time."
  - "Using FieldTitle outside FieldContent: FieldTitle renders with label sizing and expects to live inside FieldContent. Placing it directly in Field produces misaligned text and breaks the visual hierarchy."
  - "Passing errors to FieldError without clearing it when valid: When errors becomes empty, FieldError must receive an empty array or no errors prop. Leaving a stale errors array renders a persistent error message even after the user corrects the input."
  - "Wrapping a control in an extra div between Field and FieldLabel: The htmlFor/id relationship still functions, but data-invalid styles cascade through direct children. An extra wrapper div can break error state styling on the control."
```
