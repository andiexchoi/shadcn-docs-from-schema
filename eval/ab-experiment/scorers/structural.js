// Structural scorer: pattern-based regex checks.
// Each structural marker has a `pattern` field. Marker is "satisfied" if the
// pattern matches anywhere in the source text.

export function scoreStructural(marker, source) {
  if (marker.tier !== "structural") throw new Error(`Not a structural marker: ${marker.id}`);
  if (!marker.pattern) throw new Error(`Structural marker ${marker.id} has no pattern`);
  const matched = marker.pattern.test(source);
  return {
    id: marker.id,
    tier: "structural",
    direction: marker.direction,
    matched,
    // "satisfied" is the effective score: for "+" markers, matched = good;
    // for "-" markers, matched = bad (we invert so "satisfied" always means
    // aligned-with-contract).
    satisfied: marker.direction === "+" ? matched : !matched,
  };
}
