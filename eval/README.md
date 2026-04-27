# Prompt eval system

Run `node eval/run.js` to generate documentation for each test case and check the output against expected quality traits.

## How it works

Each test case defines:
- **input**: a component name (fetched from live docs) or a JSON schema
- **traits**: an array of strings the output must contain or patterns it must match
- **antitraits**: an array of strings or patterns the output must NOT contain

The eval runner generates documentation for each case, then checks every trait and antitrait. It reports pass/fail per trait and an overall score.

## Adding test cases

Add entries to `eval/cases.js`. Each case tests a specific behavior of the prompt — not the component itself.

## When to run

Run the eval after any change to `src/prompt.js`, `src/style-guide.js`, or any file in `src/platform/` or `src/semantic/` to check for regressions.
