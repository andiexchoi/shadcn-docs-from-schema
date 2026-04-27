// Run: node src/platform/validate-evidence.js

import { fileURLToPath } from "node:url";
import path from "node:path";
import { validateEvidencePipeline } from "../validate-evidence-impl.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

validateEvidencePipeline({
  evidenceDir: path.join(__dirname, "evidence"),
  sourcesPath: path.join(__dirname, "sources.json"),
  requiredExcerptFields: ["id", "topic", "evidence", "supportsChecklistItem"],
});
