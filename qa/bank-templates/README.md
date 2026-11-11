# Local bank-template analysis

These files are draft test inputs, not approved bank templates and not QA deployment payloads.

## Text-source findings

### CIB TXT

- Physical file: CRLF, no BOM, seven data records followed by blank lines and three human instruction lines.
- Machine section: one 47-character header, five 34-character detail rows, one 44-character trailer.
- Header grammar is consistent with `H1` (2) + bank literal (9) + two `DDMMYY` dates (12) + a 24-character account/control block.
- Detail grammar is consistent with `D162` (4) + account number (12) + `EGP` (3) + minor-unit salary (13, zero padded) + `CR` (2).
- The written trailer instruction (`T00000` + count 12 + total 19) produces 37 characters, but the sample trailer is 44 characters and does not reconcile to the five detail rows under count, amount, account-digit-sum, or numeric-account-sum interpretations.
- The current date transform does not support `DDMMYY`; the draft uses a required 12-character operator parameter rather than inventing a format.

Status: **blocked** pending the authoritative CIB header/trailer specification and confirmation that `D162`/other literals are tenant-independent.

### HSBC CSV

- UTF-8/ASCII-compatible CRLF CSV with 38 columns, one header and 18 body rows.
- All body rows have 38 parsed fields. Beneficiary account values are quoted and carry a trailing tab; their trimmed value is 12 digits with leading zeroes.
- Stable observed constants include ACH, EG, EGP, `YYYYMMDD` value date, D01, an 8-digit LCC/CBID value, and SALA. Debit account/reference values are modeled as operator params.
- The sample transaction-amount column is `0` for every row. It is not safe to conclude whether production output expects zero, integer units, or decimal net pay.
- The current DSL cannot append a tab to a per-employee source or force quotes per field. Global `quoteWhen:'always'` would change all 38 fields and does not match the sample.

Status: **blocked** pending HSBC confirmation of transaction amount formatting and whether the quoted trailing-tab account representation is an ingestion requirement or only an Excel-preservation artifact.

### Credit Agricole XLSX

- Valid OOXML workbook with one sheet (`Sheet1`), used range `A1:D3`, no headers, merges, hidden rows or hidden columns.
- All 12 source cells are shared-string text. The observed column pattern is a 9-digit identifier, employee name, literal `Salary`, and an integer-text value.
- A four-column XLSX candidate validates and renders through the application's current `xlsx-writer`, preserving every field as text.

Status: **blocked** pending confirmation that column A is the bank account rather than an employee identifier, and that column D is integer salary text with no decimal/date/header/trailer requirements. Workbook visual/style verification also remains pending because the required spreadsheet artifact runtime was unavailable.

### QNB XLS

- Valid OLE Compound File / legacy BIFF workbook with one visible sheet (`QNB_sheet`), used range `A1:G4`, one header row and three body rows. There are no merges, hidden rows or hidden columns.
- The seven headers are `Branch code.`, `Customer ID #`, `Account Number`, `Employee Name`, `code`, `reason`, and `amount`.
- `Branch code.` and `code` contain the same numeric value on every observed row, so the draft maps both to `routingNumber`. `Customer ID #` is constant across the sample and is modeled as an operator parameter. Account number is text, reason is the lowercase literal `salary`, and amount is numeric with up to two observed decimal places.
- The source header is bold, wrapped and yellow. The current XLSX writer models values, native types and number formats but not workbook styling.
- Nabd writes OOXML `.xlsx`, not the legacy `.xls` format supplied as the sample.

Status: **blocked** pending confirmation that QNB accepts `.xlsx`, that both duplicate code columns are the employee routing/branch code, and whether the visual header style is an ingestion requirement.

## Run the structural harness

```text
node qa/bank-templates/test_text_candidates.cjs <app-clone-root> <source-files-root>
node qa/bank-templates/test_xlsx_candidate.cjs <app-clone-root>
set NABD_APP_ROOT=<app-clone-root>
node --require <app-clone-root>/node_modules/@cap-js/cds-test/lib/fixtures/node-test.js --test qa/bank-templates/eligible_generation_candidates.test.js
```

The harness validates all four draft specs through the current application interpreter and proves known structural matches/mismatches. The service-level test saves each template, generates it from two synthetic eligible employees on an approved cycle, and downloads the output. Green tests establish technical compatibility with the current engine; they do not turn an unresolved bank contract into an approved production template.

The final QA action is configuration through the existing Bank Templates page in Chrome or Edge. It is not a code, package or bank-template deployment.
