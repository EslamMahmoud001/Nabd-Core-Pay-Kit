# KB-06 — Workflow orchestration

The kit separates five responsibilities so facts, operations, evidence and deliverables remain traceable. This is a role model, not a requirement to spawn multiple agents.

## Responsibilities

| Capability | Owns | Does not own |
|---|---|---|
| Trainer | source reconciliation, KB drift, scoped briefs | tenant mutation, document build |
| Environment Setup | local runtime and health evidence | payroll configuration |
| Consultant | supported configuration, operation, local/QA validation, capture | app-clone code edits |
| Documents Generator | Word/Slides build and QA | inventing missing facts/screens |
| Anomaly Recorder | evidenced engineering handover | fixing the clone or learner content |

## Standard sequence

```text
Baseline/brief -> Environment proof -> Configure/rehearse -> Capture/evidence
               -> Build Word + Slides -> QA/reconcile -> Coverage audit
```

The same agent may perform every step. If the execution environment supports delegation and the user authorizes it, split only bounded independent work; the primary operator still verifies every evidence-bearing conclusion and final artifact.

## Brief contract

Every brief states goal, scope exclusions, active clone path/commit, environment, target persona, relevant routes/contracts, known gates, allowed mutations, evidence required, rollback, and acceptance tests. Use `Unknown` rather than guessing.

## Clone-only boundary

The Nabd application repository is inspected and run but not edited, pulled, pushed or committed by this workflow. Configuration uses supported UI/API actions. A genuine defect is recorded with reproduction and evidence for engineering.

## Handoffs

- Trainer → Environment/Consultant: verified task brief and drift notes.
- Environment → Consultant: URLs, profile/database proof, persona roles, module/release state, tenant snapshot.
- Consultant → Documents Generator: screenshot manifest, observed facts, output paths and unresolved limitations.
- Any capability → Anomaly Recorder: reproducible behavior only after config/data/state causes are ruled out.
- Final operator → user: outcome, files, tests, limitations, consequential actions and rollback state.

## Quality gate

No handoff is accepted solely on narrative. Spot-check the cited route/code/test, re-run the relevant health or scenario assertion, and open generated artifacts. The coverage audit is the durable project state; chat history is not.
