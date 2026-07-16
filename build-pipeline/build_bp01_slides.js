const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/bp01_shots",f);
const meta={ bpId:"BP-01", title:"Core Integration Configuration", module:"Nabd Core",
  version:"2.0", status:"Draft", date:"July 2026" };

const outcomes=[
  "Point Nabd at your SuccessFactors and S/4HANA Cloud tenants and confirm each connection is open.",
  "Choose which categories of employee data are brought into Nabd (data scope).",
  "Set when each data stream syncs on its own schedule.",
  "Run the first sync and confirm employees and reference data have loaded."];
const rolesTbl={head:["Role","Responsibility in this process"],rows:[
  ["Integration Administrator","Sets up and repoints the SF and S/4HANA Cloud connections, chooses data scope, edits schedules. Only this role changes connection identity."],
  ["Consultant","Can run a sync on demand and view stream health, but cannot change connection identity or tuning."]]};
const overviewTbl={head:["Stage","What you do","Where"],rows:[
  ["1 · Connect","Register the BTP destination + identity for each system, then test the pipe.","Settings › Connection"],
  ["2 · Scope","Choose which employee-data categories to bring in, and your operating countries.","Settings › Advanced"],
  ["3 · Schedule","Set how often each stream syncs.","Settings › Schedule"],
  ["4 · Load & verify","Run the first sync and confirm the data landed.","Hub / Data Streams"]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["Connection test fails immediately","BTP destination name mistyped / wrong case.","Re-enter the BTP Destination Name exactly as in BTP (case-sensitive)."],
  ["S/4 test shows an SF error page","Destination points at the SF tenant, not S/4.","Update the BTP destination to the S/4 hostname and test again."],
  ["Employees synced but salary/bank empty","Compensation or Bank accounts scope is off.","Switch it on in Advanced › Data scope, then re-sync."]]};
const glossary={head:["Term","Meaning"],rows:[
  ["BTP destination","A BTP connection profile holding the upstream address and credentials; Nabd refers to it by name."],
  ["Stream","One category of data that syncs on its own schedule — Employees, Leave, Foundation, balances, GL accounts."],
  ["Foundation","Reference catalogs from SF — companies, departments, job codes, locations, pay components."],
  ["Data scope","The employee-data categories you choose to bring into Nabd (Advanced page)."],
  ["Sync","A one-way pull from an upstream system into Nabd; Nabd never writes back."]]};
const validation=[
  "SuccessFactors and S/4HANA Cloud both read Connected; setup tests pass.",
  "Data scope categories in project scope are on; operating countries selected.",
  "Each stream shows a Next run; no stream is unintentionally paused.",
  "After the first load every stream is Healthy and the Employees head-count matches expectation."];
const tips=[
  {kind:"best",text:"BEST PRACTICE — Set data scope before the very first employee load; scope changes are not retroactive."},
  {kind:"tip",text:"TIP — Use Test connection as a quick pre-flight whenever a sync behaves oddly."},
  {kind:"note",text:"NOTE — Foundation reference data refreshes weekly; run the Foundation stream if a new company or job code is missing."}];

const STEPS=[
  {tag:"Task 1 — SuccessFactors connection",role:"Integration Administrator",n:1,action:"Open the Connection page.",nav:"Settings › Connection",expected:"A card for SuccessFactors and a card for S/4HANA Cloud.",img:"01-connection-page.png",cap:"The Connection page — one card per upstream system."},
  {tag:"Task 1 — SuccessFactors connection",role:"Integration Administrator",n:2,action:"Enter the BTP Destination Name and SF Company ID.",nav:"SF card › Set up / Edit configuration",expected:"Both fields accept your values; the destination name is case-sensitive.",img:"02-sf-setup-editor.png",cap:"The Edit SF connection editor."},
  {tag:"Task 1 — SuccessFactors connection",role:"Integration Administrator",n:3,action:"Choose Test connection to probe the pipe.",nav:"SF card › Test connection",expected:"Setup tests · 3/3 passing; the badge reads Connected.",img:"03-setup-tests-passing.png",cap:"Setup tests · 3/3 passing — verified end-to-end."},
  {tag:"Task 2 — S/4HANA Cloud connection",role:"Integration Administrator",n:1,action:"Set up the S/4HANA Cloud card, then Test connection.",nav:"Connection › S/4HANA Cloud › Set up › Test connection",expected:"The status reads Connected.",img:"04-s4-card.png",cap:"Both systems on the Connection page."},
  {tag:"Task 3 — Data scope",role:"Integration Administrator",n:1,action:"Switch each data category on/off in Data scope.",nav:"Settings › Advanced › Data scope",expected:"A category switched off is skipped on every sync.",img:"05-advanced-data-scope.png",cap:"The Advanced page — Data scope toggles."},
  {tag:"Task 4 — Sync schedules",role:"Integration Administrator",n:1,action:"Set a Frequency for each stream and Save.",nav:"Settings › Schedule",expected:"The expression preview and Next badge update; “Schedule saved.”",img:"06-sync-schedule.png",cap:"The Schedule page — per-stream cards."},
  {tag:"Task 5 — First sync & load",role:"Integration Administrator / Consultant",n:1,action:"Run the sync, then confirm Employees loaded.",nav:"Hub › Sync all now → Data Streams › Employees",expected:"Employees is Healthy; head-count matches; 0 errored.",img:"07-stream-employees.png",cap:"Employees stream — 82 active persons, Healthy."},
  {tag:"Task 6 — Manage a stream",role:"Integration Administrator",n:1,action:"Use the Actions tab to run or repair a stream.",nav:"Data Streams › Employees › Actions",expected:"Run sync now, Re-initialize from scratch, and Rewind pointer are available.",img:"08-stream-actions.png",cap:"The Employees stream Actions tab."},
];

(async()=>{
  const pptx=new PptxGenJS();
  pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"The big picture","Process Overview",overviewTbl.head,overviewTbl.rows,eq(3),S.C.navy,meta.bpId+"  ·  Overview");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[3.4,9.53-0.0],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Step-by-Step Configuration","The actions each role performs, in order");
  let lastTag="";
  STEPS.forEach(st=>{
    S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()});
  });
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossary.head,glossary.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join("screenshots/bp01_shots","BP-01_Core_Integration_Configuration_KUT.pptx")});
  console.log("wrote deck; step slides:",STEPS.length);
})();
