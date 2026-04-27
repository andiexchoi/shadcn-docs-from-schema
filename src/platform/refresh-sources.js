// Run: node src/platform/refresh-sources.js

import { fileURLToPath } from "node:url";
import path from "node:path";
import { refreshSources } from "../refresh-sources-impl.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await refreshSources({
  sourcesPath: path.join(__dirname, "sources.json"),
  statusPath: path.join(__dirname, "status.json"),
});
