const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/loans_coldrun",f);
const OUT="screenshots/loans_coldrun";
const meta={ bpId:"BP-LOAN", title:"Loans & Advances", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"17 July 2026", classification:"Internal — Project Use" };
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
  ["Module","Nabd Pay  ·  Payroll › Loans & Advances"],
  ["Business process","BP-LOAN — Loans & Advances (loan recovery, compliance, policy)"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (17-employee roster; 4 active loans, EGP 52,000 outstanding)"],
  ["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","17 Jul 2026","Initial task-based KUT with real per-step screenshots (loan policy, recovery schedules, compliance, separation)","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("A loan or advance is money the company lends an employee and then recovers from their pay over several months. In Nabd, loans are not keyed in by hand — they originate from an approved advance in SuccessFactors, which Nabd Pay ingests into a real loan with its own recovery schedule, so every loan flows through the same recovery engine, compliance guardrails and policy. This manual teaches a key user to read and manage that recovery: the loan list, a loan's month-by-month schedule, the per-cycle installment run with its net-pay floor check, the compliance guardrails, separation exposure, and the global loan policy that governs all of it."));
push(H2("After this training you will be able to:"));
["Explain where loans come from — an approved SuccessFactors advance ingested into Nabd Pay as a loan plus recovery schedule.",
 "Read the Loans & Advances dashboard: active-loan count, total outstanding, collected-this-cycle, paused installments and compliance alerts.",
 "Open a single loan and read its month-by-month recovery schedule and remaining balance.",
 "Review a pay cycle's installments and the minimum net-pay floor check for each employee.",
 "Read the compliance guardrails (net-pay floor, installment cap, loan-to-salary ratio) and the separation-exposure view.",
 "Review the global loan policy and the loan-type catalogue that constrain every loan."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","Loans are read into Nabd Pay from approved SuccessFactors advances by the advances sync. Nabd Pay owns the recovery lifecycle (schedule, pauses, settlement, write-off); SuccessFactors owns origination (who, how much, approval)."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","An employee advance is approved in SuccessFactors; the advances sync ingests it into Nabd Pay as a loan."],
  ["Frequency","Ongoing — loans are ingested as advances are approved; installments recover each pay cycle until the balance is cleared."],
  ["Roles involved","Payroll Admin / HR Director — review loans, manage recovery schedules, monitor compliance and set policy."],
  ["Inputs","An approved SuccessFactors advance (employee, principal, installments, currency, payment mode)."],
  ["Outputs","A loan with a month-by-month recovery schedule; per-cycle installments checked against the net-pay floor and compliance guardrails."],
  ["Where","Payroll › Loans & Advances (tabs: All loans · Installment schedules · Compliance · Separation exposure · Policy rules)."],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2600,label:"Role"},{w:6760,label:"What they do in this process"}],[
  ["Payroll Admin","Reviews ingested loans and recovery schedules, commits cycle installments to payroll, monitors compliance guardrails and separation exposure."],
  ["HR Director","A full loans operator — may pause an employee's installments, change amounts, settle early or write off, and maintain the global loan policy."],
  ["SuccessFactors (origination)","Owns the advance request and approval; the source of every loan. No loan is created inside Nabd Pay by hand."],
],C.magenta));
push(spacer(80), callout("warn","Loan and advance data exposes employee compensation. Access to the Loans & Advances screen is role-gated; treat balances, salaries and schedules as sensitive."));

push(sec(4,"Key Concepts"));
["Loan origination — a loan exists only because an advance was approved in SuccessFactors and ingested by the advances sync. The ingest builds the loan header and an even-split recovery schedule (principal ÷ term).",
 "Recovery schedule — the month-by-month plan of installments for one loan (installment number, due month, amount, status). Statuses include upcoming, paid and paused.",
 "Installment schedule (per cycle) — all employees' installments due in one pay cycle, each with the resulting net pay after the deduction and a minimum-floor check.",
 "Net-pay floor — the policy rule that an employee's pay may not fall below a minimum after a loan deduction. An installment that would breach the floor is flagged Below floor.",
 "Compliance guardrails — the deduction-limit checks: net-pay floor, installment ≤ a % of gross, total recovery caps, and loan-to-salary ratio. Hard blocks must be cleared before committing a cycle.",
 "Separation exposure — the open loan balance for employees who are leaving, so the balance can be settled from final pay before exit.",
 "Global loan policy & loan types — the tenant-wide rules (tenure, amount multiples, installment cap, net floor, term) and the catalogue of loan types (max amount, max term, approval) that constrain every loan."].forEach(t=>push(bullet(t)));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Configuration — Global Loan Policy & Loan Types"));
push(lead("Before loans are managed, confirm the rules that govern them. The Policy rules tab holds one global loan policy plus the loan-type catalogue; both are read here and, for the HR Director, edited here."));
push(H2("Task — Review the loan policy and loan-type catalogue"));
push(roleTag("HR Director  (Payroll Admin: view)"), spacer(60));
push(...step(1,"Open the Policy rules tab and review the global loan policy and loan types.","Payroll › Loans & Advances › Policy rules",
  "The Global Loan Policy shows the eligibility, amount and repayment rules — for example minimum tenure 6 months, eligible contract type full_time, max 2 loans per year, max loan 3× monthly gross, max advance 1× monthly gross, max installment 25% of gross, minimum net-pay floor EGP 4,000.00, max repayment term 24 months, early settlement allowed, write-off approval role finance_controller. The Loan Types table lists each type with its max amount, max term and whether approval is required (Personal loan EGP 100,000.00 / 24m; Salary advance EGP 20,000.00 / 6m; Emergency advance EGP 15,000.00 / 6m; Car advance EGP 300,000.00 / 48m; Education loan EGP 80,000.00 / 24m).",
  "06-policy-loan-types.png","Policy rules — the global loan policy and the loan-type catalogue.",
  "These rules are tenant-wide; they drive the compliance guardrails in Section 6."));

push(sec(6,"Step-by-Step — Manage Loans & Recovery"));
push(lead("With the policy in place, the day-to-day work is reviewing loans as they arrive from SuccessFactors and monitoring their recovery cycle by cycle."));

push(H2("Task 1 — Review the loan dashboard and list"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Open Loans & Advances and read the dashboard and loan list.","Payroll › Loans & Advances › All loans",
  "The header shows the dashboard KPIs — Active loans 4 (across 4 employees), Total outstanding EGP 52,000, Collected this cycle EGP 0, Paused installments 0, Compliance alerts 0 (All clear). The list shows one row per loan with employee, loan type, principal, repaid, progress, monthly installment and status — for example Dina Zaki Fathy · Personal loan · EGP 24,000.00 · EGP 2,000.00/month · Active.",
  "01-loans-list.png","Loans & Advances — the dashboard KPIs and the active-loan list.",
  "Every loan here was created by the advances sync from an approved SuccessFactors advance."));

push(H2("Task 2 — Open a loan's recovery schedule"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Open a loan to read its month-by-month recovery schedule.","Loans & Advances › All loans › (select an employee's row)",
  "The loan drawer shows the header — principal EGP 24,000.00, repaid EGP 0.00, remaining EGP 24,000.00, monthly installment EGP 2,000.00, 12 months remaining, status Active, estimated end July 2027 — and the Installment schedule: 12 monthly installments of EGP 2,000.00 from August 2026 to July 2027, each marked Upcoming. The schedule totals exactly the principal.",
  "02-loan-detail-schedule.png","A loan's recovery schedule — 12 × EGP 2,000.00, August 2026 to July 2027.",
  "Pause month, Change amount, Settle early and Write off act on this schedule (HR Director / finance role)."));

push(H2("Task 3 — Review the cycle installments and the net-pay floor"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Open the Installment schedules tab and select the pay cycle to recover.","Loans & Advances › Installment schedules › Cycle",
  "For the selected cycle (August 2026) the tab lists every employee's installment with the resulting net pay after deduction and a Min floor check. Above-floor rows are marked Above floor; a row that would breach the floor is flagged Below floor — here Nadia Sami Ali's EGP 500.00 installment leaves net pay EGP 702.25, below the floor, so it is flagged. Commit to payroll creates the deduction line items for the cycle.",
  "03-installment-schedules.png","Installment schedules — per-cycle installments with the net-pay floor check.",
  "Resolve any Below floor / hard-block rows before committing the cycle."));

push(H2("Task 4 — Review the compliance guardrails"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Open the Compliance tab and review the guardrail checks and deduction limits.","Loans & Advances › Compliance",
  "The Active compliance checks panel lists each guardrail with its current count — net pay below minimum floor, total recovery exceeds 50% of gross, a loan exceeds 10% of gross, recovery exceeds the 30% company band, loan exceeds 3× monthly salary, concurrent loan request, and installment exceeds 25% of gross — with the message “No hard blocks — the cycle can be committed.” The Deduction limits table shows each employee's gross salary, the 25% max installment and their current installment, flagging Over where the current installment exceeds the cap (here Nadia Sami Ali: current EGP 500.00 vs max EGP 375.00 → Over).",
  "04-compliance.png","Compliance — the guardrail checks and the per-employee deduction limits.",
  "A hard block prevents committing the cycle until it is resolved."));

push(H2("Task 5 — Review separation exposure"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Open the Separation exposure tab for the period.","Loans & Advances › Separation exposure › Period",
  "The tab shows the open loan balance for employees who are leaving in the selected period, so it can be settled from final pay before exit — Total open balance and Loans at risk. In this period there are no terminating employees with an open balance, so it reads EGP 0.00 / 0 with “No open balances for terminating employees.”",
  "05-separation-exposure.png","Separation exposure — open loan balances for leavers, settled from final pay.",
  "When a loan is at risk, settle it early from the loan drawer before the employee's final pay."));

push(sec(7,"Validation & Expected Results"));
push(lead("Loans are being managed correctly when:"));
push(dataTable([{w:2900,label:"Check"},{w:2900,label:"Where"},{w:3560,label:"Expected result"}],[
  ["Loans ingested from SF","All loans","Each approved SuccessFactors advance appears as a loan with employee, principal, monthly installment and Active status."],
  ["Schedule reconciles","Loan drawer","The installment schedule sums exactly to the principal (e.g. 12 × EGP 2,000.00 = EGP 24,000.00)."],
  ["Outstanding reconciles","All loans","Total outstanding equals the sum of remaining balances (here EGP 52,000)."],
  ["Floor check applied","Installment schedules","Every cycle installment shows net pay after deduction and an Above/Below floor result."],
  ["Guardrails clear","Compliance","No hard blocks before a cycle is committed; over-cap installments are flagged."],
  ["Leavers settled","Separation exposure","Open balances for terminating employees are surfaced for settlement from final pay."],
]));

push(sec(8,"Common Errors & Troubleshooting"));
push(dataTable([{w:2900,label:"Symptom"},{w:3100,label:"Likely cause"},{w:3360,label:"What to do"}],[
  ["No loans appear on the screen","No SuccessFactors advance has been approved and ingested yet.","Ensure the advance is Approved in SuccessFactors, then run the advances sync; the loan and schedule are created by the ingest."],
  ["An approved advance did not become a loan","The employee is not yet synced into Nabd, or the advance is not in an approved state.","Confirm the employee exists in Nabd and the advance's approval status contains “approved”; re-run the advances sync."],
  ["An installment is flagged Below floor","The deduction would take the employee's net pay under the minimum net-pay floor.","Pause the month or change the installment amount so net pay stays above the floor before committing the cycle."],
  ["“Over” in the deduction-limits table","The installment exceeds the policy cap (25% of gross) for that employee.","Reduce the installment amount (extending the term) or route it for an approved exception per policy."],
  ["Cannot commit the cycle","A hard block (e.g. below-floor) is unresolved.","Clear every hard block on the Compliance / Installment schedules tab, then commit."],
],C.crimson));

push(sec(9,"Tips & Notes"));
[["tip","Read a loan's schedule from the row drawer — it shows remaining balance, estimated end date and every future installment in one place."],
 ["best","Check the Installment schedules floor result and the Compliance guardrails before committing a cycle's deductions — the net-pay floor protects the employee's take-home pay."],
 ["note","Loans originate in SuccessFactors and are ingested by the advances sync; Nabd Pay owns only the recovery lifecycle. Never hand-create a loan to fill a gap — approve the advance and let the sync build it."]].forEach(t=>{push(callout(t[0],t[1])); push(spacer(80));});

push(sec(10,"Key Terms"));
push(dataTable([{w:2600,label:"Term"},{w:6760,label:"Meaning"}],[
  ["Loan / advance","Money lent to an employee and recovered from pay over several months."],
  ["Advance (SuccessFactors)","The approved request that originates a loan; the source of truth for who, how much and approval."],
  ["Recovery schedule","The month-by-month installments that repay one loan."],
  ["Installment","A single monthly repayment amount within a schedule."],
  ["Net-pay floor","The minimum net pay an employee must retain after a loan deduction."],
  ["Compliance guardrail","A deduction-limit check (floor, installment cap, recovery caps, loan-to-salary ratio) that gates a cycle."],
  ["Separation exposure","The open loan balance for a leaving employee, to be settled from final pay."],
  ["Global loan policy","The tenant-wide rules that constrain eligibility, amounts and repayment for every loan."],
]));

push(sec(11,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can review loans, read a recovery schedule, check cycle installments against the net-pay floor and compliance guardrails, and read the loan policy independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-LOAN_Loans_and_Advances_KUT.docx")); console.log("docx written"); })();
