---
name: nabd-pay-environment-setup
description: Start, verify, diagnose, or report a local Nabd Core + Pay environment: PostgreSQL, CAP backend, Core UI, Pay UI, module/release state, persona roles, and required tenant data. Use for setup, stack health, connection/port/database problems, or preparing local testing/capture. Do not configure payroll or edit the application clone.
---

# Nabd Environment Setup

Read `reference/PREREQUISITES.md` and `knowledge-base/KB-05_Environment_Runtime_and_Data.md` first.

## Procedure

1. Record clone path/commit/worktree. Inspect `readme.md`, `.cdsrc.json`, `docker-compose.yml`, package scripts, and only the presence of `default-env.json`.
2. Verify Node/npm, dependencies, Docker/PostgreSQL, and browser prerequisites. If Docker Desktop must be started interactively, ask the user.
3. Determine the resolved CAP profile/database without exposing secrets. Do not assume the compose declaration equals the active target.
4. Start in order: PostgreSQL, backend `:4004`, Core `:3002`, Pay `:3003`. Track only processes you start.
5. Prove database connectivity, backend HTTP, both UIs, authenticated bootstrap, Pay module enablement, persona roles and target feature release.
6. Snapshot task-relevant Core sync/job state and Pay calendar/cycle/config/output state. Employee counts are observations, not fixed gates.
7. Report commands/evidence, process ownership, limitations, and clean stop instructions in the coverage audit.

## Safety

Never display secret file contents or alter the clone. Do not delete containers, volumes, databases or tenant data as a repair. Mock local credentials never apply to deployed QA.

Done means every required layer is proven healthy for the target task, or the exact failing layer and evidence are reported.
