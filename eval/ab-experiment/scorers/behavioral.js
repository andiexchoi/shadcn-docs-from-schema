// Behavioral scorer: regex checks with require/forbid semantics.
// A behavioral marker has either `requires` (must match), `forbids` (must not
// match), or both.

export function scoreBehavioral(marker, source) {
  if (marker.tier !== "behavioral") throw new Error(`Not a behavioral marker: ${marker.id}`);

  let requiresMatched = true;
  if (marker.requires) {
    requiresMatched = marker.requires.test(source);
  }
  let forbidsMatched = false;
  if (marker.forbids) {
    forbidsMatched = marker.forbids.test(source);
  }

  // "matched" means: does the forbidden-or-required thing appear in source?
  // For a "+" marker with only `requires`, matched = requiresMatched.
  // For a "-" marker with only `forbids`, matched = forbidsMatched.
  // For a marker with both, satisfied requires requiresMatched && !forbidsMatched.
  let satisfied;
  if (marker.direction === "+") {
    satisfied = requiresMatched && !forbidsMatched;
  } else {
    // direction "-" means the thing we're checking is bad. Satisfied = not bad.
    // For a "-" marker with `forbids`: satisfied = !forbidsMatched.
    // For a "-" marker with `requires`: satisfied = !requiresMatched (uncommon).
    if (marker.forbids) satisfied = !forbidsMatched;
    else satisfied = !requiresMatched;
  }

  return {
    id: marker.id,
    tier: "behavioral",
    direction: marker.direction,
    requiresMatched: marker.requires ? requiresMatched : null,
    forbidsMatched: marker.forbids ? forbidsMatched : null,
    satisfied,
  };
}
