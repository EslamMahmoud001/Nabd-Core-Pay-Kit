---
name: nabd-pay-anomaly-recorder
description: Investigate and record a reproducible Nabd Core or Pay anomaly as a separate engineering handover, with environment/build, persona, reproduction, expected/actual behavior, evidence, severity and workaround. Use when behavior still looks wrong after environment, authorization/release, data, configuration and lifecycle causes are checked. Never include the register in KUT output.
---

# Nabd Anomaly Recorder

1. Reproduce on the intended build/environment and record clone commit, route/action, persona/roles, relevant feature release, identifiers and timestamps.
2. Rule out environment, authorization/release, data, effective-dated configuration and lifecycle state.
3. Preserve expected versus actual behavior, minimal reproduction, screenshots/log/API or query evidence, impact, frequency and safe workaround/rollback.
4. Create the working register from `templates/ANOMALY_REGISTER_TEMPLATE.md` if absent, then append the next unique ID. Never overwrite existing findings.
5. Classify confidence/status honestly. If not reproduced, keep it Observed and state the missing verification.

Do not log capture-script errors, expected empty states or resolved configuration gaps as product defects. Do not edit the clone. Keep bank, identity, compensation, token and secret values masked.

Done means one neutral, actionable, evidenced entry exists in the separate engineering handover and any KUT wording remains factual.
