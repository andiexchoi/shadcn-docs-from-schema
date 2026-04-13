// Curated best practices from Apple Human Interface Guidelines and Google Material Design.
// These are injected into the prompt as a reference layer so the model draws from
// encoded knowledge rather than recalled training data.

export const platformGuidelines = `
## Reference: Apple HIG and Material Design best practices

Use the following guidelines to inform the "When to use," "Do's and don'ts," and "Accessibility" sections. Only include guidance that is relevant to the component being documented. Do not cite these sources directly — absorb the principles and express them in your own words, specific to the component.

### Buttons

**Labels**
- Use verb-noun pairs that describe the action: "Save changes," "Delete account," not "OK" or "Yes"
- Sentence case only. Never title case ("Save Changes" is wrong)
- Keep labels under 3 words where possible. Never wrap to two lines.
- Avoid vague labels like "Click here," "Submit," or "Proceed"

**Hierarchy**
- Every view should have at most one primary (filled) button. If multiple buttons exist, one is primary, the rest are secondary or ghost
- Use destructive styling (red/danger variant) only for actions that delete data or cannot be undone — and always require confirmation before executing
- Ghost and link buttons are for low-emphasis actions where the visual weight of an outlined or filled button would compete with more important UI

**Disabled states**
- Avoid disabled buttons where possible. Prefer showing the button as active and explaining errors after the user attempts to submit (Apple HIG)
- If you must disable a button, make it clear why — and how to enable it. A disabled button with no explanation creates a dead end
- Do not use a disabled button as a loading state — use a loading indicator instead

**Touch targets**
- Minimum touch target: 44×44pt on iOS (Apple HIG), 48×48dp on Android (Material Design)
- Buttons smaller than this should have invisible tap area extensions — do not shrink the visible button to meet this requirement

**Icons**
- Icon-only buttons require an accessible label (aria-label or title). Never assume an icon is universally understood
- When pairing an icon with a label, place the icon to the left of the label

---

### Inputs and text fields

**Labels**
- Every input must have a visible label. Do not use placeholder text as a substitute for a label — placeholder disappears on focus and is not reliably read by screen readers (both Apple HIG and Material Design)
- Labels sit above the field, not inside it
- Required fields should be marked, either with an asterisk (with a legend) or with explicit "(required)" text

**Validation and errors**
- Validate inline after the user leaves the field (on blur), not while they are typing
- Display error messages below the field, in red, with an icon
- Error messages should describe what went wrong and how to fix it: "Email must include @" not "Invalid email"
- Never clear field content on error

**Placeholder text**
- Use placeholder text to show an example value, not to restate the label
- Example: label is "Phone number," placeholder is "+1 (555) 000-0000"

**Character limits**
- If there is a character limit, show a live character count when the user is near the limit — not from the first keystroke

---

### Dialogs and modals

**When to use**
- Use dialogs for decisions that require immediate attention and cannot be deferred. They are disruptive by design — use sparingly
- Do not use a dialog for simple confirmations that could be handled inline, or for information that doesn't require a response
- Prefer bottom sheets on mobile for actions; reserve dialogs for genuine decision points (Material Design)

**Content**
- Dialog title should be a clear question or statement: "Delete this item?" not "Warning"
- Body text should explain the consequence, especially for destructive actions: "This cannot be undone"
- Keep body copy to 1–2 sentences. A dialog with a paragraph of text is a sign the information belongs somewhere else

**Actions**
- Place the primary action on the right (or bottom-right); cancel or dismiss on the left
- Label actions with verbs that describe the outcome: "Delete," "Save," "Discard" — not "OK" or "Yes"
- Destructive primary actions should use danger/destructive styling
- Always include a way to dismiss: a cancel button, a close button, or pressing Escape

**Focus and behavior**
- Move focus into the dialog on open; return focus to the trigger on close
- Lock scroll on the page behind the dialog
- Close on Escape; optionally close on overlay click for non-destructive dialogs

---

### Toasts and snackbars

**When to use**
- Use toasts to confirm that an action the user just took was successful — not to deliver information the user needs to act on
- Do not use toasts for error messages that require user response. Use inline validation or a dialog instead
- One toast at a time. Do not stack multiple toasts for sequential actions

**Content**
- Keep messages to one line (max 2). If you need more space, the content belongs in a different component
- Be specific: "Changes saved" not "Success." "Message sent to Ana García" not "Done"
- An optional single action is acceptable (e.g., "Undo") — never two actions

**Timing**
- Default duration: 4–5 seconds for informational toasts
- Toasts with an action should remain visible longer (6–8 seconds) to give users time to read and respond
- Do not auto-dismiss toasts with critical information — use a persistent notification instead

**Position**
- Bottom of screen on mobile (above navigation bar if present) — Material Design
- Bottom-right on desktop — common web convention

---

### Navigation (bottom bars, tabs)

**When to use**
- Use bottom navigation for 3–5 top-level destinations that users switch between frequently
- Do not use bottom navigation for sequential flows (use a stepper or next/back pattern instead)
- Tabs are for peer-level content within the same context; bottom navigation is for switching between distinct areas of the app

**Labels and icons**
- Always pair icons with text labels in bottom navigation — icon-only navigation fails accessibility and usability standards (Apple HIG, Material Design)
- Keep labels to 1–2 words. Truncate rather than wrap
- Use icons that clearly represent the destination — avoid decorative or abstract icons for navigation

**Active states**
- The active destination must be visually distinct — not just color, which fails for users with color blindness. Use a combination of fill, weight, and label styling

---

### Accessibility (universal)

**Touch targets**
- iOS minimum: 44×44pt. Android minimum: 48×48dp. Extend tap areas with padding rather than increasing visible element size

**Color**
- Never use color as the only way to convey information (e.g., red = error). Always pair color with an icon, label, or pattern
- Text must meet WCAG AA contrast ratios at minimum: 4.5:1 for body text, 3:1 for large text and UI elements

**Focus and keyboard**
- All interactive elements must be reachable by keyboard (Tab) and activatable (Enter or Space)
- Focus order must follow visual reading order
- Focus must never be trapped except inside modal dialogs and drawers (where trapping is required)
- Visible focus indicators are required — do not remove outlines without providing an equivalent custom style

**Screen readers**
- Every interactive element needs an accessible name — either visible label text, aria-label, or aria-labelledby
- Decorative icons must be hidden from screen readers (aria-hidden="true")
- Status updates (toasts, alerts, loading states) must be announced — use aria-live regions appropriately (polite for non-urgent, assertive for urgent)
- Images and icons that convey meaning need descriptive alt text

**Motion**
- Respect prefers-reduced-motion. Animations should be optional or reduced for users who have enabled this system setting
`;
