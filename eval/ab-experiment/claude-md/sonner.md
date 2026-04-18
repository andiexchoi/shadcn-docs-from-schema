# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## sonner

```yaml
component: Sonner
summary: Sonner renders brief, non-blocking toast notifications that confirm a completed action or surface a low-priority status update.
use_when:
  - Use Sonner to confirm that an action the user just completed succeeded, such as saving a form, sending a message, or deleting a record.
  - For errors that require a user response, use inline validation or a dialog instead.
do:
  - "Start toast messages with a specific result: \"Changes saved\" or \"Message sent to Ana García.\""
  - "Include at most one action, such as \"Undo,\" when the user needs a recovery path."
  - Place one <Toaster /> in your root layout so all toasts render from a single source.
dont:
  - "Don't use Sonner for errors that block the user or require input. Use a dialog or inline validation instead."
  - "Don't trigger multiple toasts in rapid sequence. Stacking toasts obscures earlier messages."
anatomy: A toast consists of a message label and an optional description below it. An optional action button appears inline with the message. Sonner renders all toasts through a single <Toaster /> container placed in the layout. The toast() function call controls content and type at the call site.
contracts:
  - Place <Toaster /> once, at the root layout level. Multiple instances cause duplicate toasts.
  - "Import toast from \"sonner\" and Toaster from \"@/components/ui/sonner\". Mixing the source packages breaks theme synchronization."
  - Call toast() from anywhere in your component tree. It does not need to be inside a context provider.
variants:
  - "toast.success(): Use to confirm a completed action with a positive outcome."
  - "toast.error(): Use for failures the system detected automatically, where no immediate user input is required."
  - "toast.warning(): Use to surface a condition the user needs to be aware of but does not need to act on immediately."
  - "toast.info(): Use for neutral status updates unrelated to a user action."
  - "position: Set on <Toaster position=\"bottom-right\" /> to control screen placement. Use \"bottom-right\" on desktop and \"bottom-center\" on mobile."
  - "duration: Pass duration in milliseconds to toast() to override the default display time. Increase it to at least 6,000 ms when the toast includes an action."
placement: "Place <Toaster /> as a direct child of <body> in your root layout, outside of <main>. On desktop, default to position=\"bottom-right\". On mobile, use position=\"bottom-center\" to keep toasts above the navigation bar."
editorial:
  - "Start every message with a specific noun or past-tense verb: \"Event created,\" not \"Success.\""
  - Keep messages to one line, 60 characters or fewer.
  - Use sentence case. Do not end messages with a period.
  - "Label any action with a verb that describes the outcome: \"Undo,\" not \"OK.\""
aria:
  - "<Toaster /> renders with aria-live=\"polite\" and role=\"status\" for informational toasts by default."
  - "For urgent or error toasts, Sonner applies aria-live=\"assertive\" and role=\"alert\" automatically when you use toast.error()."
  - "Decorative icons inside toasts must carry aria-hidden=\"true\"."
a11y: Respect prefers-reduced-motion. Sonner animates toast entry and exit by default. Verify your theme configuration reduces or disables these animations when the user has enabled the system motion-reduction setting. Never rely on toast color alone to convey type. The message text must communicate the outcome directly.
mistakes:
  - Placing <Toaster /> inside a deeply nested component. This causes z-index conflicts and overflow clipping. Place it at the root layout level only.
  - Using onClick state to control toast visibility instead of calling toast(). The toast() function manages its own lifecycle. Wrapping it in local state causes duplicate toasts and desync on dismiss.
  - Omitting duration on toasts with an action. The default duration is too short for users to read the message and select the action. Set duration to at least 6,000 ms when an action is present.
```
