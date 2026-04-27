import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EVIDENCE_DIR = path.join(__dirname, "evidence");
const REQUIRED_EXCERPT_FIELDS = ["id", "topic", "evidence", "supportsChecklistItem"];

export function loadPlatformEvidence(componentName) {
  if (typeof componentName !== "string" || !componentName.trim()) return null;

  const slug = componentName.toLowerCase().trim().replace(/\s+/g, "-");

  const sourcesPath = path.join(__dirname, "sources.json");
  if (!existsSync(sourcesPath)) return null;

  let sources;
  try {
    sources = JSON.parse(readFileSync(sourcesPath, "utf8"));
  } catch {
    return null;
  }

  const componentEntry = sources[slug];
  if (!componentEntry?.sources?.length) return null;

  const currentEvidence = [];
  for (const source of componentEntry.sources) {
    if (source.status !== "active") continue;

    const evidencePath = path.join(EVIDENCE_DIR, `${source.id}.json`);
    if (!existsSync(evidencePath)) continue;

    let evidence;
    try {
      evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    } catch {
      continue;
    }

    if (evidence.reviewState !== "current") continue;

    const validExcerpts = (evidence.excerpts || []).filter((excerpt) => {
      const missing = REQUIRED_EXCERPT_FIELDS.filter((f) => !excerpt[f]);
      if (missing.length > 0) {
        process.stderr.write(`[platform-evidence] Skipping excerpt in ${source.id}: missing ${missing.join(", ")}\n`);
        return false;
      }
      return true;
    });

    if (validExcerpts.length === 0) continue;
    currentEvidence.push({ ...evidence, excerpts: validExcerpts });
  }

  if (currentEvidence.length === 0) return null;
  return formatEvidenceBlock(currentEvidence);
}

function platformLabel(platform) {
  if (platform === "apple-hig") return "Apple HIG";
  if (platform === "material-3") return "Material Design 3";
  return platform;
}

function formatEvidenceBlock(evidenceList) {
  const lines = [
    "<platform-evidence>",
    "Use the relevant excerpts below to generate the Platform compliance checklist.",
    "Do not add platform guidance from training knowledge.",
    "Combine related excerpts into one checklist item where appropriate — not every excerpt needs its own item.",
    "Focus on what is most relevant to this specific component.",
    "",
  ];

  for (const ev of evidenceList) {
    lines.push(`source: ${platformLabel(ev.platform)}`);
    lines.push(`url: ${ev.canonicalUrl}`);
    lines.push("");

    for (const excerpt of ev.excerpts) {
      lines.push(`id: ${excerpt.id}`);
      lines.push(`topic: ${excerpt.topic}`);
      lines.push(`evidence: ${excerpt.evidence}`);
      lines.push(`checklist-item: ${excerpt.supportsChecklistItem}`);
      lines.push("");
    }
  }

  lines.push("</platform-evidence>");
  return lines.join("\n");
}
