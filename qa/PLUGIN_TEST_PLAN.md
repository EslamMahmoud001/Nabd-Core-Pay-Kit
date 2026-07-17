# Nabd Core + Pay Kit — Plugin Test Plan

**Version:** 1.0 · **Status:** Ready to execute · **Owner:** QA (orchestrator) · **Subject under test:**
`nabd-core-pay-kit` v1.0.0

---

## 1. Objective

Prove that a **cold agent** — a Claude Code agent that knows *nothing* about Nabd and has *no* access to the
project history that produced this kit — can, using **only the installed plugin**, do the full job:

> bring Nabd up locally → configure a business process and use its features → observe real results →
> capture real evidence → produce a professional KUT deliverable (Word + Slides) that passes the kit's own QA.

If it can, the plugin genuinely transfers the knowledge and workflow. **Every point where the cold agent has to
guess, gets stuck, or breaks a house rule is a plugin defect** to fix — not a failing of the agent.

### Guiding principle — dogfood the kit's own discipline
We test the plugin with the same rigor the plugin teaches: this plan is a UAT (KB-02 §8) whose "system under
test" is the plugin itself — entry/exit criteria, scenarios with expected results, a scoring rubric, a defect
log, and a re-test loop.

---

## 2. Claims under test (traceability)

Each claim maps to a test tier and a rubric line.

| # | Claim the kit makes | Verified by |
|---|---|---|
| C1 | Installs cleanly from GitHub; skills + commands register | Tier 1 |
| C2 | An agent finds the *right* skill for a task unprompted | Tier 1 |
| C3 | KB-05 + the setup skill are enough to bring the stack up | Tier 2 |
| C4 | The KBs + reference docs are sufficient to operate a BP without outside facts | Tier 3 |
| C5 | `capture_TEMPLATE.mjs` + the Consultant skill yield a working, de-duplicated capture | Tier 2/3 |
| C6 | The build pipeline produces QA-passing Word + Slides | Tier 2/3 |
| C7 | The house rules actually bind behaviour (no invented figures, seed-the-input, no PDF, anomaly recording) | Tier 3 |
| C8 | The output is materially equivalent to a known-good module | Tier 3 (ground-truth diff) |

---

## 3. Test environment & preconditions

- A machine meeting `reference/PREREQUISITES.md` (Node ≥ 18, Docker, Playwright/Chromium via the app repo).
- The Nabd app repo cloned (clone-only) with `default-env.json` restored; the standard kit-prepared training
  tenant (`NABD_ALT`, the controlled 17-employee roster).
- The plugin installed from GitHub (or a local clone) into a **fresh** Claude Code workspace.
- **Isolation:** the cold agent must NOT receive this project's conversation, the delivered `Material-Remediated`
  documents, or any Nabd facts/figures. Its only Nabd knowledge source is the plugin.

**Entry criteria:** Tier 0 passes; the environment preconditions above are met; the observer has the known-good
module set available for the ground-truth diff (the cold agent does not).

---

## 4. Roles

- **Cold agent (SUT operator):** a fresh general-purpose Claude Code agent, prompted with only the task + "the
  `nabd-core-pay-kit` plugin is installed; use it." No other context.
- **Observer / QA (orchestrator):** sets up isolation, watches the full transcript, scores the rubric, logs
  defects, holds the ground truth. Does **not** coach the cold agent mid-run (coaching = a hidden knowledge gap).
- **Environment:** the local Nabd stack + training tenant.

---

## 5. Method — the cold-agent protocol

1. **Isolate.** Start the cold agent with a clean prompt (see the pilot brief in §7). Give it the task, the app
   repo path, and "the plugin is installed." Nothing else.
2. **Observe, don't help.** Record every action. When the agent pauses to guess, asks for a fact the kit should
   have provided, or takes a wrong turn, log it verbatim — do not answer. (If it is truly, unrecoverably blocked
   by something the kit could never provide — e.g., missing credentials — record it and, only then, unblock.)
3. **Let it self-serve from the plugin.** Success means it reached the answer via a skill/KB/reference/template.
4. **Capture the artifacts** it produces (capture script, screenshots, `.docx`, `.pptx`) and its transcript.
5. **Score & diff.** Run the rubric (§8) and diff its module against the known-good one (§8, C8).
6. **Log defects** (§9) and produce the report (§10). Then patch and re-test (§11).

---

## 6. Test tiers

### Tier 0 — Static validation (automated, no agent)
Cheap, deterministic gate the observer runs first.
- `plugin.json` + `marketplace.json` are valid JSON and name-consistent (`nabd-core-pay-kit`, marketplace `nabd-kit`).
- Every `skills/*/SKILL.md` has valid frontmatter (`name`, `description`); names are unique.
- Every `commands/*.md` parses; argument-hints present where used.
- **Internal-reference integrity:** every path a skill/command/README points at (`knowledge-base/…`,
  `reference/…`, `templates/…`, `build-pipeline/…`) exists in the repo. No dangling `KB-03`/`Nabd-Ops-Kit/` refs.
- Every `build-pipeline/build_*.js`, `kutlib.js`, `build_slides.js` passes `node --check`.
- No stray tracked files (`node_modules`, `screenshots/`, `*.docx`, `*.pptx`).
- README/INSTALL install commands match the manifest names.

**Exit:** all checks green. (This is scriptable and should live as `qa/tier0_static_check.sh`.)

### Tier 1 — Install & discovery (agent, ~15 min)
- Install per INSTALL.md into a fresh workspace; confirm `/nabd-*` commands appear in `/help`.
- Give three natural-language prompts (not commands) and confirm the **right skill activates** unprompted:
  - "get Nabd running on my machine" → `nabd-environment-setup`
  - "capture the Reports screen for training" → `nabd-the-consultant`
  - "this chart looks wrong, note it for the devs" → `nabd-anomaly-recorder`

**Exit:** clean install; commands registered; ≥ 3/3 correct skill activations.

### Tier 2 — Smoke: one read-only module end-to-end (agent, ~45 min)
Fastest full-loop proof. Pilot module: **Employee Master Data (BP-02)** — read-only, no configuration, low risk.
- Cold agent brings the stack up (`nabd-environment-setup`), captures the Data Browser set with a script derived
  from `capture_TEMPLATE.mjs`, and builds Word + Slides via the pipeline.

**Exit:** stack verified up; a de-duplicated screenshot set; both formats build and pass the KB-02 §6 checklist.

### Tier 3 — Full cold-agent scenario: configure a BP, get results, document it (agent, ~2–3 h)
The headline test. See §7 for the pilot.

---

## 7. Pilot scenario (Tier 3)

**Recommended pilot: Regular Payroll — Dry Run (FD-RUN-01).** Rationale:
- It is the heart of payroll and exercises the whole chain: environment → configuration dependencies (pay
  items / calendars / schemes) → **Readiness** → the **Run wizard** → **real computed results** (gross,
  deductions, net for the 16-employee cohort) → capture → build.
- A **dry run has no side effects** — safe for a cold agent; no actual run / approve / post / close needed.
- If configuration is not sound, results come back zero or the run is gated — which directly tests whether the
  KB's "unblocks" (KB-04 §5–§6) and `reference/SEEDED_DATA.md` are documented well enough for a stranger.

*Alternatives, if you prefer:* **Off-Cycle One-Time (BP-13)** — configure an `offCycleOnly` pay item in
Component Studio, run the off-cycle wizard, see results (tests the "configure a feature then use it" loop most
directly); or **Loans (BP-LOAN)** — tests the "seed the input, let the engine produce the result" principle.

### The cold-agent brief (verbatim prompt the observer gives)
> The `nabd-core-pay-kit` Claude Code plugin is installed. The Nabd application is cloned at `<path>` and is
> **clone-only** (never push/pull/edit its code). Using only the plugin, produce a **Key User Training** package
> (Word + Slides) for the **"Run Payroll — Dry Run"** business process: bring the environment up, make the
> process work, observe the real results, capture real screenshots, and build the deliverable following the
> kit's methodology. Report what you produced and where.

### Expected result (observer's ground truth — not shown to the cold agent)
- Stack up; roster is the controlled 17.
- A dry run completes with non-zero, reconciling figures for the 16-employee cohort (gross / deductions / net).
- A clean, **de-duplicated** screenshot set for the flow.
- `FD-RUN-01_*.docx` + `.pptx` built, MB-sized, passing the KB-02 §6 checklist; figures in prose match the shots.
- Zero invented figures; no PDF; English; every step PERFORMED-BY tagged.

---

## 8. Scoring rubric & acceptance

Score each capability **Pass / Partial / Fail**. A capability is **Partial** if the agent got there but only via
guessing, retries, or a workaround the kit should have prevented.

| # | Capability | Pass criteria |
|---|---|---|
| R1 | Install & registration | Installs per INSTALL.md; `/nabd-*` commands present |
| R2 | Skill discovery | Correct skill activates unprompted for the task |
| R3 | Environment setup | Stack verified up using only KB-05 + the setup skill (incl. the IPv6/`localhost` gotcha) |
| R4 | Knowledge sufficiency | Completed the BP without needing any Nabd fact the kit didn't provide |
| R5 | Configuration / operation | The process actually runs and produces correct, reconciling results |
| R6 | Capture quality | Real, de-duplicated set; asserts before shooting; each screen matches its step |
| R7 | Build quality | Word + Slides build; KB-02 §6 checklist passes; branding + PERFORMED-BY render |
| R8 | Guardrail adherence | No invented figures; seed-the-input respected; no PDF; anomalies recorded to the template; English |
| R9 | Ground-truth equivalence | Output is materially equivalent to the known-good module (same facts/figures/section set) |

**Exit gate (the plugin "passes"):**
- R8 = **Pass** (any fabricated figure or a shipped anomaly register = **automatic fail**, regardless of others).
- ≥ **7 of 9** capabilities Pass, none Fail.
- Every Tier-0 check green.
- All Blocker and Broken-path defects fixed and re-tested.

---

## 9. Instrumentation — defect & knowledge-gap logs

Log to `qa/DEFECT_LOG.md` and `qa/KNOWLEDGE_GAP_LOG.md`.

**Defect taxonomy**
- **Blocker** — the agent could not proceed at all.
- **Broken-path** — a skill/command/README pointed at something wrong/missing.
- **Knowledge-gap** — the agent had to guess or fetch a fact the kit should have carried.
- **Ambiguity** — instructions were interpretable two ways; the agent chose wrong.
- **Guardrail-miss** — a house rule didn't bind (e.g., it invented a figure, or built a PDF).
- **Enhancement** — worked, but a doc/skill/command could make it smoother.

Each entry: `ID · severity · where (skill/KB/ref/template/pipeline) · what happened (transcript quote) · fix`.

---

## 10. Deliverables of the test
- `qa/TEST_REPORT.md` — tiers run, rubric scores, pass/fail against the exit gate, evidence links.
- `qa/DEFECT_LOG.md` + `qa/KNOWLEDGE_GAP_LOG.md` — the punch list.
- The cold agent's artifacts (capture script, screenshots, `.docx`, `.pptx`) archived for evidence.
- A prioritized **plugin patch list** (which skill/KB/ref/template/pipeline to change, and how).

---

## 11. Iteration loop
1. Run Tier 0 → Tier 1 → Tier 2 → Tier 3.
2. Triage defects; **fix Blocker/Broken-path/Guardrail-miss first**, then Knowledge-gap/Ambiguity.
3. Patch the plugin; bump the version; re-run the smallest tier that covers the fix, then re-run Tier 3.
4. Repeat until the exit gate is met. Record each round in the report.

---

## 12. Risks & how we de-risk
- **Consequential actions** (actual run/approve/post/close). *De-risk:* the pilot is a **dry run** (no side
  effects). If a scenario needs a consequential action, it is explicitly confirmed and recorded in the project log.
- **Tenant drift** (a sync repopulates employees; prior config lingers). *De-risk:* re-purge to the 17 and note
  starting config state before the run; capture the environment state in the report.
- **"Not truly cold"** (context leakage). *De-risk:* fresh workspace, sanitized brief, observer does not coach.
- **Environment-specific gaps** (missing S/4/SF credentials). *De-risk:* these are pre-known; the kit already
  documents seed/simulate paths — the test checks the agent *finds* them, not that it obtains real credentials.
- **Flaky capture** (async UI). *De-risk:* the template's assert-before-shoot + md5 dedup already guard this; a
  flake that the template didn't catch is itself a valuable defect.

---

## 13. Effort
Tier 0 ~ minutes (scripted) · Tier 1 ~ 15 min · Tier 2 ~ 45 min · Tier 3 ~ 2–3 h · triage + one patch round ~ half a day.
Budget **one focused day** for a first full pass and one patch round.

---

## 14. How the observer runs it here (execution note)
Within this environment, the cold agent is realized as a **fresh subagent** spawned with the sanitized §7 brief
and no session context; the orchestrator plays observer. Tier 0 runs as a script first. Live consequential
actions stay off unless a scenario requires and is confirmed. The result is a `qa/TEST_REPORT.md` plus the patch
list, after which we fix and re-run.
