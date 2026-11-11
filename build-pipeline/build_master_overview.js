// Evidence-free program overview. It intentionally contains no tenant figures or screenshots.
// Usage: node build_master_overview.js [output.pptx]
const path = require('path');
const fs = require('fs');
const PptxGenJS = require('pptxgenjs');
const S = require('./build_slides.js');
const { W, H } = S;

const OUT = path.resolve(process.argv[2] || path.join(__dirname, 'output', 'Nabd_Core_Pay_KUT_Overview.pptx'));
const meta = {
  module: 'Nabd Core + Pay', bpId: 'KUT', title: 'Key User Training — Program Overview',
  version: process.env.KUT_VERSION || '1.1', status: process.env.KUT_STATUS || 'Draft',
  date: process.env.KUT_DATE || new Date().toISOString().slice(0, 10),
};
const groups = [
  ['Foundation', ['Core connection and sync', 'Employee/foundation data', 'Calendars and cycles', 'Payroll configuration']],
  ['Regular payroll', ['Readiness and cutoff', 'Dry run', 'Actual run, approvals, G/L and close']],
  ['Outputs', ['Payslips', 'Bank files', 'G/L posting', 'Reports', 'Analytics']],
  ['Specialist', ['Off-cycle', 'Retro', 'Loans and advances', 'EoS and leave provisioning']],
];

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'KUT', width: W, height: H });
  pptx.layout = 'KUT';
  S.titleSlide(pptx, meta);
  S.bulletsSlide(pptx, meta, 'About this program', 'How to Use This Pack', [
    'The program covers Nabd Core + Pay only.',
    'Each task module is built from current, verified product behavior and real safe screenshots.',
    'Every KUT step identifies the authorized role, action, navigation, expected state and evidence.',
    'Word and Slides are released together after content and visual QA.',
  ], 'Overview');
  groups.forEach(([title, items], index) => {
    S.sectionDivider(pptx, `Stage ${index + 1}`, title, items.join(' · '));
    S.bulletsSlide(pptx, meta, title, `${title} modules`, items, title);
  });
  S.closingSlide(pptx, meta);
  await pptx.writeFile({ fileName: OUT });
  console.log('wrote', OUT);
})();
