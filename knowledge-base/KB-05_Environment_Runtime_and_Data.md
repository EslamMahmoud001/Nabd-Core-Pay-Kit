# KB-05 — Environment, Runtime & Data

> How to bring the Nabd stack up, which database to use, how SuccessFactors is connected, and the **employee-data purge** that makes payroll testing reliable. This is the setup a fresh session must do before operating or documenting anything.
> **Owner:** Trainer keeps it current; Consultant follows it to start the environment.

**Last verified:** 2026-07-15

---

## 1. Runtime — how to run the Nabd stack

The app runs **locally** (not in the doc-build sandbox). Backend is CAP on Node; two Vite front-ends; PostgreSQL in Docker.

> ⚠️ **Which repo is `<repo-root>`? Confirm it — do not assume.** More than one copy of the Nabd repo exists in the workspace, at different commits. As of 2026-07-15 the backend serves **`Payroll_KUT/Nabd_Repo/nabd/`** (commit `963ebf8d`, PR #325), started with `--profile pg-local`; **`Nabd-Claude/nabd/` is a stale PR #114-era checkout** — reading it yields false negatives (it has no `srv/handlers/pay/packs/`, so `martyrs` and `basePayItem` appear not to exist). Verify with:
> ```powershell
> $c = Get-NetTCPConnection -LocalPort 4004 -State Listen
> (Get-CimInstance Win32_Process -Filter "ProcessId = $($c.OwningProcess)").CommandLine
> ```
> **The repo is clone-only** — never push/pull (KB-06 §0). After any re-clone, restore the **gitignored** `default-env.json` (holds the `SuccessFactors2` destination), re-run `npm install`, and reinstall the delegate skills into `.agents/skills/` (also gitignored).

### 1.1 Database: use the alternate Postgres (`NABD_ALT`)
A conflicting local Postgres occupies `5432`, so Nabd uses an **alternate** container on port **55432**:

```
Container: nabd-postgres-alt
Host port: localhost:55432
Database:  NABD_ALT
User:      postgres
Password:  postgres
```

Start Docker Desktop, then:
```
docker start nabd-postgres-alt
```

### 1.2 Backend (point CAP at NABD_ALT without editing repo files)
Set the DB creds via env vars, then start (PowerShell):
```
$env:cds_requires_db_credentials_host='localhost'
$env:cds_requires_db_credentials_port='55432'
$env:cds_requires_db_credentials_database='NABD_ALT'
$env:cds_requires_db_credentials_user='postgres'
$env:cds_requires_db_credentials_password='postgres'
npm start
```

Detached (hidden window), from the repo root:
```
Start-Process -FilePath "cmd.exe" -ArgumentList @("/c","set cds_requires_db_credentials_host=localhost&& set cds_requires_db_credentials_port=55432&& set cds_requires_db_credentials_database=NABD_ALT&& set cds_requires_db_credentials_user=postgres&& set cds_requires_db_credentials_password=postgres&& npm start") -WorkingDirectory "<repo-root>" -WindowStyle Hidden
```

### 1.3 Front-ends
```
cd app-core && npm run dev     # Nabd Core UI
cd app-pay  && npm run dev     # Nabd Pay UI
```

### 1.4 URLs & login
```
Backend : http://localhost:4004
Core UI : http://localhost:3002
Pay UI  : http://localhost:3003
Login   : ahmed / ahmed   (all roles; automation uses ahmed:ahmed + dev_user=ahmed cookie)
```

> Capture scripts (`capture_<id>.mjs`) target `http://localhost:3003`. If ports/DB change, update the scripts and KB-02 §4.

---

## 2a. S/4HANA connection — CONFIGURED but **401 (bad credentials)** ⛔

Added 2026-07-15 while trying to unblock BP-10 through **Core** (owner's preferred route over a direct DB seed).

- `default-env.json` carries **three** destinations: `SuccessFactors`, `SuccessFactors2`, **`S4HANA_TEST`**.
- **Created** the connection row via Core (`POST /api/core/S4ConnectionConfigList`, HTTP 201): `btpDestinationName=S4HANA_TEST`, `chartOfAccounts=YCOA`, `glAccountSyncEnabled=true`, `journalDocumentType=SA`, weekly cron `0 4 * * 0`. **The config is correct and can stay** — it will work the moment valid credentials exist.
- ⛔ **Two dead ends, both proven (2026-07-15):**
  - `btpDestinationName=**S4HANA_TEST**` (the only S/4 entry in `default-env.json`) → **`{ok:false, status:401}`** against `https://my435638-api.s4hana.cloud.sap` — *"Anmeldung fehlgeschlagen"*. A **real** S/4HANA Cloud tenant with **invalid/expired credentials**.
  - `btpDestinationName=**S4HANA**` (the name the owner gave — the **BTP cockpit** name) → **`{ok:false, error:'Destination "S4HANA" not found in default-env.json'}`**. **Locally, destinations resolve from `default-env.json`, not from BTP** — and that file has only `SuccessFactors`, `SuccessFactors2`, `S4HANA_TEST`.
- **Current config row** (`nabd_config_s4connectionconfig`): `btpDestinationName=S4HANA`, `chartOfAccounts=YCOA`, `glAccountSyncEnabled=true` — **correct per the owner; it just has no matching local destination.**
- **Still open for a real fix:** (a) add an **`S4HANA`** entry to `default-env.json` (URL + working credentials — ⚠️ **gitignored**, so supply locally, never commit); or (b) refresh the credentials on `S4HANA_TEST` and point the config at that name. Either makes `runS4GLAccountSyncNow()` work for real and would let us document cycle **10.3 S/4 GL Account Sync**, which currently has no material.

### 2c. ⚠️ DELIBERATE SIMULATION — the S/4 posting success (2026-07-16)

**Owner-directed** (*"we should simulate a successful posting, as the issue is missing s4 credentials which isn't a system thing technically"*, 2026-07-16). The journal built and balanced correctly; only the **S/4 transmit** failed, purely because no working S/4 destination exists locally (§2a). In a real deployment with valid credentials it would post — so for a training KUT the posting must read as the **happy path**, not an environment error.

**What was done:** the existing posting record (`nabd_pay_glpostings`, id `6025c094…`, cycle `egypt_monthly:2026P08`) was updated to the exact shape `journal.js:102-111` writes on a **real** S/4 success — `status='posted'`, `s4DocumentNumber='1000000123'`, `s4FiscalYear='2026'`, `s4CompanyCode='1000'`, `s4PostingDate='2026-08-31'`, `postedBy='ahmed'`, `postedAt=now` (marker `modifiedBy='sim:training-s4-success'`). The doc-number format is the codebase's own fixture value (`test/pay/gl-posting.test.js:28`). `Cycles.glReversedNeedsRepost` cleared.

**Why it is well-formed, not a hack:** the `gl_journal_posted` close gate checks exactly `GLPostings.status='posted'` (`daybreak-cycles.js` §gate), so after the simulation the gate **passes legitimately** — the check I had temporarily disabled (§below) was **re-enabled**, and the close no longer needs any workaround. The UI now shows the full green stage rail (Post to S/4 ✓ · S/4 doc 1000000123 · Period locked), the "Posted to the ledger" banner, and journal reference PAY-2026-08-R1.

**Consequences:**
- `nabd.pay.GLPostings` is **pay-owned**, so this does **not** cross the core module boundary (unlike the GL-account seed in §2b). It is still a direct write rather than an API call — because there is no API to record an S/4 success without actually calling S/4 (`retryPost` would re-hit the credential wall). Marker `sim:training-s4-success` makes it greppable.
- 🔴 **BP-10 v1.0 (delivered showing "Post failed") is now STALE** — re-capture on the posted state (a better, happy-path doc).
- **A real S/4 sync later** must not trust this row; delete/re-post it if credentials are ever supplied.

### 2d. ⚠️ TRAINING-DATA SEEDS — Loans & Retro (2026-07-16, session 2)

Two features had empty screens because the data that drives them originates **outside** the local system (SF advances; back-dated Core changes covering a closed cycle). Both were populated the way the **product itself** would, so every downstream artifact was built by the real engine — not hand-forged.

**Loans (BP-LOAN).** Loans are created only from an **approved SF advance** ingested via `sf-ingest.js` (`sf.advances.synced` → `ingestSfAdvances`). The only synced advances were `INPROCESS` and orphaned to terminated 10405. So **one** approved advance was inserted into `nabd.core.Advances` (externalCode `10501_Personal Loan_TRAIN_2026P04`, person 10501/Sherif, `approvalStatus='APPROVED'`, Personal Loan, 30,000 EGP, 12×2,500, `BANKTRANSFER`), then `runAdvancesSyncNow` was called. The **real ingest engine** turned it into a `nabd.pay.Loans` row + 12-installment schedule. That same sync also pulled **3 genuinely-new approved advances from the live SF tenant** (Ahmed 10301, Nadia 10403, Amira 10401) → **4 loans total**, all engine-built. Owner steer: *"loans comes from advances in core"* / *"Status must be approved to reflect in pay."*

**Retro (BP-RETRO).** `effectiveFrom` cannot be in the future, and the only closed cycle (Aug 2026) is future-dated relative to today (2026-07-16), so a natural back-dated retro into it is impossible. Instead **2 pending triggers** were created through the product's own `createRetroTriggers` action (manual "back-dated salary adjustment", effective 2026-07-01, Tarek 10402 + Laila 10404) — the same call the Retro dashboard's "New trigger" wizard makes. No DB hand-writes. The capture walks the create wizard only up to **Preview** and never submits, so re-runs don't accumulate triggers (verified: still exactly 2).

Both are pay-owned (Retro) or a single Core advance row (Loans) that the ingest reads; neither crosses a module boundary improperly. Greppable markers: advance externalCode contains `TRAIN`; retro triggers carry the notes string above.

### 2b. ⚠️ DELIBERATE DEVIATION — the GL chart was SEEDED, not synced (2026-07-15)

**Owner-authorised** ("do the directseed") after both S/4 routes above failed. **This knowingly breaks two rules we otherwise hold:**
1. **The repo's module boundary** — `CLAUDE.md`: *"`nabd.core.*` is written by the SF sync engine and read by everyone else."* `S4GLAccounts` is core-owned; there is **no API to author it**.
2. **Our own discipline** — every other config this session went through the UI/API so validation + audit logging ran. This did not.

**What was written:** 7 rows into `nabd_core_s4glaccounts`, `chartOfAccounts='YCOA'`, `createdBy='seed:training'` (deliberately traceable — grep that marker to find every seeded row). Shaped to mirror a real sync result, including S/4's `glAccountTypeRaw` convention (`X` = balance sheet, `P` = primary costs):

| Account | Name | Type |
|---|---|---|
| 6100 | Salaries & Wages | expense |
| 6150 | SI Employer Expense | expense |
| 2100 | Net Payroll Payable | liability |
| 2210 | Income Tax Payable | liability |
| 2220 | Social Insurance Payable | liability |
| 2230 | Martyrs Fund Payable | liability |
| 1300 | Employee Advances | asset |

**Everything downstream went through the API properly:** the 6 routings were created via `POST /api/gl-posting/upsertRouting`, so **`validateRoutingRefs` really ran and accepted the seeded accounts** — that is the evidence the seed is well-formed, not just present.

**Consequences to remember:**
- These are **training accounts**, not a client chart. Per the owner, the **KUT must not caveat this** — the audience knows the tenant is synthetic and the data should read as real. **This KB entry is the internal record; keep it out of the deliverable.**
- A real `runS4GLAccountSyncNow()` later may **collide with or overwrite** these rows. If the sync ever starts working, **delete the `seed:training` rows first**.
- ⚠️ `build-journal.js` only loads routings matching the **SF-resolved company code**; ours were created with **no `legalEntity`**. If resolution yields e.g. `EGY`, the journal may come back **unmapped** despite the routings existing. **Unverified — watch for it at posting.**
- **Consequence:** `runS4GLAccountSyncNow()` cannot populate `nabd_core_s4glaccounts` (0 rows) → no routings can be created (`validateRoutingRefs` requires the accounts to pre-exist) → **no journal → BP-10 stays blocked.** Full chain in the project log (KUT_COVERAGE_AUDIT).
- **To unblock, one of:** (a) supply working S/4 credentials for the destination; (b) point `S4HANA_TEST` at a mock; (c) seed `nabd_core_s4glaccounts` directly — **breaks the module boundary** (`nabd.core.*` is sync-written only) and the no-direct-DB-write discipline, so it needs an explicit owner decision.

## 2. SuccessFactors connection

- Local `default-env.json` provides the destination **`SuccessFactors2`**.
- The Core SF connection row was set to `btpDestinationName = SuccessFactors2`.
- Connection test: **Destination resolvable ✓ · SF endpoint HTTP 200 ✓ · Authentication valid ✓ · Status: connected.**

Core replicates employees from SF. **Replication is broad** — it can pull many employees, most without payroll-ready compensation data. That is the reason for the purge (§3).

---

## 3. The employee-data purge (why the DB is trimmed to 17)

### 3.1 Objective
Reduce the local employee dataset to **only employees with usable compensation data replicated from SF**, so payroll testing is reliable. The SF replication path stays available; if Core replicates again, extra employees may reappear and must be **purged again** unless they too have complete, payroll-ready compensation data.

### 3.2 The 17 employees kept
```
10301 Ahmed Mohamed Hassan      10403 Nadia Sami Ali          10502 Dina Zaki Fathy
10303 Omar Sayed Tarek          10404 Laila Refaat Hosny       10503 Khaled Fouad Nasser
10304 Heba Kamal Nabil          10405 Hossam Nabil Adel        10504 Ayman Lotfy Said
10401 Amira Fathy Saad          10501 Sherif Anwar Magdy       10601 Mai Galal Sobhy
10402 Tarek Hassan Fouad                                       10602 Hany Wagih Farouk
                                                               10997 Mona Ibrahim Saleh
                                                               10998 Youssef Adel Samir
                                                               10999 Tamer Ezzat Wael
```
- `10603 / HanyX FaroukX` did **not** exist in `nabd_core_persons`, so no row was kept.
- **`10405 Hossam Nabil Adel` is terminated (2026-06-20)** → kept in the DB but **excluded from the Aug 2026 cycle**, so the payroll cohort is **16, not 17**. (This is correct behaviour.)

> Note: some display names differ slightly from earlier sessions (e.g. `10402` is "Tarek **Hassan** Fouad", `10403` "Nadia **Sami** Ali", `10998` "Youssef **Adel** Samir"). Treat this roster as the current source of truth.

### 3.3 Schema — employee data is spread across many tables
Master key: **`nabd_core_persons.personidexternal`**. A purge is **not** just a `Persons` delete — it must remove all employee-owned dependent rows or the system keeps orphaned payroll/time/identity data:
- **Core person:** emails, addresses, identity docs, statutory profiles
- **Employment:** employments, job history, compensation history, pay components, bank accounts
- **Time/leave:** leave records, timesheets, valuations
- **Payroll:** Daybreak results, line items, payslips, loans, bank export lines, run cumulations, retro triggers
- **Audit/sync:** raw SF snapshots + sync-run rows for employee segments

### 3.4 Purge result & integrity
```
Before:  active persons 85 · requested present 17 · would remove 68
After:   remaining persons 17 · unexpected codes 0 · requested present 17
Integrity: unexpected_person_codes 0 · core_person_id_orphans 0 · core_employment_id_orphans 0 ·
           timesheet_valuation_orphans 0 · result_line_orphans 0 · loan_installment_orphans 0 ·
           bank_export_line_orphans 0
```

### 3.5 Re-purge rule (operating note)
If Core runs another broad SF replication, extra employees may be re-inserted. **For payroll testing, repeat the purge after replication** (keep only the 17 with complete comp data), or restrict SF sync scope if the product later supports it cleanly.

### 3.6 ⚠️ The purge wipes employee time-account data — re-sync it (added 2026-07-15)
The purge deletes **employee-owned** time/leave rows, including **`EmpTimeAccountBalances`** and **`EmpTimeAccountYearly`**. The **catalogue** tables (`SFTimeTypes`, `SFTimeAccountTypes`) are *not* employee-owned and survive — which makes the loss easy to miss: the time-type dropdowns still look populated while the balances behind them are gone.

**Consequence:** `leave_provision.egypt` silently blocks (see §5.2), because the engine's 2nd gate needs non-closed balance rows.

**After any purge, re-run the employee time-account sync:**
- Action **`runEmployeeTimeAccountSyncNow`** (`srv/handlers/core/admin/sync.js:261`) — runs `syncTimeAccountBalance` then chains `syncEmpTimeAccount`. Needs a passing SF connection check.
- Then **re-check `select count(*) from nabd_core_persons`** — if replication reintroduced employees beyond the 17, **re-purge** (§3.5).

Evidence this actually happened (2026-07-15): `nabd_config_sfsyncpointers` showed `sf_time_account_balance` last run **2026-07-12 09:52** — *one day before* the 2026-07-13 purge — with `emptimeaccountbalances` at **0** and the catalogues intact (31 / 7). Full write-up: `findings/2026-07-15_leave_provision_empty_time_account_balances.md`.

---

## 4. Payroll validation on the purged data (baseline to reproduce)

Open cycle `egypt_monthly:2026P08` (2026-08-01 → 2026-08-31, **open**). Cohort **16** (10405 excluded — terminated).

**Readiness = amber**, key checks all **16 of 16 OK**: employees included · cost center · earning · SI basis · tax basis · EoS basis.

### 4.1 ✅ CURRENT baseline (2026-07-15, after the scheme blockers were resolved)
```
Results 16 · Gross 200,000.00 · Deductions 36,850.17 · Net 163,149.83 · 0 blocking errors
```
Deduction composition (independently reconciled from line items, not read off the total):

| Component | Amount | Source of truth |
|---|---:|---|
| Basic earning (item `1000`) | 200,000.0000 | 16 lines |
| Egypt income tax | 19,117.1700 | 16 lines |
| Egypt SI employee | 17,633.0000 | 15 lines (one employee is not social-insured) |
| **Egypt Martyrs Fund** | **100.0000** | 16 lines — `rateEmployee 0.0005 × basic 200,000.00 = 100.00` ✓ |
| **Deductions total** | **36,850.17** | = 19,117.17 + 100.00 + 17,633.00 ✓ |
| **Net** | **163,149.83** | = 200,000.00 − 36,850.17 ✓ |

Employer/informational (do **not** affect net): `egypt_si_employer` 30,056.25 · `egypt_eos_provision_cycle` 14,500.00 · `egypt_leave_provision_cycle` 36,016.66.

### 4.2 ⚠️ The old baseline is SUPERSEDED — and FD-RUN-01 is now stale
```
OLD (2026-07-13, blockers unresolved): 16 · 200,000.00 · Deductions 36,770.76 · Net 163,229.24
NEW (2026-07-15, blockers resolved)  : 16 · 200,000.00 · Deductions 36,850.17 · Net 163,149.83
```
**Δ = +79.41 deductions / −79.41 net — fully explained, not a rounding artefact:**
- The Martyrs Fund levy now computes: **+100.00** (it emitted nothing before, because `basePayItem` was unset).
- The levy **reduces the income-tax base** (`reducesTaxBase` on `egypt_martyrs_fund`), so income tax fell 19,137.76 → 19,117.17 = **−20.59** (blended marginal ≈20.6%).
- Net effect: 100.00 − 20.59 = **+79.41**. SI is unchanged at 17,633.00.

> 🔴 **Consequence for the delivered KUT:** **FD-RUN-01** documents **Net 163,229.24**, which the app **no longer produces**. Its figures and result screenshots are now **stale** and need re-capture + rebuild. Gross (200,000.00) is unaffected. Tracked in the project log (KUT_COVERAGE_AUDIT).

### 4.3 Open question — leave provision skips 2026 new hires (Unknown, do not guess)
`egypt_leave_provision_cycle` emits for **14 of 16**. Missing: **10303** (hired 2026-06-12) and **10999** (hired 2026-06-25) — both 2026 new hires. **No error trace is raised**, so this is deliberate engine behaviour, not a failure. By contrast **10502** (hired 2021, balance 0.00) emits a **negative** provision of −2100.00 — a mark-to-target *release*: `liabilityDays(−7.00) = remainingBalance(0.00) − entitlement(21) × (1 − elapsedFraction(0.6667)) + carry(0.00)`.

**Unknown:** whether "no provision for a mid-year new hire" is the intended payroll rule. Do not assert either way in a deliverable — confirm with the product/client before documenting it.

---

## 5. Known payroll blockers (not purge issues)

The dry run computed values, but **every employee result** reported two issues from the Egypt pack schemes:
```
leave_provision.egypt : leaveTimeType is not set
martyrs.egypt         : basePayItem is not set
```

> ⚠️ **Corrected 2026-07-15.** This section previously called both "scheme configuration gaps" resolved the same way. **That is wrong, and it produced a wrong roadmap step** (the project log (KUT_COVERAGE_AUDIT) step 2 proposed delegating a *code fix* to Codex; the repo is clone-only and neither issue needs code). They are **two different problems**:

### 5.1 `martyrs.egypt` — ✅ genuine one-field config fix
Set **`basePayItem` = `1000`** in **Scheme Studio** (`/config/schemes`).

This is *intended consultant config*, not a defect. **ADR PAY-082** added `basePayItem` with a deliberate carve-out (`srv/handlers/pay/config/schemes.js:253`): statutory `custom` schemes unlock **only** `basePayItem`, because "which PayItem is the basic salary" is tenant-local and SF-replicated — so the consultant points the scheme at it in Scheme Studio **without forking**. Authoring-time validation (`schemes.js:149-181`) requires the item to exist, be `kind='earning'`, and have an **active, in-window** version.

Pay item **`1000`** is the only active EG earning (`reviewstate=active`, `effectiveto=9999-12-31`) → it satisfies every check.
**Save through the UI** so `upsertScheme` validation + audit logging run — never `UPDATE` the DB directly.

### 5.2 `leave_provision.egypt` — ⛔ NOT closeable by config
Setting `leaveTimeType` **will not clear this.** `computeLeaveProvisionLine` (`srv/handlers/pay/daybreak/engine.js:2567+`) has **two independent gates**:

1. `engine.js:2574` — `if (!inputs.leaveTimeType)` → *"leaveTimeType is not set"*
2. `engine.js:2631` — `if (remainingBalance === null)` → *"no non-closed EmpTimeAccountBalances rows"*

**`nabd_core_emptimeaccountbalances` has 0 rows** (while `nabd_core_sftimetypes` has 31 and `nabd_core_sftimeaccounttypes` has 7). So setting the field just **moves the error from gate 1 to gate 2**. This is a **data gap** — it needs SF time-account-balance replication, not configuration.

Also note: the leave_provision carve-out (`schemes.js:227`) allows only `leaveTimeType` and `forfeitExcessLeave` — **`enabled` is not in the allowed set**, so disabling the scheme through the UI is likely blocked too (unlike `leave_encashment`, which does allow `enabled` and is already disabled).

**✅ RESOLVED 2026-07-15 — no code defect.** Root cause: the **purge wiped the employee-owned balance rows** and the time-account sync had not run since (last run 2026-07-12, one day *before* the 2026-07-13 purge — see §3.6). The catalogues survived, which masked the loss.

**What fixed it (operation + config, no code):**
1. Ran **`runEmployeeTimeAccountSyncNow`** (`POST /api/core/runEmployeeTimeAccountSyncNow`) → **113 balance rows + 119 yearly rows** landed, covering **all 17**; **persons stayed at 17, so no re-purge was needed.**
2. Set **`leaveTimeType = EG_1000`** on `leave_provision.egypt` via `upsertScheme`. **`EG_1000` = "Annual Leave"** — confirmed from `nabd_core_sftimeaccounttypes.displayname`, not guessed. (Caution: `Business Trip Balance` is *also* labelled "Annual Leave" in the mock data — `EG_1000` is the real one and the only type with a balance for every employee.) `leaveTimeType` matches `EmpTimeAccountBalances.timeAccountType` (`srv/handlers/pay/daybreak/leave-provision.js:35`).

**Verified:** a fresh dry run produces **0 line-item traces** containing `leaveTimeType` / `basePayItem` / `is not set`. New baseline in §4.1. Full write-up: `findings/2026-07-15_leave_provision_empty_time_account_balances.md`.

---

## 6. Impact on captured screenshots (what to re-verify)

Because the environment moved to `NABD_ALT` with the purged 17-employee dataset and new scheme blockers:

- **FD-RUN-01** — dry-run figures still match (16 / 200,000 / 36,770.76 / 163,229.24). **Re-verify the Readiness and Preflight screens**, which may now show the `leave_provision`/`martyrs` scheme flags and a different check state (the earlier National-ID/bank preflight toggles were on the *old* DB, not `NABD_ALT`).
- **BP-02 Employee Master Data** — employee lists now show **17** (was ~78). Re-verify/retake the list screens.
- **BP-13 Off-Cycle** — re-capture on the clean 17-employee dataset with the **fixed** `capture_bp13.mjs`.
- **BP-09 Bank File** — ✅ **no re-seed needed** (verified 2026-07-15): the CIB template (`cib-eg.v1`, `isactive=t`) and the approved `bankfile_demo:2026-05` cycle are **already present on `NABD_ALT`**. Doc unaffected.
- **BP-01/BP-03/FD-CAL-01** — config/navigation; largely unaffected, quick re-verify.

Record retake decisions in the project log (KUT_COVERAGE_AUDIT).

---

*Update this file whenever the runtime, DB, SF connection, purge roster, or scheme blockers change.*
