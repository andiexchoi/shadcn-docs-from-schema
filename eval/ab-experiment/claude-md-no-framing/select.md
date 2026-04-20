# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## select

```yaml
component: Select
summary: Presents a list of options in a collapsible dropdown, triggered by a button, for when you need a user to choose exactly one value from a predefined set.
use_when:
  - Use select when the option list is too long for radio buttons (roughly five or more items) and the choices are mutually exclusive.
  - For fewer than five options, prefer radio buttons, which keep all choices visible without interaction.
do:
  - Always pair the select with a visible label above the trigger.
  - Use SelectGroup and SelectLabel to organize lists of 10 or more items.
  - Show an error state by adding aria-invalid to SelectTrigger and data-invalid to the wrapping Field.
dont:
  - "Don't use placeholder text as a substitute for a label; placeholder disappears on selection and screen readers don't reliably announce it."
  - "Don't use select for navigation; use a nav component instead."
anatomy: The trigger is the button users select to open the dropdown. Inside it, SelectValue displays the current selection or a placeholder. The content panel holds the option list and renders in a portal to avoid clipping. SelectItem elements are the individual options. SelectGroup and SelectLabel are optional wrappers that add visual and semantic grouping, and SelectSeparator draws a horizontal rule between groups.
contracts:
  - "SelectTrigger must contain SelectValue. Without SelectValue, the selected value won't display in the trigger."
  - SelectContent must contain at least one SelectItem. Items must have a value prop; omitting it breaks selection state.
  - SelectGroup must wrap SelectLabel and its associated SelectItem elements together. A SelectLabel outside a SelectGroup has no semantic relationship to the items.
  - "Select renders content in a portal by default. Don't wrap SelectContent in a position: relative container expecting to constrain it; the portal moves it to document.body."
variants:
  - "position (Radix) / alignItemWithTrigger (Base UI):: Controls whether the dropdown aligns its selected item over the trigger (item-aligned / true, the default) or aligns to the trigger edge (popper / false); use the edge-aligned option when the trigger sits near the viewport bottom."
  - "disabled:: Prevents interaction with the entire select; apply it to the Select root when the field is unavailable based on form state."
  - "value / defaultValue:: Use defaultValue for uncontrolled selects and value with onValueChange for controlled selects; never mix the two."
placement: "Set an explicit width on SelectTrigger (a CSS class or inline style) because it won't stretch to fill its container by default. Place the label above the trigger, not inside it."
editorial:
  - Write option labels in sentence case, not title case.
  - Keep option labels to three words or fewer.
  - "Write placeholder text as a noun or short noun phrase (\"Theme,\" \"Select a country\"), not as an instruction (\"Choose one\")."
  - "Match the label and placeholder to the same concept so users understand what they're selecting."
keyboard:
  - "Enter or Space on trigger: opens the dropdown."
  - "Arrow Down / Arrow Up: moves focus through options."
  - "Enter on option: selects the option and closes the dropdown."
  - "Escape: closes the dropdown without changing the selection."
  - "Home / End: jumps to the first or last option."
  - "Type-ahead (any printable character): jumps focus to the first matching option."
  - "Tab: closes the dropdown and moves focus to the next focusable element."
aria:
  - "SelectTrigger receives role=\"combobox\", aria-expanded (true when open, false when closed), and aria-haspopup=\"listbox\" — the primitive sets these automatically."
  - "SelectContent receives role=\"listbox\" — set automatically."
  - "Each SelectItem receives role=\"option\" and aria-selected=\"true\" when selected — set automatically."
  - "SelectGroup receives role=\"group\" with aria-labelledby pointing to its SelectLabel ID — set automatically."
  - "For invalid state: add aria-invalid=\"true\" to SelectTrigger manually; the primitive does not infer this from form state."
a11y: "Screen readers announce the selected value through SelectValue; never hide or replace it with a custom element that lacks accessible text. Decorative icons inside SelectTrigger must have aria-hidden=\"true\" to prevent double-announcement. Respect prefers-reduced-motion; the content panel's open and close animations must reduce or disable under this setting."
mistakes: "Using onValueChanged instead of onValueChange: The correct prop is onValueChange. Using the wrong name silently drops change events and leaves the component stuck on its initial value. Managing open state with onClick instead of onOpenChange: Setting open state manually in an onClick handler breaks Radix's internal state machine, causing outside-click dismissal and Escape to stop working. Use onOpenChange for controlled open state. Wrapping SelectTrigger in a div: A wrapper div breaks the ARIA relationship between the trigger and the listbox. Use asChild to merge onto a custom element instead. Omitting SelectValue inside SelectTrigger: Without SelectValue, the trigger renders empty after a selection. SelectValue is the only element that reflects the current selection in the trigger."
```
