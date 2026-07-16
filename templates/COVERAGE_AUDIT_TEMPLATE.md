# KUT Coverage Audit / Project Log — TEMPLATE

> Copy to your working area (e.g. `KUT_COVERAGE_AUDIT.md`). This is the **living status** of your engagement:
> which business processes are documented, and a dated log of every environment change and consequential action.
> The Trainer/Documents skills keep this honest — update it whenever a doc is delivered or the environment changes.

## Coverage — the 16 modules

| # | Business process | Module | Captured | Doc built | Delivered | Notes |
|---|---|---|:--:|:--:|:--:|---|
| 01 | Core Integration & Configuration | BP-01 | ☐ | ☐ | ☐ | |
| 02 | Employee Master Data Foundation | BP-02 | ☐ | ☐ | ☐ | |
| 03 | Pay Calendars & Cycles | FD-CAL-01 | ☐ | ☐ | ☐ | |
| 04 | Payroll Configuration Guide | Config Guide | ☐ | ☐ | ☐ | |
| 05 | Payroll Readiness & Opening a Cycle | BP-03 | ☐ | ☐ | ☐ | |
| 06 | Run Payroll — Dry Run | FD-RUN-01 | ☐ | ☐ | ☐ | |
| 07 | Finalize & Close a Payroll Period | FD-RUN-02 | ☐ | ☐ | ☐ | |
| 08 | Payslips — Template & Bulk Generation | BP-PAYSLIP | ☐ | ☐ | ☐ | |
| 09 | Bank File Generation | BP-09 | ☐ | ☐ | ☐ | |
| 10 | G/L Posting | BP-10 | ☐ | ☐ | ☐ | |
| 11 | Payroll Reports | BP-REPORT | ☐ | ☐ | ☐ | |
| 12 | Payroll Analytics | BP-ANALYTICS | ☐ | ☐ | ☐ | |
| 13 | Off-Cycle Payroll — One-Time | BP-13 | ☐ | ☐ | ☐ | |
| 14 | Retroactive Payroll | BP-RETRO | ☐ | ☐ | ☐ | |
| 15 | Loans & Advances | BP-LOAN | ☐ | ☐ | ☐ | |
| 16 | End-of-Service & Leave Provisioning | BP-18 | ☐ | ☐ | ☐ | |

Coverage values per module: **Captured** (clean, de-duplicated screenshot set exists) · **Doc built** (Word +
Slides built and QA-passed) · **Delivered** (in the final material folder).

## Environment state (keep current)

- Database `NABD_ALT` up: ☐ · Backend `:4004`: ☐ · Core `:3002`: ☐ · Pay `:3003`: ☐
- Roster is the controlled 17: ☐ (re-purge if a sync repopulated it)
- Seeds applied (see reference/SEEDED_DATA.md): GL chart ☐ · S/4 post simulated ☐ · loan advance ☐ ·
  retro triggers ☐ · off-cycle pay item ☐ · preflight toggles ☐

## Consequential-action log (append-only)

Record every actual run / approve / post / close / hard-delete / regenerate, with date, who, and why.

- `YYYY-MM-DD` — <action> — <cycle/entity> — <reason / result>

## Change log (append every session)

- `YYYY-MM-DD` — <what changed in the app/config/data; what was delivered; what to re-verify next time>
