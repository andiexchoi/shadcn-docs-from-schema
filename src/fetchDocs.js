// Fetches raw component documentation from public GitHub sources.
// Each source returns the raw MDX content or null if the component is not found.

const SOURCES = {
  shadcn: (name) =>
    `https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/content/docs/components/${name}.mdx`,
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
      const url = SOURCES[source]?.(slug);
      if (!url) return null;
      const content = await fetchSource(url);
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
