# Nabd Core + Pay Kit

A **Claude Code plugin** that lets a team **configure and operate the Nabd Core + Pay payroll platform on a
local machine** and **generate professional Key User Training (KUT) material** for its business processes —
built from real, captured screenshots, on the same brand.

It packages five skills, a knowledge base, a set of reference docs, working templates, a branded Word + Slides
build pipeline, and slash commands into one installable kit.

---

## What you can do with it

1. **Bring Nabd up locally and operate it** — Postgres → backend → Core (`:3002`) / Pay (`:3003`), configure
   pay items / calendars / packs / preflight / bank & payslip templates / G/L mapping, and run the full payroll
   lifecycle (readiness → cut off → run → approve → post → close).
2. **Generate KUT material for a business process** — capture a clean, de-duplicated screenshot set with
   Playwright, then build a **Word manual + slide deck** with the branded pipeline, following a strict
   methodology and QA checklist.

The two workflows chain: `/nabd-setup` → `/nabd-capture <BP>` → `/nabd-build <BP>` (or `/nabd-kut <BP>` end to end).

---

## What's inside

```
nabd-core-pay-kit/
├── .claude-plugin/
│   ├── plugin.json            # plugin manifest
│   └── marketplace.json       # so `/plugin marketplace add` works from GitHub
├── skills/
│   ├── nabd-the-trainer/          knowledge steward — owns the KB, writes briefs
│   ├── nabd-the-consultant/       expert operator — configures Nabd, captures evidence
│   ├── nabd-documents-generator/  deliverable factory — builds Word + Slides, runs QA
│   ├── nabd-environment-setup/    brings the stack up and verifies it is healthy
│   └── nabd-anomaly-recorder/     records product anomalies to the working register
├── commands/
│   ├── nabd-setup.md · nabd-capture.md · nabd-build.md · nabd-kut.md · nabd-anomaly.md
├── knowledge-base/            KB-01 System · KB-02 Methodology · KB-04 Lessons/Playbook ·
│                              KB-05 Environment/Runtime/Data · KB-06 Agent Delegation
├── reference/                 BUSINESS_PROCESSES · FEATURE_INVENTORY · SEEDED_DATA ·
│                              PREREQUISITES · ASSUMPTIONS
├── templates/                 ANOMALY_REGISTER · COVERAGE_AUDIT (project log) · capture_TEMPLATE.mjs
└── build-pipeline/            kutlib.js + build_slides.js + per-module builders + brand assets
```

### The five skills (how they work together)

- **The Trainer** — the memory. Owns the knowledge base, keeps it true to the running app, and writes small
  task-scoped **briefs** that feed the other two.
- **The Consultant** — the hands. Drives Nabd end to end, configures it, and writes/validates the Playwright
  **capture scripts** that produce clean screenshots.
- **The Documents Generator** — the factory. Turns verified facts + real screenshots into polished **Word +
  Slides**, and never ships something that fails its own QA checklist.
- **Environment Setup** — gets the stack running locally and verifies it is healthy before any of the above.
- **Anomaly Recorder** — records product behaviour that looks wrong but can't be fixed here, into a working
  register handed to engineering (not shipped inside the KUT).

Skills activate automatically when your request matches them; you can also drive the flow with the commands.

---

## Install

This repo is both a **plugin** and a one-plugin **marketplace**, so you can install it straight from GitHub:

```
/plugin marketplace add EslamMahmoud001/Nabd-Core-Pay-Kit
/plugin install nabd-core-pay-kit@nabd-kit
```

See **[INSTALL.md](INSTALL.md)** for a manual install and for updating.

---

## Quick start

```
/nabd-setup                     # bring Nabd up locally and verify it's healthy
/nabd-kut BP-10                 # capture + build the G/L Posting KUT (Word + Slides), end to end
```

Or step by step: `/nabd-capture Reports` then `/nabd-build Reports`.

Before your first run, skim **reference/PREREQUISITES.md** (what you need installed) and
**knowledge-base/KB-05** (how to run the stack). The list of business processes and what each module must cover
is in **reference/BUSINESS_PROCESSES.md**.

---

## The business processes

16 numbered KUT modules across four stages — Setup & Foundation, Regular Payroll Lifecycle, Payments & Outputs,
and Specialized Processes — mapped to Nabd's 18 lifecycle areas. Full map + the required section set for each
module: **[reference/BUSINESS_PROCESSES.md](reference/BUSINESS_PROCESSES.md)**. What Nabd actually includes and
where each surface lives: **[reference/FEATURE_INVENTORY.md](reference/FEATURE_INVENTORY.md)**.

---

## House rules (the kit enforces these)

- The Nabd app repo is **clone-only** — fix things in **configuration through the UI**, never by editing app code.
- **Screenshots are always real** (local Playwright); never mock-ups.
- **Never invent** amounts, rules, columns, or steps — seed the *input* a missing system would provide and let
  Nabd compute the result (see **reference/SEEDED_DATA.md**).
- **Word + Slides only** — PDFs are intentionally not generated.
- KUT content: **English only**, **no Prerequisites section**, **no edge/testing content**, every step
  **PERFORMED-BY** tagged.
- The **Product Anomalies Register** is a handover to engineering — recorded while working, **never shipped**
  inside the KUT.

---

_Author: Eslam Mahmoud · Raptors Technology. Not affiliated with SAP. Nabd application code is not included in
this kit._
