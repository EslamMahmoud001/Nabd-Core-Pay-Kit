// build_reports_slides.js — BP-REPORT Payroll Reports — Statutory, Management & Audit (deck)
// Modelled on build_bp13_slides.js. Screenshots: screenshots/reports_real (4 real, 0 dup md5s).
const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/reports_real",f);
const OUT="screenshots/reports_real";
const meta={ bpId:"BP-REPORT", title:"Payroll Reports — Statutory, Management & Audit", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
const outcomes=[
  "Confirm which payroll run the Reports screen is using.",
  "Read the statutory, management, and audit catalogue and interpret READY and row counts.",
  "Preview the Payroll Register and PIT Register as full routed pages with paged rows.",
  "Download one report in PDF, Excel, CSV, JSON, or XML.",
  "Generate all reports for one category or generate everything in the chosen format."];
const processInfo=[
  ["Trigger","A completed payroll run is selected for reporting."],
  ["Scope","One run — Aug 2026 · Run #1 · Posted · E1."],
  ["Role","Payroll Admin — reads, previews, and exports reports."],
  ["Input","Stored results from the selected payroll run."],
  ["Preview","A readable full routed page with a pager."],
  ["Export","One report, one category, or everything in the chosen format."]];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Admin","Confirm the selected run; read and validate the catalogue; preview report rows; export individual or grouped reports."]
]};
const concepts=[
  "Run-scoped — every report reads the stored results of one selected completed payroll run; reports do not compute payroll.",
  "Statutory — official filings to submit to the authority.",
  "Management — reconciliation and cost views.",
  "Audit — evidence and sign-off trail.",
  "READY — the report has data for the selected run; a legitimate report can contain 0 rows.",
  "Preview — opens a full routed page with a pager, not a modal.",
  "Download — exports one report; Generate all batch-exports a category or everything.",
  "Formats — PDF, Excel, CSV, JSON, and XML. Report Studio is the pointer for custom reports and is not covered here."];
const reportsTbl={head:["Report","Description","Category","Rows"],rows:[
  ["PIT Register","Personal income tax per employee for this period","Statutory","16"],
  ["SI Register","Social insurance contributions by employee","Statutory","30"],
  ["Statutory Base","Statutory computation base used for legal reporting","Statutory","16"],
  ["Payroll Summary","Run-level totals: gross, taxes, deductions, employer cost and net","Management","8"],
  ["Cost-Center Rollup","Payroll cost distributed across cost centers","Management","1"],
  ["G/L Posting Preview","General ledger entries before SAP posting","Management","172"],
  ["Retro Adjustments","Back-dated salary changes (before → after → delta) settled in this run","Audit","0"],
  ["Payroll Register","Per-employee gross, tax, SI, deductions and net for this run","Audit","16"],
  ["Approval Log","Sign-off history for this run and its components","Audit","2"]
]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Selected payroll run","The single completed run whose stored results supply every report."],
  ["Statutory report","An official filing to submit to the authority."],
  ["Management report","A reconciliation or cost view."],
  ["Audit report","Evidence or sign-off trail for the selected run."],
  ["READY","The report has data for the selected run; a legitimate result can have 0 rows."],
  ["Preview","A readable full routed report page with a pager."],
  ["Download","An export of one report."],
  ["Generate all","A batch export for statutory, management, audit, or everything."],
  ["Report Studio","The linked area for custom reports; not covered in this guide."]
]};
const troubleTbl={head:["Symptom","What it means","What to do"],rows:[
  ["Wrong run scope","The period, run, status, or pay group is not the one required.","Confirm the run chip, select the intended run, then re-open the report."],
  ["Retro Adjustments has 0 rows","No back-dated changes were settled in this run.","Treat 0 as a legitimate result for this run."],
  ["Preview count differs from the card","The views may not be scoped to the same run.","Confirm the same run chip, then reconcile the count to stored run results."],
  ["Preview did not open as a modal","Expected — previews are routed full pages.","Read the paged report, then return to Reports."],
  ["Several reports are required","Single-card Download exports only one report.","Use Generate all for statutory, management, audit, or everything."]
]};
const validation=[
  "The catalogue and every preview show Aug 2026 — Run #1 · Posted · E1.",
  "Nine report cards appear across statutory, management, and audit.",
  "Every report is READY; each row count matches the selected run. Retro Adjustments is legitimately 0.",
  "Payroll Register shows 16 rows, TOTAL: EGP 163,149.83, and pager 1–10 of 16.",
  "PIT Register shows 16 rows and pager 1–10 of 16.",
  "Displayed totals reconcile to the stored results for the same selected run.",
  "Download exports one report; Generate all exports the chosen category or everything in the chosen format."];
const tips=[
  {kind:"tip",text:"TIP — Read the run chip first so every catalogue card, preview, and export belongs to the intended run."},
  {kind:"best",text:"BEST PRACTICE — Preview and reconcile rows and totals before downloading or generating a batch."},
  {kind:"note",text:"NOTE — Use Download for one report and Generate all for a statutory, management, audit, or complete set."}];
const STEPS=[
  {tag:"Task 1 — Open Reports",role:"Payroll Admin",n:1,action:"Open Reports and confirm the selected run.",nav:"Reports",expected:"The run chip reads Aug 2026 — Run #1 · Posted · E1. Every card reads stored results from that run.",img:"01-reports-catalogue-9-cards.png",cap:"The run-scoped catalogue: three categories and nine reports."},
  {tag:"Task 3 — Preview Payroll Register",role:"Payroll Admin",n:1,action:"Preview the Payroll Register and read each column.",nav:"Reports › Payroll Register › Preview  ·  /reports/register",expected:"Employee, Gross, Tax, Social insurance, Deductions, and Net. 16 ROWS · TOTAL: EGP 163,149.83; pager 1–10 of 16; Export Excel.",img:"02-payroll-register-preview-rows.png",cap:"Payroll Register — 16 rows and total EGP 163,149.83."},
  {tag:"Task 4 — Preview PIT Register",role:"Payroll Admin",n:1,action:"Preview the PIT Register and read the rows.",nav:"Reports › PIT Register › Preview  ·  /reports/pit",expected:"Employee, Element, Amount, and Tags. 16 rows; pager 1–10 of 16; Export Excel.",img:"03-pit-register-preview-rows.png",cap:"PIT Register — a full routed page with a pager."},
  {tag:"Task 5 — Export reports",role:"Payroll Admin",n:1,action:"Download one report or generate a grouped export.",nav:"Reports › Export format › Download / Generate all",expected:"Choose PDF, Excel, CSV, JSON, or XML. Generate all offers statutory, management, audit, or everything; Excel is selected here.",img:"04-excel-and-generate-all-menu.png",cap:"Generate all — one category or everything in the chosen format."}
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"Why this matters","Purpose & Learning Outcomes",outcomes,meta.bpId+"  ·  Purpose");
  S.infoGridSlide(pptx,meta,"Process at a Glance",processInfo,meta.bpId+"  ·  At a glance");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[3.2,9.13],S.C.magenta,meta.bpId+"  ·  Roles");
  S.bulletsSlide(pptx,meta,"How reports work","Key Concepts",concepts,meta.bpId+"  ·  Key concepts");
  S.sectionDivider(pptx,"Section","Read, preview & export reports","Confirm the run · read the catalogue · preview rows · export");
  S.stepSlide(pptx,meta,{tag:STEPS[0].tag,role:STEPS[0].role,n:STEPS[0].n,action:STEPS[0].action,nav:STEPS[0].nav,expected:STEPS[0].expected,imgPath:IMG(STEPS[0].img),screenshot:STEPS[0].cap,footerRight:meta.bpId+"  ·  Task 1"});
  S.tableSlide(pptx,meta,"PERFORMED BY · Payroll Admin","Task 2 — Read the nine-report catalogue",reportsTbl.head,reportsTbl.rows,[2.05,6.45,2.35,1.48],S.C.teal,meta.bpId+"  ·  Task 2");
  STEPS.slice(1).forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-REPORT_Payroll_Reports_KUT.pptx")});
  console.log("deck: "+STEPS.length+" screenshot step slides");
})();
