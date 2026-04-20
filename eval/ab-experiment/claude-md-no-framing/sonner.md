# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## sonner

```yaml
component: Sonner
summary: Sonner is a toast notification component you use to confirm that a user-triggered action completed successfully.
use_when:
  - Use Sonner to deliver brief, non-blocking feedback after an action, such as saving a form, sending a message, or deleting a record.
  - For errors that require user response or decisions that need immediate attention, use inline validation or a dialog instead.
do:
  - Keep toast messages to one or two lines maximum.
  - "Include an action (such as \"Undo\") when the user might need to reverse the operation."
  - Place the <Toaster /> once in your root layout so all toast calls share a single instance.
dont:
  - "Don't use toasts for error messages that require the user to take corrective action."
  - "Don't trigger multiple toasts in rapid succession for sequential operations."
anatomy: The toast consists of a message area, an optional description, and an optional action button. The message area displays the primary confirmation text. The description provides secondary detail below the message. The action button, when present, lets the user respond directly from the toast (such as undoing an action). Toasts dismiss automatically after a set duration, or the user can dismiss them manually.
contracts:
  - Place <Toaster /> once in the root layout (such as app/layout.tsx), outside of <main>. Multiple <Toaster /> instances cause duplicate notifications.
  - "Trigger toasts by calling the toast() function imported from sonner, not by rendering a component imperatively. The <Toaster /> and toast() are separate: the former mounts the container, the latter fires notifications."
variants:
  - "toast.success: Use to confirm that an action completed without errors."
  - "toast.error: Use to report a failure that did not require user input to resolve."
  - "toast.warning: Use to alert the user to a condition that might need attention but didn't block the action."
  - "toast.info: Use to deliver neutral, informational context after an action."
  - "toast.loading: Use to indicate an async operation is in progress, then update it to a success or error state on completion."
  - "position: Set on <Toaster /> to control screen placement; defaults to bottom-right on desktop and bottom-center on mobile."
  - "duration: Set per toast() call to override the default auto-dismiss delay; increase it when the toast includes an action button."
placement: Place <Toaster /> at the bottom of the <body> in your root layout, as a sibling to <main>. On desktop, toasts appear at the bottom-right of the viewport by default. On mobile, they appear at the bottom-center, above any navigation bar.
editorial:
  - "Write messages in sentence case: \"Changes saved,\" not \"Changes Saved.\""
  - "Be specific: write \"Message sent to Ana García,\" not \"Done\" or \"Success.\""
  - Keep the message under 10 words; use the description field for secondary detail.
  - "Label action buttons with a verb: \"Undo,\" not \"OK.\""
aria:
  - "aria-live=\"polite\" on the toast container for informational and success toasts."
  - "role=\"status\" on the container for polite announcements."
  - "aria-live=\"assertive\" and role=\"alert\" only for urgent error toasts that require immediate attention."
a11y: "Screen readers announce toast content via the aria-live region automatically when Sonner mounts the <Toaster />. To respect user motion preferences, Sonner responds to the prefers-reduced-motion media query and reduces entry and exit animations accordingly. Never use aria-live=\"assertive\" for routine confirmations—it interrupts the screen reader mid-announcement."
mistakes:
  - Placing <Toaster /> inside a conditionally rendered component. This unmounts the container and drops any queued toasts. Place it unconditionally in the root layout.
  - "Using toast() without mounting <Toaster />.  The toast fires but nothing renders. Both imports are required: <Toaster /> in the layout and toast() at the call site."
  - Using toast.error for validation errors. Error toasts dismiss automatically, so users miss the message before correcting the field. Use inline field-level error messages for validation instead.
  - "Passing an onOpenChange or isOpen prop to <Toaster />.  These props don't exist on Sonner. Control toast lifecycle through the toast() function API, not component props."
```
