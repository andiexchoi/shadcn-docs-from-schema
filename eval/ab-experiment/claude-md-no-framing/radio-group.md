# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## radio-group

```yaml
component: Radio group
summary: Renders a set of radio buttons where users can select exactly one option from a fixed list.
use_when:
  - Use a radio group when a user must choose one option from a small, mutually exclusive set—plan tiers, shipping methods, or payment types.
  - For five or more options, use a select instead.
  - "For choices that aren't mutually exclusive, use checkboxes."
do:
  - Pair each RadioGroupItem with a visible Label using a matching htmlFor and id.
  - Wrap the group in a FieldSet with a FieldLegend when the group needs a visible group label.
  - Set a defaultValue so one option is selected on initial render.
dont:
  - "Don't use placeholder text or color alone to communicate which option is selected."
  - "Don't use a radio group for settings that take effect immediately on selection—use a switch instead."
anatomy: RadioGroup is the root wrapper that holds shared state and manages selection. Each RadioGroupItem is a single selectable button with a circular indicator. Each item requires a paired Label connected by id and htmlFor. To add supporting text, wrap the item and label in a Field component. To add a group-level label, wrap the entire RadioGroup in a FieldSet with a FieldLegend.
contracts:
  - RadioGroup must wrap all RadioGroupItem elements. It owns the selection state and provides it to all children.
  - Each RadioGroupItem must have a unique value prop and a unique id. Without id, the Label association breaks and the item has no accessible name.
  - "Each RadioGroupItem must have a paired Label with htmlFor set to the item's id. Do not use aria-label as a substitute when a visible label is present."
  - To disable all items at once, set disabled on RadioGroup. To disable individual items (Radix variant only), set disabled on RadioGroupItem.
variants:
  - "defaultValue: Sets the initially selected item for uncontrolled use; omit it only when no option must be pre-selected."
  - "value + onValueChange: Use together for controlled state when the selection must be read or set from outside the component."
  - "disabled (on RadioGroup): Disables all items in the group at once; use when the entire choice is unavailable in the current context."
  - "disabled (on RadioGroupItem, Radix variant): Disables a single option while leaving others selectable; use when one option is temporarily unavailable."
  - "aria-invalid + data-invalid: Apply aria-invalid to RadioGroupItem and data-invalid to the wrapping Field to surface validation errors."
  - "orientation: Sets the axis for arrow-key navigation; defaults to vertical. Set to \"horizontal\" when items are laid out in a row."
placement: Place a radio group inside a form, ideally within a FieldSet to group it semantically with a FieldLegend. Stack items vertically by default; switch to horizontal layout only when item labels are short and screen width allows.
editorial:
  - Write labels in sentence case with no trailing punctuation.
  - Keep each option label to five words or fewer.
  - Write labels as nouns or short noun phrases, not questions or instructions.
  - "Write the FieldLegend as a concise noun phrase that names the choice being made, such as \"Shipping method.\""
keyboard:
  - "Tab: Moves focus into the radio group; focuses the selected item, or the first item if none is selected."
  - "Arrow Down / Arrow Right: Moves focus to and selects the next option."
  - "Arrow Up / Arrow Left: Moves focus to and selects the previous option."
  - "Tab (from within group): Moves focus out of the group to the next focusable element."
aria:
  - "role=\"radiogroup\": Applied automatically to RadioGroup."
  - "role=\"radio\": Applied automatically to each RadioGroupItem."
  - "aria-checked: Set to \"true\" on the selected RadioGroupItem; managed automatically by the component."
  - "aria-labelledby: Set on RadioGroup, pointing to the FieldLegend ID when a group label is present."
  - "aria-invalid=\"true\": Set on RadioGroupItem when the group fails validation."
a11y:
  - Selection state uses color and a filled indicator together; this satisfies the requirement not to use color as the only means of conveying state.
  - Each RadioGroupItem must have a visible label. Without it, screen readers announce the button with no name.
  - "When you add a FieldLegend, verify that aria-labelledby on RadioGroup points to the legend's ID so screen readers announce the group name before the individual options."
mistakes:
  - "Using onClick to manage selection instead of onValueChange: This breaks the component's internal state and causes arrow-key navigation to desync. Use the onValueChange callback on RadioGroup for controlled patterns."
  - "Omitting id on RadioGroupItem and htmlFor on Label: The label becomes unassociated, so selecting the label text does not activate the button and screen readers find no accessible name. Always match id and htmlFor exactly."
  - "Wrapping RadioGroupItem in a plain div without a Label: The item loses its accessible name. Pair every item with a Label, or use the Field composition pattern for items that need descriptions."
  - "Disabling items via CSS instead of the disabled prop: CSS-only disabling removes the visual affordance but leaves the item keyboard-reachable and still operable by assistive technology. Use the disabled prop so the component sets aria-disabled and removes the item from keyboard interaction."
```
