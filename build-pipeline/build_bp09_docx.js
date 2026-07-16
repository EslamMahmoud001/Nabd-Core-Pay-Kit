const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/bp09_real",f);
const OUT="screenshots/bp09_real";
const meta={ bpId:"BP-09", title:"Bank File — Salary Payment File", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"13 July 2026", classification:"Internal — Project Use" };
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
  ["Module","Nabd Pay  ·  Payments › Bank File   +   Configuration › Payout › Bank Templates"],
  ["Business process","BP-09 — Bank File (salary payment file)"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (demo cycle bankfile_demo:2026-05)"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","13 Jul 2026","Initial task-based KUT with real per-step screenshots (template config + file generation)","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("The bank file is the salary-credit file handed to the bank to pay employees — one credit row per employee for their net pay, rendered in the exact layout the bank requires. Nabd turns an approved payroll cycle into that file through a reusable bank template, with a preview, a set of validations, a confirm-gated generation and a full audit trail. This manual covers both sides: configuring a bank template once, then generating the bank file for an approved cycle."));
push(H2("After this training you will be able to:"));
["Create a bank template from a ready-made starter (CIB, DME or DME XML) — no code needed.",
 "Select an approved cycle and a bank template on the Bank File screen.",
 "Read the salary-credit preview and the validation checklist, and understand why account numbers are masked.",
 "Generate the bank file with a chosen value date through the confirm-gated dialog.",
 "Confirm the generated file, download it, and review previous exports."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","Account numbers are masked everywhere in the app. Only the generated file itself carries full account numbers — and generating or downloading it is access-controlled and written to the audit log."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","A payroll cycle has been approved and its net pay must be paid to employees."],
  ["Frequency","Once per approved cycle (regenerate replaces the file if it must be re-produced)."],
  ["Roles involved","Payroll Admin / Tenant Admin — configure templates, generate and download (access-controlled, audited)."],
  ["Inputs","An approved cycle, employees with a bank account, and a bank template."],
  ["Outputs","A salary-credit file — one net-pay credit row per employee — ready to hand to the bank."],
  ["Where","Configuration › Payout › Bank Templates   ·   Payments › Bank File"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2600,label:"Role"},{w:6760,label:"What they do in this process"}],[
  ["Payroll Admin / Tenant Admin","Create and manage bank templates; select the cycle and template; generate, regenerate and download the bank file."],
  ["Audit / Finance (oversight)","Rely on the audit trail — every generate, regenerate and download is recorded — and reconcile the file total to the run."],
],C.magenta));
push(spacer(80), callout("warn","Generation and download are privileged, audited actions because the file exposes full bank-account numbers. Treat the produced file as sensitive and hand it only to the bank through the agreed secure channel."));

push(sec(4,"Key Concepts"));
["Bank template — the file layout a specific bank requires (columns, order, format, encoding). Built once from a starter, then reused for every cycle. Starters ship for CIB (delimited CSV), DME flat (fixed width) and DME XML.",
 "Eligible cycle — the bank file is produced from an approved (then posted or closed) cycle; an open or dry-run cycle is not eligible.",
 "Salary-credit preview — one row per payable employee (masked account, bank, net amount, currency, status), with tabs for All / Included / Issues and a total that must reconcile to the run.",
 "Validations — a short checklist the run must pass before it can generate: eligible cycle, at least one payable employee, all employees banked, single currency, no existing file, and no zero/negative net included.",
 "Value date & confirmation — generation is confirm-gated; you choose the value date (the cycle pay date, today, or a custom date) and confirm before the file is produced.",
 "Regenerate — if a file already exists for the cycle, generating again replaces it (the prior export is removed) and is itself audited."].forEach(t=>push(bullet(t)));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Configuration — Create a Bank Template"));
push(lead("A bank template is configured once and then reused. If your bank matches a starter, installing it is a single click; otherwise you can build the layout field by field, import a CSV header, or clone an existing template."));
push(H2("Task — Install a bank template"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Open a new bank template and choose how to start.","Configuration › Payout › Bank Templates › New template","The dialog offers Start blank, Import a CSV header, or Clone a template, and — under “Install a ready-made starter” — CIB Egypt salary upload, DME flat (fixed width) and DME XML. Pick the starter that matches your bank.","01-new-template-starters.png","New template — the starter options for the bank layout."));
push(...step(2,"Confirm the template is listed.","Bank Templates › Your templates","The installed template appears in the list with its key and format (for example, CIB Egypt — Salary Upload · cib-eg.v1 · CSV). It is now selectable on the Bank File screen.","02-bank-templates-list.png","The bank template is installed and ready to use.","One template per bank layout is enough; it is reused for every cycle that bank pays."));

push(sec(6,"Step-by-Step — Generate the Bank File"));
push(lead("With a template in place and a cycle approved, generating the bank file is a short, gated flow: select → review → generate → download."));

push(H2("Task 1 — Select the cycle and template, and review the preview"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Open Bank File and choose the approved cycle and the bank template.","Payments › Bank File › Cycle + Bank template","Pick the approved cycle and the bank template. The page shows the headline figures — employees in scope, payable count, total amount and value date — the masked salary-credit preview, and a validation checklist. Confirm every validation passes and the total reconciles to the run.","03-bankfile-preview.png","Bank File — cycle and template selected, with the masked preview and validations.","Account numbers are masked here; the full numbers appear only in the generated file."));

push(H2("Task 2 — Generate the file"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Generate the bank file and choose the value date.","Bank File › Generate bank file › confirm","The confirm dialog restates the employee count and total, and lets you set the value date — the cycle pay date, today, or a custom date. Confirm to produce the file.","04-generate-confirm.png","The confirm-gated Generate dialog, with the value-date choice."));

push(H2("Task 3 — Confirm generation and download"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Confirm the file was generated and download it.","Bank File › Download  ·  Previous exports","After generating, the stepper advances to Download and the file is available. The Generate button becomes Regenerate (regenerating replaces the file). Download the file to hand to the bank — each download is audited.","05-generated.png","The bank file is generated — download available, and the export is recorded.","Downloading a file is a controlled action; save it only to an approved, secure location."));

push(H2("Task 4 — Review previous exports"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Open the export history for the cycle.","Bank File › Previous exports","Previous exports lists each generated file with its status, file name, record count, amount and timestamp — the audit trail for what was produced and paid.","06-history.png","Previous exports — the audit trail of generated bank files."));

push(sec(7,"Validation & Expected Results"));
push(lead("A bank file is correctly produced when:"));
push(dataTable([{w:2900,label:"Check"},{w:2900,label:"Where"},{w:3560,label:"Expected result"}],[
  ["A template exists","Bank Templates","At least one bank template is listed and selectable."],
  ["Cycle & template selected","Bank File","An approved cycle and a bank template are chosen; the preview populates."],
  ["Validations pass","Bank File › Validations","All checks pass — eligible cycle, all employees banked, single currency, no zero/negative net."],
  ["Total reconciles","Bank File","The total amount equals the sum of included net-pay lines and matches the run."],
  ["File generated","Previous exports","The export is listed as Generated with the expected record count and amount."],
]));

push(sec(8,"Common Errors & Troubleshooting"));
push(dataTable([{w:2900,label:"Symptom"},{w:3100,label:"Likely cause"},{w:3360,label:"What to do"}],[
  ["“templateKey is required” on generate","No bank template is selected (or none is configured yet).","Configure a template (Section 5) and select it in the Bank template picker before generating."],
  ["No cycle is available to select","No cycle is eligible — cycles must be approved (then posted/closed).","Take the cycle through approval first; only then does it appear on Bank File."],
  ["An employee is excluded / “Issues”","The employee has no bank account, or a zero/negative net.","Add the missing bank account (employee data) or confirm the exclusion is expected before generating."],
  ["“No existing bank file” validation fails","A bank file has already been generated for this cycle.","Use Regenerate to replace it — the prior export is removed and the action is audited."],
],C.crimson));

push(sec(9,"Tips & Notes"));
[["tip","Use a ready-made starter (CIB, DME, DME XML) to stand up a template in one click instead of building the layout by hand."],
 ["best","Reconcile the bank-file total to the payroll run before generating, and confirm every validation passes — the file is a payment instruction."],
 ["note","Account numbers are masked in every on-screen view; full numbers exist only inside the generated file, and every generate and download is audited."]].forEach(t=>{push(callout(t[0],t[1])); push(spacer(80));});

push(sec(10,"Key Terms"));
push(dataTable([{w:2600,label:"Term"},{w:6760,label:"Meaning"}],[
  ["Bank file","The salary-credit file handed to the bank — one net-pay credit row per employee."],
  ["Bank template","The reusable file layout a bank requires (columns, order, format, encoding)."],
  ["Eligible cycle","An approved (then posted or closed) cycle — the only kind a bank file can be produced from."],
  ["Salary-credit preview","The on-screen, masked preview of the rows the file will contain."],
  ["Value date","The date the credit takes effect — the cycle pay date, today, or a custom date."],
  ["Masking","Showing only the last digits of an account number on screen; the file carries the full number."],
  ["Regenerate","Producing the file again for a cycle, replacing the previous export (audited)."],
]));

push(sec(11,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can configure a bank template and generate a bank file independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-09_Bank_File_KUT.docx")); console.log("docx written"); })();
