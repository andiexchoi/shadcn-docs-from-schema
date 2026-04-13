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
      description: "A modal window that interrupts the user flow to focus attention on a critical task or message.",
      subcomponents: ["DialogTrigger", "DialogContent", "DialogHeader", "DialogTitle", "DialogDescription", "DialogFooter", "DialogClose"],
      props: {
        open: {
          type: "boolean",
          description: "Controls whether the dialog is visible. Use for controlled dialogs."
        },
        onOpenChange: {
          type: "function",
          description: "Callback fired when the open state changes."
        },
        modal: {
          type: "boolean",
          default: true,
          description: "When true, interaction outside the dialog is blocked."
        }
      },
      slots: {
        trigger: "The element that opens the dialog",
        content: "The dialog panel, including header, body, and footer",
        title: "Required. The dialog's heading, announced to screen readers",
        description: "Optional. Supporting context below the title",
        footer: "Action buttons, typically Cancel and a primary action",
        close: "Dismiss button, typically an X in the top-right corner"
      },
      behavior: {
        overlay: true,
        focusTrap: true,
        scrollLock: true,
        closeOnOverlayClick: true,
        closeOnEscape: true
      },
      accessibility: {
        role: "dialog",
        ariaAttributes: ["aria-labelledby (DialogTitle)", "aria-describedby (DialogDescription)"],
        focusManagement: "Focus moves to dialog on open; returns to trigger on close",
        keyboardInteraction: ["Escape to close", "Tab to cycle through focusable elements"]
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
  }
];

