export function toCLAUDEmd(componentName, compactYaml) {
  return `# Component: ${componentName}

## Usage Documentation

This is the structured reference for the ${componentName} component. Use this when generating code that includes ${componentName}.

\`\`\`yaml
${compactYaml.trim()}
\`\`\`

When implementing ${componentName}, follow the contracts, keyboard interactions, and ARIA requirements listed above exactly. Do not invent props or sub-components not described here.
`;
}

export function toAgentsMd(componentName, compactYaml) {
  return `# ${componentName}

## Context for AI Agents

The following structured reference describes the ${componentName} component's API, accessibility contracts, and usage patterns. Treat it as the source of truth when generating or modifying code that uses this component.

\`\`\`yaml
${compactYaml.trim()}
\`\`\`
`;
}

export function toLlmsTxt(componentName, compactYaml) {
  const lines = compactYaml.split("\n");
  const summary = lines.find((l) => l.startsWith("summary:"));
  const summaryText = summary ? summary.replace(/^summary:\s*"?/, "").replace(/"$/, "") : "";

  return `> ${componentName}
${summaryText}

${compactYaml.trim()}
`;
}
