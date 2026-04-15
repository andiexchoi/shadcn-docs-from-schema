// Structural and semantic knowledge layer for component documentation.
// These are injected into the prompt alongside platform guidelines so the model
// generates accurate component contracts, ARIA requirements, and keyboard specs
// from encoded knowledge rather than training data.

export const semanticGuidelines = `
## Reference: structural and semantic guidelines

Use the following structural and semantic guidelines to inform the "Component contracts," "Keyboard interactions," "ARIA requirements," and "Common mistakes" sections. Only include guidance that is relevant to the component being documented. Do not cite these sources directly. Apply the principles specific to the component.

### Compound component composition

**Parent-child nesting rules**
- Compound components require a Root element that wraps all related sub-components. The Root provides shared state (open/closed, selected value, active tab).
- Trigger and Content are siblings inside Root, not nested inside each other.
- Content renders inside a Portal by default. The Portal moves the DOM node to document.body to avoid z-index and overflow clipping issues.

**Required sub-components**
- Dialog: DialogContent requires a DialogTitle. Without it, Radix logs a console warning and screen readers cannot announce the dialog. If the title is visually hidden, wrap it in a VisuallyHidden component. DialogDescription is optional but recommended. When absent, Radix generates a dangling aria-describedby pointing to a non-existent ID.
- Sheet: SheetContent requires SheetTitle and SheetDescription for the same reasons as Dialog. Sheet is built on Dialog internally.
- AlertDialog: AlertDialogContent requires AlertDialogTitle and AlertDialogDescription. Both are mandatory, not optional, because alert dialogs must clearly communicate what the user is confirming.
- Select: SelectTrigger must wrap SelectValue. SelectContent must contain SelectItem elements. SelectGroup and SelectLabel are optional but improve screen reader navigation.
- Tabs: TabsList wraps TabsTrigger elements. Each TabsTrigger needs a matching TabsContent with the same value.

**asChild pattern**
- asChild merges the component's props and behavior onto its single child element instead of rendering a wrapper. Use it when the trigger or content must be a specific HTML element (a link, a custom button) rather than the default rendered element.
- The child element must accept ref forwarding and prop spreading. Components that do not forward refs break asChild.

**ref forwarding**
- All interactive sub-components require ref forwarding. Wrapping a Radix primitive in a custom component without React.forwardRef breaks focus management and keyboard navigation.

---

### ARIA patterns by component type

**Dialog**
- Container: role="dialog", aria-modal="true"
- Title: linked via aria-labelledby on the dialog container pointing to the DialogTitle element's ID
- Description: linked via aria-describedby on the dialog container pointing to the DialogDescription element's ID
- Close: focus must return to the trigger element on close

**Alert dialog**
- Container: role="alertdialog", aria-modal="true"
- Same labelling as Dialog (aria-labelledby, aria-describedby)
- Must not dismiss on overlay click or Escape without explicit user action. This is the key distinction from Dialog.

**Combobox / Select**
- Trigger: role="combobox", aria-expanded (true when open, false when closed), aria-haspopup="listbox"
- Content: role="listbox"
- Items: role="option", aria-selected on the active item
- Groups: role="group" with aria-labelledby pointing to the group label

**Tabs**
- Tab list: role="tablist"
- Each tab: role="tab", aria-selected="true" on active tab, aria-controls pointing to the associated panel ID
- Each panel: role="tabpanel", aria-labelledby pointing to the associated tab ID

**Toast / notification**
- Container: aria-live="polite" for informational messages, aria-live="assertive" for urgent or error messages
- role="status" for polite, role="alert" for assertive
- Do not use aria-live="assertive" for routine confirmations. It interrupts whatever the screen reader is currently announcing.

**Tooltip**
- Trigger: aria-describedby pointing to the tooltip content
- Content: role="tooltip"
- Tooltip must not contain interactive elements. Use a Popover if the content needs links or buttons.

**Switch / Toggle**
- role="switch", aria-checked="true" or "false"
- Label must be associated via aria-labelledby or a wrapping label element
- Do not use role="checkbox" for a switch. The semantics are different: a checkbox is for selection, a switch is for an immediate state change.

---

### Keyboard interaction patterns

**Dialog and Sheet**
- Escape: closes the dialog and returns focus to the trigger
- Tab: cycles focus within the dialog (focus trap). Focus must not escape to the page behind.
- Shift+Tab: cycles focus backward within the dialog

**Alert dialog**
- Same as Dialog, but Escape must not close the dialog unless an explicit cancel action exists

**Select / Combobox**
- Enter or Space on trigger: opens the dropdown
- Arrow Down / Arrow Up: moves selection through options
- Enter on option: selects and closes
- Escape: closes without selecting
- Home / End: jumps to first / last option
- Type-ahead: typing a character jumps to the first matching option

**Tabs**
- Arrow Right / Arrow Left (horizontal): moves to next / previous tab
- Arrow Down / Arrow Up (vertical): moves to next / previous tab
- Home: moves to first tab
- End: moves to last tab
- Tab: moves focus from the tab to its associated panel content

**Accordion**
- Enter or Space: toggles the panel open/closed
- Arrow Down / Arrow Up: moves focus between accordion triggers
- Home / End: moves to first / last trigger

**Tooltip**
- Escape: dismisses the tooltip
- The trigger must be focusable. Non-focusable elements (span, div) require tabindex="0".

---

### Known AI agent failure patterns

These are documented mistakes that AI coding tools make when generating components built on Radix primitives or shadcn/ui. Use this knowledge to inform the "Common mistakes" section when relevant.

**Omitting required sub-components**
- AI tools frequently skip DialogTitle, SheetDescription, and similar required elements because they appear optional in the code. Radix enforces their presence at runtime with console warnings, and screen readers cannot announce the component without them.

**Fabricating non-existent props**
- AI tools mix prop APIs across different component libraries. A Select component might get an onValueChanged prop (does not exist) instead of onValueChange, or a Dialog might get an isOpen prop instead of open. The output must reference only props that actually exist on the component.

**Breaking composition with wrapper divs**
- Wrapping a Radix Trigger in a plain div breaks keyboard navigation and ARIA relationships. The Trigger must be a direct child of the compound component root, or use asChild to merge onto a custom element.

**Incorrect controlled state patterns**
- AI tools use onClick handlers to toggle open/close state instead of onOpenChange. This breaks Radix's internal state management and causes the component to desync (clicking outside no longer closes, Escape stops working).

**Hardcoding aria-label instead of using visible labels**
- When a visible label exists (DialogTitle, tooltip label), the correct pattern is aria-labelledby pointing to the label's ID, not a duplicate aria-label string. Hardcoded aria-label drifts from the visible text and creates a mismatch between what sighted and non-sighted users perceive.

**Ignoring focus return**
- After closing a dialog, sheet, or popover, focus must return to the element that triggered it. AI-generated code often omits this, leaving focus stranded on the body element. Radix handles this automatically if the Trigger component is used correctly, but custom trigger implementations break it.
`;
