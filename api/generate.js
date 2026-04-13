import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt, buildPromptFromDocs } from "../src/prompt.js";
import { fetchComponentDocs } from "../src/fetchDocs.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { schema, component, sources } = req.body;

  if (!schema && !component) {
    return res.status(400).json({ error: "Provide either a component name or a JSON schema." });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let prompt;

  if (component) {
    const docs = await fetchComponentDocs(component, sources || ["shadcn", "radix"]);
    if (!docs.found) {
      return res.status(404).json({
        error: `No documentation found for "${component}" in the selected sources. Check the component name and try again.`,
      });
    }
    prompt = buildPromptFromDocs(component, docs.content);
  } else {
    let parsed;
    try {
      parsed = typeof schema === "string" ? JSON.parse(schema) : schema;
    } catch {
      return res.status(400).json({ error: "Invalid JSON schema." });
    }
    prompt = buildPrompt(parsed);
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.map((c) => c.text || "").join("");
    res.json({ markdown: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Generation failed." });
  }
}
