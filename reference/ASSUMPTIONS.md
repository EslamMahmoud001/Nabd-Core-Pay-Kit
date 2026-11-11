# Operating assumptions

These assumptions define the kit's boundary. Record engagement-specific exceptions in the working coverage audit; do not rewrite product facts to match one tenant.

1. **Core + Pay only.** Core is always present and Pay is controlled by `ModuleFlags`. Workforce, AI-assisted features, Compliance, and unrelated modules are outside this kit unless the owner explicitly expands scope.
2. **Dedicated deployment.** Nabd currently uses one application and PostgreSQL database per customer deployment. Do not describe it as a shared multitenant SaaS.
3. **The application clone is read-only for this workflow.** Inspect and run it, but do not edit, pull, push, commit, or open PRs. Product defects become evidenced findings; configuration belongs in Nabd's supported UI/API.
4. **The active clone is authoritative.** Read `CLAUDE.md`, `docs/README.md`, the relevant feature document, then code/tests. This kit is an operational aid and must be refreshed when it drifts.
5. **Runtime state is observed, not assumed.** Database name, tenant data, employee counts, credentials, feature-release toggles, and configured templates vary by environment. Capture them at the start of each run.
6. **External configuration is not bundled.** `default-env.json` is gitignored and may be required for database and SuccessFactors/S/4 destinations. Never place secrets in the kit, briefs, screenshots, or reports.
7. **Screenshots are real.** Final training evidence comes from a repeatable local Playwright capture, not mock-ups. Mask or avoid personal, bank, compensation, and credential data.
8. **Never invent payroll facts.** Use the current app, approved requirements, or observed output. Unknown facts remain `Unknown` with the missing evidence stated.
9. **Seed inputs, never computed outputs.** It is acceptable to create synthetic source inputs on a designated training tenant. The engine must calculate payroll results, journals, reports, payslips, and bank files.
10. **KUT output is Word + Slides.** English is the current authoring language. Product anomalies are separate engineering handover artifacts and never part of a learner package.
11. **Consequential actions need explicit intent.** Actual run, approval, posting, close, hard delete, discard, regenerate, and external push alter state. Confirm the target environment and record the action and result.
