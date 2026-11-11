# Nabd Core + Pay Kit 1.1.0 execution report

**Date:** 2026-08-13  
**Application baseline:** `f15e7ba03e2fd058a7bbfee56e104d23277868cb`  
**Scope:** Core + Pay only

## Outcome summary

| Requirement | Result | Authoritative evidence |
|---|---|---|
| Reconcile kit to latest supplied clone | Pass | `qa/SOURCE_BASELINE.md`; clone commit and clean worktree rechecked |
| Update plugin manifests/content | Pass | version `1.1.0`; manifest/marketplace/install names agree; five current skills and commands |
| Remove stale product/runtime claims | Pass | Tier 0 guards plus current KB/reference review |
| Keep application clone read-only | Pass | `git status --short` empty after dependency/test work |
| Validate full Word + Slides pipeline | Pass | 16 module DOCX, 16 module PPTX, overview PPTX and chrome PPTX built in a temporary directory; all 34 contain the required OOXML root part |
| Model four root bank samples | Pass for technical draft configuration | four candidate JSON specs, privacy-safe structural analysis and per-format harnesses |
| Validate four candidates in current engine | Pass | current interpreter reports zero validation errors for all four |
| Eligible synthetic generation | Pass | isolated in-memory CAP service: save, generate and download passed 4/4 |
| Configure deployed QA through browser UI | Pass | Edge-authenticated QA Studio contains exactly four uniquely keyed inactive drafts; each saved with a zero-problem synthetic live preview |
| Activate templates | Not authorized | exact bank-contract questions remain; drafts must stay inactive |

## Tier results

### Tier 0 — static and package

- `node qa/tier0_static_check.mjs`: **32 passed, 0 failed**.
- 43 pipeline JavaScript files pass `node --check`.
- Four candidate files are valid JSON; three bank harnesses pass `node --check`.
- `git diff --check`: clean.
- The repository is intentionally a Claude Code plugin using `.claude-plugin`; no Codex-marketplace conversion was performed.

### Tier 1 — discovery/install

Not run in a fresh Claude Code process. Static discovery contracts are present: five skills, five matching `/nabd-*` commands, consistent marketplace/plugin names and documented install commands.

### Tier 2 — environment/read-only

Source and test work used the clean application clone. A live local tenant/UI smoke was not needed for candidate engine validation and has not been claimed.

### Tier 3 — four-bank local technical gate

- CIB fixed-width candidate: validates, renders known header/detail grammar, and generates/downloads through the service. The source trailer contradicts its own written layout, and `DDMMYY` requires a parameter under the current transform catalogue.
- HSBC CSV candidate: validates, preserves 38 columns and exact header, and generates/downloads. Source amounts are all zero and account cells contain trailing tabs that the per-field DSL cannot reproduce.
- Credit Agricole XLSX candidate: validates, creates valid OOXML, and generates/downloads. Column-A meaning and integer-text amount convention remain bank-contract questions.
- QNB XLS source: workbook sheet/cells/types/styles were inspected read-only; the XLSX candidate validates and generates/downloads. QNB acceptance of `.xlsx`, duplicated routing-column meaning and header-style requirement remain questions.

Candidate tests use synthetic identifiers and amounts. Source employee names and account values are not copied into the kit or this report.

### Tier 4 — deployed QA UI

The required action was UI configuration in the already deployed QA tenant, not deployment. Edge was selected because Chrome was not connected. A fresh authenticated Nabd Pay tab provided authoring access, and the Bank Templates Studio was configured through its visible controls only.

Final QA list state: **4 templates**, all **Inactive**, with an **Activate** action (not Deactivate):

- `cib-eg-fixed-width.draft` — Fixed;
- `hsbc-eg-ach.draft` — CSV, 38 header fields and 38 body fields;
- `credit-agricole-eg-xlsx.draft` — XLSX, `Sheet1`, four body fields;
- `qnb-eg-xlsx.draft` — XLSX, `QNB_sheet`, seven header and seven body fields.

Each draft reached Review with zero validation problems and a privacy-safe synthetic preview before save. New records defaulted active in Studio and were immediately deactivated. The temporary `dme.generic` and `cib-eg-xlsx.v1` starters used to preserve or obtain UI-only format metadata were deactivated and then deleted with the normal recoverable delete option; the permanent-delete checkbox was not selected. The final list contains neither starter.

### Tier 5 — KUT pipeline

All module wrappers and program decks built successfully to temporary output:

- 16 DOCX module packages;
- 16 PPTX module packages;
- 1 program-overview PPTX;
- 1 chrome/transition PPTX.

Every package contained `word/document.xml` or `ppt/presentation.xml` as applicable. Generated drafts intentionally retain `VERIFY` markers until a real evidence manifest and screenshots are supplied; the kit does not present those scaffolds as released KUT deliverables.

## Release statement

The kit content, local four-bank technical configuration and deployed-QA inactive-draft configuration are validated at the stated commit. Bank-owner approval and activation remain separate external gates; no draft was activated.
