# Core + Pay source baseline

This file is the traceability anchor for the current kit release. Product claims in the kit must resolve to
this application checkout, its tests, or a dated runtime observation. Do not treat training-tenant state as a
universal product rule.

## Application baseline

| Item | Value |
|---|---|
| Repository | `Raptors-Technology/nabd` |
| Local checkout used for reconciliation | `Pay_Repo_13_Aug/nabd` |
| Branch | `main` |
| Verified commit | `f15e7ba03e2fd058a7bbfee56e104d23277868cb` |
| Previous kit baseline | `963ebf8d` |
| Reconciliation date | 2026-08-13 |
| Scope | Nabd Core + Nabd Pay only |

The comparison contains 335 commits and 861 changed files. The application repository is read-only for this
kit. Configuration and capture may change a local/QA tenant, but the kit never patches the application clone.

## Source-of-truth order

1. `CLAUDE.md`, `docs/README.md`, current feature deep-dives, and accepted entries in `docs/DECISIONS.md`.
2. Application routes, service contracts, handlers, schema, and focused tests at the verified commit.
3. Running Core/Pay behavior on an environment proven to use that commit; this establishes tenant/runtime state.
4. This kit's knowledge base and references.
5. Dated project logs, screenshots, and training-data notes.

When docs and executable behavior conflict, record the conflict and use the handler/tests for the tested build
while flagging the documentation drift. Never silently choose the more convenient claim.

## Scope boundary

Included:

- Core integration administration, SF/S4 connection surfaces, streams, schedules, Data Browser, audit,
  notifications, module activation, and branding.
- Pay configuration, calendars/cycles, readiness/preflight, runs/results, approvals, GL, bank files, payslips,
  loans, retro, off-cycle, EoS/leave, reports, analytics, import, and the shared shell controls needed to operate
  those features.

Excluded unless the owner explicitly expands scope:

- Workforce, Care, PSA, or any deleted/experimental module.
- Generic BTP administration not needed to run Core/Pay.
- Application implementation, PR, deployment, or database-schema-change workflows.
- AI and Compliance training while the application System Map marks the pilot features deferred.

## Confirmed product drift to absorb

| Area | Current contract at `f15e7ba0` | Primary evidence | Kit impact |
|---|---|---|---|
| Architecture | One dedicated deployment + one Postgres per customer; Core always on, Pay module-gated | `CLAUDE.md`, `docs/README.md` | README, KB-01, assumptions |
| Runtime | React 19/Vite, CAP, Postgres, in-process `node-cron`; no Redis/BullMQ | `readme.md`, `package.json`, ADR log | prerequisites, KB-05, setup skill |
| Core access | Core app personas are `tenant_admin`, `tc_ops`, and `consultant`; page/action depth differs | `app-core/src/App.jsx`, security model | navigation, roles, capture briefs |
| Pay access | Route, button, entity, and field access use role bundles; consultant is config-only | `app-pay/src/App.jsx`, `role-routing.js`, security model | KB-01, Consultant skill, KUT roles |
| Release gates | A feature route may require released state or `preprod_tester`; current tagged route is Spot Run | `App.jsx`, `canAccessFeature` | setup checks, route inventory |
| Jobs | Jobs run in-process; schedules converge on `JobConfigs`; settings expose schedules | ADR log, jobs service, settings pages | Core/Pay operating playbooks |
| PayItem versions | Versions tile the timeline; `effectiveTo` is derived; hard delete replaces soft delete | PAY-084, pay-item feature doc/tests | Config Guide, readiness cautions |
| Other config versions | Parameters, Schemes, and Bracket Tables cannot overlap within their lane; gaps stay legal | PAY-088, feature docs/tests | Config Guide, simulator checks |
| Calendars | Actual runs require frozen cut-off cohort; deletion hard-deletes dry/unused calendars or archives committed ones | calendars feature doc/tests | FD-CAL-01, FD-RUN-02 |
| Dry runs | Cycle-level dry-run discard exists and is audited; committed artifacts prevent discard | dry/actual feature doc/tests | FD-RUN-01, runs capture |
| Run scope | Run Wizard accepts employee CSV/Excel scope import | `RunWizard`, import dialog, tests | Consultant/capture flow |
| Results | Re-run cleanup prevents orphan rows; result-access checks are centrally guarded | result-access scripts/tests | validation and anomaly triage |
| Bank templates | CIB Egypt supports data-driven CSV and typed/formatted Excel; file-name tokens include month/year variants | bank-file feature doc, commit #513 | bank-template test phase, BP-09 |
| Payslips | Studio preview and generated PDF share rendering intent; generation is batched; SF push errors are visible/retryable | payslip feature doc, handlers/tests | BP-PAYSLIP |
| Leave/EoS | Multi-time-type leave policies; missing time type warns; both EoS and leave read `working_days_per_month` | PAY-087, eos/leave docs/tests | BP-18, seed/config guidance |
| Analytics/reports | Analytics may use dry-run figures as fallback; rollups avoid double counting and preserve kinds | ADRs PAY-084 and 2026-07-16 | BP-REPORT, BP-ANALYTICS |
| Core browser | Time Account Types and additional statutory/payment labels are exposed under role/masking rules | Core routes/pages/tests | BP-02, Core navigation |
| SF auth | SOAP login supports Basic or OAuth2 SAML Bearer; local destination config remains external | integration docs, SF client tests | prerequisites, KB-05, BP-01 |

## Runtime facts that must be re-established

The following July-2026 values are not product contracts and must not be reused without a current query or UI
observation:

- The `NABD_ALT` database, port `55432`, and container `nabd-postgres-alt`.
- The controlled 17-person roster and 16-person payroll cohort.
- Any open/closed cycle, result totals, statutory totals, or employee-level figures.
- Seeded GL accounts, S/4 success simulation, retro triggers, loans, preflight toggles, or templates.
- Available `default-env.json` destinations and their credentials.

Record current values in the engagement project log, not in this source-baseline file.

## Release acceptance

The kit may claim alignment to this baseline only when:

- active KB/reference statements no longer contradict the current application docs/code;
- skills and commands route to current paths and respect current authorization;
- all internal references and pipeline JavaScript validate;
- no user-specific absolute paths or dead scratch locations remain;
- Word + Slides is stated consistently as the KUT output contract;
- runtime-dependent facts are explicitly dated or marked unverified;
- the bank-template test and deployed-QA work are tracked as later goal phases, not implied complete.
