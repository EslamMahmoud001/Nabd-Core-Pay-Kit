// build_analytics_docx.js — BP-ANALYTICS Payroll Analytics — Executive Cost Board (Word)
// Modelled on build_bp13_docx.js (task-based KUT pattern, without Configuration).
// Screenshots: screenshots/analytics_real (4 real PNGs, 0 duplicate md5s).
const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/analytics_real",f);
const OUT="screenshots/analytics_real";
const meta={ bpId:"BP-ANALYTICS", title:"Payroll Analytics — Executive Cost Board", module:"Nabd Pay",
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
  ["Module","Nabd Pay  ·  Insights › Analytics  ·  Executive payroll board"],
  ["Business process","BP-ANALYTICS — Payroll Analytics — Executive Cost Board"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (E1 · CLOSED · August 2026)"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","16 Jul 2026","Initial task-based KUT with four real screenshots of the executive payroll analytics board","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("Analytics is an executive, read-only board over a completed payroll run’s stored results. It is scoped by the globally selected pay group and the Period selector. It does not compute payroll; it summarises the stored results so Payroll Admin and Finance can read cost, cash, movement, gross-to-net, trend, and employee detail in one place."));
push(H2("After this training you will be able to:"));
[
  "Open Analytics and select the pay group and period whose completed run you want to read.",
  "Interpret the KPI tiles and reconcile headcount and net to the completed run.",
  "Read Cost composition and the period-over-period cost-driver bridge.",
  "Read the Gross → Net waterfall and the 12-month cost trend.",
  "Open Employee breakdown and recognise the other available detail tabs.",
  "Use Export CSV to export the current view."
].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","Analytics summarises stored payroll results. It is read-only and computes no payroll."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","A completed payroll run is available and its executive cost view is required."],
  ["Scope","The globally selected pay group plus the selected period — here E1 and August 2026."],
  ["Role involved","Payroll Admin / Finance — reads the board."],
  ["Input","The completed run’s stored payroll results."],
  ["Board zones","KPI tiles, Cost composition, cost-driver bridge, Gross → Net, cost trend, and the detail area."],
  ["Output","An executive read of the current view, with optional Export CSV."],
  ["Where","Insights › Analytics  ·  Executive payroll board"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2900,label:"Role"},{w:6460,label:"Responsibility in this process"}],[
  ["Payroll Admin / Finance","Selects the pay group and period, reads and reconciles the board, opens the required detail tab, and exports the current view when needed."],
],C.navy));

push(sec(4,"Key Concepts"));
[
  "Pay-group and period scope — Analytics follows the globally selected pay group and the Period selector. This guide uses E1 and August 2026.",
  "KPI tiles — Total people cost, Headcount, Cost per head, Cash to disburse, and Payroll leakage provide the board’s executive summary.",
  "Cost composition — explains what the composition shown is made of for the selected scope.",
  "Cost-driver bridge — explains the period-over-period movement from prior cost to current cost.",
  "Gross → Net — shows how gross resolves through reductions to net payable.",
  "Cost trend — shows 12 months of cost-to-company, net, and cost per head.",
  "Detail tabs — Employee breakdown, Component analysis, Retro register, and Run history provide the bottom detail area.",
  "Independent loading — each board zone loads independently.",
  "Payroll leakage — the board’s leakage metric. Leakage 0 and Retro 0 on this run mean there were no off-cycle or retro adjustments; this is a clean baseline."
].forEach(t=>push(bullet(t)));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step — Read the Executive Cost Board"));
push(lead("Set the pay-group and period scope first. Then read the board from the executive KPI summary through the chart zones to employee detail, and export the current view only when required."));

push(H2("Task 1 — Open Analytics and set the scope"));
push(roleTag("Payroll Admin / Finance — reads the board"), spacer(60));
push(...step(1,"Open Analytics, select pay group E1, and select August 2026.","Insights › Analytics  ·  Global pay group: E1  ·  Period: August 2026","The executive payroll board is scoped to E1, whose selected run is CLOSED, and August 2026. The top bar offers Export CSV."));

push(H2("Task 2 — Read the KPI tiles"));
push(roleTag("Payroll Admin / Finance — reads the board"), spacer(60));
push(...step(1,"Read the banner, YTD values, and five KPI tiles from left to right.","Analytics · E1 · August 2026","The banner states First recorded payroll for August 2026 · +EGP 230.1K · 16 hires. YTD cost is EGP 230.1K and YTD net is EGP 163.1K. The tiles show Total people cost EGP 230.1K, Headcount 16, Cost per head EGP 14,378.52, Cash to disburse EGP 230K, and Payroll leakage EGP 0.","01-analytics-e1-august-2026-kpis.png","E1 · August 2026 — the anchor view with the banner, YTD totals, and five executive KPI tiles.","Cash to disburse is shown as Net EGP 163.1K + Statutory EGP 66.8K. Total people cost shows a run-rate of EGP 2.8M/year; Headcount shows average gross EGP 12.5K; Payroll leakage is 0.0% of pay."));

push(H2("Task 3 — Read Cost composition and the cost-driver bridge"));
push(roleTag("Payroll Admin / Finance — reads the board"), spacer(60));
push(...step(1,"Read what the displayed cost composition contains, then follow the bridge from prior to current cost.","Analytics › Cost composition  ·  Why cost changed vs Jul 26","Cost composition shows Employer cost (SI + EoS) of EGP 30,056, equal to 100.0% of the composition shown, and EGP 1,878.52 per head across 16 employees. The bridge shows New hires +EGP 230.1K leading to Current cost EGP 230.1K.","02-cost-composition-and-driver-bridge-populated-populated.png","Cost composition and the period-over-period driver bridge for E1 · August 2026."));

push(H2("Task 4 — Read Gross → Net and the cost trend"));
push(roleTag("Payroll Admin / Finance — reads the board"), spacer(60));
push(...step(1,"Follow the Gross → Net waterfall, then read the 12-month trend legend.","Analytics › Gross → Net  ·  Cost trend","The waterfall resolves Gross EGP 200.0K through reductions of EGP 19,117.17, EGP 17,633, and EGP 100 to Net EGP 163.1K. Cost trend contains 12-month lines for cost-to-company, net, and cost per head.","03-gross-to-net-and-cost-trend-populated-populated.png","Gross → Net waterfall and the 12-month cost trend."));

push(H2("Task 5 — Open Employee breakdown"));
push(roleTag("Payroll Admin / Finance — reads the board"), spacer(60));
push(...step(1,"Open Employee breakdown and read the 16 employee rows.","Analytics › Employee breakdown","The tab shows 16 results on page 1/1, with one row per employee and columns for Name, ID, Entity, Gross, Deductions, Net, vs Prior, and Exceptions. The other tabs are Component analysis, Retro register, and Run history.","04-employee-breakdown-16-results.png","Employee breakdown — 16 results on page 1/1 with one row per employee."));

push(H2("Task 6 — Export the current view"));
push(roleTag("Payroll Admin / Finance — reads the board"), spacer(60));
push(...step(1,"Select Export CSV when a file of the current view is required.","Analytics › Export CSV","Analytics exports the current view as CSV.",undefined,undefined,"Confirm E1 and August 2026 before selecting Export CSV so the current view is the intended scope."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(6,"Validation & Expected Results"));
push(dataTable([{w:3400,label:"Check"},{w:5960,label:"Expected result"}],[
  ["Scope","The global pay group is E1, the period is August 2026, and the selected run is CLOSED."],
  ["Headcount reconciliation","Headcount is 16 and Employee breakdown contains 16 results on page 1/1."],
  ["Net reconciliation","YTD net, the Gross → Net waterfall, and the completed run reconcile at EGP 163.1K."],
  ["Cost and cash","Total people cost and YTD cost are EGP 230.1K. Cash to disburse is EGP 230K, shown as Net EGP 163.1K + Statutory EGP 66.8K."],
  ["Cost per head","The executive KPI is EGP 14,378.52. The Cost composition panel separately shows EGP 1,878.52 per head for the composition shown."],
  ["Clean baseline","Payroll leakage is EGP 0 and Retro is 0 because this run had no off-cycle or retro adjustments."],
  ["Detail","Employee breakdown shows Name, ID, Entity, Gross, Deductions, Net, vs Prior, and Exceptions for each employee."],
],C.navy));

push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:3400,label:"Symptom"},{w:5960,label:"What it means / what to do"}],[
  ["The board looks empty","Analytics scopes to the globally selected pay group. The wrong pay group is selected — switch to the pay group whose run you want; here, select E1."],
  ["The figures are for a different period","Confirm the Period selector and choose August 2026 for this example."],
  ["Headcount or net does not reconcile","Confirm E1 and August 2026, then compare the board with the completed run’s stored results: Headcount 16 and Net EGP 163.1K."],
  ["Payroll leakage or Retro shows 0","This is expected for this run. It had no off-cycle or retro adjustments and is a clean baseline."],
],C.crimson));

push(sec(8,"Tips & Notes"));
push(callout("tip","Set the globally selected pay group first, then the period. An empty board usually means the wrong pay group is selected."));
push(callout("best","Reconcile Headcount 16 and Net EGP 163.1K before using the board for executive review."));
push(callout("note","Each board zone loads independently. Read the KPI, chart, and detail zones as separate parts of the same selected scope."));

push(sec(9,"Key Terms"));
push(dataTable([{w:2900,label:"Term"},{w:6460,label:"Meaning"}],[
  ["Executive payroll board","The read-only Analytics view that summarises a completed run’s stored results."],
  ["Pay-group scope","The globally selected pay group that controls which run Analytics reads."],
  ["Period selector","The month selected on the board; August 2026 in this guide."],
  ["Total people cost / CTC","The total people cost shown for the selected scope."],
  ["Cost per head","The board’s per-person cost metric; the executive KPI is EGP 14,378.52 in this view."],
  ["Cash to disburse","The board’s combined Net and Statutory amount — EGP 230K in this view."],
  ["Cost-driver bridge","The period-over-period bridge from prior cost to current cost."],
  ["Gross → Net","The waterfall that resolves gross through reductions to net payable."],
  ["Payroll leakage","The board’s leakage metric; 0 here because the run had no off-cycle or retro adjustments."],
],C.teal));

push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can set the Analytics scope, read and reconcile the executive board, open Employee breakdown, and export the current view independently."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role","Payroll Admin / Finance"],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-ANALYTICS_Payroll_Analytics_KUT.docx")); console.log("docx written"); })();
