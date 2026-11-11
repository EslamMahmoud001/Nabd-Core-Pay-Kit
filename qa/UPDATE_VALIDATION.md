# Core + Pay Kit 1.1.0 update validation

**Date:** 2026-08-13 · **Application baseline:** `f15e7ba03e2fd058a7bbfee56e104d23277868cb`

## Completed gates

| Gate | Result | Evidence |
|---|---|---|
| App clone integrity | Pass | clean worktree at the baseline commit after reconciliation |
| Cross-platform Tier 0 | Pass | 32 checks, 0 failures (`node qa/tier0_static_check.mjs`) |
| Pipeline syntax | Pass | 43 JavaScript files pass `node --check` |
| Manifest consistency | Pass | plugin/marketplace/README/INSTALL agree on 1.1.0 and install names |
| Skill structure | Pass | five unique skills; frontmatter checked against skill-creator name/description/key rules |
| Active-doc drift guard | Pass | no machine path, obsolete runtime assertion, or mojibake in active docs |
| Git hygiene | Pass | dependencies, screenshots, generated DOCX/PPTX remain untracked |
| Word smoke | Pass | `Nabd_Core_Pay_Pipeline_Example.docx`, valid OOXML package, 112,815 bytes |
| Slides smoke | Pass | `Nabd_Core_Pay_Pipeline_Example.pptx`, valid OOXML package, 12 slides |
| BP-09 current scaffold | Pass | DOCX 113,797 bytes and PPTX 14 slides; no historical tenant figures embedded |
| Full wrapper build | Pass | all 16 DOCX and 16 matching module PPTX files plus overview/chrome decks built; 34/34 valid OOXML packages |
| Raster-input guard | Pass | real PNG accepted; unsupported/non-image input rejected before `pptxgenjs` |
| Whitespace/diff check | Pass | `git diff --check` clean |
| Deployed QA UI configuration | Pass | exactly four bank drafts visible in Edge; all four inactive; synthetic Studio previews passed |

Generated smoke artifacts are ignored test outputs, not release deliverables.

## Dependency note

`npm audit` reports two high findings representing one transitive `image-size` denial-of-service risk through `pptxgenjs` when parsing malformed ICNS/JXL/HEIF. npm currently offers a breaking major downgrade rather than an upstream fixed dependency. The pipeline therefore restricts screenshot inputs to signature-verified PNG/JPEG from the trusted capture workflow. Re-audit on every dependency update.

## Validator limitation

The skill-creator Python validator could not start because PyYAML is not installed in the available Python runtimes. Its complete frontmatter rule set (allowed keys, hyphen-case/name length, description length, no angle brackets) is mirrored by `qa/tier0_static_check.mjs` and passed for all five skills.

## Bank-template local work

- Current app dependencies installed without lifecycle scripts; tracked clone remains clean.
- Focused application `bank-file-templates` regression suite passed.
- CIB TXT, HSBC CSV, Credit Agricole XLSX and QNB XLSX draft specs validate through the current interpreter; structural render tests passed for known portions.
- All four drafts also pass current-service save, eligible synthetic generation and download against an isolated in-memory database (4/4).
- None is release-ready because source-contract unknowns remain. QNB legacy BIFF contents were inspected read-only, but `.xlsx` acceptance, routing-field mapping and header-style requirements still need confirmation. See `qa/bank-templates/LOCAL_TEST_REPORT.md`.
- The remote phase was completed through the existing QA tenant's Edge UI; it was not a deployment. The configured inactive keys are `cib-eg-fixed-width.draft`, `hsbc-eg-ach.draft`, `credit-agricole-eg-xlsx.draft` and `qnb-eg-xlsx.draft`.
- Studio Review showed zero validation problems for every draft. The final list contains exactly those four records, each with Inactive status. Temporary format-helper starters were normally (non-permanently) deleted after use.

## Remaining validation / external handoff

- Plugin install/discovery in a fresh Claude Code session.
- Live local Core/Pay environment and tenant-state smoke.
- Bank-owner confirmation of the remaining exact-contract questions and any template activation.
