// Shared refresh logic for platform and semantic evidence pipelines.
// Called by src/platform/refresh-sources.js and src/semantic/refresh-sources.js.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

export async function refreshSources({ sourcesPath, statusPath }) {
  if (!existsSync(sourcesPath)) {
    console.error("sources.json not found");
    process.exit(1);
  }

  const sources = JSON.parse(readFileSync(sourcesPath, "utf8"));
  const previousStatus = existsSync(statusPath)
    ? JSON.parse(readFileSync(statusPath, "utf8"))
    : {};

  const today = new Date().toISOString().slice(0, 10);
  const newStatus = { ...previousStatus };

  const allSources = [];
  for (const [, entry] of Object.entries(sources)) {
    for (const source of entry.sources || []) {
      if (source.status === "active") allSources.push(source);
    }
  }

  console.log(`Checking ${allSources.length} source(s)...\n`);

  for (const source of allSources) {
    process.stdout.write(`${source.id} — `);

    let httpStatus = null;
    let contentHash = null;
    let reachable = false;

    try {
      const res = await fetch(source.url, {
        headers: { "User-Agent": "shadcn-docs-from-schema/refresh-sources" },
        signal: AbortSignal.timeout(10000),
      });
      httpStatus = res.status;
      reachable = res.ok;

      if (res.ok) {
        const text = await res.text();
        contentHash = createHash("sha256").update(text).digest("hex").slice(0, 16);
      }
    } catch (e) {
      console.log(`unreachable (${e.message})`);
    }

    const previous = previousStatus[source.id];
    const contentChanged = previous?.contentHash && contentHash && previous.contentHash !== contentHash;

    if (reachable) {
      console.log(`${httpStatus} ${contentChanged ? "⚠ content changed — needs review" : "✓ no change detected"}`);
    }

    newStatus[source.id] = {
      lastChecked: today,
      reachable,
      httpStatus,
      contentHash,
      contentChanged: contentChanged || false,
      reviewState: contentChanged ? "needs-review" : (previous?.reviewState ?? "current"),
    };
  }

  writeFileSync(statusPath, JSON.stringify(newStatus, null, 2) + "\n");
  console.log(`\nWrote status.json`);

  if (Object.values(newStatus).some((s) => s.contentChanged)) {
    console.log("\n⚠  One or more sources may have changed. Review the evidence files and update reviewState and reviewedAt before the next generation run.");
  }
}
