# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## radio-group

```yaml
component: Radio group
summary: A radio group presents a set of mutually exclusive options and lets users select exactly one.
use_when:
  - Use a radio group when users must choose one option from a small, fixed set of two to five choices.
  - For six or more options, use a select component instead.
do:
  - Present all options simultaneously so users can compare them before selecting.
  - Pre-select the most common or safest option using defaultValue.
  - Group related items under a FieldSet with a FieldLegend to name the group.
dont:
  - "Don't use a radio group when users can choose more than one option. Use checkboxes instead."
  - "Don't leave the group without a group label. Unlabeled groups lose context for screen reader users."
anatomy: A radio group consists of a RadioGroup root and one or more RadioGroupItem elements. Each item pairs with a Label linked via matching id and htmlFor attributes. The label is the clickable, readable name for that option. To add supporting text, wrap the item in a Field component and include a description element beneath the label.
contracts:
  - RadioGroup wraps all RadioGroupItem elements. It owns the selection state and exposes it via value or defaultValue.
  - Each RadioGroupItem requires a unique value prop. The root uses this value to track which item is selected.
  - Each RadioGroupItem requires an id prop, and its associated Label must set htmlFor to that same id. Without this pairing, selecting the label does not activate the item.
  - To name the group visually and semantically, wrap the entire structure in a FieldSet with a FieldLegend. This is required for groups that appear inside a form.
variants:
  - "defaultValue: Use for uncontrolled usage when you want an initial selection without managing state yourself."
  - "value + onValueChange: Use for controlled usage when external state drives the selected option."
  - "disabled (on RadioGroup): Disables all items at once. Use when the entire group is unavailable based on form context."
  - "disabled (on RadioGroupItem): Disables a single option. Use when one choice is conditionally unavailable."
  - "aria-invalid + data-invalid: Apply aria-invalid to RadioGroupItem and data-invalid to a wrapping Field to signal a validation error."
placement: Place the radio group inside a FieldSet when it appears in a form alongside other fields. Stack items vertically for readability. Use consistent horizontal alignment between the item indicator and its label, with a gap of 3 units (gap-3).
editorial:
  - Start each option label with a noun or short noun phrase, not a verb.
  - Use sentence case for all labels. Capitalize only the first word.
  - Keep each label under 40 characters. Move supporting detail into a description element.
  - Write the FieldLegend as a short noun phrase that names the group, not a question.
keyboard:
  - "Tab: Moves focus into the radio group, landing on the selected item or the first item if none is selected."
  - "Arrow Down / Arrow Right: Moves selection to the next item in the group."
  - "Arrow Up / Arrow Left: Moves selection to the previous item in the group."
  - "Space: Selects the focused item when no item is yet selected."
aria:
  - "role=\"radiogroup\": Applies to the RadioGroup root element."
  - "aria-labelledby: Set on RadioGroup, pointing to the id of the FieldLegend or group label element."
  - "role=\"radio\": Applies to each RadioGroupItem."
  - "aria-checked=\"true\" / aria-checked=\"false\": Set on each RadioGroupItem to reflect its selected state."
  - "aria-invalid=\"true\": Set on a RadioGroupItem to signal a validation error for that item."
a11y:
  - Never use color alone to show the selected state. The filled indicator must accompany a visible label change or distinct visual weight.
  - Pair aria-invalid on the item with a visible error message in the DOM. The message must describe what went wrong and how the user can fix it.
mistakes:
  - Omitting id and htmlFor pairing. Without these, selecting the label text does not activate the radio item. Add a matching id to every RadioGroupItem and the corresponding htmlFor to its Label.
  - "Using onClick to manage selection instead of onValueChange. Direct click handlers bypass the component's internal state and break keyboard navigation. Use onValueChange on RadioGroup for controlled state."
  - "Wrapping RadioGroupItem in a plain div without a Label. Screen readers announce only the item's value, not a human-readable name. Always pair each item with a Label linked by htmlFor."
  - Skipping the group label. A RadioGroup without an aria-labelledby reference leaves the group unnamed for screen readers. Wrap the group in a FieldSet with a FieldLegend and link them.
```
