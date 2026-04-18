# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## sheet

```yaml
component: Sheet
summary: A panel that slides in from the edge of the screen to display supplementary content without navigating away from the current page.
use_when:
  - Use a sheet for contextual tasks like editing a record, filtering a list, or reviewing details alongside the main content.
  - "When the task requires the user's full attention and the page behind must be blocked completely, use a Dialog instead."
do:
  - Include SheetTitle and SheetDescription inside every SheetContent.
  - "Use the side prop to place the sheet where it best supports the task: right for detail panels, bottom for mobile action menus."
  - Keep sheet content focused on a single task or context.
dont:
  - "Don't omit SheetTitle even when you want no visible heading. Wrap it in a VisuallyHidden component instead. Without it, screen readers can't announce the sheet."
anatomy:
  - "Trigger: the interactive element that opens the sheet."
  - "Overlay: the backdrop that appears behind the sheet panel."
  - "Panel: the sliding container that holds all content."
  - "Header: groups SheetTitle and SheetDescription at the top of the panel."
  - "Footer: an optional area at the bottom of the panel for actions like Save and Cancel."
  - "Close button: a built-in dismiss control rendered inside the panel. Hide it with showCloseButton={false} when you provide your own close action in the footer."
contracts:
  - SheetContent must contain SheetTitle. Omitting it causes a Radix console warning and leaves screen readers without an accessible name for the panel.
  - SheetDescription is optional but its absence causes a dangling aria-describedby pointing to a non-existent ID. Include it or suppress the warning intentionally.
  - To use a custom trigger element, add asChild to SheetTrigger. The child element must forward refs and accept prop spreading, or focus management will break.
  - "To control open state externally, pass open and onOpenChange to Sheet. Don't use an onClick toggle on the trigger; this breaks Radix's internal state and causes Escape and outside-click dismissal to stop working."
variants:
  - "side:: Controls which edge the panel slides from. Pass top, right, bottom, or left on SheetContent. Use right for detail and edit panels, bottom for mobile action sheets."
  - "showCloseButton:: Pass showCloseButton={false} on SheetContent to hide the built-in close button when your footer already contains a dismiss action."
placement: "The sheet panel renders into a Portal attached to document.body, so it sits above all page content regardless of the stacking context of its parent. Place Sheet, SheetTrigger, and SheetContent as siblings in your component tree. Don't nest SheetContent inside a container with overflow: hidden, as the Portal bypasses this automatically."
editorial:
  - "Start the SheetTitle with a noun or verb that describes the task: \"Edit profile\" or \"Filter results,\" not \"Settings.\""
  - Keep SheetTitle under 50 characters.
  - Write SheetDescription as one sentence that states the purpose or consequence of the task.
  - Use sentence case for all text inside the sheet. Capitalize only the first word and proper nouns.
keyboard:
  - "Tab: moves focus forward through interactive elements inside the sheet (focus is trapped inside the panel)."
  - "Shift+Tab: moves focus backward through interactive elements inside the sheet."
  - "Escape: closes the sheet and returns focus to the trigger element."
aria:
  - "role=\"dialog\" on the SheetContent panel element."
  - "aria-modal=\"true\" on the SheetContent panel element."
  - "aria-labelledby on the SheetContent panel element, pointing to the SheetTitle element's ID."
  - "aria-describedby on the SheetContent panel element, pointing to the SheetDescription element's ID."
a11y:
  - The sheet traps focus inside the panel while it is open. Focus must not reach the page content behind the overlay.
  - On close, focus returns to the trigger element automatically when you use SheetTrigger. Custom trigger implementations must manage focus return explicitly.
  - Respect prefers-reduced-motion in the slide animation. Users who have enabled this system setting must receive a reduced or instant transition.
mistakes:
  - "Omitting SheetTitle: AI-generated code frequently skips it because nothing breaks visually. At runtime, Radix logs a console warning and screen readers announce the sheet without a name. Always include SheetTitle, and use VisuallyHidden if no visible title is required."
  - "Using onClick to toggle open state: Passing an onClick handler on the trigger to flip a boolean breaks Radix's internal state machine. Use onOpenChange on Sheet and let Radix manage the state."
  - "Wrapping SheetTrigger in a plain div: This breaks the ARIA relationship between the trigger and the panel. Use asChild if you need a custom element, and confirm that element forwards refs."
  - "Nesting interactive content without ref forwarding: Wrapping a Radix sub-component in a custom component without React.forwardRef breaks focus management and keyboard navigation inside the sheet."
```
