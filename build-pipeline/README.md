# Nabd KUT Build Pipeline

The branded document pipeline that turns **real screenshots** into KUT deliverables in **Word + Slides**.
Pure local Node — no cloud, no PDF toolchain.

## Setup
```bash
cd build-pipeline
npm install            # installs docx@8.5.0 + pptxgenjs@4.0.1
```

## Layout
```
build-pipeline/
├── kutlib.js              # brand system + docx components (cover, tables, callouts, stepHeader, figureImg…)
├── build_slides.js        # slide helpers (titleSlide, sectionDivider, bullets, table, stepSlide, tips, closing)
├── render.js              # shared helpers
├── build_template.js / build_example.js    # starting points for a NEW builder
├── build_<id>_docx.js     # per-module Word builder   (bp01, bp02, bp09, bp10, bp13, bp18, cfg, fdcal01,
├── build_<id>_slides.js   # per-module slide builder    fdrun01, fdrun02, readiness, payslips, reports,
│                          #                              analytics, retro, loans)
├── build_chrome.js        # intro / section-divider / outro "chrome" deck (for combining decks)
├── build_master_overview.js  # optional one-slide-per-module overview deck
├── assets/                # raptors_icon.png, sap_gold.png (referenced via __dirname)
└── screenshots/<id>_real/ # per-module screenshots (INPUT) — the builders also WRITE the .docx/.pptx here
```

## Build a module
```bash
# 1. copy the module's screenshots into  screenshots/<id>_real/
# 2. build both formats
node build_<id>_docx.js       # → screenshots/<id>_real/<CODE>_<Title>_KUT.docx
node build_<id>_slides.js     # → screenshots/<id>_real/<CODE>_<Title>_KUT.pptx
```

> ⚠️ **The pre-shipped `build_<id>_*.js` are reference examples, not runnable as-is.** Each is a *worked model*
> from a real module, hard-wired to its own `meta`, step list, and `screenshots/<id>_real/` folder — which is
> **not** included in the kit. Running one without its screenshots will fail. Treat them as read-and-copy
> templates. Your only clean starting points are `build_template.js` / `build_example.js` and the closest model.

To author a NEW module, copy the closest pair:
- **Plain KUT** → `build_fdrun01_docx.js` + `build_fdrun01_slides.js`.
- **KUT with a Configuration section** → `build_bp09_*` or `build_cfg_*`.
- **KUT that shows report/analytics/loan content** → `build_reports_*` / `build_analytics_*` / `build_loans_*`.

Set `IMG=(f)=>path.join("screenshots/<id>_real",f)`, the `meta` block, and the step list. Reuse `kutlib.js`
(Word) and `build_slides.js` (Slides) so every doc stays on the same brand and section grammar.

## Combine all module decks into one file (optional)
Build every `build_<id>_slides.js`, then use `build_chrome.js` to generate the intro/transition/outro slides and
merge with PowerPoint (Windows COM) — one program intro, a section-divider transition per business process, and
one closing. See the kit's `knowledge-base/KB-04_Lessons_and_Playbook.md` for the merge recipe and the
background-repair gotcha.

## Rules
- **Word + Slides only.** PDFs are intentionally not generated.
- Screenshots are the source of truth — the builders never invent figures; the prose must match the images.
- Outputs are MB-sized (screenshots embedded). A KB-sized output means an image didn't embed — investigate.
