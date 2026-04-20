# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## field

```yaml
component: Field
summary: Wrap a form control with its label, helper text, and validation message to produce an accessible, consistently structured form field.
use_when:
  - Use field components any time you need to pair a control (input, select, switch, checkbox) with a visible label and optional helper or error text.
  - Reach for FieldSet and FieldGroup when you need to semantically group related fields, such as an address block or notification preferences.
do:
  - "Give every FieldLabel an htmlFor value that matches the control's id."
  - Add both data-invalid on Field and aria-invalid on the control when a field fails validation.
  - Use FieldSet with FieldLegend for groups of related controls (radio buttons, checkboxes).
dont:
  - "Don't use placeholder text as a substitute for FieldLabel—placeholder text disappears on focus and isn't reliably announced by screen readers."
  - "Don't render FieldError without also setting aria-invalid on the control—error text alone doesn't communicate the invalid state to assistive technology."
anatomy: Field is the core wrapper for a single control. Inside it, FieldLabel names the control, the control itself (Input, Select, Switch, and so on) occupies the middle slot, FieldDescription provides optional helper text, and FieldError renders validation messages. FieldContent is a flex column you can use to group FieldLabel and FieldDescription together when the label sits beside the control. FieldGroup stacks multiple Field components, and FieldSeparator draws a visual divider between sections. FieldSet and FieldLegend produce a semantic fieldset and legend for grouped controls.
contracts:
  - FieldLabel requires an htmlFor prop that matches the id on the control. Without this, the label is not programmatically associated with the input.
  - "FieldSet must contain a FieldLegend as its first child. Without a legend, assistive technology cannot announce the group's purpose."
  - FieldContent is only needed when FieldDescription or FieldTitle must align with a label placed beside the control (horizontal or responsive orientation). Omit it in vertical layouts without a description.
  - To use FieldLabel as a wrapper element (for choice card patterns), set asChild and ensure the child element forwards refs.
variants:
  - "orientation (on Field):: \"vertical\" (default) stacks label, control, and helper text; use \"horizontal\" to place the label and control side by side; use \"responsive\" inside a @container/field-group parent to switch automatically at breakpoints."
  - "variant (on FieldLegend):: \"legend\" (default) applies legend styling; use \"label\" to match label sizing when nesting FieldSet inside another FieldSet."
placement: "Place Field inside FieldGroup whenever two or more fields appear together. To divide sections within a FieldGroup, insert FieldSeparator between the relevant Field elements. For responsive layouts, add the @container/field-group class to FieldGroup so container queries can switch orientation=\"responsive\" fields between vertical and horizontal at the correct breakpoint."
editorial:
  - "Write FieldLabel text as a short noun phrase, not a full sentence: \"Full name,\" not \"Enter your full name.\""
  - Write FieldDescription text in sentence case and end with a period.
  - "Write FieldError messages in plain language that describes what went wrong and how to fix it: \"Enter a valid email address,\" not \"Invalid input.\""
  - Mark required fields explicitly in the label text or with an asterisk and a visible legend.
aria:
  - "aria-invalid: on the control element when the field is in an error state."
  - "role=\"group\": output automatically by Field; do not add it manually."
a11y:
  - FieldSet renders a native <fieldset> and FieldLegend renders a native <legend>, which assistive technology announces before each control in the group—no extra ARIA is needed.
  - Validate fields on blur, not on each keystroke, to avoid interrupting users with error announcements while they type.
  - "Don't rely on color alone to signal the error state; data-invalid styling must accompany FieldError text and the aria-invalid attribute on the control."
mistakes:
  - "Setting error state with data-invalid only on Field but omitting aria-invalid on the control. Screen readers announce the invalid state from aria-invalid on the control, not from the wrapper's data attribute. Always set both."
  - Skipping FieldLegend inside FieldSet. Without a legend, assistive technology has no way to announce the group name. If the legend must be visually hidden, hide it with a VisuallyHidden wrapper rather than removing it.
  - Using FieldTitle outside FieldContent. FieldTitle is intended for use inside FieldContent alongside FieldDescription. Placing it directly inside Field breaks alignment in horizontal layouts.
  - Passing an errors prop to FieldError without also rendering the component. FieldError renders nothing when errors is an empty array, so conditionally mounting it is unnecessary—but the component must still be present in the tree for error messages to appear.
```
