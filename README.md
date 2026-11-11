# Nabd Core + Pay Kit

A Claude Code plugin for operating and documenting the current Nabd **Core + Pay** platform. It provides five focused skills, matching commands, an evidence-based knowledge base, capture templates, QA gates, and a branded Word + Slides KUT pipeline.

The kit does not include the Nabd application, credentials, tenant data, or bank secrets. Workforce, AI/Compliance and deferred roadmap features are out of scope.

## Capabilities

- Start and verify a local Nabd stack: PostgreSQL, CAP `:4004`, Core `:3002`, Pay `:3003`.
- Reconcile the kit against a current read-only application clone.
- Configure and validate Core/Pay business flows with role, release, data, effective-date and lifecycle awareness.
- Design and test data-driven bank-file templates for delimited, fixed-width, XLSX and XML formats.
- Capture repeatable, real, de-duplicated screenshots with Playwright.
- Build and visually QA English KUT/UAT deliverables in Word + Slides.
- Record product anomalies as separate evidenced engineering handovers.

## Install

```text
/plugin marketplace add EslamMahmoud001/Nabd-Core-Pay-Kit
/plugin install nabd-pay-kit@nabd-kit
```

See [INSTALL.md](INSTALL.md).

## Commands

```text
/nabd-setup [clone path]
/nabd-capture <process>
/nabd-build <process>
/nabd-kut <process>
/nabd-anomaly <observation>
```

Natural-language requests activate the same skills.

## Repository map

```text
.claude-plugin/     plugin and marketplace manifests
skills/             Trainer, Environment, Consultant, Documents, Anomaly
commands/           slash-command entry points
knowledge-base/     product, methodology, playbook, runtime, orchestration
reference/          process/features/data/prerequisites/bank-template contracts
templates/          capture, coverage-audit and anomaly templates
build-pipeline/     reusable Word + Slides builders and brand assets
qa/                 source baseline, validators and test plan
```

## First use

1. Read `reference/PREREQUISITES.md` and restore the app clone's approved gitignored environment configuration without exposing it.
2. Run `/nabd-setup <clone path>` and record the actual profile/database, identity/roles, module/release state and tenant snapshot.
3. For a KUT, run `/nabd-kut <module>` or use capture/build separately.
4. For bank formats, follow `reference/BANK_TEMPLATES.md`: pass local structural/render validation for every bank before configuring deployed QA.

## Non-negotiable rules

- Core + Pay only; the application clone is read-only.
- Product facts come from the active clone and runtime, not historical tenant values.
- Seed inputs and let Nabd calculate outputs.
- Confirm and record consequential actions.
- Use real, safe screenshots; never expose credentials, bank/identity values or live compensation.
- KUT output is Word + Slides only. Anomaly registers stay separate.

Version 2.1.0 (the 1.1.0 content under the `nabd-pay-*` names) is baselined to the application commit recorded in `qa/SOURCE_BASELINE.md`.
