# Prerequisites

## Required

- A clean clone of the current Nabd application repository. Treat it as read-only.
- Node.js 18 or newer and npm.
- Docker Desktop/Engine, or another PostgreSQL 16 instance compatible with the clone's active CAP profile.
- The gitignored `default-env.json` supplied through the approved secret-management route when external destinations or environment overrides are needed.
- A supported Chromium browser. Install Playwright browser binaries only when the target project does not already provide them.
- Permission to use a non-production training/QA deployment and synthetic test data.

## KUT build only

- Run `npm install` in this kit's `build-pipeline/` directory.
- Word and PowerPoint viewers for visual QA. PowerPoint desktop on Windows is optional and is needed only by the legacy deck-combine helper.

## Before any operation

1. Record the application path, branch, and `git rev-parse HEAD`.
2. Confirm the clone is clean; do not discard user changes.
3. Inspect `readme.md`, `.cdsrc.json`, `docker-compose.yml`, and the presence (not contents) of `default-env.json`.
4. Confirm which database/profile is actually resolved. The compose defaults and CAP profile may be overridden; do not infer the live target from one file.
5. Verify backend, Core, and Pay reachability and the authenticated persona's roles.
6. Confirm that Pay is enabled and that any target feature is released for that persona.
7. Inventory the current tenant state required by the task (calendar/cycle, employee cohort, configuration, and output templates).

## Security

Never print or copy secret file contents, access tokens, bank account numbers, national identifiers, or live compensation into a brief, log, screenshot, or generated KUT. Prefer masked previews and synthetic data.
