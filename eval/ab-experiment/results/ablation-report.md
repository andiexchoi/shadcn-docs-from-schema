# Ablation: framing philosophy stripped from prompt.js

What it tests: whether the "Non-negotiable formatting rules" and "Framing philosophy" sections in prompt.js are doing real work, or whether the CLAUDE.md's downstream effect survives without them. Everything else in prompt.js (template, output budget, style-guide, platform-guidelines, semantic-guidelines) stays. Rerun: regenerate the 10 CLAUDE.md files with `ablations/prompt-no-framing.js`, then run the 100-generation B condition using those CLAUDE.md's. No changes to the rubric or the A condition.

## Headline

| Condition | Satisfaction rate | Δ vs A | Mean marker-level Δ (bootstrap 95% CI) |
| --- | --- | --- | --- |
| A (no CLAUDE.md) | 79.9% [77.3%, 82.3%] | — | — |
| B (full CLAUDE.md) | 86.3% [84.0%, 88.3%] | 6.3% | 6.3% [2.3%, 10.6%] |
| B' (framing stripped) | 85.1% [82.8%, 87.2%] | 5.2% | 5.2% [1.5%, 9.3%] |

**B' − B: -1.2% overall**, mean marker-level delta -1.2% (95% CI [-3.9%, 1.3%]).

## Per-component

| Component | A | B | B' | B−A | B'−A | B'−B |
| --- | --- | --- | --- | --- | --- | --- |
| dialog | 58.2% | 77.3% | 60.0% | 19.1% | 1.8% | -17.3% |
| sheet | 59.0% | 75.0% | 80.0% | 16.0% | 21.0% | 5.0% |
| select | 85.4% | 100.0% | 100.0% | 14.6% | 14.6% | 0.0% |
| field | 52.3% | 60.0% | 63.1% | 7.7% | 10.8% | 3.1% |
| tabs | 92.7% | 100.0% | 100.0% | 7.3% | 7.3% | 0.0% |
| dropdownmenu | 100.0% | 100.0% | 97.0% | 0.0% | -3.0% | -3.0% |
| popover | 100.0% | 100.0% | 100.0% | 0.0% | 0.0% | 0.0% |
| toast | 85.6% | 82.2% | 87.8% | -3.3% | 2.2% | 5.6% |
| checkbox | 100.0% | 88.9% | 88.9% | -11.1% | -11.1% | 0.0% |
| radiogroup | 77.8% | 83.3% | 78.9% | 5.6% | 1.1% | -4.4% |

## Per-marker (sorted by |B' − B|)

Only markers where the ablation moved the result by 10pp or more in either direction.

| Component | Marker | Tier | A | B | B' | B'−B |
| --- | --- | --- | --- | --- | --- | --- |
| dialog | `dialog-motion-reduce` | semantic | 0.0% | 80.0% | 0.0% | -80.0% |
| dialog | `dialog-title-question-framing` | semantic | 0.0% | 70.0% | 10.0% | -60.0% |
| sheet | `sheet-side-prop` | structural | 0.0% | 50.0% | 100.0% | 50.0% |
| dialog | `dialog-aria-describedby-explicit` | behavioral | 40.0% | 100.0% | 60.0% | -40.0% |
| toast | `toast-error-has-duration-or-action` | behavioral | 80.0% | 60.0% | 100.0% | 40.0% |
| field | `field-FieldDescription-used` | structural | 0.0% | 20.0% | 50.0% | 30.0% |
| sheet | `sheet-motion-reduce` | semantic | 0.0% | 30.0% | 50.0% | 20.0% |
| radiogroup | `radio-three-items` | structural | 0.0% | 30.0% | 10.0% | -20.0% |
| sheet | `sheet-close-button-aria-label` | structural | 10.0% | 40.0% | 30.0% | -10.0% |
| field | `field-FieldLabel-used` | structural | 0.0% | 0.0% | 10.0% | 10.0% |
| field | `field-label-htmlfor-id-paired` | behavioral | 0.0% | 0.0% | 10.0% | 10.0% |
| field | `field-aria-invalid-paired-with-data-invalid` | behavioral | 0.0% | 10.0% | 0.0% | -10.0% |
| radiogroup | `radio-items-have-ids` | behavioral | 0.0% | 20.0% | 10.0% | -10.0% |
