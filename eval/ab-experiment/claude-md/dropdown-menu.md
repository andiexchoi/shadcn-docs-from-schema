# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## dropdown-menu

```yaml
component: Dropdown-menu
summary: Reveals a contextual list of actions or options anchored to a trigger element, when a flat list of choices belongs in-context but not permanently on screen.
use_when:
  - Use dropdown-menu for secondary or overflow actions tied to a specific trigger, such as account options behind an avatar or row-level table actions.
  - Use a select component instead when you need the user to pick a value that feeds into a form field.
do:
  - Group related items with DropdownMenuGroup and label each group with DropdownMenuLabel.
  - "Use variant=\"destructive\" on DropdownMenuItem for actions that delete data or can't be undone."
  - Use DropdownMenuSub to nest a second level of actions when the primary menu would otherwise exceed seven items.
dont:
  - "Don't use onOpenChange replacements like onClick to toggle open/closed state. Radix manages open state internally, and bypassing it breaks Escape-key dismissal and outside-click behavior."
anatomy: "DropdownMenu has five visible parts. The trigger is any button or interactive element that opens the menu. The content panel is the floating container that holds all menu items. Items are individual actions the user can select. Labels are non-interactive headings that name a group of items. Separators are horizontal rules that divide groups visually. Items truncate at the content panel's width. Set a min-width on DropdownMenuContent to prevent items from wrapping."
contracts:
  - DropdownMenuTrigger and DropdownMenuContent must both be direct children of DropdownMenu. Do not nest one inside the other.
  - "On the Radix variant, use asChild on DropdownMenuTrigger to merge trigger behavior onto a custom button element. The child must forward refs. Components that don't forward refs break focus management."
  - "On the Base UI variant, use the render prop on DropdownMenuTrigger instead of asChild. Pass a component reference, not a rendered element: render={<Button variant=\"outline\" />}."
  - Place DropdownMenuCheckboxItem or DropdownMenuRadioItem inside a DropdownMenuGroup. For radio items, wrap the group in DropdownMenuRadioGroup and pass a value prop.
variants:
  - "Default item:: Use for standard navigation or action items with no selection state."
  - "DropdownMenuCheckboxItem:: Use when an item toggles an independent boolean setting, such as showing or hiding a column."
  - "DropdownMenuRadioGroup with DropdownMenuRadioItem:: Use when exactly one option in a group must be active at a time, such as a sort order."
  - "variant=\"destructive\" on DropdownMenuItem:: Use only for irreversible actions, such as deleting a record."
  - "DropdownMenuSub:: Use to nest a secondary panel of actions when a flat list would become too long."
placement: DropdownMenuContent renders inside a portal attached to document.body. This prevents z-index and overflow-clipping issues from ancestor elements. Set side and align props on DropdownMenuContent to control which edge of the trigger the panel anchors to.
editorial:
  - "Start each item label with an action verb: \"Delete account,\" not \"Account deletion.\""
  - Use sentence case for all item labels and group labels.
  - Keep item labels under 30 characters.
  - "Reserve destructive labels for actions that can't be undone. Use precise language: \"Delete project,\" not \"Remove.\""
keyboard:
  - "Enter or Space on trigger: opens the menu and moves focus to the first item."
  - "Arrow Down: moves focus to the next item."
  - "Arrow Up: moves focus to the previous item."
  - "Enter on item: activates the item and closes the menu."
  - "Escape: closes the menu and returns focus to the trigger."
  - "Arrow Right on sub-trigger: opens the submenu."
  - "Arrow Left inside submenu: closes the submenu and returns focus to the sub-trigger."
  - "Home: moves focus to the first item."
  - "End: moves focus to the last item."
  - "Printable character: moves focus to the next item whose label starts with that character."
aria:
  - "DropdownMenuTrigger: renders with aria-haspopup=\"menu\" and aria-expanded=\"true\" when open, aria-expanded=\"false\" when closed. Radix sets these automatically when the trigger is used correctly."
  - "DropdownMenuContent: renders with role=\"menu\"."
  - "DropdownMenuItem: renders with role=\"menuitem\"."
  - "DropdownMenuCheckboxItem: renders with role=\"menuitemcheckbox\" and aria-checked=\"true\" or aria-checked=\"false\"."
  - "DropdownMenuRadioItem: renders with role=\"menuitemradio\" and aria-checked=\"true\" on the selected item."
  - "DropdownMenuLabel: renders with no interactive role. Screen readers read it as static text within the group."
  - "Decorative icons inside items must have aria-hidden=\"true\"."
a11y:
  - "On close, focus must return to the trigger that opened the menu. Radix handles this automatically when you use DropdownMenuTrigger correctly. Custom trigger implementations that don't use asChild or the render prop break focus return."
  - Pair destructive items with a confirmation dialog before executing the action. The menu item itself must not immediately delete data.
  - To respect prefers-reduced-motion, disable open/close transition animations when the user has enabled that system setting.
mistakes:
  - "Using onClick instead of onOpenChange to control open state. This desyncs Radix's internal state. Outside-click and Escape-key dismissal stop working. Pass controlled state through open and onOpenChange props on DropdownMenu."
  - Wrapping DropdownMenuTrigger in a plain div. This breaks the ARIA relationship between the trigger and the menu. Use asChild (Radix) or render (Base UI) to merge trigger behavior onto your element.
  - "Omitting aria-hidden=\"true\" on decorative icons. Screen readers announce icon element names alongside the item label. Mark every decorative icon with aria-hidden=\"true\"."
  - Placing DropdownMenuRadioItem outside a DropdownMenuRadioGroup. The value and selection state on individual radio items only work when a parent DropdownMenuRadioGroup provides the value and onValueChange props.
```
