// Prompt eval runner.
// Usage: ANTHROPIC_API_KEY=sk-... node eval/run.js [--threshold 80] [--json]
//
// Generates documentation for each test case and checks output
// against expected traits and antitraits.

import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt, buildPromptFromDocs } from "../src/prompt.js";
import { fetchComponentDocs } from "../src/fetchDocs.js";
import { cases } from "./cases.js";

function parseArgs(argv) {
  const args = { threshold: 80, json: false };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--threshold" && argv[i + 1]) {
      args.threshold = Number(argv[++i]);
    } else if (argv[i] === "--json") {
      args.json = true;
    }
  }
  return args;
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generate(input) {
  let prompt;

  if (input.component) {
    const docs = await fetchComponentDocs(input.component, input.sources || ["shadcn", "radix"]);
    if (!docs.found) {
      return { error: `No docs found for "${input.component}"` };
    }
    prompt = buildPromptFromDocs(input.component, docs.content);
  } else {
    prompt = buildPrompt(input.schema);
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  return { text: message.content.map((c) => c.text || "").join("") };
}

function checkTraits(output, traits, antitraits) {
  const results = [];

  for (const trait of traits) {
    const found = output.toLowerCase().includes(trait.toLowerCase());
    results.push({ trait, expected: true, pass: found });
  }

  for (const antitrait of antitraits) {
    const found = output.toLowerCase().includes(antitrait.toLowerCase());
    results.push({ trait: `NOT "${antitrait}"`, expected: false, pass: !found });
  }

  return results;
}

async function runCase(testCase, jsonMode) {
  const { name, input, traits, antitraits, customCheck } = testCase;

  if (!jsonMode) process.stdout.write(`\n  ${name}\n`);

  const result = await generate(input);

  if (result.error) {
    if (!jsonMode) console.log(`    SKIP: ${result.error}`);
    return { name, skipped: true };
  }

  const traitResults = checkTraits(result.text, traits, antitraits);
  let allPass = true;

  for (const r of traitResults) {
    const icon = r.pass ? "PASS" : "FAIL";
    if (!r.pass) allPass = false;
    if (!jsonMode) console.log(`    ${icon}  ${r.trait}`);
  }

  if (customCheck) {
    const custom = customCheck(result.text);
    const icon = custom.pass ? "PASS" : "FAIL";
    if (!custom.pass) allPass = false;
    if (!jsonMode) console.log(`    ${icon}  custom: ${custom.reason || "ok"}`);
  }

  return { name, pass: allPass, traitResults };
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.json) {
    console.log(`\nPrompt eval — ${cases.length} cases\n${"=".repeat(40)}`);
  }

  const results = [];
  for (const testCase of cases) {
    results.push(await runCase(testCase, args.json));
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => r.pass === false).length;
  const skipped = results.filter((r) => r.skipped).length;
  const total = cases.length - skipped;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
  const meetsThreshold = passRate >= args.threshold;

  if (args.json) {
    console.log(JSON.stringify({
      passed,
      failed,
      skipped,
      total: cases.length,
      passRate,
      threshold: args.threshold,
      meetsThreshold,
      results: results.map((r) => ({
        name: r.name,
        pass: r.pass || false,
        skipped: r.skipped || false,
      })),
    }, null, 2));
  } else {
    console.log(`\n${"=".repeat(40)}`);
    console.log(`${passed}/${total} passed (${passRate}%) — ${meetsThreshold ? "PASS" : "FAIL"}`);
    if (skipped > 0) console.log(`${skipped} skipped`);
    console.log(`Threshold: ${args.threshold}%`);
  }

  if (!meetsThreshold) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
