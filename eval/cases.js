// Each case tests a specific prompt behavior, not a component.
// traits: strings or regex patterns the output MUST contain (case-insensitive substring match).
// antitraits: strings or regex patterns the output must NOT contain.

export const cases = [
  {
    name: "Button (schema) — basic structure",
    input: {
      schema: {
        component: "Button",
        props: {
          variant: {
            type: "enum",
            values: ["default", "destructive", "outline", "secondary", "ghost", "link"],
            default: "default",
          },
          size: {
            type: "enum",
            values: ["default", "sm", "lg", "icon"],
            default: "default",
          },
          disabled: { type: "boolean", default: false },
        },
      },
    },
    traits: [
      "# Button",
      "## When to use",
      "## Do's and don'ts",
      "## Accessibility",
      "aria-label",
    ],
    antitraits: [
      "—",         // em-dash banned
      "should",    // modal verb banned
      " e.g.",     // latin abbreviation banned
      " i.e.",     // latin abbreviation banned
      "Click here",
    ],
  },
  {
    name: "Button (schema) — positive framing",
    input: {
      schema: {
        component: "Button",
        props: {
          variant: {
            type: "enum",
            values: ["default", "destructive", "outline"],
            default: "default",
          },
        },
      },
    },
    traits: [
      "**Do**", // Do section comes before Don't
    ],
    antitraits: [],
    customCheck: (output) => {
      const doIndex = output.indexOf("**Do**");
      const dontIndex = output.indexOf("**Don't**");
      if (doIndex === -1) return { pass: false, reason: "Missing **Do** section" };
      if (dontIndex !== -1 && dontIndex < doIndex)
        return { pass: false, reason: "**Don't** appears before **Do** — positive framing violated" };
      return { pass: true };
    },
  },
  {
    name: "Dialog (fetch) — accessibility depth",
    input: { component: "dialog", sources: ["shadcn", "radix"] },
    traits: [
      "focus",
      "Escape",
      "aria-",
    ],
    antitraits: [
      "—",
      " may ",
    ],
  },
  {
    name: "Badge (schema) — omits irrelevant sections",
    input: {
      schema: {
        component: "Badge",
        props: {
          variant: {
            type: "enum",
            values: ["default", "secondary", "destructive", "outline"],
            default: "default",
          },
        },
        behavior: { nonInteractive: true },
      },
    },
    traits: [
      "# Badge",
    ],
    antitraits: [
      "## Placement and layout", // Badge doesn't need placement guidance
      "## Editorial guidelines",  // Badge has minimal text content
    ],
  },
  {
    name: "Output budget — sentence length",
    input: {
      schema: {
        component: "Switch",
        props: {
          checked: { type: "boolean", default: false },
          disabled: { type: "boolean", default: false },
        },
      },
    },
    traits: [
      "# Switch",
      "## When to use",
    ],
    antitraits: [],
    customCheck: (output) => {
      // Check that the opening line after "# Switch" is one sentence
      const match = output.match(/# Switch\n\n(.+?)(\n|$)/);
      if (!match) return { pass: false, reason: "Missing opening line after heading" };
      const opening = match[1];
      const sentences = opening.split(/\.\s/).filter(Boolean);
      if (sentences.length > 2)
        return { pass: false, reason: `Opening has ${sentences.length} sentences, expected 1-2` };
      return { pass: true };
    },
  },
  {
    name: "Style guide — no passive voice",
    input: {
      schema: {
        component: "Input",
        props: {
          placeholder: { type: "string" },
          disabled: { type: "boolean", default: false },
          required: { type: "boolean", default: false },
        },
      },
    },
    traits: [
      "# Input",
      "label",
    ],
    antitraits: [
      "is displayed",
      "is rendered",
      "is shown",
      "are displayed",
      "are rendered",
      "can be seen",
    ],
  },
];
