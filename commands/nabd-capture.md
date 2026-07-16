---
description: Configure Nabd for a business process and capture a clean, de-duplicated screenshot set for it.
argument-hint: <business-process, e.g. BP-10 or "Reports">
---

Use the **nabd-the-consultant** skill to prepare and capture the business process: **$ARGUMENTS**

1. Identify the target in the kit's `reference/BUSINESS_PROCESSES.md` (module code, what it must show) and
   `reference/FEATURE_INVENTORY.md` (where the surface lives). Read any Trainer brief in `briefs/`.
2. Ensure the environment is up (run `/nabd-setup` first if unsure) and that any seeds this process needs are
   present (`reference/SEEDED_DATA.md`) — seed the input the product would, never a computed result.
3. Recon the flow in a browser to learn the REAL labels, native `<select>`s, and footer buttons. Then write a
   Playwright `capture_<id>.mjs` from `templates/capture_TEMPLATE.mjs`: assert each screen by real text before
   shooting, md5-dedup (throw on duplicates), viewport 1440×1000 @2x, `ahmed:ahmed` + `dev_user` cookie.
4. Run it from the Nabd repo root; fix any failures against the real DOM. Deliver a clean set to
   `Screenshots/<ID>/` (no duplicate hashes) and note the exact figures observed.
5. If you hit a product anomaly you can't fix, record it with the **nabd-anomaly-recorder** skill. Record any
   consequential action (run/approve/post/close) in the project log.
