const { buildDoc, writeDoc } = require('./kutlib');
const { renderKut } = require('./render');
const P = (text) => `[ ${text} ]`;

// Replace every bracketed value with evidence from the current clone/runtime.
const model = {
  guideMode: true,
  meta: {
    bpId: 'BP-00', title: P('Business Process Name'), module: 'Nabd Core + Pay',
    version: '0.1', status: 'Draft', date: P('YYYY-MM-DD'), classification: 'Internal — Project Use',
  },
  control: [
    ['Module', P('Nabd Core or Nabd Pay · area')], ['Business process', P('BP code — title')],
    ['Document owner', P('Name/role')], ['Author', P('Name/role')],
    ['Reviewed by', 'Pending'], ['Approved by', 'Pending'], ['Version', '0.1'], ['Status', 'Draft'],
    ['Environment', P('non-secret environment/build identifier')], ['Classification', 'Internal — Project Use'],
  ],
  revisions: [['0.1', P('YYYY-MM-DD'), 'Initial draft', P('Author')]],
  purpose: P('What the verified task achieves and why it matters.'),
  outcomes: [P('Observable learning outcome'), P('Observable learning outcome')],
  processInfo: [
    ['Trigger', P('What starts this process')], ['Frequency', P('Frequency')],
    ['Roles involved', P('Current authorized business roles')], ['Inputs', P('Legitimate inputs')],
    ['Outputs', P('System-produced outputs')], ['Upstream / downstream', P('Adjacent processes')],
  ],
  roles: [[P('Current role'), P('Current capability'), P('Responsibility in this task')]],
  overview: [P('Stage 1'), P('Stage 2'), P('Stage 3')],
  configIntro: P('Delete configTasks when the learner does not perform configuration.'),
  configTasks: [{
    name: P('Configuration task'), role: P('tenant_admin or consultant when verified'),
    steps: [{ action: P('One action'), nav: P('Verified route/menu'), expected: P('Visible saved state'), screenshot: P('Real screenshot filename') }],
  }],
  tasks: [{
    name: P('Operational task'), role: P('Current authorized role'),
    steps: [{ action: P('One action'), nav: P('Verified route/menu'), expected: P('Visible resulting state'), screenshot: P('Real screenshot filename') }],
  }],
  validation: [P('Observable correct outcome')],
  troubleshooting: [[P('Observed message/state'), P('Verified cause'), P('Supported resolution')]],
  tips: [{ kind: 'best', text: P('Evidence-backed good practice') }],
  glossary: [[P('Term'), P('Current plain-language definition')]],
};

module.exports = { model };
if (require.main === module) {
  writeDoc(buildDoc(model.meta, renderKut(model)), 'Nabd_Core_Pay_KUT_Template.docx');
}
