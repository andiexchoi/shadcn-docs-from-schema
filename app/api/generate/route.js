import { NextResponse } from "next/server";
import { generateFromComponent, generateFromSchema } from "@/src/generate.js";
import { markdownToCompact } from "@/src/markdown-to-compact.js";
import { toCLAUDEmd, toAgentsMd, toLlmsTxt } from "@/src/agent-context-formats.js";

export async function POST(request) {
  const { schema, component, sources, format, contextFormat } = await request.json();

  if (!schema && !component) {
    return NextResponse.json(
      { error: "Provide either a component name or a JSON schema." },
      { status: 400 }
    );
  }

  try {
    let result;

    if (component) {
      result = await generateFromComponent(component, sources, { format });
    } else {
      let parsed;
      try {
        parsed = typeof schema === "string" ? JSON.parse(schema) : schema;
      } catch {
        return NextResponse.json({ error: "Invalid JSON schema." }, { status: 400 });
      }
      result = await generateFromSchema(parsed, { format });
    }

    const compact = result.compact || markdownToCompact(result.markdown);
    const response = { markdown: result.markdown };

    if (format === "compact" || format === "both") {
      response.compact = compact;
    }

    if (contextFormat) {
      const componentName = component || schema?.component || "Component";
      const formatters = { claude: toCLAUDEmd, agents: toAgentsMd, llms: toLlmsTxt };
      const fn = formatters[contextFormat];
      if (fn) response.contextFile = fn(componentName, compact);
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    const status = err.message?.includes("No documentation found") ? 404 : 500;
    return NextResponse.json(
      { error: err.message || "Generation failed." },
      { status }
    );
  }
}
