const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/fdrun01_real",f);
const OUT="screenshots/fdrun01_real";
const meta={ bpId:"FD-RUN-01", title:"Run Payroll — Dry Run", module:"Nabd Pay",
  version:"1.1", status:"Draft", date:"15 July 2026", classification:"Internal — Project Use" };
function lead(t){ return P(R(t,{size:20,color:C.body}),{spacing:{after:120}}); }
function roleTag(role){ return callout("role", role, {label:"PERFORMED BY"}); }
function sec(n,t){ return H1(`${n}.  ${t}`); }
function step(n, action, nav, expected, img, cap, note){
  const out=[ stepHeader(n,{action,nav,expected,note}) ];
  if(img) out.push(...figureImg(IMG(img), cap));
  out.push(spacer(120)); return out;
}
const body=[]; const push=(...x)=>x.forEach(e=>body.push(e));
push(...coverPage(meta));
push(H1("Document Control"));
push(kvTable([
  ["Module","Nabd Pay  ·  Payroll › Runs › Run Payroll"],
  ["Business process","FD-RUN-01 — Run Payroll (Dry Run)"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.1"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (Egypt Monthly · 08.2026)"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","13 Jul 2026","Initial task-based KUT with real per-step screenshots from a live dry run","Nabd Delivery Team"],
  ["1.1","15 Jul 2026","Re-captured against the corrected configuration. Figures updated: deductions EGP 36,770.76 → 36,850.17 and net EGP 163,229.24 → 163,149.83 (the Martyrs & Victims Fund levy now computes and reduces the tax base). All nine step screenshots re-taken; v1.0's Pre-flight and Simulate images were byte-identical due to a stalled capture and have been replaced.","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("A dry run computes a pay period’s results — every employee’s gross, statutory deductions and net — without posting anything. Because nothing is committed, you can run it as many times as you need, review the numbers, fix any issue, and run again, until the period is right to take through the actual (posting) run. This manual covers running a dry run end to end: choosing the scope, reading the pre-flight gate, simulating the calculation, and reviewing the results down to a single payslip."));
push(H2("After this training you will be able to:"));
["Start a payroll run for an open cycle and choose the Dry-run mode.",
 "Set the run scope — the pay period, the whole population, or a targeted set of employees.",
 "Read the Pre-flight gate and understand which findings stop a run and which only advise.",
 "Simulate the calculation and read the Results summary — gross-to-net, per-employee amounts and exceptions.",
 "Open an individual payslip and its verification breakdown to confirm the figures."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","A dry run never posts, never pays and never closes the period — its results land with the status Computed. Re-running simply recomputes. The actual run reuses this exact flow, but its last step posts results and closes the cycle."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","A cycle is open and you want to see, and validate, the amounts it will pay."],
  ["Frequency","As often as needed — before, and up to, the actual run for the period."],
  ["Roles involved","Payroll Officer / Payroll Admin (run and inspect); Payroll Manager (review totals & exceptions)."],
  ["Inputs","An open cycle, configured pay items and rules, and employees in scope."],
  ["Outputs","Computed results — gross, deductions, net and per-employee payslips. Nothing is posted."],
  ["Where","Nabd Pay › Control Center (or Runs) › Run payroll"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2600,label:"Role"},{w:6760,label:"What they do in this process"}],[
  ["Payroll Officer / Payroll Admin","Start the run, set the scope, clear pre-flight blockers, simulate, and inspect results and payslips."],
  ["Payroll Manager","Review the Results summary — gross-to-net, per-employee amounts and exceptions — before the period is taken to the actual run."],
],C.magenta));
push(spacer(80), callout("note","A dry run is safe for anyone with run access to use — it changes nothing. It is the normal way to check a period before the actual run posts it."));

push(sec(4,"Key Concepts"));
["Dry run vs. Actual run — both walk the same five steps (Scope, Pre-flight, Simulate, Review, Submit). A dry run computes and stops at Computed; the actual run posts results and closes the cycle, and asks for a typed confirmation first.",
 "Pre-flight gate — a set of checks run before simulation. Blockers stop the run until resolved; warnings surface but do not stop it. The gate protects a period from being run on incomplete setup or data.",
 "Scope & population — a run is bound to one open cycle and its pay group. You may leave the population whole, or target specific employees for a focused run; the calculation and controls are identical either way.",
 "Gross-to-net — the run’s headline reconciliation: gross earnings, minus total deductions (tax and social insurance), equals net payable. Every payslip rolls up into it.",
 "Payslip vs. Verification breakdown — the payslip is the employee-facing document; the breakdown exposes the engine’s working values (taxable gross, social-insurance base, end-of-service base) used to reach net."].forEach(t=>push(bullet(t)));
push(spacer(40), callout("note","In this worked example the dry run covers the Egypt Monthly · 08.2026 cycle for a set of employees, producing Gross EGP 200,000.00, deductions of EGP 36,850.17 (Egypt income tax, social insurance and the Martyrs & Victims Fund levy) and Net payable EGP 163,149.83, with zero exceptions."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step"));
push(lead("Running payroll is a five-step wizard — Scope, Pre-flight, Simulate, Review, Submit — reached from the Run payroll button in the Control Center (or on the Runs page). For a dry run you complete the first four; the fifth (Submit) is where an actual run would post."));

push(H2("Task 1 — Set the scope"));
push(roleTag("Payroll Officer / Payroll Admin"), spacer(60));
push(...step(1,"Start the run and choose Dry run.","Control Center › Run payroll  ›  Step 1 — Scope","The wizard opens on Scope. Choose Dry run (compute without posting), confirm the Pay period, and check the Population — the employees bound to the cycle’s pay group are in scope.","01-scope-dry-run.png","Step 1 — Scope: Dry run selected, with the pay period and population."));
push(...step(2,"Optionally target specific employees.","Step 1 › Employee selection (optional)","Leave the selection empty to process the whole population, or filter by name or ID and tick specific employees for a focused run. Calculations, validations and controls are unchanged either way.","02-scope-selected.png","Step 1 — a targeted set of employees selected for a focused dry run.","Targeting a subset is ideal for spot-checking a few payslips without running the whole population."));

push(H2("Task 2 — Clear the Pre-flight gate"));
push(roleTag("Payroll Officer / Payroll Admin"), spacer(60));
push(...step(1,"Review the pre-flight checks.","Step 2 — Pre-flight","Each check is shown with its status. Blockers stop the run and must be resolved; warnings surface but do not stop it. When there are no blockers, the gate is clear and you can proceed to simulate.","03-preflight.png","Step 2 — Pre-flight: the checks are clear, so the run can proceed to Simulate."));

push(H2("Task 3 — Simulate the calculation"));
push(roleTag("Payroll Officer / Payroll Admin"), spacer(60));
push(...step(1,"Run the simulation.","Step 3 — Simulate","The engine processes each employee in scope; a progress bar shows how many are done. A dry run can be re-run at any time — it simply recomputes.","05-simulate-running.png","Step 3 — Simulate: the calculation running across the employees in scope."));
push(...step(2,"Wait for the simulation to finish.","Step 3 — Simulate (complete)","When every employee is processed the step reports Done. Proceed to Review to read the results.","06-simulate-done.png","Step 3 — Simulate complete; ready to review the results."));

push(H2("Task 4 — Review the results"));
push(roleTag("Payroll Officer / Payroll Admin  ·  Payroll Manager"), spacer(60));
push(...step(1,"Read the Results summary.","Step 4 — Review","The summary shows the run’s headline figures — employees, gross, deductions, net payable and exceptions — a gross-to-net bar, and a per-employee table you can search, filter and export to CSV. Confirm the totals reconcile and that exceptions are zero (or understood).","07-review.png","Step 4 — Review: gross-to-net and the per-employee results table.","Gross EGP 200,000.00 → Net EGP 163,149.83 (deductions EGP 36,850.17, 18.4%), with 0 exceptions across 16 employees."));

push(H2("Task 5 — Inspect a payslip"));
push(roleTag("Payroll Officer / Payroll Admin  ·  Payroll Manager"), spacer(60));
push(...step(1,"Open an employee’s payslip.","Review › View details  (or  Payroll › Results)  ›  Payslip","Pick an employee to open their payslip — the branded, employee-facing document showing earnings, deductions and net for the period. It can be downloaded as a PDF.","08-results-payslip.png","An individual payslip produced by the dry run — earnings, deductions and net."));
push(...step(2,"Check the verification breakdown.","Results › Breakdown","The Breakdown tab exposes the engine’s working values — gross, deductions, net, employer cost, taxable gross, social-insurance base and end-of-service base — so you can confirm how net was reached.","09-results-breakdown.png","The verification breakdown — the working values behind the payslip."));

push(sec(6,"Validation & Expected Results"));
push(lead("A dry run is complete and healthy when:"));
push(dataTable([{w:2900,label:"Check"},{w:2900,label:"Where"},{w:3560,label:"Expected result"}],[
  ["The run computed","Runs list","The run appears as a Dry run with status Computed and an employee count."],
  ["Gross-to-net reconciles","Review","Gross minus total deductions equals net payable; the gross-to-net bar adds to 100%."],
  ["Exceptions understood","Review","Exceptions read 0, or each one is identified and understood."],
  ["Per-employee amounts are sensible","Review / Results","Each employee’s gross, deductions and net look correct for their salary and scenario."],
  ["A payslip verifies","Results › Payslip / Breakdown","An employee’s payslip and breakdown show the expected earnings, statutory bases and net."],
]));

push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:2900,label:"Symptom"},{w:3100,label:"Likely cause"},{w:3360,label:"What to do"}],[
  ["Pre-flight shows “Cannot simulate”","One or more checks are blockers — e.g. missing per-person data or setup.","Resolve the listed blockers, or narrow the scope to employees that pass, then return to Pre-flight."],
  ["An employee computes to zero","No earning is assigned, or the pay-item bases are not tagged for that employee.","Confirm the employee has an active earning and that the statutory bases are tagged in Component Studio."],
  ["Totals look wrong","A rate, allowance or statutory base is set up differently than expected.","Open the employee’s Breakdown to see the working values, and trace back to the pay item or rule."],
  ["Simulation reports advisory flags","Non-blocking findings surfaced during the run (they do not stop it).","Review the flags; resolve anything that would matter for the actual run before posting."],
],C.crimson));

push(sec(8,"Tips & Notes"));
[["tip","A dry run is non-destructive — run it as often as you like. Re-running simply recomputes the same open cycle."],
 ["best","Use a targeted employee selection to spot-check a handful of payslips quickly before running the whole population."],
 ["note","Export CSV from the Review step for an offline check, and use the Breakdown tab to confirm the statutory bases behind net pay."]].forEach(t=>{push(callout(t[0],t[1])); push(spacer(80));});

push(sec(9,"Key Terms"));
push(dataTable([{w:2600,label:"Term"},{w:6760,label:"Meaning"}],[
  ["Dry run","A payroll run that computes results without posting them; its results land with status Computed and can be recomputed."],
  ["Actual run","A run that posts results and closes the cycle; it walks the same steps as a dry run but commits at the end."],
  ["Pre-flight","The checks run before simulation; blockers stop the run, warnings only advise."],
  ["Simulate","The step where the engine computes each employee in scope."],
  ["Gross-to-net","Gross earnings minus total deductions (tax + social insurance) equals net payable."],
  ["Exception","A per-employee finding raised during review that needs attention."],
  ["Payslip","The employee-facing document of earnings, deductions and net for a period."],
  ["Verification breakdown","The engine’s working values (taxable gross, SI base, end-of-service base) behind a payslip."],
]));

push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can run and review a payroll dry run independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"FD-RUN-01_Run_Payroll_Dry_Run_KUT.docx")); console.log("docx written"); })();
