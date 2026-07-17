const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/loans_coldrun",f);
const OUT="screenshots/loans_coldrun";
const meta={ bpId:"BP-LOAN", title:"Loans & Advances", module:"Nabd Pay", version:"1.0", status:"Draft", date:"July 2026" };
const outcomes=[
  "Explain where loans come from — an approved SuccessFactors advance ingested into Nabd Pay.",
  "Read the loan dashboard: active loans, total outstanding, collected, paused, compliance alerts.",
  "Open a loan and read its month-by-month recovery schedule and remaining balance.",
  "Review a cycle's installments and the minimum net-pay floor check per employee.",
  "Read the compliance guardrails, separation exposure, and the global loan policy."];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Admin","Reviews loans and schedules, commits cycle installments, monitors compliance and separation exposure."],
  ["HR Director","Full loans operator — pause, change amount, settle early, write off, and maintain the loan policy."],
  ["SuccessFactors (origination)","Owns the advance request and approval — the source of every loan."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Advance (SF)","The approved request that originates a loan — who, how much, approval."],
  ["Recovery schedule","The month-by-month installments that repay one loan."],
  ["Net-pay floor","The minimum net pay an employee must retain after a deduction."],
  ["Compliance guardrail","A deduction-limit check (floor, installment cap, ratio) that gates a cycle."],
  ["Separation exposure","The open loan balance for a leaver, settled from final pay."]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["No loans appear","No advance approved / ingested yet.","Approve the advance in SF, then run the advances sync."],
  ["Installment Below floor","Deduction takes net pay under the floor.","Pause the month or change the amount before committing."],
  ["“Over” in deduction limits","Installment exceeds 25% of gross.","Reduce the installment (extend the term) or route an exception."]]};
const validation=[
  "Each approved SF advance appears as an Active loan with principal and monthly installment.",
  "The loan schedule sums exactly to the principal (12 × EGP 2,000.00 = EGP 24,000.00).",
  "Total outstanding reconciles to the sum of remaining balances (EGP 52,000).",
  "Every cycle installment shows net pay after deduction and an Above/Below floor result.",
  "No hard blocks before committing; open balances for leavers are surfaced to settle."];
const tips=[
  {kind:"tip",text:"TIP — Read a loan's schedule from the row drawer: remaining balance, end date and every future installment in one place."},
  {kind:"best",text:"BEST PRACTICE — Check the net-pay floor and the compliance guardrails before committing a cycle's deductions."},
  {kind:"note",text:"NOTE — Loans originate in SuccessFactors and are ingested by the advances sync; never hand-create a loan to fill a gap."}];
const STEPS=[
  {tag:"Config — Policy",role:"HR Director (Payroll Admin: view)",n:1,action:"Review the global loan policy and loan types.",nav:"Loans & Advances › Policy rules",expected:"Eligibility, amount and repayment rules (min net floor EGP 4,000, max installment 25%, max term 24m) plus the loan-type catalogue.",img:"06-policy-loan-types.png",cap:"Policy rules — global policy + loan types."},
  {tag:"Task 1 — Dashboard & list",role:"Payroll Admin",n:1,action:"Open Loans & Advances and read the KPIs and loan list.",nav:"Loans & Advances › All loans",expected:"Active loans 4 · Total outstanding EGP 52,000 · one row per loan (e.g. Dina · Personal loan · EGP 24,000.00 · EGP 2,000.00/mo · Active).",img:"01-loans-list.png",cap:"Dashboard KPIs + active-loan list."},
  {tag:"Task 2 — Recovery schedule",role:"Payroll Admin",n:1,action:"Open a loan to read its month-by-month schedule.",nav:"Loans & Advances › All loans › (row)",expected:"Header (principal 24,000 · remaining 24,000 · 2,000/mo · 12 months · end Jul 2027) and 12 upcoming installments Aug 2026–Jul 2027.",img:"02-loan-detail-schedule.png",cap:"A loan's recovery schedule."},
  {tag:"Task 3 — Cycle installments",role:"Payroll Admin",n:1,action:"Review the cycle installments and net-pay floor.",nav:"Loans & Advances › Installment schedules",expected:"Each employee's installment with net pay after deduction and a floor check; Nadia flagged Below floor (net EGP 702.25).",img:"03-installment-schedules.png",cap:"Per-cycle installments + floor check."},
  {tag:"Task 4 — Compliance",role:"Payroll Admin",n:1,action:"Review the compliance guardrails and deduction limits.",nav:"Loans & Advances › Compliance",expected:"Guardrail checks (no hard blocks) and per-employee deduction limits; Nadia Over the 25% cap (EGP 500 vs 375).",img:"04-compliance.png",cap:"Compliance guardrails + deduction limits."},
  {tag:"Task 5 — Separation exposure",role:"Payroll Admin",n:1,action:"Review open loan balances for leavers.",nav:"Loans & Advances › Separation exposure",expected:"Total open balance and loans at risk for the period, to settle from final pay (here EGP 0.00 / 0 — no leavers).",img:"05-separation-exposure.png",cap:"Separation exposure for leavers."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Policy & Recovery","Policy · loans · schedules · compliance · separation");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-LOAN_Loans_and_Advances_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
