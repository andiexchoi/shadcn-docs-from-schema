# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## select

```yaml
component: Select
summary: A select lets users pick one option from a dropdown list, triggered by a button.
use_when:
  - Use select when you have five or more predefined options and the user must choose exactly one.
  - For fewer than five options, use a radio group instead, which keeps all choices visible without interaction.
do:
  - Wrap related items in SelectGroup with a SelectLabel to improve screen reader navigation.
  - Set a placeholder on SelectValue to communicate what the user needs to choose.
  - Use aria-invalid on SelectTrigger and data-invalid on the wrapping Field to signal validation errors.
dont:
  - "Don't use select for binary choices. Use a switch or checkbox instead."
  - "Don't omit SelectValue from inside SelectTrigger. The trigger has no visible content without it."
anatomy: SelectTrigger renders the button the user selects to open the list. SelectValue lives inside the trigger and displays the current selection or placeholder text. SelectContent renders the dropdown panel, containing one or more SelectItem elements. SelectGroup and SelectLabel are optional wrappers that organize items into labeled sections. SelectSeparator draws a visual dividing line between groups.
contracts:
  - Select must wrap all other sub-components. It owns the open/closed and selected-value state.
  - SelectTrigger must contain exactly one SelectValue. Without SelectValue, the trigger renders no selected state.
  - SelectContent must contain at least one SelectItem. Each SelectItem requires a non-empty value prop.
  - "SelectGroup and SelectLabel are optional but must be paired: place SelectLabel as the first child of SelectGroup so screen readers associate the label with the group."
variants:
  - "disabled on Select: Use to prevent all interaction when the field is not available in the current context."
  - "alignItemWithTrigger (Base UI) / position (Radix UI): Use true or \"item-aligned\" (the default) to align the popup so the selected item sits over the trigger. Use false or \"popper\" to align the popup to the trigger edge instead."
  - "aria-invalid on SelectTrigger: Apply when the field fails validation. Pair with data-invalid on the wrapping Field to show the error state."
placement: Place select inside a Field component when you need a visible label, helper text, or validation messaging. Set an explicit width on SelectTrigger (the source examples use w-[180px]) because the trigger does not grow to fill its container by default.
editorial:
  - "Start the placeholder with a noun, not a verb: \"Theme,\" not \"Select a theme.\""
  - Use sentence case for all option labels and group labels.
  - Keep option labels under 30 characters so they fit within the trigger without truncation.
  - "Keep group labels short enough to distinguish sections at a glance: one to three words."
keyboard:
  - "Enter or Space on trigger: opens the dropdown."
  - "Arrow Down / Arrow Up: moves focus through options."
  - "Enter on an option: selects the option and closes the dropdown."
  - "Escape: closes the dropdown without changing the selection."
  - "Home / End: jumps to the first or last option."
  - "Type-ahead: entering a character moves focus to the first matching option."
aria:
  - "SelectTrigger renders with role=\"combobox\", aria-expanded=\"true\" when open and \"false\" when closed, and aria-haspopup=\"listbox\"."
  - "SelectContent renders with role=\"listbox\"."
  - "Each SelectItem renders with role=\"option\" and aria-selected=\"true\" on the currently selected item."
  - "SelectGroup renders with role=\"group\" and aria-labelledby pointing to the associated SelectLabel element's ID."
  - "Apply aria-invalid=\"true\" to SelectTrigger when the field fails validation."
a11y: "Screen readers announce the selected value when the trigger receives focus. To support this, never suppress the text content of SelectValue. When you render a SelectLabel, the component links it to its group automatically. Do not set a separate aria-label on the group: it conflicts with the generated aria-labelledby relationship."
mistakes:
  - Using onValueChanged instead of onValueChange. The correct prop name is onValueChange. The wrong name silently fails with no TypeScript error in some configurations.
  - "Managing open state with onClick instead of onOpenChange. Using onClick to toggle the dropdown desyncs Radix's internal state. Use onOpenChange on Select for controlled open state."
  - Wrapping SelectTrigger in a div. A wrapper div breaks keyboard navigation and ARIA relationships. Use asChild on SelectTrigger if you need to merge it onto a custom element.
  - Omitting SelectValue from SelectTrigger. The trigger displays nothing to the user without it, and screen readers cannot announce the current selection.
```
