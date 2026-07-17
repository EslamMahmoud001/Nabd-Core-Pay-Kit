# KB-01 — Nabd System Guide

> Deep, first-hand knowledge of the Nabd application: architecture, navigation, configuration surfaces, data model, business processes, and the gotchas that actually matter when operating or documenting it.
> **Audience:** the Consultant and Documents-Generator agents (and any human doing the same work).
> **Maintenance:** the Trainer updates this whenever the repo changes. Every claim here should be verifiable in the running app or the repo. When something here no longer matches reality, fix it and note the change in the project log.

---

## 1. What Nabd is

Nabd is a **SuccessFactors-integrated HR + payroll platform**. Two front-end apps sit on one CAP (SAP Cloud Application Programming) backend with a PostgreSQL database:

| App | Purpose | Local URL |
|---|---|---|
| **Nabd Core** | SuccessFactors integration + employee master-data read model | `http://localhost:3002` |
| **Nabd Pay** | Payroll engine, cycles, runs, disbursement, config | `http://localhost:3003` |

- **Backend:** CAP (Node.js) under `srv/` — services in `srv/services/`, business logic in `srv/handlers/`, data model in `db/`.
- **DB:** PostgreSQL in production/local (`@cap-js/postgres`); an in-memory SQLite profile exists for tests. The running local app uses Postgres (via `docker-compose`).
- **Auth (local/dev):** mock auth — user `ahmed` / password `ahmed` carries **all roles**. Playwright/automation uses HTTP basic creds `ahmed:ahmed` plus a `dev_user=ahmed` cookie.
- **Payroll engine:** internally called **Daybreak** (results are `DaybreakResults`, cycles are `Cycles`, the engine lives in `srv/handlers/pay/daybreak/`).

---

## 2. Architecture & where things live in the repo

> ⚠️ **Read KB-05 §1 before grepping.** Multiple copies of this repo exist at different commits. The tree below describes the **live** repo — as of 2026-07-15 that is `Payroll_KUT/Nabd_Repo/nabd/` (PR #325), **not** `Nabd-Claude/nabd/` (stale, PR #114, and missing `srv/handlers/pay/packs/` entirely). Confirm the serving path from the process on `:4004`. The repo is **clone-only** — never push or pull (KB-06 §0).

```
<live-repo-root>/
├── app-core/        # Nabd Core front-end (React/Vite) — :3002
├── app-pay/         # Nabd Pay front-end (React/Vite) — :3003
│   └── src/
│       ├── App.jsx              # route table (every page → route)
│       ├── pages/               # one folder/file per screen
│       ├── components/          # shared + per-feature components
│       └── services/api.js      # API client (all backend calls)
├── srv/
│   ├── services/                # CAP service definitions (.cds) + wiring (.js)
│   └── handlers/
│       ├── core/                # SF sync, employee upserters, transforms
│       └── pay/                 # payroll: daybreak/, config/, outputs/, glposting/, packs/
├── db/                          # CDS data model (core/, pay/, platform/)
├── docs/                        # canonical product docs (pay/, deployment/, runbooks/)
├── scripts/                     # reseed-egypt-pack.js, etc.
└── test/                        # cds.test suites
```

**Fastest way to answer "how does screen X work":**
1. Find the route in `app-pay/src/App.jsx` → component in `app-pay/src/pages/…`.
2. Read the page component for its steps, button labels, and `api.<area>.<call>()` usage.
3. Trace the API call to `srv/services/pay/*.cds` (contract) and `srv/handlers/pay/**` (logic).
4. Only inspect the DB model in `db/` when the field-level truth matters.

Avoid broad repo scans; targeted reads by route → page → handler are far faster and were the reliable path all session.

---

## 3. Navigation map (Nabd Pay, :3003)

Left nav is grouped. Routes confirmed this session:

**PAYROLL**
- `/home` — Home
- `/control-center` — Payroll Control Center (the operator cockpit; drives each calendar's open period: run → approve → post → close). Has the enabled **Run payroll** entry point per calendar row.
- `/readiness` — Pre-Cycle Health (the readiness gate; blockers vs warnings)
- `/runs` — Payroll Runs (list of runs; open a run → Results explorer)
- `/payroll/spot-run` — Spot Run
- `/offcycle` — Off-Cycle (bonus/commission/advance/etc. workbench + wizard)
- `/retro` — Retro
- `/results` — Results (per-employee payslip + verification breakdown explorer)
- `/employees` — Employees (workforce in scope; synced from SF; has **Sync** button)

**PAYMENTS**
- `/payslips` — Payslip **Templates** (config) ; `/payslips/generate` — bulk generate (4-step)
- `/posting` — G/L Posting (journal → post to S/4 → history)
- `/bank-file` — Bank File (salary-credit file generation)
- `/loans` — Loans

**INSIGHTS:** `/analytics`, `/reports`, `/payroll/report-studio`, `/compliance`, `/alerts`

**SETUP / CONFIG (Config Hub, `/config`)**
- `/config/component-studio` — **Component Studio** (Pay Items + their statutory-bucket contract)
- `/config/parameters`, `/config/brackets`, `/config/rules` (Rule Studio), `/ai/rule-builder` (AI Rules), `/config/schemes`, `/config/populations`, `/config/counters`
- `/config/calendars-v2` — **Pay Calendars & Cycles**
- `/config/paygroup-legal-entity` — Pay Groups
- `/config/output-routing` — **G/L Mapping** (routing pay items → GL accounts)
- `/config/bank-templates` — **Bank Templates**
- `/config/approvals` — Approval Workflow
- `/config/preflight` — **Preflight Studio** (which checks gate a run; block vs warn vs off)
- `/config/packs` — **Country Packs** (e.g. Egypt) ; `/config/translations`
- `/approvals` — Approvals (inbox) ; `/settings`

---

## 4. The core payroll lifecycle (the mental model)

```
Configure  →  Open a cycle  →  Readiness  →  Run (Dry → Actual)  →  Approve  →  Post to G/L  →  Bank File  →  Payslips  →  Close
```

- A **Calendar** is the rule (frequency, anchor, offsets, retro/rounding) for one **pay group**. A **Cycle** is one numbered period stamped from it (e.g. `egypt_monthly:2026P08`), with its own lifecycle: **open → approved → posted/closed**.

> ⚠️ **THE CUT-OFF IS A MANDATORY STEP BEFORE AN ACTUAL RUN** (verified 2026-07-15 — this is not in the old §4 diagram). Control Center stages the real lifecycle as:
> **`Cut off` → `Run payroll` (actual) → `Post to G/L` → `Close period`**
> - **Cut off** (`cutoffDaybreakCycle`) freezes a **per-employee context snapshot** (`nabd_pay_cyclecontextsnapshots`) so the actual run is **reproducible**; anything core-syncs *after* the cut-off is excluded and surfaces as **retro** next period. Only an **open**, not-yet-cut-off cycle qualifies (`daybreak-cycles.js:177,179`). It reports how many snapshots it froze (our Aug-2026 cut-off froze **16** — the terminated 10405 is excluded automatically, no manual selection needed).
> - **Reversible until closed:** `reopenCutoffDaybreakCycle` clears the cut-off and discards the snapshot ("You'll need to cut off again before the actual run").
> - **`runDaybreakActual(cycleId, overrides, employeeNumbers)`** promotes dry→actual and returns `{ok, promoted, errors, warnings}`. Empty `employeeNumbers` ⇒ the **full frozen cohort**. It does **not** close the cycle.
> - **Close is PERMANENT** — `close_dialog.body`: *"Closing locks {name} permanently — there is no reopen."* Post to G/L **before** closing.
- A **Run** computes a cycle. **Dry run** = compute, no posting, status *Computed*, re-runnable. **Actual run** = compute, then post + close (typed confirmation).
- Downstream disbursement (**G/L Posting**, **Bank File**, **Payslip bulk generate**) consumes a **finalized** cycle — see the readiness/eligibility gates in §7.

---

## 5. Configuration surfaces (what each one does)

| Surface | Route | What it configures |
|---|---|---|
| **Component Studio** | `/config/component-studio` | Pay Items: kind (Earning/Deduction/…), unit, currency, rounding, **SF pay-component binding**, and the **cumulation contract** — which statutory buckets the item feeds: **Gross pay / Taxable gross / SI base / Valuation (EoS) basis** (the G·T·S·V flags). Items are draft until **Activated**. |
| **Pay Calendars** | `/config/calendars-v2` | 5-step wizard: Identity → Period generation (frequency, anchor, offsets, working week) → Regional (bind SF pay group) → Policy (retro window, rounding) → Review. One pay group ↔ one calendar. Effective-dated. |
| **Country Packs** | `/config/packs` | Install/activate a country's statutory content (schemes, pay items, bracket tables, parameters). Egypt pack installs SI/tax/EoS schemes + brackets. **Activation is a prerequisite** for statutory computation. |
| **Preflight Studio** | `/config/preflight` | The checks that gate runs/posting/bank-file. Each check: **active on/off**, **severity block/warn**, and who may override. Tabs: Payroll / Posting / Bank File. |
| **Bank Templates** | `/config/bank-templates` | The file layout a bank requires. Starters ship inside **New template**: CIB Egypt (CSV), DME flat (fixed width), DME XML. Also Start blank / Import CSV header / Clone. |
| **Payslip Templates** | `/payslips` | How a payslip looks per pay group (branding, blocks/windows, pay-items, totals, preview). **One active template per pay group.** Create → design in Studio → **Activate**. |
| **G/L Mapping** | `/config/output-routing` | Routing rules mapping pay items → GL accounts (debit/credit) that the journal is built from. |
| Rule Studio / Parameters / Brackets / Schemes / Counters / Populations | `/config/*` | The calculation engine's building blocks (rules that emit pay items, tax brackets, SI schemes, counters, employee populations). |

---

## 6. Data model essentials (only what you need to operate)

- **Employees** are **synced from SuccessFactors** (mock SF source in local). They are **read-only** in Nabd Pay — you cannot add a National ID or bank account inside the payroll app; that data is SF-owned (the `/employees` page has a **Sync** button, not an edit form). This is the single biggest constraint for producing non-zero/postable data (see §8).
- **Pay group** binds employees to a calendar. In the demo tenant the Egypt population is pay group **E1**; ~78 active employees.
- **Pay Items** carry a **cumulation contract** (G·T·S·V). For any statutory amount to compute, an **active** pay item must feed the relevant bucket, and the employee must actually receive that item.
- **Results** = `DaybreakResults`. A dry run's results are visible in the **Results explorer** (`/results`) but are **not** what the finalized-cycle consumers (GL/payslip bulk) read.
- **Cycles** have `status`: `open`, `approved`, `posted`, `closed`, `cancelled`. Many downstream features filter on specific statuses (see §7).

---

## 7. The gates that decide what's possible (READ THIS BEFORE OPERATING)

Different features require the cycle/data to be in different states. Getting these wrong wastes the most time.

| Feature | Requires | Confirmed behaviour |
|---|---|---|
| **Readiness "Not ready"** | blockers cleared | Blockers **stop** the run; warnings are advisory. Groups: Setup & period, Pay setup, Employee data, Pay-out & approvals. |
| **Run wizard — Preflight (dry run)** | its own checks pass | **Hard-stops** on blockers even for a dry run. Preflight checks are a *different* set from readiness gates (Open cycle, Employees-in-scope [bank + National ID], Pay items configured, Rules authored, Retro). Missing **National ID** or **bank** blocks simulation — unless the check is turned off in **Preflight Studio**. |
| **Run — Simulate** | earnings + National ID present | Employees with no active earning compute **zero**. Missing National ID can surface as per-employee "errors" on the progress bar, but if the checks pass the payslips still compute and Review shows **0 exceptions**. |
| **G/L Posting** | a **finalized** cycle with a built journal | Reads finalized run results + routings. A dry-run cycle shows **0 lines / 0 employees**. `listPostableCycles` includes open cycles in the *list*, but the journal is empty without posted results. |
| **Bank File** | cycle **approved → posted → closed** + a **bank template** + employees with bank accounts | Won't list a dry-run cycle. Has a **"Seed demo data"** dev helper that creates an approved demo cycle + 3 banked employees. |
| **Payslip bulk generate** | a **closed** cycle + an **active payslip template** | `GeneratePayslips` lists `listDaybreakCycles({status:'closed'})` — only **closed** cycles appear. No seed helper. |
| **EoS / Leave provision amounts visible** | an **actual** run (dry is not enough) | ⚠️ **Verified 2026-07-15.** The provisions **compute on a dry run** (`egypt_eos_provision_cycle` 14,500.00 / `egypt_leave_provision_cycle` 36,016.66 exist in `DaybreakResultLineItems`) but are **invisible in the UI**, for two independent reasons: (1) the Results **Breakdown deliberately hides them** — `ResultsInspector.jsx:604-605` excludes `kind === 'informational'`, which is exactly what the provision lines are; (2) the **accruals ledger is empty** — `nabd_pay_eosaccruals` has 0 rows because a dry run is side-effect-free (`eos-ledger.js:278`; the write is gated on `runMode === 'actual'`, `engine.js:4183`). The ledger UI is **Employees › employee detail › Accruals** (`EmployeeDetail.jsx:971`, route `/employees/:personIdExternal`) — a read-only view over `EOSAccruals` shared by eos + leave_provision + leave_encashment. **It only populates after an actual run.** What a dry run *does* show is the **END-OF-SERVICE BASE** on the Breakdown's Verification panel — the base the accrual is computed from. |

**Implication:** the individual dry-run payslip (Results explorer) works with an open cycle, but **GL Posting and Payslip bulk generation need a closed/posted cycle** — i.e. an actual run taken through approve → post → close. Those two were **parked** this session because the user chose not to post.

---

## 8. The National-ID / bank data constraint (the recurring wall)

- In the demo tenant, the **scenario employees** (the ones with real pay — IDs 103xx–106xx, 10997–10999) are seeded **with earnings but without National ID**, and one is cash-paid (no bank account). The **generic** ~62 employees are the opposite: National ID present, **no earnings**.
- Net effect: **no employee has both an earning and a National ID**, so no *targeted* run is simultaneously non-zero **and** past the preflight National-ID/bank gate — until you change something.
- National ID is **SuccessFactors data, read-only** in Nabd; it isn't in the repo seed for these employees, so you cannot add it from the payroll app.
- **The unblock we used:** in **Preflight Studio** (`/config/preflight`), turn **off** the `national_id_on_file` and `bank_accounts_present` checks (toggle *active* off — the user preferred off over downgrading to warning). The dry run then simulates and computes real statutory amounts (Egypt income tax + SI + net). Restore via **"Restore standard checks"** when done.
- **Alternative (not used):** add National IDs in the SuccessFactors source and re-sync.
- **The structural fix now in place (KB-05 §3):** the DB was **purged to the 17 employees that have complete, payroll-ready SF compensation data**. On that dataset the dry run computes cleanly (cohort 16; 10405 is terminated) and the readiness key checks pass 16/16 — so the "no employee has both earning and ID" wall no longer applies. Broad SF replication can reintroduce incomplete employees → **re-purge**.

---

## 9. Business processes we exercised end-to-end (with real numbers)

- **Config chain that makes payroll compute non-zero:** activate the **Egypt country pack** → in **Component Studio** activate **Basic Salary (item 1000)** and toggle all four cumulation buckets (Gross/Taxable/SI/Valuation) on, SF-bound to code 1000 → open the cycle in Control Center.
- **Dry run (FD-RUN-01):** targeted run on 16 scenario employees, Egypt Monthly · 08.2026 → **Gross EGP 200,000.00, Deductions 36,770.76 (Egypt PIT 19,137.76 + SI 17,633.00), Net 163,229.24, 0 exceptions.** Per-employee payslips render branded in the Results explorer (Payslip tab) with a Verification breakdown (Gross / Deductions / Net / Taxable gross / SI base / EoS base).
- **Bank File (BP-09):** "Seed demo data" → approved `bankfile_demo:2026-05`, 3 CIB employees, **EGP 53,000.49**, 6/6 validations → install **CIB Egypt** bank template → confirm-gated **Generate** (value date) → generated file recorded in **Previous exports**. Account numbers masked on screen; full numbers only in the audited artifact.
- **Off-Cycle (BP-13):** 5-step wizard **Run type → Employees → Components → Simulate → Submit**; bonus amounts entered per employee on the Employees step; advance via footer buttons "Next: Configure components" → "Next: Simulate" → "Run simulation" → "Submit for approval".

---

## 10. Key terms (quick glossary)

- **Daybreak** — the payroll calculation engine inside Nabd Pay.
- **Cycle** — one numbered pay period; **Calendar** — the rule that generates cycles.
- **Cumulation contract** — the G·T·S·V flags on a pay item deciding which statutory bases it feeds.
- **Readiness gate** vs **Preflight** — two *different* check sets; readiness is the dashboard, preflight is inside the run wizard (and configurable in Preflight Studio).
- **Dry run** (Computed, re-runnable) vs **Actual run** (posts + closes).
- **Seed demo data** — dev helper on the Bank File page that fabricates an approved demo cycle so disbursement can be demoed without a real run.
- **Masking** — account numbers shown as `****0001` on screen; full only in generated files (audited).

---

## 11. Operating cautions

- The system is treated as potentially **live** — never assume writes are safe on a production tenant. All work this session was on a **local QA/project tenant** where writes are safe. Prefer dry runs, demo seeds, and reversible actions.
- **Actual run / post / close are consequential** — they finalize a cycle. Do them deliberately and only when the task truly needs a finalized cycle.
- Config changes (activating pay items, packs, toggling preflight checks) **persist** in the local DB — note them in the project log so the next session knows the environment state.
- **Some screens are pinned to the current month.** The Loans **Compliance** tab uses the current period with no
  period picker, so a freshly-created loan (whose first installment is *next* month) shows "Active compliance
  checks = 0" and a "EGP 0.00" floor for the current month — the deduction-limit breaches still show on the
  **Installment schedules** tab, which evaluates all active loans. Know this before documenting compliance so you
  capture the breach on the screen that actually shows it.

---

> **How to use this file.** KB-01 is a strong starting map of Nabd, but **the running app is the source of
> truth.** Nav labels, routes, gates, and statuses drift between releases — the kit's method is to confirm each
> against the live app/repo before you document it (§2: route → page → handler). Verify, then write. When you
> confirm or correct something, note it in the project log's change log.
