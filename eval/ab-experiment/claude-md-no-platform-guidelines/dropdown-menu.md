# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## dropdown-menu

```yaml
component: Dropdown menu
summary: A dropdown menu reveals a list of actions or options when the user activates a trigger button.
use_when:
  - "Use a dropdown menu when you have three or more actions that don't all fit inline."
  - Reach for it in contexts like account menus, action overflow menus, or settings controls.
  - Use a select component instead when the user picks a value that updates a form field.
do:
  - Group related items using DropdownMenuGroup with a DropdownMenuLabel.
  - Use DropdownMenuSeparator to create visual breaks between unrelated groups.
  - "Apply variant=\"destructive\" to irreversible actions like \"Delete account.\""
dont:
  - "Don't place more than seven to eight items in a single group without using submenus or separators."
  - "Don't use a dropdown menu as a navigation pattern. Use a nav component for site-level links."
anatomy: The menu consists of five core parts. The trigger is the button the user activates to open the menu. The content is the panel that appears, rendered in a portal at document.body. Groups wrap related items and accept an optional label. Items are the individual actions the user selects. Separators draw a horizontal rule between groups.
contracts: DropdownMenu wraps all sub-components and owns open/closed state. DropdownMenuTrigger and DropdownMenuContent are siblings inside DropdownMenu, not nested inside each other. Use asChild on DropdownMenuTrigger to merge trigger behavior onto a custom button element. The child passed to asChild must forward refs. To manage open state from outside the component, use the open and onOpenChange props on DropdownMenu, not an onClick handler on the trigger.
variants:
  - "variant=\"destructive\" on DropdownMenuItem: Use this for actions that permanently delete or remove data."
  - "DropdownMenuCheckboxItem: Use this when the user toggles an independent on/off state from within the menu."
  - "DropdownMenuRadioGroup with DropdownMenuRadioItem: Use this when the user picks one option from a set of mutually exclusive choices."
  - "DropdownMenuSub: Use this to nest a secondary menu when a group of related actions would otherwise crowd the primary list."
placement: "DropdownMenuContent renders in a portal at document.body by default, which prevents z-index and overflow clipping issues. Align the content panel to the trigger using the align prop: \"start\", \"center\", or \"end\". Use the side prop to control which side of the trigger the panel opens on."
editorial:
  - "Start every item label with an action verb: \"Edit profile,\" \"Delete account.\""
  - Keep item labels under 30 characters.
  - Use sentence case for all labels and group headings.
  - Reserve DropdownMenuShortcut text for real keyboard shortcuts the action supports.
keyboard:
  - "Enter or Space on trigger: opens the menu and moves focus to the first item."
  - "Arrow Down: moves focus to the next item."
  - "Arrow Up: moves focus to the previous item."
  - "Enter on item: activates the item and closes the menu."
  - "Escape: closes the menu and returns focus to the trigger."
  - "Arrow Right on DropdownMenuSubTrigger: opens the submenu."
  - "Arrow Left inside submenu: closes the submenu and returns focus to the parent trigger."
  - "Home: moves focus to the first item."
  - "End: moves focus to the last item."
  - "Type-ahead: typing a character moves focus to the first matching item."
aria:
  - "DropdownMenuTrigger: aria-haspopup=\"menu\" on the trigger element."
  - "DropdownMenuTrigger: aria-expanded=\"true\" when open, aria-expanded=\"false\" when closed."
  - "DropdownMenuContent: role=\"menu\" on the content element."
  - "DropdownMenuItem: role=\"menuitem\" on each item element."
  - "DropdownMenuCheckboxItem: role=\"menuitemcheckbox\", aria-checked=\"true\" or \"false\"."
  - "DropdownMenuRadioItem: role=\"menuitemradio\", aria-checked=\"true\" on the selected item."
  - "DropdownMenuLabel: role=\"presentation\" — labels are not focusable items."
a11y: "Focus returns to the trigger element automatically when the menu closes, provided you use DropdownMenuTrigger correctly. If you render a custom trigger without asChild and ref forwarding, focus return breaks. Respect the user's reduced-motion preference by disabling open/close animations when prefers-reduced-motion: reduce is active."
mistakes: Using onClick to control open state. This breaks Escape key dismissal and outside-click closing. Use open and onOpenChange on DropdownMenu for controlled state. Wrapping DropdownMenuTrigger in a plain div. This breaks keyboard navigation and ARIA relationships. Pass your custom element as the direct child of DropdownMenuTrigger with asChild instead. Omitting onValueChange and using a fabricated prop name. Props like onValueChanged or onChange do not exist on this component. Use onValueChange where the API requires it, and refer to the Radix UI or Base UI API reference for exact prop names. Placing interactive elements inside DropdownMenuLabel. Labels are not focusable. If you need an interactive group header, use a DropdownMenuItem instead.
```
