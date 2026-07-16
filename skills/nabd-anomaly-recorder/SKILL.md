---
name: nabd-anomaly-recorder
description: >
  Record a product anomaly observed while operating Nabd — behaviour that looks wrong but that cannot be fixed
  here (the app repo is clone-only). Appends a well-formed, evidenced entry to the working Product Anomalies
  Register (a standing handover to engineering that is NOT shipped inside the KUT kit). Use when you notice a
  wrong value, a broken/misleading screen, an untranslated label, or odd behaviour during capture or config.
  Triggers: "log this anomaly", "record a finding", "this looks like a bug", "add to the anomalies register".
---

# Nabd — Anomaly Recorder

You capture product anomalies cleanly so engineering can act on them later. This register is a **working
handover artifact** — recorded while the team operates Nabd, handed to the dev team separately, and **never
distributed inside the KUT material**.

## When to record
Record when you observe behaviour that is **wrong or misleading** and that you **cannot fix** (config-only /
clone-only repo). Examples: a chart that mis-buckets, a wrong or missing value, an untranslated i18n key on
screen, a gate that blocks incorrectly, a stale result that shouldn't persist.

Do **not** record: your own capture-script bugs, expected empty states, or anything you can fix in config.

## How to record
1. If the register doesn't exist yet, copy `templates/ANOMALY_REGISTER_TEMPLATE.md` to the working area
   (e.g. `findings/PRODUCT_ANOMALIES_REGISTER.md`).
2. Append one `## A-NN · <title>` section using the template's entry format. Number sequentially.
3. Fill every field from what you **actually observed**:
   - **Severity** (Critical/High/Medium/Low — see the template's guide) and **Status** (Observed/Confirmed/Reproduced).
   - **Area** — the screen/surface.
   - The exact behaviour + values + the **reproduction** (route, action, inputs).
   - **Why it matters** — who's affected; and whether you believe it's a **product defect** or a
     **training-tenant config/data artifact** (say which and why).
   - **Evidence** — a screenshot path, a SQL query, or a `path:line` in the app code. If a KUT screenshot shows
     it, name that file.
   - **Fix direction** — one line, only if it's clear.

## Verification discipline
Only record what you can evidence. If you can't point to a screenshot, a query result, or a code path, you
haven't confirmed it — investigate first, or mark it **Observed** (not Confirmed) and say what's unverified.
Distinguish a genuine product bug from an artifact of the synthetic tenant's keys/data.

## Boundary
- This register is **excluded from the shipped KUT kit** — it is engineering's, not the trainees'.
- You never fix the app to make an anomaly go away; you record it and, if there's a config workaround for the
  training capture, note that in the project log (COVERAGE_AUDIT), not here.

## Definition of done
A numbered, evidenced entry exists in the working register, with severity/area/reproduction/why-it-matters and
a concrete piece of evidence. If it changes how a KUT reads, tell the Trainer so the doc's prose stays honest.

> Style: precise and neutral — describe the behaviour and the evidence, not blame. One anomaly per entry.
