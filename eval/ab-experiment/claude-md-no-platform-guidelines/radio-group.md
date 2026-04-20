# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## radio-group

```yaml
component: Radio group
summary: A radio group presents a set of mutually exclusive options and lets users select exactly one.
use_when:
  - Use a radio group when the user must choose one option from a small, fixed set.
  - Reach for a Select instead when you have more than five or six options and need to conserve vertical space.
do:
  - Present between two and five options. More than five options suit a Select better.
  - Associate a visible Label with each RadioGroupItem using matching id and htmlFor attributes.
  - Group related items under a FieldSet with a FieldLegend to give the group a name.
dont:
  - "Don't use a radio group when the user can select multiple options. Use checkboxes instead."
  - "Don't render a radio group with only one option. A single option is not a choice."
anatomy: The RadioGroup root wraps all items and holds the selected value. Each RadioGroupItem is a single selectable button. A Label paired to each item provides the visible text. An optional description can follow each item using the Field component. The FieldSet and FieldLegend elements wrap the entire group when you need a group-level label.
contracts:
  - RadioGroup must wrap all RadioGroupItem elements. It owns the shared selection state.
  - Each RadioGroupItem must receive a unique value prop. The RadioGroup uses this value to track which item is selected.
  - Each RadioGroupItem must have a matching Label. Set id on the item and htmlFor on the label to the same string.
  - For controlled usage, pass value and onValueChange to RadioGroup. Do not use onClick on individual items to manage selection state.
variants:
  - "defaultValue: Use to set the initially selected item in an uncontrolled group."
  - "value and onValueChange: Use together for a controlled group where you need to read or respond to the selected value."
  - "disabled (on RadioGroup): Disables all items in the group at once."
  - "disabled (on RadioGroupItem): Disables a single item while leaving the rest interactive."
  - "orientation: Set to \"horizontal\" or \"vertical\" to control arrow-key navigation direction. Defaults to \"vertical\"."
placement: Place the radio group inside a FieldSet when the group needs a visible group label. Align each RadioGroupItem and its Label horizontally using a flex container with a consistent gap.
editorial:
  - Start each option label with a noun or adjective, not a verb.
  - Keep each label under 40 characters.
  - Use sentence case for all labels. Capitalize only the first word and proper nouns.
  - "Write a FieldLegend as a short question or a clear noun phrase, such as \"Notification frequency.\""
keyboard:
  - "Tab: Moves focus into the radio group."
  - "Arrow Down / Arrow Right: Moves focus to the next item and selects it."
  - "Arrow Up / Arrow Left: Moves focus to the previous item and selects it."
  - "Space: Selects the focused item if none is selected yet."
  - "Tab: Moves focus out of the group to the next focusable element."
aria:
  - "role=\"radiogroup\": Set on the RadioGroup root element."
  - "aria-labelledby: Set on RadioGroup, pointing to the FieldLegend element's ID when a group label is present."
  - "role=\"radio\": Set on each RadioGroupItem."
  - "aria-checked=\"true\" or aria-checked=\"false\": Set on each RadioGroupItem to reflect selection state."
  - "aria-invalid=\"true\": Set on RadioGroupItem to communicate a validation error."
a11y: "Screen readers announce the group label from FieldLegend when the user moves focus into the group. To support this, always provide a FieldLegend or an aria-label on the RadioGroup root. For validation errors, pair aria-invalid=\"true\" on the item with a visible error message linked via aria-describedby."
mistakes:
  - "Omitting Label elements: Rendering RadioGroupItem without a paired Label leaves items without accessible names. Set id on each item and htmlFor on each label to the same value."
  - "Using onClick for selection: Managing selection with onClick on individual items breaks keyboard navigation and internal state sync. Use onValueChange on RadioGroup instead."
  - "Skipping the group label: A RadioGroup without a FieldLegend or aria-label gives screen reader users no context for what the group represents. Wrap the group in FieldSet and provide a FieldLegend."
  - "Mismatched value and defaultValue types: Passing a numeric value where a string is expected causes selection to never match. Always pass string values to value, defaultValue, and each RadioGroupItem's value prop."
```
