const catalogue = require('./module_catalogue');
const P = (text) => `[ VERIFY: ${text} ]`;

function moduleModel(key) {
  const item = catalogue[key];
  if (!item) throw new Error(`Unknown module key: ${key}`);
  return {
    guideMode: true,
    meta: { bpId: item.code, title: item.title, module: item.module, version: '0.1', status: 'Draft', date: P('YYYY-MM-DD'), classification: 'Internal — Project Use' },
    control: [
      ['Module', item.module], ['Business process', `${item.code} — ${item.title}`],
      ['Document owner', P('name/role')], ['Author', P('name/role')], ['Reviewed by', 'Pending'], ['Approved by', 'Pending'],
      ['Version', '0.1'], ['Status', 'Draft'], ['Environment', P('safe environment/build identifier')], ['Classification', 'Internal — Project Use'],
    ],
    revisions: [['0.1', P('YYYY-MM-DD'), 'Current Core + Pay scaffold', P('author')]],
    purpose: `Teach the verified ${item.title} workflow using current Core + Pay behavior and safe runtime evidence.`,
    outcomes: [`Perform the verified ${item.area} workflow.`, 'Validate the resulting system state against captured evidence.'],
    processInfo: [
      ['Trigger', P('current trigger')], ['Frequency', P('current frequency')], ['Roles involved', item.role],
      ['Inputs', P('legitimate source inputs')], ['Outputs', P('Nabd-produced outputs')], ['Upstream / downstream', P('adjacent current processes')],
    ],
    roles: [[item.role, P('handler-backed capability'), P('responsibility for this process')]],
    overview: [P('prepare/verify'), P('perform'), P('validate/reconcile')],
    configIntro: P('Keep only when learner configuration is required.'),
    configTasks: [{ name: P('verified configuration task'), role: item.role, steps: [{ action: P('one action'), nav: P('verified route'), expected: P('visible saved state'), screenshot: P('real screenshot filename') }] }],
    tasks: [{ name: P('verified operating task'), role: item.role, steps: [{ action: P('one action'), nav: P('verified route'), expected: P('visible result'), screenshot: P('real screenshot filename') }] }],
    validation: [P('observable outcome reconciled to source evidence')],
    troubleshooting: [[P('observed state'), P('verified cause'), P('supported resolution')]],
    tips: [{ kind: 'best', text: 'Verify route, role, feature release, effective date and lifecycle state against the current clone before replacing this scaffold.' }],
    glossary: [[P('current term'), P('current definition')]],
  };
}

module.exports = { moduleModel };

