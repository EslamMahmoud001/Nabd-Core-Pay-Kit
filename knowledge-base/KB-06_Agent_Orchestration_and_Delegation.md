# KB-06 — Agent Orchestration & Delegation

> How the Nabd work is run by a team of agents: **Claude Code as orchestrator**, the three **Nabd Ops Kit** skills for domain work, and the **delegate skills** (Codex / OpenCode) for heavy coding. This closes the working cycle: knowledge → operation → documentation → code changes → back to knowledge.

**Last verified:** 2026-07-15

---

## 0. ⛔ THE HARD CONSTRAINT — the Nabd repo is CLONE-ONLY

**Owner instruction, 2026-07-15:** *"You NEVER Contribute to this repo, no pushes or pulls we just clone it."* Repo: `https://github.com/Raptors-Technology/nabd.git`.

**This overrides the delegate/implement model described below.** We are **read-only consumers** of the app code:

- ❌ **Never** push, pull, open a PR, or land a diff into the Nabd repo.
- ❌ **Never** delegate an *implementation* task against it (both installed delegate skills are explicitly built around "delegate implementation → review the diff → **land it yourself**" — that final step is unavailable here).
- ✅ **Read-only Codex/OpenCode passes for diagnosis are still valuable and allowed** (`--read-only`, §5).
- ✅ Fix problems in **application configuration** (Scheme Studio, Component Studio, Preflight Studio, Bank Templates) or local data — not in code.
- ✅ If a genuine code defect is found, **write it up as a finding** (`findings/`) and hand it to the engineering team. Do not fix it.

**Corollary — the delegate skills are repo-scoped and untracked.** They install to `.agents/skills/` (gitignored), so **a fresh clone loses them** — reinstall per §3. `default-env.json` is likewise **gitignored** and carries the `SuccessFactors2` destination: back it up before any re-clone or the SF connection dies.

> Worked example of why this matters (2026-07-15): the two scheme "blockers" looked like a code fix to delegate. They are not. `martyrs.egypt` is *intended consultant config* (ADR PAY-082), and `leave_provision.egypt` is a **data** gap. Neither needed a line of code.

---

## 1. The players

| Layer | Who | Role |
|---|---|---|
| **Orchestrator** | Claude Code | Reads the KB, plans, sequences the skills, reviews all output, owns the final judgment, keeps the project log updated. |
| **Domain skills** | `nabd-the-trainer`, `nabd-the-consultant`, `nabd-documents-generator` | Knowledge stewardship, app operation + capture, and KUT/UAT production (see their SKILL.md + KB-01…KB-05). |
| **Delegate skills** | `codex-delegate` ✅ ready · `opencode-delegate` ⚠️ CLI not installed | On Nabd: **read-only diagnosis only** (§0, §9). The "background implementer" role these skills advertise is **not available here** — the repo is clone-only. |

The domain skills know *the payroll product*; the delegate skills know *how to offload code changes*. Together they let one orchestrator run the whole cycle.

---

## 2. The full working cycle

```
Trainer (KB truth) ──brief──▶ Consultant (operate + capture) ──screenshots/facts──▶ Documents Generator (build + QA)
     ▲                                   │                                                   │
     │ findings / drift                  │ needs a code change?                              │ status
     └───────────────────────────────────┴────────────► delegate to Codex/OpenCode ◄─────────┘
                                              (orchestrator writes brief, reviews diff, reruns gates, lands it)
```

- Documentation/operation flow is the Nabd Ops Kit loop (README).
- ⛔ **The "delegate → land it" arrow above is NOT available for the Nabd repo — see §0 (clone-only).** When something looks like it needs a repo change, the real move is almost always one of: (a) fix it in **app configuration**; (b) run a **read-only** Codex pass to diagnose it; (c) **file a finding** for the engineering team. The `leave_provision`/`martyrs` gaps were the motivating example and turned out to need **no code at all** (config + data, respectively).

---

## 3. Delegate skills — install & location

Installed from `https://github.com/amElnagdy/delegate-skills.git`:
```
npx skills add amElnagdy/delegate-skills --list
npx skills add amElnagdy/delegate-skills --skill codex-delegate
npx skills add amElnagdy/delegate-skills --skill opencode-delegate
```
Repo-local (repo-scoped) paths — any agent that loads repo skills from `.agents/skills` sees them **when working in this repo**:
```
.agents/skills/codex-delegate     (SKILL.md, references/, scripts/)
.agents/skills/opencode-delegate  (SKILL.md, references/, scripts/)
```
> They are **repo-scoped**, not global. To onboard another agent, work inside this repo (or re-run the installer where that agent reads skills).

---

## 4. What each delegate does & prerequisites

- **`codex-delegate`** — delegates a bounded coding task to the **OpenAI Codex CLI** as a background implementer. Prereqs: `codex` CLI installed, `codex login` done, Node 18+, git.
- **`opencode-delegate`** — same pattern via the **OpenCode CLI**. Prereqs: `opencode` CLI installed, `opencode auth login` done, Node 18+, git, a usable model/provider. Fresh runs require `--model <provider/model>`.

Both are for **larger implementation/refactor/fix tasks** where the current agent stays the reviewer. **Not** for small inline edits.

---

## 5. Usage (relay scripts)

Codex (implement):
```
node ".\.agents\skills\codex-delegate\scripts\relay.mjs" --brief C:\tmp\brief.txt --cd "C:\path\to\repo"
```
Codex (read-only review/diagnosis):
```
node ".\.agents\skills\codex-delegate\scripts\relay.mjs" --brief C:\tmp\brief.txt --cd "C:\path\to\repo" --read-only
```
OpenCode (implement / read-only):
```
node ".\.agents\skills\opencode-delegate\scripts\relay.mjs" --brief C:\tmp\brief.txt --model <provider/model> --cd "C:\path\to\repo"
node ".\.agents\skills\opencode-delegate\scripts\relay.mjs" --brief C:\tmp\brief.txt --model <provider/model> --cd "C:\path\to\repo" --read-only
```

---

## 6. Operating model (the orchestrator's discipline)

**For the Nabd repo, only the read-only path is in scope (§0).** Steps 4–6 below describe the implement-and-land flow, kept for reference and for any *other* repo we may own:

1. **Write a complete brief** — goal, constraints, files in scope, acceptance gates (tests/build/lint), and what *not* to touch.
2. **Dispatch** the delegate with `relay.mjs` — **`--read-only` for anything touching the Nabd repo.**
3. **Wait** for `result.json`.
4. *(non-Nabd repos only)* **Review the diff yourself** — do not trust it blindly.
5. *(non-Nabd repos only)* **Rerun tests / build / lint yourself.**
6. *(non-Nabd repos only)* **Commit only after orchestrator (and, where needed, human) review.**

> The delegate never owns final judgment — the orchestrating agent does. On Nabd, a read-only Codex pass is the *only* delegate use: a second opinion for diagnosis, never an implementer.

---

## 7. When to delegate vs. do it inline

- ⛔ **Never delegate an implementation against the Nabd repo** (§0). ~~multi-file implementation, a real bug fix in `srv/handlers/**`, a refactor, resolving scheme-config gaps in the repo, adding/adjusting a seed script~~ — none of these are available; the repo is clone-only.
- ✅ **Read-only Codex against the app repo** (Lane A, §9.2) — diagnosis, UI-flow tracing, i18n label resolution, second opinions (e.g. "why is `EmpTimeAccountBalances` empty when the time-type tables synced?").
- ✅ **Write-capable Codex against OUR workspace** (Lane B, §9.2) — capture scripts, `build_<id>_*.js` builders, drafts. `Nabd-Claude/` is ours; clone-only does not apply to it. **Review before shipping** (there is no git diff there — read the files).
- ⛔ **Cannot be delegated at all** (Codex has no browser and no app session): operating the app, applying config through the UI/API, running Playwright captures, verifying figures against the DB. These are inline work, always.
- ✅ **File a finding** (`findings/`) when a real code defect is found — that is the handoff to engineering, and it replaces "fix it". Odd-but-unconfirmed behaviour goes in `findings/PRODUCT_ANOMALIES_REGISTER.md`.

---

## 8. How this ties back to the KB

Every delegated change that affects behaviour, screens, gates, or data **must be reflected in the KB**: the Trainer updates KB-01/05 (system/runtime), the project log (status + change log), and KB-04 (if it produced a new lesson). This is what keeps the cycle *self-improving* rather than drifting.

---

## 9. Working with Codex — the efficiency & quality protocol

> **Verified 2026-07-15:** `codex-cli 0.128.0` on PATH (`~/.codex/auth.json` present → authenticated). `opencode` is **not installed** — OpenCode delegation is unavailable until `npm i -g opencode-ai` + `opencode auth login`.

### 9.1 The decision gate — most tasks should NOT go to Codex

Codex starts **cold every time**: no repo memory, no chat history, no KB. Every brief pays to re-derive context the orchestrator already holds. Delegation is therefore a *net token loss* unless the search space is much larger than the answer.

**The test — if you can already name the file you'd grep, do it yourself.**

| Situation | Verdict |
|---|---|
| I can name the file / it's ≤ ~10 targeted tool calls | ❌ **Inline.** Delegation costs more. |
| Answer requires sweeping many files across an unfamiliar subsystem, and compresses to a short answer | ✅ Delegate (read-only) |
| I have a conclusion with expensive consequences and want it independently attacked | ✅ Delegate (read-only second opinion) |
| Anything that would produce a code change to the Nabd repo | ⛔ **Never** (§0 — clone-only) |

> **Worked counter-example (2026-07-15).** The `leave_provision` blocker *looked* like a perfect Codex task — the project log (KUT_COVERAGE_AUDIT) explicitly proposed delegating it. It was solved inline with **~6 targeted greps + ~4 SQL queries**. A delegation would have cost the brief, Codex's cold re-exploration, reading its report, **and** re-verifying it anyway — for a worse answer. **The roadmap was wrong about this. Apply the gate before delegating.**

### 9.2 TWO delegation lanes — `--read-only` is NOT always right

> **Correction (2026-07-15):** an earlier version of this section said `--read-only` is *always* mandatory. **That was an over-correction and it wastes Codex.** The clone-only rule (§0) protects the **Nabd app repo**. It says nothing about **our own workspace**. Pick the lane by **which tree `--cd` points at**.

**Lane A — reading the app repo (READ-ONLY, always).**
```bash
node "<live-repo>/.agents/skills/codex-delegate/scripts/relay.mjs" \
  --brief <brief> --cd "<VERIFIED live repo path>" --read-only
```
- **`--read-only` is mandatory here.** Not just a safety rail — it stops Codex burning tokens authoring a diff we are structurally unable to land (§0).
- **`--cd` must be the *verified* live repo** (confirm from the `:4004` process — KB-05 §1). Point it at the stale copy and you buy confidently-wrong answers — the exact failure of 2026-07-15.
- Use for: tracing a UI flow, resolving i18n labels, finding a handler, second-opinion diagnosis.

**Lane B — writing OUR deliverables (WRITE-CAPABLE, legitimate).**
```bash
node "<live-repo>/.agents/skills/codex-delegate/scripts/relay.mjs" \
  --brief <brief> --cd "<Nabd-Claude workspace or a subfolder>" --skip-git-repo-check
```
- `Nabd-Claude/` is **ours** — capture scripts (`Screenshots/capture_*.mjs`), the build pipeline (`build-pipeline/`), findings, drafts. **Codex may write here**; the orchestrator still reviews before anything ships.
- The workspace is **not a git repo** → pass `--skip-git-repo-check`, and remember there is **no `git diff` to review**: state the exact files in scope in the brief and diff them yourself (read the file) before accepting.
- Use for: scaffolding a new `build_<id>_*.js` from an existing model, drafting a capture script from a known selector map, bulk-editing prose across builders.
- ⚠️ **Never** point Lane B at a path that contains the app repo clone (`Payroll_KUT/Nabd_Repo/nabd`, `nabd-repo-15-july/nabd`). Scope `--cd` to the narrowest folder that holds the target files.

**Both lanes:** run **backgrounded** (`run_in_background: true`) — the relay blocks until Codex finishes.

### 9.3 Token efficiency — the levers that actually matter

1. **Read `finalMessage` / `final.txt` only. NEVER read `events.jsonl`.** That file is the full step-by-step reasoning trace and is by far the biggest context sink available to you. `result.json`'s `finalMessage` is the deliverable.
2. **Pre-load what you already know.** Facts in the brief are cheap; Codex rediscovering them is expensive. Give it the paths, the commit, the DB counts, the symptom text.
3. **Pin the scope.** Name the directories and files in scope. An unscoped brief makes Codex wander the repo on your budget.
4. **One question per brief.** Multi-question briefs produce long, unfocused reports you then pay to read.
5. **`--resume-last` for every follow-up** — send only the delta, never restate the task.
6. **Cap the output in the brief** (see the contract below). An uncapped report is billed twice: once to write, once to read.

### 9.4 Quality — Codex's report is a *lead*, not truth

Codex sees **only the brief**. Quality is set at authoring time.

Every brief must carry:
- **The clone-only rule** and "do **not** propose or write code edits — produce a written finding."
- **An echo check:** *"Report `git rev-parse --short HEAD` and the absolute repo root you read."* → proves it read the right tree. This is the cheapest possible guard against the multi-copy trap.
- **Evidence contract:** *"Every claim must cite `path:line`. A claim without a citation is not a finding."*
- **The honesty clause** (mirrors the payroll constitution): *"If the code does not answer the question, say `Unknown` and state what's missing. Do not infer payroll rules, and do not guess."*
- **A bounded format:** e.g. *"≤ 400 words. A findings table (claim · `path:line` · confidence), then Unknowns."*

**Then verify, don't accept:**
1. Spot-check **at least two** `path:line` citations by reading them yourself — hallucinated line refs are the classic failure.
2. Confirm the echoed commit matches the live repo.
3. Re-derive any load-bearing number/behaviour against the **DB or a re-run**, never off Codex's prose.
4. **Never** let a Codex claim enter the KB or a deliverable un-reverified — the KB's whole value is that it's true.

### 9.5 Brief template (read-only diagnosis)

```
# GOAL
<one question>

# CONTEXT (do not re-derive)
Repo (live, verified): <abs path> @ <commit>
Runtime: CAP backend :4004 · Postgres NABD_ALT:55432 · Core :3002 · Pay :3003
Known facts: <the counts/symptoms/paths you already proved>

# IN SCOPE
<explicit dirs/files>

# OUT OF SCOPE
Everything else. Do not read the whole repo.

# CONSTRAINTS
- This repo is CLONE-ONLY and you are READ-ONLY. Do not edit, and do not propose patches.
- Do not invent payroll rules. Unclear => "Unknown" + what's needed.

# REPORT CONTRACT
1. Echo `git rev-parse --short HEAD` + the absolute repo root you read.
2. <=400 words.
3. Findings table: claim | path:line | confidence(high/med/low).
4. "Unknowns" section — explicit.
No code blocks unless quoting <=5 lines of existing code.
```

### 9.6 Cost/benefit summary

| Lever | Saves |
|---|---|
| Apply §9.1 gate before delegating | The entire delegation (usually the biggest win) |
| `--read-only` | Codex authoring an unlandable diff |
| Read `finalMessage`, not `events.jsonl` | The largest single context sink |
| `--resume-last` on follow-ups | Restating the whole task |
| Scoped brief + capped output | Wandering + a report too long to read |

---

*Update when the delegate tooling, CLIs, or the orchestration model change.*
