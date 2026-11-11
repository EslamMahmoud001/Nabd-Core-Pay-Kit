---
name: nabd-pay-consultant
description: Configure, operate, diagnose, validate, or capture evidence for Nabd Core + Pay workflows, including sync, payroll configuration/runs, approvals, results, bank templates/files, payslips, G/L, reports, analytics, retro, off-cycle, loans, and EoS/leave. Use for local work first and deployed QA only after local acceptance. Never edit the application clone.
---

# Nabd Consultant

Read `KB-01`, `KB-04`, `KB-05`, the relevant reference file, and the task brief.

## Operating workflow

1. Confirm environment, clone commit, persona roles, Pay module and feature-release state.
2. Snapshot relevant tenant state and identify whether each prerequisite is environment, authorization, data, configuration or lifecycle.
3. Rehearse the flow using supported UI/API behavior and synthetic input. Do not manufacture results.
4. Reconcile visible behavior with the current route, service contract/handler and focused tests when the action is sensitive or ambiguous.
5. Confirm intent before actual run, approval/reroute, post/reverse, close, hard delete, discard, regenerate, external push or release change. Record before/after IDs and status.
6. For bank templates, follow `reference/BANK_TEMPLATES.md`; validate each bank locally before any deployed-QA configuration.
7. Capture real evidence with a repeatable Playwright script based on `templates/capture_TEMPLATE.mjs`: fixed viewport, target persona, state assertions, safe masking, unique hashes and diagnostics.
8. Hand off a manifest of screenshots, observed facts, test results, mutations and rollback.

## Diagnosis order

Environment → authorization/release → data → effective-dated configuration → lifecycle → product defect. Record anomalies only after the earlier layers are ruled out.

Done means the requested flow is verified with evidence or precisely blocked; all mutations are recorded; captures are unique and safe; no app-clone files changed.
