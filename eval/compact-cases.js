// Deterministic tests for the markdown-to-compact converter.
// No API calls — hardcoded input/output.
// Usage: node eval/compact-cases.js

import { markdownToCompact, parseMarkdownSections } from "../src/markdown-to-compact.js";

const cases = [
  {
    name: "Extracts component name and summary",
    input: `# Dialog\n\nA window overlaid on the primary window.\n\n## When to use\n\nUse Dialog for confirmations.`,
    check: (sections) =>
      sections.component === "Dialog" &&
      sections.summary === "A window overlaid on the primary window.",
  },
  {
    name: "Splits use_when into sentences",
    input: `# Button\n\nTriggers an action.\n\n## When to use\n\nUse Button for form submissions. Use Button for dialog confirmations.`,
    check: (sections) =>
      Array.isArray(sections.use_when) &&
      sections.use_when.length === 2 &&
      sections.use_when[0].includes("form submissions"),
  },
  {
    name: "Extracts do and dont lists",
    input: `# Alert\n\nDisplays a message.\n\n## Do's and don'ts\n\n**Do**\n- Use for important messages\n- Keep text short\n\n**Don't**\n- Don't use for navigation`,
    check: (sections) =>
      sections.do?.length === 2 &&
      sections.dont?.length === 1 &&
      sections.dont[0].includes("navigation"),
  },
  {
    name: "Collapses anatomy to string",
    input: `# Card\n\nA container.\n\n## Anatomy\n\nThe Card has a header, body, and footer. Each section is optional.`,
    check: (sections) =>
      typeof sections.anatomy === "string" &&
      sections.anatomy.includes("header, body, and footer"),
  },
  {
    name: "Extracts bullet lists for contracts",
    input: `# Dialog\n\nOverlay.\n\n## Component contracts\n\n- DialogContent requires DialogTitle\n- DialogDescription is optional`,
    check: (sections) =>
      Array.isArray(sections.contracts) && sections.contracts.length === 2,
  },
  {
    name: "Omits empty sections",
    input: `# Badge\n\nA label.\n\n## Variants and options\n\n**default**: Standard appearance.`,
    check: (sections) =>
      !sections.keyboard &&
      !sections.aria &&
      !sections.a11y &&
      !sections.mistakes,
  },
  {
    name: "Strips markdown formatting from content",
    input: `# Button\n\nTriggers an action.\n\n## Anatomy\n\nThe **Button** contains a \`label\` and optional [icon](http://example.com).`,
    check: (sections) =>
      !sections.anatomy.includes("**") &&
      !sections.anatomy.includes("`") &&
      !sections.anatomy.includes("["),
  },
  {
    name: "Extracts keyboard interactions",
    input: `# Dialog\n\nOverlay.\n\n## Keyboard interactions\n\n- Escape: Close the dialog\n- Tab: Move focus forward\n- Shift+Tab: Move focus backward`,
    check: (sections) =>
      Array.isArray(sections.keyboard) &&
      sections.keyboard.length === 3 &&
      sections.keyboard[0].includes("Escape"),
  },
  {
    name: "Output is valid YAML-like structure",
    input: `# Switch\n\nToggles a setting.\n\n## When to use\n\nUse Switch for binary settings.\n\n## Keyboard interactions\n\n- Space: Toggle state`,
    check: (_sections, compact) => {
      const lines = compact.split("\n").filter(Boolean);
      return (
        lines[0].startsWith("component:") &&
        lines[1].startsWith("summary:") &&
        compact.includes("keyboard:")
      );
    },
  },
  {
    name: "Extracts ARIA requirements",
    input: `# Tabs\n\nOrganizes content.\n\n## ARIA requirements\n\n- role=tablist on the tab container\n- aria-selected=true on the active tab`,
    check: (sections) =>
      Array.isArray(sections.aria) &&
      sections.aria.length === 2 &&
      sections.aria[0].includes("tablist"),
  },
];

function runCases() {
  let passed = 0;
  let failed = 0;

  console.log(`\nCompact converter — ${cases.length} cases\n${"=".repeat(40)}`);

  for (const c of cases) {
    const sections = parseMarkdownSections(c.input);
    const compact = markdownToCompact(c.input);
    const ok = c.check(sections, compact);

    if (ok) {
      passed++;
      console.log(`  PASS  ${c.name}`);
    } else {
      failed++;
      console.log(`  FAIL  ${c.name}`);
      console.log(`        sections: ${JSON.stringify(sections)}`);
    }
  }

  console.log(`\n${"=".repeat(40)}`);
  console.log(`${passed}/${cases.length} passed — ${failed === 0 ? "PASS" : "FAIL"}`);

  if (failed > 0) process.exit(1);
}

runCases();
