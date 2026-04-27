export const examples = [
  {
    name: "Button",
    schema: {
      component: "Button",
      description: "Triggers an action or event when clicked.",
      props: {
        variant: {
          type: "enum",
          values: ["default", "outline", "ghost", "destructive", "secondary", "link"],
          default: "default",
          description: "Controls the visual style of the button."
        },
        size: {
          type: "enum",
          values: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
          default: "default",
          description: "Controls the size of the button. Icon sizes produce a square button for icon-only use."
        },
        asChild: {
          type: "boolean",
          default: false,
          description: "Merges props onto the child element instead of rendering a button. Use to make a link or other element look like a button."
        }
      },
      attributes: {
        "data-icon": {
          values: ["inline-start", "inline-end"],
          description: "Add to an icon or Spinner inside the button to apply correct spacing. Use inline-start for icons before the label, inline-end for icons after."
        },
        disabled: {
          type: "boolean",
          inherited: "Native HTML button attribute. Prevents interaction and dims the button visually."
        }
      },
      notes: {
        cursor: "Tailwind v4 changed button cursor from pointer to default. Add a CSS override to globals.css if your design requires cursor: pointer.",
        rounded: "Use the rounded-full utility class to produce a pill-shaped button.",
        spinner: "Render a Spinner component inside the button for loading states. Add data-icon for correct spacing."
      },
      accessibility: {
        role: "button",
        keyboardInteraction: ["Enter", "Space"],
        ariaAttributes: ["aria-disabled", "aria-pressed"]
      }
    }
  },
  {
    name: "Sonner",
    schema: {
      component: "Sonner",
      description: "An opinionated toast notification system for React. Replaces the deprecated shadcn Toast component.",
      setup: {
        toaster: "Add the Toaster component once at the root layout (app/layout.tsx). It can be placed in server components.",
        trigger: "Call toast() from the sonner package anywhere in your app to fire a notification.",
        multipleToasters: "Render multiple Toaster components with unique id props to create separate toast stacks. Target a specific toaster by passing toasterId to the toast() call."
      },
      toasterProps: {
        theme: {
          type: "string",
          values: ["light", "dark", "system"],
          default: "light",
          description: "Visual theme for the toast stack. Pass a value from your theme provider (such as next-themes) to make it dynamic."
        },
        richColors: {
          type: "boolean",
          default: false,
          description: "Enables richer color treatment for success, error, warning, and info toasts."
        },
        expand: {
          type: "boolean",
          default: false,
          description: "When true, toasts are expanded by default instead of stacked. Users can also trigger expansion by hovering."
        },
        visibleToasts: {
          type: "number",
          default: 3,
          description: "How many toasts are visible in the stack at once. Increase when expand is true."
        },
        position: {
          type: "enum",
          values: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"],
          default: "bottom-right",
          description: "Where the toast stack renders on screen. Applies to all toasts in this Toaster."
        },
        offset: {
          type: "string | number | object",
          default: "32px",
          description: "Distance between the toast stack and the edge of the screen on desktop. Accepts a pixel value, a CSS unit string, or an object with per-side values (top, bottom, left, right)."
        },
        mobileOffset: {
          type: "string | number | object",
          default: "16px",
          description: "Distance from screen edges on mobile (screens under 600px wide). Accepts the same values as offset."
        },
        closeButton: {
          type: "boolean",
          default: false,
          description: "Renders a close button on every toast in this Toaster."
        },
        gap: {
          type: "number",
          default: 14,
          description: "Vertical gap in pixels between toasts in the stack."
        },
        hotkey: {
          type: "string",
          default: "alt+T",
          description: "Keyboard shortcut to focus the toast region."
        },
        dir: {
          type: "string",
          values: ["ltr", "rtl"],
          default: "ltr",
          description: "Text direction for the toast stack."
        },
        invert: {
          type: "boolean",
          default: false,
          description: "Inverts the color scheme of all toasts."
        },
        icons: {
          type: "object",
          description: "Override the default icons for success, error, warning, info, and loading toast types."
        },
        toastOptions: {
          type: "object",
          description: "Default options applied to every toast rendered by this Toaster. Individual toast() calls override these."
        }
      },
      toastTypes: {
        default: "toast('Message') — a neutral informational message. Accepts a string or JSX as the first argument.",
        success: "toast.success('Message') — confirms a completed action. Renders a checkmark icon.",
        error: "toast.error('Message') — communicates a failure. Renders an error icon.",
        loading: "toast.loading('Message') — shows a loading spinner. Use when handling async states manually.",
        promise: "toast.promise(promise, { loading, success, error }) — automatically transitions through loading, success, and error states as a promise resolves or rejects.",
        custom: "toast(<JSX />) — renders custom JSX as the toast content while keeping default Sonner styling and animations.",
        headless: "toast.custom((id) => <JSX />) — fully unstyled. Receives the toast id for manual dismissal via sonner.dismiss(id)."
      },
      toastOptions: {
        description: {
          type: "ReactNode",
          default: null,
          description: "Supporting detail below the main message."
        },
        action: {
          type: "ReactNode or { label: string, onClick: (event) => void }",
          description: "A primary action button inside the toast. Closes the toast on click by default. Call event.preventDefault() in onClick to keep the toast open."
        },
        cancel: {
          type: "ReactNode or { label: string, onClick: () => void }",
          description: "A secondary cancel button inside the toast. Closes the toast on click."
        },
        icon: {
          type: "ReactNode",
          default: null,
          description: "A custom icon rendered before the message."
        },
        closeButton: {
          type: "boolean",
          default: false,
          description: "Renders an explicit close button on the toast."
        },
        duration: {
          type: "number",
          default: 4000,
          description: "How long the toast remains visible, in milliseconds. Set to Infinity for a persistent toast."
        },
        dismissible: {
          type: "boolean",
          default: true,
          description: "Whether the user can swipe or click to dismiss the toast manually."
        },
        invert: {
          type: "boolean",
          default: false,
          description: "Inverts the toast colors. Use on dark backgrounds where the default styling creates low contrast."
        },
        position: {
          type: "enum",
          values: ["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"],
          default: "bottom-right",
          description: "Set on the Toaster component to control where the entire toast stack appears. Cannot be set per individual toast."
        },
        containerAriaLabel: {
          type: "string",
          default: "Notifications",
          description: "The aria-label for the toast container element. Override when 'Notifications' doesn't match the context."
        },
        onDismiss: {
          type: "function",
          description: "Callback fired when the toast is dismissed by the user."
        },
        onAutoClose: {
          type: "function",
          description: "Callback fired when the toast auto-closes after its duration."
        }
      },
      behavior: {
        autoDismiss: true,
        stackable: true,
        swipeToDismiss: true,
        maxVisible: "Three toasts visible at once by default. Older toasts stack behind."
      },
      programmaticControl: {
        update: "Pass the id returned by toast() to a subsequent toast() call to update an existing toast. Only the properties you pass will change. Call toast.success(message, { id }) to also change the type.",
        dismiss: "Call toast.dismiss(id) to remove a specific toast programmatically. Call toast.dismiss() with no argument to remove all toasts at once.",
        persist: "Set duration to Infinity to keep a toast on screen indefinitely. Dismiss it programmatically with toast.dismiss(id) when the condition resolves.",
        getActive: "Use toast.getActiveToasts() outside of React to retrieve an array of all currently visible toasts. Inside React, use the useSonner hook: const { toasts } = useSonner().",
        customElements: "Pass a function returning JSX instead of a string as the title or description to render custom elements (links, buttons, inline components) inside the toast."
      },
      distinction: {
        vsAlert: "Alerts are persistent and inline. Sonner toasts are temporary overlays.",
        actionVsCancel: "action renders a primary button. cancel renders a secondary button. Use action for the thing you want the user to do (Undo, Retry). Use cancel for dismissal with a label."
      },
      accessibility: {
        containerAriaLabel: "Notifications (default). The entire toast stack is a labelled region.",
        ariaLive: "polite by default. Error toasts use assertive, which interrupts screen reader announcement immediately.",
        notes: "Do not use toasts for information that requires a user response. Use an Alert or Dialog instead. Screen readers announce toast content on appearance."
      }
    }
  },
  {
    name: "Dialog",
    schema: {
      component: "Dialog",
      description: "A window overlaid on the primary window or another dialog, rendering the content underneath inert.",
      composition: {
        structure: "Dialog > DialogTrigger + DialogContent > DialogHeader (DialogTitle + DialogDescription) + DialogFooter",
        portal: "DialogContent renders inside a Portal, which appends it to document.body by default. Use the Portal container prop to target a different element.",
        overlay: "DialogOverlay covers the inert content behind the dialog. It is included inside DialogContent in the shadcn implementation."
      },
      subcomponents: {
        Root: {
          description: "The root component. Wraps the trigger and content.",
          props: {
            open: { type: "boolean", description: "Controls visibility in controlled mode." },
            defaultOpen: { type: "boolean", description: "Initial open state in uncontrolled mode." },
            onOpenChange: { type: "function", description: "Callback fired when open state changes. Use to sync controlled state." },
            modal: { type: "boolean", default: true, description: "When false, interaction outside the dialog is not blocked. Use for non-modal dialogs that coexist with page content." }
          }
        },
        Trigger: {
          description: "The element that opens the dialog. Renders a button by default.",
          props: {
            asChild: { type: "boolean", default: false, description: "Merges props onto the child element instead of rendering a button." }
          }
        },
        Content: {
          description: "The dialog panel. Contains all visible dialog content.",
          props: {
            showCloseButton: { type: "boolean", default: true, description: "Shows or hides the default X close button in the top-right corner. Set to false to hide it." },
            onOpenAutoFocus: { type: "function", description: "Callback when focus moves into the content on open. Call event.preventDefault() to override default focus behavior." },
            onCloseAutoFocus: { type: "function", description: "Callback when focus returns to the trigger on close. Call event.preventDefault() to override." },
            onEscapeKeyDown: { type: "function", description: "Callback when Escape is pressed. Call event.preventDefault() to prevent the dialog from closing." },
            onPointerDownOutside: { type: "function", description: "Callback when a pointer event occurs outside the content. Call event.preventDefault() to prevent closing." },
            onInteractOutside: { type: "function", description: "Callback on any interaction outside the content." }
          }
        },
        Title: {
          description: "Required. The dialog heading, announced to screen readers when the dialog opens. Wrap in VisuallyHidden to hide it visually while keeping it accessible."
        },
        Description: {
          description: "Optional. Announced to screen readers after the title. Wrap in VisuallyHidden to hide visually. Remove and pass aria-describedby={undefined} to DialogContent to omit entirely."
        },
        Header: { description: "Layout wrapper for DialogTitle and DialogDescription." },
        Footer: { description: "Layout wrapper for action buttons. Typically contains Cancel and a primary action." },
        Close: {
          description: "Closes the dialog when activated.",
          props: {
            asChild: { type: "boolean", default: false, description: "Merges close behavior onto a child element, such as a custom button." }
          }
        }
      },
      behavior: {
        focusTrap: "Focus is trapped inside the dialog while it is open.",
        scrollLock: "Page scroll is locked while the dialog is open.",
        closeOnEscape: true,
        closeOnOverlayClick: true,
        controlled: "Use open and onOpenChange together for controlled dialogs, such as closing after an async form submission completes.",
        uncontrolled: "Use defaultOpen for simple open/close behavior without managing state."
      },
      patterns: {
        asyncClose: "In controlled mode, set open to false inside a form's onSubmit after the async operation resolves to close the dialog programmatically.",
        scrollableContent: "Wrap DialogContent inside DialogOverlay and set overflow-y: auto on the overlay to allow long content to scroll while the overlay stays fixed.",
        hiddenTitle: "Wrap DialogTitle in VisuallyHidden if the dialog's purpose is clear from context and a visible title would be redundant. Do not remove DialogTitle entirely.",
        customCloseButton: "Use Dialog.Close with asChild to replace the default X button with a custom element."
      },
      accessibility: {
        pattern: "WAI-ARIA Dialog pattern",
        role: "dialog",
        ariaAttributes: [
          "aria-labelledby: automatically linked to DialogTitle",
          "aria-describedby: automatically linked to DialogDescription"
        ],
        focusManagement: "Focus moves to the first focusable element inside the dialog on open. Returns to DialogTrigger on close.",
        keyboardInteraction: [
          "Space or Enter on trigger: opens the dialog",
          "Escape: closes the dialog and returns focus to trigger",
          "Tab: moves focus to the next focusable element inside the dialog",
          "Shift + Tab: moves focus to the previous focusable element"
        ]
      }
    }
  },
  {
    name: "Select",
    schema: {
      component: "Select",
      description: "Allows a user to choose one option from a dropdown list.",
      subcomponents: ["SelectTrigger", "SelectValue", "SelectContent", "SelectItem", "SelectLabel", "SelectSeparator", "SelectGroup"],
      props: {
        value: {
          type: "string",
          description: "The currently selected value. Use for controlled selects."
        },
        defaultValue: {
          type: "string",
          description: "The default selected value for uncontrolled usage."
        },
        onValueChange: {
          type: "function",
          description: "Callback fired when the selected value changes."
        },
        disabled: {
          type: "boolean",
          default: false,
          description: "Prevents interaction with the select."
        },
        required: {
          type: "boolean",
          default: false,
          description: "Marks the field as required for form submission."
        }
      },
      slots: {
        trigger: "The button that opens the dropdown, showing the selected value or placeholder",
        content: "The dropdown panel containing options",
        item: "An individual option in the list",
        label: "A non-selectable label for grouping related options",
        separator: "A visual divider between option groups"
      },
      accessibility: {
        role: "combobox (trigger), listbox (content), option (items)",
        keyboardInteraction: ["Space or Enter to open", "Arrow keys to navigate", "Enter to select", "Escape to close", "Home/End to jump to first/last option"],
        ariaAttributes: ["aria-expanded", "aria-haspopup", "aria-selected"]
      }
    }
  }
  ,
  {
    name: "Badge",
    schema: {
      component: "Badge",
      description: "A small label used to communicate status, category, or count.",
      props: {
        variant: {
          type: "enum",
          values: ["default", "secondary", "destructive", "outline"],
          default: "default",
          description: "Controls the visual weight and semantic tone of the badge."
        }
      },
      slots: {
        default: "Short label text, typically one to three words"
      },
      behavior: {
        inline: true,
        nonInteractive: "Badges are decorative by default and not focusable unless placed inside an interactive element"
      },
      commonUseCases: [
        "Status labels (Active, Pending, Archived)",
        "Category tags on cards or list items",
        "Notification counts on navigation items",
        "Feature flags (Beta, New, Deprecated)"
      ],
      accessibility: {
        role: "none by default",
        notes: "Badges are visual labels. If the badge communicates meaningful status to the user, ensure the information is also available to screen readers via aria-label on the parent element or visually hidden text."
      }
    }
  },
  {
    name: "Alert",
    schema: {
      component: "Alert",
      description: "A static, inline message that communicates important information about the state of a page, form, or process.",
      subcomponents: ["AlertTitle", "AlertDescription"],
      props: {
        variant: {
          type: "enum",
          values: ["default", "destructive"],
          default: "default",
          description: "Controls the visual style and semantic urgency of the alert."
        }
      },
      slots: {
        icon: "Optional icon that reinforces the alert's tone",
        title: "Short summary of the alert, rendered as a heading",
        description: "Supporting detail explaining what happened and what the user can do"
      },
      behavior: {
        persistent: true,
        nonDismissable: "Alerts do not dismiss automatically. They remain until the underlying condition resolves or the user takes action.",
        inlinePlacement: "Rendered inline in the page or form, not as an overlay"
      },
      distinction: {
        vsToast: "Toasts confirm completed actions and auto-dismiss. Alerts communicate ongoing states and persist.",
        vsDialog: "Dialogs require immediate user action and block interaction. Alerts are passive and informational."
      },
      accessibility: {
        role: "alert for destructive variant (announced immediately by screen readers), note for default variant",
        ariaLive: "assertive for destructive, polite for default",
        notes: "Do not use role=alert for non-urgent information. Screen readers announce alert content immediately, which can interrupt the user."
      }
    }
  },
  {
    name: "Tabs",
    schema: {
      component: "Tabs",
      description: "Organizes related content into separate views, displaying one view at a time within the same page context.",
      subcomponents: ["TabsList", "TabsTrigger", "TabsContent"],
      props: {
        defaultValue: {
          type: "string",
          description: "The value of the tab selected by default on initial render."
        },
        value: {
          type: "string",
          description: "The currently selected tab value. Use for controlled tabs."
        },
        onValueChange: {
          type: "function",
          description: "Callback fired when the selected tab changes."
        },
        orientation: {
          type: "enum",
          values: ["horizontal", "vertical"],
          default: "horizontal",
          description: "Controls whether the tab list is arranged horizontally or vertically."
        }
      },
      slots: {
        list: "The container for all tab triggers. Acts as a navigation landmark.",
        trigger: "A single tab button. Selecting it shows the corresponding content panel.",
        content: "The panel displayed when its associated trigger is selected."
      },
      behavior: {
        oneActiveAtATime: true,
        contentPersistence: "Inactive tab content is hidden but remains in the DOM",
        urlSync: "Tabs do not sync with the URL by default. Implement manually if deep-linking to a specific tab is required."
      },
      distinction: {
        vsNavigation: "Tabs switch between views within the same page. Navigation links move between pages.",
        vsAccordion: "Tabs show one panel at a time and keep content at the same level. Accordions can show multiple panels and are better for long-form content."
      },
      accessibility: {
        role: "tablist (TabsList), tab (TabsTrigger), tabpanel (TabsContent)",
        keyboardInteraction: [
          "Arrow Left / Arrow Right to move between tabs (horizontal orientation)",
          "Arrow Up / Arrow Down to move between tabs (vertical orientation)",
          "Home to move to the first tab",
          "End to move to the last tab",
          "Enter or Space to activate the focused tab"
        ],
        ariaAttributes: [
          "aria-selected on the active TabsTrigger",
          "aria-controls linking each trigger to its panel",
          "aria-labelledby linking each panel to its trigger"
        ],
        focusManagement: "Focus stays on the tab trigger when navigating. It moves to the content panel only when the user explicitly tabs into it."
      }
    }
  },
  {
    name: "Custom Button",
    schema: {
      component: "Button",
      description: "Triggers an action or event when clicked. Customized from the upstream shadcn/ui Button with loading states, a renamed destructive variant, and focus trap behavior for modal contexts.",
      props: {
        variant: {
          type: "enum",
          values: ["default", "outline", "ghost", "critical", "secondary", "link"],
          default: "default",
          description: "Controls the visual style of the button. 'critical' replaces the upstream 'destructive' variant to align with the product's severity taxonomy.",
          reason: "'critical' was renamed from 'destructive' after user research in Q3 2024 found that 'destructive' tested as alarming for low-severity actions like archiving a record. The product severity scale is info, warning, critical — this variant maps to critical."
        },
        size: {
          type: "enum",
          values: ["default", "sm", "lg", "icon"],
          default: "default",
          description: "Controls the size of the button. Icon size produces a square button for icon-only use."
        },
        loading: {
          type: "boolean",
          default: false,
          description: "Shows a spinner and disables interaction. The button retains its dimensions to prevent layout shift.",
          reason: "Prevents double-submission on async actions. The button stays in place visually so the user knows their action was received."
        },
        loadingText: {
          type: "string",
          default: null,
          description: "Replaces the button label while loading is true. If omitted, the original label remains visible next to the spinner."
        },
        focusTrap: {
          type: "boolean",
          default: false,
          description: "When true, pressing Tab from this button wraps focus back to it instead of moving to the next element. Use inside modal footers where the button is the only focusable element."
        },
        asChild: {
          type: "boolean",
          default: false,
          description: "Merges props onto the child element instead of rendering a button."
        }
      },
      attributes: {
        "data-loading": {
          values: ["true"],
          description: "Present when loading is true. Use for CSS-only loading styles."
        }
      },
      rules: [
        {
          rule: "Use the critical variant only for actions that permanently delete data or cannot be undone.",
          reason: "critical is the highest severity on the product scale. Applying it to reversible actions trains users to ignore the visual warning.",
          override: "Override with the default variant when the action can be undone within the same session, such as archiving a record with an undo affordance."
        },
        {
          rule: "Always provide loadingText when loading is true on a button with a short label.",
          reason: "A spinner replacing a one-word label gives users no information about what is happening. loadingText like 'Saving...' or 'Deleting...' closes that gap.",
          override: "Omit loadingText when the button label is already a verb phrase that describes the in-progress state ('Uploading file'), because the label already communicates progress."
        }
      ],
      notes: {
        upstreamDivergence: "This component diverges from upstream shadcn/ui Button in three ways: (1) 'destructive' variant renamed to 'critical', (2) loading and loadingText props added, (3) focusTrap prop added for modal contexts. Upstream docs do not cover these props.",
        loading: "The loading spinner renders inside the button at inline-start position. The button's min-width is locked to prevent layout shift when loadingText changes the label length.",
        critical: "The 'critical' variant uses the same visual treatment as upstream 'destructive' but is renamed to match the product severity scale: info, warning, critical."
      },
      accessibility: {
        role: "button",
        keyboardInteraction: ["Enter", "Space"],
        ariaAttributes: ["aria-disabled (set automatically when loading is true)", "aria-busy (set to true during loading)"],
        loadingBehavior: "Screen readers announce the loadingText value when loading begins. If no loadingText is set, aria-busy alone signals the state change."
      }
    }
  }
];

