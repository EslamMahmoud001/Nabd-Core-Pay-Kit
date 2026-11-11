# Nabd Core + Pay product anomalies register

Separate engineering handover. Do not distribute with KUT material. Append entries; never rewrite prior evidence without a dated correction.

## Entry template

```text
## NCP-ANOM-0001 — <specific title>

Status: Observed | Reproduced | Confirmed | Resolved
Severity: Critical | High | Medium | Low
Confidence: High | Medium | Low
Area/route/action: <Core or Pay surface>
Build/environment: <commit, local/QA identifier, timestamp; no secrets>
Persona: <user/persona and roles; no token>
Feature/module state: <Pay enabled; release key/state if relevant>

Expected:
<contract-backed expectation and source>

Actual:
<exact observed behavior>

Minimal reproduction:
1. ...

Evidence:
- <safe screenshot/log/request-response/query/path:line>

Checks completed:
- Environment:
- Authorization/release:
- Data:
- Effective-dated configuration:
- Lifecycle:

Impact/frequency:
<who/what is affected and how often>

Workaround/rollback:
<safe supported workaround, or None known>

Owner/next action:
<engineering handoff>
```

Severity: Critical for payroll/payment/data-integrity loss or unrecoverable state; High for materially wrong outputs/integration/audit; Medium for workflow-blocking or misleading non-calculation behavior; Low for cosmetic issues.
