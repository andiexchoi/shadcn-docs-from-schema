# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## sheet

```yaml
component: Sheet
summary: A sheet slides in from a screen edge to display supplementary content without navigating away from the current page.
use_when:
  - Use a sheet for contextual tasks like editing settings, reviewing details, or filling out a form alongside the main content.
  - For a task that requires full focus and blocks the page completely, use a Dialog instead.
do:
  - Include both SheetTitle and SheetDescription inside every SheetContent.
  - "Use the side prop to match the sheet position to the user's expected content flow."
  - Return focus to the trigger element when the sheet closes.
dont:
  - "Don't use onClick to toggle open/close state. Use onOpenChange to keep Radix state in sync."
  - "Don't omit SheetTitle to save space. Wrap it in VisuallyHidden if you need to hide it visually."
anatomy: "A sheet has five named parts: SheetTrigger, SheetContent, SheetHeader, SheetTitle, and SheetDescription. SheetHeader groups the title and description at the top of the panel. SheetFooter is optional and holds actions like save or cancel buttons. A close button renders inside SheetContent by default. Set showCloseButton={false} on SheetContent to hide it."
contracts:
  - Sheet wraps all sub-components and provides open/closed state. Place SheetTrigger and SheetContent as direct children of Sheet.
  - SheetContent must contain SheetTitle. Without it, the underlying Dialog primitive logs a console warning and screen readers cannot announce the panel.
  - SheetDescription is strongly recommended inside SheetContent. Omitting it leaves a dangling aria-describedby pointing to a non-existent ID.
  - To use a custom trigger element, add asChild to SheetTrigger. The child must forward refs and accept prop spreading.
variants:
  - "side: on SheetContent: controls which screen edge the sheet slides from. Accepts top, right, bottom, or left."
  - "showCloseButton: on SheetContent: set to false when you provide your own close control inside the sheet body."
placement: SheetContent renders inside a portal at document.body to avoid z-index and overflow clipping from ancestor elements. Do not nest SheetContent inside a positioned ancestor to work around layout issues.
editorial:
  - "Start SheetTitle with a noun or action verb that names the task, such as \"Edit profile\" or \"Filter results.\""
  - Keep SheetTitle under 40 characters.
  - Write SheetDescription as a single sentence that explains what the user can do or what will happen.
  - Use sentence case for both SheetTitle and SheetDescription.
keyboard:
  - "Escape: closes the sheet and returns focus to the trigger."
  - "Tab: moves focus forward through interactive elements inside the sheet."
  - "Shift+Tab: moves focus backward through interactive elements inside the sheet."
aria:
  - "role=\"dialog\" on the SheetContent container, set automatically by the primitive."
  - "aria-modal=\"true\" on the SheetContent container, set automatically."
  - "aria-labelledby on SheetContent, pointing to the SheetTitle element's ID."
  - "aria-describedby on SheetContent, pointing to the SheetDescription element's ID."
a11y:
  - The sheet traps focus inside SheetContent while open. Focus must not reach the page behind the overlay.
  - On close, Radix returns focus to the trigger automatically when you use SheetTrigger. Custom trigger implementations must handle focus return manually.
  - "If your project uses prefers-reduced-motion, ensure the sheet's slide-in animation respects that setting to avoid motion discomfort."
mistakes:
  - "Omitting SheetTitle: AI tools and unfamiliar developers often skip SheetTitle because TypeScript does not enforce it. Radix warns at runtime and screen readers cannot announce an untitled panel. Always include SheetTitle, or use VisuallyHidden to hide it."
  - "Using onClick for open/close: Managing open state with onClick breaks Escape key dismissal and outside-click detection. Use onOpenChange on Sheet for all state changes."
  - "Wrapping SheetTrigger in a plain div: A wrapper div breaks the ARIA trigger relationship and keyboard activation. Use asChild to merge the trigger behavior onto your custom element instead."
  - "Hardcoding aria-label on the container: When SheetTitle is present, the correct pattern is aria-labelledby pointing to the title's ID. A hardcoded aria-label can drift from the visible text and create a mismatch for screen reader users."
```
