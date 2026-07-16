// build_bp18_docx.js — BP-18 End-of-Service & Leave Provisioning (Word)
// Modelled on build_bp13_docx.js and build_bp09_docx.js.
// Screenshots: screenshots/bp18_real (7 real PNGs, 0 duplicate md5s).
const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/bp18_real",f);
const OUT="screenshots/bp18_real";
const meta={ bpId:"BP-18", title:"End-of-Service & Leave Provisioning", module:"Nabd Pay",
  version:"1.1", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
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
  ["Module","Nabd Pay  ·  Configuration › Scheme Studio   +   Payroll › Results"],
  ["Business process","BP-18 — End-of-Service & Leave Provisioning"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.1"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (Egypt Monthly · August 2026)"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","15 Jul 2026","Initial task-based KUT with real screenshots for scheme configuration and verification","Nabd Delivery Team"],
  ["1.1","16 Jul 2026","Added the Accrual Ledger (Section 6, Task 3) — once the cycle was run for real the ledger populated, so the provision amounts (End-of-Service EGP 833.33, Leave Provision EGP 2,333.33 for the sample employee) are now shown with real screenshots. Revised the Breakdown note accordingly.","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("End-of-service and leave provisioning are controlled by statutory Egypt schemes in Scheme Studio. This manual shows how to find both schemes, distinguish the EoS scheme’s read-only fork model from the leave scheme’s limited in-place edit, and verify the employee bases and balances that feed provisioning. It does not define or change Egyptian statutory rules."));
push(H2("After this training you will be able to:"));
[
  "Find the Egypt End-of-Service and Leave Provision schemes in Scheme Studio.",
  "Read the EoS scheme identity, valuation base, bracket table, output pay item and population without changing the statutory original.",
  "Explain when to use Fork to edit for EoS and for leave-provision changes outside the two permitted fields.",
  "Confirm the leave scheme reads the intended SuccessFactors annual-leave balance through its Annual-leave Time Type.",
  "Use Results Explorer and the Breakdown verification panel to confirm the employee’s end-of-service base."
].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","Scope — Per-cycle provision amounts are posted to the accruals ledger only by an actual payroll run. A dry run is side-effect-free, so the ledger stays empty and provision lines do not appear in Results Breakdown; the Breakdown intentionally hides informational lines. This KUT covers configuring and verifying the provisioning schemes. The accrual ledger view is documented separately once a cycle is finalised."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","The Egypt provisioning schemes must be reviewed or the bases that feed them must be verified for a payroll cycle."],
  ["Frequency","Review when configuration changes are required; verify during payroll review."],
  ["Roles involved","Payroll Admin / Tenant Admin — scheme configuration.  Payroll Officer / Payroll Admin — results verification."],
  ["Inputs","The statutory Egypt country-pack schemes, replicated SuccessFactors leave balances, and payroll results."],
  ["Outputs","Verified scheme configuration and verified employee inputs: END-OF-SERVICE BASE and the configured annual-leave balance source."],
  ["Where","Configuration › Scheme Studio   ·   Payroll › Results › Breakdown"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2900,label:"Role"},{w:6460,label:"Responsibility in this process"}],[
  ["Payroll Admin / Tenant Admin","Review the statutory schemes; fork the EoS scheme when a change is required; edit only the two permitted leave-provision fields in place."],
  ["Payroll Officer / Payroll Admin","Open the payroll results, select an employee and verify the values in the Breakdown verification panel."],
  ["HR / SuccessFactors data owner","Ensure employee leave balances are replicated from SuccessFactors so the configured Annual-leave Time Type can be read."],
],C.navy));

push(sec(4,"Key Concepts"));
[
  "Statutory scheme — a scheme supplied in the Egypt country pack. Both eos.egypt and leave_provision.egypt are statutory.",
  "Fork to edit — creates an editable version when the statutory original cannot be changed. The EoS scheme is read-only and always requires a fork for any change.",
  "Limited in-place edit — leave_provision.egypt permits changes to exactly two fields: Annual-leave Time Type and Over-take policy. Every other change requires a fork.",
  "Valuation basis — eos.egypt uses BASE CUMULATION valuation_basis. For each employee, the relevant value is END-OF-SERVICE BASE in the Breakdown verification panel.",
  "Bracket table and output — the EoS scheme applies bracket table egypt_eos_2026 and emits to output pay item egypt_eos_payout for all employees.",
  "Annual-leave Time Type — identifies which replicated SuccessFactors leave balance the leave-provision scheme reads; the configured value shown here is EG_1000 : Annual Leave.",
  "Actual run versus dry run — only an actual payroll run posts provision amounts to the accruals ledger. A dry run has no side effects."
].forEach(t=>push(bullet(t)));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Configuration — Review the Provisioning Schemes"));
push(lead("Scheme Studio contains both statutory Egypt provisioning schemes. Review the scheme definition before making a change: EoS is read-only and must be forked, while Leave Provision allows exactly two fields to be edited in place."));

push(H2("Task 1 — Review the End-of-Service scheme"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Open Scheme Studio.","Configuration › Scheme Studio","Scheme Studio lists 6 schemes, provides kind filter chips and offers New scheme.","01-scheme-studio.png","Scheme Studio — 6 schemes with kind filters."));
push(...step(2,"Filter the list to End of service.","Scheme Studio › End of service","The filter shows End of service (1) and the Egypt End-of-Service scheme card.","02-filter-end-of-service.png","The single End-of-Service scheme in the filtered list."));
push(...step(3,"Open the Egypt End-of-Service scheme and review its definition.","End of service › Egypt End-of-Service","The drawer is View — Egypt End-of-Service and states Statutory scheme — managed by Nabd. Confirm KEY eos.egypt, KIND End of service, COUNTRY Egypt, EFFECTIVE FROM Jan 1 2026; BASE CUMULATION valuation_basis; BRACKET TABLE egypt_eos_2026; OUTPUT PAYITEM egypt_eos_payout; POPULATION All employees. The available actions are Fork to edit and Close.","03-eos-scheme-view.png","Egypt End-of-Service — the statutory, read-only scheme definition.","Do not attempt to edit the statutory original. Select Fork to edit only when an approved change is required."));

push(H2("Task 2 — Review the Leave Provision scheme"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Return to the scheme list and filter to Leave provision.","Scheme Studio › Leave provision","The filter shows Leave provision (1) and the Egypt Leave Provision scheme card.","04-filter-leave-provision.png","The single Leave Provision scheme in the filtered list."));
push(...step(2,"Open the Egypt Leave Provision scheme and review the permitted fields.","Leave provision › Egypt Leave Provision","The drawer for leave_provision.egypt states Statutory scheme — limited edit. Only Annual-leave Time Type and Over-take policy are editable in place. Confirm Annual-leave Time Type reads EG_1000 : Annual Leave. Every other change requires a fork.","05-leave-provision-limited-edit.png","Egypt Leave Provision — exactly two fields allow limited in-place edit.","The Annual-leave Time Type tells the scheme which replicated SuccessFactors balance to read. Do not change either editable field without an approved configuration decision."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(6,"Step-by-Step — Verify Provisioning Inputs & the Accrual Ledger"));
push(lead("First use Results Explorer to verify the calculation bases, then open the employee’s Accruals ledger to read the provision amounts. The Breakdown verifies bases; the Accruals ledger holds the provision amounts, which are written when the payroll cycle is run for real."));

push(H2("Task 1 — Select the run and employee"));
push(roleTag("Payroll Officer / Payroll Admin"), spacer(60));
push(...step(1,"Open Results Explorer and select the employee to verify.","Payroll › Results › Egypt Monthly · August 2026","The employee list is available for the selected run. Select 10301 Ahmed Mohamed Hassan to inspect the employee’s result.","06-run-results.png","Results Explorer — Egypt Monthly · August 2026 employee list."));

push(H2("Task 2 — Verify the employee bases"));
push(roleTag("Payroll Officer / Payroll Admin"), spacer(60));
push(...step(1,"Open the Breakdown tab and read the Verification panel.","Results › 10301 Ahmed Mohamed Hassan › Breakdown","Verification shows GROSS 10,000.00, DEDUCTIONS 816.46, NET 9,183.54, TAXABLE GROSS 9,995.00, SOCIAL-INSURANCE BASE 10,000.00 and END-OF-SERVICE BASE 10,000.00. The deductions list includes Egypt Martyrs & Victims Fund 5.00. For EoS provisioning, use END-OF-SERVICE BASE — 10,000.00 for this employee — which the scheme applies through bracket table egypt_eos_2026.","07-provision-breakdown.png","Breakdown — the Verification panel exposes the employee’s End-of-Service base.","The Breakdown shows the bases, not the provision amounts: it intentionally hides informational lines. The provision amounts appear in the Accruals ledger (Task 3)."));

push(H2("Task 3 — Read the provision amounts in the Accruals ledger"));
push(roleTag("Payroll Officer / Payroll Admin  ·  Finance"), spacer(60));
push(...step(1,"Open the employee and go to the Accruals tab.","Employees › 10301 Ahmed Mohamed Hassan › Accruals","The employee record opens on Overview. Select the Accruals tab to view the End-of-Service and Leave Provision ledger for this employee.","08-employee-detail.png","The employee record — the Accruals tab holds the provisioning ledger."));
push(...step(2,"Read the accrued provision balances and the ledger history.","Accruals","Two summary cards show this employee’s balances: Egypt End-of-Service EGP 833.33 and Egypt Annual-Leave Provision EGP 2,333.33 (as at Aug 1, 2026). Ledger history lists one Accrual row per scheme against cycle egypt_monthly:2026P08, each with its amount and balance-after. The Leave-year carry panel shows the SuccessFactors leave balance the provision reads — 14.00 days on time account EG_1000 (Annual Leave), status Open.","09-accruals-ledger.png","The Accruals ledger — accrued End-of-Service and Leave Provision, with ledger history and the SF leave-year carry.","Each accrual row is written when the cycle is run for real. Across the run these per-employee amounts total EGP 14,500.00 for End-of-Service and EGP 36,016.66 for Leave Provision."));

push(sec(7,"Validation & Expected Results"));
push(dataTable([{w:3400,label:"Check"},{w:5960,label:"Expected result"}],[
  ["EoS scheme status","The scheme is statutory and managed by Nabd; the drawer offers Fork to edit rather than in-place editing."],
  ["EoS identity","KEY eos.egypt · KIND End of service · COUNTRY Egypt · EFFECTIVE FROM Jan 1 2026."],
  ["EoS calculation references","BASE CUMULATION valuation_basis · BRACKET TABLE egypt_eos_2026 · OUTPUT PAYITEM egypt_eos_payout · POPULATION All employees."],
  ["Leave scheme edit scope","Only Annual-leave Time Type and Over-take policy are editable in place; every other change requires a fork."],
  ["Leave balance source","Annual-leave Time Type is EG_1000 : Annual Leave and employee leave balances are replicated from SuccessFactors."],
  ["Employee verification","For 10301, END-OF-SERVICE BASE is 10,000.00. The panel also shows gross 10,000.00, deductions 816.46, net 9,183.54, taxable gross 9,995.00 and social-insurance base 10,000.00."],
  ["Dry-run scope","No accrual-ledger posting and no informational provision lines in Results Breakdown."],
],C.navy));

push(sec(8,"Common Errors & Troubleshooting"));
push(dataTable([{w:3400,label:"Symptom"},{w:5960,label:"What it means / what to do"}],[
  ["The EoS fields cannot be edited","Expected. eos.egypt is a statutory, read-only scheme. Use Fork to edit when an approved change is required."],
  ["Most Leave Provision fields cannot be edited","Expected. Only Annual-leave Time Type and Over-take policy allow limited in-place edit. Fork for every other change."],
  ["The leave balance cannot be read","Confirm employee leave balances have been replicated from SuccessFactors and that Annual-leave Time Type identifies the intended balance."],
  ["The accruals ledger is empty after a dry run","Expected. A dry run is side-effect-free; only an actual payroll run posts per-cycle provision amounts."],
  ["Provision lines are absent from Results Breakdown","Expected. The Breakdown intentionally hides informational lines. Use it to verify the bases, not ledger postings."],
  ["The EoS input looks unexpected","Read END-OF-SERVICE BASE in the Verification panel; do not substitute another displayed base."],
],C.crimson));

push(sec(9,"Tips & Notes"));
push(callout("tip","Use the kind filter chips before opening a scheme; each provisioning kind has one Egypt scheme in this environment."));
push(callout("best","Record an approved configuration decision before forking a statutory scheme or changing either limited-edit leave field."));
push(callout("note","Per-cycle provision amounts reach the accruals ledger only through an actual payroll run. Dry runs do not post, and Results Breakdown intentionally hides informational provision lines."));

push(sec(10,"Key Terms"));
push(dataTable([{w:2900,label:"Term"},{w:6460,label:"Meaning"}],[
  ["Statutory scheme","A scheme supplied in the country pack; both Egypt provisioning schemes in this KUT are statutory."],
  ["Fork to edit","Create an editable version without changing the statutory original."],
  ["Limited in-place edit","Permission to change only Annual-leave Time Type and Over-take policy on leave_provision.egypt."],
  ["Valuation basis","The base reference used by eos.egypt; the employee value is shown as END-OF-SERVICE BASE in Verification."],
  ["Bracket table","The EoS rate table reference; this scheme uses egypt_eos_2026."],
  ["Annual-leave Time Type","The identifier of the replicated SuccessFactors leave balance the scheme reads."],
  ["Dry run","A side-effect-free payroll calculation that does not post provision amounts to the accruals ledger."],
],C.teal));

push(sec(11,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can review both statutory provisioning schemes and verify the employee inputs independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-18_EoS_and_Leave_Provisioning_KUT.docx")); console.log("docx written"); })();
