'use strict';

const fs = require('fs');
const path = require('path');

const appRoot = path.resolve(process.argv[2] || '');
const sourceRoot = path.resolve(process.argv[3] || '');
if (!process.argv[2] || !process.argv[3]) {
  console.error('Usage: node test_text_candidates.cjs <app-clone-root> <source-files-root>');
  process.exit(2);
}

const interpreterPath = path.join(appRoot, 'srv', 'handlers', 'pay', 'outputs', 'bank-file', 'spec-interpreter.js');
if (!fs.existsSync(interpreterPath)) throw new Error(`spec-interpreter not found: ${interpreterPath}`);
const interp = require(interpreterPath);
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"' && field === '') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\r' && text[i + 1] === '\n') { row.push(field); rows.push(row); row = []; field = ''; i += 1; }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function templateFor(candidate) {
  return {
    formatKind: candidate.formatKind,
    encoding: candidate.encoding,
    lineEnding: candidate.lineEnding,
    spec: JSON.stringify(candidate.spec),
  };
}

const cibCandidate = readJson('cib-txt.candidate.json');
const cibTemplate = templateFor(cibCandidate);
const cibErrors = interp.validateSpec(cibTemplate);
const cibSource = fs.readFileSync(path.join(sourceRoot, 'D2K_CIB.txt'), 'ascii').split('\r\n');
const cibMachine = cibSource.slice(0, cibSource.findIndex((line) => line === '')).filter(Boolean);
const cibRendered = interp.renderFromSpec(cibTemplate, interp.SAMPLE_ROWS, interp.SAMPLE_META, {
  dateBlockDDMMYY: '280526280526',
  headerAccountBlock: '100000000001000000000000',
}).toString('ascii').trimEnd().split('\r\n');

const hsbcCandidate = readJson('hsbc-csv.candidate.json');
const hsbcTemplate = templateFor(hsbcCandidate);
const hsbcErrors = interp.validateSpec(hsbcTemplate);
const hsbcSourceRows = parseCsv(fs.readFileSync(path.join(sourceRoot, 'D2K_HSBC_10_2025.csv'), 'utf8'));
const hsbcRenderedRows = parseCsv(interp.renderFromSpec(hsbcTemplate, interp.SAMPLE_ROWS, interp.SAMPLE_META, {
  debitAccount: '1000000001', firstPartyReference: 'Sample Salary', secondPartyReference: 'Sample Salary',
  paymentSetCode: 'D01', lccCbidCode: '11111111',
}).toString('utf8'));

const report = {
  cib: {
    validationErrors: cibErrors,
    sourceRecordLengths: cibMachine.map((line) => line.length),
    candidateRecordLengths: cibRendered.map((line) => line.length),
    headerLengthMatches: cibMachine[0].length === cibRendered[0].length,
    detailLengthMatches: cibMachine.slice(1, -1).every((line) => line.length === cibRendered[1].length),
    trailerMismatchConfirmed: cibMachine.at(-1).length === 44 && cibRendered.at(-1).length === 37,
    releaseStatus: 'blocked_authoritative_trailer_and_ddmmyy_contract_required',
  },
  hsbc: {
    validationErrors: hsbcErrors,
    sourceRows: hsbcSourceRows.length - 1,
    sourceColumns: [...new Set(hsbcSourceRows.map((row) => row.length))],
    candidateColumns: [...new Set(hsbcRenderedRows.map((row) => row.length))],
    headerMatchesExactly: JSON.stringify(hsbcSourceRows[0]) === JSON.stringify(hsbcRenderedRows[0]),
    sourceAccountsWithTrailingTab: hsbcSourceRows.slice(1).filter((row) => row[13]?.endsWith('\t')).length,
    candidateAccountsWithTrailingTab: hsbcRenderedRows.slice(1).filter((row) => row[13]?.endsWith('\t')).length,
    sourceAmountsAllZero: hsbcSourceRows.slice(1).every((row) => row[5] === '0'),
    candidateUsesPayrollAmount: hsbcRenderedRows.slice(1).some((row) => Number(row[5]) > 0),
    releaseStatus: 'blocked_amount_and_account_tab_quoting_contract_required',
  },
};

const assertions = [
  cibErrors.length === 0, report.cib.headerLengthMatches, report.cib.detailLengthMatches, report.cib.trailerMismatchConfirmed,
  hsbcErrors.length === 0, report.hsbc.sourceColumns.length === 1 && report.hsbc.sourceColumns[0] === 38,
  report.hsbc.candidateColumns.length === 1 && report.hsbc.candidateColumns[0] === 38,
  report.hsbc.headerMatchesExactly, report.hsbc.sourceAccountsWithTrailingTab === 18,
  report.hsbc.candidateAccountsWithTrailingTab === 0, report.hsbc.sourceAmountsAllZero, report.hsbc.candidateUsesPayrollAmount,
];
console.log(JSON.stringify(report, null, 2));
if (assertions.some((value) => !value)) process.exit(1);

