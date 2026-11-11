# Core + Pay business-process map

Use this map to scope configuration, testing, capture, and KUT work. Module codes are stable kit identifiers; runtime gates and labels come from the active clone.

## Recommended learning sequence

| Stage | Module | Process | Minimum evidence |
|---|---|---|---|
| Foundation | BP-01 | Core connection and synchronization | connection mode, schedule/job status, sync result, Data Browser reconciliation |
| Foundation | BP-02 | Employee master and foundation data | people/job/compensation/payment/time views with role-safe masking |
| Foundation | FD-CAL-01 | Calendars and cycles | calendar configuration, cycle generation, lifecycle/deletion rules |
| Foundation | CFG | Payroll configuration | pay items, parameters, brackets, rules, schemes, packs, preflight and effective dating |
| Regular payroll | BP-03 | Readiness and opening | readiness findings, cutoff cohort, opening gates |
| Regular payroll | FD-RUN-01 | Dry run | Run Wizard including selection import, trace/results reconciliation, audited discard |
| Regular payroll | FD-RUN-02 | Actual, approvals, post and close | frozen cohort, actual result, approval stages, G/L gate, permanent close |
| Outputs | BP-PAYSLIP | Payslips | template preview/PDF parity, batch generation, retryable SF push status |
| Outputs | BP-09 | Bank files | template validation, eligibility, masked preview, generated/reconciled artifact |
| Outputs | BP-10 | G/L posting | mapping, balanced journal, authorization, post/reverse evidence |
| Outputs | BP-REPORT | Reports and Report Studio | catalogue/design, eligible data, preview/export reconciliation |
| Outputs | BP-ANALYTICS | Analytics | filters, KPIs, drilldowns, source run/dry fallback where applicable |
| Specialist | BP-13 | Off-cycle | eligible one-time input, calculation and output |
| Specialist | BP-RETRO | Retroactive payroll | source change, trigger, recalculation and reconciliation |
| Specialist | BP-LOAN | Loans and advances | approved input, schedule, deductions and balances |
| Specialist | BP-18 | EoS and leave provisioning | time types/balances, scheme parameters, warnings and calculation |

Data Import is covered only where it is part of a Core or Pay business flow, such as Run Wizard selection. AI & Compliance, report scheduling, and Workforce are outside the kit.

## Payroll lifecycle

```text
Configure -> Generate/open cycle -> Readiness -> Cut off/freeze cohort
          -> Dry run [inspect, rerun, discard]
          -> Actual run -> Approval policy stages -> G/L post -> Close
          -> Bank file / Payslips / Reports / Analytics
```

The exact transitions are enforced by the current backend. Do not teach a transition from an old screenshot or this summary alone.

## KUT module contract

Each module produces a Word manual and matching slide deck using verified facts and real screenshots:

Cover; Document Control; Contents; Purpose; Process at a Glance; Roles; Key Concepts; Configuration when genuinely required; Step-by-Step; Validation; Troubleshooting; Tips; Key Terms; Sign-Off.

Every operational step contains Action, Navigate, Expected result, Screenshot, and `PERFORMED BY`. KUT content excludes prerequisites, test cases, defect lists, and speculative edge behavior; those belong in a UAT/test artifact. See `knowledge-base/KB-02_KUT_UAT_Methodology.md`.
