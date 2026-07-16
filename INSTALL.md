# Installing the Nabd Core + Pay Kit

The repository is both a **Claude Code plugin** and a one-plugin **marketplace**
(`.claude-plugin/plugin.json` + `.claude-plugin/marketplace.json`), so it installs directly from GitHub.

- **Marketplace name:** `nabd-kit`
- **Plugin name:** `nabd-core-pay-kit`

## 1. Install from GitHub (recommended)

In Claude Code:

```
/plugin marketplace add EslamMahmoud001/Nabd-Core-Pay-Kit
/plugin install nabd-core-pay-kit@nabd-kit
```

Then restart Claude Code (or reload) so the skills and commands register. Verify:

```
/help            # the nabd-* commands should be listed
```

Type a request like *"set up Nabd locally"* — the **nabd-environment-setup** skill should activate — or run
`/nabd-setup`.

## 2. Install from a local clone

```
git clone https://github.com/EslamMahmoud001/Nabd-Core-Pay-Kit.git
```

Then in Claude Code point the marketplace at the local path:

```
/plugin marketplace add /absolute/path/to/Nabd-Core-Pay-Kit
/plugin install nabd-core-pay-kit@nabd-kit
```

## 3. Manual install (no marketplace)

Copy the plugin into your Claude Code plugins directory, or reference it from your settings. The plugin is the
repository root (it contains `.claude-plugin/plugin.json`). Skills live in `skills/`, commands in `commands/` —
Claude Code auto-discovers both once the plugin is enabled.

## Updating

```
/plugin marketplace update nabd-kit
/plugin update nabd-core-pay-kit
```

(Or `git pull` a local clone and re-run the marketplace update.)

## After installing — one-time project setup

The plugin ships the know-how and the build pipeline; the **Nabd application** and its data are separate.

1. Skim **reference/PREREQUISITES.md** and install what's missing (Node ≥ 18, Docker, Playwright/Chromium via
   the app repo, and `npm install` in `build-pipeline/`).
2. Clone the Nabd app repo (clone-only), restore its gitignored `default-env.json`, and bring the stack up —
   **knowledge-base/KB-05** has the exact commands. Or just run `/nabd-setup` and let the skill walk it.
3. Create your project log from `templates/COVERAGE_AUDIT_TEMPLATE.md` and (if needed) your anomalies register
   from `templates/ANOMALY_REGISTER_TEMPLATE.md`.

## Notes

- The kit produces **Word + Slides** only — no PDF/LibreOffice needed.
- The optional "combine all decks into one file" step uses **PowerPoint on Windows** (COM automation); it is not
  required to build the individual documents.
