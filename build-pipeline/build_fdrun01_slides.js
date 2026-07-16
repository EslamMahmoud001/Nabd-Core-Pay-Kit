const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/fdrun01_real",f);
const OUT="screenshots/fdrun01_real";
const meta={ bpId:"FD-RUN-01", title:"Run Payroll — Dry Run", module:"Nabd Pay", version:"1.0", status:"Draft", date:"July 2026" };
const outcomes=[
  "Start a payroll run for an open cycle and choose the Dry-run mode.",
  "Set the run scope — pay period, whole population, or a targeted set of employees.",
  "Read the Pre-flight gate — which findings stop a run and which only advise.",
  "Simulate the calculation and read the Results summary — gross-to-net, amounts, exceptions.",
  "Open an individual payslip and its verification breakdown to confirm the figures."];
const rolesTbl={head:["Role","What they do"],rows:[
  ["Payroll Officer / Payroll Admin","Start the run, set scope, clear pre-flight, simulate, and inspect results and payslips."],
  ["Payroll Manager","Review the Results summary — gross-to-net, per-employee amounts and exceptions."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Dry run","Computes results without posting; status Computed; can be recomputed freely."],
  ["Actual run","Posts results and closes the cycle; same steps, but commits at the end."],
  ["Pre-flight","Checks before simulation — blockers stop the run, warnings only advise."],
  ["Gross-to-net","Gross minus deductions (tax + social insurance) equals net payable."],
  ["Breakdown","The engine’s working values (taxable gross, SI base, EoS base) behind a payslip."]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["Pre-flight “Cannot simulate”","One or more checks are blockers.","Resolve the blockers, or narrow scope to employees that pass, then return."],
  ["An employee computes to zero","No earning assigned, or bases not tagged.","Confirm an active earning and tagged statutory bases in Component Studio."],
  ["Totals look wrong","A rate or statutory base differs from expected.","Open the employee’s Breakdown and trace back to the pay item or rule."]]};
const validation=[
  "The run computed — appears as a Dry run with status Computed.",
  "Gross-to-net reconciles — gross − deductions = net payable.",
  "Exceptions read 0, or each is identified and understood.",
  "Per-employee amounts are sensible for each salary and scenario.",
  "A payslip and its breakdown verify the expected figures."];
const tips=[
  {kind:"tip",text:"TIP — A dry run is non-destructive; run it as often as you like. Re-running just recomputes."},
  {kind:"best",text:"BEST PRACTICE — Target a few employees to spot-check payslips before running the whole population."},
  {kind:"note",text:"NOTE — Export CSV from Review for offline checks; use Breakdown to confirm statutory bases behind net."}];
const STEPS=[
  {tag:"Task 1 — Scope",role:"Payroll Officer / Payroll Admin",n:1,action:"Start the run and choose Dry run.",nav:"Control Center › Run payroll › Step 1 Scope",expected:"Dry run selected; pay period confirmed; the pay group’s employees are in scope.",img:"01-scope-dry-run.png",cap:"Step 1 — Scope: Dry run, pay period, population."},
  {tag:"Task 1 — Scope",role:"Payroll Officer / Payroll Admin",n:2,action:"Optionally target specific employees.",nav:"Step 1 › Employee selection (optional)",expected:"Leave empty for the whole population, or tick specific employees for a focused run.",img:"02-scope-selected.png",cap:"Step 1 — a targeted set of employees."},
  {tag:"Task 2 — Pre-flight",role:"Payroll Officer / Payroll Admin",n:1,action:"Review the pre-flight checks.",nav:"Step 2 — Pre-flight",expected:"Blockers stop the run; warnings advise. With no blockers, the gate is clear.",img:"03-preflight.png",cap:"Step 2 — Pre-flight: clear, ready to simulate."},
  {tag:"Task 3 — Simulate",role:"Payroll Officer / Payroll Admin",n:1,action:"Run the simulation.",nav:"Step 3 — Simulate",expected:"The engine processes each employee; a progress bar shows how many are done.",img:"05-simulate-running.png",cap:"Step 3 — Simulate running."},
  {tag:"Task 3 — Simulate",role:"Payroll Officer / Payroll Admin",n:2,action:"Wait for the simulation to finish.",nav:"Step 3 — Simulate (complete)",expected:"When every employee is processed the step reports Done. Proceed to Review.",img:"06-simulate-done.png",cap:"Step 3 — Simulate complete."},
  {tag:"Task 4 — Review",role:"Payroll Officer / Payroll Admin · Payroll Manager",n:1,action:"Read the Results summary.",nav:"Step 4 — Review",expected:"Employees, gross, deductions, net and exceptions; a gross-to-net bar; a per-employee table (Export CSV).",img:"07-review.png",cap:"Step 4 — Review: gross-to-net + per-employee table."},
  {tag:"Task 5 — Payslip",role:"Payroll Officer / Payroll Admin · Payroll Manager",n:1,action:"Open an employee’s payslip.",nav:"Review › View details › Payslip",expected:"The branded, employee-facing payslip — earnings, deductions and net; downloadable as PDF.",img:"08-results-payslip.png",cap:"An individual payslip from the dry run."},
  {tag:"Task 5 — Payslip",role:"Payroll Officer / Payroll Admin · Payroll Manager",n:2,action:"Check the verification breakdown.",nav:"Results › Breakdown",expected:"Working values — gross, deductions, net, taxable gross, SI base, EoS base — behind the payslip.",img:"09-results-breakdown.png",cap:"The verification breakdown behind the payslip."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who uses this manual","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Run a Dry Run","Scope · Pre-flight · Simulate · Review");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.2,9.13],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join(OUT,"FD-RUN-01_Run_Payroll_Dry_Run_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
