const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/bp02_shots",f);
const meta={ bpId:"BP-02", title:"Employee Master Data Foundation", module:"Nabd Core", version:"2.0", status:"Draft", date:"July 2026" };
const outcomes=[
  "Understand what the employee master data and Foundation catalog contain, and how they fit together.",
  "Find any employee and open their full record in the Data Browser.",
  "Read a person’s effective-dated job and compensation history correctly.",
  "Browse the Foundation reference catalog — companies, departments, job codes and more.",
  "Know what your role is allowed to see, and why some fields are masked."];
const rolesTbl={head:["Role","What they see"],rows:[
  ["Integration Administrator","The full record including sensitive fields — salary, national ID, bank details."],
  ["Consultant","The same records and structure, but with sensitive fields masked."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["personIdExternal","The stable employee key that survives rehires; the identifier Nabd uses everywhere."],
  ["Effective dating","Job/pay kept as dated slices; the open slice (Effective to = Current) applies today."],
  ["Foundation","SF reference catalogs — companies, departments, job codes, locations, pay components."],
  ["Sensitivity tier","The rule that decides which roles may see salary, national ID or bank details."],
  ["Raw snapshot","The unmodified record SF sent on a sync, kept to confirm the source of any value."]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["The People list is empty","The employee sync hasn’t landed data.","Run the Employees stream (BP-01) and confirm Healthy on the Hub."],
  ["A Foundation table shows “No rows”","The Foundation sync hasn’t populated it.","Run the Foundation stream, then reopen the table."],
  ["Salary / national ID masked","Your role doesn’t hold the tier.","By design — a role with the matching tier sees the raw value."]]};
const validation=[
  "Employees are present — the People list shows the expected head-count.",
  "A record is complete — identity is populated and there is a current job slice tagged Current.",
  "Compensation and pay-component rows appear (masked per role).",
  "Foundation tables (Job Codes, Companies, Departments) have rows.",
  "Masking behaves — sensitive fields are visible only to roles that hold the tier."];
const tips=[
  {kind:"best",text:"BEST PRACTICE — Refer to people by personIdExternal; it’s stable across rehires."},
  {kind:"tip",text:"TIP — The slice tagged Current is what applies today; older slices are history."},
  {kind:"note",text:"NOTE — The Data Browser is read-only; correct data in SuccessFactors and re-sync."}];
const STEPS=[
  {tag:"Task 1 — Find a person",role:"Integration Administrator / Consultant",n:1,action:"Open the Data Browser.",nav:"Nabd Core › Operations › Data Browser",expected:"Category rail, employee list, and a detail pane — People selected, a person’s Overview shown.",img:"01-overview.png",cap:"The Data Browser — an employee’s Overview."},
  {tag:"Task 2 — Read the record",role:"Integration Administrator / Consultant",n:1,action:"Open the Job history tab.",nav:"person › Job history",expected:"One effective-dated slice per change; the open slice is tagged Current.",img:"02-job-history.png",cap:"Job history — the open slice is tagged Current."},
  {tag:"Task 2 — Read the record",role:"Integration Administrator / Consultant",n:2,action:"Open the Compensation tab.",nav:"person › Compensation",expected:"The salary summary (masked unless your role may see compensation).",img:"03-compensation.png",cap:"Compensation — salary summary (per role)."},
  {tag:"Task 2 — Read the record",role:"Integration Administrator / Consultant",n:3,action:"Open Pay components.",nav:"person › Pay components",expected:"The recurring pay lines (base, housing, transport), per effective slice.",img:"04-pay-components.png",cap:"Pay components — recurring pay lines."},
  {tag:"Task 2 — Read the record",role:"Integration Administrator / Consultant",n:4,action:"Open the Personal tab.",nav:"person › Personal",expected:"Contacts, addresses and identity documents (identity fields masked per role).",img:"05-personal.png",cap:"Personal — contacts and identity documents."},
  {tag:"Task 3 — Foundation catalog",role:"Integration Administrator / Consultant",n:1,action:"Switch to the Foundation category.",nav:"Data Browser › Foundation",expected:"A list of Foundation tables — Companies, Departments, Job Codes, Locations.",img:"06-foundation-tables.png",cap:"The Foundation category — reference tables."},
  {tag:"Task 3 — Foundation catalog",role:"Integration Administrator / Consultant",n:2,action:"Open the Job Codes table and filter.",nav:"Foundation › Job Codes",expected:"A grid of code, name and status with a row count; filters as you type.",img:"07-foundation-jobcodes.png",cap:"The Foundation catalog — Job Codes table."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[3.4,9.13],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Using the Data Browser","Find, read and verify a person’s record");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join("screenshots/bp02_shots","BP-02_Employee_Master_Data_Foundation_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
