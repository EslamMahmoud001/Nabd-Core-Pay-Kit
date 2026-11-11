# KB-02 — KUT and UAT methodology

## 1. Deliverable boundary

A KUT teaches a verified business task. A UAT proves behavior. Do not mix defect hunting, edge-case matrices, or prerequisites into learner-facing KUT content.

KUT deliverables are exactly two formats: a Word manual (`.docx`) and a matching slide deck (`.pptx`). A PDF is not a required or shipped format.

## 2. KUT structure

Cover → Document Control → Contents → Purpose → Process at a Glance → Roles → Key Concepts → Configuration (only where real configuration is part of the task) → Step-by-Step → Validation → Troubleshooting → Tips → Key Terms → Sign-Off.

Each step contains:

- **PERFORMED BY:** the actual authorized business role.
- **Action:** one learner action.
- **Navigate:** the verified route/menu path.
- **Expected:** visible system state after the action.
- **Screenshot:** one real image showing that state.

English only for the current package. Do not add a Prerequisites section, synthetic-data disclaimer, test case, defect log, or speculative system behavior.

## 3. Evidence workflow

1. Record clone commit, environment, persona/roles, module and feature-release state.
2. Reconcile the process against current docs, routes, handlers/tests, and the running UI.
3. Prepare only legitimate synthetic inputs.
4. Rehearse the flow without capture; record exact labels, statuses, counts and amounts.
5. Write a repeatable Playwright capture based on `templates/capture_TEMPLATE.mjs`.
6. Assert the target state before each screenshot; capture at 1440×1000 with scale factor 2 unless the project requires a different fixed standard.
7. Hash images and reject duplicates. Review each image for secrets, personal data, cropping, overlays, stale loaders and mismatched state.
8. Build both formats from the same fact table and screenshot manifest.
9. Render/open both outputs and visually inspect them before delivery.

## 4. Build pipeline

Work from this kit's `build-pipeline/` directory. Install pinned dependencies, reuse `kutlib.js` for Word and `build_slides.js` for presentations, and copy the closest maintained builder pair. Use paths resolved relative to the builder or explicit CLI inputs; never embed a developer's absolute path.

Builders should accept or clearly declare the screenshot input and output directory. Generated artifacts and screenshots remain untracked. The package scripts and pipeline README are the executable entry points.

## 5. Fact and screenshot control

Maintain a compact evidence manifest per module:

| Step | Role | Route | Expected state | Screenshot | Observed facts/source |
|---|---|---|---|---|---|

Every amount/count/date in prose must trace to a screenshot, approved requirement, or query/API evidence from the same run. If a fact changes, update Word and Slides together.

## 6. KUT release checklist

- Scope is Core + Pay and matches the assigned module.
- Current clone commit/environment/persona are recorded outside the learner narrative.
- Navigation, labels, gates and roles were verified.
- All screenshots are real, unique, legible, correctly cropped and safe to share.
- Every step contains Role/Action/Navigate/Expected/Screenshot.
- Prose figures reconcile to evidence; no placeholders or invented facts remain.
- Required section set and metadata are complete; configuration is included only when needed.
- No prerequisites, UAT/edge content, anomaly register, PDF, or out-of-scope feature appears.
- `.docx` and `.pptx` build successfully and pass visual inspection.
- Coverage audit records output paths, validation, known limitations, and reviewer/approver status.

## 7. UAT structure

UAT includes scope, environment/build, roles, entry criteria, scenario IDs, preconditions, steps, expected result, actual result, evidence, pass/fail, traceability, defect reference, exit criteria and sign-off. Negative, authorization, validation, recovery and destructive-action scenarios belong here.

For each scenario, prove both UI behavior and authoritative backend/data state where material. Never reuse a KUT screenshot as sole proof of a backend authorization or financial-output assertion.

## 8. Done

A module is done only when both formats exist, visual and content QA are green, evidence is traceable, and the coverage audit is updated. “Builder ran” is not completion.
