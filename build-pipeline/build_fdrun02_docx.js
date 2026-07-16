// build_fdrun02_docx.js — FD-RUN-02 Finalize & Close a Payroll Period (Control Center) — Word
// Model: build_bp13_docx.js. Screenshots: screenshots/fdrun02_real (4 real PNGs, 0 dup md5s).
const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/fdrun02_real",f);
const OUT="screenshots/fdrun02_real";
const meta={ bpId:"FD-RUN-02", title:"Finalize & Close a Payroll Period", module:"Nabd Pay",
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
  ["Module","Nabd Pay  ·  Payroll › Control Center"],
  ["Business process","FD-RUN-02 — Finalize & Close a Payroll Period"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (Egypt Monthly · 08.2026)"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","16 Jul 2026","Initial task-based KUT: the Control Center finalization lifecycle and the permanent close of a posted period, with real screenshots","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("The Payroll Control Center is the operator’s cockpit for driving each calendar’s open period through its lifecycle: run, approval, posting to G/L, and close. This manual covers the finalization end of that lifecycle — reading a period’s stage in the cockpit and performing the permanent close once its journal is posted. Closing locks the period so its results and journal are retained as the final record."));
push(H2("After this training you will be able to:"));
["Read the Control Center cockpit and identify a period’s stage and next action.",
 "Recognise when a period is ready to close — approved, cut off, and its journal posted to G/L.",
 "Close a period from the cockpit through the confirmation dialog.",
 "Confirm the period is closed and locked, and see it move to the Closed group."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("caution","Closing a period is permanent — there is no reopen. Only close once the period’s journal is posted to G/L and every result is final."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","A payroll period has been run, approved and posted to G/L, and is ready to be locked as final."],
  ["Frequency","Once per period, at the end of the payroll cadence."],
  ["Roles involved","Payroll Manager / Payroll Admin — drives the cockpit and performs the close."],
  ["Inputs","An approved period whose journal is posted to G/L."],
  ["Outputs","A closed, locked period; the next period can then be opened to continue the cadence."],
  ["Where","Payroll › Control Center"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2900,label:"Role"},{w:6460,label:"Responsibility in this process"}],[
  ["Payroll Manager / Payroll Admin","Reads the cockpit, confirms the period is posted, and performs the permanent close."],
  ["Finance","Relies on the closed period as the final record behind the posted G/L journal."],
],C.navy));

push(sec(4,"Key Concepts"));
["The payroll lifecycle — a period moves Open → Run (actual) → Approve → Post to G/L → Close. The Control Center drives every stage.",
 "Cut off — before the actual run, the period’s input data is frozen into a snapshot so the run is reproducible (see the Run Payroll manual).",
 "Actual run & approval — the run computes the final results and the period is approved (see the Run Payroll manual).",
 "Post to G/L — the balanced journal is posted to S/4 (see the G/L Posting manual, BP-10). A period must be posted before it can close.",
 "Close — locks the period permanently. There is no reopen; the results and posted journal are retained as the final record."].forEach(t=>push(bullet(t)));
push(spacer(40), callout("note","This manual covers the Control Center and the close. The earlier stages have their own manuals: Run Payroll (FD-RUN-01) for the run, and G/L Posting (BP-10) for posting the journal."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step — Finalize & Close the Period"));
push(lead("The Control Center lists each calendar with its current period, stage and next action. For a period whose journal is posted, the next action is Close period."));

push(H2("Task 1 — Read the cockpit and confirm the period is ready to close"));
push(roleTag("Payroll Manager / Payroll Admin"), spacer(60));
push(...step(1,"Open the Control Center and find the calendar’s current period.","Payroll › Control Center","The cockpit lists each calendar with counters for Open, In approval, Approved and Closed periods. Egypt Monthly · 08.2026 shows 16 employees, status Approved, a Cut off badge, and Close period as its next action — its journal is posted, so it is ready to close.","01-control-center-ready-to-close.png","The Control Center — Egypt Monthly · 08.2026 is approved, cut off and posted, ready to close."));

push(H2("Task 2 — Close the period"));
push(roleTag("Payroll Manager / Payroll Admin"), spacer(60));
push(...step(1,"Choose Close period and read the confirmation.","Control Center › Egypt Monthly · 08.2026 › Close period","A confirmation dialog opens: “Close 08.2026?”. It states that closing locks Egypt Monthly permanently — there is no reopen — and confirms the journal is already posted to G/L. Read it before continuing.","02-close-confirmation-dialog.png","The close confirmation — closing is permanent and the journal is already posted.","Cancel here if anything is unresolved. There is no reopen after closing."));
push(...step(2,"Confirm the close.","Close 08.2026? › Close period","The period is closed and locked. A confirmation shows the period is closed and locked for Egypt Monthly, and the lifecycle stages are all complete.","03-closed-and-locked.png","The period is closed and locked."));

push(H2("Task 3 — Confirm the closed period in the cockpit"));
push(roleTag("Payroll Manager / Payroll Admin"), spacer(60));
push(...step(1,"Return to the Control Center.","Payroll › Control Center","Egypt Monthly · 08.2026 now shows as Closed, and the Closed counter reflects it. The cadence can continue by opening the next period.","04-control-center-closed.png","The Control Center — Egypt Monthly · 08.2026 is now closed."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(6,"Validation & Expected Results"));
push(dataTable([{w:3400,label:"Check"},{w:5960,label:"Expected result"}],[
  ["Ready to close","The period is Approved, Cut off, and its journal is posted to G/L; the next action is Close period."],
  ["Confirmation","The dialog states the close is permanent (no reopen) and that the journal is already posted to G/L."],
  ["After close","The period shows Closed and locked; the lifecycle stages are all complete."],
  ["Cockpit","The period moves to the Closed group and the Closed counter increases."],
],C.navy));

push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:3400,label:"Symptom"},{w:5960,label:"What it means / what to do"}],[
  ["No Close period action on the period","The period is not yet posted. Post its journal to G/L first (see the G/L Posting manual)."],
  ["Close is blocked","A regular period cannot close until its G/L journal is posted. Complete the posting, then close."],
  ["Closed the wrong period","There is no reopen. Confirm the period key in the “Close {period}?” dialog title before confirming."],
],C.crimson));

push(sec(8,"Tips & Notes"));
push(callout("caution","There is no reopen after a close. Always confirm the period key in the dialog title before confirming."));
push(callout("best","Close only after the journal is posted to G/L and every result is final — the closed period is the record of record."));
push(callout("note","Closing one period lets you open the next to continue the payroll cadence."));

push(sec(9,"Key Terms"));
push(dataTable([{w:2900,label:"Term"},{w:6460,label:"Meaning"}],[
  ["Control Center","The operator cockpit that drives each calendar’s open period through the lifecycle."],
  ["Stage rail","The visual lifecycle of a period — Open, Run, Approve, Post to G/L, Close."],
  ["Posted","The period’s balanced journal has been posted to the general ledger."],
  ["Close / lock","Making a period terminal; its results and journal are retained and it cannot be reopened."],
],C.teal));

push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can read the Control Center, recognise a period ready to close, and perform the permanent close independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"FD-RUN-02_Finalize_and_Close_KUT.docx")); console.log("docx written"); })();
