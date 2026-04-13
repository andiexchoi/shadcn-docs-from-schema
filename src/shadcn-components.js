// Canonical list of all shadcn/ui components.
// display: shown in the dropdown
// slug: sent to the API (matches GitHub path)

export const SHADCN_COMPONENTS = [
  { display: "Accordion", slug: "accordion" },
  { display: "Alert", slug: "alert" },
  { display: "Alert Dialog", slug: "alert-dialog" },
  { display: "Aspect Ratio", slug: "aspect-ratio" },
  { display: "Avatar", slug: "avatar" },
  { display: "Badge", slug: "badge" },
  { display: "Breadcrumb", slug: "breadcrumb" },
  { display: "Button", slug: "button" },
  { display: "Button Group", slug: "button-group" },
  { display: "Calendar", slug: "calendar" },
  { display: "Card", slug: "card" },
  { display: "Carousel", slug: "carousel" },
  { display: "Chart", slug: "chart" },
  { display: "Checkbox", slug: "checkbox" },
  { display: "Collapsible", slug: "collapsible" },
  { display: "Combobox", slug: "combobox" },
  { display: "Command", slug: "command" },
  { display: "Context Menu", slug: "context-menu" },
  { display: "Data Table", slug: "data-table" },
  { display: "Date Picker", slug: "date-picker" },
  { display: "Dialog", slug: "dialog" },
  { display: "Direction", slug: "direction" },
  { display: "Drawer", slug: "drawer" },
  { display: "Dropdown Menu", slug: "dropdown-menu" },
  { display: "Empty", slug: "empty" },
  { display: "Field", slug: "field" },
  { display: "Hover Card", slug: "hover-card" },
  { display: "Input", slug: "input" },
  { display: "Input Group", slug: "input-group" },
  { display: "Input OTP", slug: "input-otp" },
  { display: "Item", slug: "item" },
  { display: "Kbd", slug: "kbd" },
  { display: "Label", slug: "label" },
  { display: "Menubar", slug: "menubar" },
  { display: "Native Select", slug: "native-select" },
  { display: "Navigation Menu", slug: "navigation-menu" },
  { display: "Pagination", slug: "pagination" },
  { display: "Popover", slug: "popover" },
  { display: "Progress", slug: "progress" },
  { display: "Radio Group", slug: "radio-group" },
  { display: "Resizable", slug: "resizable" },
  { display: "Scroll Area", slug: "scroll-area" },
  { display: "Select", slug: "select" },
  { display: "Separator", slug: "separator" },
  { display: "Sheet", slug: "sheet" },
  { display: "Sidebar", slug: "sidebar" },
  { display: "Skeleton", slug: "skeleton" },
  { display: "Slider", slug: "slider" },
  { display: "Sonner", slug: "sonner" },
  { display: "Spinner", slug: "spinner" },
  { display: "Switch", slug: "switch" },
  { display: "Table", slug: "table" },
  { display: "Tabs", slug: "tabs" },
  { display: "Textarea", slug: "textarea" },
  { display: "Toast", slug: "toast" },
  { display: "Toggle", slug: "toggle" },
  { display: "Toggle Group", slug: "toggle-group" },
  { display: "Tooltip", slug: "tooltip" },
  { display: "Typography", slug: "typography" },
];

// Normalize a string for fuzzy matching: lowercase, strip spaces/hyphens/underscores
function normalize(str) {
  return str.toLowerCase().replace(/[\s\-_]/g, "");
}

export function searchComponents(query) {
  if (!query.trim()) return [];
  const q = normalize(query);
  return SHADCN_COMPONENTS.filter((c) => normalize(c.display).includes(q)).slice(0, 8);
}
