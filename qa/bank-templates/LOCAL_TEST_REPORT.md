# Four-bank local test report

**Date:** 2026-08-13 · **App commit:** `f15e7ba03e2fd058a7bbfee56e104d23277868cb`

## Engine baseline

- Candidate validation uses the current `spec-interpreter.js` directly.
- XLSX candidate rendering uses the current `xlsx-writer.js`/locked `exceljs`.
- The application-focused `bank-file-templates` regression suite completed successfully with exit code 0.
- Application dependencies were installed with `npm ci --ignore-scripts`; tracked app files remained clean.

## Results

| Bank/source | Hash/type/grammar | Candidate validates | Candidate renders | Exact source contract | Eligible local generation | Status |
|---|:---:|:---:|:---:|:---:|:---:|---|
| CIB TXT | Pass | Pass | Partial: header/detail lengths | Fail: sample trailer contradicts instruction; `DDMMYY` unsupported natively | Pass | Draft only |
| HSBC CSV | Pass | Pass | Pass: 38-column header/body | Fail: amount is zero in sample; account requires quoted trailing tab not expressible per field | Pass | Draft only |
| Credit Agricole XLSX | Package/cell pass | Pass | Pass: valid XLSX bytes | Fail: first column and integer-text amount meaning unconfirmed; source styling not modeled | Pass | Draft only |
| QNB XLS | Pass: BIFF sheet/cell/type/style inspection | Pass | Pass: valid XLSX, exact seven headers/types/duplicate routing columns | Fail: source is legacy XLS; routing mapping and style requirement unconfirmed | Pass | Draft only |

## Evidence

- `test_text_candidates.cjs`: CIB source lengths `47,34,34,34,34,34,44`; candidate `47,34,34,37`. HSBC source and candidate each have exactly 38 columns and identical headers; all 18 source account fields end in a tab while the DSL output cannot.
- `test_xlsx_candidate.cjs`: both spreadsheet drafts have zero validation errors and produce ZIP/OOXML workbooks. Credit Agricole source: `Sheet1`, `A1:D3`, 12 shared-string cells, no merges/hidden rows/hidden columns. QNB source: `QNB_sheet`, `A1:G4`, exact seven-column header, three rows, no merges/hidden rows/hidden columns; the two observed branch/code fields match in every source row.
- `eligible_generation_candidates.test.js`: all four drafts were saved through the current service, generated from two synthetic eligible bank-transfer employees on an approved cycle, and downloaded successfully; 4/4 tests passed against an isolated in-memory database.
- Source files contain personal/bank data and are intentionally not copied into the kit. Reconciliation hashes:
  - CIB TXT: `C192121E073C2A561FBDF1684F636D0AE6EF4E8C2877634694A9C89451CF08F`
  - Credit Agricole XLSX: `769C1D3637B3C7574B89D94366F134193A062A6440E10F0DD7010E5DAF3AC05F`
  - HSBC CSV: `2E8B448A6833D7AEBB2B23263AD9CA52AC1C8E29506348BCEB58A526A65FB601`
  - QNB XLS: `9469D1F24B625257E1BBACACA59285DC13D6CADEF7F356C2AA2A5F158AD1E687`

## Required resolutions

1. CIB: authoritative 44-character trailer map; which header literals/branch prefix are fixed versus tenant params; required handling of two `DDMMYY` dates.
2. HSBC: whether `Transaction Amount` must be net pay and its decimal convention; whether account numbers must be quoted with a trailing tab or the tab is only an Excel-preservation artifact; confirm LCC/CBID source/default.
3. Credit Agricole: identify column A, define column D units/decimals, confirm no header/trailer/date/filename requirements and approve text cell typing.
4. QNB: confirm that `.xlsx` is accepted in place of legacy `.xls`; confirm both duplicate branch/code columns map to the employee routing/branch code; confirm whether the bold/wrapped/yellow header style is required by ingestion.

All four pass technical local generation. They may be created in the existing deployed QA tenant as explicitly named inactive drafts for review. Activation remains withheld until the bank-contract questions above are resolved. No code or artifact deployment is part of this work.
