// Single source of truth for the A/B experiment.
// Do not edit markers after any generation run — see PRE_REGISTRATION.md.
//
// Marker shapes:
//   structural: { id, tier: "structural", description, direction, pattern: /re/ }
//   behavioral: { id, tier: "behavioral", description, direction, requires?: /re/, forbids?: /re/ }
//   semantic:   { id, tier: "semantic",  description, direction, rubric: "..." }
//
// direction: "+" means marker satisfaction is good (CLAUDE.md contract), "-" means
// satisfaction is bad (anti-pattern; score is inverted during aggregation).

export const COMPONENTS = {
  dialog: {
    slug: "confirm-delete-dialog",
    prompt:
      "Build a reusable confirm-delete dialog for deleting a project. User has to type the project name to confirm. Use shadcn/ui.",
    deps: { "@radix-ui/react-dialog": "^1.1.6", "lucide-react": "^0.475.0" },
    batchName: "dialog",
    markers: [
      { id: "dialog-title-rendered", tier: "structural", direction: "+", description: "Dialog title primitive used (<DialogTitle>, <Dialog.Title>, <DialogPrimitive.Title>, etc.)", pattern: /<(\w+\.Title|DialogTitle)\b/ },
      { id: "dialog-description-rendered", tier: "structural", direction: "+", description: "Dialog description primitive used (<DialogDescription>, <Dialog.Description>, <DialogPrimitive.Description>, etc.)", pattern: /<(\w+\.Description|DialogDescription)\b/ },
      { id: "dialog-variant-destructive", tier: "structural", direction: "+", description: "variant=\"destructive\" on the delete action", pattern: /variant=["']destructive["']/ },
      { id: "dialog-no-invented-variant", tier: "structural", direction: "-", description: "invented variants like \"critical\" / \"danger\"", pattern: /variant=["'](critical|danger|warning)["']/ },
      { id: "dialog-onOpenChange", tier: "behavioral", direction: "+", description: "state driven by onOpenChange", requires: /\bonOpenChange\b/ },
      { id: "dialog-no-manual-setOpen-toggle", tier: "behavioral", direction: "-", description: "manual onClick toggling of dialog state", forbids: /onClick=\{\s*\(\)\s*=>\s*set(Open|IsOpen|Show)\(\s*!/ },
      { id: "dialog-aria-describedby-explicit", tier: "behavioral", direction: "+", description: "aria-describedby wired explicitly on Content", requires: /aria-describedby=/ },
      { id: "dialog-no-placeholder-projectname", tier: "behavioral", direction: "-", description: "placeholder={projectName} anti-pattern (defeats type-to-confirm)", forbids: /placeholder=\{\s*projectName\s*\}/ },
      { id: "dialog-title-question-framing", tier: "semantic", direction: "+", description: "dialog title framed as a question or action that names the subject", rubric: "Is the dialog title framed as a question (e.g. \"Delete project?\" or \"Delete {projectName}?\") or a direct action-statement that names the subject, rather than a generic label (\"Warning\", \"Confirm\", \"Delete project\" with no subject)? Answer true only if the title is explicit about what is being deleted." },
      { id: "dialog-case-sensitivity-hint", tier: "semantic", direction: "+", description: "UI surfaces the case-sensitivity / exact-match requirement", rubric: "Does the UI surface to the user that the project-name confirmation is case-sensitive or must match exactly? This can be a helper text, placeholder hint, or inline copy — not a comment in the code. Answer true if a sighted user would see this information." },
      { id: "dialog-motion-reduce", tier: "semantic", direction: "+", description: "respects prefers-reduced-motion", rubric: "Does the component respect prefers-reduced-motion? Look for Tailwind's motion-reduce: variant classes on animated elements, a CSS media query, or explicit opt-out logic. A dialog without any animation at all also counts as respecting it." },
    ],
  },

  sheet: {
    slug: "notification-settings-sheet",
    prompt:
      "Build a settings panel in a side sheet with a form for notification preferences. Use shadcn/ui.",
    deps: { "@radix-ui/react-dialog": "^1.1.6", "lucide-react": "^0.475.0" },
    batchName: "sheet",
    markers: [
      { id: "sheet-title-rendered", tier: "structural", direction: "+", description: "Sheet title primitive used (<SheetTitle>, <Sheet.Title>, <Dialog.Title>, <DialogPrimitive.Title>, etc.)", pattern: /<(\w+\.Title|SheetTitle|DialogTitle)\b/ },
      { id: "sheet-description-rendered", tier: "structural", direction: "+", description: "Sheet description primitive used (<SheetDescription>, <Sheet.Description>, <Dialog.Description>, <DialogPrimitive.Description>, etc.)", pattern: /<(\w+\.Description|SheetDescription|DialogDescription)\b/ },
      { id: "sheet-side-prop", tier: "structural", direction: "+", description: "`side` prop used for panel positioning", pattern: /\bside=["'](top|right|bottom|left)["']/ },
      { id: "sheet-close-button-aria-label", tier: "structural", direction: "+", description: "close button has aria-label", pattern: /aria-label=["'][^"']*[Cc]lose/ },
      { id: "sheet-onOpenChange", tier: "behavioral", direction: "+", description: "state driven by onOpenChange", requires: /\bonOpenChange\b/ },
      { id: "sheet-aria-describedby-explicit", tier: "behavioral", direction: "+", description: "aria-describedby wired explicitly", requires: /aria-describedby=/ },
      { id: "sheet-no-hardcoded-transform", tier: "behavioral", direction: "-", description: "hardcoded positioning via inline style transforms", forbids: /style=\{\{[^}]*transform:/ },
      { id: "sheet-title-names-purpose", tier: "semantic", direction: "+", description: "sheet title names what the panel is for", rubric: "Does the sheet title name what the panel is for (e.g. \"Notification preferences\", \"Notification settings\")? A generic title like \"Settings\" alone is not sufficient unless the context makes the subject obvious." },
      { id: "sheet-submit-path-clear", tier: "semantic", direction: "+", description: "form has a clear submit path (close on save, or explain staying open)", rubric: "Does the form inside the sheet have a clear submit path? The sheet should either close on successful save, indicate a save/cancel flow, or autosave with explicit feedback. Answer false if pressing save does nothing visible, or if there's no obvious way to persist changes." },
      { id: "sheet-motion-reduce", tier: "semantic", direction: "+", description: "respects prefers-reduced-motion", rubric: "Does the component respect prefers-reduced-motion via motion-reduce: Tailwind variants, a media query, or by having no animation? Answer true for any of these." },
    ],
  },

  select: {
    slug: "timezone-selector",
    prompt: "Build a reusable timezone selector. Use shadcn/ui.",
    deps: { "@radix-ui/react-select": "^2.1.6", "lucide-react": "^0.475.0" },
    batchName: "select",
    markers: [
      { id: "select-has-trigger", tier: "structural", direction: "+", description: "Select trigger primitive used (<SelectTrigger>, <Select.Trigger>, <SelectPrimitive.Trigger>, etc.)", pattern: /<(\w+\.Trigger|SelectTrigger)\b/ },
      { id: "select-has-value", tier: "structural", direction: "+", description: "Select value primitive used (<SelectValue>, <Select.Value>, <SelectPrimitive.Value>, etc.)", pattern: /<(\w+\.Value|SelectValue)\b/ },
      { id: "select-has-content", tier: "structural", direction: "+", description: "Select content primitive used (<SelectContent>, <Select.Content>, <SelectPrimitive.Content>, etc.)", pattern: /<(\w+\.Content|SelectContent)\b/ },
      { id: "select-has-item", tier: "structural", direction: "+", description: "Select item primitive used (<SelectItem>, <Select.Item>, <SelectPrimitive.Item>, etc.)", pattern: /<(\w+\.Item|SelectItem)\b/ },
      { id: "select-no-native-select", tier: "structural", direction: "-", description: "native <select> element used instead of primitive", pattern: /<select\s/ },
      { id: "select-placeholder-on-value", tier: "behavioral", direction: "+", description: "placeholder passed to Select value primitive, not the trigger", requires: /<(\w+\.Value|SelectValue)[^>]*placeholder=/ },
      { id: "select-onValueChange", tier: "behavioral", direction: "+", description: "onValueChange handler used", requires: /\bonValueChange\b/ },
      { id: "select-no-onChange", tier: "behavioral", direction: "-", description: "raw onChange on the Select root (should be onValueChange)", forbids: /<(Select|\w+\.Root)\b[^>]*\bonChange=/ },
      { id: "select-label-htmlfor", tier: "behavioral", direction: "+", description: "Label associated via htmlFor with matching id on trigger", requires: /<Label[^>]*htmlFor=/ },
      { id: "select-no-hardcoded-combobox-aria", tier: "behavioral", direction: "-", description: "hardcoded role=\"combobox\" / aria-expanded / aria-haspopup on the trigger", forbids: /role=["']combobox["']|aria-expanded=\{|aria-haspopup=/ },
      { id: "select-no-custom-keydown", tier: "behavioral", direction: "-", description: "custom keydown handlers for arrow/Enter on the Select", forbids: /onKeyDown=\{[^}]*(?:ArrowDown|ArrowUp|Enter)/ },
      { id: "select-uses-groups-for-regions", tier: "semantic", direction: "+", description: "uses SelectGroup + SelectLabel when timezone list has regions", rubric: "Does the component use SelectGroup with SelectLabel to group timezones by region (Americas, Europe, Asia, etc.), or is there a clear reason not to (e.g. flat list of only user's common timezones)? Answer true if groupings exist, or if the list is deliberately flat with a clear justification in code." },
      { id: "select-realistic-timezone-list", tier: "semantic", direction: "+", description: "timezone list is realistic and complete enough to use, OR clearly parameterized for caller to supply", rubric: "Is the timezone list either realistic and substantial (includes IANA-style names like America/Los_Angeles, multiple regions, a reasonable coverage of common zones) or clearly designed to be supplied by the caller (accepts a `timezones` prop, `options` prop, or similar)? A list of only 3 hardcoded values like [UTC, EST, PST] with no parameterization is not sufficient." },
    ],
  },

  field: {
    // shadcn/ui v4 renamed the old Form (react-hook-form wrapper) to Field —
    // a composable form primitive (FieldLabel, FieldDescription, FieldError,
    // FieldGroup, FieldSet, FieldLegend). Field is form-library-agnostic;
    // callers pair it with react-hook-form or any other form lib.
    slug: "profile-edit-form",
    prompt:
      "Build a profile edit form with name, email, and bio fields. Use shadcn/ui.",
    deps: {
      "react-hook-form": "^7.54.2",
      "@hookform/resolvers": "^3.10.0",
      zod: "^3.24.1",
    },
    batchName: "field",
    markers: [
      { id: "field-FieldLabel-used", tier: "structural", direction: "+", description: "FieldLabel used for field labeling", pattern: /\bFieldLabel\b/ },
      { id: "field-FieldError-used", tier: "structural", direction: "+", description: "FieldError used to render validation messages", pattern: /\bFieldError\b/ },
      { id: "field-FieldDescription-used", tier: "structural", direction: "+", description: "FieldDescription used for helper text", pattern: /\bFieldDescription\b/ },
      { id: "field-Field-or-FieldGroup-used", tier: "structural", direction: "+", description: "Field or FieldGroup wrapper used", pattern: /<(Field|FieldGroup)[\s\n>]/ },
      { id: "field-no-raw-label", tier: "structural", direction: "-", description: "raw <label htmlFor=> HTML element", pattern: /<label\s[^>]*htmlFor/ },
      { id: "field-schema-resolver", tier: "structural", direction: "+", description: "schema resolver (zodResolver / yupResolver / valibotResolver)", pattern: /\b(zodResolver|yupResolver|joiResolver|valibotResolver)\b/ },
      { id: "field-form-library", tier: "structural", direction: "+", description: "uses react-hook-form OR explicit uncontrolled form pattern", pattern: /from\s+["']react-hook-form["']|<form\s[^>]*onSubmit/ },
      { id: "field-label-htmlfor-id-paired", tier: "behavioral", direction: "+", description: "FieldLabel has htmlFor matching a sibling input id", requires: /<FieldLabel[^>]*htmlFor=["']([^"']+)["'][\s\S]{0,400}\bid=["']\1["']|\bid=["']([^"']+)["'][\s\S]{0,400}<FieldLabel[^>]*htmlFor=["']\2["']/ },
      { id: "field-aria-invalid-paired-with-data-invalid", tier: "behavioral", direction: "+", description: "aria-invalid on the control paired with data-invalid on the Field when error state exists", requires: /aria-invalid=[\s\S]{0,400}data-invalid=|data-invalid=[\s\S]{0,400}aria-invalid=/ },
      { id: "field-submit-tied-to-form-state", tier: "behavioral", direction: "+", description: "submit button disabled/pending tied to form state", requires: /formState[\s\S]{0,60}isSubmitting|isSubmitting[\s\S]{0,60}formState|pending|\bisLoading\b|\bisPending\b/ },
      { id: "field-typed-submit-handler", tier: "semantic", direction: "+", description: "submit handler strongly typed from schema inference", rubric: "Is the submit handler strongly typed using the zod (or equivalent) schema's inferred type (z.infer<typeof schema>, a FormValues type alias derived from the schema, or a Controller/handleSubmit that propagates the inferred type)? A handler that takes `any` or an untyped object is not sufficient." },
      { id: "field-reasonable-validation", tier: "semantic", direction: "+", description: "validation covers email format, bio max, and name non-empty/min", rubric: "Does the schema include reasonable validation rules: email format check (z.string().email() or similar), a max length on bio, and either a min length or non-empty check on name? Missing one is acceptable; missing two or more is not." },
      { id: "field-description-on-a-field", tier: "semantic", direction: "+", description: "FieldDescription rendered on at least one field with real helper text", rubric: "Is FieldDescription rendered with real helper content on at least one field (e.g. a bio length hint, email format note, character count)? An imported-but-unused FieldDescription does not count." },
    ],
  },

  tabs: {
    slug: "settings-tabs",
    prompt:
      "Build a settings page with tabs for Profile, Notifications, and Security. Use shadcn/ui.",
    deps: { "@radix-ui/react-tabs": "^1.1.3" },
    batchName: "tabs",
    markers: [
      { id: "tabs-has-list", tier: "structural", direction: "+", description: "Tabs list primitive used (<TabsList>, <Tabs.List>, etc.)", pattern: /<(\w+\.List|TabsList)\b/ },
      { id: "tabs-has-trigger", tier: "structural", direction: "+", description: "Tabs trigger primitive used (<TabsTrigger>, <Tabs.Trigger>, etc.)", pattern: /<(\w+\.Trigger|TabsTrigger)\b/ },
      { id: "tabs-has-content", tier: "structural", direction: "+", description: "Tabs content primitive used (<TabsContent>, <Tabs.Content>, etc.)", pattern: /<(\w+\.Content|TabsContent)\b/ },
      { id: "tabs-three-triggers", tier: "structural", direction: "+", description: "three tab-trigger elements rendered", pattern: /<(\w+\.Trigger|TabsTrigger)\b[\s\S]*?<(\w+\.Trigger|TabsTrigger)\b[\s\S]*?<(\w+\.Trigger|TabsTrigger)\b/ },
      { id: "tabs-three-content-panes", tier: "structural", direction: "+", description: "three tab-content panes rendered", pattern: /<(\w+\.Content|TabsContent)\b[\s\S]*?<(\w+\.Content|TabsContent)\b[\s\S]*?<(\w+\.Content|TabsContent)\b/ },
      { id: "tabs-default-or-controlled", tier: "behavioral", direction: "+", description: "defaultValue OR (value + onValueChange) on Tabs root", requires: /<(Tabs|\w+\.Root)\b[^>]*(defaultValue=|value=\{[^}]+\}[\s\S]{0,100}onValueChange=)/ },
      { id: "tabs-no-hardcoded-role-tab", tier: "behavioral", direction: "-", description: "role=\"tab\" / aria-selected hardcoded on triggers", forbids: /role=["']tab["']|role=["']tablist["']|aria-selected=/ },
      { id: "tabs-no-tabindex-hardcoded", tier: "behavioral", direction: "-", description: "tabindex hardcoded on triggers", forbids: /<(\w+\.Trigger|TabsTrigger)[^>]*tab[Ii]ndex=/ },
      { id: "tabs-no-custom-arrow-keys", tier: "behavioral", direction: "-", description: "custom arrow-key handlers (Radix supplies roving tabindex)", forbids: /onKeyDown=\{[^}]*(?:ArrowLeft|ArrowRight)/ },
      { id: "tabs-meaningful-content", tier: "semantic", direction: "+", description: "each TabsContent has meaningful content or a clear scaffold per section", rubric: "Does each of the three TabsContent sections have meaningful content or a clear labeled scaffold (a heading, a form, fields, or a structured placeholder) for Profile / Notifications / Security? Empty TabsContent or identical placeholder text across all three does not count." },
      { id: "tabs-values-semantic", tier: "semantic", direction: "+", description: "TabsTrigger values are semantic kebab/snake strings, not indices", rubric: "Are the `value` props on TabsTrigger semantic strings that identify the tab (\"profile\", \"notifications\", \"security\") rather than numeric indices (\"0\", \"1\", \"2\") or single letters? Semantic values aid debugging and URL-syncing." },
    ],
  },

  dropdownmenu: {
    slug: "user-account-menu",
    prompt:
      "Build a user account menu with Profile, Settings, Billing (disabled if free plan), and Sign out. Use shadcn/ui.",
    deps: { "@radix-ui/react-dropdown-menu": "^2.1.6", "lucide-react": "^0.475.0" },
    batchName: "dropdown-menu",
    markers: [
      { id: "ddm-has-trigger", tier: "structural", direction: "+", description: "DropdownMenu trigger primitive used (<DropdownMenuTrigger>, <DropdownMenu.Trigger>, etc.)", pattern: /<(\w+\.Trigger|DropdownMenuTrigger)\b/ },
      { id: "ddm-has-content", tier: "structural", direction: "+", description: "DropdownMenu content primitive used (<DropdownMenuContent>, <DropdownMenu.Content>, etc.)", pattern: /<(\w+\.Content|DropdownMenuContent)\b/ },
      { id: "ddm-has-item", tier: "structural", direction: "+", description: "DropdownMenu item primitive used (<DropdownMenuItem>, <DropdownMenu.Item>, etc.)", pattern: /<(\w+\.Item|DropdownMenuItem)\b/ },
      { id: "ddm-asChild-on-trigger", tier: "structural", direction: "+", description: "asChild on the DropdownMenu trigger", pattern: /<(\w+\.Trigger|DropdownMenuTrigger)[^>]*\basChild\b/ },
      { id: "ddm-separator-used", tier: "structural", direction: "+", description: "DropdownMenu separator used between groups (<DropdownMenuSeparator>, <DropdownMenu.Separator>, etc.)", pattern: /<(\w+\.Separator|DropdownMenuSeparator)\b/ },
      { id: "ddm-onSelect-not-onClick", tier: "behavioral", direction: "+", description: "onSelect on at least one menu item (not onClick for the menu action)", requires: /<(\w+\.Item|DropdownMenuItem)[^>]*onSelect=/ },
      { id: "ddm-billing-disabled-via-prop", tier: "behavioral", direction: "+", description: "menu item uses disabled prop (not conditional render)", requires: /<(\w+\.Item|DropdownMenuItem)[^>]*disabled=/ },
      { id: "ddm-no-hardcoded-menu-role", tier: "behavioral", direction: "-", description: "role=\"menu\" / role=\"menuitem\" hardcoded", forbids: /role=["']menu(item)?["']/ },
      { id: "ddm-signout-distinguished", tier: "semantic", direction: "+", description: "Sign out item is visually distinguished", rubric: "Is the Sign out item visually distinguished from the other items — via a destructive color/className, an icon that implies logout, a DropdownMenuSeparator immediately above it, or explicit styling? A Sign out item that looks identical to every other item does not count." },
      { id: "ddm-freeplan-as-prop", tier: "semantic", direction: "+", description: "free-plan check is a prop or context, not hardcoded", rubric: "Is the component's free-plan check passed in as a prop (e.g. `plan`, `isFreePlan`, `user.plan`) or read from context, rather than hardcoded to a constant like `const isFreePlan = true`? Answer true if the caller can control the disabled state." },
    ],
  },

  popover: {
    slug: "color-picker-popover",
    prompt: "Build a color picker popover for a theme editor. Use shadcn/ui.",
    deps: { "@radix-ui/react-popover": "^1.1.6", "lucide-react": "^0.475.0" },
    batchName: "popover",
    markers: [
      { id: "popover-has-trigger", tier: "structural", direction: "+", description: "Popover trigger primitive used (<PopoverTrigger>, <Popover.Trigger>, etc.)", pattern: /<(\w+\.Trigger|PopoverTrigger)\b/ },
      { id: "popover-has-content", tier: "structural", direction: "+", description: "Popover content primitive used (<PopoverContent>, <Popover.Content>, etc.)", pattern: /<(\w+\.Content|PopoverContent)\b/ },
      { id: "popover-asChild-on-trigger", tier: "structural", direction: "+", description: "asChild on the Popover trigger", pattern: /<(\w+\.Trigger|PopoverTrigger)[^>]*\basChild\b/ },
      { id: "popover-positioning-props", tier: "structural", direction: "+", description: "align / side / sideOffset used for positioning", pattern: /\b(align|side|sideOffset)=/ },
      { id: "popover-no-custom-escape", tier: "behavioral", direction: "-", description: "custom Escape keydown handler (Radix supplies)", forbids: /onKeyDown=\{[^}]*Escape/ },
      { id: "popover-no-inline-transform", tier: "behavioral", direction: "-", description: "inline style transforms for positioning", forbids: /style=\{\{[^}]*transform:/ },
      { id: "popover-controlled-or-uncontrolled", tier: "behavioral", direction: "+", description: "open/onOpenChange used OR left fully uncontrolled", requires: /<(Popover|\w+\.Root)\b[^>]*(onOpenChange=|open=\{)|<(Popover|\w+\.Root)\b(?![^>]*onOpenChange=)(?![^>]*open=)/ },
      { id: "popover-real-color-ui", tier: "semantic", direction: "+", description: "renders a real color picker (swatches or HSL/RGB inputs), not just a text input", rubric: "Does the popover content render a real color-picking UI — a swatch grid, an HSL/RGB slider set, a hex input, or an HTML input[type=\"color\"] — rather than just a plain text input asking the user to type a color name? Answer true if any recognizable color-picking affordance is present." },
      { id: "popover-controlled-value", tier: "semantic", direction: "+", description: "selected color is a controlled value with a change callback", rubric: "Does the component expose the selected color via a value/onChange (or equivalent) prop interface so the caller can read and set it, rather than holding the color purely in internal state with no external API?" },
    ],
  },

  toast: {
    slug: "project-deletion-toast",
    prompt:
      "Build a helper that shows a toast when a project deletion succeeds or fails. Use shadcn/ui.",
    deps: { sonner: "^1.7.4" },
    batchName: "sonner",
    markers: [
      { id: "toast-imports-sonner", tier: "structural", direction: "+", description: "imports toast from sonner", pattern: /from\s+["']sonner["']/ },
      { id: "toast-success-call", tier: "structural", direction: "+", description: "toast.success() used for success case", pattern: /toast\.success\(/ },
      { id: "toast-error-call", tier: "structural", direction: "+", description: "toast.error() used for failure case", pattern: /toast\.error\(/ },
      { id: "toast-no-radix-toast-import", tier: "structural", direction: "-", description: "imports from @radix-ui/react-toast (deprecated shadcn path)", pattern: /@radix-ui\/react-toast/ },
      { id: "toast-no-homemade-toast", tier: "structural", direction: "-", description: "home-rolled toast with useState", pattern: /useState[^;]*\bsetToasts?\b/ },
      { id: "toast-error-has-duration-or-action", tier: "behavioral", direction: "+", description: "error toast has longer duration or an action object", requires: /toast\.error\([^)]*(\bduration\b|\baction:?\s*\{)/ },
      { id: "toast-two-code-paths", tier: "semantic", direction: "+", description: "two distinct call sites or a helper that branches on result", rubric: "Does the code have two distinct code paths for success vs failure — either two separate helper functions (e.g. showSuccess / showError), or a single function that branches on a result/error argument and calls toast.success or toast.error accordingly? A single call that just passes a string does not count." },
      { id: "toast-sentence-case-messages", tier: "semantic", direction: "+", description: "messages are sentence-case and name the outcome", rubric: "Are the toast messages in sentence case and do they clearly name the outcome? Good: \"Project deleted\" / \"Couldn't delete project\". Bad: \"SUCCESS\" / \"Error\" / \"OK\" / \"Failure\" / Title Case like \"Project Deleted\"." },
      { id: "toast-toaster-mount-noted", tier: "semantic", direction: "+", description: "<Toaster /> mount mentioned in a comment or JSDoc", rubric: "Does the file contain a JSDoc or code comment that notes `<Toaster />` from Sonner must be mounted once at the app root? This isn't strictly required for the helper to work, but consumers need to know — answer true only if the comment is present and clear." },
    ],
  },

  checkbox: {
    slug: "permissions-panel",
    prompt:
      "Build a permissions panel with Read, Write, and Delete checkboxes, plus a \"Select all\" master checkbox that shows an indeterminate state when some but not all are selected. Use shadcn/ui.",
    deps: { "@radix-ui/react-checkbox": "^1.1.3", "lucide-react": "^0.475.0" },
    batchName: "checkbox",
    markers: [
      { id: "checkbox-uses-primitive", tier: "structural", direction: "+", description: "Checkbox primitive used (<Checkbox>, <CheckboxPrimitive.Root>, <Checkbox.Root>, etc.)", pattern: /<Checkbox(\.\w+)?\b|CheckboxPrimitive/ },
      { id: "checkbox-no-native-input", tier: "structural", direction: "-", description: "native <input type=\"checkbox\"> used", pattern: /<input[^>]*type=["']checkbox["']/ },
      { id: "checkbox-indeterminate-state", tier: "structural", direction: "+", description: "indeterminate state handled", pattern: /["']indeterminate["']|\bindeterminate\b/ },
      { id: "checkbox-onCheckedChange", tier: "behavioral", direction: "+", description: "onCheckedChange used, not onChange", requires: /\bonCheckedChange\b/ },
      { id: "checkbox-no-onChange", tier: "behavioral", direction: "-", description: "onChange used on Checkbox", forbids: /<Checkbox[^>]*\bonChange=/ },
      { id: "checkbox-label-htmlfor", tier: "behavioral", direction: "+", description: "labels associated via htmlFor + id", requires: /<Label[^>]*htmlFor=/ },
      { id: "checkbox-master-derives-state", tier: "semantic", direction: "+", description: "master checkbox derives state from children (not independent)", rubric: "Does the master \"Select all\" checkbox's checked state derive from the three child checkboxes' states (showing checked when all are selected, unchecked when none are, indeterminate when some are), rather than being an independent piece of state? Answer true only if the master's state is computed from the children's." },
      { id: "checkbox-master-toggles-all", tier: "semantic", direction: "+", description: "toggling master selects/deselects all children atomically", rubric: "When the user clicks the master checkbox, does it select all three children if any are unchecked, or deselect all three if all are checked? Answer true only if the master's handler updates all children together." },
      { id: "checkbox-human-labels", tier: "semantic", direction: "+", description: "labels are human-readable (\"Read\", not \"read_perm\")", rubric: "Are the checkbox labels human-readable strings suitable for a UI — \"Read\", \"Write\", \"Delete\" — rather than programmatic identifiers like \"read_perm\", \"WRITE_ACCESS\", or \"perm.delete\"? The labels presented to the user must be natural." },
    ],
  },

  radiogroup: {
    slug: "billing-cycle-selector",
    prompt:
      "Build a billing cycle selector (Monthly, Yearly, Custom) as a radio group. Use shadcn/ui.",
    deps: { "@radix-ui/react-radio-group": "^1.2.2" },
    batchName: "radio-group",
    markers: [
      { id: "radio-group-root", tier: "structural", direction: "+", description: "RadioGroup root used (<RadioGroup>, <RadioGroup.Root>, <RadioGroupPrimitive.Root>, etc.)", pattern: /<RadioGroup(\.\w+)?\b|RadioGroupPrimitive/ },
      { id: "radio-group-item", tier: "structural", direction: "+", description: "RadioGroup item used (<RadioGroupItem>, <RadioGroup.Item>, etc.)", pattern: /<(\w+\.Item|RadioGroupItem)\b/ },
      { id: "radio-no-native-input", tier: "structural", direction: "-", description: "native <input type=\"radio\"> used", pattern: /<input[^>]*type=["']radio["']/ },
      { id: "radio-three-items", tier: "structural", direction: "+", description: "three radio item elements rendered", pattern: /<(\w+\.Item|RadioGroupItem)\b[\s\S]*?<(\w+\.Item|RadioGroupItem)\b[\s\S]*?<(\w+\.Item|RadioGroupItem)\b/ },
      { id: "radio-value-at-root", tier: "behavioral", direction: "+", description: "value / onValueChange on RadioGroup root", requires: /<(RadioGroup|\w+\.Root)\b[^>]*(value=|defaultValue=)[\s\S]{0,200}onValueChange=|<(RadioGroup|\w+\.Root)\b[^>]*onValueChange=[\s\S]{0,200}value=/ },
      { id: "radio-items-have-ids", tier: "behavioral", direction: "+", description: "each radio item has an id, Label has matching htmlFor", requires: /<(\w+\.Item|RadioGroupItem)[^>]*\bid=["'][^"']+["'][\s\S]*?<Label[^>]*htmlFor=["'][^"']+["']/ },
      { id: "radio-no-name-on-items", tier: "behavioral", direction: "-", description: "name prop manually set on each radio item (should inherit from root)", forbids: /<(\w+\.Item|RadioGroupItem)[^>]*\bname=/ },
      { id: "radio-custom-reveals-input", tier: "semantic", direction: "+", description: "Custom option reveals or hints at additional input", rubric: "Does the \"Custom\" radio option either reveal an additional input when selected (inline textarea, number field, period selector), pair with a nearby input, or include a comment explaining the caller is expected to render it? A Custom option with no apparent follow-up path is not sufficient." },
      { id: "radio-sensible-default", tier: "semantic", direction: "+", description: "default value is a sensible pick (Monthly or Yearly)", rubric: "Is the defaultValue (or initial value) a sensible choice — Monthly or Yearly — rather than Custom or empty? Defaulting to Custom leaves the user in an incomplete state; empty defaults force a forced click before anything is selected." },
    ],
  },
};

// Build the scaffold system prompt. Same for both conditions except for the
// CLAUDE.md block which is appended only in condition B.
export function buildSystemPrompt({ component, claudeMdContent }) {
  const depList = Object.entries(component.deps)
    .map(([name, version]) => `${name}@${version}`)
    .join(", ");

  const base = `You are a senior frontend engineer generating a TypeScript React component for an existing Next.js + shadcn/ui + Tailwind CSS project.

The project has this structure:
- components/ui/button.tsx — exports Button (shadcn)
- components/ui/input.tsx — exports Input (shadcn)
- components/ui/label.tsx — exports Label (shadcn)
- lib/utils.ts — exports cn() for class composition
- Import paths use the "@/" alias rooted at the project root.
- Extra installed packages for this task: ${depList}.
- No other shadcn/ui wrapper components (e.g. no components/ui/dialog.tsx) are installed. If you need one, use the underlying Radix primitives directly, or construct a local wrapper inside the same file.

Output format rules (strict):
- Reply with ONLY the contents of the component file.
- No markdown fences. No prose. No explanation.
- Your response will be written to disk verbatim as a .tsx file.
- The first non-whitespace characters of your response should be either a "use client"; directive, an import statement, or a /* comment */.`;

  if (!claudeMdContent) return base;

  return `${base}

---

Project component guidelines (auto-generated from the component library's documentation — treat these as authoritative):

${claudeMdContent}`;
}

export function buildUserPrompt(component) {
  return `${component.prompt}\n\nWrite the implementation as \`components/${component.slug}.tsx\`.`;
}
