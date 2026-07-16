// build_payslips_docx.js — BP-PAYSLIP Payslips — Template & Bulk Generation (Word)
// Modelled on build_bp13_docx.js (the KUT-with-a-Configuration-section pattern).
// Screenshots: screenshots/payslips_real (10 real PNGs, 0 duplicate md5s).
const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/payslips_real",f);
const OUT="screenshots/payslips_real";
const meta={ bpId:"BP-PAYSLIP", title:"Payslips — Template & Bulk Generation", module:"Nabd Pay",
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
  ["Module","Nabd Pay  ·  Payslip Templates   +   Generate Payslips"],
  ["Business process","BP-PAYSLIP — Payslips — Template & Bulk Generation"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Nabd Pay"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","16 Jul 2026","Initial task-based KUT with 10 real screenshots covering template configuration and bulk generation","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("This guide shows how to create and preview an active payslip template for a pay group, then bulk-generate downloadable payslips from the final results of a closed payroll cycle."));
push(H2("After this training you will be able to:"));
[
  "Create a payslip template for Egypt pay group E1 and open it in Payslip Studio.",
  "Design and preview the template, then confirm that it is Active with template key EG-E1.",
  "Select the closed cycle and template in the four-step Generate Payslips wizard.",
  "Select employees and review the selected, matched and skipped counts.",
  "Confirm the bulk action by typing GENERATE and download the generated payslips."
].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","A template is Active on creation, with one active template per pay group. Bulk generation lists only closed cycles because payslips are created from a completed run’s final results."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","A completed payroll run is closed and its final results are ready for payslip generation."],
  ["Roles involved","Payroll Admin / Tenant Admin — configure the template and generate the payslips."],
  ["Inputs","An active payslip template for the pay group and a closed payroll cycle."],
  ["Process","Create and preview the template, then Pick cycle and template → Pick employees → Review match → Confirm and generate."],
  ["Outputs","One downloadable payslip per generated employee."],
  ["Where","Payslip Templates   ·   Payslip Studio   ·   Generate Payslips"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2900,label:"Role"},{w:6460,label:"Responsibility in this process"}],[
  ["Payroll Admin / Tenant Admin","Creates the template, designs and previews it in Payslip Studio, confirms it is Active, selects the closed cycle and employees, reviews the match, confirms generation, and downloads payslips."],
],C.navy));

push(sec(4,"Key Concepts"));
[
  "Payslip template — defines how a payslip looks for a pay group.",
  "Payslip Studio — where the template is designed and previewed.",
  "Active template — the template available for its pay group; a template is Active on creation and only one template is active per pay group.",
  "Closed cycle — a completed payroll cycle whose final results can be used to generate payslips.",
  "Review match — the wizard checkpoint that shows selected, matched and skipped employee counts before generation.",
  "Confirm-gated generation — the Generate action is enabled only after GENERATE is typed in the confirmation dialog."
].forEach(t=>push(bullet(t)));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Configuration — Payslip Template"));
push(lead("Create one template for the pay group, open it in Payslip Studio, and use the live preview to review its appearance. The template is Active on creation; this example uses Egypt pay group E1 and template key EG-E1."));
push(H2("Template used in this guide"));
push(dataTable([{w:2900,label:"Setting"},{w:6460,label:"Value"}],[
  ["Name","Egypt Monthly Payslip"],
  ["Country","Egypt"],
  ["Pay group","E1"],
  ["Template key","EG-E1"],
  ["Status","Active"],
],C.teal));
push(spacer(60), H2("Task — Create and preview the template"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Start a new payslip template.","Payslip Templates › New template","The new-template dialog opens from the empty Payslip Templates screen.","01-payslip-templates-empty.png","Payslip Templates — the empty screen with the New template action."));
push(...step(2,"Enter the template details and open Studio.","New template › Name › Country › Pay group › Create & open Studio","Name is Egypt Monthly Payslip, Country is Egypt and Pay group is E1. Create & open Studio opens the new template.","02-new-template-dialog.png","Creating the Egypt Monthly Payslip template for pay group E1."));
push(...step(3,"Design and preview the template in Payslip Studio.","Payslip Studio","The Egypt Monthly Payslip template is shown with a live preview and an Active status pill.","03-payslip-studio-active-preview.png","Payslip Studio — the active template and its live preview."));
push(...step(4,"Confirm the active template on the templates list.","Payslip Templates","The Egypt Monthly Payslip card shows key EG-E1, status Active and the Open in Studio action.","04-active-template-card.png","The active Egypt Monthly Payslip template card."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(6,"Step-by-Step — Generate Payslips"));
push(lead("Generate Payslips is a four-step wizard: 1. Pick cycle and template · 2. Pick employees · 3. Review match · 4. Confirm and generate. Only closed cycles are listed."));

push(H2("Task 1 — Pick cycle and template"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Select the closed cycle and the payslip template.","Generate Payslips › 1. Pick cycle and template","The closed cycle egypt_monthly:2026P08 · 2026-08-01 → 2026-08-31 · [CLOSED] and the payslip template are selected.","05-generate-pick-cycle-template.png","Step 1 — the closed cycle and payslip template selected.","Only closed cycles are listed — payslips are generated from a completed run’s results."));

push(H2("Task 2 — Pick employees"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Select the employees whose payslips will be generated.","Generate Payslips › 2. Pick employees","All 16 employees are selected: 16 of 16.","06-employee-preview-16-selected.png","Step 2 — 16 of 16 employees selected."));

push(H2("Task 3 — Review match"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Review the employee-to-template match.","Generate Payslips › 3. Review match","The review shows Selected 16 · Matched 16 · Skipped 0.","07-review-16-matches.png","Step 3 — all 16 selected employees match, with none skipped."));

push(H2("Task 4 — Confirm and generate"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Review the generation summary.","Generate Payslips › 4. Confirm and generate","The summary is displayed before the bulk generation action is started.","08-confirm-generation-summary.png","Step 4 — the generation summary before confirmation."));
push(...step(2,"Open the confirmation dialog and type GENERATE.","Confirm bulk generation › GENERATE","Typing GENERATE enables the bulk generation action.","09-typed-generate-confirmation.png","Confirm bulk generation — the typed confirmation gate."));
push(...step(3,"Review the completed generation and download payslips.","Generation result","The result shows 16 generated · 0 skipped · 0 failed. Each generated payslip has a Download action.","10-generation-complete-16.png","Generation complete — 16 payslips generated, each with a Download action."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(7,"Validation & Expected Results"));
push(dataTable([{w:3400,label:"Check"},{w:5960,label:"Expected result"}],[
  ["Template","Egypt Monthly Payslip is Active for pay group E1 and has template key EG-E1."],
  ["Cycle","egypt_monthly:2026P08 is listed as [CLOSED] for 2026-08-01 → 2026-08-31."],
  ["Employee selection","16 of 16 employees are selected."],
  ["Match review","Selected 16 · Matched 16 · Skipped 0."],
  ["Confirmation gate","The action is enabled after GENERATE is typed."],
  ["Generation result","16 generated · 0 skipped · 0 failed, with one downloadable payslip per employee."],
  ["Database confirmation","nabd_pay_payslips contains 16 rows."],
],C.navy));

push(sec(8,"Common Errors & Troubleshooting"));
push(dataTable([{w:3400,label:"Symptom"},{w:5960,label:"What it means / what to do"}],[
  ["No template is available yet","Use New template, enter the name, country and pay group, then choose Create & open Studio."],
  ["The intended payroll cycle is not listed","Only closed cycles are listed. Confirm that the intended cycle is closed."],
  ["The generation action is not enabled","Type GENERATE exactly in the Confirm bulk generation dialog."],
  ["A generated payslip is needed individually","Use the Download action shown for that payslip in the completed result."],
],C.crimson));

push(sec(9,"Tips & Notes"));
push(callout("tip","Use the live preview in Payslip Studio to review the template before bulk generation."));
push(callout("best","At Review match, read all three counts — Selected, Matched and Skipped — before continuing."));
push(callout("note","Confirm the selected cycle is marked [CLOSED], then read the generated, skipped and failed totals when generation completes."));

push(sec(10,"Key Terms"));
push(dataTable([{w:2900,label:"Term"},{w:6460,label:"Meaning"}],[
  ["Payslip template","Defines how a payslip looks for a pay group."],
  ["Payslip Studio","The screen used to design and preview a template."],
  ["Active","The template status on creation; one template is active per pay group."],
  ["Template key","The template identifier; EG-E1 in this guide."],
  ["Closed cycle","A completed payroll cycle whose final results can be used for payslip generation."],
  ["Matched","A selected employee included in the match review for generation."],
  ["Skipped","A selected employee not included in generation."],
  ["Failed","A payslip that did not generate successfully."],
],C.teal));

push(sec(11,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can configure and preview a payslip template, generate payslips from a closed cycle, review the result, and download generated payslips independently."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-PAYSLIP_Payslips_KUT.docx")); console.log("docx written"); })();
