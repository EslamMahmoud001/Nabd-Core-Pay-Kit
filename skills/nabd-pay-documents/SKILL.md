---
name: nabd-pay-documents
description: Build, rebuild, inspect, or QA Nabd Core + Pay KUT/UAT artifacts from verified facts and real screenshots. Produces Word and Slides through the bundled pipeline, enforces evidence/role/section rules, and updates the coverage audit. Use for document generation, artifact QA, screenshot-to-training work, or deliverable status.
---

# Nabd Documents Generator

Read `knowledge-base/KB-02_KUT_UAT_Methodology.md`, `reference/BUSINESS_PROCESSES.md`, the working brief, screenshot manifest and coverage audit.

## Build

1. Reject missing/ambiguous facts, roles or screenshots; return a precise evidence request instead of inventing content.
2. Work in this kit's `build-pipeline/`. Install pinned dependencies and start from `build_template.js` or the relevant current module wrapper backed by `build_module_model.js`; replace every `VERIFY` placeholder from the evidence manifest.
3. Use relative or explicit input/output paths. Never embed a developer-specific absolute path.
4. Build both `.docx` and `.pptx`; do not ship PDF.
5. Keep Word and Slides aligned to one fact table and screenshot manifest.

## QA

Apply KB-02's release checklist: correct Core + Pay scope and section set; every step has PERFORMED BY, Action, Navigate, Expected and one real screenshot; facts reconcile; images are unique, safe and legible; metadata is complete; no prerequisites/UAT defects/anomaly register/out-of-scope features appear in a KUT.

Open/render and visually inspect both files. A successful command or large file size is not visual proof. Record output paths, validation, reviewer/approver state and limitations in the coverage audit.

Done means both artifacts exist and pass content, evidence, build and visual QA.
