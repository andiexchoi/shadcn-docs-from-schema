import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt, buildPromptFromDocs } from "@/src/prompt.js";
import { fetchComponentDocs } from "@/src/fetchDocs.js";

export async function POST(request) {
  const { schema, component, sources } = await request.json();

  if (!schema && !component) {
    return NextResponse.json(
      { error: "Provide either a component name or a JSON schema." },
      { status: 400 }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let prompt;

  if (component) {
    const docs = await fetchComponentDocs(component, sources || ["shadcn", "radix"]);
    if (!docs.found) {
      return NextResponse.json(
        {
          error: `No documentation found for "${component}" in the selected sources. Check the component name and try again.`,
        },
        { status: 404 }
      );
    }
    prompt = buildPromptFromDocs(component, docs.content);
  } else {
    let parsed;
    try {
      parsed = typeof schema === "string" ? JSON.parse(schema) : schema;
    } catch {
      return NextResponse.json({ error: "Invalid JSON schema." }, { status: 400 });
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
    return NextResponse.json({ markdown: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Generation failed." },
      { status: 500 }
    );
  }
}
