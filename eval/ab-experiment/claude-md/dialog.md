# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## dialog

```yaml
component: Dialog
summary: Interrupts the user with an overlay window that requires an immediate decision or action before they can continue.
use_when:
  - "Use a dialog for decisions that can't be deferred, such as confirming a destructive action or completing a short required form."
  - For simple confirmations that fit inline, or for non-blocking information, choose a toast or inline message instead.
do:
  - "Write dialog titles as clear questions or statements: \"Delete this item?\" not \"Warning.\""
  - Include a cancel button or close button on every dialog.
  - "Use destructive button styling for actions that delete data or can't be undone."
dont:
  - "Don't use a dialog for information the user doesn't need to act on. Use a toast instead."
  - "Don't omit DialogTitle. Screen readers can't announce the dialog without it."
anatomy: A dialog consists of five named parts. DialogTrigger opens the dialog. DialogContent is the overlay panel that wraps all inner content. DialogHeader groups DialogTitle and DialogDescription at the top. DialogFooter holds the action buttons at the bottom. A close button appears in the top-right corner of DialogContent by default. Use showCloseButton={false} to hide it when you supply a custom close control.
contracts:
  - Dialog wraps all sub-components and owns open/close state. Place DialogTrigger and DialogContent as direct children.
  - DialogContent must contain DialogTitle. Omitting it triggers a runtime warning and breaks screen reader announcement.
  - DialogDescription is optional, but omitting it causes a dangling aria-describedby reference. Include it or suppress it intentionally.
  - To use a custom trigger element, add asChild to DialogTrigger. The child must forward refs and accept prop spreading.
variants:
  - "showCloseButton={false}: Hides the default close button. Use this only when you render a custom close control inside DialogContent."
placement: DialogContent renders into a portal at document.body. This prevents z-index and overflow clipping issues from ancestor elements. Center the dialog horizontally and vertically in the viewport.
editorial:
  - "Start DialogTitle with an action verb or a direct question: \"Discard changes?\" not \"Unsaved changes.\""
  - Keep DialogDescription to one or two sentences. Longer copy belongs on a dedicated page.
  - "Label action buttons with verbs that describe the outcome: \"Delete,\" \"Save,\" \"Discard,\" not \"OK\" or \"Yes.\""
  - Use sentence case for all text inside the dialog.
keyboard:
  - "Escape: closes the dialog and returns focus to the trigger."
  - "Tab: moves focus forward within the dialog. Focus must not leave the dialog."
  - "Shift+Tab: moves focus backward within the dialog."
aria:
  - "role=\"dialog\" on the DialogContent container."
  - "aria-modal=\"true\" on the DialogContent container."
  - "aria-labelledby on DialogContent, pointing to the DialogTitle element's ID."
  - "aria-describedby on DialogContent, pointing to the DialogDescription element's ID when present."
a11y:
  - On open, focus moves into DialogContent. On close, focus returns to the DialogTrigger element automatically when you use the built-in DialogTrigger.
  - Wrap the page behind the dialog in an inert layer. DialogContent handles this automatically via the portal.
  - Respect prefers-reduced-motion. Reduce or remove the open/close animation for users who have enabled this system setting.
mistakes:
  - "Using open state with onClick instead of onOpenChange: This breaks Radix's internal state management. Clicking outside and pressing Escape stop working. Pass open and onOpenChange together for controlled usage."
  - "Omitting DialogTitle: The dialog renders without an accessible name. Radix logs a warning. If you don't want a visible title, wrap DialogTitle in a VisuallyHidden component."
  - "Wrapping DialogTrigger in a plain div: This breaks keyboard activation and ARIA relationships. Use asChild to merge onto a custom element instead."
  - "Hardcoding aria-label on DialogContent: When DialogTitle exists, use aria-labelledby pointing to its ID. A hardcoded aria-label can drift from the visible text and create a mismatch for screen reader users."
```
