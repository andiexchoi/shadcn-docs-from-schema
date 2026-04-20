# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## tabs

```yaml
component: Tabs
summary: Tabs organize peer-level content into named panels and display one panel at a time within the same context.
use_when:
  - Use tabs when users need to switch between related views without leaving the current page.
  - Use a stepper or next/back pattern for sequential flows, and use bottom navigation for switching between distinct app sections.
do:
  - "Give each tab a short, distinct label that describes the panel's content."
  - Keep the number of tabs between two and seven.
  - Show the most important tab first, in the leftmost position.
dont:
  - "Don't use tabs for sequential steps. Users interpret tabs as peer-level, not ordered."
  - "Don't hide tabs that have no content. Disable individual TabsTrigger elements instead."
anatomy: "The component has four parts: Tabs (the root), TabsList (the tab bar), TabsTrigger (each selectable tab), and TabsContent (the panel that appears when its tab is active). TabsList holds all triggers in a single row or column. Each TabsContent panel renders below (or beside) the list and shows only when its matching trigger is active."
contracts:
  - TabsList must wrap all TabsTrigger elements. Triggers rendered outside TabsList break ARIA relationships.
  - Each TabsTrigger must have a value prop. Each TabsContent must have a matching value prop. Mismatched values cause panels to never display.
  - Tabs requires either a defaultValue (uncontrolled) or a value plus onValueChange pair (controlled). Omitting both leaves no tab selected on load.
  - "In controlled mode, use onValueChange to update state. Don't use onClick on individual triggers. Using onClick bypasses internal state management and breaks keyboard navigation."
variants:
  - "variant=\"line\" on TabsList: Use for a lighter, underline-style tab bar when the default pill or box style adds too much visual weight."
  - "orientation=\"vertical\": Use when horizontal space is limited or when the tab list is part of a sidebar layout."
  - "disabled on TabsTrigger: Use to prevent selection of a specific tab without removing it from the list."
placement: Place TabsList above its associated TabsContent panels for horizontal tabs. For vertical tabs, place TabsList to the left of the content area. Set an explicit width on Tabs to prevent the list from stretching to fill the full container unexpectedly.
editorial:
  - Start each tab label with a noun that names the content, not a verb.
  - Keep labels under 20 characters to prevent overflow.
  - Use sentence case. Capitalize only the first word and proper nouns.
  - "Don't use punctuation at the end of tab labels."
keyboard:
  - "Arrow Right / Arrow Left: Moves focus to the next or previous tab in a horizontal TabsList."
  - "Arrow Down / Arrow Up: Moves focus to the next or previous tab in a vertical TabsList."
  - "Home: Moves focus to the first tab."
  - "End: Moves focus to the last tab."
  - "Tab: Moves focus from the active tab into its associated TabsContent panel."
aria:
  - "TabsList renders with role=\"tablist\"."
  - "Each TabsTrigger renders with role=\"tab\" and aria-selected=\"true\" when active, aria-selected=\"false\" when inactive."
  - Each TabsTrigger renders with aria-controls pointing to its associated TabsContent panel ID.
  - "Each TabsContent renders with role=\"tabpanel\" and aria-labelledby pointing to its associated TabsTrigger ID."
a11y:
  - "Don't rely on color alone to communicate the active tab state. The active trigger must also differ in weight, fill, or underline styling."
  - "Inactive TabsContent panels must be hidden from both view and the accessibility tree. The component handles this by default. Don't override the default hidden behavior with CSS that only visually hides panels."
mistakes:
  - "Mismatched value props: If a TabsTrigger has value=\"account\" but the corresponding TabsContent has value=\"accounts\", the panel never displays. Check that every trigger value has an exact string match in a content element."
  - "Using onClick for controlled state: Setting state with onClick on TabsTrigger instead of onValueChange on Tabs desyncs internal state. Keyboard navigation and Escape handling stop working. Use onValueChange exclusively."
  - "Wrapping TabsTrigger in a plain div: A wrapper div between TabsList and TabsTrigger breaks the tablist ARIA relationship. If you need a custom element, use the asChild prop on TabsTrigger and pass a component that forwards refs."
  - "Omitting defaultValue in uncontrolled mode: Without defaultValue, no tab is selected on load. Always provide a defaultValue that matches one of the trigger values."
```
