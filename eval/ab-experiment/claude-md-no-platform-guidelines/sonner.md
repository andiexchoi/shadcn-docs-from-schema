# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## sonner

```yaml
component: Sonner
summary: Sonner is a toast notification component that surfaces brief, non-blocking feedback messages after a user action.
use_when:
  - Use Sonner when you need to confirm an action, report a background process result, or surface a non-critical error.
  - For messages that require a user decision, use a dialog instead.
do:
  - Place <Toaster /> once in your root layout, outside <main>.
  - Start toast messages with an action verb or outcome noun.
  - Use toast.error() for failures and toast.success() for confirmations.
dont:
  - "Don't trigger multiple toasts in rapid succession. Batch related updates into one message."
anatomy: "The component has two parts: Toaster and toast. Toaster is a singleton container you mount once in the layout. It renders a positioned list of live toast items. toast is an imperative function you call anywhere in your application to push a new notification into that container. Each toast item contains a message, an optional description, and an optional close button."
contracts:
  - Mount <Toaster /> exactly once, at the root layout level. Multiple instances cause duplicate toasts.
  - "Import toast from \"sonner\" and Toaster from \"@/components/ui/sonner\". Mixing import sources breaks theming."
  - Call toast() after the user action completes, not before. The message confirms a result, not an intent.
variants:
  - "toast.success(): Use after a create, save, or update action succeeds."
  - "toast.error(): Use when an action fails and the user needs to know."
  - "toast.warning(): Use for recoverable issues that need user attention."
  - "toast.info(): Use for neutral status updates."
  - "position: Pass this prop to <Toaster /> to control where toasts appear. Accepts \"top-left\", \"top-center\", \"top-right\", \"bottom-left\", \"bottom-center\", or \"bottom-right\"."
placement: Mount <Toaster /> as a direct child of <body>, outside <main>. This prevents overflow clipping and z-index conflicts with page content.
editorial:
  - "Start each message with a past-tense verb or a clear outcome noun: \"Event created.\" or \"Changes saved.\""
  - Keep the primary message under 60 characters.
  - Use sentence case. Capitalize only the first word and proper nouns.
  - Reserve the description field for actionable detail, not a restatement of the title.
keyboard:
  - "Tab: moves focus to the toast region when a toast is present."
  - "Escape: dismisses the focused toast."
  - "Enter or Space on a close button: closes that toast."
aria:
  - "<Toaster /> renders with aria-live=\"polite\" on the toast region for informational and success messages."
  - "<Toaster /> renders with aria-live=\"assertive\" and role=\"alert\" for error messages. Reserve this for genuine failures, not routine confirmations."
a11y: "Sonner announces toasts to screen readers through its aria-live region automatically. Don't suppress or override this region. For users who prefer reduced motion, Sonner respects the prefers-reduced-motion media query and limits entrance animations."
mistakes:
  - Mounting <Toaster /> inside a page component. This creates a new instance on every render and duplicates toasts. Mount it once in the root layout.
  - "Using onClick state to control toast visibility. Call toast() directly inside your event handler. Don't track toast state in React state."
  - "Calling toast() with no type for error feedback. Plain toast() uses a neutral style. Use toast.error() so the message receives the correct visual treatment and aria-live=\"assertive\" behavior."
```
