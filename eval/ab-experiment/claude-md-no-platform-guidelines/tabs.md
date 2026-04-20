# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## tabs

```yaml
component: Tabs
summary: Tabs organize related content into labeled sections and display one section at a time, letting users switch between views without leaving the page.
use_when:
  - Use tabs when you have two or more distinct content sections that share the same context and the user needs to compare or switch between them.
  - Use tabs for settings panels, profile views, or multi-step previews.
  - If the sections represent sequential steps, use a stepper instead.
do:
  - Give every TabsTrigger a value prop that exactly matches its corresponding TabsContent value.
  - Set defaultValue on Tabs to control which panel opens first.
  - Keep tab labels under 20 characters so the tab list stays scannable.
dont:
  - "Don't nest tabs inside tabs. Flatten the content hierarchy instead."
  - "Don't use tabs when you have only one content section. Render the content directly."
anatomy: The component has four parts. Tabs is the root wrapper that holds shared state. TabsList is the horizontal (or vertical) bar that contains the tab triggers. Each TabsTrigger is a labeled button that activates its paired panel. Each TabsContent is the panel that renders when its matching trigger is active.
contracts:
  - TabsList must wrap all TabsTrigger elements. Place it as a direct child of Tabs.
  - Every TabsTrigger must have a value prop. Every TabsContent must have a matching value prop. Mismatched values cause panels to never render.
  - TabsContent elements must be direct children of Tabs, not nested inside TabsList.
  - To render a trigger as a custom element, pass asChild to TabsTrigger. The child must forward refs, or focus management breaks.
variants:
  - "variant=\"line\" on TabsList: Use this for a minimal underline style instead of the default pill or filled style."
  - "orientation=\"vertical\" on Tabs: Use this when you need a sidebar-style tab layout with the tab list running top to bottom."
  - "disabled on TabsTrigger: Use this to prevent selection of a specific tab while keeping it visible."
placement: Place TabsList above TabsContent for horizontal tabs and to the left for vertical tabs. Set an explicit width on the Tabs root to prevent the tab list from stretching to fill its container unexpectedly.
editorial:
  - "Start every tab label with a noun, not a verb. Use \"Account,\" not \"Edit account.\""
  - Use sentence case for tab labels. Capitalize only the first word and proper nouns.
  - Keep tab labels under 20 characters to prevent truncation at small viewports.
  - Do not use punctuation at the end of tab labels.
keyboard:
  - "Arrow Right / Arrow Left: Moves focus to the next or previous tab in a horizontal tab list."
  - "Arrow Down / Arrow Up: Moves focus to the next or previous tab in a vertical tab list."
  - "Home: Moves focus to the first tab."
  - "End: Moves focus to the last tab."
  - "Tab: Moves focus from the active tab into its associated panel content."
aria:
  - "role=\"tablist\" on TabsList."
  - "role=\"tab\" on each TabsTrigger."
  - "aria-selected=\"true\" on the active TabsTrigger, aria-selected=\"false\" on all others."
  - "aria-controls=\"[panel-id]\" on each TabsTrigger, pointing to its paired panel's ID."
  - "role=\"tabpanel\" on each TabsContent."
  - "aria-labelledby=\"[tab-id]\" on each TabsContent, pointing to its paired trigger's ID."
a11y: "Radix and Base UI set all required ARIA attributes automatically when you use the correct composition. If you replace TabsTrigger with a custom element using asChild, verify that aria-selected and aria-controls still render on the output element. Disabled tabs must still receive focus so keyboard users can discover them. Do not remove a disabled tab from the tab order by adding tabindex=\"-1\" manually."
mistakes:
  - "Mismatched value props: A TabsTrigger with value=\"account\" only activates a TabsContent with value=\"account\". A typo causes the panel to stay hidden with no error."
  - "Placing TabsContent inside TabsList: TabsContent must be a sibling of TabsList, not a child. Nesting it inside TabsList breaks the ARIA structure and the panel never renders."
  - "Using onClick to manage active tab state: Pass value and onValueChange to Tabs for controlled usage. Using onClick to set state bypasses Radix's internal state and breaks keyboard navigation and ARIA updates."
  - "Wrapping TabsTrigger in a plain div: A wrapper div breaks the role=\"tablist\" to role=\"tab\" relationship. Use asChild on TabsTrigger to merge onto a custom element instead."
```
