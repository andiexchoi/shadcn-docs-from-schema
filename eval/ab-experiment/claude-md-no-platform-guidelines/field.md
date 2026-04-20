# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## field

```yaml
component: Field
summary: A compound component that combines a label, control, helper text, and validation message into a single accessible form field.
use_when:
  - Use Field whenever you need to associate a label, description, or error message with a form control.
  - Use FieldSet with FieldLegend when you need to group related fields under a shared heading.
do:
  - "Always provide a FieldLabel with htmlFor matching the control's id."
  - Use FieldSet and FieldLegend to group semantically related fields, such as address or payment inputs.
  - Render FieldError immediately after the control so error messages stay visually aligned.
dont:
  - "Don't omit FieldLabel. Without it, assistive technologies can't announce the control's purpose. Use FieldTitle inside FieldContent as an alternative for non-input contexts."
anatomy: Field is the core wrapper for one control and its associated text. FieldLabel links to the control via htmlFor. FieldDescription provides optional helper text below the control. FieldError displays validation messages and accepts either inline children or an errors array. FieldContent is an optional flex column that groups FieldLabel and FieldDescription together when the label sits beside the control in horizontal layouts.
contracts:
  - "FieldLabel must receive an htmlFor prop whose value matches the id on the form control. Without this link, selecting the label won't focus the control and screen readers won't announce the label."
  - To signal an invalid field, add data-invalid to Field and aria-invalid to the control element. data-invalid triggers error-state styling on the wrapper; aria-invalid communicates the error to assistive technologies.
  - Use FieldSet as the outermost wrapper when grouping multiple fields. Place FieldLegend as its first child, before any FieldGroup or Field elements.
  - FieldContent is only required in horizontal layouts where a description must align below a label that sits beside a control. Omit it in vertical layouts with no description.
variants:
  - "orientation on Field: \"vertical\" (default): Stacks label, control, and helper text top to bottom. Use this for most form layouts."
  - "\"horizontal\":: Places label and control side by side. Use this for toggles, switches, and compact inline fields."
  - "\"responsive\":: Switches orientation based on the parent container's width. Add @container/field-group to FieldGroup to activate breakpoint switching."
  - "variant on FieldLegend: \"legend\" (default): Renders standard legend sizing for top-level fieldsets."
  - "\"label\":: Applies label sizing and alignment. Use this for nested FieldSet elements where a smaller heading is appropriate."
placement: "Stack Field components inside a FieldGroup. Use FieldSeparator between logical sections within the same group. For responsive layouts, add @container/field-group to FieldGroup and set orientation=\"responsive\" on each Field."
editorial:
  - "Start FieldLabel text with a noun, not a verb: \"Full name,\" not \"Enter your full name.\""
  - Write FieldDescription as a complete sentence and end it with a period.
  - "Write FieldError messages in plain language that tells the user what to fix: \"Enter a valid email address,\" not \"Invalid input.\""
  - Keep FieldLegend text under 40 characters.
aria:
  - "aria-invalid: on the form control element; set to true when the field has a validation error."
  - aria-invalid pairs with data-invalid on Field. Set both together for correct visual and semantic error state.
  - "Field renders role=\"group\" implicitly. No manual role attribute is needed."
a11y:
  - FieldSet renders a native <fieldset> element and FieldLegend renders a native <legend>. Screen readers announce the legend text before each control inside the group. No additional ARIA is required for this grouping.
  - When FieldError receives an errors array with multiple messages, it renders a list. Each message item is announced individually by screen readers.
mistakes:
  - "Setting data-invalid on Field without also setting aria-invalid on the control. The visual error state appears, but assistive technologies won't announce the error. Set both attributes together."
  - Passing an onValueChanged prop instead of onValueChange to a control nested inside Field. Field itself has no change handler. Wire change events directly to the control, not to the Field wrapper.
  - Wrapping the control in an extra <div> between Field and the input. This breaks the htmlFor and id association if IDs drift. Keep the control as a direct child of Field.
  - Using FieldTitle outside of FieldContent. FieldTitle renders title styling intended for use inside FieldContent alongside FieldDescription. Outside that context, use FieldLabel instead.
```
