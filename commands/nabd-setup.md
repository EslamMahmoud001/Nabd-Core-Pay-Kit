---
description: Bring the Nabd stack up locally and verify it is healthy (Postgres → backend → Core/Pay UIs).
---

Use the **nabd-environment-setup** skill to bring the Nabd stack up and verify it is healthy.

Steps:
1. Read the kit's `knowledge-base/KB-05_Environment_Runtime_and_Data.md` §1 for the exact commands.
2. Start (or confirm) Docker Postgres `NABD_ALT` (:55432), the backend (:4004), and the two UIs — Core (:3002)
   and Pay (:3003).
3. Verify healthy: backend returns 200; both UIs reachable on `localhost` (remember the IPv6 `::1` binding —
   `127.0.0.1` may look "down" when the app is up; "port already in use" means it is already running).
4. Confirm the controlled 17-employee roster (`select count(*) from nabd_core_persons` → 17); re-purge if a sync
   repopulated it.
5. Report exactly what you started, what you verified, and the one command that proves each part is up. Record
   the environment state in the project log (`KUT_COVERAGE_AUDIT.md`).

$ARGUMENTS
