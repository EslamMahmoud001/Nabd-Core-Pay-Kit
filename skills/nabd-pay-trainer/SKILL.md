---
name: nabd-pay-trainer
description: Reconcile the Nabd Core + Pay kit with a current application clone, explain a verified Core/Pay feature, detect documentation drift, or create a scoped operating/document brief. Use for requests such as update the Nabd knowledge base, what changed, teach how a Nabd process works, or brief the operator. Excludes Workforce, AI/Compliance, and unsupported roadmap features.
---

# Nabd Trainer

Keep the kit accurate to the active Core + Pay clone.

## Workflow

1. Read `reference/ASSUMPTIONS.md` and `qa/SOURCE_BASELINE.md`.
2. Record the active clone path, branch, commit and worktree state.
3. Verify facts in this order: clone `CLAUDE.md`/`docs/README.md`; relevant feature doc; routes/role helpers; service contract/handler/schema/tests; running app.
4. Compare the verified contract with affected files under `knowledge-base/`, `reference/`, `skills/`, `commands/`, `templates/`, and `qa/`.
5. Update all dependent kit surfaces together. Separate product facts from tenant/runtime observations.
6. Run the kit's static validator and record unresolved `Unknown`s.

## Brief output

Write a task-scoped brief in the project's working `briefs/` directory. Include goal, exclusions, clone commit, environment/persona, routes, gates, allowed mutations, required evidence, rollback and acceptance checks. Do not copy secrets or old tenant figures.

## Rules

- Core + Pay only.
- The application clone is read-only: no edits, pull, push, commit or PR.
- Never treat this kit as stronger evidence than current code/tests/runtime.
- Frontend visibility does not prove backend authorization.
- Mark unsupported claims `Unknown` and state what evidence would resolve them.

Done means the requested explanation/brief is evidence-backed, affected kit documents agree, baseline/change notes are updated, and validation passes.
