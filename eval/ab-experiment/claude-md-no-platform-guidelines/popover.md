# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## popover

```yaml
component: Popover
summary: A popover displays rich, interactive content in a floating panel, triggered by a button.
use_when:
  - Use a popover when you need to surface structured content, like a form, settings panel, or detail view, without navigating away from the page.
  - Choose a tooltip instead when the content is plain descriptive text and requires no interaction.
do:
  - Include a PopoverTitle and PopoverDescription inside every PopoverContent.
  - Use PopoverHeader to group the title and description together.
  - Use onOpenChange to manage open/closed state in controlled patterns.
dont:
  - "Don't use a popover for plain, non-interactive text. Use a tooltip instead."
  - "Don't toggle open state with onClick handlers. Use onOpenChange to keep Radix state in sync."
anatomy: "A popover has four visible parts: the trigger, the floating panel, the header, and the body content. The trigger is the button that opens the panel. The floating panel renders in a portal attached to document.body, which prevents z-index and overflow clipping issues. PopoverHeader groups PopoverTitle and PopoverDescription at the top of the panel. Body content sits below the header and can include forms, links, or any interactive elements."
contracts:
  - Popover must wrap both PopoverTrigger and PopoverContent as siblings. Do not nest the trigger inside the content.
  - "PopoverContent must contain PopoverTitle. Without it, screen readers cannot announce the panel's purpose."
  - For the Radix variant, use asChild on PopoverTrigger to merge popover behavior onto a custom button element. The child must forward refs. For the Base UI variant, use the render prop instead.
  - Use onOpenChange on Popover for controlled open state. Do not manage open state outside this prop.
variants:
  - "align on PopoverContent:: Controls horizontal alignment of the panel relative to the trigger. Use \"start\", \"center\", or \"end\" to match your layout needs."
placement: PopoverContent renders in a portal at document.body by default. Position the trigger naturally in your layout. The panel positions itself relative to the trigger using the align prop on PopoverContent.
editorial:
  - Start PopoverTitle with a noun that names the content, not a verb.
  - Keep PopoverTitle under 40 characters.
  - Write PopoverDescription as a complete sentence and end it with a period.
  - Use sentence case for both PopoverTitle and PopoverDescription.
keyboard:
  - "Enter or Space on trigger: opens the popover panel."
  - "Escape: closes the panel and returns focus to the trigger."
  - "Tab: moves focus forward through interactive elements inside the panel."
  - "Shift+Tab: moves focus backward through interactive elements inside the panel."
aria:
  - "aria-haspopup=\"dialog\": set on PopoverTrigger to signal the trigger opens a panel."
  - "aria-expanded: set on PopoverTrigger, value is \"true\" when open and \"false\" when closed."
  - "role=\"dialog\": set on PopoverContent to identify the floating panel to screen readers."
  - "aria-labelledby: set on PopoverContent, pointing to the PopoverTitle element's ID."
a11y:
  - On close, focus must return to the trigger element. Radix and Base UI handle this automatically when you use PopoverTrigger correctly. Custom trigger implementations break focus return.
  - If your PopoverContent omits PopoverDescription, Radix generates an aria-describedby pointing to a non-existent ID. Add PopoverDescription or suppress the warning explicitly.
  - "Respect the user's reduced-motion preference for panel open and close animations."
mistakes:
  - "Using onClick to toggle state. This desyncs Radix's internal state and breaks Escape and outside-click dismissal. Use onOpenChange on Popover instead."
  - Omitting PopoverTitle. The panel has no accessible name without it. Always include PopoverTitle inside PopoverContent, even if you visually hide it.
  - Wrapping PopoverTrigger in a plain div. This breaks keyboard navigation and ARIA relationships. Use asChild (Radix) or the render prop (Base UI) to merge behavior onto your custom element.
  - Mixing up the render and asChild APIs. The Base UI variant uses render={<Button />} on PopoverTrigger. The Radix variant uses asChild. Using the wrong pattern silently breaks trigger behavior.
```
