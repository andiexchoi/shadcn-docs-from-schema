# Use this for your own team

Recipe for adapting this tool to document your team's component library instead of (or alongside) shadcn/ui. The tool was built shadcn-first; the steps below are what to touch to retarget it.

## What's coupled to what

The shadcn-specific bits live in five files. Everything else is library-agnostic and works without changes.

| File | What's in it |
|---|---|
| `src/fetchDocs.js` | URL templates for fetching raw MDX from upstream repos (the `SOURCES` registry plus a default in the function signature). |
| `src/shadcn-components.js` | The component registry shown in the search/autocomplete. Misnamed; the file's actual job is "list of components your fork supports." |
| `src/examples/index.js` | Example schemas pre-loaded in the Custom Schema dropdown. |
| `app/page.jsx` | UI strings: source-selection labels, the pitch paragraph, default selected sources. |
| `src/generate.js` and `src/batch.js` | Caller-side defaults for which sources to fetch from. |

The `src/semantic/` directory cites Radix in its evidence files, but those are *content* (accessibility excerpts), not configuration. Keep them, replace them with your own evidence, or remove them — the prompt handles missing evidence by omitting the corresponding sections.

What you do **not** need to touch: `src/prompt.js`, `src/style-guide.js`, `src/markdown-to-compact.js`, `src/agent-context-formats.js`, `src/parseComponentSource.js`, all of `src/platform/` (Apple HIG and Material Design — library-agnostic).

## Recipe

### 1. Fork, clone, install

```bash
git clone https://github.com/<your-repo>/shadcn-docs-from-schema your-fork
cd your-fork
git checkout -b customize
npm install
echo "ANTHROPIC_API_KEY=sk-..." > .env.local
```

### 2. Decide which input modes you need

- **Fetch from a repo** (live MDX fetch from a GitHub URL). Requires step 3.
- **Paste a JSON schema** (Custom Schema mode). Works without code changes; you can hide the fetch UI if you only want this mode.
- **Paste TSX source** (Paste Source mode). The parser supports interfaces, type aliases, `cva` variants, and `forwardRef` patterns. Works without code changes.

If you don't need live fetch, skip step 3 and the source-default updates in step 7.

### 3. Add your library as a fetch source

Edit `src/fetchDocs.js`. Add an entry to the `SOURCES` object with your URL pattern:

```js
const SOURCES = {
  // ...existing entries you may want to remove...
  yourlib: (name) =>
    `https://raw.githubusercontent.com/your-team/your-ui/main/docs/components/${name}.mdx`,
};
```

The function takes a slug (kebab-case) and returns a URL that fetches raw MDX. If multiple sources match a given component, the results are combined.

> **Warning:** the function signature near the bottom of the same file (`fetchComponentDocs(componentName, sources = ["shadcn", "radix"])`) also has a default sources list. Update it when you do step 7.

### 4. Replace the components list

Edit `src/shadcn-components.js`. Despite the filename, this file's job is "components your fork supports." It exports:

- `SHADCN_COMPONENTS` — an array of `{ display, slug }` objects (the autocomplete needs both fields).
- `normalize()` — internal helper for fuzzy matching.
- `searchComponents(query)` — used by the UI's autocomplete.

Replace the array. Keep `normalize()` and `searchComponents()` as-is.

```js
export const SHADCN_COMPONENTS = [
  { display: "YourComponent", slug: "your-component" },
  // ...
];
```

> **Warning:** if you replace the file with just an array (without `searchComponents`), the UI breaks at runtime — the autocomplete consumes the function, not the array directly. The export contract isn't documented anywhere except the consumer.
>
> **Warning:** the file is *named* `shadcn-components.js` and exports a constant named `SHADCN_COMPONENTS`. Renaming either requires updating `app/page.jsx`'s import. We've left the misnomer to keep the fork minimal.

### 5. Replace examples

Edit `src/examples/index.js`. Each example is `{ name, schema }`:

```js
export const examples = [
  {
    name: "YourComponent",
    schema: {
      component: "YourComponent",
      props: { /* ... */ },
    },
  },
];
```

> **Warning:** if your schema has short non-standard enum values (like `info`, `danger`, `sm`) that aren't standard accessibility vocabulary, add a `description` field on the prop that names the literal values in prose. The model will otherwise paraphrase them — see the main README's Known Limitations for the workaround pattern.

### 6. Update UI strings

Find every shadcn reference in `app/page.jsx`:

```bash
grep -n -i "shadcn\|radix" app/page.jsx
```

Update each:

- **`SOURCES` constant** near the top — replace with your library's entry: `{ id: "yourlib", label: "Your UI" }`. The `id` must match the source key you registered in step 3.
- **Default `selectedSources` state** — `useState(["yourlib"])`.
- **Pitch paragraph** — replace shadcn mentions with your library or generic language.

> **Warning:** the pitch paragraph in `app/page.jsx` may have drifted from the README's pitch. They're stored separately. Sync both, or pick whichever you prefer and update the other.

### 7. Update default fetch sources

The default sources list lives in **five places**. Update each to your library's source key:

- `src/fetchDocs.js` — the `fetchComponentDocs` function signature default.
- `src/generate.js` — the `generateFromComponent` caller default (`sources || [...]`).
- `src/batch.js` — the batch CLI's hardcoded source list.
- `app/page.jsx` — the UI default (`useState([...])`, covered in step 6).
- `app/page.jsx` — the `SOURCES` registry (covered in step 6).

> **Warning:** there is no single `DEFAULT_SOURCES` constant. Forgetting any of these five leaves a code path that still tries to fetch from shadcn upstream.

### 8. Run and verify

```bash
npm run dev
```

Open `http://localhost:3000`. Verify each input mode:

1. **Search/autocomplete**: type your component names, see them in the dropdown.
2. **Fetch from docs**: pick a component, submit. If your URL pattern is wrong, the UI shows "No documentation found for *Component*." Debug by checking `src/fetchDocs.js` — the error doesn't name sources tried or print the URL it hit.
3. **Custom schema**: pick from the dropdown, generate. First generation takes 10–20 seconds with no progress indicator.
4. **Paste TSX**: paste a component file, see the schema get extracted, generate.

> **Warning:** the batch CLI (`node src/batch.js --components ...`) only works with the live-fetch path. There's no "batch from schema" mode. If your fork uses paste-only, the batch CLI doesn't apply.

## Known limitations specific to forking

- **Five places hold the default fetch source.** A `DEFAULT_SOURCES` constant would centralize this; refactor noted in `What's next`.
- **The components-list file is misnamed.** `src/shadcn-components.js` and `SHADCN_COMPONENTS` survive renaming.
- **The UI pitch can drift from the README.** Two separate strings, no shared source.
- **No progress indicator during generation.** Generations take 10–20 seconds with no UI feedback.
- **The "No documentation found" error doesn't help debug the URL pattern.** It names the component but not the sources tried or the URLs hit.
- **The `searchComponents` export contract isn't documented.** Replacing `src/shadcn-components.js` with just an array breaks the autocomplete at runtime.

For broader limitations (model paraphrasing of unusual enum values, editorial threshold fabrication), see the main README's [Known Limitations](README.md#known-limitations).
