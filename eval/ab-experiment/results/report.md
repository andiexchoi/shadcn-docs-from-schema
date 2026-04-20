# A/B Experiment Results

*Generated from `200` scored runs. See `PRE_REGISTRATION.md` for methodology.*

## Headline

Across **104 markers × 100 runs per condition × 2 conditions**, CLAUDE.md changed the fraction of pre-registered guidelines satisfied:

- **Condition A (no CLAUDE.md):** 79.9% [77.3%, 82.3%]
- **Condition B (CLAUDE.md in system prompt):** 86.3% [84.0%, 88.3%]
- **Overall absolute delta (B − A):** 6.3%
- **Mean marker-level delta (bootstrap 95% CI, 1000 resamples over markers):** 6.3% [2.3%, 10.4%]
- **Sign test (null: median marker-level delta = 0):** 21 positive / 4 negative of 25 non-zero markers, two-sided p = 0.0009

## By tier

| Tier | Markers | A: k/n (p, 95% CI) | B: k/n (p, 95% CI) | Mean Δ | Bootstrap 95% CI | Sign test p |
| --- | --- | --- | --- | --- | --- | --- |
| structural | 46 | 377/460 (82.0% [78.1%, 85.4%]) | 409/460 (88.9% [85.7%, 91.6%]) | 7.0% | [3.0%, 12.0%] | 0.0020 |
| behavioral | 33 | 267/330 (80.9% [76.2%, 85.0%]) | 272/330 (82.4% [77.9%, 86.4%]) | 1.5% | [-6.7%, 9.1%] | 0.5078 |
| semantic | 25 | 187/250 (74.8% [68.9%, 80.1%]) | 216/250 (86.4% [81.5%, 90.4%]) | 11.6% | [2.0%, 23.2%] | 0.2188 |

## By component

| Component | Markers | A: k/n (%) | B: k/n (%) | Δ |
| --- | --- | --- | --- | --- |
| dialog | 11 | 64/110 (58.2%) | 85/110 (77.3%) | 19.1% |
| sheet | 10 | 59/100 (59.0%) | 75/100 (75.0%) | 16.0% |
| select | 13 | 111/130 (85.4%) | 130/130 (100.0%) | 14.6% |
| field | 13 | 68/130 (52.3%) | 78/130 (60.0%) | 7.7% |
| tabs | 11 | 102/110 (92.7%) | 110/110 (100.0%) | 7.3% |
| dropdownmenu | 10 | 100/100 (100.0%) | 100/100 (100.0%) | 0.0% |
| popover | 9 | 90/90 (100.0%) | 90/90 (100.0%) | 0.0% |
| toast | 9 | 77/90 (85.6%) | 74/90 (82.2%) | -3.3% |
| checkbox | 9 | 90/90 (100.0%) | 80/90 (88.9%) | -11.1% |
| radiogroup | 9 | 70/90 (77.8%) | 75/90 (83.3%) | 5.6% |

## Per-marker breakdown

Markers with p ∈ [30%, 70%] in either condition are flagged as **noisy** (high variance at this sample size).

| Component | Marker | Tier | A: p (95% CI) | B: p (95% CI) | Δ | Noisy |
| --- | --- | --- | --- | --- | --- | --- |
| select | `select-uses-groups-for-regions` | semantic | 0.0% [0.0%, 30.8%] | 100.0% [69.2%, 100.0%] | 100.0% |  |
| dialog | `dialog-motion-reduce` | semantic | 0.0% [0.0%, 30.8%] | 80.0% [44.4%, 97.5%] | 80.0% |  |
| dialog | `dialog-title-question-framing` | semantic | 0.0% [0.0%, 30.8%] | 70.0% [34.8%, 93.3%] | 70.0% | ⚠︎ |
| tabs | `tabs-three-triggers` | structural | 30.0% [6.7%, 65.2%] | 100.0% [69.2%, 100.0%] | 70.0% | ⚠︎ |
| dialog | `dialog-aria-describedby-explicit` | behavioral | 40.0% [12.2%, 73.8%] | 100.0% [69.2%, 100.0%] | 60.0% | ⚠︎ |
| sheet | `sheet-side-prop` | structural | 0.0% [0.0%, 30.8%] | 50.0% [18.7%, 81.3%] | 50.0% | ⚠︎ |
| select | `select-placeholder-on-value` | behavioral | 50.0% [18.7%, 81.3%] | 100.0% [69.2%, 100.0%] | 50.0% | ⚠︎ |
| field | `field-FieldError-used` | structural | 0.0% [0.0%, 30.8%] | 50.0% [18.7%, 81.3%] | 50.0% | ⚠︎ |
| select | `select-has-value` | structural | 60.0% [26.2%, 87.8%] | 100.0% [69.2%, 100.0%] | 40.0% | ⚠︎ |
| sheet | `sheet-close-button-aria-label` | structural | 10.0% [0.3%, 44.5%] | 40.0% [12.2%, 73.8%] | 30.0% | ⚠︎ |
| sheet | `sheet-aria-describedby-explicit` | behavioral | 0.0% [0.0%, 30.8%] | 30.0% [6.7%, 65.2%] | 30.0% | ⚠︎ |
| sheet | `sheet-motion-reduce` | semantic | 0.0% [0.0%, 30.8%] | 30.0% [6.7%, 65.2%] | 30.0% | ⚠︎ |
| radiogroup | `radio-three-items` | structural | 0.0% [0.0%, 30.8%] | 30.0% [6.7%, 65.2%] | 30.0% | ⚠︎ |
| field | `field-FieldDescription-used` | structural | 0.0% [0.0%, 30.8%] | 20.0% [2.5%, 55.6%] | 20.0% |  |
| radiogroup | `radio-items-have-ids` | behavioral | 0.0% [0.0%, 30.8%] | 20.0% [2.5%, 55.6%] | 20.0% |  |
| field | `field-description-on-a-field` | semantic | 80.0% [44.4%, 97.5%] | 100.0% [69.2%, 100.0%] | 20.0% |  |
| field | `field-aria-invalid-paired-with-data-invalid` | behavioral | 0.0% [0.0%, 30.8%] | 10.0% [0.3%, 44.5%] | 10.0% |  |
| dialog | `dialog-description-rendered` | structural | 90.0% [55.5%, 99.7%] | 100.0% [69.2%, 100.0%] | 10.0% |  |
| sheet | `sheet-description-rendered` | structural | 90.0% [55.5%, 99.7%] | 100.0% [69.2%, 100.0%] | 10.0% |  |
| sheet | `sheet-onOpenChange` | behavioral | 90.0% [55.5%, 99.7%] | 100.0% [69.2%, 100.0%] | 10.0% |  |
| tabs | `tabs-three-content-panes` | structural | 90.0% [55.5%, 99.7%] | 100.0% [69.2%, 100.0%] | 10.0% |  |
| dialog | `dialog-title-rendered` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dialog | `dialog-variant-destructive` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dialog | `dialog-no-invented-variant` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dialog | `dialog-onOpenChange` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dialog | `dialog-no-manual-setOpen-toggle` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dialog | `dialog-case-sensitivity-hint` | semantic | 0.0% [0.0%, 30.8%] | 0.0% [0.0%, 30.8%] | 0.0% |  |
| sheet | `sheet-title-rendered` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| sheet | `sheet-no-hardcoded-transform` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| sheet | `sheet-title-names-purpose` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| sheet | `sheet-submit-path-clear` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-has-trigger` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-has-content` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-has-item` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-no-native-select` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-onValueChange` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-no-onChange` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-label-htmlfor` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-no-hardcoded-combobox-aria` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-no-custom-keydown` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| select | `select-realistic-timezone-list` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| field | `field-FieldLabel-used` | structural | 0.0% [0.0%, 30.8%] | 0.0% [0.0%, 30.8%] | 0.0% |  |
| field | `field-Field-or-FieldGroup-used` | structural | 0.0% [0.0%, 30.8%] | 0.0% [0.0%, 30.8%] | 0.0% |  |
| field | `field-no-raw-label` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| field | `field-schema-resolver` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| field | `field-form-library` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| field | `field-label-htmlfor-id-paired` | behavioral | 0.0% [0.0%, 30.8%] | 0.0% [0.0%, 30.8%] | 0.0% |  |
| field | `field-submit-tied-to-form-state` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| field | `field-typed-submit-handler` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| field | `field-reasonable-validation` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| tabs | `tabs-has-list` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| tabs | `tabs-has-trigger` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| tabs | `tabs-has-content` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| tabs | `tabs-default-or-controlled` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| tabs | `tabs-no-hardcoded-role-tab` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| tabs | `tabs-no-tabindex-hardcoded` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| tabs | `tabs-no-custom-arrow-keys` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| tabs | `tabs-meaningful-content` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| tabs | `tabs-values-semantic` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-has-trigger` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-has-content` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-has-item` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-asChild-on-trigger` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-separator-used` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-onSelect-not-onClick` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-billing-disabled-via-prop` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-no-hardcoded-menu-role` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-signout-distinguished` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| dropdownmenu | `ddm-freeplan-as-prop` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| popover | `popover-has-trigger` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| popover | `popover-has-content` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| popover | `popover-asChild-on-trigger` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| popover | `popover-positioning-props` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| popover | `popover-no-custom-escape` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| popover | `popover-no-inline-transform` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| popover | `popover-controlled-or-uncontrolled` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| popover | `popover-real-color-ui` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| popover | `popover-controlled-value` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| toast | `toast-imports-sonner` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| toast | `toast-success-call` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| toast | `toast-error-call` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| toast | `toast-no-radix-toast-import` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| toast | `toast-no-homemade-toast` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| toast | `toast-two-code-paths` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| toast | `toast-toaster-mount-noted` | semantic | 0.0% [0.0%, 30.8%] | 0.0% [0.0%, 30.8%] | 0.0% |  |
| checkbox | `checkbox-uses-primitive` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| checkbox | `checkbox-no-native-input` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| checkbox | `checkbox-indeterminate-state` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| checkbox | `checkbox-onCheckedChange` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| checkbox | `checkbox-no-onChange` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| checkbox | `checkbox-master-derives-state` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| checkbox | `checkbox-master-toggles-all` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| checkbox | `checkbox-human-labels` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| radiogroup | `radio-group-root` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| radiogroup | `radio-group-item` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| radiogroup | `radio-no-native-input` | structural | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| radiogroup | `radio-value-at-root` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| radiogroup | `radio-no-name-on-items` | behavioral | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| radiogroup | `radio-custom-reveals-input` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| radiogroup | `radio-sensible-default` | semantic | 100.0% [69.2%, 100.0%] | 100.0% [69.2%, 100.0%] | 0.0% |  |
| toast | `toast-sentence-case-messages` | semantic | 90.0% [55.5%, 99.7%] | 80.0% [44.4%, 97.5%] | -10.0% |  |
| dialog | `dialog-no-placeholder-projectname` | behavioral | 10.0% [0.3%, 44.5%] | 0.0% [0.0%, 30.8%] | -10.0% |  |
| toast | `toast-error-has-duration-or-action` | behavioral | 80.0% [44.4%, 97.5%] | 60.0% [26.2%, 87.8%] | -20.0% | ⚠︎ |
| checkbox | `checkbox-label-htmlfor` | behavioral | 100.0% [69.2%, 100.0%] | 0.0% [0.0%, 30.8%] | -100.0% |  |
