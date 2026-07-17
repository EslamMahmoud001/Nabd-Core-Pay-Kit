# Nabd — Seeded & Training Data

The KUT material is captured on a **synthetic training tenant**. Some screens are empty on a fresh clone
because the data that drives them originates **outside** the local system (SuccessFactors advances, S/4
credentials, back-dated changes covering a closed cycle). Where that was the case, the data was populated
**the way the product itself would**, so every downstream artifact was built by the real engine — not
hand-forged. This file records each seed so the team can reproduce or reset it.

> **Golden rule — prefer real replication over seeding.** First run the **real integration** (e.g. the
> SuccessFactors sync). It replicates actual source data and exercises the true system behaviour — that is what
> a training tenant should show. Only when the real source genuinely has no suitable data for a retained
> employee do you **seed the input** the missing system would have provided, and then let Nabd's own
> engine/actions produce the result. Never hand-write a computed payroll result, journal, or schedule.
> Always-seeding is a smell: it bypasses the very behaviour you are documenting.

## 1. The 17-employee roster (the purge)

The local DB is trimmed to a controlled **17-person** cohort so payroll runs are deterministic and the
National-ID / bank-account preflight constraints are satisfiable. If a Core sync re-replicates employees,
**re-purge to the 17** before payroll testing. See KB-05 §3 for the person list and the purge/re-purge steps.

## 2. GL chart of accounts (training seed)

S/4 GL-account sync needs S/4 credentials that aren't present locally. The chart was **seeded** into
`nabd.pay.*` GL-account/mapping tables so G/L Posting has accounts to map to. Invent GL accounts for training
only — a real S/4 sync later must replace them. (KB-05 §2b.)

## 3. G/L posting success (deliberate simulation)

The journal builds and balances locally; only the **S/4 transmit** fails (no working S/4 destination). For a
training KUT the posting must read as the happy path, so the posting record was updated to the exact shape a
real S/4 success writes — `status='posted'`, an S/4 document number, fiscal year, company code — using the
codebase's own success shape. The close gate then passes legitimately. Marker on the row makes it greppable.
A real S/4 sync later must not trust this row. (KB-05 §2c.)

## 4. Loans & Advances (real SF replication first; seed only as fallback)

Loans exist only from an **approved SuccessFactors advance** ingested into Pay.

1. **Real path first.** Run the **advances sync** (`runAdvancesSyncNow`). It re-fetches from the live SF tenant
   and Nabd's **real ingest engine** turns every *approved* advance into a `nabd.pay.Loans` row + installment
   schedule. **Expect it to create a loan for each approved SF advance — not just one** — so you may get several
   loans with no seeding at all. That is the real system behaviour; prefer it.
2. **Seed only as a fallback.** If SF has no approved advance for the retained employee you need, insert **one**
   approved advance into `nabd.core.Advances` (clean currency, a real loan-type mapping, sensible
   amount/installments), then run the sync so the engine builds the loan. Seeding `core.Advances` is a **raw
   `INSERT`** — there is no authoring API for that table (unlike pay-owned config, which you change through the
   UI). Use a **unique, run-scoped marker** in the advance's `externalCode` (don't reuse another run's marker) so
   your seed is greppable and doesn't collide.
3. **Never** hand-write `nabd.pay.Loans` rows or schedules — the engine builds those. (KB-05 §2d.)

## 5. Retro triggers (product action, not DB writes)

A natural back-dated retro needs a change covering an already-closed cycle. When the calendar doesn't allow
one, create pending triggers through the product's **own `createRetroTriggers` action** (a manual back-dated
adjustment with mandatory audit notes) — the same call the Retro dashboard's "New trigger" wizard makes.
Capture the create wizard only up to **Preview** (never submit) so re-runs don't accumulate triggers. (KB-05 §2d.)

## 6. Off-cycle pay item

Off-cycle One-Time runs need at least one **`offCycleOnly` active** earning pay item. Configure it through
**Component Studio** (`upsertPayItem` + `activatePayItems`) so validation and audit run — not a direct DB
write. (KB-04.)

## 7. Preflight toggles

`national_id_on_file` and `bank_accounts_present` preflight checks can be toggled in **Preflight Studio** so a
run is not hard-blocked while documenting. Record any toggle in the project log. (KB-04 §5–§6.)

## Reset / reproduce

- **Re-purge the roster:** KB-05 §3.5.
- **Re-run advances sync:** call `runAdvancesSyncNow` after seeding an approved advance (KB-05 §2d).
- **Clear seeded loans/retro:** for **pay-owned lifecycle** data (loans, results, postings) use the supported
  actions, not raw DB deletes, so audit history stays intact. The exception is an **origination seed** you added
  to `nabd.core.Advances` (a raw insert, since there is no authoring API for it) — remove that row by its
  run-scoped marker, then re-run the sync.
- Every seed above carries a greppable marker (e.g. advance `externalCode` contains `TRAIN`, posting row marker,
  retro notes string) so you can find and remove training data before a real cutover.

## What is NOT seeded (genuine, engine-produced)

Payroll results, payslips, the balanced journal, loan schedules, retro deltas, report content and analytics
KPIs are all **computed by Nabd** from the seeded inputs. Those are real outputs — reconcile against them,
don't invent them.
