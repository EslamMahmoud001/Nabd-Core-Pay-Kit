// build_payslips_slides.js — BP-PAYSLIP Payslips — Template & Bulk Generation (deck)
// Modelled on build_bp13_slides.js. Screenshots: screenshots/payslips_real (real, 0 dup md5s).
const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/payslips_real",f);
const OUT="screenshots/payslips_real";
const meta={ bpId:"BP-PAYSLIP", title:"Payslips — Template & Bulk Generation", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
const outcomes=[
  "Create a payslip template for Egypt pay group E1 and open it in Payslip Studio.",
  "Design and preview the template, then confirm that it is Active with key EG-E1.",
  "Select the closed cycle and template in the four-step Generate Payslips wizard.",
  "Select employees and review the selected, matched and skipped counts.",
  "Type GENERATE to confirm the bulk action, then download the generated payslips."];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Admin / Tenant Admin","Create, design and preview the template; select the closed cycle and employees; review the match; confirm generation; download payslips."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Payslip template","Defines how a payslip looks for a pay group."],
  ["Payslip Studio","The screen used to design and preview a template."],
  ["Active","The template status on creation; one template is active per pay group."],
  ["Closed cycle","A completed payroll cycle whose final results can be used for generation."],
  ["Confirmation gate","Typing GENERATE enables the bulk generation action."]]};
const troubleTbl={head:["Symptom","What it means","What to do"],rows:[
  ["No template is available","The template has not been created yet.","Use New template, enter the details and open Studio."],
  ["The cycle is not listed","Only closed cycles are listed.","Confirm that the intended cycle is closed."],
  ["Generate is not enabled","The typed confirmation gate is not complete.","Type GENERATE exactly in the confirmation dialog."],
  ["An individual file is needed","The completed result provides per-payslip actions.","Choose Download for that payslip."]]};
const validation=[
  "Egypt Monthly Payslip is Active for pay group E1 with template key EG-E1.",
  "egypt_monthly:2026P08 is listed as [CLOSED] for 2026-08-01 → 2026-08-31.",
  "Employee selection shows 16 of 16; review shows Selected 16 · Matched 16 · Skipped 0.",
  "Typing GENERATE enables the bulk generation action.",
  "The result is 16 generated · 0 skipped · 0 failed, with a Download action for each payslip.",
  "Database confirmation: nabd_pay_payslips contains 16 rows."];
const tips=[
  {kind:"tip",text:"TIP — Use the live preview in Payslip Studio to review the template before bulk generation."},
  {kind:"best",text:"BEST PRACTICE — At Review match, read Selected, Matched and Skipped before continuing."},
  {kind:"note",text:"NOTE — Only closed cycles are listed because payslips use a completed run’s final results."}];
const CONFIG_STEPS=[
  {tag:"Configuration — Payslip Template",role:"Payroll Admin / Tenant Admin",n:1,action:"Start a new payslip template.",nav:"Payslip Templates › New template",expected:"The new-template dialog opens from the empty Payslip Templates screen.",img:"01-payslip-templates-empty.png",cap:"Payslip Templates — start with New template."},
  {tag:"Configuration — Payslip Template",role:"Payroll Admin / Tenant Admin",n:2,action:"Enter the template details and open Studio.",nav:"Name › Country › Pay group › Create & open Studio",expected:"Egypt Monthly Payslip · Egypt · E1. Create & open Studio opens the new template.",img:"02-new-template-dialog.png",cap:"Creating the template for pay group E1."},
  {tag:"Configuration — Payslip Template",role:"Payroll Admin / Tenant Admin",n:3,action:"Design and preview the template.",nav:"Payslip Studio",expected:"The Egypt Monthly Payslip template has a live preview and an Active status pill.",img:"03-payslip-studio-active-preview.png",cap:"Payslip Studio — active template and live preview."},
  {tag:"Configuration — Payslip Template",role:"Payroll Admin / Tenant Admin",n:4,action:"Confirm the active template.",nav:"Payslip Templates",expected:"The card shows Egypt Monthly Payslip · key EG-E1 · Active · Open in Studio.",img:"04-active-template-card.png",cap:"The active template card."},
];
const STEPS=[
  {tag:"Task 1 — Pick cycle and template",role:"Payroll Admin / Tenant Admin",n:1,action:"Select the closed cycle and template.",nav:"Generate Payslips › 1. Pick cycle and template",expected:"egypt_monthly:2026P08 · 2026-08-01 → 2026-08-31 · [CLOSED] and the template are selected. Only closed cycles are listed.",img:"05-generate-pick-cycle-template.png",cap:"The closed cycle and template selected."},
  {tag:"Task 2 — Pick employees",role:"Payroll Admin / Tenant Admin",n:1,action:"Select the employees.",nav:"Generate Payslips › 2. Pick employees",expected:"All 16 employees are selected: 16 of 16.",img:"06-employee-preview-16-selected.png",cap:"16 of 16 employees selected."},
  {tag:"Task 3 — Review match",role:"Payroll Admin / Tenant Admin",n:1,action:"Review the employee-to-template match.",nav:"Generate Payslips › 3. Review match",expected:"Selected 16 · Matched 16 · Skipped 0.",img:"07-review-16-matches.png",cap:"All 16 selected employees match."},
  {tag:"Task 4 — Confirm and generate",role:"Payroll Admin / Tenant Admin",n:1,action:"Review the generation summary.",nav:"Generate Payslips › 4. Confirm and generate",expected:"The summary is displayed before the bulk generation action starts.",img:"08-confirm-generation-summary.png",cap:"The summary before generation."},
  {tag:"Task 4 — Confirm and generate",role:"Payroll Admin / Tenant Admin",n:2,action:"Type GENERATE to enable the action.",nav:"Confirm bulk generation › GENERATE",expected:"The confirmation gate is complete and the bulk generation action is enabled.",img:"09-typed-generate-confirmation.png",cap:"The typed confirmation gate."},
  {tag:"Task 4 — Confirm and generate",role:"Payroll Admin / Tenant Admin",n:3,action:"Review the result and download payslips.",nav:"Generation result",expected:"16 generated · 0 skipped · 0 failed. Every generated payslip has a Download action.",img:"10-generation-complete-16.png",cap:"16 payslips generated, each downloadable."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Configuration","Payslip Template","Create · design and preview · confirm Active");
  CONFIG_STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  Configuration"}));
  S.sectionDivider(pptx,"Section","Generate Payslips","Closed cycle · employees · match review · confirm · result");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-PAYSLIP_Payslips_KUT.pptx")});
  console.log("deck: "+(CONFIG_STEPS.length+STEPS.length)+" step slides");
})();
