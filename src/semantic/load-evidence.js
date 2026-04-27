import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EVIDENCE_DIR = path.join(__dirname, "evidence");
const REQUIRED_EXCERPT_FIELDS = ["id", "section", "topic", "evidence", "supportsGuideline"];

export function loadSemanticEvidence(componentName) {
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
        process.stderr.write(`[semantic-evidence] Skipping excerpt in ${source.id}: missing ${missing.join(", ")}\n`);
        return false;
      }
      return true;
    });

    if (validExcerpts.length === 0) continue;
    currentEvidence.push({ ...evidence, excerpts: validExcerpts });
  }

  if (currentEvidence.length === 0) return null;
  return formatSemanticEvidenceBlock(currentEvidence);
}

function semanticLabel(platform) {
  if (platform === "wai-aria-apg") return "WAI-ARIA APG";
  if (platform === "radix") return "Radix UI";
  if (platform === "mdn") return "MDN";
  if (platform === "html-spec") return "HTML spec";
  return platform;
}

function formatSemanticEvidenceBlock(evidenceList) {
  const lines = [
    "<semantic-evidence>",
    "Use the relevant excerpts to generate ARIA requirements, Keyboard interactions, and Accessibility sections.",
    "Do not add ARIA or keyboard guidance from training knowledge when this block is present.",
    "Route each excerpt to the section named in its section field.",
    "Each requirement and key binding must cite its source.",
    "",
  ];

  for (const ev of evidenceList) {
    lines.push(`source: ${semanticLabel(ev.platform)}`);
    lines.push(`url: ${ev.canonicalUrl}`);
    lines.push("");

    for (const excerpt of ev.excerpts) {
      lines.push(`id: ${excerpt.id}`);
      lines.push(`section: ${excerpt.section}`);
      lines.push(`topic: ${excerpt.topic}`);
      lines.push(`evidence: ${excerpt.evidence}`);
      lines.push(`guideline: ${excerpt.supportsGuideline}`);
      lines.push("");
    }
  }

  lines.push("</semantic-evidence>");
  return lines.join("\n");
}
