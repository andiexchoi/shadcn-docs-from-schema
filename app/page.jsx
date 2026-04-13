"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { examples } from "@/src/examples/index.js";
import { searchComponents } from "@/src/shadcn-components.js";

const SOURCES = [
  { id: "shadcn", label: "shadcn/ui" },
  { id: "radix", label: "Radix UI" },
  { id: "baseui", label: "Base UI" },
];

function toMdx(markdown) {
  return `---\ntitle: "Component documentation"\ndescription: "Generated with shadcn-docs-from-schema"\n---\n\n${markdown}`;
}

export default function Home() {
  const [mode, setMode] = useState("fetch");
  const [componentName, setComponentName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [selectedSources, setSelectedSources] = useState(["shadcn", "radix"]);
  const inputRef = useRef(null);
  const [schemaInput, setSchemaInput] = useState(JSON.stringify(examples[0].schema, null, 2));
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("markdown");
  const [copied, setCopied] = useState(false);

  function copyMdx() {
    navigator.clipboard.writeText(toMdx(output)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

    const body =
      mode === "fetch"
        ? { component: componentName.trim(), sources: selectedSources }
        : (() => {
            try {
              return { schema: JSON.parse(schemaInput) };
            } catch {
              setError("Invalid JSON. Check your schema and try again.");
              setLoading(false);
              return null;
            }
          })();

    if (!body) return;

    if (mode === "fetch" && !componentName.trim()) {
      setError("Enter a component name.");
      setLoading(false);
      return;
    }

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
        <h1>What does this shadcn/ui component do?</h1>
        <p className="subtitle">
          Retrieve and/or input a component JSON schema. Get a structured first draft for mobile app component documentation geared towards product managers and designers.
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
              </div>

              <div className="input-body">
                {mode === "fetch" ? (
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
                ) : (
                  <textarea
                    className="schema-input"
                    value={schemaInput}
                    onChange={(e) => setSchemaInput(e.target.value)}
                    spellCheck={false}
                    aria-label="JSON schema input"
                  />
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
                  </div>
                  <button className="copy-mdx-btn" onClick={copyMdx}>
                    {copied ? "Copied" : "Copy as MDX"}
                  </button>
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
          </div>
        </div>
      </main>
    </div>
  );
}
