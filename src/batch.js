import { generateFromComponent } from "./generate.js";
import { markdownToCompact } from "./markdown-to-compact.js";
import { combineCLAUDEmd, combineAgentsMd, combineLlmsTxt } from "./agent-context-formats.js";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

function parseArgs(argv) {
  const args = { components: [], format: "both", output: null, combine: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--components" && argv[i + 1]) {
      args.components = argv[++i].split(",").map((c) => c.trim());
    } else if (argv[i] === "--format" && argv[i + 1]) {
      args.format = argv[++i];
    } else if (argv[i] === "--output" && argv[i + 1]) {
      args.output = argv[++i];
    } else if (argv[i] === "--combine" && argv[i + 1]) {
      args.combine = argv[++i];
    } else if (argv[i] === "--help") {
      console.log(`Usage: node src/batch.js --components button,dialog,tabs [--format markdown|compact|both] [--output ./docs/generated/] [--combine claude|agents|llms]`);
      process.exit(0);
    }
  }
  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.components.length) {
    console.error("Error: --components is required. Example: --components button,dialog,tabs");
    process.exit(1);
  }

  if (args.output && !existsSync(args.output)) {
    mkdirSync(args.output, { recursive: true });
  }

  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  const errors = [];
  const results = [];
  const compactEntries = [];

  for (let i = 0; i < args.components.length; i++) {
    const name = args.components[i];
    const slug = name.toLowerCase();

    if (i > 0) await sleep(1000);

    process.stdout.write(`[${i + 1}/${args.components.length}] ${name}...`);

    try {
      const result = await generateFromComponent(name, ["shadcn", "radix"], {
        format: args.format,
      });

      totalInputTokens += result.inputTokens;
      totalOutputTokens += result.outputTokens;

      const compact =
        result.compact || (args.format !== "markdown" ? markdownToCompact(result.markdown) : null);

      if (compact && args.combine) {
        compactEntries.push({ name, compactYaml: compact });
      }

      if (args.output) {
        if (args.format === "markdown" || args.format === "both") {
          writeFileSync(join(args.output, `${slug}.md`), result.markdown);
        }
        if (args.format === "compact" || args.format === "both") {
          writeFileSync(join(args.output, `${slug}.yaml`), compact);
        }
        console.log(` done`);
      } else {
        console.log(` done`);
        if (args.format === "markdown" || args.format === "both") {
          console.log(`\n--- ${name} (markdown) ---\n${result.markdown}`);
        }
        if ((args.format === "compact" || args.format === "both") && compact) {
          console.log(`\n--- ${name} (compact) ---\n${compact}`);
        }
      }

      results.push(name);
    } catch (err) {
      console.log(` ERROR: ${err.message}`);
      errors.push({ name, error: err.message });
    }
  }

  if (args.combine && args.output && compactEntries.length > 0) {
    const combiners = { claude: combineCLAUDEmd, agents: combineAgentsMd, llms: combineLlmsTxt };
    const filenames = { claude: "CLAUDE.md", agents: "AGENTS.md", llms: "llms.txt" };
    const fn = combiners[args.combine];
    if (fn) {
      const combined = fn(compactEntries);
      const outPath = join(args.output, filenames[args.combine]);
      writeFileSync(outPath, combined);
      console.log(`Combined: ${outPath} (${compactEntries.length} components)`);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Processed: ${results.length}/${args.components.length}`);
  console.log(`Tokens: ~${totalInputTokens} input, ~${totalOutputTokens} output`);
  if (errors.length) {
    console.log(`Errors: ${errors.length}`);
    for (const e of errors) {
      console.log(`  - ${e.name}: ${e.error}`);
    }
  }
  if (args.output) {
    console.log(`Output: ${args.output}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
