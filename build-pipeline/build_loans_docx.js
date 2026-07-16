// build_loans_docx.js — BP-LOAN Loans & Advances — Recovery & Compliance (Word)
// Modelled on build_bp13_docx.js (task-based KUT pattern, without a separate Configuration section).
// Screenshots: screenshots/loans_real (5 real PNGs, 0 duplicate md5s).
const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/loans_real",f);
const OUT="screenshots/loans_real";
const meta={ bpId:"BP-LOAN", title:"Loans & Advances — Recovery & Compliance", module:"Nabd Pay",
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
  ["Module","Nabd Pay  ·  Loans & Advances"],
  ["Business process","BP-LOAN — Loans & Advances — Recovery & Compliance"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Unknown"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","16 Jul 2026","Initial task-based Loans & Advances KUT with five real screenshots","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("This guide shows a Payroll Admin how to review and manage loan recovery in Nabd Pay. A loan or advance begins as an approved SuccessFactors advance synced through Core. Nabd Pay then owns the recovery schedule and lifecycle, while compliance guardrails protect deduction limits and the net-pay minimum floor."));
push(H2("After this training you will be able to:"));
[
  "Read the Loans & Advances overview, KPI tiles, status filters, and loan table.",
  "Open a loan and interpret its principal, balance, progress, and monthly installment schedule.",
  "Review the installments due in the current payroll cycle.",
  "Review recovery guardrails before recovery is applied.",
  "Read the global loan policy, pause rules, and configured loan types.",
  "Recognize the available lifecycle actions without performing them in this KUT."
].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","Pause a month, Change an amount, Settle early, and Write off are available lifecycle actions. This KUT identifies those actions but does not script or perform them."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Origination","An APPROVED SuccessFactors advance is synced through Core into Nabd Pay."],
  ["Schedule","Nabd Pay represents recovery as a monthly installment schedule. Each installment remains Upcoming until recovered."],
  ["Recovery","The current-cycle view identifies installments due for recovery in the payroll cycle."],
  ["Compliance","Deduction limits and the net-pay minimum floor guard recovery so it does not breach legal caps."],
  ["Lifecycle","Nabd Pay owns the recovery lifecycle: schedule, pause, settle, and write-off."],
  ["Where","Loans & Advances  ·  All loans  ·  Installment schedules  ·  Compliance  ·  Separation exposure  ·  Policy rules"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2900,label:"Role"},{w:6460,label:"Responsibility in this process"}],[
  ["Payroll Admin","Reviews and manages loan recovery: overview, status, loan detail, current-cycle installments, compliance guardrails, and policy rules."],
],C.navy));

push(sec(4,"Key Concepts"));
[
  "Origination from an approved advance — the source is an APPROVED SuccessFactors advance synced through Core; Nabd Pay owns recovery and lifecycle after sync.",
  "Installment schedule — the monthly recovery plan for a loan. Each scheduled installment is Upcoming until recovered.",
  "Recovery guardrails — deduction limits and the net-pay minimum floor that keep recovery within legal caps.",
  "Loan types — Personal loan, Salary advance, Emergency advance, Car advance, and Education loan, each with its own limits.",
  "Lifecycle actions — Pause a month, Change an amount, Settle early, and Write off are available from the loan recovery experience."
].forEach(t=>push(bullet(t)));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step — Review and Manage Loan Recovery"));
push(lead("Work from the portfolio overview into one loan, then review the current-cycle schedule, compliance guardrails, and policy rules. The Sherif Anwar Magdy personal loan is the anchor example for understanding the recovery plan."));

push(H2("Task 1 — Open Loans, read the overview, and filter by status"));
push(roleTag("Payroll Admin — reviews and manages loan recovery"), spacer(60));
push(...step(1,"Open the Loans & Advances screen.","Loans & Advances › All loans","The overview shows KPI tiles for Active loans, Total outstanding, and Installments due. Active loans is 4. The five tabs are All loans, Installment schedules, Compliance, Separation exposure, and Policy rules."));
push(...step(2,"Read the loan table, then choose a status filter pill.","All loans › Status filters","The status pills show All 4, Active 4, Paused, On hold, Completed, and Pending approval. The table shows Amira Fathy Saad, Nadia Sami Ali, Ahmed Mohamed Hassan, and Sherif Anwar Magdy, with loan type, principal, remaining balance, and status.","01-loans-overview-4-active-loans.png","Loans & Advances overview — KPI tiles, status filters, and four active loans.","Use All 4 to restore the full list after reviewing another status."));

push(H2("Task 2 — Open a loan and read its recovery plan"));
push(roleTag("Payroll Admin — reviews and manages loan recovery"), spacer(60));
push(...step(1,"Open Sherif Anwar Magdy’s personal loan.","All loans › Sherif Anwar Magdy › Personal loan · 10501","The drawer shows Principal EGP 30,000.00, Repaid EGP 0.00, Remaining EGP 30,000.00, Monthly installment EGP 2,500.00, Months remaining 12, ACTIVE, estimated end April 2027, and 0% progress. The schedule has 12 monthly rows from May 2026 through April 2027; each is EGP 2,500.00 and UPCOMING.","02-sherif-personal-loan-detail-recovery-plan.png","Sherif Anwar Magdy’s active personal loan and its 12-month recovery plan.","Pause and Change amount are available on schedule rows; Settle early and Write off are available in the drawer. Do not perform these actions as part of this KUT."));

push(H2("Task 3 — Review the current-cycle installment schedule"));
push(roleTag("Payroll Admin — reviews and manages loan recovery"), spacer(60));
push(...step(1,"Open Installment schedules and review the current cycle.","Loans & Advances › Installment schedules","The view shows installments due in the payroll cycle together with the net-pay minimum-floor check used for recovery.","03-installment-schedules-current-cycle.png","Installment schedules — current-cycle recovery and the minimum-floor check."));

push(H2("Task 4 — Review compliance guardrails"));
push(roleTag("Payroll Admin — reviews and manages loan recovery"), spacer(60));
push(...step(1,"Open Compliance and review the active checks and deduction limits.","Loans & Advances › Compliance","The tab shows Active compliance checks and Deduction limits, including the recovery guardrail “Net pay below minimum floor.” These controls keep recovery within legal caps.","04-compliance-recovery-guardrails.png","Compliance — active recovery checks and deduction-limit guardrails."));

push(H2("Task 5 — Review policy rules and loan types"));
push(roleTag("Payroll Admin — reviews and manages loan recovery"), spacer(60));
push(...step(1,"Open Policy rules and review the displayed policy sections and configured types.","Loans & Advances › Policy rules","The tab shows Global loan policy sections for Eligibility rules, Amount limits, and Repayment rules; Pause rules; and five configured types: Personal loan, Salary advance, Emergency advance, Car advance, and Education loan.","05-policy-rules-pause-rules-loan-types.png","Policy rules — global policy, pause rules, and five configured loan types.","Read the displayed limits and rules; do not infer values that are not shown."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(6,"Validation & Expected Results"));
push(dataTable([{w:3400,label:"Check"},{w:5960,label:"Expected result"}],[
  ["Overview","Active loans shows 4 and the table contains the four named loan records."],
  ["Tabs","All loans, Installment schedules, Compliance, Separation exposure, and Policy rules are available."],
  ["Sherif loan","Personal loan · 10501 is ACTIVE with EGP 30,000.00 principal, EGP 0.00 repaid, EGP 30,000.00 remaining, and 0% progress."],
  ["Recovery plan","The schedule contains 12 UPCOMING installments of EGP 2,500.00 from May 2026 through April 2027."],
  ["Current cycle","Installment schedules shows the cycle’s due installments and a net-pay minimum-floor check."],
  ["Compliance","Active checks and deduction limits include the net-pay-below-minimum-floor guardrail."],
  ["Policy rules","Global policy, pause rules, and exactly five configured loan types are shown."],
],C.navy));

push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:3400,label:"Symptom"},{w:5960,label:"What to check / what to do"}],[
  ["The expected loan is not in the table","Check the selected status pill. Choose All 4 to return to the complete list shown in this KUT."],
  ["The wrong detail drawer is open","Close the drawer and select Sherif Anwar Magdy — Personal loan · 10501."],
  ["The full recovery plan and current-cycle view appear different","Use the loan drawer for the complete 12-month plan and Installment schedules for installments due in the current cycle."],
  ["A compliance check is flagged","Review Active compliance checks and Deduction limits. Do not infer or bypass a permissible recovery amount."],
  ["A policy limit or rule is unclear","Read the value displayed on Policy rules. If it is not shown, treat it as Unknown rather than inventing a value."],
],C.crimson));

push(sec(8,"Tips & Notes"));
push(callout("tip","Begin with All 4, then use a status pill to narrow the portfolio and return to All 4 before selecting the anchor loan."));
push(callout("best","Read the full loan schedule first, then use Installment schedules and Compliance together when reviewing the current cycle."));
push(callout("note","Pause a month, Change an amount, Settle early, and Write off are available actions, but they are not exercised in this review-focused KUT."));

push(sec(9,"Key Terms"));
push(dataTable([{w:2900,label:"Term"},{w:6460,label:"Meaning"}],[
  ["Approved advance","An APPROVED SuccessFactors advance synced through Core that originates the Nabd Pay loan or advance."],
  ["Installment schedule","The monthly recovery plan for a loan."],
  ["Upcoming","The status of a scheduled installment until it is recovered."],
  ["Recovery","Collection of a scheduled loan installment through payroll."],
  ["Recovery guardrail","A compliance control that applies deduction limits and the net-pay minimum floor."],
  ["Net-pay minimum floor","The minimum-pay guardrail checked before loan recovery."],
  ["Loan type","A configured category with its own limits."],
  ["Lifecycle action","An available recovery-management action: Pause, Change amount, Settle early, or Write off."],
],C.teal));

push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can review and manage the loan recovery process independently in the Nabd Pay environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-LOAN_Loans_and_Advances_KUT.docx")); console.log("docx written"); })();
