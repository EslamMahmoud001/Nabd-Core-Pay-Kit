# KB-05 — Environment, runtime and tenant state

## 1. Current local contract

The application clone's quick start is:

```text
npm install
npm start
cd app-core && npm run dev
cd app-pay && npm run dev
```

Defaults: backend `http://localhost:4004`, Core `http://localhost:3002`, Pay `http://localhost:3003`. `npm start` selects the clone's `pg-local` CAP profile. The shipped `docker-compose.yml` defines PostgreSQL 16, container `nabd-postgres`, host port `5432`, database `nabd_dev`, user `nabd`, and a local-development password.

Important: `.cdsrc.json` and gitignored `default-env.json` may define/override a different database and destinations. The compose declaration alone does not prove what CAP will use. Inspect configuration without printing secrets and verify the backend's real connection before proceeding.

## 2. Startup sequence

1. Record clone commit and confirm clean worktree.
2. Confirm Node/npm versions and installed dependencies.
3. Confirm Docker is running and inspect the compose service/container state.
4. Start PostgreSQL through the clone's documented compose workflow if needed.
5. Confirm `default-env.json` presence when the environment requires it; never display its secret contents.
6. Start the CAP backend from the clone root with `npm start`.
7. Start Core from `app-core/` and Pay from `app-pay/` in separate processes.
8. Capture process IDs/log paths or terminal ownership so the environment can be stopped cleanly.

Do not edit the application clone to make environment values fit. Use approved external configuration or report the mismatch.

## 3. Health proof

Use more than “port is open”:

- PostgreSQL container/service is healthy and the configured database accepts a simple read.
- Backend responds over HTTP using an approved local persona.
- Core and Pay load and `whoami`/equivalent bootstrap succeeds.
- Pay module is enabled.
- The intended persona has the expected role set.
- The target feature is released, or this is an authorized preproduction test with `preprod_tester`.
- A focused read from the target service works.

Local mock authentication is defined by the active clone. Never carry mock credentials to a deployed environment; use its approved login/session.

## 4. Tenant-state snapshot

Before configuration or testing, record:

| Area | Record |
|---|---|
| Build | repo path, commit, branch, dirty/clean |
| Runtime | profile, backend/Core/Pay URLs, module flags |
| Identity | persona/user ID and roles (no token) |
| Core | last relevant sync/job result and required source-row counts |
| Pay | calendars/cycles/runs and current statuses |
| Config | target effective date, active pack/scheme/item/template/mapping keys |
| Output | existing exports/postings/batches that could affect rerun/regenerate |

Employee counts are tenant facts, not product constants. The former `NABD_ALT`/17-person state is historical and must not be used as an entry criterion unless the current project explicitly recreates it.

## 5. Common failures

- **Database mismatch:** compose, CAP profile and `default-env.json` disagree. Verify resolved credentials/target; do not rewrite repo files.
- **Missing external destination:** a fresh clone lacks the gitignored environment file. Obtain it through the approved secret channel.
- **UI reachable but actions fail:** inspect backend, `whoami`, module flag, role and release state.
- **Core data empty/stale:** inspect relevant sync job configuration, last result and domain-specific sync; connection success alone is insufficient.
- **Pay screen empty:** verify pay group/calendar/cycle filters, effective date and eligible state.
- **Port already used:** identify the owning process before starting another instance; it may be the intended stack or an unrelated/stale process.
- **IPv4/IPv6 confusion:** test the actual `localhost` URL used by Vite and inspect listeners before declaring the UI down.

## 6. Stop and cleanup

Stop only processes/containers started for this task and preserve diagnostic logs. Do not remove volumes, databases, generated exports, or tenant configuration unless cleanup was explicitly authorized and the exact target was verified. Record any retained state and rollback method.
