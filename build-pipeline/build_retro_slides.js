// build_retro_slides.js — BP-RETRO Retroactive Payroll — Back-Dated Change Triggers (deck)
// Modelled on build_bp13_slides.js. Screenshots: screenshots/retro_real (6 real PNGs, 0 duplicate md5s).
const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/retro_real",f);
const OUT="screenshots/retro_real";
const meta={ bpId:"BP-RETRO", title:"Retroactive Payroll — Back-Dated Change Triggers", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
const purpose=[
  "Recognize a retro trigger as a back-dated change covering an already-processed period.",
  "Read the Retro Adjustments dashboard and the pending trigger cards.",
  "Inspect a trigger's machine-readable technical payload.",
  "Review the Pending approvals gate and the Resolved audit trail.",
  "Raise and preview a manual trigger for a correction the auto detector did not catch."
];
const processInfo=[
  ["Back-dated change","A change covers an already-processed period."],
  ["Trigger","AUTO detector or MANUAL operator records the change as a retro trigger."],
  ["Next-cycle recompute","The retro delta is recomputed for the next regular payroll cycle."],
  ["Approval gate","A delta above the policy threshold requires approval before the affected cycle can close."],
  ["Settlement","The delta is settled on the next regular payroll cycle."],
  ["Audit trail","Approved and dismissed items move to Resolved with note, actor, and time."]
];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Admin","Review pending triggers and technical detail, review Resolved, and raise manual triggers for corrections the detector did not catch."],
  ["Approver","Review retro deltas above the policy threshold and approve or dismiss each row before the affected cycle can close."]
]};
const concepts=[
  "Retro trigger — Nabd's record for a back-dated change covering an already-processed period.",
  "AUTO — the retro detector polls synced Core pay components, compensation, job, leave, and termination data for back-dated changes.",
  "MANUAL — a Payroll Admin records a correction the detector did not catch; Notes are mandatory.",
  "Effective from — the past date from which the change applies.",
  "Next-cycle settlement — the delta is recomputed and settled on the next regular payroll cycle.",
  "Approval gate — a threshold-exceeding delta must be approved before its cycle can close.",
  "Audit trail — Resolved retains approved and dismissed items with note, actor, and time."
];
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Retro","A back-dated change covering an already-processed period."],
  ["Retro trigger","Nabd's record that flags the change for recomputation and next-cycle settlement."],
  ["AUTO","A trigger created by the detector from a back-dated change in synced Core data."],
  ["MANUAL","A trigger raised by an operator for a correction the detector did not catch."],
  ["Effective from","The past date from which the back-dated change applies."],
  ["Approval gate","Approval required for a threshold-exceeding retro delta before cycle close."],
  ["Resolved","The audit trail for approved and dismissed items, including note, actor, and time."]
]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["Preview is not ready","A required scope, employee selection, past date, or Notes value is incomplete.","Complete the required fields, then preview again."],
  ["Preview count is not intended","The selected scope does not resolve to the intended employees.","Select Back, correct the scope or employees, and preview again."],
  ["No retro approvals pending","The approval tab is currently empty.","No action is required; threshold-exceeding deltas appear here when gated."],
  ["Nothing resolved yet","No approved or dismissed item is in the audit trail yet.","Review the tab again after an item is approved or dismissed."],
  ["Auto detector missed a correction","The change was not captured by the automatic polling path.","Use New trigger and enter mandatory Notes for the audit trail."],
  ["Need the trigger's source record","The card summary is not the technical payload.","Expand Technical detail on that trigger."]
]};
const validation=[
  "Dashboard: 2 pending triggers affecting 2 employees; 0 pending approvals; 0 resolved.",
  "Tarek Hassan Fouad (10402) and Laila Refaat Hosny (10404) are Manual, Pending, Manual correction triggers effective from Jul 1, 2026.",
  "Technical detail expands beneath the selected trigger and displays its machine-readable payload.",
  "Pending approvals and Resolved show their stated empty states in this example.",
  "The manual form has a selected scope, one employee, a past effective-from date, mandatory Notes, and Preview enabled.",
  "Preview shows 1 trigger, employee 10402, Effective from 2026-07-01, and the entered Notes.",
  "The retro delta is recomputed and settled on the next regular payroll cycle."
];
const tips=[
  {kind:"tip",text:"TIP — Use MANUAL for a correction the AUTO detector did not catch."},
  {kind:"best",text:"BEST PRACTICE — Read the preview count, sample employee, effective-from date, and Notes before creating."},
  {kind:"note",text:"NOTE — Notes are mandatory for the audit trail; threshold-exceeding deltas gate cycle closure until approved or dismissed."}
];
const STEPS=[
  {tag:"Task 1 — Read the dashboard",role:"PERFORMED BY · Payroll Admin",n:1,action:"Open Retro Adjustments and review Pending triggers.",nav:"Operations › Retro Adjustments",expected:"2 pending triggers affect 2 employees; approvals and resolved are 0. Tarek 10402 and Laila 10404 are Manual, Pending, Manual correction triggers.",img:"01-retro-dashboard-pending-triggers.png",cap:"Retro Adjustments — the anchor dashboard."},
  {tag:"Task 2 — Inspect technical detail",role:"PERFORMED BY · Payroll Admin",n:1,action:"Expand Tarek Hassan Fouad's Technical detail.",nav:"Pending triggers › Tarek Hassan Fouad (10402) › Technical detail",expected:"The area expands beneath the card and displays the machine-readable payload recorded behind the trigger.",img:"02-tarek-10402-technical-detail.png",cap:"Tarek Hassan Fouad (10402) — Technical detail expanded."},
  {tag:"Task 3 — Review the approval gate",role:"PERFORMED BY · Approver",n:1,action:"Open Pending approvals.",nav:"Retro Adjustments › Pending approvals",expected:"“No retro approvals pending.” Deltas above the policy threshold appear here and block cycle close until approved or dismissed.",img:"03-retro-pending-approvals.png",cap:"Pending approvals — the gate is currently empty."},
  {tag:"Task 4 — Review the audit trail",role:"PERFORMED BY · Payroll Admin",n:1,action:"Open Resolved.",nav:"Retro Adjustments › Resolved",expected:"“Nothing resolved yet.” Approved and dismissed items land here with audit note, actor, and time.",img:"04-retro-resolved.png",cap:"Resolved — no items have been resolved yet."},
  {tag:"Task 5 — Raise a manual trigger",role:"PERFORMED BY · Payroll Admin",n:1,action:"Select New trigger and complete the form.",nav:"Retro Adjustments › New trigger",expected:"Specific employees; Tarek Hassan Fouad selected; Effective from 07/01/2026; mandatory Notes entered; Preview enabled.",note:"Scope choices are Specific employees, All active employees, and Whole calendar.",img:"05-new-retro-form-valid-past-date.png",cap:"Manual trigger form — valid past date and audit Notes."},
  {tag:"Task 6 — Preview before creating",role:"PERFORMED BY · Payroll Admin",n:1,action:"Select Preview and verify the confirmation.",nav:"Create manual retro triggers › Preview",expected:"1 trigger; sample employee 10402; Effective from 2026-07-01; entered Notes; final Create trigger button.",img:"06-new-retro-preview-one-employee.png",cap:"Confirm the resolved scope before creation."}
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"Why this guide exists","Purpose",purpose,meta.bpId+"  ·  Purpose");
  S.infoGridSlide(pptx,meta,"Process at a Glance",processInfo,meta.bpId+"  ·  At a glance");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.bulletsSlide(pptx,meta,"What to understand","Key Concepts",concepts,meta.bpId+"  ·  Concepts");
  S.sectionDivider(pptx,"Section","Work with retro triggers","Dashboard · technical detail · approval gate · audit trail · manual creation");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,note:st.note,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"BP-RETRO_Retroactive_Payroll_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
