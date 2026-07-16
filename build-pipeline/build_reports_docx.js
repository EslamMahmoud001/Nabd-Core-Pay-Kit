// build_reports_docx.js — BP-REPORT Payroll Reports — Statutory, Management & Audit (Word)
// Modelled on build_bp13_docx.js (task-based KUT pattern, without Configuration).
// Screenshots: screenshots/reports_real (4 real PNGs, 0 duplicate md5s).
const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/reports_real",f);
const OUT="screenshots/reports_real";
const meta={ bpId:"BP-REPORT", title:"Payroll Reports — Statutory, Management & Audit", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
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
  ["Module","Nabd Pay  ·  Reports"],
  ["Business process","BP-REPORT — Payroll Reports — Statutory, Management & Audit"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (Aug 2026 — Run #1 · Posted · E1)"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","16 Jul 2026","Initial task-based KUT with real screenshots of the reports catalogue, report previews, and batch-export menu","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("Reports provide a read-only view of the stored results for one completed payroll run. This guide shows a Payroll Admin how to confirm the selected run, understand the nine available reports, preview report rows on screen, and export one report, a category, or the complete catalogue."));
push(H2("After this training you will be able to:"));
[
  "Confirm which payroll run the Reports screen is using.",
  "Read the statutory, management, and audit catalogue and interpret READY and row-count indicators.",
  "Preview the Payroll Register and PIT Register as full routed pages with paged rows.",
  "Download a single report in an available export format.",
  "Generate all reports for one category or generate everything in the chosen format."
].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","Reports read the selected run’s stored results. They do not compute payroll or change the completed run."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","A completed payroll run is selected for reporting."],
  ["Scope","One selected payroll run — here Aug 2026 — Run #1, status Posted, pay group E1."],
  ["Role involved","Payroll Admin — reads, previews, and exports reports."],
  ["Input","Stored results from the selected payroll run."],
  ["Outputs","A readable full-page preview or an exported report file; batch export can cover one category or everything."],
  ["Where","Reports"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2900,label:"Role"},{w:6460,label:"Responsibility in this process"}],[
  ["Payroll Admin","Confirms the selected run, reads the catalogue, previews report content, validates row counts and totals, and exports individual or grouped reports."],
],C.navy));

push(sec(4,"Key Concepts"));
[
  "Run-scoped reporting — every report is tied to one selected payroll run and reads that run’s stored results.",
  "Statutory — official filings to submit to the authority.",
  "Management — reconciliation and cost views.",
  "Audit — evidence and sign-off trail.",
  "READY and row count — READY means the report has data for the selected run. A row count of 0 can be legitimate; Retro Adjustments is READY with 0 rows because this run had no back-dated changes.",
  "Preview — opens the report content as a full routed page with a pager; it is not a modal.",
  "Download — exports one report. Generate all exports statutory, management, audit, or everything as a batch.",
  "Export formats — PDF, Excel, CSV, JSON, and XML."
].forEach(t=>push(bullet(t)));
push(spacer(60), callout("note","Report Studio is the pointer for custom reports. Custom report design is not covered in this guide."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step — Read, Preview & Export Reports"));
push(lead("Start by confirming the run chip. Read the catalogue before opening a preview, then choose whether to export one report or use Generate all for a grouped export."));

push(H2("Task 1 — Open Reports and confirm the selected run"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Open Reports and confirm the run shown in the run chip.","Reports","The selected scope reads Aug 2026 — Run #1 · Posted · E1. Every report on the screen reads the stored results for that run."));

push(H2("Task 2 — Read the catalogue and the nine reports"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Read the three category groups, the READY pills, row counts, and the Preview and Download actions.","Reports","The catalogue shows three categories and nine reports for Aug 2026 — Run #1 · Posted · E1. Each card shows READY, its row count, its run source, and both actions.","01-reports-catalogue-9-cards.png","The Reports catalogue — nine run-scoped reports across statutory, management, and audit."));
push(H2("Nine reports for the selected run"));
push(dataTable([{w:2100,label:"Report"},{w:4380,label:"Description"},{w:1880,label:"Category"},{w:1000,label:"Rows"}],[
  ["PIT Register","Personal income tax per employee for this period","Statutory","16"],
  ["SI Register","Social insurance contributions by employee","Statutory","30"],
  ["Statutory Base","Statutory computation base used for legal reporting","Statutory","16"],
  ["Payroll Summary","Run-level totals: gross, taxes, deductions, employer cost and net","Management","8"],
  ["Cost-Center Rollup","Payroll cost distributed across cost centers","Management","1"],
  ["G/L Posting Preview","General ledger entries before SAP posting","Management","172"],
  ["Retro Adjustments","Back-dated salary changes (before → after → delta) settled in this run","Audit","0"],
  ["Payroll Register","Per-employee gross, tax, SI, deductions and net for this run","Audit","16"],
  ["Approval Log","Sign-off history for this run and its components","Audit","2"],
],C.teal));
push(spacer(40), callout("note","Retro Adjustments is READY with 0 rows. This is legitimate: there were no back-dated changes in this run."));

push(H2("Task 3 — Preview the Payroll Register"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Select Preview on the Payroll Register and read the per-employee rows.","Reports › Payroll Register › Preview  ·  /reports/register","A full routed page opens with Employee, Gross, Tax, Social insurance, Deductions, and Net columns. It shows 16 ROWS · TOTAL: EGP 163,149.83, the same run chip, pager 1–10 of 16, and Export Excel.","02-payroll-register-preview-rows.png","Payroll Register preview — 16 employee rows and total EGP 163,149.83 for the selected run."));

push(H2("Task 4 — Preview the PIT Register"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Return to Reports, select Preview on the PIT Register, and read the report rows.","Reports › PIT Register › Preview  ·  /reports/pit","A full routed page opens with Employee, Element, Amount, and Tags columns. It shows 16 rows, pager 1–10 of 16, and Export Excel.","03-pit-register-preview-rows.png","PIT Register preview — per-employee PIT content with a routed page and pager."));

push(H2("Task 5 — Download one report or generate a grouped export"));
push(roleTag("Payroll Admin"), spacer(60));
push(...step(1,"Choose the required export format, then select Download on the report card you need.","Reports › Export format › Download","The selected report is exported for the selected payroll run. Available formats are PDF, Excel, CSV, JSON, and XML."));
push(...step(2,"Use Generate all to export a category or the complete catalogue.","Reports › Generate all","The menu offers Generate all statutory, Generate all management, Generate all audit, and Generate everything. The batch uses the chosen export format; Excel is selected here.","04-excel-and-generate-all-menu.png","Generate all — batch-export one category or everything in the chosen format."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(6,"Validation & Expected Results"));
push(dataTable([{w:3400,label:"Check"},{w:5960,label:"Expected result"}],[
  ["Run scope","The catalogue and every preview show Aug 2026 — Run #1 · Posted · E1."],
  ["Catalogue count","Nine report cards are present across statutory, management, and audit."],
  ["READY and rows","Each report is READY. Its row count matches the selected run; Retro Adjustments is legitimately 0."],
  ["Payroll Register","The preview shows 16 rows and TOTAL: EGP 163,149.83, with pager 1–10 of 16."],
  ["PIT Register","The preview shows 16 rows, with pager 1–10 of 16."],
  ["Totals","Displayed report totals reconcile to the stored results for the same selected payroll run."],
  ["Single export","Download exports the chosen report in the selected format."],
  ["Batch export","Generate all exports the chosen category or everything in the selected format."],
],C.navy));

push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:3400,label:"Symptom"},{w:5960,label:"What it means / what to do"}],[
  ["The report is for the wrong period, run, status, or pay group","Confirm the run chip before reading or exporting. Select the intended payroll run, then re-open the report."],
  ["Retro Adjustments shows 0 rows","This is legitimate for this run; no back-dated changes were settled in it."],
  ["A preview count does not match the catalogue card","Confirm both views show the same run chip, then reconcile the row count to that run’s stored results."],
  ["Preview did not open as a modal","Expected. Preview opens a full routed report page with a pager."],
  ["The export format is not the one required","Return to Reports and choose PDF, Excel, CSV, JSON, or XML in the export-format select before exporting."],
  ["Several reports are needed","Use Generate all for statutory, management, audit, or everything instead of downloading each report individually."],
],C.crimson));

push(sec(8,"Tips & Notes"));
push(callout("tip","Read the run chip first. It is the quickest way to confirm that every catalogue card, preview, and export belongs to the intended payroll run."));
push(callout("best","Preview a report and reconcile its rows and totals before downloading or generating a batch."));
push(callout("note","Use a single Download for one report and Generate all when the complete statutory, management, audit, or full set is required."));

push(sec(9,"Key Terms"));
push(dataTable([{w:2900,label:"Term"},{w:6460,label:"Meaning"}],[
  ["Selected payroll run","The single completed run whose stored results supply every report on the screen."],
  ["Statutory report","An official filing to submit to the authority."],
  ["Management report","A reconciliation or cost view."],
  ["Audit report","Evidence or sign-off trail for the selected run."],
  ["READY","The report has data for the selected run; a legitimate result can still contain 0 rows."],
  ["Preview","A readable full routed report page with a pager."],
  ["Download","An export of one report."],
  ["Generate all","A batch export for statutory, management, audit, or everything in the chosen format."],
  ["Report Studio","The linked area for custom reports; it is not covered in this guide."],
],C.teal));

push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can confirm the selected payroll run, read and validate report content, preview the Payroll Register and PIT Register, and export one report or a grouped set independently."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role","Payroll Admin"],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-REPORT_Payroll_Reports_KUT.docx")); console.log("docx written"); })();
