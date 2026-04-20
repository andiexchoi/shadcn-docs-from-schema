// Regenerates the 10 per-component CLAUDE.md files using the framing-stripped
// prompt, writing them to eval/ab-experiment/claude-md-no-framing/<name>.md.
//
// Output matches the shape produced by the main cache-claude-md.js:
// the "# Component Library Reference" envelope around a single component's
// compact YAML block.

import Anthropic from "@anthropic-ai/sdk";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { COMPONENTS } from "../components.js";
import { fetchComponentDocs } from "../../../src/fetchDocs.js";
import { markdownToCompact } from "../../../src/markdown-to-compact.js";
import { combineCLAUDEmd } from "../../../src/agent-context-formats.js";
import { buildPromptFromDocsNoFraming } from "./prompt-no-framing.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "claude-md-no-framing");
const MODEL = "claude-sonnet-4-6";

mkdirSync(OUT_DIR, { recursive: true });

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const force = process.argv.includes("--force");

async function regenOne(componentName, batchName) {
  const outPath = join(OUT_DIR, `${batchName}.md`);
  if (existsSync(outPath) && !force) {
    console.log(`skip  ${batchName} — cached`);
    return;
  }
  console.log(`gen   ${batchName}...`);
  const docs = await fetchComponentDocs(batchName, ["shadcn", "radix"]);
  if (!docs.found) {
    console.error(`  no docs for ${batchName}`);
    return;
  }
  const prompt = buildPromptFromDocsNoFraming(batchName, docs.content);
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });
  const markdown = message.content.map((c) => c.text || "").join("");
  const compact = markdownToCompact(markdown);
  const wrapped = combineCLAUDEmd([{ name: batchName, compactYaml: compact }]);
  writeFileSync(outPath, wrapped);
  console.log(`  saved ${outPath} (${wrapped.length} chars, ${message.usage.input_tokens}→${message.usage.output_tokens} tokens)`);
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set.");
    process.exit(1);
  }
  const entries = Object.entries(COMPONENTS);
  for (const [name, cfg] of entries) {
    try {
      await regenOne(name, cfg.batchName);
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  FAIL: ${err.message}`);
    }
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
