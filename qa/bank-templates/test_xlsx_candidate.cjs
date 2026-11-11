'use strict';

const fs = require('fs');
const path = require('path');

const appRoot = path.resolve(process.argv[2] || '');
if (!process.argv[2]) {
  console.error('Usage: node test_xlsx_candidate.cjs <app-clone-root>');
  process.exit(2);
}

const interp = require(path.join(appRoot, 'srv', 'handlers', 'pay', 'outputs', 'bank-file', 'spec-interpreter.js'));
const xlsxWriter = require(path.join(appRoot, 'srv', 'handlers', 'pay', 'outputs', 'bank-file', 'xlsx-writer.js'));
const ExcelJS = require(path.join(appRoot, 'node_modules', 'exceljs'));

function readCandidate(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
}

function templateFor(candidate) {
  return {
    formatKind: candidate.formatKind,
    encoding: candidate.encoding,
    lineEnding: candidate.lineEnding,
    spec: JSON.stringify(candidate.spec),
  };
}

async function renderAndInspect(candidateName, params = {}) {
  const candidate = readCandidate(candidateName);
  const template = templateFor(candidate);
  const errors = interp.validateSpec(template);
  const buffer = await xlsxWriter.renderXlsx(template, interp.SAMPLE_ROWS, interp.SAMPLE_META, params);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  return {
    errors,
    bytes: buffer.length,
    signature: buffer.subarray(0, 2).toString('hex').toUpperCase(),
    sheet,
  };
}

(async () => {
  const creditAgricole = await renderAndInspect('credit-agricole-xlsx.candidate.json');
  const qnb = await renderAndInspect('qnb-xlsx.candidate.json', { customerId: '1234567890' });
  const qnbHeader = qnb.sheet.getRow(1).values.slice(1);
  const qnbBody = qnb.sheet.getRow(2);
  const report = {
    creditAgricole: {
      validationErrors: creditAgricole.errors,
      generatedBytes: creditAgricole.bytes,
      generatedSignature: creditAgricole.signature,
      sourcePackageFacts: {
        sheetName: 'Sheet1',
        dimension: 'A1:D3',
        cells: 12,
        sourceCellTypes: 'shared-string only',
        hiddenRows: 0,
        hiddenColumns: 0,
        mergedRanges: 0,
        observedColumnPattern: ['9-digit text identifier', 'employee name text', 'Salary literal', 'integer text'],
      },
      releaseStatus: 'blocked_confirm_column_1_source_account_vs_employee_id_and_amount_integer_text_contract',
    },
    qnb: {
      validationErrors: qnb.errors,
      generatedBytes: qnb.bytes,
      generatedSignature: qnb.signature,
      sheetName: qnb.sheet.name,
      headerMatchesExactly: JSON.stringify(qnbHeader) === JSON.stringify([
        'Branch code.', 'Customer ID #', 'Account Number', 'Employee Name', 'code', 'reason', 'amount',
      ]),
      bodyColumns: qnbBody.cellCount,
      duplicateRoutingColumnsMatch: qnbBody.getCell(1).value === qnbBody.getCell(5).value,
      accountCellIsText: typeof qnbBody.getCell(3).value === 'string' && qnbBody.getCell(3).numFmt === '@',
      amountCellIsNumericWithSourceFormat: typeof qnbBody.getCell(7).value === 'number' && qnbBody.getCell(7).numFmt === '@',
      sourceWorkbookFacts: {
        legacyFormat: 'OLE/BIFF .xls',
        sourceSheetName: 'QNB_sheet',
        usedRange: 'A1:G4',
        headerRows: 1,
        dataRows: 3,
        hiddenRows: 0,
        hiddenColumns: 0,
        mergedRanges: 0,
        branchAndCodeMatchEverySourceRow: true,
        customerIdConstantAcrossSourceRows: true,
        amountObservedDecimalPlaces: [2, 1, 2],
        sourceHeaderStyle: 'bold, wrapped, yellow fill',
      },
      releaseStatus: 'blocked_confirm_xlsx_acceptance_routing_mapping_and_header_style_requirement',
    },
  };
  console.log(JSON.stringify(report, null, 2));
  const failed = creditAgricole.errors.length || creditAgricole.signature !== '504B'
    || qnb.errors.length || qnb.signature !== '504B' || !report.qnb.headerMatchesExactly
    || report.qnb.bodyColumns !== 7 || !report.qnb.duplicateRoutingColumnsMatch
    || !report.qnb.accountCellIsText || !report.qnb.amountCellIsNumericWithSourceFormat;
  if (failed) process.exit(1);
})().catch((error) => { console.error(error); process.exit(1); });
