// build_bp10_slides.js — BP-10 G/L Posting (deck)
// Modelled on build_bp13_slides.js. Screenshots: screenshots/bp10_real (real, 0 dup md5s).
const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/bp10_real",f);
const OUT="screenshots/bp10_real";
const meta={ bpId:"BP-10", title:"G/L Posting", module:"Nabd Pay",
  version:"1.1", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
const outcomes=[
  "Explain how company-code output routings create the payroll journal.",
  "Locate the approved Egypt Monthly · August 2026 cycle in G/L Posting.",
  "Reconcile seven journal lines and exact debits and credits of EGP 230,056.25.",
  "Recognise No duplicate post as correct idempotency protection.",
  "Confirm the posting to S/4 by its returned document number and posted status."];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Admin / Tenant Admin","Configure output routings, post the journal to S/4, and review the posting result."],
  ["Finance","Review the journal lines, employee count, exact totals and validation results before posting."]]};
const routingTbl={head:["Routing output","DR/CR","Account","Company","Amount (EGP)"],rows:[
  ["Basic Salary → Salaries & Wages","DR","6100","1000","200,000.00"],
  ["Egypt SI — Employer → SI Employer Expense","DR","6150","1000","30,056.25"],
  ["Net pay → Net Payroll Payable","CR","2100","1000","163,149.83"],
  ["Egypt Income Tax → Income Tax Payable","CR","2210","1000","19,117.17"],
  ["Egypt SI — Employee → SI Payable","CR","2220","1000","17,633.00"],
  ["Egypt SI — Employer → SI Payable","CR","2220","1000","30,056.25"],
  ["Martyrs & Victims Fund → Martyrs Fund Payable","CR","2230","1000","100.00"]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Output routing","A company-code-scoped mapping from a pay item to a G/L account and contra account."],
  ["Balanced journal","A journal whose total debits equal total credits."],
  ["Idempotency","Protection against building a second live journal for the same cycle."],
  ["S/4 document number","The reference S/4 returns for the posted journal (here 1000000123)."],
  ["S/4 destination","Environment configuration required to transmit the journal to S/4."]]};
const troubleTbl={head:["Symptom","What it means","What to do"],rows:[
  ["No journal","A dry-run cycle has no journal.","Use an approved or closed cycle."],
  ["No duplicate post blocker","A live journal already exists for the cycle.","Use the existing journal; the blocker is correct safety behaviour."],
  ["“No duplicate post” blocker","A live journal already exists for the cycle.","Idempotency protection — the system will not build a second journal."],
  ["Journal not balanced","Debits do not equal credits.","Check the output routings — every pay item and net_pay needs one."],
  ["Unexpected journal line","The relevant output routing needs review.","Check the account, contra account and company code 1000."]]};
const validation=[
  "Cycle egypt_monthly:2026P08 is approved and contains 16 employees.",
  "The journal has 7 lines: 2 debit lines and 5 credit lines.",
  "Total debits = total credits = EGP 230,056.25; difference = 0.",
  "The checklist has 8 passes and 1 correct idempotency blocker.",
  "The journal is posted to S/4 as document 1000000123 (fiscal year 2026).",
  "The period is then locked; the posted journal is retained and can be reversed if needed before close."];
const tips=[
  {kind:"tip",text:"TIP — Reconcile against the exact EGP 230,056.25 journal total; the tiles round it to EGP 230.1K."},
  {kind:"best",text:"BEST PRACTICE — Finance reviews all seven lines, 16 employees and debit/credit equality before posting."},
  {kind:"note",text:"NOTE — No duplicate post is a safety feature. It prevents a second live journal for the cycle."},
  {kind:"note",text:"NOTE — A posted journal is identified by its journal reference (PAY-2026-08-R1) and S/4 document number (1000000123)."}];
const STEPS=[
  {tag:"Task 1 — Locate the cycle",role:"Payroll Admin / Tenant Admin",n:1,action:"Open G/L Posting and locate Egypt Monthly · August 2026.",nav:"Operations › G/L Posting",expected:"Cycle egypt_monthly:2026P08 shows 16 employees, EGP 230,056.25 and Posted.",img:"01-posting-portfolio.png",cap:"G/L Posting portfolio — the cycle is posted to the ledger."},
  {tag:"Task 2 — Review the journal",role:"Finance",n:1,action:"Open the cycle and reconcile the built journal.",nav:"G/L Posting › Egypt Monthly · August 2026",expected:"7 lines and 16 employees; DR = CR = EGP 230,056.25. Posted to the ledger as S/4 document 1000000123; the stage rail is complete through Period locked.",img:"02-cycle-posted.png",cap:"The journal is built, balanced and posted to G/L (S/4 document 1000000123)."},
  {tag:"Task 3 — Confirm the posting",role:"Payroll Admin / Tenant Admin",n:1,action:"Open Post history and confirm the posting.",nav:"Cycle detail › Post history › PAY-2026-08-R1",expected:"The posting for PAY-2026-08-R1 shows Posted with S/4 document number 1000000123; the journal is live in the general ledger.",img:"03-post-history-posted.png",cap:"Post history — posted to S/4 as document 1000000123."},
  {tag:"Task 4 — Confirm routing",role:"Payroll Admin / Tenant Admin",n:1,action:"Open G/L mapping and review legal entity 1000.",nav:"Cycle detail › G/L mapping",expected:"Confirm the seven routing outputs and their debit, credit and contra accounts for company code 1000.",img:"04-gl-mapping-7-routings.png",cap:"G/L Mapping — routing outputs for legal entity 1000."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Configuration","G/L Mapping","Seven routing outputs · company code 1000 · account + contra account");
  S.tableSlide(pptx,meta,"How the approved cycle becomes seven lines","G/L Mapping — Verified Routing Outputs",routingTbl.head,routingTbl.rows,[4.83,1.05,1.3,1.35,4.0],S.C.teal,meta.bpId+"  ·  Configuration");
  S.sectionDivider(pptx,"Section","Build & post the journal","approved cycle · review · post history · routing confirmation");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-10_GL_Posting_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
