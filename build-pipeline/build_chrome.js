// Optional intro/transition/outro deck for a combined Core + Pay KUT program.
// Usage: node build_chrome.js [output.pptx]
const path = require('path');
const PptxGenJS = require('pptxgenjs');
const S = require('./build_slides.js');
const { W, H } = S;

const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'output', '_chrome.pptx'));
const meta = {
  module: 'Nabd Core + Pay',
  bpId: 'KUT',
  title: 'Complete Core + Pay Program',
  version: process.env.KUT_VERSION || '1.1',
  status: process.env.KUT_STATUS || 'Draft',
  date: process.env.KUT_DATE || new Date().toISOString().slice(0, 10),
};

const MODULES = [
  ['BP-01', 'Core Connection & Synchronization'], ['BP-02', 'Employee Master Data'],
  ['FD-CAL-01', 'Pay Calendars & Cycles'], ['CFG', 'Payroll Configuration'],
  ['BP-03', 'Readiness & Opening'], ['FD-RUN-01', 'Dry Run'],
  ['FD-RUN-02', 'Actual, Approval, Posting & Close'], ['BP-PAYSLIP', 'Payslips'],
  ['BP-09', 'Bank Files'], ['BP-10', 'G/L Posting'], ['BP-REPORT', 'Reports'],
  ['BP-ANALYTICS', 'Analytics'], ['BP-13', 'Off-Cycle'], ['BP-RETRO', 'Retro'],
  ['BP-LOAN', 'Loans & Advances'], ['BP-18', 'EoS & Leave Provisioning'],
];

(async () => {
  require('fs').mkdirSync(path.dirname(OUT), { recursive: true });
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'KUT', width: W, height: H });
  pptx.layout = 'KUT';
  S.titleSlide(pptx, meta);
  MODULES.forEach(([code, title], index) => S.sectionDivider(pptx, `Module ${index + 1} · ${code}`, title, 'Verified Core + Pay training'));
  S.closingSlide(pptx, meta);
  await pptx.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
