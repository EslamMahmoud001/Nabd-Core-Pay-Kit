# QA tenant bank-file validation

**Date:** 2026-08-13  
**Scope:** Nabd Core and Nabd Pay only  
**Tenant:** Raptors QA  
**Cycle:** `D2K_Test:2026P07` / D2K July

This report contains no employee names, account numbers, or bank identifiers.

## Outcome

Actual bank-file validation is correctly blocked by missing SuccessFactors payment master data. The selected cycle has 30 payroll-result employees, zero bank-payable rows, 30 excluded rows, and a file total of EGP 0.00. The two historical exports on the cycle also contain zero records.

The problem is upstream of the template renderer. A scoped full employee re-initialization completed successfully for 57 SF records and still produced no employee bank-account rows. The captured, redacted CompoundEmployee response contained no account-number, IBAN, routing, or bank-detail elements; the observed `PaymentInformationV3` container had no detail children.

No empty replacement file was generated during this validation. Regeneration was re-validated against live data and remained disabled with the blocker “At least one payable employee,” leaving the existing export unchanged.

## Corrections made in QA

- Activated Payroll readiness check `bank_accounts_present` as a blocker. Readiness now shows 30 affected employees instead of incorrectly reporting Employee data as passed.
- Activated Bank File check `has_payable` as a blocker. The Bank File page now shows 5 of 6 passing and refuses zero-row generation.
- Ran Core Employees delta sync: success, zero changed records.
- Ran Core Employees “Re-initialize from scratch”: success, 57 records processed, zero failed.
- Corrected copied/missing Arabic template metadata:
  - HSBC: `مسودة رفع رواتب HSBC مصر عبر ACH`
  - CIB: `مسودة ملف رواتب CIB مصر بعرض ثابت`
  - Credit Agricole: `مسودة رفع رواتب كريدي أجريكول مصر`
- Preserved all four English names with `DRAFT`; no unresolved bank contract was promoted as approved.

## Saved-template audit

| Template | Live format | Shape | Parameters | Result |
|---|---|---|---|---|
| HSBC Egypt ACH | CSV, UTF-8, CRLF, comma | 38-column header + 38-column employee body | Debit account, first/second party references, payment-set code, LCC/CBID | Studio synthetic preview renders; bank-contract questions remain |
| CIB Egypt | ASCII fixed width, CRLF | 47-char header, 34-char detail, current 37-char trailer | 12-char date block, 24-char header account/control block | Current draft matches written instruction, not the supplied 44-char sample trailer |
| Credit Agricole Egypt | XLSX, `Sheet1` | Four body cells, no header/trailer | None | Studio synthetic preview renders; column-A and amount typing still need bank approval |
| QNB Egypt | XLSX, `QNB_sheet` | Seven-column header + seven-column body | Customer ID | Studio synthetic preview renders; legacy XLS acceptance, routing mapping, and amount format need approval |

All four templates were active in QA when inspected. They remain explicitly named `DRAFT`. Activation proves only that the template appears in the picker; it is not bank acceptance.

## Live eligibility proof

Current Pay logic requires:

- actual payroll result;
- employment payment method exactly `05`;
- primary, non-deleted account with account number or IBAN;
- positive net pay;
- one file currency.

The deployed cycle fails before rendering because every result line is classified as `not_bank_payment`, and the account/bank columns are empty. The classification checks payment method before account presence, so the UI says “Not paid by bank” even when the account is also absent.

## EC handoff required

For each employee to be paid through a bank file, EC must provide an effective payment-information detail for the relevant employment:

| Field | Requirement |
|---|---|
| `paymentMethod` | `05` for Nabd's current bank-transfer gate |
| `accountNumber` | Required by the current Core transformer; do not supply IBAN alone |
| `payType` | `MAIN` for the account/method that should drive payroll |
| `paymentMethodOrder` | Lowest value wins when multiple payment details exist |
| `currency` | EGP for this cycle, consistent with payroll results |
| `routingNumber` / branch | Required for the current QNB draft |
| bank name/code, IBAN, SWIFT | Populate when the bank contract or operational review requires them |
| V3 Track Changes | Enable so later changes are visible to delta sync |

After EC correction:

1. Re-initialize the Core Employees stream once to backfill unchanged records.
2. Confirm Pay Employees no longer reports every person as missing bank details.
3. Confirm the cycle preview has included rows, masked accounts, one currency, and a positive total.
4. Generate each draft one at a time with bank-approved operator parameters.
5. Download and inspect the actual bytes/workbook cells, reconciling employee count and total to the preview.
6. Keep the drafts unapproved until the outstanding bank-contract questions in `LOCAL_TEST_REPORT.md` are resolved.

## Nabd limitations exposed by this QA exercise

1. Zero-payable generation was possible when the tenant deactivated `has_payable`; standard safety checks need stronger protection from accidental deactivation.
2. Bank-account readiness was disabled in Payroll configuration, hiding a tenant-wide data gap.
3. Bank File's missing-account check passes for employees first classified as non-bank-payment; the label is misleading.
4. The Pay employee list's “Sync” button only refreshes the query; the real sync actions live in Core and Readiness.
5. V3 configuration exists in the backend but has no current Advanced-page control.
6. V3 details without `accountNumber` are discarded even if IBAN is present.
7. Bank Studio cannot express or edit every interpreter feature and cannot enforce parameter lengths or required values.
8. Bank File UI has no recall action for invalid historical exports although the service supports recall.
9. The application writes XLSX, not legacy XLS, and does not reproduce arbitrary source workbook styling.
10. The four supplied references do not contain enough authoritative information to mark any draft bank-approved.

## Remaining acceptance gate

The task is not complete until EC supplies at least one correctly configured bank-payable employee and the four actual QA downloads are reconciled. Synthetic previews and local service tests prove renderer behavior only; they do not prove the tenant's employee data or bank acceptance.
