---
description: End-to-end — capture AND build the KUT (Word + Slides) for a business process.
argument-hint: <business-process, e.g. BP-10 or "Reports">
---

Produce the complete KUT deliverable for: **$ARGUMENTS**, end to end, using the kit's three specialist skills.

1. **Trainer** — read `reference/BUSINESS_PROCESSES.md` + `reference/FEATURE_INVENTORY.md` and the relevant KBs;
   write a short brief (goal, navigation, gates/prereqs, what to capture, figures to confirm) into `briefs/`.
2. **Environment** — ensure the stack is up and healthy (`/nabd-setup`), with the seeds this process needs
   (`reference/SEEDED_DATA.md`).
3. **Consultant** — configure the flow and capture a clean, de-duplicated screenshot set to `Screenshots/<ID>/`
   (see `/nabd-capture`). Note the exact figures. Log any anomaly (nabd-anomaly-recorder) and any consequential
   action (project log).
4. **Documents Generator** — build **Word + Slides** from the shots via `build-pipeline/` and run the QA
   checklist (see `/nabd-build`). No PDF.
5. **Deliver** — put both files in the project material folder, present them with a one-line outcome, and update
   the project log (`KUT_COVERAGE_AUDIT.md`).

Follow the house rules throughout: real screenshots only, never invent figures, English only, no Prerequisites
or edge-case content in a KUT, every step PERFORMED-BY tagged.
