const { buildDoc, writeDoc } = require('./kutlib');
const { renderKut } = require('./render');

// Pipeline smoke example only. It deliberately avoids tenant figures and screenshots.
const model = {
  guideMode: false,
  meta: {
    bpId: 'EXAMPLE', title: 'Core + Pay Evidence Workflow', module: 'Nabd Core + Pay',
    version: '1.1', status: 'Example', date: '2026-08-13', classification: 'Internal — Project Use',
  },
  control: [
    ['Module', 'Nabd Core + Pay'], ['Business process', 'Example — Evidence workflow'],
    ['Document owner', 'Kit owner'], ['Author', 'Kit owner'], ['Reviewed by', 'Pending'],
    ['Approved by', 'Pending'], ['Version', '1.1'], ['Status', 'Example'],
    ['Environment', 'No tenant — pipeline smoke'], ['Classification', 'Internal — Project Use'],
  ],
  revisions: [['1.1', '2026-08-13', 'Current Core + Pay pipeline smoke', 'Kit owner']],
  purpose: 'Demonstrate that the Word pipeline renders the current KUT section grammar without asserting tenant-specific product facts.',
  outcomes: ['Recognize the evidence-first workflow.', 'Confirm the Word builder can create a valid artifact.'],
  processInfo: [
    ['Trigger', 'A Core + Pay process is selected for documentation.'], ['Frequency', 'Per module or verified change.'],
    ['Roles involved', 'Trainer, operator and document reviewer.'], ['Inputs', 'Current contract, safe runtime evidence and real screenshots.'],
    ['Outputs', 'A visually reviewed Word manual and matching slide deck.'], ['Upstream / downstream', 'Verification precedes build; QA follows build.'],
  ],
  roles: [['Document author', 'Evidence and authoring', 'Keeps every step traceable to current verified behavior.']],
  overview: ['Verify the current contract.', 'Capture safe evidence.', 'Build both formats.', 'Run content and visual QA.'],
  configIntro: '',
  configTasks: [],
  tasks: [{
    name: 'Prepare a verified module', role: 'Document author',
    steps: [{
      action: 'Create the fact and screenshot manifest.',
      nav: 'Project workspace → module evidence',
      expected: 'Every planned step has an authorized role, route, expected state and safe screenshot reference.',
      screenshot: 'Not included in this pipeline-only example.',
    }],
  }],
  validation: ['The generated Word file opens and all required sections render.'],
  troubleshooting: [['A placeholder remains', 'The evidence manifest was incomplete.', 'Return to verification; never invent the missing value.']],
  tips: [{ kind: 'best', text: 'Build Word and Slides from the same fact manifest and release them together.' }],
  glossary: [['Evidence manifest', 'The traceable list of roles, actions, routes, expected states, screenshots and sources for a module.']],
};

module.exports = { model };
if (require.main === module) {
  writeDoc(buildDoc(model.meta, renderKut(model)), 'Nabd_Core_Pay_Pipeline_Example.docx');
}
