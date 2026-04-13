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
];
