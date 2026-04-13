import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { examples } from "./examples/index.js";
import "./App.css";

const SOURCES = [
  { id: "shadcn", label: "shadcn/ui" },
  { id: "radix", label: "Radix UI" },
  { id: "baseui", label: "Base UI" },
];

export default function App() {
  const [mode, setMode] = useState("fetch");
  const [componentName, setComponentName] = useState("");
  const [selectedSources, setSelectedSources] = useState(["shadcn", "radix"]);
  const [schemaInput, setSchemaInput] = useState(JSON.stringify(examples[0].schema, null, 2));
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("markdown");

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
        <h1>shadcn docs from schema</h1>
        <p className="subtitle">
          Paste a component JSON schema. Get a structured first draft for mobile app component documentation geared towards product managers and designers.
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

            {mode === "fetch" ? (
              <div className="fetch-mode">
                <input
                  className="component-input"
                  type="text"
                  placeholder="Component name, e.g. button, dialog, tabs"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                />
                <div className="source-row">
                  <span className="source-label">Sources:</span>
                  {SOURCES.map((s) => (
                    <label key={s.id} className="source-check">
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(s.id)}
                        onChange={() => toggleSource(s.id)}
                      />
                      {s.label}
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <textarea
                className="schema-input"
                value={schemaInput}
                onChange={(e) => setSchemaInput(e.target.value)}
                spellCheck={false}
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

          <div className="column output-column">
            <div className="output-header">
              <label className="col-label">Documentation</label>
              {output && (
                <div className="tabs">
                  <button
                    className={`tab ${activeTab === "markdown" ? "active" : ""}`}
                    onClick={() => setActiveTab("markdown")}
                  >
                    Markdown
                  </button>
                  <button
                    className={`tab ${activeTab === "preview" ? "active" : ""}`}
                    onClick={() => setActiveTab("preview")}
                  >
                    Preview
                  </button>
                </div>
              )}
            </div>
            {error && <p className="error">{error}</p>}
            {!output && !error && !loading && (
              <div className="placeholder">
                <p>Enter a component name or select an example, then click Generate docs.</p>
              </div>
            )}
            {loading && (
              <div className="placeholder">
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
