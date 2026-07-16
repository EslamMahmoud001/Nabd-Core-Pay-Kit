# Nabd — Business Processes (the KUT map)

Nabd's payroll lifecycle is organized as **18 business-process areas** (numbered 10.1–10.18 in the product's
own feature map). This kit's KUT material covers **16** of them as numbered training modules; two areas
(Data Import, AI & Compliance) are intentionally out of the current scope.

Use this file to decide **which business process to document** and **what a module for it must contain**.
Each module ships as a **Word manual** and a matching **slide deck**, built from real captured screenshots.

## The 18 lifecycle areas → KUT modules

| Area | Business process | Module code | What it teaches |
|---|---|---|---|
| 10.1 | Access & Module Availability | — | Roles, module enablement. *Not yet a module.* |
| 10.2 | SuccessFactors Connection & Sync | BP-01 | Connect Nabd to SuccessFactors; sync employees + foundation data |
| 10.3 | S/4 GL Account Sync | — | Chart-of-accounts sync from S/4. *Needs S/4 credentials.* |
| 10.4 | Country Pack Activation | (Config Guide) | Activating an Egypt country pack; using its catalogue |
| 10.5 | Payroll Configuration | Config Guide | Component Studio, Parameters, Bracket Tables — the calculation catalogue |
| 10.6 | Payroll Readiness | BP-03 | Readiness checks; opening a cycle |
| 10.7 | Regular Payroll | FD-RUN-01, FD-RUN-02 | Dry run → cut off → actual run → approve → post → close |
| 10.8 | Approval | (in FD-RUN-02) | 2-stage approval of a run |
| 10.9 | Reports | BP-REPORT | Statutory / management / audit report catalogue + previews |
| 10.10 | Payslips | BP-PAYSLIP | Payslip template design + bulk generation |
| 10.11 | Bank File | BP-09 | Bank payment file generation |
| 10.12 | G/L Posting | BP-10 | Journal build, balance, post to S/4 |
| 10.13 | Off-Cycle Payroll | BP-13 | Off-cycle one-time payment run |
| 10.14 | Retro | BP-RETRO | Back-dated change triggers; next-cycle recompute |
| 10.15 | Loans & Advances | BP-LOAN | Loan recovery schedules, compliance guardrails, policy |
| 10.16 | Data Import | — | Bulk data loads. *Out of scope for V1.* |
| 10.17 | Analytics | BP-ANALYTICS | Executive cost board (KPIs, cost drivers, Gross→Net) |
| 10.18 | AI & Compliance | — | Assisted compliance. *Out of scope for V1.* |
| — | EoS & Leave Provisioning | BP-18 | End-of-service & leave-provision scheme config + accrual ledger |
| — | Pay Calendars & Cycles | FD-CAL-01 | Defining calendars and generating cycles |
| — | Employee Master Data | BP-02 | The Core Data Browser — people, job, comp, pay components |

## Recommended learning order (the 16 modules)

**Group A — Setup & Foundation**
1. Core Integration & Configuration (BP-01) · 2. Employee Master Data Foundation (BP-02) ·
3. Pay Calendars & Cycles (FD-CAL-01) · 4. Payroll Configuration Guide (Config Guide)

**Group B — Regular Payroll Lifecycle**
5. Payroll Readiness & Opening a Cycle (BP-03) · 6. Run Payroll — Dry Run (FD-RUN-01) ·
7. Finalize & Close a Payroll Period (FD-RUN-02)

**Group C — Payments & Outputs**
8. Payslips — Template & Bulk Generation (BP-PAYSLIP) · 9. Bank File Generation (BP-09) ·
10. G/L Posting (BP-10) · 11. Payroll Reports (BP-REPORT) · 12. Payroll Analytics (BP-ANALYTICS)

**Group D — Specialized Processes**
13. Off-Cycle Payroll — One-Time Payments (BP-13) · 14. Retroactive Payroll (BP-RETRO) ·
15. Loans & Advances (BP-LOAN) · 16. End-of-Service & Leave Provisioning (BP-18)

## The payroll lifecycle (the spine of Groups B–C)

```
Configure → Open cycle → Readiness → CUT OFF (freezes the snapshot) → Dry run → ACTUAL run
   → APPROVE (2-stage) → Post to G/L → CLOSE (permanent, no reopen)
   → Bank file · Payslips · Reports · Analytics
```

Gates that matter (see KB-01 §7):
- **Cut off** freezes the employee cohort for the period.
- **Approval** is 2-stage by default before a run can post.
- **Post to G/L** requires a balanced journal; the close gate checks the posting is `posted`.
- **Close** is permanent — the period locks; Payslips/Bank File then draw from the closed run.

## What a KUT module must contain (task-based; house rules)

Canonical section set (KB-02 §2): Cover → Document Control → Contents → 1 Purpose → 2 Process at a Glance →
3 Roles → 4 Key Concepts → [5 Configuration, only if the process has real config] → Step-by-Step
(Action · Navigate · Expected · Screenshot, each tagged **PERFORMED BY**) → Validation → Troubleshooting →
Tips → Key Terms → Sign-Off.

Non-negotiable rules:
- **English only.**
- **No "Prerequisites" section** inside a KUT.
- **No edge-case / testing content** inside a KUT (that belongs to UAT).
- **Every step** carries an Action, a Navigate path, an Expected result, one Screenshot, and a PERFORMED-BY role.
- **Figures in prose must match the screenshots** — never invent amounts, rules, columns, or steps.
- The training tenant is synthetic and the audience knows it — **no training-data disclaimers**.
