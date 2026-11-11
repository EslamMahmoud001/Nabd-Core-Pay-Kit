# Training-data policy and seed catalogue

This file defines *how* to make a Core + Pay flow demonstrable. It does not claim that a particular tenant already contains these records.

## Rules

- Use a designated local or QA training tenant and synthetic values.
- Prefer supported sync, import, setup, or studio actions. Direct SQL is diagnostic unless a product-owned seed mechanism explicitly requires it.
- Seed the upstream input and let Nabd derive downstream output.
- Record source, time, operator, target environment, identifiers, and cleanup method in the coverage audit.
- Re-query or reopen the UI after seeding. A successful request is not proof that the intended rows or state exist.
- Never seed production and never expose full bank/identity values in screenshots.

## Input-to-output catalogue

| Target flow | Legitimate inputs to prepare | Output that must be produced by Nabd |
|---|---|---|
| Core employee/data browser | SF mock/approved connection and sync jobs | Core persons, employment, job, compensation, payment and time views |
| Regular payroll | employee cohort, pay group, active calendar/cycle, effective configuration, frozen cutoff cohort | dry/actual run results and traces |
| Run selection import | CSV/XLSX employee identifiers accepted by the Run Wizard | selected run cohort and validation feedback |
| Leave/EoS | time-account types/balances, scheme parameters including `working_days_per_month` where applicable | accrual/provision results and warnings |
| Retro | effective-dated source change and retro configuration | retro trigger and recomputation in the supported cycle |
| Off-cycle | employee, eligible pay item, amount/reason, off-cycle setup | off-cycle calculation result |
| Loans/advances | approved loan/advance principal and policy inputs | installment/recovery schedule and payroll deductions |
| Payslips | eligible completed run and payslip template | preview, PDF/batch artifact, and optional SF push status |
| G/L | active mappings, eligible run, and S/4 destination or approved simulation | balanced journal and posting/reversal status |
| Bank file | eligible actual result, approved/posted/closed cycle as enforced, primary bank account, template, value date/parameters | rendered export bytes and audited export metadata |
| Reports/analytics | completed run data and the correct pay-group/cycle filters | reports, exports, KPIs, drilldowns |

## Bank-template source files

External bank specifications may be imported or transcribed only after their structure is inspected and reconciled to the current Bank Template Studio source catalogue. Preserve the original file as evidence; do not treat a filename or visual sample as a complete banking specification. See `reference/BANK_TEMPLATES.md`.
