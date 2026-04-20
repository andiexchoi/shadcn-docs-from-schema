# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## dialog

```yaml
component: Dialog
summary: A dialog overlays the primary window with focused content or actions, blocking interaction with the page beneath it.
use_when:
  - Use a dialog to collect user input, confirm a destructive action, or present information that requires an immediate decision.
  - Use a page or drawer instead when the task involves multiple steps or needs persistent context.
do:
  - Include a DialogTitle in every dialog, even if you visually hide it.
  - Use onOpenChange to control open and close state.
  - Return focus to the trigger element when the dialog closes.
dont:
  - "Don't nest a dialog inside another dialog. Use a second trigger at the page level instead."
  - "Don't use a dialog for non-urgent information. Use a toast or inline message instead."
anatomy: A dialog consists of five named parts. DialogTrigger opens the overlay. DialogContent is the panel that renders over the page. DialogHeader groups DialogTitle and DialogDescription at the top of the panel. DialogFooter holds action buttons at the bottom. A close button renders inside DialogContent by default. Pass showCloseButton={false} to remove it.
contracts:
  - "DialogContent must contain a DialogTitle. Without it, the primitive logs a console warning and screen readers can't announce the dialog name. If you omit a visible title, wrap DialogTitle in a VisuallyHidden component."
  - DialogDescription is optional but strongly encouraged. When absent, the primitive generates a dangling aria-describedby pointing to a non-existent ID.
  - DialogTrigger and DialogContent must be direct children of Dialog, not nested inside each other.
  - To use a custom trigger element, add asChild to DialogTrigger. The child must forward refs and accept prop spreading.
variants:
  - "showCloseButton: Pass showCloseButton={false} to hide the default close button when you supply a custom close control inside DialogFooter."
  - "Scrollable content: Use the scrollable content pattern when dialog body text overflows, so the header and footer remain visible while the body scrolls."
  - "Sticky footer: Use the sticky footer pattern when action buttons must remain visible regardless of content length."
placement: DialogContent renders inside a portal attached to document.body, avoiding z-index and overflow clipping issues. Center the dialog horizontally and vertically in the viewport. Do not constrain dialog width inside a parent container.
editorial:
  - "Start the DialogTitle with a noun or verb that names the task, such as \"Edit profile\" or \"Delete account.\""
  - Keep DialogTitle under 50 characters.
  - Write DialogDescription as a complete sentence and end it with a period.
  - "Label confirm actions with the specific action, such as \"Delete account,\" not \"OK\" or \"Confirm.\""
keyboard:
  - "Escape: Closes the dialog and returns focus to the trigger."
  - "Tab: Moves focus forward through interactive elements inside the dialog."
  - "Shift+Tab: Moves focus backward through interactive elements inside the dialog."
aria:
  - "role=\"dialog\" on the DialogContent container."
  - "aria-modal=\"true\" on the DialogContent container."
  - "aria-labelledby on DialogContent, pointing to the DialogTitle element's ID."
  - "aria-describedby on DialogContent, pointing to the DialogDescription element's ID when a description is present."
a11y: When the dialog opens, focus moves to the first interactive element inside DialogContent. When the dialog closes, focus returns to the DialogTrigger that opened it. If your project supports prefers-reduced-motion, disable or reduce entry and exit animations on DialogContent.
mistakes:
  - "Using open with onClick instead of onOpenChange: Toggling state with onClick breaks Radix's internal state machine. Clicking outside the dialog and pressing Escape stop working. Use onOpenChange for all open and close logic."
  - "Omitting DialogTitle: Skipping DialogTitle leaves screen readers without an announcement when the dialog opens. Always include it, and use VisuallyHidden if the design calls for no visible heading."
  - "Wrapping DialogTrigger in a plain div: A wrapper div breaks the ARIA relationship between trigger and dialog and disables keyboard activation. Use asChild to merge trigger behavior onto a custom element instead."
  - "Hardcoding aria-label on the container: When a visible DialogTitle exists, use aria-labelledby pointing to its ID. A hardcoded aria-label string drifts from the visible text and creates a mismatch for screen reader users."
```
