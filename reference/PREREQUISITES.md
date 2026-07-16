# Prerequisites

What you need before using this kit to operate Nabd and generate KUT material.

## Accounts & access
- **The Nabd application repository** — clone access to the Nabd Core+Pay codebase. This kit treats the app
  repo as **clone-only**: you run it locally, you never push, pull, or open PRs against it.
- **`default-env.json`** for the backend — this file is **gitignored** and carries the SuccessFactors (and any
  S/4) BTP destinations. A fresh clone loses it; back it up and restore it, or the SF connection won't work.
- (Optional) **SuccessFactors** destination for live sync, and an **S/4HANA** BTP destination
  (e.g. `S4HANA` / `YCOA`) for GL account sync and posting. Without S/4 you seed/simulate (see SEEDED_DATA.md).

## Tooling
- **Node.js ≥ 18** (the backend, the front-ends, and the build pipeline all run on Node).
- **Docker** — to run the local Postgres (`NABD_ALT`) the backend points at.
- **@sap/cds** (CAP) — provided by the app repo's `node_modules` after `npm install`.
- **Playwright** + a **Chromium** build — for capturing screenshots. The app repo already depends on
  Playwright; the capture scripts resolve Chromium from there.
- **The build-pipeline dependencies** — `docx` and `pptxgenjs` (run `npm install` in `build-pipeline/`).
- (Optional) **PowerPoint** (Windows) — only if you want to merge per-module decks into one combined deck via
  COM automation. Not required to build the individual KUT documents.

## Knowledge to skim first
- **KB-05 (Environment, Runtime & Data)** — how to bring the stack up and the training dataset.
- **KB-01 (System Guide)** — navigation, config surfaces, the gates.
- **reference/BUSINESS_PROCESSES.md** and **reference/FEATURE_INVENTORY.md** — what to document and where it lives.

## What the kit does NOT require
- No PDF toolchain — the kit produces **Word + Slides** only (PDFs are intentionally not generated).
- No cloud accounts to generate documents — the build pipeline is local Node.
- No write access to the Nabd app repo — everything is done in **application configuration** and this kit's
  own workspace, never by editing the app's code.

## First-run checklist
1. Restore `default-env.json` into the app repo backend, then `npm install` in the app repo.
2. Start Docker Postgres and confirm `NABD_ALT` is up (KB-05 §1).
3. Start the backend (`:4004`) and the two UIs (`:3002`, `:3003`).
4. `npm install` in this kit's `build-pipeline/`.
5. Verify the roster is the controlled 17 (KB-05 §3); re-purge if a sync repopulated it.
