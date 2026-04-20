# Ablations report

Ablations loaded: no-framing, no-platform-guidelines. Each variant regenerates the 10 CLAUDE.md files with one section of `prompt.js` removed, then runs 100 B-condition generations with those CLAUDE.md files as context. Comparisons are against the main B (full CLAUDE.md) and A (no CLAUDE.md) baselines from the primary matrix.

## Headline

| Condition | Satisfaction rate | Δ vs A | Mean marker-level Δ vs B (bootstrap 95% CI) |
| --- | --- | --- | --- |
| A (no CLAUDE.md) | 79.9% [77.3%, 82.3%] | — | — |
| B (full prompt.js) | 86.3% [84.0%, 88.3%] | 6.3% | — |
| B′ (framing stripped) | 85.1% [82.8%, 87.2%] | 5.2% | -1.2% [-3.8%, 1.3%] |
| B″ (platform-guidelines stripped) | 82.9% [80.5%, 85.1%] | 3.0% | -3.4% [-6.6%, -0.6%] |

## Per-component

| Component | A | B | B′ (framing stripped) | B″ (platform-guidelines stripped) |
| --- | --- | --- | --- | --- |
| dialog | 58.2% | 77.3% | 60.0% | 63.6% |
| sheet | 59.0% | 75.0% | 80.0% | 71.0% |
| select | 85.4% | 100.0% | 100.0% | 100.0% |
| field | 52.3% | 60.0% | 63.1% | 54.6% |
| tabs | 92.7% | 100.0% | 100.0% | 100.0% |
| radiogroup | 77.8% | 83.3% | 78.9% | 77.8% |
| dropdownmenu | 100.0% | 100.0% | 97.0% | 100.0% |
| popover | 100.0% | 100.0% | 100.0% | 100.0% |
| toast | 85.6% | 82.2% | 87.8% | 77.8% |
| checkbox | 100.0% | 88.9% | 88.9% | 88.9% |

## Per-marker: B′ (framing stripped) vs. full B (moved ≥ 10pp)

| Component | Marker | Tier | B (full) | B′ (framing stripped) | Δ |
| --- | --- | --- | --- | --- | --- |
| dialog | `dialog-motion-reduce` | semantic | 80.0% | 0.0% | -80.0% |
| dialog | `dialog-title-question-framing` | semantic | 70.0% | 10.0% | -60.0% |
| sheet | `sheet-side-prop` | structural | 50.0% | 100.0% | 50.0% |
| dialog | `dialog-aria-describedby-explicit` | behavioral | 100.0% | 60.0% | -40.0% |
| toast | `toast-error-has-duration-or-action` | behavioral | 60.0% | 100.0% | 40.0% |
| field | `field-FieldDescription-used` | structural | 20.0% | 50.0% | 30.0% |
| sheet | `sheet-motion-reduce` | semantic | 30.0% | 50.0% | 20.0% |
| radiogroup | `radio-three-items` | structural | 30.0% | 10.0% | -20.0% |
| sheet | `sheet-close-button-aria-label` | structural | 40.0% | 30.0% | -10.0% |
| field | `field-FieldLabel-used` | structural | 0.0% | 10.0% | 10.0% |
| field | `field-label-htmlfor-id-paired` | behavioral | 0.0% | 10.0% | 10.0% |
| field | `field-aria-invalid-paired-with-data-invalid` | behavioral | 10.0% | 0.0% | -10.0% |
| radiogroup | `radio-items-have-ids` | behavioral | 20.0% | 10.0% | -10.0% |

## Per-marker: B″ (platform-guidelines stripped) vs. full B (moved ≥ 10pp)

| Component | Marker | Tier | B (full) | B″ (platform-guidelines stripped) | Δ |
| --- | --- | --- | --- | --- | --- |
| dialog | `dialog-motion-reduce` | semantic | 80.0% | 0.0% | -80.0% |
| dialog | `dialog-title-question-framing` | semantic | 70.0% | 0.0% | -70.0% |
| toast | `toast-error-has-duration-or-action` | behavioral | 60.0% | 0.0% | -60.0% |
| sheet | `sheet-side-prop` | structural | 50.0% | 100.0% | 50.0% |
| field | `field-FieldError-used` | structural | 50.0% | 0.0% | -50.0% |
| sheet | `sheet-close-button-aria-label` | structural | 40.0% | 10.0% | -30.0% |
| sheet | `sheet-aria-describedby-explicit` | behavioral | 30.0% | 0.0% | -30.0% |
| sheet | `sheet-motion-reduce` | semantic | 30.0% | 0.0% | -30.0% |
| radiogroup | `radio-three-items` | structural | 30.0% | 0.0% | -30.0% |
| field | `field-FieldDescription-used` | structural | 20.0% | 0.0% | -20.0% |
| radiogroup | `radio-items-have-ids` | behavioral | 20.0% | 0.0% | -20.0% |
| toast | `toast-sentence-case-messages` | semantic | 80.0% | 100.0% | 20.0% |
| dialog | `dialog-case-sensitivity-hint` | semantic | 0.0% | 10.0% | 10.0% |
