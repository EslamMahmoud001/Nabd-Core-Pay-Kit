# Nabd — Feature Inventory (what the product actually includes)

A map of the Nabd surfaces you will operate and document. Nabd is a **SuccessFactors-integrated HR + payroll
platform** built on **SAP CAP** with two React/Vite front-ends. The payroll engine is codenamed **Daybreak**.
Routes below are React routes; confirm exact labels in the running app before documenting them (KB-01).

## Systems & ports

| System | Port | Role |
|---|---|---|
| **Nabd Core** (`app-core`) | 3002 | Employee master data, foundation, time/leave — the SF-synced source of truth |
| **Nabd Pay** (`app-pay`) | 3003 | Payroll configuration, run lifecycle, outputs |
| **Backend** (SAP CAP) | 4004 | OData services `/api/core`, `/api/payroll-*`, the Daybreak engine |
| **Postgres** | 55432 | `NABD_ALT` database (the local training DB) |

Module boundary: `nabd.core.*` tables are written **only** by the SF sync engine; `nabd.pay.*` is pay-owned.
Pay reads Core; Core never writes Pay (it announces syncs on an in-process event bus).

## Configuration surfaces (Nabd Pay)

- **Component Studio** — the Pay Item catalogue: each item's kind, owner (Country pack / Tenant / SF-seeded),
  effective window, and cumulation contract (which buckets it feeds: Gross / Taxable / SI / Variable).
- **Parameters** — effective-dated rates, thresholds and limits that rules read by key.
- **Bracket Tables** — tiered rate tables (income-tax brackets, end-of-service scales).
- **Rule Studio / Rules** — the calculation rules that emit pay items.
- **Schemes** — statutory scheme configuration (Social Insurance, End-of-Service, Leave Provision, Martyrs …).
  Some are read-only ("Fork to edit"); some allow limited in-place edits.
- **Country Packs** — a catalogue of items/tables/schemes shipped per country (Egypt pack here).
- **Pay Calendars** — frequency, cut-off day, pay day, per pay group.
- **Preflight Studio** — the checks that gate a run (e.g. `national_id_on_file`, `bank_accounts_present`);
  each check can be toggled active/inactive.
- **Bank File Templates** — payment-file formats (e.g. a CIB Egypt template).
- **Payslip Templates** — payslip layout per pay group; one active template per pay group.
- **G/L Mapping** — output routings that map pay results to ledger accounts per legal entity/company code.

## Operate surfaces (Nabd Pay)

- **Control Center** — the run cockpit: open a cycle, cut off, run, approve, post to G/L, close.
- **Readiness** — pre-run readiness checks over the cohort.
- **Run wizard** — dry run (side-effect-free simulation) and actual run.
- **Off-Cycle wizard** — one-time payments, loan disbursement, termination settlement, reversals.
  Run types: One-Time (active); Advances/Loans disbursement; Termination. (An `Advances` tile may show SOON.)
- **Retro dashboard** — pending back-dated triggers, approvals, resolved audit trail, manual trigger creation.
- **Loans & Advances** — loan list, per-loan recovery schedule, installment schedules, compliance guardrails,
  separation exposure, policy & loan types.
- **Results / Payslip explorer** — per-employee run results and generated payslips.

## Outputs

- **Payslips** — bulk-generated from a **closed** cycle's results (confirm-gated with a typed `GENERATE`).
- **Bank File** — the payment file for the run (duplicate-payment protection).
- **G/L Posting** — a balanced journal posted to S/4 (idempotent; no duplicate post over a posted journal).
- **Reports** — a run-scoped catalogue in three categories:
  - *Statutory* (official filings): PIT Register, SI Register, Statutory Base, YTD Tax, WPS/Bank File, Form 4.
  - *Management* (reconciliation & cost): Payroll Summary, Cost-Center Rollup, G/L Posting Preview,
    Headcount & Cost, Variance Analysis.
  - *Audit* (evidence & sign-off): Retro Adjustments, Payroll Register, Approval Log.
  Each report has **Preview** (routed content view) and **Download**; formats: PDF, Excel, CSV, JSON, XML.
- **Analytics** — an executive cost board scoped by the selected pay group + period: KPI tiles (Total people
  cost, Headcount, Cost per head, Cash to disburse, Payroll leakage), a cost-driver bridge, a Gross→Net
  waterfall, a 12-month cost trend, and an employee/component/retro/run-history detail area.

## Integrations

- **SuccessFactors** — employees, foundation, time/leave, and **advances** (which originate loans in Pay).
- **S/4HANA** — G/L account (chart) sync and journal posting (via a BTP destination, e.g. `S4HANA` / `YCOA`).
- **Banking** — bank payment file for disbursement.

## Employee lifecycle (Core)

New hire · rehire · mid-period hire · transfer · salary change · promotion · pay-group change ·
bank-account change · suspension · termination · final settlement. All records are **effective-dated** —
a change opens a new dated version rather than overwriting history.
