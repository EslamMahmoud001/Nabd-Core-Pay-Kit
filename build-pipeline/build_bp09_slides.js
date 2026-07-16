const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/bp09_real",f);
const OUT="screenshots/bp09_real";
const meta={ bpId:"BP-09", title:"Bank File — Salary Payment File", module:"Nabd Pay", version:"1.0", status:"Draft", date:"July 2026" };
const outcomes=[
  "Create a bank template from a ready-made starter (CIB, DME, DME XML) — no code.",
  "Select an approved cycle and a bank template on the Bank File screen.",
  "Read the salary-credit preview and validations, and why account numbers are masked.",
  "Generate the file with a chosen value date through the confirm-gated dialog.",
  "Confirm, download, and review previous exports."];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Admin / Tenant Admin","Configure templates; select cycle + template; generate, regenerate and download (audited)."],
  ["Audit / Finance (oversight)","Rely on the audit trail; reconcile the file total to the run."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Bank file","The salary-credit file handed to the bank — one net-pay row per employee."],
  ["Bank template","The reusable file layout a bank requires (columns, order, format)."],
  ["Eligible cycle","An approved (then posted/closed) cycle — the only kind a bank file uses."],
  ["Value date","The date the credit takes effect — cycle pay date, today, or custom."],
  ["Regenerate","Producing the file again, replacing the previous export (audited)."]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["“templateKey is required”","No bank template selected/configured.","Configure a template and select it before generating."],
  ["No cycle to select","No cycle is approved yet.","Approve the cycle first; then it appears on Bank File."],
  ["Employee excluded / Issues","No bank account, or zero/negative net.","Add the bank account or confirm the exclusion is expected."]]};
const validation=[
  "A bank template exists and is selectable.",
  "An approved cycle + template are selected; the preview populates.",
  "All validations pass — banked, single currency, no zero/negative net.",
  "The total reconciles to the payroll run.",
  "The export is listed as Generated with the expected records and amount."];
const tips=[
  {kind:"tip",text:"TIP — Use a starter (CIB, DME, DME XML) to stand up a template in one click."},
  {kind:"best",text:"BEST PRACTICE — Reconcile the file total to the run and confirm every validation before generating."},
  {kind:"note",text:"NOTE — Account numbers are masked on screen; full numbers are only in the file, and every generate/download is audited."}];
const STEPS=[
  {tag:"Config — Bank Template",role:"Payroll Admin / Tenant Admin",n:1,action:"Open New template and choose how to start.",nav:"Config › Bank Templates › New template",expected:"Start blank, import a CSV header, clone, or install a starter — CIB, DME flat, DME XML.",img:"01-new-template-starters.png",cap:"New template — starter options."},
  {tag:"Config — Bank Template",role:"Payroll Admin / Tenant Admin",n:2,action:"Confirm the template is listed.",nav:"Bank Templates › Your templates",expected:"The installed template appears with its key and format (e.g. CIB Egypt — Salary Upload · CSV).",img:"02-bank-templates-list.png",cap:"The bank template is installed."},
  {tag:"Task 1 — Select & preview",role:"Payroll Admin / Tenant Admin",n:1,action:"Choose the approved cycle and the bank template.",nav:"Payments › Bank File › Cycle + Template",expected:"Headline figures, the masked salary-credit preview and a validation checklist; confirm all pass.",img:"03-bankfile-preview.png",cap:"Bank File — preview + validations."},
  {tag:"Task 2 — Generate",role:"Payroll Admin / Tenant Admin",n:1,action:"Generate the file and choose the value date.",nav:"Bank File › Generate bank file › confirm",expected:"The dialog restates count + total and lets you set the value date (pay date, today, custom).",img:"04-generate-confirm.png",cap:"Confirm-gated Generate dialog."},
  {tag:"Task 3 — Download",role:"Payroll Admin / Tenant Admin",n:1,action:"Confirm generation and download.",nav:"Bank File › Download · Previous exports",expected:"The stepper advances to Download; the file is available and the export is recorded. Generate becomes Regenerate.",img:"05-generated.png",cap:"Generated — download available."},
  {tag:"Task 4 — History",role:"Payroll Admin / Tenant Admin",n:1,action:"Review the export history.",nav:"Bank File › Previous exports",expected:"Each generated file with status, name, record count, amount and timestamp — the audit trail.",img:"06-history.png",cap:"Previous exports — audit trail."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Configure & Generate","Bank template · cycle · generate · download");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-09_Bank_File_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
