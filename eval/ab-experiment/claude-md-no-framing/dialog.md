# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## dialog

```yaml
component: Dialog
summary: Displays a modal window over the current page to capture a user decision or form input that requires immediate attention before work can continue.
use_when:
  - "Use a dialog for actions that need a response before the user proceeds: confirming a destructive action, completing a short form, or presenting critical information."
  - "For simple confirmations that don't require explanation, prefer an inline pattern; for complex flows with many steps, use a dedicated page."
do:
  - "Label dialog action buttons with verbs that describe the outcome: \"Delete account,\" \"Save changes.\""
  - "Include a way to dismiss: a close button, a cancel button, or both."
  - Keep body copy to one or two sentences.
dont:
  - "Don't use a dialog for non-urgent information; it interrupts the user's flow by design."
  - "Don't use \"OK,\" \"Yes,\" or \"Submit\" as action labels; they don't tell the user what will happen."
  - Avoid opening a dialog from inside another dialog; stack depth creates disorientation.
anatomy: The dialog consists of five named parts. DialogTrigger is the element the user selects to open the dialog. DialogContent is the modal panel that appears, rendered in a portal at document.body to avoid z-index and overflow clipping issues. DialogHeader groups the DialogTitle and optional DialogDescription at the top of the panel. DialogFooter holds action buttons and sits at the bottom. A default close button appears in the upper-right corner of DialogContent; use showCloseButton={false} to hide it or replace it with a custom control.
contracts:
  - "Dialog must wrap DialogTrigger and DialogContent as siblings. Don't nest them inside each other."
  - "DialogContent must contain a DialogTitle. Without it, the library logs a console warning and screen readers can't announce the dialog name. If you want no visible title, wrap DialogTitle in a VisuallyHidden component."
  - DialogDescription is optional, but omitting it leaves a dangling aria-describedby reference. Include it or suppress it intentionally.
  - To use a custom trigger element, add asChild to DialogTrigger. The child must accept ref forwarding and prop spreading; a plain wrapper div breaks keyboard navigation and ARIA relationships.
variants:
  - "showCloseButton={false}: Use when you want to supply a fully custom close control rather than the default button in the upper-right corner."
placement: "DialogContent renders in a portal at document.body, centered in the viewport over a backdrop. Page scroll locks while the dialog is open. Don't position DialogContent manually; let the component handle centering."
editorial:
  - "Write DialogTitle as a clear question or statement: \"Delete this item?\" or \"Edit your profile.\""
  - Write DialogDescription as one sentence that states the consequence or context.
  - Use sentence case for all text, including button labels.
  - "Label the primary action with a verb-noun pair that names the outcome: \"Delete account,\" not \"Confirm.\""
keyboard:
  - "Enter or Space on the trigger: opens the dialog."
  - "Tab: moves focus forward through focusable elements inside the dialog (focus is trapped)."
  - "Shift+Tab: moves focus backward through focusable elements inside the dialog."
  - "Escape: closes the dialog and returns focus to the trigger."
aria:
  - "role=\"dialog\" on DialogContent."
  - "aria-modal=\"true\" on DialogContent."
  - "aria-labelledby on DialogContent, pointing to the DialogTitle element's ID."
  - "aria-describedby on DialogContent, pointing to the DialogDescription element's ID when present."
a11y:
  - "On open, focus moves into the dialog automatically. On close, focus returns to the trigger that opened it. Custom trigger implementations that don't use DialogTrigger break this return behavior."
  - Respect prefers-reduced-motion for open and close animations.
  - The backdrop renders the content underneath inert, preventing screen readers from reaching page content while the dialog is open.
mistakes:
  - "Omitting DialogTitle: It looks optional in JSX but is required at runtime. Screen readers can't announce the dialog without it. Always include it, visually hidden if necessary."
  - "Using onClick to manage open state instead of onOpenChange: This desyncs Radix's internal state, causing Escape and outside-click dismissal to stop working. Use the open and onOpenChange props for controlled dialogs."
  - "Wrapping DialogTrigger in a div: This breaks the ARIA trigger relationship and keyboard activation. Use asChild to merge onto a custom element instead."
  - "Hardcoding aria-label on the dialog container: When DialogTitle is present, use aria-labelledby pointing to its ID. A hardcoded aria-label drifts from the visible title and creates a mismatch for screen reader users."
```
