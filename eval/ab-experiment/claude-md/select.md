# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## select

```yaml
component: Select
summary: Lets users pick one option from a collapsible list, triggered by a button.
use_when:
  - Use select when you have five or more mutually exclusive options and inline radio buttons would clutter the layout.
  - For four or fewer options, use radio buttons instead so all choices stay visible.
do:
  - Always pair the select with a visible label above the trigger.
  - Use SelectGroup and SelectLabel to organize 10 or more items into named categories.
  - Set a meaningful placeholder on SelectValue to hint at the expected input.
dont:
  - "Don't use select for binary choices. Use a switch or checkbox instead."
  - "Don't replace the visible label with placeholder text. Placeholder text disappears on selection."
anatomy: The trigger is a button that displays the current value via SelectValue. When activated, SelectContent renders a listbox positioned over or below the trigger. SelectItem elements populate the list. SelectGroup and SelectLabel add optional grouping. SelectSeparator adds a visual divider between groups.
contracts:
  - SelectTrigger must wrap SelectValue. Without SelectValue, the trigger has no content to display the selected option.
  - SelectContent must contain at least one SelectItem. Each SelectItem requires a non-empty value prop.
  - SelectGroup must wrap SelectLabel when you use labels. A SelectLabel outside a SelectGroup breaks the group association for screen readers.
  - "SelectContent renders inside a portal by default. Do not wrap it in a container with overflow: hidden or a low z-index, as this clips the dropdown."
variants:
  - "position (Radix) / alignItemWithTrigger (Base UI):: Use position=\"item-aligned\" (default) to align the popup so the selected item sits over the trigger. Use position=\"popper\" to align the popup to the trigger edge instead."
  - "disabled:: Use on Select to disable the entire control, or on individual SelectItem elements to block specific options while keeping others selectable."
  - "aria-invalid:: Add aria-invalid to SelectTrigger alongside data-invalid on the wrapping Field to show the error state when validation fails."
placement: Set an explicit width on SelectTrigger, such as w-[180px], to prevent the trigger from collapsing to zero width. SelectContent inherits the trigger width by default. Place the visible label directly above the trigger with consistent spacing.
editorial:
  - "Start the placeholder with a noun that names the category: \"Theme,\" \"Country,\" or \"Language.\""
  - Use sentence case for all item labels. Capitalize only the first word and proper nouns.
  - Keep item labels under 40 characters to prevent truncation inside the dropdown.
  - "Use group labels as category nouns, not action phrases: \"Appearance,\" not \"Choose appearance.\""
keyboard:
  - "Enter or Space on trigger: opens the dropdown."
  - "Arrow Down / Arrow Up: moves focus through options."
  - "Enter on option: selects the option and closes the dropdown."
  - "Escape: closes the dropdown without selecting."
  - "Home / End: moves focus to the first or last option."
  - "Type-ahead: entering a character moves focus to the first matching option."
  - "Tab: moves focus away from the trigger when the dropdown is closed."
aria:
  - "SelectTrigger renders with role=\"combobox\", aria-expanded=\"true|false\", and aria-haspopup=\"listbox\"."
  - "SelectContent renders with role=\"listbox\"."
  - "Each SelectItem renders with role=\"option\" and aria-selected=\"true\" on the active item."
  - "SelectGroup renders with role=\"group\" and aria-labelledby pointing to its SelectLabel element's ID."
  - "For invalid state, add aria-invalid=\"true\" to SelectTrigger."
a11y:
  - Wrap the trigger in a Field component with a FieldLabel to associate a visible label. Do not rely on aria-label alone when a visible label exists.
  - All animation on SelectContent must respect prefers-reduced-motion. Reduce or remove entrance and exit transitions when that setting is active.
mistakes:
  - Missing SelectValue inside SelectTrigger. The trigger renders empty and the selected option never displays. Always nest SelectValue directly inside SelectTrigger.
  - Using onValueChanged instead of onValueChange. The prop onValueChanged does not exist. Use onValueChange to receive the selected string value.
  - "Managing open state with onClick instead of onOpenChange. Setting open state via onClick desyncs Radix's internal state. Use open and onOpenChange for controlled usage."
  - Placing SelectLabel outside SelectGroup. The label loses its group association in the accessibility tree. Always nest SelectLabel inside SelectGroup.
```
