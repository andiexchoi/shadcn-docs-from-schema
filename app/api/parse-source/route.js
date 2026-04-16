import { NextResponse } from "next/server";
import { parseComponentSource } from "@/src/parseComponentSource.js";

export async function POST(request) {
  const { source } = await request.json();

  if (!source || typeof source !== "string") {
    return NextResponse.json(
      { error: "Provide component source code as a string." },
      { status: 400 }
    );
  }

  try {
    const schema = parseComponentSource(source);
    if (!schema.component && !schema.props) {
      return NextResponse.json(
        { error: "Could not extract component name or props from the source. Check that the source exports a React component with typed props." },
        { status: 422 }
      );
    }
    return NextResponse.json({ schema });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to parse source." },
      { status: 500 }
    );
  }
}
