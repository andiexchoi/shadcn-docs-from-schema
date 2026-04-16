import { examples } from "../src/examples/index.js";
import { markdownToCompact } from "../src/markdown-to-compact.js";

// Each case tests a specific prompt behavior, not a component.
// traits: strings or regex patterns the output MUST contain (case-insensitive substring match).
// antitraits: strings or regex patterns the output must NOT contain.

const dialogSchema = examples.find((e) => e.name === "Dialog").schema;
const badgeSchema = examples.find((e) => e.name === "Badge").schema;
const selectSchema = examples.find((e) => e.name === "Select").schema;
const tabsSchema = examples.find((e) => e.name === "Tabs").schema;

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
      "## Keyboard interactions",
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
      "## Component contracts",
      "DialogTitle",
      "## Keyboard interactions",
      "## ARIA requirements",
      "aria-labelledby",
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
      "## Variants and options",
    ],
    antitraits: [
      "## Keyboard interactions", // Badge is non-interactive
      "## Component contracts",   // Badge is a single element
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
  {
    name: "Dialog (schema) — component contracts present",
    input: { schema: dialogSchema },
    traits: [
      "## Component contracts",
      "DialogTitle",
      "DialogContent",
    ],
    antitraits: [
      "—",
      "should",
    ],
  },
  {
    name: "Badge (schema) — non-interactive sections omitted",
    input: { schema: badgeSchema },
    traits: [
      "# Badge",
    ],
    antitraits: [
      "## Keyboard interactions",
      "## ARIA requirements",
      "## Component contracts",
    ],
  },
  {
    name: "Select (schema) — keyboard interactions completeness",
    input: { schema: selectSchema },
    traits: [
      "## Keyboard interactions",
      "Arrow",
      "Escape",
      "Enter",
    ],
    antitraits: [
      "—",
    ],
  },
  {
    name: "Dialog (schema) — common mistakes section",
    input: { schema: dialogSchema },
    traits: [
      "## Common mistakes",
      "DialogTitle",
    ],
    antitraits: [],
    customCheck: (output) => {
      const section = output.match(/## Common mistakes\n\n([\s\S]*?)(?:\n## |\n---|$)/);
      if (!section) return { pass: false, reason: "Common mistakes section not found" };
      const bullets = section[1].split("\n").filter((l) => l.trim().startsWith("-") || l.trim().startsWith("*") || l.trim().startsWith("**"));
      if (bullets.length < 2)
        return { pass: false, reason: `Common mistakes has ${bullets.length} items, expected at least 2` };
      return { pass: true };
    },
  },
  {
    name: "Tabs (schema) — ARIA specificity",
    input: { schema: tabsSchema },
    traits: [
      "## ARIA requirements",
      "aria-selected",
      "tablist",
      "tabpanel",
    ],
    antitraits: [
      "WCAG",
    ],
  },
  {
    name: "Switch (schema) — old audience framing gone",
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
    ],
    antitraits: [
      "product managers",
      "designers who need to know",
      "not how it is built",
    ],
  },
  {
    name: "Dialog (schema) — compact output has agent-critical keys",
    input: { schema: dialogSchema },
    traits: [
      "## Component contracts",
      "## Keyboard interactions",
      "## ARIA requirements",
      "## Common mistakes",
    ],
    antitraits: [],
    customCheck: (output) => {
      const compact = markdownToCompact(output);
      const requiredKeys = ["component:", "keyboard:", "aria:", "contracts:", "mistakes:"];
      const missing = requiredKeys.filter((k) => !compact.includes(k));
      if (missing.length > 0) {
        return { pass: false, reason: `Compact output missing keys: ${missing.join(", ")}` };
      }
      return { pass: true };
    },
  },
  {
    name: "Custom Button (schema) — divergent props in output",
    input: {
      schema: examples.find((e) => e.name === "Custom Button").schema,
    },
    traits: [
      "# Button",
      "loading",
      "critical",
    ],
    antitraits: [],
    customCheck: (output) => {
      const hasLoadingText = output.toLowerCase().includes("loadingtext") || output.toLowerCase().includes("loading text");
      if (!hasLoadingText) {
        return { pass: false, reason: "Output does not mention loadingText prop" };
      }
      const variantRef = /`destructive`|variant="destructive"|variant:\s*destructive\b|"destructive"/.test(output);
      if (variantRef) {
        return { pass: false, reason: "Output references destructive as a variant value (should be critical)" };
      }
      return { pass: true };
    },
  },
];
