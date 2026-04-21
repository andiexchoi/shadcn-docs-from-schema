# Dialog

A dialog overlays the page to capture an immediate decision or display critical information that blocks further action until the user responds.

## When to use

Use a dialog when an action requires confirmation before it executes, or when you need to collect input that cannot happen inline. Reserve it for genuinely disruptive moments: destructive actions, unsaved-change warnings, or required form input.

**Use an alternative when:**
- **Sheet or Drawer:** the content is a form or panel too large for a centered overlay, or you want it to slide in from an edge.
- **Alert dialog:** the action is irreversible and the user must not dismiss it by pressing Escape or selecting the overlay, because dialog allows both.
- **Inline validation or toast:** the feedback is non-blocking and doesn't require an explicit user response.

## Do's and don'ts

**Do**
- Label action buttons with verbs that describe the outcome: "Delete account," "Save changes," not "OK" or "Yes."
- Keep body copy to two sentences or fewer. Move longer content to a panel or dedicated page.
- Place the primary action on the right and cancel on the left in the footer.

**Don't**
- Don't open a dialog from another dialog. Stack depth creates orientation loss. Use a single dialog and update its content instead.
- Don't use a dialog for non-blocking confirmations. A toast or inline message is less disruptive and keeps the user in context.

## Anatomy

A dialog has five named parts. `Dialog` is the root that manages open/closed state. `DialogTrigger` is the element that opens it. `DialogContent` is the overlay panel containing all visible content. `DialogHeader` groups `DialogTitle` and `DialogDescription` at the top. `DialogFooter` holds the action buttons at the bottom. `DialogContent` renders into a portal on `document.body` to avoid z-index and overflow issues.

## Component contracts

- `DialogContent` requires a `DialogTitle` inside it. Without one, the library logs a console warning and screen readers cannot announce the dialog name. Wrap it in `VisuallyHidden` if you need it hidden from view.
- `DialogDescription` is optional but strongly preferred. Omitting it leaves `aria-describedby` pointing to a non-existent ID. Accept that tradeoff consciously.
- `DialogTrigger` must be a direct child of `Dialog`, not wrapped in a plain `div`. Use `asChild` to merge trigger behavior onto a custom element that accepts ref forwarding.
- Use `onOpenChange` on `Dialog` for controlled open state. Do not use `onClick` to toggle state manually.

## Variants and patterns

- **Destructive confirmation:** use danger or destructive button styling on the primary action when the operation deletes data or cannot be undone.
- **Scrollable content:** use the scrollable-content pattern when body copy overflows the viewport height, keeping the header fixed and the footer visible.
- **Sticky footer:** pin `DialogFooter` to the bottom of the panel so actions remain visible as the user scrolls through long content.
- **No close button:** pass `showCloseButton={false}` to `DialogContent` when the footer already provides a clear dismiss path and the icon would create visual clutter.
- **Controlled state:** pass `open` and `onOpenChange` to `Dialog` when you need to programmatically open or close it, or intercept and conditionally block state changes.
- **Custom close button:** replace the default close control with your own button when the design requires a different label, position, or style.

## Placement and layout

The dialog centers horizontally and vertically in the viewport over a dimmed overlay. The overlay covers the full page. On mobile, prefer a bottom sheet over a centered dialog for action-oriented content, because centered dialogs on small screens reduce usable tap area.

## Editorial guidelines

- Default: write the title as a direct question ("Delete this item?") for confirmation dialogs. Override with a statement ("Unsaved changes") when the dialog is informational and no real decision is required, because framing a non-decision as a question misleads the reader.
- Start every action button label with an action verb. Keep labels under 30 characters.
- Describe the consequence in the body, especially for destructive actions: "This action cannot be undone" tells the user what they're agreeing to.
- Use sentence case on all labels and titles. Never use title case.

## Keyboard interactions

- `Escape`: closes the dialog and returns focus to the trigger.
- `Tab`: moves focus forward within the dialog. Focus does not escape to the page behind.
- `Shift+Tab`: moves focus backward within the dialog.

## ARIA requirements

- `role="dialog"` on `DialogContent`, set automatically by the library.
- `aria-modal="true"` on `DialogContent`, set automatically by the library.
- `aria-labelledby` on `DialogContent`, pointing to `DialogTitle`'s ID, set automatically when `DialogTitle` is present.
- `aria-describedby` on `DialogContent`, pointing to `DialogDescription`'s ID, set automatically when `DialogDescription` is present.

## Accessibility

- On open, focus moves into the dialog automatically. On close, focus returns to the trigger element. This works automatically only when you use `DialogTrigger`. Custom trigger implementations must manage focus return manually.
- Respect `prefers-reduced-motion`. Reduce or remove entry and exit animations for users who have enabled this system setting.
- The page behind the dialog must become inert. The library handles this, but custom portal implementations must replicate it so screen readers don't read background content.

## Common mistakes

- **Using `onClick` to control open state.** Default: use `onOpenChange` on `Dialog` for all open-state changes. Override with manual `onClick` toggling only when you need to intercept the state change and conditionally block it, because `onClick` alone bypasses overlay-click and Escape handling and causes the component to desync.
- **Omitting `DialogTitle`.** The library requires `DialogTitle` inside every `DialogContent`. Omitting it causes a runtime warning and breaks screen reader announcements. If the design has no visible title, wrap `DialogTitle` in `VisuallyHidden`.
- **Wrapping `DialogTrigger` in a plain `div`.** This breaks the ARIA relationship and keyboard activation. Use `asChild` and pass a component that forwards refs, or use `DialogTrigger` directly.
- **Hardcoding `aria-label` on the dialog container.** When `DialogTitle` is present, the correct pattern is `aria-labelledby` pointing to the title's ID. A hardcoded `aria-label` drifts from the visible title and creates a mismatch between sighted and non-sighted user experience.

## Decisions to verify

- Is a dialog the right component, or would a Sheet, Drawer, Alert Dialog, or inline pattern serve better?
- Is `DialogDescription` present, or is the absence intentional with the `aria-describedby` tradeoff accepted?
- Does the destructive primary action use danger or destructive button styling?
- Are action labels verb-noun pairs under 30 characters, not "OK," "Yes," or "Submit"?
- Is `onOpenChange` used for open-state control rather than manual `onClick` toggling?
- Is `prefers-reduced-motion` handled for entry and exit animations?
- Does focus return to the correct trigger element on close?