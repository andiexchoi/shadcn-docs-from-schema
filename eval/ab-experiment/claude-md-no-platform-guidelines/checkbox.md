# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## checkbox

```yaml
component: Checkbox
summary: A control that lets you toggle a single option between checked and unchecked, used in forms where one or more independent choices need capturing.
use_when:
  - Use a checkbox for binary on/off choices that users confirm before submitting, such as accepting terms or enabling a setting.
  - Use a radio group instead when only one option in a set can be active at a time.
do:
  - Wrap each checkbox in a Field and FieldLabel for correct layout and labeling.
  - Use defaultChecked for uncontrolled state and checked with onCheckedChange for controlled state.
  - Group related checkboxes with multiple Field elements and a shared group label.
dont:
  - "Don't use a checkbox for actions that take immediate effect. Use a switch instead."
  - "Don't omit a visible label. A bare <Checkbox /> with no FieldLabel leaves screen reader users without context."
anatomy: "The checkbox has two core parts: the control and the label. The control renders a small interactive box that displays a checkmark when checked. The FieldLabel renders adjacent text that identifies the option. Optionally, FieldContent and FieldDescription render helper text below the label. The Field wrapper ties all parts together and carries data-disabled or data-invalid for state-based styling."
contracts:
  - Wrap Checkbox in a Field component. Field provides the layout context and carries data-disabled and data-invalid attributes that drive state styles.
  - Associate a label by placing FieldLabel inside the same Field. Without it, the checkbox has no accessible name.
  - To show an invalid state, set aria-invalid on <Checkbox> and data-invalid on the <Field> wrapper. Setting only one of the two leaves either the style or the semantic announcement missing.
variants:
  - "defaultChecked: Use for uncontrolled checkboxes where you don't need to read or set checked state from outside the component."
  - "checked + onCheckedChange: Use for controlled checkboxes where external state drives the value."
  - "disabled: Use to prevent interaction. Also add data-disabled to the <Field> wrapper to apply disabled styles consistently."
placement: Place the checkbox control to the left of its label in left-to-right (LTR) layouts. In a checkbox group, stack Field elements vertically with consistent spacing between them.
editorial:
  - "Start the label with a noun or adjective, not a verb: \"Email notifications,\" not \"Enable email notifications.\""
  - Keep labels under 60 characters.
  - Use sentence case for all labels. Capitalize only the first word and proper nouns.
  - Write description text as a complete sentence and end it with a period.
keyboard:
  - "Space: Toggles the checkbox between checked and unchecked."
  - "Tab: Moves focus to the next focusable element."
  - "Shift+Tab: Moves focus to the preceding focusable element."
aria:
  - "aria-invalid=\"true\": Place on the <Checkbox> element when the field has a validation error."
  - "aria-checked: The primitive manages this automatically. Do not set it manually."
  - "aria-labelledby or a wrapping <label>: The FieldLabel inside Field provides the accessible name. Do not add a redundant aria-label when a visible label exists."
a11y: "Screen readers announce the checkbox role, label, and checked state together. Checked state changes announce immediately without requiring a page refresh. For indeterminate states, the primitive sets aria-checked=\"mixed\" automatically when you pass checked=\"indeterminate\"."
mistakes:
  - "Using onClick to toggle state instead of onCheckedChange. onClick bypasses the primitive's state management and breaks keyboard toggling. Use onCheckedChange for all state updates."
  - Omitting data-disabled on <Field> when setting disabled on <Checkbox>. The disabled prop stops interaction, but the field wrapper needs data-disabled to render disabled styles. Set both.
  - Setting aria-invalid on <Field> instead of <Checkbox>. aria-invalid must go on the <Checkbox> element itself so assistive technology announces the error state correctly. Put data-invalid on <Field> for visual styles only.
```
