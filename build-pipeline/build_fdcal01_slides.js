const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/fdcal01_real",f);
const meta={ bpId:"FD-CAL-01", title:"Pay Calendars & Cycles", module:"Nabd Pay", version:"2.0", status:"Draft", date:"July 2026" };
const outcomes=[
  "Create a Pay Calendar through the 5-step wizard and bind it to a pay group.",
  "Set the period-generation rule — frequency, anchor, cutoff and pay-date offsets, working week.",
  "Set the retro window and rounding policy a run inherits.",
  "Review every value before saving, and manage a calendar afterwards (version history, duplicate, archive)."];
const rolesTbl={head:["Role","What they can do"],rows:[
  ["Payroll Admin / Tenant Admin","Create, edit, duplicate, archive and delete calendars; change the rule or policy."],
  ["Payroll Manager","View the list and version history only — cannot create, edit, duplicate, archive or delete."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Calendar","The rule — frequency, anchor, offsets, naming — that generates a pay group’s periods."],
  ["Cycle","One numbered period stamped from a calendar (e.g. 07.2026), with its own lifecycle."],
  ["Period anchor","Where a period starts; shape depends on frequency (day-of-month, weekday, date, month+day)."],
  ["Offset","A signed number of days from the period’s END — used for the cutoff and pay dates."],
  ["Config pinning","A cycle pins the calendar version it opened against, so later edits can’t change it."]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["“Next” blocked with a field error","A required field is empty or out of range.","Fix the highlighted field; offsets must be −60…60, anchor range-checked per frequency."],
  ["Effective-from rejected","The date is earlier than the current version (a back-date).","Use the current date to correct in place, or a later date to open a new version."],
  ["Delete is disabled","The calendar has a committed/closed cycle or posted results.","Use Archive instead — it preserves history."]]};
const validation=[
  "Identity complete — Key, Display name, Country and Effective from set.",
  "Rule valid — frequency + anchor set; both offsets whole numbers −60…60.",
  "A pay group is bound on the Regional step.",
  "Policy set — retro window 0–60 months, rounding and decimals chosen.",
  "Saved & listed — the calendar appears with its country, frequency and offsets."];
const tips=[
  {kind:"tip",text:"TIP — Use Duplicate to create a similar calendar fast; it only asks for a new unique Key."},
  {kind:"best",text:"BEST PRACTICE — Offsets are signed days from the period END: negative cutoff freezes data early, negative pay-date pays early."},
  {kind:"note",text:"NOTE — One backend generator drives the preview and real cycles, so the preview is exactly what a cycle opens with."}];
const STEPS=[
  {tag:"Task 1 — The list",role:"Payroll Admin / Tenant Admin",n:1,action:"Open the Pay Calendars list.",nav:"Configuration › Cycles › Calendars",expected:"Every calendar with its country, frequency, offsets, working week and retro window; search + per-row actions.",img:"01-calendar-list.png",cap:"The Pay Calendars list."},
  {tag:"Task 2 — Create a calendar",role:"Payroll Admin / Tenant Admin",n:1,action:"Fill Step 1 — Identity.",nav:"New calendar › Key, Display name, Country, Effective from",expected:"A short lowercase Key (locked after creation), display name, country and effective-from date.",img:"02-step1-identity.png",cap:"Step 1 — Identity."},
  {tag:"Task 2 — Create a calendar",role:"Payroll Admin / Tenant Admin",n:2,action:"Set Step 2 — Period generation.",nav:"Step 2 › Frequency, anchor, offsets, working week",expected:"The rule; the anchor changes shape by frequency; offsets are signed days from period end; live preview.",img:"03-step2-period-generation.png",cap:"Step 2 — Period generation."},
  {tag:"Task 2 — Create a calendar",role:"Payroll Admin / Tenant Admin",n:3,action:"Bind the pay group — Step 3 Regional.",nav:"Step 3 › Employee pay group",expected:"Every employee whose SF pay group matches lands on this calendar. Binding is singular.",img:"04-step3-regional.png",cap:"Step 3 — Regional (pay-group binding)."},
  {tag:"Task 2 — Create a calendar",role:"Payroll Admin / Tenant Admin",n:4,action:"Set the policy — Step 4.",nav:"Step 4 › Retro window, rounding, decimals, lock closed",expected:"Retro window, rounding rule, decimal places, closed-period lock — sensible defaults pre-filled.",img:"05-step4-policy.png",cap:"Step 4 — Policy."},
  {tag:"Task 2 — Create a calendar",role:"Payroll Admin / Tenant Admin",n:5,action:"Review every value, then Save.",nav:"Step 5 › Review › Save calendar",expected:"Every value grouped by step with Edit links. Save writes the calendar and its policy together.",img:"06-step5-review.png",cap:"Step 5 — Review & Save."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[3.6,8.93],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Create a Pay Calendar","The 5-step wizard, step by step");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join("screenshots/fdcal01_real","FD-CAL-01_Pay_Calendars_and_Cycles_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
