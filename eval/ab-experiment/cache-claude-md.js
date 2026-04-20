// Generates the 10 CLAUDE.md files via the existing batch CLI, one per
// component, and saves them to claude-md/<component>.md. These are the
// CLAUDE.md's that get injected into condition B.
//
// The output format matches what `node src/batch.js --components <name>
// --combine claude` produces: a full CLAUDE.md with the "# Component Library
// Reference" envelope around a single component's compact YAML. That's the
// shape users see in real use.
//
// Run once before the experiment. Re-run if a component's source docs change
// upstream and you want to re-cache.

import { execSync } from "child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { COMPONENTS } from "./components.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const CACHE_DIR = join(ROOT, "claude-md");
const REPO_ROOT = join(ROOT, "..", "..");

mkdirSync(CACHE_DIR, { recursive: true });

const force = process.argv.includes("--force");

for (const [localName, cfg] of Object.entries(COMPONENTS)) {
  const outPath = join(CACHE_DIR, `${cfg.batchName}.md`);
  if (existsSync(outPath) && !force) {
    console.log(`skip  ${localName} (${cfg.batchName}) — cached at ${outPath}`);
    continue;
  }
  const tmpDir = join(CACHE_DIR, `_tmp_${cfg.batchName}`);
  mkdirSync(tmpDir, { recursive: true });

  console.log(`gen   ${localName} (${cfg.batchName})`);
  try {
    execSync(
      `node src/batch.js --components ${cfg.batchName} --format compact --output ${tmpDir} --combine claude`,
      { cwd: REPO_ROOT, stdio: "inherit" }
    );
  } catch (err) {
    console.error(`FAILED for ${localName} (${cfg.batchName}): ${err.message}`);
    rmSync(tmpDir, { recursive: true, force: true });
    continue;
  }

  const combined = join(tmpDir, "CLAUDE.md");
  if (!existsSync(combined)) {
    console.error(`FAILED: ${combined} not produced`);
    rmSync(tmpDir, { recursive: true, force: true });
    continue;
  }

  const content = readFileSync(combined, "utf8");
  writeFileSync(outPath, content);
  rmSync(tmpDir, { recursive: true, force: true });
  console.log(`saved ${outPath} (${content.length} chars)`);
}

console.log("\nCached CLAUDE.md files:");
for (const [localName, cfg] of Object.entries(COMPONENTS)) {
  const outPath = join(CACHE_DIR, `${cfg.batchName}.md`);
  const exists = existsSync(outPath) ? "OK" : "MISSING";
  console.log(`  ${exists}  ${localName.padEnd(15)} → ${outPath}`);
}
