# Assumptions

The operating assumptions this kit is built on. If one of these is not true for your engagement, adjust the
workflow accordingly (and tell the Trainer skill so the knowledge base can be updated).

1. **The Nabd app repo is clone-only.** You run Nabd locally to configure it and capture evidence. You never
   push, pull, or open PRs against the application repository. Anything that needs "fixing" is fixed in
   **application configuration** through the UI (so validation and audit run), not by editing app code.

2. **The tenant is synthetic and for training/testing.** All employees and payroll data are fabricated. The
   audience knows this, so KUT material carries **no training-data disclaimers** — the data just needs to look
   realistic so learners can relate to it.

3. **Screenshots are always real.** Every image in a KUT is a genuine capture from the running app, produced by
   a local Playwright script that writes clean PNG files. In-session/agent browsers are used only to *explore*
   a flow, never for the final capture. No mock-ups, no hand-drawn UI.

4. **Never invent payroll facts.** Amounts, statutory rules, columns, report contents, and steps come from the
   running app or approved sources. Unknowns are marked `Unknown` and the missing information is requested —
   not guessed.

5. **Seed the input, let the engine produce the result.** When a screen is empty because an external system
   (SF, S/4) didn't provide data locally, seed that *input* the way the product would and let Nabd compute the
   result. Never hand-write a computed payroll result, journal, schedule, or report. (See SEEDED_DATA.md.)

6. **Output formats are Word + Slides.** PDFs are intentionally not generated. Each business process ships as a
   Word manual and a matching slide deck, in a numbered learning order.

7. **English only, for now.** KUT content is authored in English.

8. **Consequential actions are deliberate and recorded.** Actual run / approve / post / close / hard-delete /
   regenerate change state irreversibly. Perform them only with explicit intent and record them in the project
   log (the coverage audit / status doc).

9. **The controlled roster is 17 employees.** Payroll runs are validated against this cohort so results are
   deterministic; if a sync repopulates the DB, re-purge before testing.

10. **The Product Anomalies Register is a handover artifact, not part of the shipped KUT.** Odd product
    behaviour observed while working is recorded (using the template in `templates/`) and handed to the
    engineering team separately — it is not distributed inside the training kit.
