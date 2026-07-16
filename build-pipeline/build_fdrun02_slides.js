// build_fdrun02_slides.js — FD-RUN-02 Finalize & Close a Payroll Period (deck)
const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/fdrun02_real",f);
const OUT="screenshots/fdrun02_real";
const meta={ bpId:"FD-RUN-02", title:"Finalize & Close a Payroll Period", module:"Nabd Pay", version:"1.0", status:"Draft", date:"July 2026" };
const outcomes=[
  "Read the Control Center cockpit and identify a period’s stage and next action.",
  "Recognise when a period is ready to close — approved, cut off, journal posted.",
  "Close a period through the confirmation dialog.",
  "Confirm the period is closed and locked, and see it move to the Closed group."];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Manager / Payroll Admin","Read the cockpit, confirm the period is posted, perform the permanent close."],
  ["Finance","Rely on the closed period as the final record behind the posted G/L journal."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Control Center","The operator cockpit driving each calendar’s open period through the lifecycle."],
  ["Stage rail","The visual lifecycle — Open, Run, Approve, Post to G/L, Close."],
  ["Posted","The period’s balanced journal has been posted to the general ledger."],
  ["Close / lock","Making a period terminal; results + journal retained; no reopen."]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["No Close period action","The period is not yet posted.","Post its journal to G/L first (G/L Posting manual)."],
  ["Close is blocked","A period cannot close until its journal is posted.","Complete the posting, then close."],
  ["Closed the wrong period","No reopen exists.","Confirm the period key in the “Close {period}?” title before confirming."]]};
const validation=[
  "The period is Approved, Cut off, and its journal is posted to G/L; next action is Close period.",
  "The dialog states the close is permanent (no reopen) and the journal is already posted to G/L.",
  "After close, the period shows Closed and locked; the lifecycle stages are complete.",
  "The period moves to the Closed group and the Closed counter increases."];
const tips=[
  {kind:"caution",text:"CAUTION — There is no reopen after a close. Confirm the period key in the dialog title first."},
  {kind:"best",text:"BEST PRACTICE — Close only after the journal is posted and every result is final."},
  {kind:"note",text:"NOTE — Closing one period lets you open the next to continue the cadence."}];
const STEPS=[
  {tag:"Task 1 — Read the cockpit",role:"Payroll Manager / Payroll Admin",n:1,action:"Open the Control Center and find the period.",nav:"Payroll › Control Center",expected:"Egypt Monthly · 08.2026 — 16 employees, Approved, Cut off badge, Close period as next action (its journal is posted).",img:"01-control-center-ready-to-close.png",cap:"The cockpit — the period is posted and ready to close."},
  {tag:"Task 2 — Close the period",role:"Payroll Manager / Payroll Admin",n:1,action:"Choose Close period and read the confirmation.",nav:"Control Center › Close period",expected:"“Close 08.2026?” — closing locks the period permanently (no reopen); the journal is already posted to G/L.",img:"02-close-confirmation-dialog.png",cap:"The close confirmation — permanent, journal already posted."},
  {tag:"Task 2 — Close the period",role:"Payroll Manager / Payroll Admin",n:2,action:"Confirm the close.",nav:"Close 08.2026? › Close period",expected:"The period is closed and locked; the lifecycle stages are all complete.",img:"03-closed-and-locked.png",cap:"The period is closed and locked."},
  {tag:"Task 3 — Confirm in cockpit",role:"Payroll Manager / Payroll Admin",n:1,action:"Return to the Control Center.",nav:"Payroll › Control Center",expected:"Egypt Monthly · 08.2026 now shows as Closed; the cadence can continue by opening the next period.",img:"04-control-center-closed.png",cap:"The cockpit — the period is now closed."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Finalize & close the period","Cockpit · close · confirm");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"FD-RUN-02_Finalize_and_Close_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
