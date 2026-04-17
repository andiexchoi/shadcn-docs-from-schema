"use client";

import { useState, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { examples } from "@/src/examples/index.js";
import { searchComponents } from "@/src/shadcn-components.js";
import { markdownToCompact } from "@/src/markdown-to-compact.js";
import { toCLAUDEmd, toAgentsMd, toLlmsTxt } from "@/src/agent-context-formats.js";

const SOURCES = [
  { id: "shadcn", label: "shadcn/ui" },
  { id: "radix", label: "Radix UI" },
  { id: "baseui", label: "Base UI" },
];

const EXPORT_FORMATS = [
  { id: "yaml", label: ".yaml", ext: "yaml" },
  { id: "claude", label: "CLAUDE.md", ext: "md" },
  { id: "agents", label: "AGENTS.md", ext: "md" },
  { id: "llms", label: "llms.txt", ext: "txt" },
];


export default function Home() {
  const [mode, setMode] = useState("fetch");
  const [componentName, setComponentName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [selectedSources, setSelectedSources] = useState(["shadcn", "radix"]);
  const inputRef = useRef(null);
  const [schemaInput, setSchemaInput] = useState(JSON.stringify(examples[0].schema, null, 2));
  const [sourceInput, setSourceInput] = useState("");
  const [parsedSchema, setParsedSchema] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("markdown");
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [copiedCompact, setCopiedCompact] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const compactOutput = useMemo(
    () => (output ? markdownToCompact(output) : ""),
    [output]
  );

  function estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }

  function getComponentNameForExport() {
    if (mode === "fetch") return componentName.trim() || "Component";
    if (parsedSchema?.component) return parsedSchema.component;
    try {
      const s = JSON.parse(schemaInput);
      return s.component || "Component";
    } catch {
      return "Component";
    }
  }

  function downloadFile(content, filename) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  }

  function handleExport(formatId) {
    const name = getComponentNameForExport();
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    if (formatId === "yaml") {
      downloadFile(compactOutput, `${slug}.yaml`);
    } else if (formatId === "claude") {
      downloadFile(toCLAUDEmd(name, compactOutput), `CLAUDE.md`);
    } else if (formatId === "agents") {
      downloadFile(toAgentsMd(name, compactOutput), `AGENTS.md`);
    } else if (formatId === "llms") {
      downloadFile(toLlmsTxt(name, compactOutput), `llms.txt`);
    }
  }

  function copyMarkdown() {
    navigator.clipboard.writeText(output).then(() => {
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    });
  }

  function copyPreviewText() {
    const el = document.querySelector(".output.preview");
    const text = el ? el.innerText : output;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPreview(true);
      setTimeout(() => setCopiedPreview(false), 2000);
    });
  }

  function copyCompact() {
    navigator.clipboard.writeText(compactOutput).then(() => {
      setCopiedCompact(true);
      setTimeout(() => setCopiedCompact(false), 2000);
    });
  }

  function toggleSource(id) {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function loadExample(ex) {
    setMode("schema");
    setSchemaInput(JSON.stringify(ex.schema, null, 2));
    setOutput("");
    setError("");
  }

  function handleComponentInput(e) {
    const val = e.target.value;
    setComponentName(val);
    setSuggestions(searchComponents(val));
    setActiveSuggestion(-1);
  }

  function selectSuggestion(item) {
    setComponentName(item.display);
    setSuggestions([]);
    setActiveSuggestion(-1);
    inputRef.current?.focus();
  }

  function handleInputKeyDown(e) {
    if (!suggestions.length) {
      if (e.key === "Enter") generate();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        selectSuggestion(suggestions[activeSuggestion]);
      } else {
        setSuggestions([]);
        generate();
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveSuggestion(-1);
    }
  }

  async function generate() {
    setLoading(true);
    setError("");
    setOutput("");
    setParsedSchema(null);

    let body;

    if (mode === "fetch") {
      if (!componentName.trim()) {
        setError("Enter a component name.");
        setLoading(false);
        return;
      }
      body = { component: componentName.trim(), sources: selectedSources };
    } else if (mode === "schema") {
      try {
        body = { schema: JSON.parse(schemaInput) };
      } catch {
        setError("Invalid JSON. Check your schema and try again.");
        setLoading(false);
        return;
      }
    } else if (mode === "source") {
      if (!sourceInput.trim()) {
        setError("Paste component source code.");
        setLoading(false);
        return;
      }
      try {
        const parseRes = await fetch("/api/parse-source", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: sourceInput }),
        });
        const parseData = await parseRes.json();
        if (parseData.error) {
          setError(parseData.error);
          setLoading(false);
          return;
        }
        setParsedSchema(parseData.schema);
        body = { schema: parseData.schema };
      } catch (err) {
        setError(err.message || "Failed to parse source.");
        setLoading(false);
        return;
      }
    }

    if (!body) return;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setOutput(data.markdown);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Component documentation for humans and AI agents</h1>
        <p className="subtitle">
          The documentation layer between your component library and everything that reads it. Generate readable markdown docs and structured agent context files (CLAUDE.md, AGENTS.md, llms.txt) from a JSON schema, a TSX file, or a live shadcn/ui component. One source of truth for the engineers, designers, and AI agents working on your design system.
        </p>
      </header>

      <main className="main">
        <div className="examples-bar">
          <span className="examples-label">Examples:</span>
          {examples.map((ex) => (
            <button
              key={ex.name}
              className="example-btn"
              onClick={() => loadExample(ex)}
            >
              {ex.name}
            </button>
          ))}
        </div>

        <div className="columns">
          <div className="column input-column">
            <div className="input-card">
              <div className="mode-tabs">
                <button
                  className={`mode-tab ${mode === "fetch" ? "active" : ""}`}
                  onClick={() => setMode("fetch")}
                >
                  Fetch from docs
                </button>
                <button
                  className={`mode-tab ${mode === "schema" ? "active" : ""}`}
                  onClick={() => setMode("schema")}
                >
                  Custom schema
                </button>
                <button
                  className={`mode-tab ${mode === "source" ? "active" : ""}`}
                  onClick={() => setMode("source")}
                >
                  Paste source
                </button>
              </div>

              <div className="input-body">
                {mode === "fetch" && (
                  <div className="fetch-mode">
                    <div className="autocomplete-wrap">
                      <input
                        ref={inputRef}
                        className="component-input"
                        type="text"
                        placeholder="Component name, e.g. Button, Dialog, Tabs"
                        value={componentName}
                        onChange={handleComponentInput}
                        onKeyDown={handleInputKeyDown}
                        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                        autoComplete="off"
                        aria-label="Component name"
                        aria-autocomplete="list"
                        aria-expanded={suggestions.length > 0}
                        role="combobox"
                      />
                      {suggestions.length > 0 && (
                        <ul className="suggestions" role="listbox" aria-label="Component suggestions">
                          {suggestions.map((item, i) => (
                            <li
                              key={item.slug}
                              className={`suggestion-item ${i === activeSuggestion ? "active" : ""}`}
                              onMouseDown={() => selectSuggestion(item)}
                              role="option"
                              aria-selected={i === activeSuggestion}
                            >
                              {item.display}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="source-row" role="group" aria-label="Documentation sources">
                      <span className="source-label" id="source-label">Sources</span>
                      {SOURCES.map((s) => (
                        <button
                          key={s.id}
                          className={`source-pill ${selectedSources.includes(s.id) ? "selected" : ""}`}
                          onClick={() => toggleSource(s.id)}
                          aria-pressed={selectedSources.includes(s.id)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {mode === "schema" && (
                  <textarea
                    className="schema-input"
                    value={schemaInput}
                    onChange={(e) => setSchemaInput(e.target.value)}
                    spellCheck={false}
                    aria-label="JSON schema input"
                  />
                )}
                {mode === "source" && (
                  <div className="source-mode">
                    <textarea
                      className="schema-input"
                      value={sourceInput}
                      onChange={(e) => setSourceInput(e.target.value)}
                      spellCheck={false}
                      placeholder="Paste your component's TSX/JSX source code here"
                      aria-label="Component source code input"
                    />
                    {parsedSchema && (
                      <details className="parsed-schema">
                        <summary>Extracted schema</summary>
                        <pre className="parsed-schema-pre">{JSON.stringify(parsedSchema, null, 2)}</pre>
                      </details>
                    )}
                  </div>
                )}

                <button
                  className="generate-btn"
                  onClick={generate}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate docs"}
                </button>
              </div>
            </div>
          </div>

          <div className="column output-column">
            <div className="output-header">
              <label className="col-label">Documentation</label>
              {output && (
                <div className="output-actions">
                  <div className="tabs" role="tablist" aria-label="Output format">
                    <button
                      className={`tab ${activeTab === "markdown" ? "active" : ""}`}
                      onClick={() => setActiveTab("markdown")}
                      role="tab"
                      aria-selected={activeTab === "markdown"}
                    >
                      Markdown
                    </button>
                    <button
                      className={`tab ${activeTab === "preview" ? "active" : ""}`}
                      onClick={() => setActiveTab("preview")}
                      role="tab"
                      aria-selected={activeTab === "preview"}
                    >
                      Preview
                    </button>
                    <button
                      className={`tab ${activeTab === "compact" ? "active" : ""}`}
                      onClick={() => setActiveTab("compact")}
                      role="tab"
                      aria-selected={activeTab === "compact"}
                    >
                      Compact
                    </button>
                  </div>
                  <div className="output-action-btns">
                    <div className="export-wrap">
                      <button
                        className="export-btn"
                        onClick={() => setShowExport(!showExport)}
                        aria-expanded={showExport}
                        aria-label="Export as agent context file"
                      >
                        Export
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                      {showExport && (
                        <ul className="export-menu" role="menu">
                          {EXPORT_FORMATS.map((f) => (
                            <li key={f.id} role="menuitem">
                              <button
                                className="export-menu-item"
                                onClick={() => handleExport(f.id)}
                              >
                                {f.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      className="copy-icon-btn"
                      onClick={activeTab === "markdown" ? copyMarkdown : activeTab === "compact" ? copyCompact : copyPreviewText}
                      aria-label={activeTab === "markdown" ? "Copy markdown" : activeTab === "compact" ? "Copy compact YAML" : "Copy text"}
                      title={activeTab === "markdown" ? "Copy markdown" : activeTab === "compact" ? "Copy compact YAML" : "Copy text"}
                    >
                      {(activeTab === "markdown" ? copiedMarkdown : activeTab === "compact" ? copiedCompact : copiedPreview) ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {error && <p className="error" role="alert">{error}</p>}
            {!output && !error && !loading && (
              <div className="placeholder">
                <p>Enter a component name or select an example, then click Generate docs.</p>
              </div>
            )}
            {loading && (
              <div className="placeholder" aria-live="polite">
                <p>Fetching docs and writing documentation...</p>
              </div>
            )}
            {output && activeTab === "markdown" && (
              <pre className="output">{output}</pre>
            )}
            {output && activeTab === "preview" && (
              <div className="output preview">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            )}
            {output && activeTab === "compact" && (
              <pre className="output">{compactOutput}</pre>
            )}
            {output && (
              <div className="token-estimate">
                ~{estimateTokens(output)} tokens (markdown) · ~{estimateTokens(compactOutput)} tokens (compact) · {Math.round((1 - compactOutput.length / output.length) * 100)}% smaller
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
