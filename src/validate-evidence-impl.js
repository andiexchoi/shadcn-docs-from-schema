// Shared validation logic for platform and semantic evidence pipelines.
// Called by src/platform/validate-evidence.js and src/semantic/validate-evidence.js.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const VALID_REVIEW_STATES = ["current", "needs-review", "stale", "archived"];
const REQUIRED_FILE_FIELDS = [
  "sourceId", "platform", "canonicalUrl", "retrievedAt", "reviewedAt", "reviewState", "excerpts",
];

export function validateEvidencePipeline({ evidenceDir, sourcesPath, requiredExcerptFields }) {
  let errors = 0;

  function fail(msg) {
    console.error(`  ✗ ${msg}`);
    errors++;
  }

  function pass(msg) {
    console.log(`  ✓ ${msg}`);
  }

  if (!existsSync(sourcesPath)) {
    console.error("sources.json not found");
    process.exit(1);
  }
  const sources = JSON.parse(readFileSync(sourcesPath, "utf8"));

  const registeredIds = new Set();
  for (const [, entry] of Object.entries(sources)) {
    for (const source of entry.sources || []) {
      registeredIds.add(source.id);
    }
  }

  const evidenceFiles = readdirSync(evidenceDir).filter((f) => f.endsWith(".json"));

  if (evidenceFiles.length === 0) {
    console.log("No evidence files found.");
    process.exit(0);
  }

  for (const filename of evidenceFiles) {
    const filepath = path.join(evidenceDir, filename);
    console.log(`\n${filename}`);

    let ev;
    try {
      ev = JSON.parse(readFileSync(filepath, "utf8"));
    } catch (e) {
      fail(`Invalid JSON: ${e.message}`);
      continue;
    }

    for (const field of REQUIRED_FILE_FIELDS) {
      if (ev[field] === undefined || ev[field] === null) {
        fail(`Missing required field: ${field}`);
      }
    }

    if (ev.sourceId && !registeredIds.has(ev.sourceId)) {
      fail(`sourceId "${ev.sourceId}" not found in sources.json`);
    } else if (ev.sourceId) {
      pass(`sourceId "${ev.sourceId}" found in sources.json`);
    }

    if (ev.reviewState && !VALID_REVIEW_STATES.includes(ev.reviewState)) {
      fail(`reviewState "${ev.reviewState}" is not one of: ${VALID_REVIEW_STATES.join(", ")}`);
    } else if (ev.reviewState) {
      pass(`reviewState: ${ev.reviewState}`);
    }

    if (ev.reviewState && ev.reviewState !== "current") {
      console.log(`  ⚠ reviewState is "${ev.reviewState}" — generator will not inject this evidence`);
    }

    if (!Array.isArray(ev.excerpts) || ev.excerpts.length === 0) {
      fail("excerpts must be a non-empty array");
    } else {
      pass(`${ev.excerpts.length} excerpt(s)`);
      for (const [i, excerpt] of ev.excerpts.entries()) {
        for (const field of requiredExcerptFields) {
          if (!excerpt[field]) {
            fail(`excerpt[${i}] missing required field: ${field}`);
          }
        }
      }
    }
  }

  console.log(`\n${errors === 0 ? "All evidence files valid." : `${errors} error(s) found.`}`);
  process.exit(errors > 0 ? 1 : 0);
}
