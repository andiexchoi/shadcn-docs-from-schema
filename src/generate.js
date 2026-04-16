import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt, buildPromptFromDocs } from "./prompt.js";
import { fetchComponentDocs } from "./fetchDocs.js";
import { markdownToCompact } from "./markdown-to-compact.js";

export async function generateFromComponent(componentName, sources, options = {}) {
  const docs = await fetchComponentDocs(componentName, sources || ["shadcn", "radix"]);
  if (!docs.found) {
    throw new Error(`No documentation found for "${componentName}".`);
  }
  const prompt = buildPromptFromDocs(componentName, docs.content);
  return callClaude(prompt, options);
}

export async function generateFromSchema(schema, options = {}) {
  const prompt = buildPrompt(schema);
  return callClaude(prompt, options);
}

async function callClaude(prompt, options = {}) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const markdown = message.content.map((c) => c.text || "").join("");
  const inputTokens = message.usage?.input_tokens || 0;
  const outputTokens = message.usage?.output_tokens || 0;

  const result = { markdown, inputTokens, outputTokens };

  if (options.compact || options.format === "compact" || options.format === "both") {
    result.compact = markdownToCompact(markdown);
  }

  return result;
}
