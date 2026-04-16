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

export function combineCLAUDEmd(entries) {
  const sections = entries.map(({ name, compactYaml }) =>
    `## ${name}\n\n\`\`\`yaml\n${compactYaml.trim()}\n\`\`\``
  ).join("\n\n---\n\n");

  return `# Component Library Reference

Use this file as structured context when generating code that uses any of these components. Follow the contracts, keyboard interactions, and ARIA requirements listed for each component exactly. Do not invent props or sub-components not described here.

${sections}
`;
}

export function combineAgentsMd(entries) {
  const sections = entries.map(({ name, compactYaml }) =>
    `## ${name}\n\n\`\`\`yaml\n${compactYaml.trim()}\n\`\`\``
  ).join("\n\n---\n\n");

  return `# Component Library

## Context for AI Agents

The following structured references describe each component's API, accessibility contracts, and usage patterns. Treat them as the source of truth when generating or modifying code that uses these components.

${sections}
`;
}

export function combineLlmsTxt(entries) {
  return entries.map(({ name, compactYaml }) => {
    const lines = compactYaml.split("\n");
    const summary = lines.find((l) => l.startsWith("summary:"));
    const summaryText = summary ? summary.replace(/^summary:\s*"?/, "").replace(/"$/, "") : "";
    return `> ${name}\n${summaryText}\n\n${compactYaml.trim()}`;
  }).join("\n\n---\n\n") + "\n";
}
