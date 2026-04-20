# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## popover

```yaml
component: Popover
summary: Displays rich content anchored to a trigger element in a portal, used when you need more space than a tooltip provides but less interruption than a modal dialog.
use_when:
  - Use a popover for supplementary content like settings panels, filter controls, or small forms that appear on demand without blocking the rest of the UI.
  - If the content requires an immediate decision or confirmation, use a dialog instead.
  - If the content is read-only and brief, use a tooltip instead.
do:
  - Include a PopoverTitle and PopoverDescription inside every PopoverContent.
  - Use a focusable element as the trigger so keyboard users can open the popover.
  - Keep popover content focused on a single task or topic.
dont:
  - "Don't manage open/close state with onClick handlers instead of onOpenChange; this breaks Escape key dismissal and outside-click behavior."
  - Avoid nesting interactive components that require their own focus trap inside a popover.
anatomy: PopoverTrigger is the button or element that opens the popover. PopoverContent is the floating panel rendered in a portal, which prevents overflow and z-index clipping. Inside PopoverContent, PopoverHeader wraps PopoverTitle and PopoverDescription, which label the panel for sighted and screen reader users. The panel closes when the user presses Escape, selects outside the panel, or activates the trigger again.
contracts:
  - Popover is the root and must wrap both PopoverTrigger and PopoverContent as direct children or siblings inside the root.
  - "PopoverContent must contain PopoverTitle. Without it, screen readers can't announce the panel's purpose."
  - On Radix, use asChild on PopoverTrigger to merge behavior onto a custom element. The child must forward refs; a wrapper div breaks keyboard navigation.
  - On Base UI, use the render prop on PopoverTrigger instead of asChild to achieve the same result.
variants:
  - "align: — Controls horizontal alignment of PopoverContent relative to the trigger; use start, center, or end to anchor the panel to the corresponding edge of the trigger."
placement: "PopoverContent renders in a portal at document.body by default, so it's never clipped by parent overflow: hidden containers. Use the align prop on PopoverContent to control how the panel aligns to the trigger horizontally."
editorial:
  - Write PopoverTitle as a noun phrase or short sentence fragment, not a full sentence.
  - Write PopoverDescription in sentence case and end it with a period.
  - Keep PopoverDescription to one or two sentences.
  - Use sentence case for all text inside the popover.
keyboard:
  - "Enter or Space on trigger: opens the popover."
  - "Escape: closes the popover and returns focus to the trigger."
  - "Tab: moves focus forward through interactive elements inside the popover."
  - "Shift+Tab: moves focus backward through interactive elements inside the popover."
aria:
  - "PopoverContent receives role=\"dialog\" automatically via the primitive."
  - "aria-labelledby on PopoverContent points to the PopoverTitle element's ID."
  - "aria-describedby on PopoverContent points to the PopoverDescription element's ID when present."
a11y:
  - Focus moves into PopoverContent on open and returns to the trigger on close. If you use a custom trigger without the PopoverTrigger primitive, you must manage focus return manually.
  - "Respect prefers-reduced-motion by disabling or reducing the popover's open and close animations for users who have enabled this system setting."
mistakes:
  - "Using onClick to toggle open state instead of onOpenChange. This desynchronizes Radix's internal state, causing Escape and outside-click dismissal to stop working. Pass open and onOpenChange to Popover for controlled usage."
  - "Omitting PopoverTitle. Without it, screen readers can't announce what the panel contains. If you don't want a visible title, wrap PopoverTitle in a VisuallyHidden component rather than removing it."
  - Wrapping PopoverTrigger in a plain div instead of using asChild or render. This breaks the ARIA relationship between trigger and panel and prevents keyboard activation. Merge onto your custom element using the correct prop for your primitive (asChild for Radix, render for Base UI).
```
