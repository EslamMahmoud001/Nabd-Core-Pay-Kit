---
description: Build the KUT Word + Slides for a business process from its captured screenshots.
argument-hint: <business-process, e.g. BP-10 or "Reports">
---

Use the **nabd-documents-generator** skill to build the KUT deliverable for: **$ARGUMENTS**

1. Read the kit's `knowledge-base/KB-02_KUT_UAT_Methodology.md` (section set, content rules, QA checklist) and
   `reference/BUSINESS_PROCESSES.md` (what this module must contain).
2. Confirm the screenshot set exists and is de-duplicated (`Screenshots/<ID>/`). If facts or shots are missing,
   request them — never invent screens, figures, or steps.
3. In `build-pipeline/` (run `npm install` there once), copy the closest builder pair: `build_fdrun01_*`
   (plain KUT) or `build_bp09_*` / `build_cfg_*` (KUT with a Configuration section). Point `IMG()` at
   `screenshots/<id>_real/` and copy the screenshots there. Reuse `kutlib.js` (Word) and `build_slides.js` (Slides).
4. Build **both formats only**: `node build_<id>_docx.js` and `node build_<id>_slides.js`. **No PDF.**
5. Run the QA checklist (KB-02 §6): real, non-duplicate screenshots; correct section set; every step has
   Action·Navigate·Expected·Screenshot + PERFORMED BY; figures match the shots; branded header/footer render.
6. Deliver to the project material folder, present the files with a one-line outcome, and update the project log
   (`KUT_COVERAGE_AUDIT.md`).
