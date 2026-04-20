# Investigation: the two negative-delta components

Two components scored lower under Condition B (CLAUDE.md) than Condition A:
**Checkbox** (−11pp) and **Toast** (−3pp). Both deserve a case-by-case
explanation because neither is a simple "CLAUDE.md made it worse" result.

## 1. Checkbox (−11pp overall, driven by a −100pp marker)

### What the numbers show

| Marker | A | B | Δ |
| --- | --- | --- | --- |
| `checkbox-label-htmlfor` | 10/10 (100%) | 0/10 (0%) | **−100pp** |
| all other Checkbox markers | identical | identical | 0 |

Every Checkbox B output fails the single marker that drives the entire
component-level regression.

### What the B outputs actually do

The Checkbox `CLAUDE.md` explicitly directs agents to pair checkboxes with
`Field` and `FieldLabel`:

> Pair every checkbox with a visible label using Field and FieldLabel.
>
> Wrap each Checkbox in a Field component. Field provides layout, labeling
> context, and state styling hooks.
>
> Use FieldLabel as the visible label. Do not substitute placeholder text or
> adjacent plain text.

Condition B outputs follow this directive literally — they construct a local
`Field` / `FieldLabel` wrapper inside the same file (since the scaffold
doesn't pre-install one) and use `<FieldLabel htmlFor="...">`.

### Why my marker missed it

The pre-registered marker pattern is `/<Label[^>]*htmlFor=/`. It matches
`<Label htmlFor="...">` but not `<FieldLabel htmlFor="...">`. This is the
same class of bug I caught in the dry run on `dialog-title-rendered` — a
primitive that can legitimately go by multiple names, and the regex only
accepts a subset.

### Is this a real regression?

**No.** The B outputs:
- Associate labels with inputs via `htmlFor`/`id` — the same mechanism as A.
- Wrap the control in a `Field` — an additional a11y affordance the A
  outputs lack.
- Follow the CLAUDE.md's guidance literally and correctly.

Semantically, B is at least as accessible as A and arguably more so, because
`Field` adds state-styling hooks (`data-invalid`, `data-disabled`) that A
outputs don't thread through. The `checkbox-label-htmlfor` regression is
entirely a pre-registered-rubric artifact, not a behavioral change.

### Sensitivity analysis

If the marker pattern is broadened to `/<(Field)?Label[^>]*htmlFor=/`, both
conditions score 10/10 on this marker. The Checkbox component-level delta
moves from −11pp to 0pp, and the overall matrix delta moves from +6.3pp to
approximately +7.4pp.

Per §Cherry-picking safeguards of the pre-registration, the rubric is not
amended post-hoc. The pre-registered numbers are reported as the primary
result; the sensitivity-adjusted numbers are reported alongside as a
legitimate observation about the rubric's known imperfection.

## 2. Toast (−3pp, concentrated in two markers)

### What the numbers show

| Marker | A | B | Δ |
| --- | --- | --- | --- |
| `toast-error-has-duration-or-action` | 8/10 (80%) | 6/10 (60%) | −20pp |
| `toast-sentence-case-messages` | 9/10 (90%) | 8/10 (80%) | −10pp |
| all other Toast markers | identical | identical | 0 |

### toast-error-has-duration-or-action: a real marker/guideline mismatch

The pre-registered marker rewards error toasts that include either a
`duration` override or an `action` object, based on the common UX heuristic
that error states need longer display time or a recovery affordance.

The Sonner CLAUDE.md takes a more nuanced position:

> For errors that require a user response, use inline validation or a dialog
> instead.
>
> toast.error(): Use for failures the system detected automatically, where
> no immediate user input is required.

That is: error toasts in Sonner's model are for *automatic, non-recoverable*
failures (logging, background jobs, idle state) where an action button
wouldn't help. Errors that need user response are meant to escalate out of
Sonner entirely.

Condition B outputs follow this more literally, producing briefer
`toast.error(...)` calls without duration/action on 4 of 10 runs. Condition
A outputs reflect the more common default — always add a duration or a
retry action on errors.

Whether this is a "regression" depends on whose guidance you prioritize.
The pre-registered marker encoded the common heuristic; the CLAUDE.md
encodes Sonner's own more-specific view. Both are defensible. The −20pp on
this marker is a legitimate observation that the CLAUDE.md's contract
*diverges from* a widely-held UX default, not that it produces worse code.

### toast-sentence-case-messages: likely judge noise

A: 9/10 satisfied. B: 8/10 satisfied. The single differing run is in the
variance band at n=10 (a single coin flip either direction). Given
semantic markers are LLM-judged and the interpolated template literals
(`\`"${projectName}" deleted\``) introduce ambiguity the judge may resolve
differently across nominally identical runs, this effectively disappears at
modest increases in sample size.

## Summary for the writeup

- **Checkbox's −11pp is a rubric artifact, not a behavioral regression.**
  Fix documented, sensitivity analysis provided.
- **Toast's −3pp is split:** about two-thirds (`toast-error-has-duration-or-action`)
  is a real divergence between the pre-registered marker's heuristic and
  the Sonner CLAUDE.md's specific contract, reported transparently as a
  limitation of the rubric's coverage. The rest is judge noise within the
  variance band.

Neither regression argues that CLAUDE.md produces worse code. Both expose
places where the pre-registered rubric and the CLAUDE.md's guidance are
*not perfectly aligned*, and the output understandably ends up closer to
the CLAUDE.md than to the rubric.
