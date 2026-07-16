// build_retro_docx.js — BP-RETRO Retroactive Payroll — Back-Dated Change Triggers (Word)
// Modelled on build_bp13_docx.js. Screenshots: screenshots/retro_real (6 real PNGs, 0 duplicate md5s).
const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/retro_real",f);
const OUT="screenshots/retro_real";
const meta={ bpId:"BP-RETRO", title:"Retroactive Payroll — Back-Dated Change Triggers", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
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
  ["Module","Nabd Pay  ·  Operations › Retro Adjustments"],
  ["Business process","BP-RETRO — Retroactive Payroll — Back-Dated Change Triggers"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Nabd Pay — project tenant"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","16 Jul 2026","Initial task-based KUT with six real per-step screenshots from Retro Adjustments","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose"));
push(lead("Retroactive payroll handles a back-dated change that covers an already-processed period. Nabd records the change as a retro trigger, recomputes the delta, and settles that delta on the next regular payroll cycle. This guide shows Payroll Admins how to review triggers and raise a manual trigger, and shows the Approver where threshold-based approval is gated before a cycle can close."));
push(H2("After this training you will be able to:"));
[
  "Read the Retro Adjustments dashboard, its KPI cards, tabs, and pending trigger cards.",
  "Expand a trigger and inspect its machine-readable technical payload.",
  "Review the Pending approvals gate and the Resolved audit trail.",
  "Raise a manual trigger for a correction the auto detector did not catch.",
  "Preview the resolved scope, employee count, effective-from date, and notes before creating triggers."
].forEach(o=>push(bullet(o)));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["1. Back-dated change","A change covers an already-processed period."],
  ["2. Trigger","AUTO: the retro detector identifies a back-dated synced Core change. MANUAL: a Payroll Admin records a correction the detector did not catch."],
  ["3. Next-cycle recompute","The retro delta is recomputed for the next regular payroll cycle."],
  ["4. Approval gate","A retro delta that exceeds the policy threshold requires approval before the affected cycle can close."],
  ["5. Settlement","The delta is settled on the next regular payroll cycle."],
  ["6. Audit trail","Approved and dismissed items move to Resolved with their audit note, actor, and time."],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2900,label:"Role"},{w:6460,label:"Responsibility in this process"}],[
  ["Payroll Admin","Reviews pending triggers and their technical detail, checks the resolved audit trail, and raises manual triggers for corrections the auto detector did not catch."],
  ["Approver","Reviews retro deltas that exceed the policy threshold and approves or dismisses each pending row before the affected cycle can close."],
],C.navy));

push(sec(4,"Key Concepts"));
[
  "Retro trigger — the record Nabd creates for a back-dated change covering an already-processed period.",
  "AUTO trigger — created when the retro detector polls synced Core data for back-dated changes in pay components, compensation, job, leave, or termination.",
  "MANUAL trigger — raised by a Payroll Admin for a correction the detector did not catch. Notes are mandatory for the audit trail.",
  "Effective from — the past date from which the back-dated change applies.",
  "Next-cycle settlement — the retro delta is recomputed and settled on the next regular payroll cycle.",
  "Approval gate — a retro delta above the policy threshold must be approved before its affected cycle can close.",
  "Audit trail — approved and dismissed items are retained in Resolved with their audit note, actor, and time."
].forEach(t=>push(bullet(t)));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step"));
push(lead("Use Retro Adjustments to review pending work, inspect the record behind a trigger, monitor the approval gate and resolved history, and create a manual trigger when the auto detector did not capture a correction."));

push(H2("Task 1 — Open Retro and read the dashboard"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Open Retro Adjustments and review the Pending triggers tab.","Operations › Retro Adjustments","The dashboard shows 2 pending triggers affecting 2 employees, 0 pending approvals, and 0 resolved items. The pending cards are for Tarek Hassan Fouad (10402) and Laila Refaat Hosny (10404); both are Manual, Pending, kind Manual correction, effective from Jul 1, 2026, with Dismiss and Technical detail actions.","01-retro-dashboard-pending-triggers.png","Retro Adjustments — the anchor dashboard with the two pending manual triggers."));

push(H2("Task 2 — Expand a trigger's technical detail"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Expand Technical detail on Tarek Hassan Fouad's trigger.","Retro Adjustments › Pending triggers › Tarek Hassan Fouad (10402) › Technical detail","The Technical detail area expands beneath the card and displays the machine-readable payload recorded behind the trigger.","02-tarek-10402-technical-detail.png","Tarek Hassan Fouad (10402) — Technical detail expanded."));

push(H2("Task 3 — Review the Pending approvals gate"));
push(roleTag("Approver"), spacer(60));
push(...step(1,"Open the Pending approvals tab.","Retro Adjustments › Pending approvals","The tab shows “No retro approvals pending.” Retro deltas that exceed the policy threshold appear here, and the cycle they belong to cannot close until each row is approved or dismissed.","03-retro-pending-approvals.png","Pending approvals — the threshold-based gate is currently empty."));

push(H2("Task 4 — Review the Resolved audit trail"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Open the Resolved tab.","Retro Adjustments › Resolved","The tab shows “Nothing resolved yet.” Approved and dismissed items land here with their audit note, actor, and time.","04-retro-resolved.png","Resolved — the audit-trail tab before any item has been resolved."));

push(H2("Task 5 — Raise a manual retro trigger"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Select New trigger, then complete the manual-trigger form.","Retro Adjustments › New trigger","Set Scope to Specific employees, select Tarek Hassan Fouad, set Effective from to 07/01/2026, and enter “Back-dated salary adjustment effective 01 Jul 2026” in Notes. Preview is enabled.","05-new-retro-form-valid-past-date.png","Create manual retro triggers — one employee, a past effective-from date, and mandatory audit notes.","Use a manual trigger for a correction the auto detector did not catch. The available scope choices are Specific employees, All active employees, and Whole calendar."));

push(H2("Task 6 — Preview the scope before creating"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Select Preview and verify the confirmation before selecting Create trigger.","Create manual retro triggers › Preview","The confirmation states that 1 trigger will be created and shows sample employee 10402, Effective from 2026-07-01, the entered notes, and the final Create trigger button.","06-new-retro-preview-one-employee.png","Confirm retro trigger creation — verify the resolved scope and sample before creation."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(6,"Validation & Expected Results"));
push(dataTable([{w:3400,label:"Check"},{w:5960,label:"Expected result"}],[
  ["Dashboard","Pending triggers = 2 and 2 employees affected; Pending approvals = 0; Resolved = 0."],
  ["Pending trigger cards","Tarek Hassan Fouad (10402) and Laila Refaat Hosny (10404) are Manual, Pending, Manual correction triggers effective from Jul 1, 2026."],
  ["Technical detail","The selected trigger expands to show the machine-readable record behind its card."],
  ["Pending approvals","The empty state reads “No retro approvals pending.” Threshold-exceeding deltas will be gated here before cycle close."],
  ["Resolved","The empty state reads “Nothing resolved yet.” Approved and dismissed items will carry audit note, actor, and time."],
  ["Manual-trigger form","A scope is selected, one employee is resolved, Effective from is a past date, Notes are present, and Preview is enabled."],
  ["Preview","The confirmation shows 1 trigger, employee 10402, Effective from 2026-07-01, and the entered notes."],
  ["Settlement rule","The retro delta is recomputed and settled on the next regular payroll cycle."],
],C.navy));

push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:3400,label:"Symptom"},{w:5960,label:"What it means / what to do"}],[
  ["Preview is not ready","Complete the scope, employee selection when required, a past effective-from date, and mandatory Notes."],
  ["The preview count or employee is not the intended scope","Select Back, correct the scope or employee selection, and preview again before creating."],
  ["“No retro approvals pending” is displayed","This is the empty state, not an error. Retro deltas above the policy threshold appear here when approval is required."],
  ["“Nothing resolved yet” is displayed","This is the empty state, not an error. Approved and dismissed items appear here with their audit details."],
  ["A correction was not found by the auto detector","Use New trigger to raise a manual trigger and record mandatory Notes for the audit trail."],
  ["You need the record behind a trigger card","Expand Technical detail on that trigger to inspect its machine-readable payload."],
],C.crimson));

push(sec(8,"Tips & Notes"));
push(callout("tip","Use a MANUAL trigger for a correction the AUTO detector did not catch; AUTO covers back-dated changes found while polling synced Core data."));
push(callout("best","Before creating, read the preview count, sample employee, effective-from date, and notes as one final scope check."));
push(callout("note","Notes are mandatory because they form part of the trigger's audit trail. Deltas above the policy threshold remain an approval gate before the affected cycle can close."));

push(sec(9,"Key Terms"));
push(dataTable([{w:2900,label:"Term"},{w:6460,label:"Meaning"}],[
  ["Retro","A back-dated change covering an already-processed period."],
  ["Retro trigger","Nabd's record that flags the back-dated change for recomputation and next-cycle settlement."],
  ["AUTO","A trigger created by the detector when it finds a back-dated change in synced Core data."],
  ["MANUAL","A trigger raised by an operator for a correction the detector did not catch."],
  ["Effective from","The past date from which the back-dated change applies."],
  ["Pending","The trigger's current status before it is resolved."],
  ["Approval gate","The requirement to approve a threshold-exceeding retro delta before the affected cycle can close."],
  ["Resolved","The audit-trail view for approved and dismissed items, including note, actor, and time."],
],C.teal));

push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can review retro triggers, inspect technical detail, review the approval gate and audit trail, and preview a manual trigger independently in the project tenant."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-RETRO_Retroactive_Payroll_KUT.docx")); console.log("docx written"); })();
