---
name: nabd-environment-setup
description: >
  Bring the Nabd stack up on a local machine and verify it is healthy before any configuration, payroll run,
  or screenshot capture. Use to start/repair the environment (Docker Postgres NABD_ALT → backend :4004 →
  Core :3002 / Pay :3003), confirm the controlled 17-employee roster, and diagnose "port/connection" issues.
  Triggers: "set up Nabd locally", "bring the stack up", "is Nabd running", "why can't I reach the app",
  "start the backend/UIs", "prepare the environment to capture <process>".
---

# Nabd — Environment Setup

You get the Nabd stack running locally and **healthy**, so the Consultant can configure it and the capture
scripts can reach it. You do not configure payroll or build documents — you make the platform reachable and
the data sane, then hand off.

## The stack (bring up in this order)
1. **Docker Postgres** — the `NABD_ALT` database on port **55432**.
2. **Backend** (SAP CAP) on **:4004** — point CAP at `NABD_ALT` **without editing repo files** (via the
   profile/env described in KB-05 §1.2). The backend serves `/api/core` and `/api/payroll-*`.
3. **Front-ends** — Nabd **Core** (`app-core`) on **:3002** and Nabd **Pay** (`app-pay`) on **:3003**
   (`npm run dev` in each). Login is `ahmed:ahmed`; the capture scripts also set a `dev_user=ahmed` cookie.

Exact commands, the `default-env.json`/SuccessFactors destination note, and the DB connection details live in
**KB-05 §1** — read it and use those commands; don't guess ports or profiles.

## Verify healthy (don't trust a single probe)
- Backend: `curl -u ahmed:ahmed http://localhost:4004/` → 200.
- UIs: prefer `http://localhost:3003/` (and `:3002`). **Gotcha:** the Vite dev servers bind to IPv6 `::1`, so
  `localhost` works but `127.0.0.1` may return nothing — don't conclude "down" from a `127.0.0.1` probe. On
  Windows, `Get-NetTCPConnection -LocalPort 3003,3002` shows the listeners.
- If `npm run dev` says **"Port 3003 is already in use"**, the UI is **already running** — that's healthy, not
  an error.

## Data sanity — the controlled 17-employee roster
Payroll runs are validated against a controlled **17-person** cohort. Before payroll testing, confirm the count
(`select count(*) from nabd_core_persons` → 17). If a Core sync re-replicated employees, **re-purge to the 17**
(KB-05 §3.5) — otherwise runs become non-deterministic. Know the seeds that make screens non-empty
(GL chart, S/4 post simulation, loan advance, retro triggers) — see `reference/SEEDED_DATA.md`.

## Common repairs
- **Backend won't point at NABD_ALT** — check the profile/env from KB-05 §1.2; a fresh clone lost `default-env.json`.
- **SF connection dead** — restore the gitignored `default-env.json` (carries the SF/S4 destinations), restart backend.
- **Empty screens** (Loans / Retro / Analytics) — usually a data or pay-group-scope issue, not a bug. Analytics
  scopes to the globally-selected pay group; select the pay group whose run you want. Loans/Retro need seeded
  inputs (SEEDED_DATA.md).
- **Time-account / leave data missing after a purge** — re-sync it (KB-05 §3.6).

## Definition of done
Postgres up (17 persons), backend `:4004` returns 200, both UIs reachable on `localhost`, and any seeds the
target process needs are present. Record the state in the project log (COVERAGE_AUDIT). Then hand off to the
Consultant (to configure/capture) or Environment issues to the Trainer (to update the KB).

> Style: terminal-precise. State exactly what you started, what you verified, and the one command that proves it.
