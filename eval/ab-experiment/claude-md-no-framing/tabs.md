# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

## tabs

```yaml
component: Tabs
summary: Tabs organize peer-level content into named panels and display one panel at a time, letting users switch between views without leaving the page.
use_when:
  - Use tabs when you have two or more distinct sections of content that share the same context and that users switch between freely.
  - For sequential flows where order matters, use a stepper instead.
do:
  - Give each tab a short, distinct label that describes its panel content.
  - Use tabs for peer-level content only — each tab must be equally valid as a starting point.
  - Keep the number of tabs between two and seven.
dont:
  - "Don't use tabs to replace top-level navigation between distinct areas of the app."
  - "Don't disable a tab without explaining why its content is unavailable."
  - Avoid nesting tabs inside tabs — it creates ambiguous hierarchy and confuses keyboard navigation.
anatomy: Tabs is the root wrapper that holds shared state. TabsList is the horizontal (or vertical) row of tab buttons. Each TabsTrigger is a button that activates its associated panel. Each TabsContent is the panel that renders when its matching trigger is active. Labels inside TabsTrigger truncate rather than wrap to a second line.
contracts:
  - TabsList must wrap all TabsTrigger elements. Placing a TabsTrigger outside TabsList breaks keyboard navigation and ARIA relationships.
  - Every TabsTrigger must have a value prop, and a TabsContent with the same value must exist. A trigger without a matching panel leaves users with no content to display.
  - "Set either defaultValue (uncontrolled) or value plus onValueChange (controlled) on Tabs. Don't mix both."
  - The correct composition is TabsContent as a sibling of TabsList, not nested inside it.
variants:
  - "variant=\"line\" on TabsList: Use the line style for a lighter visual treatment where the default filled pill style adds too much weight."
  - "orientation=\"vertical\": Use vertical tabs when horizontal space is constrained or when the tab list is part of a sidebar layout."
  - "disabled on TabsTrigger: Use to mark a tab as unavailable, but pair it with a visible explanation so users understand why."
placement: Place TabsList at the top of the tabbed region so users see navigation before content. For vertical orientation, place TabsList to the left of the content panels. Set a width on the Tabs root to control how the tab strip and panels fill their container.
editorial:
  - "Use sentence case for tab labels: \"Account settings,\" not \"Account Settings.\""
  - Keep labels to one or two words. Three words is the maximum.
  - "Use nouns or noun phrases, not verbs: \"Password,\" not \"Change password.\""
  - "Don't use punctuation at the end of tab labels."
keyboard:
  - "Arrow Right / Arrow Left (horizontal): moves focus to the next or previous tab."
  - "Arrow Down / Arrow Up (vertical): moves focus to the next or previous tab."
  - "Home: moves focus to the first tab."
  - "End: moves focus to the last tab."
  - "Tab: moves focus from the active tab into its associated panel content."
aria:
  - "role=\"tablist\": applied to TabsList."
  - "role=\"tab\": applied to each TabsTrigger."
  - "aria-selected=\"true\": applied to the active TabsTrigger; \"false\" on all others."
  - "aria-controls: on each TabsTrigger, pointing to the ID of its associated TabsContent panel."
  - "role=\"tabpanel\": applied to each TabsContent."
  - "aria-labelledby: on each TabsContent, pointing to the ID of its associated TabsTrigger."
a11y:
  - The active tab must be visually distinct using more than color alone — use a combination of fill, weight, or underline so users with color vision deficiency can identify it.
  - "Decorative icons inside TabsTrigger must have aria-hidden=\"true\". Icons that carry meaning need a visible label alongside them, not an aria-label substitution."
mistakes:
  - "Mismatched value props: a TabsTrigger with value=\"account\" and a TabsContent with value=\"accounts\" silently renders no content. Verify every trigger has an exact string match in its panel."
  - "Using onClick to manage active state: this bypasses Radix or Base UI's internal state and breaks Escape handling and keyboard navigation. Use onValueChange on the Tabs root instead."
  - "Placing TabsContent inside TabsList: the correct structure is TabsList and all TabsContent elements as siblings inside Tabs, not nested."
  - "Omitting defaultValue or value: without an initial value, no panel renders on load. Always set defaultValue for uncontrolled usage."
```
