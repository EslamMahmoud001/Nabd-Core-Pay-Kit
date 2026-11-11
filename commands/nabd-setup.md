---
description: Start or verify a local Nabd Core + Pay stack and capture its actual runtime/tenant state.
argument-hint: [application-clone-path]
---

Use **nabd-pay-environment-setup** for `$ARGUMENTS`.

Record clone commit/worktree; reconcile `readme.md`, `.cdsrc.json`, compose and external-env presence; determine the resolved database/profile without exposing secrets; start/verify PostgreSQL → backend `:4004` → Core `:3002` → Pay `:3003`; prove authenticated bootstrap, module enablement, persona roles and target feature release. Snapshot task-relevant Core jobs/data and Pay lifecycle/config state. Do not require an old database name or employee count, and do not edit the clone.
