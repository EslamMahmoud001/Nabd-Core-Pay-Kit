// build_bp13_docx.js — BP-13 Off-Cycle Payroll — One-Time Payments (Word)
// Modelled on build_bp09_docx.js (the KUT-with-a-Configuration-section pattern).
// Screenshots: screenshots/bp13_real (11 real PNGs, 0 duplicate md5s, captured 2026-07-15
// by Screenshots/capture_bp13.mjs v5 against the One-Time run type).
const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/bp13_real",f);
const OUT="screenshots/bp13_real";
const meta={ bpId:"BP-13", title:"Off-Cycle Payroll — One-Time Payments", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"15 July 2026", classification:"Internal — Project Use" };
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
  ["Module","Nabd Pay  ·  Payroll › Off-Cycle   +   Configuration › Components (Component Studio)"],
  ["Business process","BP-13 — Off-Cycle Payroll (One-Time payments from SuccessFactors)"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (off-cycle run KUT One-Time Demo, payment date 31 Jul 2026)"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","15 Jul 2026","Initial task-based KUT with real per-step screenshots from a live One-Time off-cycle run","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("An off-cycle run pays employees outside the regular monthly payroll. The One-Time run type pays the one-time payments your HR team has already entered in SuccessFactors — advances, per-diems and similar — by letting you filter them by off-cycle reason and pay date, then run exactly the ones you choose. Nabd reads the real SF amounts, so you never re-key a figure; you decide which payments to pay and when."));
push(H2("After this training you will be able to:"));
["Start a One-Time off-cycle run from the Off-cycle Workbench and give it a label and payment date.",
 "Filter the SuccessFactors one-time payments by off-cycle reason and/or pay date.",
 "Read the matching-payments table — employee, reason, component, mapping, pay date and amount — and choose which payments to run.",
 "Simulate the run and read the results summary and per-employee amounts.",
 "Submit the run for approval and track it on the Approvals page."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","A One-Time off-cycle payment is paid gross: income tax and social insurance are not withheld at payout — statutory amounts settle in the regular payroll cycle. A deductions total of 0.00 on this run is therefore the expected result, not an error."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","HR has entered one-time payments in SuccessFactors that must be paid outside the regular cycle."],
  ["Frequency","Whenever off-cycle one-time payments are due — independent of the monthly cycle."],
  ["Roles involved","Payroll Officer / Payroll Admin — build and simulate the run.  Payroll Manager / HR Director — approve it."],
  ["Inputs","SuccessFactors one-time payments flagged for off-cycle, and an off-cycle pay item mapped to each SF component code."],
  ["Outputs","A simulated, submitted off-cycle run awaiting approval, with one payment row per employee."],
  ["Where","Payroll › Off-Cycle   ·   Configuration › Components (Component Studio)"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2900,label:"Role"},{w:6460,label:"Responsibility in this process"}],[
  ["Payroll Officer / Payroll Admin","Creates the run, filters and selects the one-time payments, simulates, and submits for approval."],
  ["Payroll Manager / HR Director","Reviews the submitted run on the Approvals page and approves or rejects it."],
  ["Payroll Admin / Tenant Admin","One-time setup: makes the off-cycle pay item available and maps it to the SF component code (section 5)."],
],C.navy));

push(sec(4,"Key Concepts"));
["Off-cycle run — a payment run outside the regular monthly cycle. It has its own run type, its own payment date, and its own approval.",
 "One-Time run type — pays the one-time payments already recorded in SuccessFactors. Nabd reads their real amounts; you choose which to include.",
 "Off-cycle reason — the SF reason code carried on each one-time payment. It is how you filter the payments the run should pay.",
 "Mapping — the link from an SF component code to a Nabd pay item. A payment only pays correctly when its component code is mapped.",
 "Paid gross — a One-Time off-cycle payment pays the full amount; income tax and social insurance settle in the regular cycle, not here."].forEach(t=>push(bullet(t)));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Configuration — Make the Off-Cycle Pay Item Available"));
push(lead("A One-Time run can only pay a SuccessFactors payment whose component code is mapped to a Nabd pay item that is available off-cycle. This is a one-time setup per pay item, done in Component Studio."));
push(H2("Task — Prepare the pay item"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(dataTable([{w:2900,label:"Setting"},{w:6460,label:"What it does"}],[
  ["Off-cycle only","Makes the pay item selectable in off-cycle runs. Without it the payment cannot be paid off-cycle."],
  ["Status — Active","A draft pay item never emits a value. Activate it before the run."],
  ["SF component code","Binds the pay item to the SuccessFactors one-time payment code, so Nabd reads the real SF amount."],
  ["Cumulation contract","Which statutory bases the payment feeds (gross pay, taxable gross, social-insurance base) in the regular cycle."],
],C.teal));
push(spacer(40), callout("tip","On the Payments step, a payment whose component code is not mapped is shown without a mapping badge — a clear signal that the pay item still needs this setup."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(6,"Step-by-Step — Run a One-Time Off-Cycle Payment"));
push(lead("The One-Time run is a four-step wizard — Run type, Payments, Simulate, Submit — reached from the Off-cycle Workbench. Unlike other off-cycle types there is no separate employee-selection step: the employees are the ones carrying the payments you choose."));

push(H2("Task 1 — Start the run and choose the type"));
push(roleTag("Payroll Officer / Payroll Admin"), spacer(60));
push(...step(1,"Open the Off-cycle Workbench.","Payroll › Off-Cycle","The Workbench lists every off-cycle run with its type, status, employee count, net total and payment date, and shows counters for runs in progress, pending approval, approved and posted.","01-workbench.png","The Off-cycle Workbench — every off-cycle run and its current status."));
push(...step(2,"Start a new run.","Off-cycle Workbench › New off-cycle run","The run-type dialog opens and asks what type of off-cycle run you need. Each tile explains what it is for. Types shown with a “Soon” badge are not yet available.","02-run-type-dialog.png","Choosing the off-cycle run type."));
push(...step(3,"Choose One-Time and continue.","Run-type dialog › One-Time › Continue","One-Time is selected — “Run SF one-time payments by reason”. Continue moves you on to name the run.","03-run-type-onetime.png","One-Time selected: pay the one-time payments recorded in SuccessFactors."));
push(...step(4,"Name the run and set the payment date, then create it.","Name your One-Time › Create & configure","Give the run a clear label, set the payment date, and confirm the entity. Create & configure opens the run’s wizard.","04-name-run.png","Naming the run and setting the payment date.","Set the payment date on or after the pay dates of the payments you intend to run — a payment dated after the run’s payment date is not included."));

push(H2("Task 2 — Choose the payments to run"));
push(roleTag("Payroll Officer / Payroll Admin"), spacer(60));
push(...step(1,"Open the Payments step.","Step 2 — One-time payments","The run opens on the Payments step with two filters — off-cycle reason and pay date. No payments are listed yet: the list is deliberately empty until you filter, so you always run a set you have consciously chosen.","05-payments-unfiltered.png","Step 2 — the payments list waits for a filter before showing anything."));
push(...step(2,"Filter the payments.","Step 2 › Off-cycle reason  /  Pay date","Choose a reason and/or a pay date. The matching payments appear with the employee, reason, component, mapping, pay date and amount, plus a total. Every matching payment is selected for you; untick any you do not want to pay.","06-payments-list.png","Matching payments — two SuccessFactors one-time payments totalling EGP 21,513.00.","The pay-date filter shows how many payments each date holds, so you can see at a glance what is waiting to be paid."));

push(H2("Task 3 — Simulate the run"));
push(roleTag("Payroll Officer / Payroll Admin"), spacer(60));
push(...step(1,"Start the simulation.","Step 3 — Simulate","The engine computes the run for the employees carrying the selected payments. A dry run can be re-simulated as often as you need.","08-simulate-ready.png","Step 3 — ready to simulate the selected payments."));
push(...step(2,"Read the results.","Step 3 — Simulate (complete)","The summary shows employees paid, gross, deductions, net payable and anomalies, with a per-employee table and a View calculation link for each row. Gross is EGP 21,513.00 and net payable is EGP 21,513.00 across 2 employees, with 0 anomalies.","09-simulate-results.png","Simulation complete — the run is marked OFF-CYCLE DRY RUN until it is submitted.","Deductions show 0.00 because a One-Time off-cycle payment is paid gross — tax and social insurance settle in the regular cycle."));

push(H2("Task 4 — Submit for approval"));
push(roleTag("Payroll Officer / Payroll Admin  ·  Payroll Manager"), spacer(60));
push(...step(1,"Review the submission summary.","Step 4 — Submit for approval","The Submit step restates the run — employees, gross and payment date — and shows the approval chain the run will follow. You may add a comment for the approver.","10-submit.png","Step 4 — the submission summary and approval chain."));
push(...step(2,"Submit the run.","Step 4 › Submit for approval","The run is submitted and its status changes to Pending approval. The approvers are notified.","11-submit-confirmation.png","The run has been submitted for approval."));
push(...step(3,"Track the run on the Approvals page.","Payroll › Approvals","The submitted run appears in the approvals inbox for the approver to review and action.","12-approvals.png","The submitted off-cycle run waiting in the Approvals inbox."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(7,"Validation & Expected Results"));
push(dataTable([{w:3400,label:"Check"},{w:5960,label:"Expected result"}],[
  ["Payments listed","Only payments matching the chosen reason and/or pay date are listed — the list is empty until you filter."],
  ["Amounts","Each amount equals the SuccessFactors one-time payment; nothing is re-keyed in Nabd."],
  ["Mapping","Every payment you intend to pay shows a mapping badge to its Nabd pay item."],
  ["Totals","The payments total matches the simulated gross — EGP 21,513.00 across 2 employees in this example."],
  ["Deductions","0.00 — a One-Time off-cycle payment is paid gross; statutory settles in the regular cycle."],
  ["Anomalies","0, and every per-employee row shows OK."],
  ["Status","The run moves Draft → Simulated → Pending approval, and appears in the Approvals inbox."],
],C.navy));

push(sec(8,"Common Errors & Troubleshooting"));
push(dataTable([{w:3400,label:"Symptom"},{w:5960,label:"What it means / what to do"}],[
  ["No payments listed after choosing a filter","No SuccessFactors one-time payment matches that reason or pay date. Try another pay date — the filter shows a count per date."],
  ["The payments list is empty before filtering","Expected. The list only loads once a reason or pay date is chosen."],
  ["“Use 0 payments” cannot be clicked","No payments are ticked. Tick at least one row in the matching-payments table."],
  ["A payment has no mapping badge","Its SF component code is not mapped to an off-cycle pay item — complete the setup in section 5 before running it."],
  ["A payment you expected is missing","Check its pay date against the run’s payment date: a payment dated after the payment date is not included in the run."],
  ["A run type is greyed out with “Soon”","That run type is not yet available in this release. Use One-Time for SuccessFactors one-time payments."],
],C.crimson));

push(sec(9,"Tips & Notes"));
push(callout("tip","Filter by pay date to pay everything due on one date, or by reason to pay one category (for example, advances) across dates."));
push(callout("best","Simulate before submitting, and read the per-employee table — not just the totals. View calculation explains any single amount."));
push(callout("note","A dry off-cycle run can be re-simulated as often as you need. Nothing is paid until the run is approved."));

push(sec(10,"Key Terms"));
push(dataTable([{w:2900,label:"Term"},{w:6460,label:"Meaning"}],[
  ["Off-cycle run","A payment run outside the regular payroll cycle, with its own payment date and approval."],
  ["One-Time run","An off-cycle run that pays the one-time payments recorded in SuccessFactors."],
  ["Off-cycle reason","The SuccessFactors reason code on a one-time payment; the primary filter on the Payments step."],
  ["Mapping","The link from an SF component code to a Nabd pay item."],
  ["Paid gross","The payment is paid in full; tax and social insurance settle in the regular cycle."],
  ["Pending approval","The run has been submitted and is waiting for the approver to action it."],
],C.teal));

push(sec(11,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can build, simulate and submit a One-Time off-cycle run independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-13_Off-Cycle_Payroll_One-Time_KUT.docx")); console.log("docx written"); })();
