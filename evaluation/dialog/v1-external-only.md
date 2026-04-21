# Dialog

A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

---

## Overview

Dialog interrupts the current flow to present content or actions that require immediate attention. It blocks interaction with the page behind it until dismissed. Use it sparingly — only when the user must make a decision or acknowledge information before continuing.

---

## When to use

**Use a dialog when:**
- The user must make a decision before proceeding (confirming a destructive action, agreeing to terms)
- A task is short and self-contained (editing a single field, entering a confirmation code)
- The consequence of an action needs to be clearly communicated before it executes

**Do not use a dialog when:**
- The information is informational only and doesn't require a response — use an inline notification or toast instead
- The task is complex or multi-step — use a dedicated page or drawer instead
- The action can be confirmed inline — reserve dialogs for genuine decision points
- You are on mobile and presenting a list of actions — prefer a bottom sheet

---

## Installation

### CLI

```bash
npx shadcn@latest add dialog
```

### Manual

1. Install the required dependency:

```bash
# Base UI
npm install @base-ui/react

# Radix UI
npm install radix-ui
```

2. Copy the component source into your project at `components/ui/dialog.tsx`.

3. Update import paths to match your project structure.

---

## Usage

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
```

```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

---

## Composition

```
Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    └── DialogFooter
```

`Dialog` is the root provider that manages open/closed state. `DialogTrigger` and `DialogContent` are siblings inside it — never nest one inside the other.

---

## Examples

### Default

A dialog for editing profile details.

```tsx
<Dialog>
  <DialogTrigger>Edit profile</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    {/* form fields */}
    <DialogFooter>
      <button>Save changes</button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Custom close button

Replace the default close control with your own button by rendering a close trigger inside `DialogContent`.

### No close button

Pass `showCloseButton={false}` to `DialogContent` to hide the built-in close button. When you do this, ensure there is always another way to dismiss the dialog — a cancel button in the footer, or a clearly labelled action.

```tsx
<DialogContent showCloseButton={false}>
  {/* content */}
</DialogContent>
```

### Sticky footer

Wrap actions in `DialogFooter` to keep them pinned to the bottom of the dialog while long content scrolls.

### Scrollable content

For dialogs with lengthy content, the body scrolls while the `DialogHeader` stays in view. Avoid this pattern as a first choice — a dialog with a large amount of text is usually a signal that the content belongs on a dedicated page.

### RTL

Dialog respects `dir="rtl"` on a parent element. See the [RTL configuration guide](/docs/rtl) for setup instructions.

---

## Component contracts

| Sub-component | Required | Notes |
|---|---|---|
| `Dialog` | Yes | Root provider. Manages open state. |
| `DialogTrigger` | Yes* | Opens the dialog. Must be a direct child of `Dialog`, or use `asChild` to merge onto a custom element. *Can be omitted for controlled usage. |
| `DialogContent` | Yes | Renders into a Portal at `document.body`. |
| `DialogTitle` | **Yes** | Required for accessibility. If visually hidden is needed, wrap in `VisuallyHidden` — do not omit. |
| `DialogDescription` | Recommended | Optional but strongly recommended. When absent, `aria-describedby` points to a non-existent element. |
| `DialogHeader` | No | Presentational wrapper for title and description. |
| `DialogFooter` | No | Presentational wrapper for actions. |

### Controlled usage

To control open state externally, pass `open` and `onOpenChange` to `Dialog`:

```tsx
const [open, setOpen] = React.useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  {/* ... */}
</Dialog>
```

Do not use `onClick` handlers on the trigger to toggle state manually. This bypasses Radix's internal state management and breaks outside-click dismissal, Escape key handling, and focus return.

### `asChild`

Use `asChild` on `DialogTrigger` when you need the trigger to be a specific element — a link, a custom button component — rather than the default rendered element:

```tsx
<DialogTrigger asChild>
  <Button variant="outline">Open</Button>
</DialogTrigger>
```

The child element must forward refs. Components that do not use `React.forwardRef` will break focus management and keyboard behavior.

---

## Keyboard interactions

| Key | Behavior |
|---|---|
| `Enter` / `Space` | Activates the trigger and opens the dialog |
| `Escape` | Closes the dialog and returns focus to the trigger |
| `Tab` | Cycles focus forward through interactive elements inside the dialog |
| `Shift + Tab` | Cycles focus backward through interactive elements inside the dialog |

Focus is trapped inside the dialog while it is open. It must not escape to the page behind it. On close, focus returns to the element that triggered the dialog.

---

## ARIA requirements

The dialog implements the ARIA `dialog` pattern:

- `DialogContent` renders with `role="dialog"` and `aria-modal="true"`
- `aria-labelledby` on the dialog container points to `DialogTitle`'s ID
- `aria-describedby` on the dialog container points to `DialogDescription`'s ID

**`DialogTitle` is not optional.** Without it, the dialog has no accessible name and screen readers cannot announce what the dialog is about. If your design requires a visually hidden title, use `VisuallyHidden` — do not remove the element.

```tsx
// Correct — title is visually hidden but still present in the DOM
<DialogTitle>
  <VisuallyHidden>Confirm deletion</VisuallyHidden>
</DialogTitle>

// Incorrect — no title at all
<DialogContent>
  {/* content with no DialogTitle */}
</DialogContent>
```

Do not add a redundant `aria-label` directly to `DialogContent` when a visible `DialogTitle` exists. The correct pattern is `aria-labelledby` pointing to the title's ID, which Radix handles automatically. A hardcoded `aria-label` string will drift from the visible text over time.

---

## Do's and don'ts

### Content

**Do** write dialog titles as a clear question or statement that describes exactly what the user is deciding:
- ✅ "Delete this project?"
- ✅ "Unsaved changes"
- ❌ "Warning"
- ❌ "Are you sure?"

**Do** keep body copy to one or two sentences. Explain the consequence, especially for destructive actions.

**Do** label action buttons with verbs that describe the outcome:
- ✅ "Delete project", "Save changes", "Discard"
- ❌ "OK", "Yes", "Confirm"

**Do** use sentence case for all labels. Not title case.

**Don't** put more than a paragraph of text in a dialog. If you need that much space, the content belongs on a page.

### Actions

**Do** place the primary action on the right and the cancel or dismiss action on the left.

**Do** use destructive styling (danger/red variant) on the primary button when the action deletes data or cannot be undone.

**Do** always provide a way to dismiss: a cancel button, a close button, pressing Escape, or clicking the overlay.

**Don't** make a destructive action the only button. Always pair it with a cancel option.

### Behavior

**Do** lock scroll on the page behind the dialog while it is open.

**Do** close non-destructive dialogs when the user clicks the overlay.

**Don't** close a dialog with destructive consequences on an accidental overlay click. Require an explicit cancel action.

---

## Accessibility

- Focus moves into the dialog when it opens. Focus returns to the trigger element when it closes. Do not break this by implementing custom trigger logic outside of `DialogTrigger`.
- Focus is trapped within the dialog. Users navigating by keyboard cannot reach content behind it.
- `DialogTitle` provides the accessible name for the dialog. It is required, even when hidden visually.
- `DialogDescription` provides the accessible description. Omitting it generates a broken `aria-describedby` reference. Include a description or explicitly suppress it per the library's guidance.
- The dialog can be dismissed with `Escape`. Do not override or suppress this behavior.
- All interactive elements inside the dialog — buttons, inputs, links — must be reachable by `Tab` and activatable by `Enter` or `Space`.
- Animations must respect `prefers-reduced-motion`. Do not apply entrance/exit transitions unconditionally.

---

## Common mistakes

**Omitting `DialogTitle`**
The title looks optional in code but is required at runtime. Radix logs a console warning without it, and screen readers cannot announce the dialog's purpose. Always include it.

**Using `onClick` to manage open state**
Do not toggle `open` state with a click handler on the trigger element. Use `onOpenChange` on the `Dialog` root. Manual click handlers break Escape key dismissal, outside-click behavior, and focus return.

```tsx
// Incorrect
<button onClick={() => setOpen(true)}>Open</button>

// Correct
<DialogTrigger asChild>
  <button>Open</button>
</DialogTrigger>
```

**Wrapping `DialogTrigger` in a plain `div`**
Wrapping the trigger in a non-interactive element breaks the ARIA relationship and keyboard behavior. Use `asChild` to compose onto a custom element instead.

**Fabricating props**
Dialog does not accept `isOpen`. The correct prop is `open`. Dialog does not accept `onClose`. The correct prop is `onOpenChange`. Reference the API documentation before passing props not listed here.

**Skipping `DialogDescription`**
When `DialogDescription` is absent, the auto-generated `aria-describedby` reference points to nothing. Include a description or handle it explicitly so the rendered markup is clean.

**Breaking focus return with custom triggers**
If you implement a custom trigger outside of `DialogTrigger`, focus will not automatically return to it on close. Use the `DialogTrigger` component, or handle focus return manually via a `ref`.

---

## API reference

- [Base UI Dialog API](https://base-ui.com/react/components/dialog#api-reference)
- [Radix UI Dialog API](https://www.radix-ui.com/docs/primitives/components/dialog#api-reference)