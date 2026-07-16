# Product Anomalies Register — TEMPLATE

> Copy this file to your working area (e.g. `findings/PRODUCT_ANOMALIES_REGISTER.md`) and append an entry each
> time you observe product behaviour that looks wrong but that you **cannot fix** (the app repo is clone-only).
> This is a **standing handover to engineering** — it is recorded while you work but is **not shipped inside the
> KUT kit**. The kit owner hands this file to the dev team separately.

## How to use
- One `## A-NN · <one-line title>` section per anomaly, numbered in order (A-01, A-02, …).
- Only record what you **observed and can evidence** (a screenshot path, a query, a code path). Don't speculate
  a bug you didn't see.
- Distinguish a **product defect** (wrong behaviour) from a **config/data artifact** of the training tenant —
  say which you believe it is, and why.
- If a KUT screenshot shows the anomaly, name the file so engineering can see it in context.
- The `nabd-anomaly-recorder` skill automates appending well-formed entries here.

## Entry format

```
## A-NN · <short, specific title>

**Severity:** Critical | High | Medium | Low  ·  **Status:** Observed | Confirmed | Reproduced  ·  **Area:** <screen / surface>

<What happens: the exact behaviour, the values, and the state it happens in. Include the reproduction:
which route, which action, which inputs.>

**Why it matters:** <who is affected and how — e.g. "appears on a chart a KUT teaches from and reads as X,
which is wrong". Note if it is a product defect vs a training-tenant config/data artifact.>

**Evidence:** <screenshot path / query / code path:line>. **Fix direction (if known):** <one line>.

---
```

## Severity guide
- **Critical** — wrong net pay, wrong statutory amount, duplicate/missing payment, unbalanced posting, data
  corruption, or an unrecoverable state.
- **High** — wrong payslip/benefit/deduction, a failed integration affecting payroll, wrong retro result,
  missing audit trail.
- **Medium** — a misleading but non-calculating issue on a client-facing screen (e.g. a chart that mis-buckets).
- **Low** — cosmetic (typo, untranslated label) with no payroll or compliance impact.

<!-- Append entries below this line -->
