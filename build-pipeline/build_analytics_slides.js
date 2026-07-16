// build_analytics_slides.js — BP-ANALYTICS Payroll Analytics — Executive Cost Board (deck)
// Modelled on build_bp13_slides.js. Screenshots: screenshots/analytics_real (4 real, 0 dup md5s).
const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/analytics_real",f);
const OUT="screenshots/analytics_real";
const meta={ bpId:"BP-ANALYTICS", title:"Payroll Analytics — Executive Cost Board", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
const role="Payroll Admin / Finance — reads the board";
const outcomes=[
  "Select the pay group and period whose completed run you want to read.",
  "Interpret the executive KPI tiles and reconcile Headcount 16 and Net EGP 163.1K.",
  "Read Cost composition and the period-over-period cost-driver bridge.",
  "Read the Gross → Net waterfall and the 12-month cost trend.",
  "Open Employee breakdown and recognise the four detail tabs.",
  "Use Export CSV to export the current view."];
const processInfo=[
  ["Trigger","A completed payroll run is available for executive review."],
  ["Scope","Global pay group E1 · Period August 2026."],
  ["Role","Payroll Admin / Finance — reads the board."],
  ["Input","The completed run’s stored results."],
  ["Board","KPIs · composition · bridge · Gross → Net · trend · detail."],
  ["Output","An executive read of the current view, with optional CSV export."]];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Admin / Finance","Select the pay group and period; read and reconcile each board zone; open the required detail tab; export the current view when needed."]
]};
const concepts=[
  "Read-only and run-backed — Analytics summarises a completed run’s stored results; it computes no payroll.",
  "Scope — the globally selected pay group plus the Period selector; this guide uses E1 and August 2026.",
  "KPI tiles — Total people cost, Headcount, Cost per head, Cash to disburse, and Payroll leakage.",
  "Chart zones — Cost composition, the period-over-period cost-driver bridge, Gross → Net, and the 12-month cost trend.",
  "Detail tabs — Employee breakdown, Component analysis, Retro register, and Run history.",
  "Independent loading — each board zone loads independently.",
  "Clean baseline — Payroll leakage 0 and Retro 0 mean this run had no off-cycle or retro adjustments."];
const troubleTbl={head:["Symptom","What it means","What to do"],rows:[
  ["The board looks empty","Analytics follows the globally selected pay group.","Switch to the pay group whose run you want; here, select E1."],
  ["Figures are for another period","The Period selector is not August 2026.","Choose August 2026."],
  ["Headcount or net differs","The board may not be on the intended scope.","Confirm E1 and August 2026; reconcile Headcount 16 and Net EGP 163.1K."],
  ["Leakage or Retro is 0","This run had no off-cycle or retro adjustments.","Treat 0 as the expected clean baseline for this run."]
]};
const validation=[
  "The global pay group is E1, the period is August 2026, and the selected run is CLOSED.",
  "Headcount is 16 and Employee breakdown shows 16 results on page 1/1.",
  "YTD net and the Gross → Net waterfall reconcile to the run at EGP 163.1K.",
  "Total people cost and YTD cost are EGP 230.1K.",
  "Cash to disburse is EGP 230K: Net EGP 163.1K + Statutory EGP 66.8K.",
  "Payroll leakage is EGP 0 and Retro is 0 — no off-cycle or retro adjustments."];
const tips=[
  {kind:"tip",text:"TIP — Set the global pay group first, then the period. An empty board usually means the wrong pay group is selected."},
  {kind:"best",text:"BEST PRACTICE — Reconcile Headcount 16 and Net EGP 163.1K before using the board for executive review."},
  {kind:"note",text:"NOTE — Each KPI, chart, and detail zone loads independently for the same selected scope."}];
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Executive payroll board","The read-only Analytics view over a completed run’s stored results."],
  ["Pay-group scope","The globally selected pay group that controls which run Analytics reads."],
  ["Period selector","The month selected on the board; August 2026 here."],
  ["Total people cost / CTC","The total people cost shown for the selected scope."],
  ["Cash to disburse","Net plus Statutory — EGP 230K in this view."],
  ["Cost-driver bridge","The period-over-period movement from prior cost to current cost."],
  ["Gross → Net","The waterfall from gross through reductions to net payable."],
  ["Payroll leakage","The board’s leakage metric; 0 here because there were no off-cycle or retro adjustments."]
]};
const exportTask=[
  "Confirm the globally selected pay group is E1.",
  "Confirm the Period selector is August 2026.",
  "Select Export CSV to export the current view."];
const STEPS=[
  {tag:"Tasks 1–2 — Scope & KPIs",role,n:1,action:"Open Analytics, select E1 and August 2026, then read the KPI tiles.",nav:"Insights › Analytics  ·  Global pay group: E1  ·  Period: August 2026",expected:"First recorded payroll · +EGP 230.1K · 16 hires. CTC EGP 230.1K; Headcount 16; Cost/head EGP 14,378.52; Cash EGP 230K; Leakage EGP 0.",note:"YTD cost EGP 230.1K; YTD net EGP 163.1K. Cash = Net EGP 163.1K + Statutory EGP 66.8K.",img:"01-analytics-e1-august-2026-kpis.png",cap:"E1 · August 2026 — the anchor KPI view."},
  {tag:"Task 3 — Composition & bridge",role,n:1,action:"Read Cost composition, then follow the driver bridge.",nav:"Analytics › Cost composition  ·  Why cost changed vs Jul 26",expected:"Employer cost (SI + EoS) EGP 30,056 = 100.0% of the composition shown; EGP 1,878.52 per head across 16. New hires +EGP 230.1K → Current cost EGP 230.1K.",img:"02-cost-composition-and-driver-bridge-populated-populated.png",cap:"Cost composition and the period-over-period driver bridge."},
  {tag:"Task 4 — Gross → Net & trend",role,n:1,action:"Follow the waterfall, then read the trend legend.",nav:"Analytics › Gross → Net  ·  Cost trend",expected:"Gross EGP 200.0K → reductions of EGP 19,117.17, EGP 17,633 and EGP 100 → Net EGP 163.1K. Trend: 12-month CTC, net, and cost per head.",img:"03-gross-to-net-and-cost-trend-populated-populated.png",cap:"Gross → Net waterfall and 12-month cost trend."},
  {tag:"Task 5 — Employee breakdown",role,n:1,action:"Open Employee breakdown and read the 16 rows.",nav:"Analytics › Employee breakdown",expected:"16 results · page 1/1. Columns: Name, ID, Entity, Gross, Deductions, Net, vs Prior, Exceptions. Other tabs: Component analysis, Retro register, Run history.",img:"04-employee-breakdown-16-results.png",cap:"Employee breakdown — 16 results on page 1/1."}
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"Why this matters","Purpose & Learning Outcomes",outcomes,meta.bpId+"  ·  Purpose");
  S.infoGridSlide(pptx,meta,"Process at a Glance",processInfo,meta.bpId+"  ·  At a glance");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[3.2,9.13],S.C.magenta,meta.bpId+"  ·  Roles");
  S.bulletsSlide(pptx,meta,"How the board works","Key Concepts",concepts,meta.bpId+"  ·  Key concepts");
  S.sectionDivider(pptx,"Section","Read the executive cost board","Set scope · read KPIs · explain movement · inspect detail · export");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,note:st.note,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"PERFORMED BY · "+role,"Task 6 — Export CSV",exportTask,meta.bpId+"  ·  Task 6");
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-ANALYTICS_Payroll_Analytics_KUT.pptx")});
  console.log("deck: "+STEPS.length+" screenshot step slides");
})();
