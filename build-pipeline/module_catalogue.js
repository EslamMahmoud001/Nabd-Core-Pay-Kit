// Current Core + Pay module metadata for builder scaffolds. Product details,
// roles, routes, screenshots and tenant figures must still be verified per run.
module.exports = {
  bp01: { code: 'BP-01', title: 'Core Connection & Synchronization', module: 'Nabd Core', role: 'Tenant Admin / TC Ops', area: 'connection, schedules, jobs and synchronized data' },
  bp02: { code: 'BP-02', title: 'Employee Master Data Foundation', module: 'Nabd Core', role: 'Authorized Core data viewer', area: 'role-safe employee, foundation, payment and time views' },
  fdcal01: { code: 'FD-CAL-01', title: 'Pay Calendars & Cycles', module: 'Nabd Pay', role: 'Tenant Admin / Consultant', area: 'calendar configuration, cycle generation and lifecycle rules' },
  cfg: { code: 'CFG', title: 'Payroll Configuration Guide', module: 'Nabd Pay', role: 'Tenant Admin / Consultant', area: 'pay items, parameters, brackets, rules, schemes, packs and preflight' },
  readiness: { code: 'BP-03', title: 'Payroll Readiness & Opening', module: 'Nabd Pay', role: 'Payroll Admin / Payroll Manager', area: 'readiness findings, opening and cutoff cohort' },
  fdrun01: { code: 'FD-RUN-01', title: 'Run Payroll — Dry Run', module: 'Nabd Pay', role: 'Payroll Admin / Payroll Manager', area: 'scope import, preflight, simulation, results and discard' },
  fdrun02: { code: 'FD-RUN-02', title: 'Actual Run, Approval, Posting & Close', module: 'Nabd Pay', role: 'Payroll Admin / Payroll Manager / Approver / Finance Director', area: 'frozen cohort, actual result, approvals, G/L and close' },
  payslips: { code: 'BP-PAYSLIP', title: 'Payslips', module: 'Nabd Pay', role: 'Payroll Admin / Payroll Manager', area: 'template preview/PDF parity, batch generation and SF push status' },
  bp09: { code: 'BP-09', title: 'Bank File Generation', module: 'Nabd Pay', role: 'Tenant Admin / Consultant / authorized payroll operator', area: 'template validation, eligibility, masked preview and generated bank artifact' },
  bp10: { code: 'BP-10', title: 'G/L Posting', module: 'Nabd Pay', role: 'Tenant Admin / Finance Director', area: 'mapping, balanced journal, posting and reversal' },
  reports: { code: 'BP-REPORT', title: 'Payroll Reports', module: 'Nabd Pay', role: 'Authorized report viewer', area: 'report catalogue/studio, preview, export and reconciliation' },
  analytics: { code: 'BP-ANALYTICS', title: 'Payroll Analytics', module: 'Nabd Pay', role: 'Payroll Manager / HR Director / Finance Director / Tenant Admin', area: 'filters, KPIs, drilldowns and source-run reconciliation' },
  bp13: { code: 'BP-13', title: 'Off-Cycle Payroll', module: 'Nabd Pay', role: 'Authorized payroll operator and approver', area: 'eligible one-time inputs, calculation, approval and output' },
  retro: { code: 'BP-RETRO', title: 'Retroactive Payroll', module: 'Nabd Pay', role: 'Authorized payroll operator', area: 'effective-dated source change, trigger and recomputation' },
  loans: { code: 'BP-LOAN', title: 'Loans & Advances', module: 'Nabd Pay', role: 'Authorized payroll operator', area: 'approved input, schedule, deductions and balances' },
  bp18: { code: 'BP-18', title: 'EoS & Leave Provisioning', module: 'Nabd Pay', role: 'Tenant Admin / Consultant / authorized payroll reviewer', area: 'time types/balances, scheme parameters, warnings and calculation' },
};

