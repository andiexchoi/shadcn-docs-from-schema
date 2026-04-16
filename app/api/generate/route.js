import { NextResponse } from "next/server";
import { generateFromComponent, generateFromSchema } from "@/src/generate.js";
import { markdownToCompact } from "@/src/markdown-to-compact.js";

export async function POST(request) {
  const { schema, component, sources, format } = await request.json();

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

    const response = { markdown: result.markdown };
    if (result.compact) {
      response.compact = result.compact;
    }
    if (format === "compact" || format === "both") {
      response.compact = response.compact || markdownToCompact(result.markdown);
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
