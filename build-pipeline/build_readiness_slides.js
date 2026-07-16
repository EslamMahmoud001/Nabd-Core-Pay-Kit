const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/rdy_shots",f);
const meta={ bpId:"BP-03", title:"Payroll Readiness & Opening a Cycle", module:"Nabd Pay", version:"1.0", status:"Draft", date:"July 2026" };
const outcomes=[
  "Open the current pay period for a calendar from the Control Center.",
  "Read the Pre-Cycle Health summary — blockers, warnings, checks passed, records affected.",
  "Work through each gate group and understand what every check means.",
  "Clear a blocker using its View list and Fix actions, and know when the run can start."];
const rolesTbl={head:["Role","Responsibility"],rows:[
  ["Payroll Administrator","Opens the cycle, reviews Pre-Cycle Health, and clears each blocker before the run."],
  ["Configuration Admin","Fixes config-side blockers — activate the country pack, assign the statutory bases."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Pay cycle","One numbered period (e.g. 08.2026) a run executes against; opened from Control Center."],
  ["Pre-Cycle Health","The Readiness dashboard — the pre-run checks that gate a run."],
  ["Blocker / Warning","A blocker stops the run until cleared; a warning is advisory."],
  ["Statutory basis","The pay total a statutory calc reads — tax base, SI base, or EoS base."],
  ["In scope","The employees frozen into a cycle when it opens."]]};
const troubleTbl={head:["Blocker","What it means","How to clear it"],rows:[
  ["Country pack activated","No active statutory pack — amounts can’t compute.","Activate the country pack for the calendar’s country."],
  ["Earning assigned","No earning — those employees would be paid zero.","Activate an earning Pay Item; give employees an earning."],
  ["Tax / SI / EoS basis","No pay tagged as that statutory base.","Set the bucket flags on the relevant Pay Items."]]};
const validation=[
  "A cycle is open — the period shows OPEN with a Run payroll action.",
  "No blockers remain — the verdict reads Ready.",
  "Any remaining amber warnings are understood and accepted.",
  "The Open run wizard button is active."];
const tips=[
  {kind:"best",text:"BEST PRACTICE — Clear blockers top-down: Setup & period → Pay setup → Employee data; earlier fixes often clear later ones."},
  {kind:"tip",text:"TIP — Use each blocker’s View list to see exactly which employees/objects are affected before fixing."},
  {kind:"note",text:"NOTE — Warnings never block a run, but review them before committing an actual run."}];
const STEPS=[
  {tag:"Task 1 — Open the cycle",role:"Payroll Administrator",n:1,action:"Open the Payroll Control Center.",nav:"Nabd Pay › Control Center",expected:"Each calendar with its status counters; a calendar with no open period shows an Open <period> button.",img:"01-control-center.png",cap:"The Payroll Control Center."},
  {tag:"Task 1 — Open the cycle",role:"Payroll Administrator",n:2,action:"Open the current period for your calendar.",nav:"Control Center › Egypt Monthly › Open 08.2026",expected:"“Cycle opened”; the period shows OPEN with a Run payroll action and the header switches to OPEN.",img:"02-control-center-expanded.png",cap:"The period open — ready to assess and run."},
  {tag:"Task 2 — Pre-Cycle Health",role:"Payroll Administrator",n:1,action:"Open the Readiness dashboard.",nav:"Nabd Pay › Readiness",expected:"The verdict (e.g. “Not ready — 7 blockers”) and four counters: Blockers, Warnings, Checks passed, Records affected.",img:"03-readiness-overview.png",cap:"Pre-Cycle Health — verdict and counters."},
  {tag:"Task 2 — Pre-Cycle Health",role:"Payroll Administrator",n:2,action:"Work down the gate groups and read each check.",nav:"Readiness › gate groups",expected:"Setup & period, Pay setup, Employee data, Pay-out & approvals — each check a tick, blocker, or warning, with View list / Fix.",img:"04-readiness-gates.png",cap:"The gate groups — checks with View list / Fix."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who does this","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[3.6,8.93],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Open the cycle & clear readiness","From an open period to a runnable Pre-Cycle Health");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"Clearing blockers","Common Blockers & How to Clear",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Blockers");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join("screenshots/rdy_shots","BP-03_Payroll_Readiness_and_Opening_a_Cycle_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
