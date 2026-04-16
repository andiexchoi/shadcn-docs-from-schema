function extractComponentName(source) {
  const displayName = source.match(/(\w+)\.displayName\s*=\s*["'](\w+)["']/);
  if (displayName) return displayName[2];

  const forwardRef = source.match(
    /export\s+const\s+(\w+)\s*=\s*React\.forwardRef/
  );
  if (forwardRef) return forwardRef[1];

  const namedExport = source.match(
    /export\s+(?:default\s+)?function\s+(\w+)/
  );
  if (namedExport) return namedExport[1];

  const constExport = source.match(/export\s+const\s+(\w+)/);
  if (constExport) return constExport[1];

  return null;
}

function extractExtendsElement(source) {
  const match = source.match(
    /extends\s+React\.ComponentPropsWithoutRef<["'](\w+)["']>/
  );
  if (match) return match[1];

  const refMatch = source.match(/React\.forwardRef<HTML(\w+)Element/);
  if (refMatch) return refMatch[1].toLowerCase();

  return null;
}

function extractPropsFromInterface(source) {
  const match = source.match(
    /(?:interface|type)\s+\w*Props?\s*(?:extends\s+[^{]+)?\s*=?\s*\{([^}]*)\}/s
  );
  if (!match) return {};

  const body = match[1];
  const props = {};
  const propPattern = /(\w+)(\?)?:\s*([^;\n]+)/g;
  let m;
  while ((m = propPattern.exec(body)) !== null) {
    const name = m[1];
    const typeStr = m[3].trim();

    if (["className", "children", "ref", "asChild", "style"].includes(name))
      continue;

    const unionMatch = typeStr.match(
      /^["']([^"']+)["'](?:\s*\|\s*["']([^"']+)["'])*/
    );
    if (unionMatch) {
      const values = [];
      const unionPattern = /["']([^"']+)["']/g;
      let um;
      while ((um = unionPattern.exec(typeStr)) !== null) {
        values.push(um[1]);
      }
      props[name] = { type: "enum", values };
    } else if (typeStr === "boolean") {
      props[name] = { type: "boolean" };
    } else if (typeStr === "number") {
      props[name] = { type: "number" };
    } else if (typeStr === "string") {
      props[name] = { type: "string" };
    } else {
      props[name] = { type: typeStr };
    }
  }

  return props;
}

function extractDefaults(source) {
  const defaults = {};
  const destructurePattern = /\(\s*\{([^}]+)\}\s*(?:,\s*\w+)?\s*\)/g;
  let match;
  while ((match = destructurePattern.exec(source)) !== null) {
    const body = match[1];
    const stringDefault = /(\w+)\s*=\s*["']([^"']+)["']/g;
    let dm;
    while ((dm = stringDefault.exec(body)) !== null) {
      defaults[dm[1]] = dm[2];
    }
    const boolDefault = /(\w+)\s*=\s*(true|false)/g;
    let bm;
    while ((bm = boolDefault.exec(body)) !== null) {
      defaults[bm[1]] = bm[2] === "true";
    }
    const numDefault = /(\w+)\s*=\s*(\d+(?:\.\d+)?)/g;
    let nm;
    while ((nm = numDefault.exec(body)) !== null) {
      defaults[nm[1]] = Number(nm[2]);
    }
  }
  return defaults;
}

function extractCvaVariants(source) {
  const variantsMatch = source.match(
    /variants\s*:\s*\{([^]*?)\}\s*,?\s*(?:defaultVariants|compoundVariants|\}\s*\))/s
  );
  if (!variantsMatch) return {};

  const props = {};
  const variantBlock = variantsMatch[1];
  const variantPattern = /(\w+)\s*:\s*\{([^}]+)\}/g;
  let vm;
  while ((vm = variantPattern.exec(variantBlock)) !== null) {
    const name = vm[1];
    const valuesBlock = vm[2];
    const values = [];
    const keyPattern = /^\s+(\w+)\s*:/gm;
    let km;
    while ((km = keyPattern.exec(valuesBlock)) !== null) {
      values.push(km[1]);
    }
    props[name] = { type: "enum", values };
  }

  const defaultsMatch = source.match(/defaultVariants\s*:\s*\{([^}]+)\}/);
  if (defaultsMatch) {
    const defaultPattern = /(\w+)\s*:\s*["']([^"']+)["']/g;
    let dm;
    while ((dm = defaultPattern.exec(defaultsMatch[1])) !== null) {
      if (props[dm[1]]) {
        props[dm[1]].default = dm[2];
      }
    }
  }

  return props;
}

export function extractProps(source) {
  const componentName = extractComponentName(source);
  const interfaceProps = extractPropsFromInterface(source);
  const cvaProps = extractCvaVariants(source);
  const defaults = extractDefaults(source);
  const extendsElement = extractExtendsElement(source);

  const props = { ...interfaceProps };
  for (const [key, val] of Object.entries(cvaProps)) {
    if (!props[key]) {
      props[key] = val;
    } else if (!props[key].values && val.values) {
      props[key].values = val.values;
      props[key].type = "enum";
    }
  }

  for (const [key, val] of Object.entries(defaults)) {
    if (props[key]) {
      props[key].default = val;
    }
  }

  const schema = {};
  if (componentName) schema.component = componentName;
  if (Object.keys(props).length) schema.props = props;
  if (extendsElement) schema.element = extendsElement;

  return schema;
}
