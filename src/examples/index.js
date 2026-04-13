export const examples = [
  {
    name: "Button",
    schema: {
      component: "Button",
      description: "Triggers an action or event when clicked.",
      props: {
        variant: {
          type: "enum",
          values: ["default", "destructive", "outline", "secondary", "ghost", "link"],
          default: "default",
          description: "Controls the visual style of the button."
        },
        size: {
          type: "enum",
          values: ["default", "sm", "lg", "icon"],
          default: "default",
          description: "Controls the size of the button."
        },
        disabled: {
          type: "boolean",
          default: false,
          description: "Prevents interaction and dims the button visually."
        },
        asChild: {
          type: "boolean",
          default: false,
          description: "Merges props onto the child element instead of rendering a button."
        }
      },
      slots: {
        default: "Button label text or icon + label combination"
      },
      accessibility: {
        role: "button",
        keyboardInteraction: ["Enter", "Space"],
        ariaAttributes: ["aria-disabled", "aria-pressed"]
      }
    }
  },
  {
    name: "Toast",
    schema: {
      component: "Toast",
      description: "A brief, auto-dismissing notification that appears in response to a user action.",
      props: {
        variant: {
          type: "enum",
          values: ["default", "destructive"],
          default: "default",
          description: "Controls the visual style and semantic meaning of the toast."
        },
        duration: {
          type: "number",
          default: 5000,
          description: "How long the toast remains visible, in milliseconds."
        },
        open: {
          type: "boolean",
          description: "Controls whether the toast is visible."
        },
        onOpenChange: {
          type: "function",
          description: "Callback fired when the open state changes."
        }
      },
      slots: {
        title: "Short summary of the event",
        description: "Optional supporting detail",
        action: "Optional action button (e.g. Undo)",
        close: "Dismiss button"
      },
      behavior: {
        autoDismiss: true,
        stackable: true,
        position: "bottom-right by default, configurable via ToastProvider"
      },
      accessibility: {
        role: "status",
        ariaLive: "polite for default, assertive for destructive",
        keyboardInteraction: ["Escape to dismiss"]
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

