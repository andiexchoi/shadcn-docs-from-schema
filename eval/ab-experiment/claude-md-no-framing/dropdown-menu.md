# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## dropdown-menu

```yaml
component: dropdown-menu
summary: Presents a list of actions or options in a panel that opens from a trigger button, used when you need to offer multiple commands without cluttering the UI.
use_when:
  - "Use dropdown-menu for contextual actions tied to a specific element, such as a row in a table (\"Edit,\" \"Duplicate,\" \"Delete\") or an account menu in a navigation bar."
  - If you need the user to select a value from a list to populate a form field, use a Select component instead.
do:
  - "Label menu items with verb-noun pairs that describe the outcome: \"Delete account,\" not \"OK.\""
  - Use DropdownMenuSeparator and DropdownMenuGroup to group related actions visually.
  - "Use variant=\"destructive\" on irreversible actions such as delete or remove."
dont:
  - "Don't nest more than two levels of submenus; deeper nesting makes items hard to reach by keyboard."
  - Avoid using dropdown-menu as a navigation component for top-level app destinations; use a navigation menu instead.
anatomy: DropdownMenu is the root that manages open/closed state. DropdownMenuTrigger is the button that opens the panel. DropdownMenuContent is the floating panel that renders into a portal. Inside the panel, DropdownMenuGroup clusters related items, DropdownMenuLabel names each group, and DropdownMenuSeparator draws a visual divider between groups. Individual actions are DropdownMenuItem elements; DropdownMenuCheckboxItem and DropdownMenuRadioItem handle toggle and exclusive-selection patterns respectively. DropdownMenuShortcut renders a keyboard hint inline with a label.
contracts:
  - DropdownMenuTrigger and DropdownMenuContent must be direct children of DropdownMenu. Do not nest them inside each other.
  - "On the Radix variant, pass asChild to DropdownMenuTrigger when rendering a custom button element, so the trigger's props and ARIA attributes merge onto your element rather than adding a wrapper."
  - On the Base UI variant, pass your button element to DropdownMenuTrigger via the render prop instead of using asChild.
  - Submenus require a DropdownMenuSub wrapper containing both DropdownMenuSubTrigger and DropdownMenuSubContent as siblings.
variants:
  - "variant=\"destructive\" on DropdownMenuItem: Use for actions that delete data or cannot be undone; applies danger styling to signal consequence."
  - "DropdownMenuCheckboxItem: Use when an item represents an independently toggleable state, such as \"Show toolbar.\""
  - "DropdownMenuRadioGroup with DropdownMenuRadioItem: Use for mutually exclusive choices within the menu, such as selecting a sort order."
  - "DropdownMenuSub: Use to nest a secondary set of actions under a parent item when the primary menu would otherwise become too long."
placement: "DropdownMenuContent renders into a portal at document.body, so parent overflow: hidden or z-index stacking contexts don't clip it. Align the panel to the trigger using the align prop (start, center, end) and control the gap with sideOffset."
editorial:
  - "Write item labels in sentence case: \"Delete account,\" not \"Delete Account.\""
  - "Use verb-noun pairs for action items: \"Rename file,\" \"Export data.\""
  - Keep each label to three words or fewer.
  - "For group labels, use a noun that names the category: \"Account,\" \"Team,\" not \"Account actions.\""
keyboard:
  - "Enter or Space on trigger: opens the menu and moves focus to the first item."
  - "Arrow Down / Arrow Up: moves focus between items."
  - "Enter on item: activates the item and closes the menu."
  - "Escape: closes the menu and returns focus to the trigger."
  - "Arrow Right on DropdownMenuSubTrigger: opens the submenu."
  - "Arrow Left inside submenu: closes the submenu and returns focus to the parent trigger."
  - "Home / End: moves focus to the first or last item."
aria:
  - "DropdownMenuTrigger: receives aria-haspopup=\"menu\" and aria-expanded (true when open, false when closed) automatically."
  - "DropdownMenuContent: receives role=\"menu\" automatically."
  - "DropdownMenuItem: receives role=\"menuitem\" automatically."
  - "DropdownMenuCheckboxItem: receives role=\"menuitemcheckbox\" and aria-checked automatically."
  - "DropdownMenuRadioItem: receives role=\"menuitemradio\" and aria-checked automatically."
  - "Decorative icons placed inside menu items must have aria-hidden=\"true\"."
a11y: "Focus returns to DropdownMenuTrigger automatically when the menu closes, provided you use the built-in trigger and don't implement a custom open/close handler. Respect prefers-reduced-motion by removing entry animations in your CSS when the user has enabled that setting. Don't rely on color alone to distinguish destructive items; pair variant=\"destructive\" with a label that names the consequence."
mistakes:
  - "Using onOpenChange incorrectly: Don't manage open state with onClick on the trigger. Use onOpenChange on DropdownMenu; otherwise, clicking outside and pressing Escape stop working."
  - "Wrapping DropdownMenuTrigger in a div: This breaks the ARIA relationship between trigger and menu. Use asChild (Radix) or the render prop (Base UI) to merge onto your custom element."
  - "Omitting DropdownMenuSub for submenus: Placing DropdownMenuSubTrigger and DropdownMenuSubContent outside a DropdownMenuSub wrapper breaks open state and keyboard navigation for the nested panel."
  - "Hardcoding aria-label on the trigger: When the trigger has visible text, the accessible name comes from that text automatically. Adding a mismatched aria-label creates a discrepancy between what sighted and non-sighted users perceive."
```
