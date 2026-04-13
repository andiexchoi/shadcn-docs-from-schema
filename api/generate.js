import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt } from "../src/prompt.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { schema } = req.body;
  if (!schema) {
    return res.status(400).json({ error: "schema is required" });
  }

  let parsed;
  try {
    parsed = typeof schema === "string" ? JSON.parse(schema) : schema;
  } catch {
    return res.status(400).json({ error: "Invalid JSON schema" });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: buildPrompt(parsed) }],
    });

    const text = message.content.map((c) => c.text || "").join("");
    res.json({ markdown: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Generation failed." });
  }
}
