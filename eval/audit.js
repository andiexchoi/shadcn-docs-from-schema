// Assisted-reading audit runner.
// Generates a component doc, fetches its source, pre-extracts claims and runs
// style-rule substring scans, then writes a single audit file with checklists
// the reader fills in by hand.
//
// Usage:
//   ANTHROPIC_API_KEY=sk-... node eval/audit.js dialog
//   ANTHROPIC_API_KEY=sk-... node eval/audit.js --example "Custom Button"
//   ANTHROPIC_API_KEY=sk-... node eval/audit.js --schema path/to/schema.json
//
// Audit files land in evaluation/audits/<slug>-<YYYY-MM-DD>.md.

import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPrompt, buildPromptFromDocs } from "../src/prompt.js";
import { fetchComponentDocs } from "../src/fetchDocs.js";
import { examples } from "../src/examples/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const AUDIT_DIR = path.join(PROJECT_ROOT, "evaluation", "audits");
const MODEL = "claude-sonnet-4-6";

function parseArgs(argv) {
  const args = { mode: null, value: null, sources: ["shadcn", "radix"] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--example" && argv[i + 1]) {
      args.mode = "example";
      args.value = argv[++i];
    } else if (a === "--schema" && argv[i + 1]) {
      args.mode = "schema";
      args.value = argv[++i];
    } else if (a === "--sources" && argv[i + 1]) {
      args.sources = argv[++i].split(",");
    } else if (!a.startsWith("--") && !args.mode) {
      args.mode = "fetch";
      args.value = a;
    }
  }
  return args;
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateDoc(prompt) {
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });
  return message.content.map((c) => c.text || "").join("");
}

function slugify(s) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function todayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function uniqueAuditPath(slug) {
  if (!existsSync(AUDIT_DIR)) mkdirSync(AUDIT_DIR, { recursive: true });
  let n = 0;
  while (true) {
    const suffix = n === 0 ? "" : `-${n + 1}`;
    const filename = `${slug}-${todayDate()}${suffix}.md`;
    const full = path.join(AUDIT_DIR, filename);
    if (!existsSync(full)) return full;
    n++;
  }
}

function extractClaims(doc) {
  const propsAndValues = new Set();
  const ariaAttributes = new Set();
  const keyboardKeys = new Set();
  const subComponents = new Set();

  const backticked = doc.match(/`([a-zA-Z][a-zA-Z0-9_-]*)`/g) || [];
  for (const tok of backticked) {
    const t = tok.slice(1, -1);
    if (t.startsWith("aria-")) ariaAttributes.add(t);
    else if (/^[a-z]/.test(t)) propsAndValues.add(t);
    else if (/^[A-Z][a-zA-Z]+$/.test(t)) subComponents.add(t);
  }

  // PascalCase compound words in prose (DialogContent, DialogTitle).
  const pascalCompound = doc.match(/\b([A-Z][a-z]+){2,}\b/g) || [];
  for (const t of pascalCompound) subComponents.add(t);

  // Common keyboard keys and combos.
  const keyPattern = /\b(Escape|Enter|Tab|Space|Shift\+Tab|Shift\+Enter|Arrow(?:Up|Down|Left|Right)|Home|End|PageUp|PageDown|Backspace|Delete)\b/g;
  for (const k of doc.match(keyPattern) || []) keyboardKeys.add(k);

  // ARIA attributes in prose, not just backticked.
  for (const a of doc.match(/aria-[a-z]+/g) || []) ariaAttributes.add(a);

  return {
    propsAndValues: [...propsAndValues].sort(),
    ariaAttributes: [...ariaAttributes].sort(),
    keyboardKeys: [...keyboardKeys].sort(),
    subComponents: [...subComponents].sort(),
  };
}

function findOccurrences(doc, pattern) {
  const lines = doc.split("\n");
  const hits = [];
  lines.forEach((line, i) => {
    if (pattern.test(line)) hits.push({ line: i + 1, text: line.trim() });
  });
  return hits;
}

function styleRuleScans(doc) {
  return [
    { rule: "No em-dashes", pattern: /—/ },
    { rule: 'No "should"', pattern: /\bshould\b/i },
    { rule: 'No "may"', pattern: /\bmay\b/i },
    { rule: "No Latin abbreviations (i.e., e.g., etc.)", pattern: /\b(i\.e\.|e\.g\.|etc\.)/i },
    { rule: 'No "is/are displayed/rendered/shown"', pattern: /\b(is|are) (displayed|rendered|shown)\b/i },
    { rule: 'No "Click here"', pattern: /\bclick here\b/i },
    { rule: 'No "Note that" / "Please" / "You should"', pattern: /\b(Note that|Please|You should)\b/ },
  ].map(({ rule, pattern }) => ({ rule, hits: findOccurrences(doc, pattern) }));
}

function structuralChecks(doc) {
  const sections = (doc.match(/^## .+$/gm) || []).map((s) => s.replace(/^## /, ""));
  const titleMatch = doc.match(/^# (.+)$/m);
  const componentName = titleMatch ? titleMatch[1] : "(missing)";
  const doIdx = doc.indexOf("**Do**");
  const dontIdx = doc.indexOf("**Don't**");
  const altMatch = doc.match(/\*\*Use an alternative when:\*\*\n((?:- .+\n?)+)/);
  const altCount = altMatch ? altMatch[1].split("\n").filter((l) => l.trim().startsWith("-")).length : 0;
  const variantsBlock = doc.match(/## Variants and patterns\n\n([\s\S]*?)(?=\n## |\n---|$)/);
  const variantCount = variantsBlock ? (variantsBlock[1].match(/\*\*[^*]+\*\*/gm) || []).length : 0;
  const decisionsBlock = doc.match(/## Decisions to verify\n\n([\s\S]*?)(?=\n## |\n---|$)/);
  const decisionCount = decisionsBlock
    ? decisionsBlock[1].split("\n").filter((l) => l.trim().startsWith("-")).length
    : 0;

  return {
    componentName,
    sections,
    doBeforeDont: doIdx !== -1 && (dontIdx === -1 || doIdx < dontIdx),
    altCount,
    variantCount,
    decisionCount,
  };
}

function renderClaimRows(items) {
  if (items.length === 0) return "_(none extracted)_";
  return [
    "| Claim | Source line / file | Verdict | Notes |",
    "|---|---|---|---|",
    ...items.map((c) => `| \`${c}\` |  | ✓ / ✗ |  |`),
  ].join("\n");
}

function renderStyleScan(scans) {
  return scans
    .map(({ rule, hits }) => {
      const status = hits.length === 0 ? "✓ pass (no hits)" : `✗ ${hits.length} hit(s)`;
      const detail = hits.length === 0 ? "" : "\n" + hits.map((h) => `  - line ${h.line}: \`${h.text}\``).join("\n");
      return `- **${rule}**: ${status}${detail}`;
    })
    .join("\n");
}

function buildAuditFile({
  componentLabel,
  inputMode,
  generatedDoc,
  source,
  sourceFenceLang,
  sourceNote,
  claims,
  scans,
  structural,
}) {
  return `---
component: ${componentLabel}
date: ${todayDate()}
input_mode: ${inputMode}
model: ${MODEL}
---

# Audit: ${componentLabel}

Assisted-reading audit for one generation of the ${componentLabel} doc. Part 1 (Source fidelity) and Part 2 (Prompt conformance) are the checks defined in [\`docs/rubric.md\`](../../docs/rubric.md). The script generated the doc, fetched the source, ran the substring scans, and pre-extracted claim rows. Verdicts and notes are filled in by hand.

---

## Generated doc

\`\`\`markdown
${generatedDoc}
\`\`\`

---

## Source

${sourceNote}

\`\`\`${sourceFenceLang}
${source}
\`\`\`

---

## Part 1 — Source fidelity

Every factual claim in the generated doc traces back to a line in the source. Verify each row by finding the matching line in the source above (or noting that no match exists).

### Props, variants, and option values mentioned

${renderClaimRows(claims.propsAndValues)}

### ARIA attributes mentioned

${renderClaimRows(claims.ariaAttributes)}

### Keyboard keys mentioned

${renderClaimRows(claims.keyboardKeys)}

### Sub-components mentioned

${renderClaimRows(claims.subComponents)}

### Other claims (add rows for anything the extractor missed)

| Claim | Source line / file | Verdict | Notes |
|---|---|---|---|
|  |  | ✓ / ✗ |  |

---

## Part 2 — Prompt conformance

### Style rules (auto-scanned)

${renderStyleScan(scans)}

### Structural rules (auto-scanned)

- **Component heading present**: ${structural.componentName.toLowerCase() === componentLabel.toLowerCase() ? "✓" : "✗"} (got \`# ${structural.componentName}\`)
- **Sections present** (${structural.sections.length}):
${structural.sections.length ? structural.sections.map((s) => `  - ${s}`).join("\n") : "  - (none)"}
- **Do appears before Don't**: ${structural.doBeforeDont ? "✓" : "✗"}
- **Alternatives listed**: ${structural.altCount} ${structural.altCount >= 2 ? "✓" : "✗ (need at least 2)"}
- **Variants listed**: ${structural.variantCount} ${structural.variantCount >= 3 ? "✓" : "✗ (need at least 3)"}
- **Decisions to verify**: ${structural.decisionCount} ${structural.decisionCount >= 4 ? "✓" : "✗ (need at least 4)"}

### Section omission rules (verified by hand)

For each section that *is* present, was it required for this component? For each *expected* section that's absent, was the omission justified by the rules in \`src/prompt.js\`?

| Section | Present? | Should be present? | Verdict |
|---|---|---|---|
| When to use | | | |
| Do's and don'ts | | | |
| Anatomy | | | |
| Component contracts | | | |
| Variants and patterns | | | |
| Placement and layout | | | |
| Editorial guidelines | | | |
| Keyboard interactions | | | |
| ARIA requirements | | | |
| Accessibility | | | |
| Common mistakes | | | |
| Decisions to verify | | | |
| Platform compliance checklist | | | |

### Editorial rules (read by hand)

- **Every guideline carries a "why"**: ✓ / ✗ — Notes:
- **Default/override form used in Do's, Editorial, Variants, Placement, Common mistakes**: ✓ / ✗ — Notes:
- **Quantitative thresholds named where rules depend on quantity**: ✓ / ✗ — Notes:
- **Output budget per section respected (no sprawl past caps)**: ✓ / ✗ — Notes:

---

## Summary

- **Source fidelity verdict**:
- **Prompt conformance verdict**:
- **Other observations**:
`;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.mode) {
    console.error("Usage: node eval/audit.js <component> | --example <name> | --schema <path>");
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set.");
    process.exit(1);
  }

  let prompt;
  let source;
  let sourceFenceLang;
  let sourceNote;
  let inputMode;
  let slug;
  let componentLabel;

  if (args.mode === "fetch") {
    componentLabel = args.value;
    slug = slugify(args.value);
    inputMode = `fetch (${args.sources.join(", ")})`;
    const docs = await fetchComponentDocs(args.value, args.sources);
    if (!docs.found) {
      console.error(`No docs found for "${args.value}"`);
      process.exit(1);
    }
    prompt = buildPromptFromDocs(args.value, docs.content);
    source = docs.content;
    sourceFenceLang = "mdx";
    sourceNote = `Fetched from ${docs.sources.join(" + ")}.`;
  } else if (args.mode === "example") {
    const ex = examples.find((e) => e.name === args.value);
    if (!ex) {
      console.error(`No example named "${args.value}". Available: ${examples.map((e) => e.name).join(", ")}`);
      process.exit(1);
    }
    componentLabel = ex.name;
    slug = slugify(ex.name);
    inputMode = "example schema";
    prompt = buildPrompt(ex.schema);
    source = JSON.stringify(ex.schema, null, 2);
    sourceFenceLang = "json";
    sourceNote = `Schema input from \`src/examples/index.js\` (\`${ex.name}\`).`;
  } else if (args.mode === "schema") {
    const raw = readFileSync(args.value, "utf8");
    const schema = JSON.parse(raw);
    componentLabel = schema.component || "Component";
    slug = slugify(componentLabel);
    inputMode = `schema file (${args.value})`;
    prompt = buildPrompt(schema);
    source = JSON.stringify(schema, null, 2);
    sourceFenceLang = "json";
    sourceNote = `Schema input from \`${args.value}\`.`;
  }

  console.log(`Generating ${componentLabel}...`);
  const generatedDoc = await generateDoc(prompt);
  console.log(`Got ${generatedDoc.length} chars.`);

  const claims = extractClaims(generatedDoc);
  const scans = styleRuleScans(generatedDoc);
  const structural = structuralChecks(generatedDoc);

  const auditPath = uniqueAuditPath(slug);
  const audit = buildAuditFile({
    componentLabel,
    inputMode,
    generatedDoc,
    source,
    sourceFenceLang,
    sourceNote,
    claims,
    scans,
    structural,
  });
  writeFileSync(auditPath, audit);

  const relPath = path.relative(PROJECT_ROOT, auditPath);
  console.log(`Wrote ${relPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
