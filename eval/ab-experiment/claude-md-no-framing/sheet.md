# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## sheet

```yaml
component: Sheet
summary: A panel that slides in from the edge of the screen to display supplementary content without fully interrupting the current view.
use_when:
  - Use a sheet for actions or detail views that complement the current page, such as filter controls, edit forms, or navigation menus.
  - Reach for a modal dialog instead when the user must make a decision before continuing.
do:
  - Include SheetTitle and SheetDescription inside every SheetContent.
  - "Use the side prop to anchor the sheet to the edge that best matches the content's relationship to the page."
  - Return focus to the trigger element when the sheet closes.
dont:
  - "Don't use a sheet for short confirmations or destructive actions that require a clear yes/no decision — use a dialog instead."
  - "Don't manage open/close state with onClick handlers; use onOpenChange to keep Radix's internal state in sync."
anatomy: Sheet is a compound component with eight named parts. SheetTrigger opens the panel. SheetContent is the sliding panel itself and hosts all inner content. SheetHeader groups SheetTitle and SheetDescription at the top of the panel. SheetFooter anchors actions such as save and cancel buttons at the bottom. SheetClose renders a button that dismisses the panel; SheetContent includes one by default.
contracts:
  - "SheetContent must contain SheetTitle. Without it, the underlying dialog primitive logs a console warning and screen readers can't announce the panel's purpose."
  - SheetDescription is strongly recommended inside SheetContent. Omitting it leaves a dangling aria-describedby pointing to a non-existent element.
  - SheetTrigger and SheetContent must be direct children of Sheet, not nested inside each other.
  - To use a custom trigger element, apply asChild to SheetTrigger. The child must forward refs and accept prop spreading.
variants:
  - "side: — Controls which edge the sheet slides in from; use right (default) for detail panels, left for navigation drawers, and top or bottom for contextual actions on mobile."
  - "showCloseButton: — Pass false to hide the built-in close button when you provide your own dismiss control inside SheetFooter."
placement: "The sheet renders in a portal appended to document.body, so it's never clipped by a parent overflow: hidden container. Use SheetHeader for titles and SheetFooter for actions to keep content consistently structured across sheet instances."
editorial:
  - "Write SheetTitle as a noun phrase or short imperative that names the task: \"Edit profile,\" not \"Panel.\""
  - "Write SheetDescription as one sentence that explains the consequence or purpose of the panel's content."
  - Use sentence case for all text inside the sheet. Never use title case.
keyboard:
  - Escape — Closes the sheet and returns focus to the trigger.
  - Tab — Moves focus forward through interactive elements inside the sheet (focus is trapped).
  - Shift+Tab — Moves focus backward through interactive elements inside the sheet.
aria:
  - "role=\"dialog\" — Applied automatically to SheetContent."
  - "aria-modal=\"true\" — Applied automatically to SheetContent."
  - "aria-labelledby — Applied automatically to SheetContent, pointing to SheetTitle's ID."
  - "aria-describedby — Applied automatically to SheetContent, pointing to SheetDescription's ID."
a11y: Respect prefers-reduced-motion by reducing or removing the slide-in animation for users who have enabled that system setting. The overlay behind the sheet must prevent scroll on the page beneath while the sheet is open.
mistakes:
  - "Omitting SheetTitle — The component appears to work visually, but Radix logs a warning and screen readers can't announce the sheet. Always include SheetTitle, or wrap a visually hidden one with VisuallyHidden if the design omits a visible heading."
  - Using onClick to toggle open state — This breaks Escape-to-close and outside-click dismissal. Use the open and onOpenChange props on Sheet for controlled usage.
  - Wrapping SheetTrigger in a plain div — This breaks the ARIA relationship between the trigger and the panel. Use asChild to merge onto a custom element instead.
```
