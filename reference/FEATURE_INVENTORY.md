# Core + Pay feature inventory

This is a navigation and verification index, not a substitute for the active clone. Labels and release state must be confirmed in the running app.

## Platform

| Surface | Local default | Responsibility |
|---|---:|---|
| CAP backend | `4004` | Core and Pay services, integrations, engine, scheduled jobs |
| Core UI | `3002` | integration administration, synced HR/foundation/time data, settings |
| Pay UI | `3003` | payroll configuration, processing, results, financial outputs |
| PostgreSQL | `5432` in shipped compose | dedicated deployment database; active profile/override must be verified |

Core is always enabled. Pay is module-gated through `ModuleFlags`. Background work is in-process with `node-cron`/job configuration; Redis or BullMQ is not part of the current runtime.

## Core routes and capabilities

- `/hub`: landing and module handoff.
- Employee and foundation streams: `/employees`, `/leave`, `/timesheet`, `/balances`, `/foundation`, `/s4-gl-accounts`, `/advances`.
- Operations: audit, alerts, notifications, and Data Browser, including Time Account Types and current statutory/payment labels.
- Settings: connection, schedule, advanced, notifications, modules, and branding.
- SuccessFactors integration supports the connection modes implemented by the current clone, including SOAP Basic and OAuth2 SAML Bearer. Never put destination secrets in documentation.
- Sync/job state is persisted in product entities and scheduled in process. Verify job enablement, schedule, last run, and result before assuming data is current.

## Pay routes and capabilities

### Operate

- `/home`, `/readiness`, `/runs`, `/runs/new`, `/runs/:runId`, `/results`.
- Run Wizard supports dry and actual flows plus CSV/XLSX employee-selection import.
- Cutoff freezes the cycle cohort; actual execution requires the frozen cohort. Dry results can be discarded at cycle level with audit history.
- Approval, G/L, bank, payslip, close, rerun cleanup, off-cycle, retro, loan, EoS/leave, analytics and report flows are state/role gated.
- `/payroll/spot-run` is currently release-gated. Access requires the normal route role plus released feature state, or the pre-production-only tester scope.

### Configure

- Component/Pay Item Studio: effective-dated pay items, cumulations, version timeline, derived `effectiveTo`, and supported hard-delete action.
- Parameters, Schemes, and Bracket Tables: effective-dated lanes may contain gaps but must not overlap.
- Country packs, rules, calendars, preflight/readiness, approval policies, G/L mapping/routing, bank templates, payslip templates, loans and other specialist configuration.
- Calendar deletion semantics depend on use: dry/never-run calendars can be hard-deleted when the released capability permits; committed history is archived rather than erased.

### Outputs and analysis

- Results and employee details apply compensation/identity access separately from route visibility.
- Payslip Studio maintains preview/PDF parity, supports batch generation, and exposes retryable SuccessFactors push errors.
- Bank Template Studio and Bank File support delimited, fixed-width, XLSX, and XML data-driven formats. See `reference/BANK_TEMPLATES.md`.
- G/L Posting enforces mapping, balance, authorization, posting and reversal contracts.
- Reports, Report Studio, analytics and exports use the eligible run and filters; analytics may fall back to dry-run data where the current handler permits it.
- Report scheduling and AI-assisted capabilities are not part of this kit's committed workflow.

## Roles and access summary

Current customer-facing roles: `tenant_admin`, `consultant`, `payroll_admin`, `payroll_manager`, `approver`, `hr_director`, `finance_director`; `tc_ops` is an operational Core role. `preprod_tester` is an environment-scoped preproduction capability, not a production business role.

- Tenant admin: platform/config administration and release-board visibility; exact actions remain handler-gated.
- Consultant: configuration author; no assumption of live compensation, personal data, or raw SF access.
- Payroll admin: operational access and selected read-only configuration; Schemes/Packs/Preflight authoring is not implied.
- Payroll manager / HR director: operational review and stage-one approval according to policy.
- Finance director: financial approval and G/L post/reverse responsibilities.
- Route visibility is not data authorization. Verify both the frontend guard and backend handler for sensitive actions.

## Verification paths in the app clone

1. `CLAUDE.md` and `docs/README.md`.
2. Relevant `docs/core/**` or `docs/pay/features/**` feature document.
3. `app-core/src/App.jsx` or `app-pay/src/App.jsx` and `app-pay/src/lib/role-routing.js`.
4. Service `.cds` contract, handler under `srv/handlers/**`, schema under `db/**`, and focused tests.
