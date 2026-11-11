# Nabd Core + Pay Kit 1.1.0 test plan

## Objective

Prove the plugin can guide a fresh operator from a current read-only Core + Pay clone through environment proof, safe configuration/operation, evidence capture, and Word + Slides delivery without relying on historical tenant facts.

## Tiers

### Tier 0 — static

Run `node qa/tier0_static_check.mjs` on Windows/Linux. It validates manifests/version/install strings, required files, five skills/commands, active-doc drift guards, JavaScript syntax, paths, assets and Git hygiene.

Also run the skill-creator `quick_validate.py` on each skill when its Python `yaml` dependency is available.

Exit: zero failures.

### Tier 1 — discovery/install

- Install from a local marketplace clone and reload.
- Confirm all five `/nabd-*` commands.
- Natural-language routing:
  - “start Nabd Core and Pay locally” → Environment Setup.
  - “what changed in Pay since the old kit?” → Trainer.
  - “configure and test a bank template” → Consultant.
  - “build the BP-09 KUT” → Documents Generator.
  - “record this reproducible bank preview defect” → Anomaly Recorder.

Exit: clean install and 5/5 correct routing.

### Tier 2 — environment and read-only smoke

- Record clone commit/worktree and resolved profile/database without printing secrets.
- Prove PostgreSQL, backend, Core, Pay, authenticated bootstrap, Pay module, persona roles and target feature release.
- Inspect a role-safe Core Data Browser flow and a Pay read-only flow.
- Capture a small unique screenshot set and manifest with the template.

Exit: health/evidence complete; no clone changes; no fixed employee-count assumption.

### Tier 3 — four bank-template local gate

For each workspace source—CIB TXT, Credit Agricole XLSX, HSBC CSV and QNB XLS—perform `reference/BANK_TEMPLATES.md`:

1. content/type/hash/workbook structure inspection;
2. field grammar and source mapping with all unknowns resolved;
3. spec-interpreter validation and masked preview;
4. byte/cell-level render comparison including leading zeroes, types/formats, totals, counts, dates, encoding and filename;
5. eligible synthetic payroll generation/download/reopen/reconciliation;
6. cleanup/rollback evidence.

Exit: all four independently pass the technical local engine/service tests. Remaining bank-contract unknowns must be explicit; they prohibit activation but do not prohibit creating clearly named inactive QA drafts for review.

### Tier 4 — deployed QA bank configuration

Only after the Tier 3 technical gate:

- authenticate through the approved QA session; record environment/persona/roles/release state;
- snapshot existing templates and choose unique draft keys;
- create each template through supported Studio/API behavior, validate/preview/generate with synthetic eligible data, download and reconcile;
- leave unresolved templates inactive; activate only bank-approved templates; preserve before/after evidence and rollback keys;
- verify no production target and no full sensitive values in evidence.

Exit: four QA templates verified, activation state explicitly reported, rollback documented.

### Tier 5 — KUT build smoke

Use a verified screenshot/fact manifest to build one Word + Slides pair, open/render both, and pass KB-02. Confirm no PDF, anomaly register, secret, stale tenant figure, out-of-scope feature or machine-specific path.

## Acceptance

- All Tier 0 checks pass.
- The active clone remains clean.
- Product claims cite current clone/runtime; runtime observations are dated.
- Local four-bank technical gate is green before QA draft configuration; exact-contract unknowns are zero before activation.
- All consequential actions and rollback are logged.
- KUT pair passes content/evidence/visual QA.
- Blockers, broken paths, guardrail failures and unresolved bank-field unknowns are zero.

## Test record

Create `qa/TEST_REPORT.md` for the execution and append defects/knowledge gaps using the two templates below. A test plan marked “ready” is not proof that a tier ran.
