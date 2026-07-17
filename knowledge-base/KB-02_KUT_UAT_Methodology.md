# KB-02 — KUT / UAT Documentation Methodology

> How Nabd training and testing deliverables are produced: structure, the build pipeline, the screenshot-capture method, content rules, and the QA/audit checklist.
> **Audience:** the Documents-Generator agent (primary) and the Consultant (for capture).
> **Golden rule:** every screenshot is a **real** screen from the running app captured via a repeatable script — never a mockup, never a hand-drawn box.

---

## 1. Deliverable types

| Type | Purpose | Audience | Status |
|---|---|---|---|
| **KUT** (Key User Training) | Teach a key user to *perform* a business process in Nabd, step by step. | Client key users, consultants | Active — the main deliverable |
| **UAT** (User Acceptance Testing) | Give a tester scripted scenarios with expected results to *validate* the system. | Client testers, QA | Planned — reuse the same pipeline + capture, different section set (see §8) |

A KUT teaches *how to do it right*; a UAT asks *does it do the right thing* with pass/fail steps. They share the branded template, the capture pipeline, and the QA discipline.

---

## 2. KUT document structure (the canonical section set)

Every KUT is task-based and follows this order. **No Prerequisites section, no edge-cases, no testing content** — those are explicit client rules (see §5).

1. **Cover** (BP id, title, module, version, status, date, classification)
2. **Document Control** (owner, author, reviewer, approver, environment, classification) + **Revision history**
3. **Contents** (Word TOC field)
4. **Purpose & Learning Outcomes**
5. **Process at a Glance** (trigger, frequency, roles, inputs, outputs, where)
6. **Roles & Responsibilities**
7. **Key Concepts**
8. **[Configuration]** *(optional — include only when the process has a genuine config step; full steps are allowed here)*
9. **Step-by-Step** — tasks broken into steps; each step = **Action · Navigate · Expected result · Screenshot**, tagged with a **"PERFORMED BY"** role callout
10. **Validation & Expected Results**
11. **Common Errors & Troubleshooting**
12. **Tips & Notes** (tip / best-practice / note callouts)
13. **Key Terms**
14. **Training Sign-Off**

Section numbers shift when the optional Configuration section is present (e.g. BP-09 uses Config as §5 and Step-by-Step as §6).

---

## 3. The build pipeline (how the files are actually produced)

> 🟢 **RESCUED (2026-07-15).** The pipeline was recovered from the ephemeral scratchpad **before the sandbox recycled** and now lives, persistent and versioned, at **`build-pipeline/`**. All source is there — `kutlib.js`, `render.js`, `build_slides.js`, every `build_<id>_docx.js` / `_slides.js` — plus `assets/`, the surviving screenshot sets (`screenshots/fdrun01_real`, `bp09_real`, `fdcal01_real`), a **pinned** `package.json` (`docx@8.5.0`, `pptxgenjs@4.0.1`), and a README. A full rebuild of FD-RUN-01 (docx+pdf+pptx) was **verified from the new location** — sizes match the originals.
>
> **Lesson (kept):** the build pipeline is *source code for the deliverables* and must **never** live in a scratchpad. It is now in the persistent workspace — keep it there.
>
> **Prereqs to rebuild on a machine:** Node ≥ 18 + `npm install` in `build-pipeline/` (installs the pinned deps). **That is all** — LibreOffice/Poppler are no longer needed now that PDF is out of scope. `npm install` was run on this machine 2026-07-15 (25 packages).
>
> **🔧 Rescue defects found and FIXED on audit (2026-07-15) — the rescue was incomplete:**
> - **3 builders still pointed at the dead sandbox** `/sessions/pensive-inspiring-goodall/mnt/outputs/…`: `build_fdrun01_slides.js`, `build_readiness_docx.js`, `build_readiness_slides.js`. Only the *docx* fdrun01 builder had been rewritten. Rewritten to relative `screenshots/…`; **zero dead paths now remain** (`grep -rc "/sessions/" *.js`).
>   → The claim that the FD-RUN-01 **pptx** rebuilt "from the new location" could not have held: its path did not exist outside the sandbox. Verify claims by rebuilding, not by reading a summary.
> - **8 of 14 builders could not resolve their screenshots** (`bp01_shots`, `bp02_shots`, `cfg_shots`, `rdy_shots` all missing). Repopulated from `Nabd-User-Manual/Screenshots/{BP-01,BP-02,ConfigGuide,Readiness}/`. **All 14 now resolve.**
> - **`fdrun01_real` held the DEFECTIVE v1.0 screenshots** — `03-preflight.png` and `04-simulate-ready.png` were byte-identical (`56ae27d7`). Replaced with the verified v1.1 set (9 PNGs, **0 duplicate hashes**).
> - **Junk left in the input folders** (LibreOffice `.~lock…#` files, `.tmp` files, a `pdf_…` output dir, a `qa/` jpg dir) despite a cleanup claim — removed; inputs are now PNG-only.
>
> **Verified after repair:** FD-RUN-01 v1.1 **docx (2,164,106 B) + pptx (2,567,076 B)** both build from the persistent folder, and the docx text was extracted and grepped to confirm it prints the **current** figures (200,000.00 / 36,850.17 / 163,149.83). **BP-13** builders were **created** 2026-07-15 (`build_bp13_docx.js` / `_slides.js`, BP-09 model) and also build clean.
>
> **🔴 Still broken — `build_bp18_docx.js` / `_slides.js` are DATA-LESS.** They read `build-pipeline/bp18/blocks.json` (+ its images), and **the `bp18/` directory did not survive the rescue**. The builders therefore cannot run. BP-18 was originally generated from a **client-provided HTML**, not from a live capture, so its first-draft images are **not verified real app screenshots** — which violates the golden rule above. **BP-18 needs a real capture (`capture_bp18.mjs` does not exist) and a rebuilt builder**, not a data restore. Tracked in the project log (KUT_COVERAGE_AUDIT).

Current location: **`build-pipeline/`** (run builders **from that folder**; paths inside are relative to it). They run with Node.

**Shared library:**
- `kutlib.js` — the brand system + docx components: `coverPage`, `buildDoc`, `writeDoc`, `H1/H2/P/R`, `kvTable`, `dataTable`, `callout` (kinds: note/warn/caution/tip/best/role), `bullet`, `stepHeader`, `figureImg` (reads real PNG aspect ratio from IHDR), `spacer`, `TableOfContents`. Brand palette: teal `#43becc`, navy `#121b43`, magenta `#8e257a`, lime `#bcd647`, crimson `#e21f4a`.
- `build_slides.js` — slide helpers: `titleSlide`, `sectionDivider`, `bulletsSlide`, `tableSlide`, `stepSlide` (embeds the real screenshot when `imgPath` given), `tipsSlide`, `closingSlide`; exports `W/H/M/C`.

**Per-document builders** (pattern — copy the closest one and adapt):
- `build_<id>_docx.js` — imports kutlib, defines `meta`, `IMG(f)` → the real-screenshots folder, and pushes sections into a `body[]` array, then `writeDoc(buildDoc(meta, body), OUT/…docx)`.
- `build_<id>_slides.js` — imports build_slides, defines `STEPS[]` (each with tag/role/n/action/nav/expected/img/cap), builds the deck.

**The formats — TWO, not three (client decision, 2026-07-15):**
1. **Word** — `node build_<id>_docx.js` → `.docx`.
2. **Slides** — `node build_<id>_slides.js` → `.pptx` (pptxgenjs).

> ⛔ **PDF is OUT OF SCOPE.** Deliverables are **Word + Slides only**. PDF was the only reason a document
> converter (LibreOffice) was ever needed, so **no converter is a prerequisite**. Do not generate PDFs.
>
> ⚠️ **Any legacy PDFs in the project's material folder are unmaintained.** They will not be regenerated, so any doc whose content changes leaves a **stale PDF that contradicts the current Word/Slides**. Retire the PDF when you re-issue a document (FD-RUN-01's PDF is the live example — its figures are wrong).

**Delivery:** copy both (docx + pptx) to the project's material folder (e.g. `Nabd-User-Manual/Material-Remediated/`), then present the files.

**Closest models to copy:** `build_fdrun01_docx.js` / `_slides.js` (clean 10-section KUT) and `build_bp09_docx.js` / `_slides.js` (KUT *with* a Configuration section).

---

## 4. Screenshot capture method (the reliable pipeline)

**Method: local Playwright capture scripts that the user runs, not in-session browser control.**

Why: in-session Chrome control (a) can't save clean PNGs to disk, (b) adds an on-screen overlay icon, and (c) the renderer freezes intermittently. Playwright driven locally is clean, file-based, and reliable.

**Script conventions** (`…/Nabd-User-Manual/Screenshots/capture_<id>.mjs`):
- `loadChromium()` resolves Playwright from the repo's `node_modules` via `createRequire` (tries cwd, `app-pay`, `..`).
- Context: `viewport 1440×1000`, `deviceScaleFactor 2`, `httpCredentials {username:'ahmed',password:'ahmed'}`, cookie `dev_user=ahmed`.
- `shot(page,name)` → viewport-only PNG into `Screenshots/<ID>/`.
- **Advance wizards via the real footer buttons** (`getByRole('button',{name:/…/})`), **not** the step-rail nodes (rail nodes usually don't jump ahead — this stalled BP-13).
- **Native `<select>`** → Playwright `selectOption` (reliable); custom menus → click + option.
- Prefer **direct URLs** to enter deep screens when a click is flaky (e.g. the run wizard at `/runs/new?cycleId=<uuid>`).
- **Log diagnostics** the user can paste back: e.g. `preflight: CLEAR — N in scope`, `results: EGP …`. This lets you verify success without seeing the images.
- **Poll for async completion** (simulate/generate) before screenshotting — a fixed `wait` often fires mid-progress and captures a spinner (this happened on FD-RUN-01 v1).

**Transfer loop:** user runs the script → zips the `Screenshots/<ID>` folder → attaches it. **Always unzip the newest by timestamp** (`ls -t uploads/<ID>*.zip | head -1`) — re-uploads get a hash suffix and the *first* match is stale (this bug wasted real time). Verify the set with `md5sum` (identical hashes = a stalled/duplicated flow) before building.

---

## 5. Content rules (client-confirmed — do not violate)

- **English only** for now (the app is bilingual EN/AR; Arabic deferred).
- **No Prerequisites section.** A well-sequenced flow means each task's starting state was produced by the previous task.
- **No edge cases, no testing content** in a KUT — it teaches, it doesn't test. (Edge/negative cases belong in UAT.)
- **Serve all roles** that use the process (multi-role), each step tagged **"PERFORMED BY"**.
- **Configuration steps may be included in full** when the process genuinely has them (their own section).
- **One screenshot per action** — not only the final-state screen.
- Keep executive-clear prose; separate facts / assumptions / risks / recommendations.

---

## 6. QA / Audit checklist (run before every delivery)

**A. Screenshots**
- [ ] Every screenshot is a real captured screen (no placeholder).
- [ ] The set has **no byte-identical duplicates** (`md5sum`) — duplicates mean a stalled capture; re-capture.
- [ ] Each step's screenshot actually shows the state the step describes.
- [ ] Sensitive data acceptable for the audience (account numbers masked; PII per client call).

**B. Content**
- [ ] Section set matches §2; numbering consistent; optional Config section only if real.
- [ ] No Prerequisites / edge-cases / testing content.
- [ ] Every step has Action · Navigate · Expected · Screenshot + a PERFORMED BY tag.
- [ ] Roles, Validation, Troubleshooting, Key Terms, Sign-Off all present and accurate.
- [ ] Numbers/figures in prose match the screenshots (e.g. totals, counts).

**C. Metadata**
- [ ] Cover + Document Control complete: BP id, title, module, version, status, date, **environment**, classification.
- [ ] Author/Reviewer/Approver set (or explicitly "Pending") — confirm real names with the owner.
- [ ] Revision history updated.

**D. Build integrity**
- [ ] **Both formats** produced (**docx + pptx** — PDF is out of scope, see §3) and non-trivial in size (screenshots embedded → docx/pptx are MBs, not KBs).
- [ ] **Figures in the built file match the current KB baseline** — extract the text and grep it (`zipfile` → `word/document.xml`), don't trust the builder source. Old figures may legitimately appear **only** in the revision-history row.
- [ ] Any **stale PDF** for this doc is retired from the material folder (PDFs are no longer regenerated).
- [ ] Branded header/footer + PERFORMED BY tags render correctly.
- [ ] Files delivered to the project's material folder and presented.

**E. Consistency across the set**
- [ ] Same template, palette, section grammar as the other delivered KUTs.
- [ ] Status updated in the project log.

**F. Coverage (the set-level check — not per-document)**
- [ ] **`KUT_COVERAGE_AUDIT.md` updated** — §A (the lifecycle step this doc now teaches) and §B (the business cycle it covers).
- [ ] Every lifecycle step the doc claims to teach was **actually executed in the tenant**, with evidence recorded in the ledger. A step we never ran is not documentable.
- [ ] The doc is only marked **Covered** when *delivered with real screenshots* — **draft-only material is not coverage**.
- [ ] Any step the doc *doesn't* reach is named as a gap in the ledger rather than left implied.

> **Why F exists:** per-document QA (A–E) can pass on every file while the *set* still fails to teach the real process. The 2026-07-15 audit found exactly that: every delivered doc passed its own QA, yet **cut off / actual run / approve / close — the operational heart of a payroll period — had no material at all**, so the whole set taught only the *dry* path. A key user following it could not actually pay anyone. Per-document QA cannot catch that; only the ledger can.

---

## 7. Definition of Done (a KUT is "done" when)

Real per-step screenshots (no dups) + all 3 formats built and QA-passed + delivered to the project's material folder + presented + **the project log status row updated**. Any environment setup used to produce it (config activated, preflight checks toggled, demo seeded) is recorded in the project log/KB-04.

---

## 8. UAT deliverable shape (when we build these)

Same pipeline + capture, but the section set is test-oriented:
1. Cover + Document Control
2. Scope & objectives
3. Roles & environment
4. **Test scenarios** — each: ID, title, preconditions, **steps with expected result per step**, test data, pass/fail + actual-result columns, evidence (screenshot) slot
5. Traceability (scenario → business process/feature)
6. Defect log reference
7. Entry/exit criteria & sign-off

UAT *does* include negative/edge scenarios (unlike KUT). The `TestScripts/` folder in the project is the starting inventory for these.

---

*Last verified: 2026-07-13. Keep the pipeline paths and the capture conventions in sync with reality; if the build scripts move out of the scratchpad into the repo, update §3.*
