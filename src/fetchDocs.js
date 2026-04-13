// Fetches raw component documentation from public GitHub sources.
// Each source returns the raw MDX content or null if the component is not found.

// shadcn restructured their repo in v4: components now live under apps/v4/content/docs/components/
// with two subdirectories: base/ (shadcn-authored) and radix/ (Radix UI wrappers).
// We try base/ first, then radix/ as fallback, and combine if both exist.
const SOURCES = {
  shadcn: [
    (name) =>
      `https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/components/base/${name}.mdx`,
    (name) =>
      `https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/components/radix/${name}.mdx`,
  ],
  radix: (name) =>
    `https://raw.githubusercontent.com/radix-ui/website/main/data/primitives/docs/components/${name}/${name}.mdx`,
  baseui: (name) =>
    `https://raw.githubusercontent.com/mui/base-ui/master/docs/data/components/${name}/${name}.mdx`,
};

async function fetchSource(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    // Treat very short responses as misses (redirect pages, empty files)
    return text.length > 100 ? text : null;
  } catch {
    return null;
  }
}

export async function fetchComponentDocs(componentName, sources = ["shadcn", "radix"]) {
  const slug = componentName.toLowerCase().trim().replace(/\s+/g, "-");

  const results = await Promise.all(
    sources.map(async (source) => {
      const sourceEntry = SOURCES[source];
      if (!sourceEntry) return null;

      // shadcn uses an array of URL-builder functions (base/ and radix/ subdirs)
      if (Array.isArray(sourceEntry)) {
        const parts = await Promise.all(sourceEntry.map((fn) => fetchSource(fn(slug))));
        const combined = parts.filter(Boolean).join("\n\n");
        return combined ? { source, content: combined } : null;
      }

      const content = await fetchSource(sourceEntry(slug));
      return content ? { source, content } : null;
    })
  );

  const found = results.filter(Boolean);

  if (found.length === 0) {
    return { found: false, slug, content: null };
  }

  const combined = found
    .map(({ source, content }) => `## Source: ${source}\n\n${content}`)
    .join("\n\n---\n\n");

  return { found: true, slug, sources: found.map((f) => f.source), content: combined };
}
