---
description: Record a product anomaly observed while operating Nabd into the working anomalies register.
argument-hint: <what you observed>
---

Use the **nabd-anomaly-recorder** skill to record this observation: **$ARGUMENTS**

- If `findings/PRODUCT_ANOMALIES_REGISTER.md` doesn't exist yet, create it from
  `templates/ANOMALY_REGISTER_TEMPLATE.md`.
- Append one numbered, evidenced `## A-NN` entry: severity, status, area, the exact behaviour + reproduction,
  why it matters (and whether it's a product defect or a training-tenant artifact), and concrete evidence
  (screenshot path / SQL query / code `path:line`).
- Record only what you can evidence. This register is handed to engineering separately and is **never shipped
  inside the KUT material**.
