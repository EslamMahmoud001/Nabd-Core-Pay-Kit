// build_bp18_slides.js — BP-18 End-of-Service & Leave Provisioning (deck)
// Modelled on build_bp13_slides.js and build_bp09_slides.js.
// Screenshots: screenshots/bp18_real (7 real PNGs, 0 duplicate md5s).
const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/bp18_real",f);
const OUT="screenshots/bp18_real";
const meta={ bpId:"BP-18", title:"End-of-Service & Leave Provisioning", module:"Nabd Pay",
  version:"1.1", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
const outcomes=[
  "Find the Egypt End-of-Service and Leave Provision schemes in Scheme Studio.",
  "Read the EoS identity, base, bracket table, output pay item and population.",
  "Distinguish EoS read-only forking from the leave scheme’s two-field limited edit.",
  "Confirm which replicated SuccessFactors leave balance the leave scheme reads.",
  "Verify the employee’s END-OF-SERVICE BASE in Results Breakdown."];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Admin / Tenant Admin","Review the statutory schemes; fork EoS; edit only the two permitted leave fields in place."],
  ["Payroll Officer / Payroll Admin","Select the run and employee; verify the values in Results Breakdown."],
  ["HR / SuccessFactors data owner","Ensure employee leave balances are replicated for the configured Time Type."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Statutory scheme","A country-pack scheme; both Egypt provisioning schemes are statutory."],
  ["Fork to edit","Create an editable version without changing the statutory original."],
  ["Limited in-place edit","Only Annual-leave Time Type and Over-take policy can change on the leave scheme."],
  ["Valuation basis","The EoS base reference; read END-OF-SERVICE BASE in Verification."],
  ["Dry run","A side-effect-free calculation that does not post to the accruals ledger."]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["EoS fields cannot be edited","The statutory EoS scheme is read-only.","Use Fork to edit for an approved change."],
  ["Most leave fields are locked","Only two fields allow limited in-place edit.","Edit Time Type / Over-take policy only; fork for anything else."],
  ["Leave balance cannot be read","The balance is not replicated or the Time Type is not the intended one.","Confirm SF replication and the Annual-leave Time Type."],
  ["Ledger empty after dry run","Dry runs have no side effects.","Use an actual payroll run for posting."],
  ["Provision lines absent","Breakdown hides informational lines.","Use Verification to check the bases."]]};
const validation=[
  "EoS is statutory and read-only; the action is Fork to edit.",
  "eos.egypt uses valuation_basis, egypt_eos_2026, egypt_eos_payout and All employees.",
  "Leave Provision permits only Time Type and Over-take policy to be edited in place.",
  "Annual-leave Time Type is EG_1000 : Annual Leave; balances come from SuccessFactors.",
  "For employee 10301, END-OF-SERVICE BASE is 10,000.00.",
  "A dry run posts nothing to the accruals ledger and Breakdown hides provision lines."];
const tips=[
  {kind:"tip",text:"TIP — Use the kind filter chips to reach each Egypt provisioning scheme quickly."},
  {kind:"best",text:"BEST PRACTICE — Record an approved decision before forking or changing a limited-edit field."},
  {kind:"note",text:"NOTE — Provision amounts post only in an actual payroll run. A dry run leaves the ledger empty, and Breakdown intentionally hides informational provision lines; the finalised-cycle ledger view is documented separately."}];
const STEPS=[
  {tag:"Config — Scheme Studio",role:"Payroll Admin / Tenant Admin",n:1,action:"Open Scheme Studio.",nav:"Configuration › Scheme Studio",expected:"The studio lists 6 schemes, kind filter chips and New scheme.",img:"01-scheme-studio.png",cap:"Scheme Studio — 6 schemes."},
  {tag:"Config — End of Service",role:"Payroll Admin / Tenant Admin",n:2,action:"Filter to End of service.",nav:"Scheme Studio › End of service",expected:"End of service (1) shows the Egypt End-of-Service scheme card.",img:"02-filter-end-of-service.png",cap:"The filtered EoS scheme."},
  {tag:"Config — End of Service",role:"Payroll Admin / Tenant Admin",n:3,action:"Open and review the EoS scheme.",nav:"End of service › Egypt End-of-Service",expected:"Confirm eos.egypt, Egypt, Jan 1 2026, valuation_basis, egypt_eos_2026, egypt_eos_payout and All employees. It is read-only: Fork to edit.",img:"03-eos-scheme-view.png",cap:"Statutory EoS — managed by Nabd."},
  {tag:"Config — Leave Provision",role:"Payroll Admin / Tenant Admin",n:1,action:"Filter to Leave provision.",nav:"Scheme Studio › Leave provision",expected:"Leave provision (1) shows the Egypt Leave Provision scheme card.",img:"04-filter-leave-provision.png",cap:"The filtered Leave Provision scheme."},
  {tag:"Config — Leave Provision",role:"Payroll Admin / Tenant Admin",n:2,action:"Open and review the limited-edit fields.",nav:"Leave provision › Egypt Leave Provision",expected:"Only Annual-leave Time Type and Over-take policy are editable. Confirm EG_1000 : Annual Leave; fork for every other change.",img:"05-leave-provision-limited-edit.png",cap:"Leave Provision — limited edit."},
  {tag:"Task 1 — Select result",role:"Payroll Officer / Payroll Admin",n:1,action:"Open Results Explorer and select employee 10301.",nav:"Payroll › Results › Egypt Monthly · August 2026",expected:"The employee list is available; select Ahmed Mohamed Hassan for verification.",img:"06-run-results.png",cap:"Results Explorer — August 2026."},
  {tag:"Task 2 — Verify inputs",role:"Payroll Officer / Payroll Admin",n:1,action:"Open Breakdown and read Verification.",nav:"Results › 10301 › Breakdown",expected:"Gross 10,000.00; deductions 816.46; net 9,183.54; taxable gross 9,995.00; SI base 10,000.00; EoS base 10,000.00. EoS uses the EoS base. The provision amounts are on the Accruals ledger, not here.",img:"07-provision-breakdown.png",cap:"Verification exposes the EoS base."},
  {tag:"Task 3 — Accrual ledger",role:"Payroll Officer / Payroll Admin · Finance",n:1,action:"Open employee 10301 and the Accruals tab.",nav:"Employees › 10301 › Accruals",expected:"The employee record opens on Overview; the Accruals tab holds the End-of-Service and Leave Provision ledger.",img:"08-employee-detail.png",cap:"The employee record — Accruals tab."},
  {tag:"Task 3 — Accrual ledger",role:"Payroll Officer / Payroll Admin · Finance",n:2,action:"Read the accrued balances and ledger history.",nav:"Accruals",expected:"Egypt End-of-Service EGP 833.33 and Egypt Annual-Leave Provision EGP 2,333.33 (Aug 1, 2026). Ledger history: one Accrual per scheme against egypt_monthly:2026P08. Leave-year carry: 14.00 days on EG_1000, Open. Run totals: EoS 14,500.00, Leave 36,016.66.",img:"09-accruals-ledger.png",cap:"The Accruals ledger — provisions with history."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Configure & Verify Provisioning","statutory schemes · employee inputs · run scope");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-18_EoS_and_Leave_Provisioning_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
