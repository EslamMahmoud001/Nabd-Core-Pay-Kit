// build_loans_slides.js — BP-LOAN Loans & Advances — Recovery & Compliance (deck)
// Modelled on build_bp13_slides.js. Screenshots: screenshots/loans_real (5 real, 0 dup md5s).
const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/loans_real",f);
const OUT="screenshots/loans_real";
const meta={ bpId:"BP-LOAN", title:"Loans & Advances — Recovery & Compliance", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
const outcomes=[
  "Read the Loans & Advances overview, KPIs, status filters, and loan table.",
  "Interpret a loan’s principal, balance, progress, and monthly installment schedule.",
  "Review installments due in the current payroll cycle.",
  "Review deduction limits and the net-pay minimum-floor guardrail.",
  "Read policy rules, pause rules, and the five configured loan types.",
  "Recognize available lifecycle actions without performing them in this KUT."];
const processInfo=[
  ["Origination","An APPROVED SuccessFactors advance is synced through Core."],
  ["Schedule","Nabd Pay creates and owns the monthly recovery schedule and lifecycle."],
  ["Recovery","The current-cycle view identifies installments due through payroll."],
  ["Compliance","Deduction limits and the net-pay minimum floor keep recovery within legal caps."]];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Admin","Reviews and manages loan recovery: overview, status, loan detail, current-cycle installments, compliance guardrails, and policy rules."]]};
const concepts=[
  "Origination — an approved SuccessFactors advance synced through Core.",
  "Installment schedule — monthly recovery rows; each is Upcoming until recovered.",
  "Recovery guardrails — deduction limits and the net-pay minimum floor.",
  "Loan types — Personal loan, Salary advance, Emergency advance, Car advance, Education loan.",
  "Lifecycle actions — Pause a month, Change an amount, Settle early, and Write off."];
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Approved advance","An APPROVED SuccessFactors advance synced through Core that originates the loan or advance."],
  ["Installment schedule","The monthly recovery plan for a loan."],
  ["Upcoming","The status of an installment until it is recovered."],
  ["Recovery guardrail","A compliance control for deduction limits and the net-pay minimum floor."],
  ["Loan type","A configured loan category with its own limits."],
  ["Lifecycle action","Pause, Change amount, Settle early, or Write off."]]};
const troubleTbl={head:["Symptom","What to check","What to do"],rows:[
  ["Expected loan is not listed","A status pill may be narrowing the table.","Choose All 4 to restore the complete list shown in this KUT."],
  ["Wrong detail drawer is open","Check the employee and loan identifier.","Select Sherif Anwar Magdy — Personal loan · 10501."],
  ["Schedule views differ","The drawer is the full plan; Installment schedules is the current-cycle view.","Use the view that matches the review task."],
  ["Compliance check is flagged","Review Active compliance checks and Deduction limits.","Do not infer or bypass a permissible recovery amount."],
  ["Policy value is unclear","Check the Policy rules tab.","If a value is not shown, treat it as Unknown."]]};
const validation=[
  "Active loans shows 4 and the table contains the four named loan records.",
  "All five tabs are available, including Separation exposure and Policy rules.",
  "Sherif’s personal loan is ACTIVE: EGP 30,000.00 principal, EGP 0.00 repaid, 0% progress.",
  "The recovery plan has 12 UPCOMING installments of EGP 2,500.00, May 2026–April 2027.",
  "The current-cycle view includes installments due and the net-pay minimum-floor check.",
  "Compliance shows active checks and deduction limits; Policy rules shows five loan types."];
const tips=[
  {kind:"tip",text:"TIP — Start with All 4, then use a status pill to narrow the portfolio."},
  {kind:"best",text:"BEST PRACTICE — Read the full loan schedule before reviewing current-cycle recovery and compliance."},
  {kind:"note",text:"NOTE — Pause, Change amount, Settle early, and Write off are available but are not exercised in this KUT."}];
const STEPS=[
  {tag:"Task 1 — Overview and status",role:"Payroll Admin — reviews and manages loan recovery",n:1,action:"Open Loans, read the overview, then filter by status.",nav:"Loans & Advances › All loans › Status filters",expected:"Active loans is 4. Read the KPI tiles, five tabs, and four loan rows. Use All 4, Active 4, Paused, On hold, Completed, or Pending approval to scope the table.",img:"01-loans-overview-4-active-loans.png",cap:"Loans & Advances overview — KPIs, status filters, and four active loans."},
  {tag:"Task 2 — Loan detail",role:"Payroll Admin — reviews and manages loan recovery",n:1,action:"Open Sherif Anwar Magdy’s personal loan.",nav:"All loans › Sherif Anwar Magdy › Personal loan · 10501",expected:"EGP 30,000.00 principal; EGP 0.00 repaid; EGP 30,000.00 remaining; 12 × EGP 2,500.00; ACTIVE; 0% progress; estimated end April 2027.",note:"The 12 rows run May 2026–April 2027 and are UPCOMING. Pause, Change amount, Settle early, and Write off are available; do not perform them here.",img:"02-sherif-personal-loan-detail-recovery-plan.png",cap:"Sherif’s active personal loan and 12-month recovery plan."},
  {tag:"Task 3 — Current cycle",role:"Payroll Admin — reviews and manages loan recovery",n:1,action:"Review the current-cycle installment schedule.",nav:"Loans & Advances › Installment schedules",expected:"Installments due in the payroll cycle are shown with the net-pay minimum-floor check used for recovery.",img:"03-installment-schedules-current-cycle.png",cap:"Current-cycle recovery and the minimum-floor check."},
  {tag:"Task 4 — Compliance",role:"Payroll Admin — reviews and manages loan recovery",n:1,action:"Review recovery guardrails.",nav:"Loans & Advances › Compliance",expected:"Active compliance checks and Deduction limits are shown, including “Net pay below minimum floor,” so recovery remains within legal caps.",img:"04-compliance-recovery-guardrails.png",cap:"Compliance checks and deduction-limit guardrails."},
  {tag:"Task 5 — Policy rules",role:"Payroll Admin — reviews and manages loan recovery",n:1,action:"Review policy rules and loan types.",nav:"Loans & Advances › Policy rules",expected:"Review Eligibility rules, Amount limits, Repayment rules, Pause rules, and the five configured loan types. Do not infer undisplayed values.",img:"05-policy-rules-pause-rules-loan-types.png",cap:"Global policy, pause rules, and five configured loan types."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"Purpose","Purpose & Learning Outcomes",outcomes,meta.bpId+"  ·  Purpose");
  S.infoGridSlide(pptx,meta,"Process at a Glance",processInfo,meta.bpId+"  ·  At a glance");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.bulletsSlide(pptx,meta,"How recovery works","Key Concepts",concepts,meta.bpId+"  ·  Concepts");
  S.sectionDivider(pptx,"Section","Review and manage loan recovery","overview · detail · current cycle · compliance · policy rules");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,note:st.note,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-LOAN_Loans_and_Advances_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
