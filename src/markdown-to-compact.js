const HEADING_MAP = {
  "When to use": "use_when",
  "Do's and don'ts": "_dos_and_donts",
  "Anatomy": "anatomy",
  "Component contracts": "contracts",
  "Variants and options": "variants",
  "Placement and layout": "placement",
  "Editorial guidelines": "editorial",
  "Keyboard interactions": "keyboard",
  "ARIA requirements": "aria",
  "Accessibility": "a11y",
  "Common mistakes": "mistakes",
};

function stripMarkdownFormatting(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1");
}

function extractBullets(text) {
  return text
    .split("\n")
    .filter((line) => /^[-*]\s/.test(line.trim()))
    .map((line) =>
      stripMarkdownFormatting(line.trim().replace(/^[-*]\s+/, ""))
    );
}

function extractBoldPrefixedItems(text) {
  const items = [];
  const pattern = /\*\*(.+?)\*\*[:\s]*(.+?)(?=\n\*\*|\n*$)/gs;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const name = match[1].trim();
    const desc = match[2].trim().replace(/\n/g, " ");
    items.push(stripMarkdownFormatting(`${name}: ${desc}`));
  }
  return items;
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function collapseToString(text) {
  return stripMarkdownFormatting(
    text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .join(" ")
  );
}

function parseDosAndDonts(text) {
  const result = {};
  const doMatch = text.split(/\*\*Don'?t\*\*/i);
  const doSection = doMatch[0];
  const dontSection = doMatch[1] || "";

  const doBullets = extractBullets(doSection.replace(/\*\*Do\*\*/i, ""));
  if (doBullets.length) result.do = doBullets;

  const dontBullets = extractBullets(dontSection);
  if (dontBullets.length) result.dont = dontBullets;

  return result;
}

function parseVariants(text) {
  const boldItems = extractBoldPrefixedItems(text);
  if (boldItems.length) return boldItems;
  const bullets = extractBullets(text);
  if (bullets.length) return bullets;
  const collapsed = collapseToString(text);
  return collapsed || null;
}

function parseSection(text, key) {
  if (key === "use_when") {
    const bullets = extractBullets(text);
    if (bullets.length) return bullets;
    const sentences = splitSentences(collapseToString(text));
    return sentences.length > 1 ? sentences : collapseToString(text) || null;
  }

  const bullets = extractBullets(text);
  if (bullets.length) return bullets;
  const collapsed = collapseToString(text);
  return collapsed || null;
}

export function parseMarkdownSections(markdown) {
  const lines = markdown.split("\n");
  const result = {};

  const h1Match = lines.find((l) => /^# /.test(l));
  if (h1Match) {
    result.component = h1Match.replace(/^# /, "").trim();
  }

  const h1Index = lines.indexOf(h1Match);
  if (h1Index >= 0) {
    const afterH1 = lines
      .slice(h1Index + 1)
      .find((l) => l.trim() && !l.startsWith("#"));
    if (afterH1) result.summary = stripMarkdownFormatting(afterH1.trim());
  }

  const sectionRegex = /^## (.+)$/;
  const sections = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(sectionRegex);
    if (match) {
      sections.push({ heading: match[1].trim(), startLine: i });
    }
  }

  for (let i = 0; i < sections.length; i++) {
    const { heading, startLine } = sections[i];
    const endLine =
      i + 1 < sections.length ? sections[i + 1].startLine : lines.length;
    const body = lines.slice(startLine + 1, endLine).join("\n").trim();

    if (!body) continue;

    const key = HEADING_MAP[heading];
    if (!key) continue;

    if (key === "_dos_and_donts") {
      Object.assign(result, parseDosAndDonts(body));
    } else if (key === "variants") {
      const parsed = parseVariants(body);
      if (parsed) result[key] = parsed;
    } else {
      const parsed = parseSection(body, key);
      if (parsed) result[key] = parsed;
    }
  }

  return result;
}

function yamlEscape(str) {
  if (
    str.includes(":") ||
    str.includes("#") ||
    str.includes('"') ||
    str.includes("'") ||
    str.startsWith("- ") ||
    str.startsWith("* ") ||
    str.startsWith("{") ||
    str.startsWith("[") ||
    str.startsWith("!") ||
    str.startsWith("@") ||
    str.startsWith("`") ||
    /^(true|false|null|yes|no|\d+)$/i.test(str)
  ) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str;
}

export function toCompactYaml(obj) {
  const lines = [];
  const keyOrder = [
    "component",
    "summary",
    "use_when",
    "do",
    "dont",
    "anatomy",
    "contracts",
    "variants",
    "placement",
    "editorial",
    "keyboard",
    "aria",
    "a11y",
    "mistakes",
  ];

  for (const key of keyOrder) {
    const val = obj[key];
    if (val == null) continue;

    if (Array.isArray(val)) {
      lines.push(`${key}:`);
      for (const item of val) {
        lines.push(`  - ${yamlEscape(item)}`);
      }
    } else {
      lines.push(`${key}: ${yamlEscape(val)}`);
    }
  }

  return lines.join("\n") + "\n";
}

export function markdownToCompact(markdown) {
  const sections = parseMarkdownSections(markdown);
  return toCompactYaml(sections);
}
