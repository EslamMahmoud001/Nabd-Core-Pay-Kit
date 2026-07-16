// build_bp13_slides.js — BP-13 Off-Cycle Payroll — One-Time Payments (deck)
// Modelled on build_bp09_slides.js. Screenshots: screenshots/bp13_real (real, 0 dup md5s).
const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/bp13_real",f);
const OUT="screenshots/bp13_real";
const meta={ bpId:"BP-13", title:"Off-Cycle Payroll — One-Time Payments", module:"Nabd Pay", version:"1.0", status:"Draft", date:"July 2026" };
const outcomes=[
  "Start a One-Time off-cycle run and set its label and payment date.",
  "Filter the SuccessFactors one-time payments by off-cycle reason and/or pay date.",
  "Read the matching-payments table and choose which payments to run.",
  "Simulate the run and read the summary and per-employee amounts.",
  "Submit for approval and track the run on the Approvals page."];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Officer / Payroll Admin","Create the run, filter and select the payments, simulate, submit for approval."],
  ["Payroll Manager / HR Director","Review the submitted run on the Approvals page and approve or reject."],
  ["Payroll Admin / Tenant Admin","One-time setup: make the pay item available off-cycle and map it to the SF component code."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Off-cycle run","A payment run outside the regular cycle, with its own payment date and approval."],
  ["One-Time run","An off-cycle run that pays the one-time payments recorded in SuccessFactors."],
  ["Off-cycle reason","The SF reason code on a payment — the primary filter on the Payments step."],
  ["Mapping","The link from an SF component code to a Nabd pay item."],
  ["Paid gross","The payment is paid in full; tax and SI settle in the regular cycle."]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["No payments listed","The list only loads once you choose a reason or pay date.","Pick a filter — the pay-date list shows a count per date."],
  ["“Use 0 payments” disabled","No payments are ticked.","Tick at least one row in the matching-payments table."],
  ["A payment has no mapping badge","Its SF component code is not mapped to an off-cycle pay item.","Complete the Component Studio setup, then re-open the run."],
  ["An expected payment is missing","It is dated after the run’s payment date.","Set the payment date on or after the payments you intend to run."],
  ["A run type shows “Soon”","That type is not yet available in this release.","Use One-Time for SuccessFactors one-time payments."]]};
const validation=[
  "Only payments matching the chosen filter are listed; amounts equal the SF one-time payments.",
  "Every payment you intend to pay shows a mapping badge to its Nabd pay item.",
  "The payments total matches the simulated gross — EGP 21,513.00 across 2 employees.",
  "Deductions are 0.00 — a One-Time off-cycle payment is paid gross.",
  "Anomalies are 0 and every per-employee row shows OK.",
  "The run moves Draft → Simulated → Pending approval and appears in Approvals."];
const tips=[
  {kind:"tip",text:"TIP — Filter by pay date to pay everything due on one date, or by reason to pay one category across dates."},
  {kind:"best",text:"BEST PRACTICE — Simulate and read the per-employee table, not just the totals. View calculation explains any amount."},
  {kind:"note",text:"NOTE — Deductions of 0.00 are expected: an off-cycle one-time payment is paid gross; tax and SI settle in the regular cycle."}];
const STEPS=[
  {tag:"Task 1 — Start the run",role:"Payroll Officer / Payroll Admin",n:1,action:"Open the Off-cycle Workbench.",nav:"Payroll › Off-Cycle",expected:"Every off-cycle run with its type, status, employees, net total and payment date.",img:"01-workbench.png",cap:"The Off-cycle Workbench."},
  {tag:"Task 1 — Start the run",role:"Payroll Officer / Payroll Admin",n:2,action:"Start a new run.",nav:"Off-cycle › New off-cycle run",expected:"The run-type dialog opens; each tile explains its purpose. “Soon” tiles are not yet available.",img:"02-run-type-dialog.png",cap:"Choosing the off-cycle run type."},
  {tag:"Task 1 — Start the run",role:"Payroll Officer / Payroll Admin",n:3,action:"Choose One-Time and continue.",nav:"Run-type dialog › One-Time › Continue",expected:"One-Time — “Run SF one-time payments by reason” — is selected.",img:"03-run-type-onetime.png",cap:"One-Time selected."},
  {tag:"Task 1 — Start the run",role:"Payroll Officer / Payroll Admin",n:4,action:"Name the run, set the payment date, create it.",nav:"Name your One-Time › Create & configure",expected:"The run is created and its wizard opens. Set the payment date on or after the payments you intend to run.",img:"04-name-run.png",cap:"Naming the run and setting the payment date."},
  {tag:"Task 2 — Choose payments",role:"Payroll Officer / Payroll Admin",n:1,action:"Open the Payments step.",nav:"Step 2 — One-time payments",expected:"Two filters — reason and pay date. Nothing is listed until you filter, so the set is always deliberate.",img:"05-payments-unfiltered.png",cap:"The list waits for a filter."},
  {tag:"Task 2 — Choose payments",role:"Payroll Officer / Payroll Admin",n:2,action:"Filter, then confirm the selection.",nav:"Step 2 › Off-cycle reason / Pay date",expected:"Matching payments appear with employee, reason, component, mapping, pay date and amount — EGP 21,513.00 across 2 employees. All are selected for you.",img:"06-payments-list.png",cap:"Matching payments — read from SuccessFactors."},
  {tag:"Task 3 — Simulate",role:"Payroll Officer / Payroll Admin",n:1,action:"Start the simulation.",nav:"Step 3 — Simulate",expected:"The engine computes the run for the employees carrying the selected payments.",img:"08-simulate-ready.png",cap:"Ready to simulate."},
  {tag:"Task 3 — Simulate",role:"Payroll Officer / Payroll Admin",n:2,action:"Read the results.",nav:"Step 3 — Simulate (complete)",expected:"Gross EGP 21,513.00 → Net EGP 21,513.00, 2 employees, 0 anomalies. Deductions 0.00 — paid gross.",img:"09-simulate-results.png",cap:"Simulation complete — OFF-CYCLE DRY RUN."},
  {tag:"Task 4 — Submit",role:"Payroll Officer / Payroll Admin",n:1,action:"Review the submission summary.",nav:"Step 4 — Submit for approval",expected:"Employees, gross and payment date are restated, with the approval chain and an optional comment.",img:"10-submit.png",cap:"Submission summary and approval chain."},
  {tag:"Task 4 — Submit",role:"Payroll Officer / Payroll Admin",n:2,action:"Submit the run.",nav:"Step 4 › Submit for approval",expected:"The run status becomes Pending approval and the approvers are notified.",img:"11-submit-confirmation.png",cap:"Submitted for approval."},
  {tag:"Task 4 — Submit",role:"Payroll Manager / HR Director",n:3,action:"Track the run in Approvals.",nav:"Payroll › Approvals",expected:"The submitted run is waiting in the approvals inbox to be actioned.",img:"12-approvals.png",cap:"The run in the Approvals inbox."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Run a One-Time off-cycle payment","Run type · payments · simulate · submit");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-13_Off-Cycle_Payroll_One-Time_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
