import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { fetchComponentDocs } from "../src/fetchDocs.js";
import { buildPromptFromDocs, buildRawRefsPrompt } from "../src/prompt.js";

const COMPONENT = "dialog";
const MODEL = "claude-sonnet-4-6";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "../evaluation/dialog");

async function callClaude(prompt) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });
  return message.content.map((c) => c.text || "").join("");
}

async function main() {
  const docs = await fetchComponentDocs(COMPONENT, ["shadcn", "radix"]);
  if (!docs.found) throw new Error(`No docs found for ${COMPONENT}`);

  const v1Prompt = buildRawRefsPrompt(COMPONENT, docs.content);
  const v2Prompt = buildPromptFromDocs(COMPONENT, docs.content);

  console.log("Generating V1 (external refs only)...");
  const v1 = await callClaude(v1Prompt);
  console.log("Generating V2 (full pipeline)...");
  const v2 = await callClaude(v2Prompt);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(resolve(OUT_DIR, "v1-external-only.md"), v1);
  await writeFile(resolve(OUT_DIR, "v2-full.md"), v2);
  await writeFile(
    resolve(OUT_DIR, "v1-external-only.prompt.txt"),
    v1Prompt,
  );
  await writeFile(resolve(OUT_DIR, "v2-full.prompt.txt"), v2Prompt);

  console.log(`Wrote outputs to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
