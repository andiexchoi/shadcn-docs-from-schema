// Semantic scorer: LLM-as-judge. For each semantic marker, asks Sonnet 4.6
// (temperature 0, no system prompt besides the locked rubric framing) to
// decide whether the marker is satisfied by the source. Returns boolean +
// short reason. Batches all semantic markers for a given file into one call
// to reduce API overhead and keep the judge's context consistent.

import Anthropic from "@anthropic-ai/sdk";

const JUDGE_MODEL = "claude-sonnet-4-6";
const JUDGE_MAX_TOKENS = 2048;

// Locked rubric framing. Do not edit after the first scoring run.
const RUBRIC_FRAMING = `You are a strict, consistent code reviewer scoring a single TypeScript React component against a list of pre-registered markers. For each marker you will receive a short rubric describing what "satisfied" means. Your job is to answer true/false per marker and give a one-line reason.

Scoring rules:
- Judge only from what is in the source. Do not assume helpers exist outside the file.
- A comment about an intent does not satisfy a structural expectation. A runtime affordance must actually be present.
- When the rubric specifies a negative direction (e.g. the marker IS an anti-pattern), still answer the question literally as written — the caller inverts direction in analysis.
- Respond with a single JSON object, no prose, no markdown fences. Schema:
  { "<marker_id>": { "satisfied": true|false, "reason": "<≤15 words>" }, ... }
- Include every marker_id you were asked about, in the same order. No extras.`;

export async function scoreSemanticBatch({ client, markers, source }) {
  const semanticMarkers = markers.filter((m) => m.tier === "semantic");
  if (semanticMarkers.length === 0) return [];

  const rubricBlock = semanticMarkers
    .map((m, i) => `${i + 1}. id: ${m.id}\n   rubric: ${m.rubric}`)
    .join("\n\n");

  const userMessage = `Source file:

\`\`\`tsx
${source}
\`\`\`

Markers to score:

${rubricBlock}

Respond with a JSON object keyed by marker id. Include all ${semanticMarkers.length} markers.`;

  const response = await client.messages.create({
    model: JUDGE_MODEL,
    max_tokens: JUDGE_MAX_TOKENS,
    temperature: 0,
    system: RUBRIC_FRAMING,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content.map((c) => c.text || "").join("").trim();
  const cleaned = text.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Judge response not valid JSON:\n${text}\n\nError: ${err.message}`);
  }

  return semanticMarkers.map((m) => {
    const entry = parsed[m.id];
    if (!entry) {
      return {
        id: m.id,
        tier: "semantic",
        direction: m.direction,
        satisfied: false,
        reason: "MISSING — judge did not return this marker",
        judgeMissing: true,
      };
    }
    // Direction matters for "satisfied" in the same way as regex scorers:
    // for "-" markers, the rubric asks about an anti-pattern. But semantic
    // markers in this experiment are all "+" direction, so this is a no-op
    // guard in practice.
    const answered = Boolean(entry.satisfied);
    const satisfied = m.direction === "+" ? answered : !answered;
    return {
      id: m.id,
      tier: "semantic",
      direction: m.direction,
      answered,
      satisfied,
      reason: String(entry.reason || "").slice(0, 200),
    };
  });
}

export function createJudgeClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not set for semantic scorer");
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}
