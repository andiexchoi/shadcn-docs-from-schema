# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## popover

```yaml
component: Popover
summary: Displays rich content in a floating panel, anchored to a trigger button, for cases where inline display would break layout or interrupt flow.
use_when:
  - Use a popover when you need to surface secondary content, such as a form, description, or set of options, without navigating away or blocking the full page.
  - Choose a tooltip instead when the content is text-only and requires no interaction.
do:
  - Include both PopoverTitle and PopoverDescription inside every PopoverContent.
  - Use asChild on PopoverTrigger to merge popover behavior onto your existing Button component.
  - Control open state through onOpenChange on the root Popover component.
dont:
  - "Don't place a popover inside another popover. Nest complex content within a single panel instead."
  - "Don't use a popover for urgent or blocking decisions. Use a dialog for those cases."
anatomy: The popover has four visible parts. PopoverTrigger is the button that opens and closes the panel. PopoverContent is the floating panel itself, rendered in a portal. Inside PopoverContent, PopoverHeader groups the PopoverTitle and PopoverDescription. The panel anchors to the trigger and repositions automatically to stay within the viewport.
contracts:
  - Popover must wrap all sub-components. It owns the open/closed state and passes it to siblings.
  - PopoverTrigger and PopoverContent must be direct children of Popover, not nested inside each other.
  - "PopoverContent must contain a PopoverTitle. Without it, screen readers cannot announce the panel's purpose."
  - On Radix, use asChild on PopoverTrigger to render your own button element. On Base UI, use the render prop instead.
variants:
  - "align on PopoverContent:: Controls horizontal alignment relative to the trigger. Use \"start\", \"center\", or \"end\" to match the popover's position to surrounding layout."
placement: "PopoverContent renders in a portal at document.body to avoid clipping from overflow: hidden ancestors. It positions relative to PopoverTrigger and flips or shifts automatically when space is constrained."
editorial:
  - Start PopoverTitle with a noun or short noun phrase, not a verb. Keep it under 40 characters.
  - Write PopoverDescription in sentence case. End with a period.
  - Keep PopoverDescription to one or two sentences. Move longer content to a dedicated page.
keyboard:
  - "Enter or Space on trigger: opens the popover."
  - "Escape: closes the popover and returns focus to the trigger."
  - "Tab: moves focus to the next focusable element inside the panel."
  - "Shift+Tab: moves focus to the previous focusable element inside the panel."
aria:
  - "PopoverContent: role=\"dialog\" applied automatically by the primitive."
  - "PopoverContent: aria-labelledby pointing to the PopoverTitle element's ID."
  - "PopoverContent: aria-describedby pointing to the PopoverDescription element's ID."
  - "Decorative icons inside the panel: aria-hidden=\"true\"."
a11y:
  - On close, focus must return to the trigger. Radix and Base UI handle this automatically when you use PopoverTrigger. Custom trigger implementations must manage focus return manually.
  - "Respect prefers-reduced-motion. The panel's open and close animations must be suppressed or reduced when this system setting is active."
mistakes:
  - "Omitting PopoverTitle: The primitive renders without it, but screen readers cannot announce the panel. Always include PopoverTitle, even if you visually hide it with VisuallyHidden."
  - "Using onClick to toggle open state: This bypasses onOpenChange and breaks Escape-to-close and click-outside-to-close behavior. Use onOpenChange on Popover for controlled state."
  - "Wrapping PopoverTrigger in a plain div: This breaks keyboard activation and ARIA relationships. Use asChild (Radix) or render (Base UI) to merge onto your element instead."
  - "Ignoring the portal: Ancestors with overflow: hidden clip PopoverContent when it is not portaled. Confirm the panel renders at document.body, not inside the trigger's DOM subtree."
```
