import { useState } from "react";
import { examples } from "./examples/index.js";
import "./App.css";

const defaultSchema = JSON.stringify(examples[0].schema, null, 2);

export default function App() {
  const [schemaInput, setSchemaInput] = useState(defaultSchema);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeExample, setActiveExample] = useState(examples[0].name);

  function loadExample(example) {
    setSchemaInput(JSON.stringify(example.schema, null, 2));
    setActiveExample(example.name);
    setOutput("");
    setError("");
  }

  async function generate() {
    setLoading(true);
    setError("");
    setOutput("");

    let parsed;
    try {
      parsed = JSON.parse(schemaInput);
    } catch {
      setError("Invalid JSON. Check your schema and try again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema: parsed }),
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
          Paste a component JSON schema. Get a structured documentation draft.
        </p>
      </header>

      <main className="main">
        <div className="examples-bar">
          <span className="examples-label">Examples:</span>
          {examples.map((ex) => (
            <button
              key={ex.name}
              className={`example-btn ${activeExample === ex.name ? "active" : ""}`}
              onClick={() => loadExample(ex)}
            >
              {ex.name}
            </button>
          ))}
        </div>

        <div className="columns">
          <div className="column input-column">
            <label className="col-label">Schema (JSON)</label>
            <textarea
              className="schema-input"
              value={schemaInput}
              onChange={(e) => setSchemaInput(e.target.value)}
              spellCheck={false}
            />
            <button
              className="generate-btn"
              onClick={generate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate docs"}
            </button>
          </div>

          <div className="column output-column">
            <label className="col-label">Documentation</label>
            {error && <p className="error">{error}</p>}
            {!output && !error && !loading && (
              <div className="placeholder">
                <p>Select an example or paste a schema, then click Generate docs.</p>
              </div>
            )}
            {loading && (
              <div className="placeholder">
                <p>Writing documentation...</p>
              </div>
            )}
            {output && (
              <pre className="output">{output}</pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
