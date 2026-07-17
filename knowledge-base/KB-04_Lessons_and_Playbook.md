# KB-04 — Lessons & Playbook

> The hard-won operational knowledge: what went wrong, how it was fixed, the prerequisites/tools, and copy-paste playbooks for environment setup and capture. Read this before repeating any multi-step operation — it will save hours.

---

> 📓 **Odd product behaviour goes in the register, not here.** This file is *our* mistakes and playbooks. Surprising **system** behaviour we can't fix (the repo is clone-only, KB-06 §0) belongs in **`findings/PRODUCT_ANOMALIES_REGISTER.md`** — the standing handoff to engineering. Currently logged there: off-cycle results with an empty `cyclekey`; a "dry" off-cycle run persisting `runmode='actual'`; the untranslated `rail.delete_run` key; the `Advances` run type shipped as SOON/disabled; and zero rules authored tenant-wide.

## 1. Prerequisites & tools

**To run/operate Nabd locally**
- The `nabd/` repo cloned, dependencies installed, app running: **Core :3002**, **Pay :3003** (user runs `docker-compose` / the dev servers locally).
- Mock auth: `ahmed` / `ahmed` (all roles).

**To capture screenshots**
- **Playwright** available inside the running repo (`node_modules`), with Chromium installed (`npx playwright install chromium` once).
- Scripts run **locally by the user** (in-session browser control is unreliable — see §3).

**To build documents**
- **Node** with `docx` and `pptxgenjs` (present in the scratchpad build env).
- Python/`Pillow`/`bs4` optional for parsing/QA.

**Skills / plugins that help**
- `document-skills:docx`, `:pptx`, `:pdf`, `:xlsx` — output-format skills (read the SKILL.md *after* research, before building).
- `canvas-design` / `theme-factory` — visual polish (not required; the custom kutlib owns branding).
- The three Nabd Ops Kit skills (Trainer / Consultant / Documents-Generator) orchestrate the above.

---

## 2. Path & environment gotchas (these bite silently)

- **⚠️ There is more than one copy of the Nabd repo — and the KB pointed at the wrong one.** (2026-07-15) `Nabd-Claude/nabd/` is a **stale PR #114-era checkout**; the backend serves `Payroll_KUT/Nabd_Repo/nabd/` (PR #325). The stale copy has **no `srv/handlers/pay/packs/`**, so grepping it for `martyrs` or `basePayItem` returns **nothing** — a silent false negative that nearly became "the martyrs scheme doesn't exist in the codebase." **Always confirm the serving path first:**
  ```powershell
  $c = Get-NetTCPConnection -LocalPort 4004 -State Listen
  (Get-CimInstance Win32_Process -Filter "ProcessId = $($c.OwningProcess)").CommandLine
  ```
  Generalized lesson: **an empty grep is only evidence if you've proven you're grepping the right tree.**
- **The repo is clone-only** (KB-06 §0) — never push/pull. After a re-clone, the **gitignored** `default-env.json` (SF destination `SuccessFactors2`) and `.agents/skills/` (delegate skills) are **gone** — back them up / reinstall, or SF breaks silently.
- **Two different path namespaces.** The Read/Write tools use Windows paths (`C:\…\Nabd-Claude\…`); the sandbox shell uses Linux mounts (`/sessions/<id>/mnt/Nabd-Claude/…`, outputs at `…/mnt/outputs/…`). Translate deliberately.
- **The Read tool cannot reach the scratchpad/outputs** (`…/outputs/…`) — it's "outside connected folders". Use the **shell** (`cat`, `sed`) for build scripts there, and copy any image you need to *view* into the connected `Nabd-Claude/` folder first, then Read it.
- **OneDrive sync lag.** Files written land on disk but bash reads of OneDrive files can be briefly stale/truncated; the **Read tool is authoritative**, and Write propagates. Editing a capture script? Add a **version banner** (`=== <ID> capture vN ===`) so the console output confirms which version ran.
- **The uploads folder appends a hash suffix on re-upload** (`FD-RUN-01.zip` vs `FD-RUN-01-33aac1e2.zip`). **Always take the newest by mtime** (`ls -t uploads/<ID>*.zip | head -1`). Opening the first/stale zip repeatedly falsely looks like "the capture failed" — this cost real time.

---

## 3. Why capture is scripted, not clicked

In-session Chrome control was tried and is **not** the capture path because:
- It can't persist clean PNGs to files (inline only) and stamps an overlay icon on the page.
- The renderer **freezes intermittently** (`Page.captureScreenshot timed out`), especially after dropdown clicks.

**Resolution:** the Consultant explores/validates a flow live (to learn selectors + confirm it works), then writes a **Playwright script** the user runs locally for the clean, file-based capture. Chrome is for *reconnaissance and validation*, Playwright is for *capture*.

---

## 4. Incident log — what went wrong and the fix

| Symptom | Root cause | Fix |
|---|---|---|
| Dry run scoped **0 employees / EGP 0** | Run was calculated before setup; the cycle/pay-group had no computable earnings | Activate Egypt pack; activate **Basic Salary** feeding all buckets; open cycle; re-run. |
| Only **16 of 78** employees earned | Basic Salary is SF-bound to code 1000; only scenario employees carry it | Accept targeted non-zero run on those 16 (user confirmed data gaps are fine for training). |
| Run wizard **preflight hard-blocks** the dry run | Missing **National ID (16)** + **bank (1)** are preflight blockers even in dry mode | Turn **off** `national_id_on_file` + `bank_accounts_present` in **Preflight Studio**. |
| Targeted run still blocked | The 16 earners are *exactly* the 16 missing National ID (empty intersection with ID-havers) | Same fix — disable the two checks; National ID is SF-owned/read-only, can't be added in-app. |
| Simulate showed **"16 errors"** but numbers computed | Non-fatal per-employee advisories (missing-ID) counted as "errors" on the progress bar | Confirmed via Review = **0 exceptions** + clean payslips; documented the run from Review/Results, not the progress frame. |
| Capture screenshots **all identical** (e.g. 07–12) | Script advanced via **step-rail nodes** which don't jump ahead; flow stalled | Advance via the real **footer buttons** (`Next: …`, `Run simulation`, `Submit for approval`). |
| **FD-RUN-01 shipped with `03-preflight.png` == `04-simulate-ready.png`** (identical md5 `56ae27d7`) — a defect that passed QA and reached the client (found 2026-07-15) | The footer button label is **state-dependent**. With a preflight **warning** present ("Rules authored — No rules authored"), the button is **"Simulate anyway"**, not "Next". The script clicked `/^next$/i`, matched nothing, the wizard never advanced — and the script screenshotted the same screen twice **without noticing**. | Match every label: `/^next$\|simulate anyway\|^continue$\|^proceed$/i`. **The deeper fix:** never let a capture script *assume* it advanced. `capture_fdrun01.mjs` v3 now (a) **asserts** the next step's real card title rendered ("Step 3 · Simulate"), (b) **md5s every PNG in-script and aborts on a duplicate**, (c) polls for the literal "Done. x/y processed". A capture that stalls must **fail loudly**, never emit a duplicate. Port this pattern to every `capture_*.mjs`. |
| `results: (no EGP figure)` on FD-RUN-01 v1 | Screenshot fired **mid-simulation** (fixed wait too short) | **Poll** for "Done"/completion before the results screenshot. |
| Wizard `Next` "not advancing" in Chrome | Pixel-click missed / renderer flaky | Use `find` → click by ref, or the Playwright script; or navigate by **direct URL**. |
| Bank File **"templateKey is required"** | No bank template configured (dropdown empty) | Install a starter in **Bank Templates** (CIB), then it auto-selects. |
| GL Posting / Payslip generate **empty** | They require a **closed/finalized** cycle; ours was an open dry run | Parked — needs an actual posted run + close. |
| `martyrs`/`basePayItem` **not found anywhere in the repo** (2026-07-15) | Grepped the **stale** `Nabd-Claude/nabd/` copy (PR #114), not the repo the backend serves | Confirm the serving path from the `:4004` process, then grep **only** that tree (see §2). |
| `leave_provision.egypt` still flags **after** setting `leaveTimeType` | The engine has a **2nd gate**: `remainingBalance === null` when `EmpTimeAccountBalances` has no non-closed rows (`engine.js:2631`). The table has **0 rows** | Config can't fix it — it's a **data** gap needing SF time-account-balance replication. Don't "resolve" it by setting the field and assuming it's clean; re-run and read the trace. |
| `npm install` stalled in the sandbox | Native modules don't build in the sandbox | Run the app **locally**; the sandbox is for building docs, not hosting the app. |

---

## 5. Playbook — make payroll compute non-zero (Egypt)

1. `/config/packs` → Egypt → **Review & activate** → Activate → confirm. (Installs schemes/items/brackets.)
2. `/config/component-studio` → **Basic Salary (1000)** → Configure → in the **Cumulation contract** toggle **Gross pay, Taxable gross, SI base, Valuation basis** all on → Save → **Activate**.
3. `/control-center` → the Egypt Monthly calendar → ensure the period (e.g. 08.2026) is **open**.
4. If the run wizard preflight blocks on National ID/bank: `/config/preflight` → search each check → toggle **active off** (Trainer/Consultant note it in the project log; restore later).
5. `/control-center` → **Run payroll** → Scope (Dry run) → optionally target the scenario employees → Preflight (CLEAR) → **Run simulation** → Review (Gross→Net, 0 exceptions) → Results explorer for per-employee payslip + breakdown.

## 6. Playbook — Bank File demo (no real run needed)

1. `/config/bank-templates` → **New template** → install **CIB Egypt salary upload** starter.
2. `/bank-file` → **Seed demo data** (dev helper) → it creates & selects approved `bankfile_demo:2026-05` (3 CIB employees, EGP 53,000.49).
3. Ensure the **Bank template** is selected → **Generate bank file** → choose value date → **Generate**.
4. Confirm **download available** + the export appears in **Previous exports**.

## 7. Playbook — capture a flow cleanly

1. **Recon (Chrome):** open the screen, read the DOM (`read_page` / `get_page_text`), note the real footer button labels and native `<select>`s.
2. **Write** `capture_<id>.mjs` (copy an existing one): direct-URL entry where possible, `selectOption` for selects, advance via footer buttons, **poll** async steps, **log** diagnostics, viewport-only PNGs into `Screenshots/<ID>/`.
3. **User runs** it locally → zips `Screenshots/<ID>` → attaches.
4. **Unzip the newest** (`ls -t uploads/<ID>*.zip | head -1`) → `md5sum` (no dup hashes) → view key frames (copy into `Nabd-Claude/` to Read them).
5. Build the doc from the verified set.

## 8. Playbook — build a KUT in 3 formats

1. Copy the closest builder (`build_fdrun01_*` for plain, `build_bp09_*` for config-included) in `…/outputs/kut_build/`.
2. Point `IMG()` at `…/outputs/<id>_real/` and copy the screenshots there.
3. `node build_<id>_docx.js` → `.docx`; `node build_<id>_slides.js` → `.pptx`. (Word + Slides only — no PDF.)
4. QA (KB-02 §6): open the .docx/.pptx, no dup screenshots, metadata, figures match the shots.
5. Copy both to the project's material folder; present the files; update **the project log**.

---

## 9. Playbook — end-to-end retroactive pay (back-dated raise → paid next cycle)

The canonical retro scenario: an employee is paid in month 1 at the old salary; a raise is entered later,
back-dated to month 1; month 2 pays the new base **plus the month-1 difference** as a retro line, and the month-2
payslip shows it. This exercises the real diff engine — verified end-to-end.

**Config prerequisites (all three or retro silently fails — KB-01 §11):**
- The base earning pay item is `isRetro = true` (else the delta is computed then **dropped**).
- The pay item's `effectiveFrom` covers **month 1** (else "no earning assigned").
- The payslip template has body sections incl. a `retro` section (else the payslip is a blank shell).

**Flow (single employee; actions on `/api/payroll-config` + `/api/payroll-cycle-approvals` + `/api/pay-payslips`):**
1. **Month 1 at the OLD salary:** `openDaybreakCycle(cal, m1Start, m1End)` → `cutoffDaybreakCycle` →
   `runDaybreakActual(cycleId, null, "[\"<emp>\"]")` → `submitForApproval` → `approveApproval` ×2 →
   `closeDaybreakCycle` (override `gl_journal_posted` if no local S/4) → `generateBulkPayslips`. Verify the
   result = old gross.
2. **Back-date the raise:** split the base **pay component** (`nabd.core.PayComponents`) — close the old slice at
   `m1Start-1`, insert a new slice `effectiveFrom = m1Start` at the new amount, with `payCompLastModifiedOn` set
   to **after month 1's `cutoffAt`** (that's what marks it a *late-arriving* back-dated change). This is the SF
   input the sync would carry — prefer a real SF change where possible (KB-05 §2 / SEEDED_DATA.md).
3. **Raise the trigger:** run the retro-detector (`runJobNow("retro-detector")`) to auto-detect it, or create it
   with `createRetroTriggers` (scope `list`, `effectiveFrom = m1Start`). Result: a **pending** RetroTrigger.
4. **Month 2:** `openDaybreakCycle` → `cutoffDaybreakCycle` → `runDaybreakActual`. The run consumes the pending
   trigger, replays month 1 with current data, and appends the delta as a **retro line** (`nabd.pay.RetroLines`,
   `sourceCycleId = month 1`). Verify: month-2 gross = new base + delta.
5. `submitForApproval` → `approveApproval` ×2 → `closeDaybreakCycle` → `generateBulkPayslips`. The month-2 payslip
   shows Earnings (new base incl. retro), a **Retroactive Adjustments** line (+delta, tagged month 1), and Net.

**Gotcha:** retro settles *every* prior posted period the change covers. If a later cycle (e.g. a stray closed
August) exists, it also gets a delta — void that out-of-order result to keep a clean two-month demo (KB-01 §11).

---

## 10. Safety & etiquette

- Treat the tenant as potentially live; all safe work was on the **local QA/project tenant**. Never enter credentials/financial data; never post/close a real cycle without the owner's explicit intent.
- Dry runs, demo seeds, and reversible config are the default. Anything irreversible (post, close, delete, regenerate that hard-deletes) is **confirm-gated** — treat it as such.
- Every environment change is **recorded in the project log (KUT_COVERAGE_AUDIT)** so the next session isn't surprised.

---

*Last verified: 2026-07-13. Appended 2026-07-15: the stale-repo-copy trap + clone-only rule (§2) and two new incidents (§4 — the false-negative grep, and the leave_provision 2nd gate). Append new incidents/playbooks as they happen — this file is most valuable when it's honest about what broke.*
