// build_bp10_docx.js — BP-10 G/L Posting (Word)
// Modelled on build_bp13_docx.js (the KUT-with-a-Configuration-section pattern).
// Screenshots: screenshots/bp10_real (4 real PNGs, 0 duplicate md5s).
const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/bp10_real",f);
const OUT="screenshots/bp10_real";
const meta={ bpId:"BP-10", title:"G/L Posting", module:"Nabd Pay",
  version:"1.1", status:"Draft", date:"16 July 2026", classification:"Internal — Project Use" };
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
  ["Module","Nabd Pay  ·  Operations › G/L Posting   +   Configuration › G/L Mapping"],
  ["Business process","BP-10 — G/L Posting"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.1"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (Egypt Monthly · August 2026)"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","16 Jul 2026","Initial task-based KUT for G/L mapping, journal review and S/4 posting","Nabd Delivery Team"],
  ["1.1","16 Jul 2026","Re-captured on the SUCCESSFUL posting: journal posted to G/L as S/4 document 1000000123 (fiscal year 2026). Screens and prose now show the posted, all-green stage rail instead of the earlier transmission failure.","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("G/L Posting turns an approved payroll cycle’s results into a balanced journal and posts it to S/4. This manual shows how to confirm the output routings for company code 1000, locate the approved cycle, review the exact journal and validation results, and post the balanced journal to S/4, confirming the returned document number."));
push(H2("After this training you will be able to:"));
[
  "Explain how output routings turn pay items into debit and credit journal lines for the pay group’s company code.",
  "Locate an approved cycle in G/L Posting and open its journal.",
  "Verify the seven journal lines, 16 employees and exact balanced total of EGP 230,056.25.",
  "Recognise the No duplicate post blocker as correct idempotency protection.",
  "Post the journal to S/4 and confirm the returned document number and posted status."
].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","A dry-run cycle has no journal. The cycle must be approved or closed before G/L Posting can build its journal."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","A payroll cycle is approved or closed and is ready for journal review and transmission."],
  ["Frequency","For each approved or closed payroll cycle that must be posted to the ledger."],
  ["Roles involved","Payroll Admin / Tenant Admin — configure routings and post.  Finance — review the journal."],
  ["Inputs","Approved cycle results and output routings scoped to the pay group’s company code."],
  ["Outputs","A balanced seven-line payroll journal and, when transmission succeeds, a posting to S/4."],
  ["Where","Operations › G/L Posting   ·   Configuration › G/L Mapping"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2900,label:"Role"},{w:6460,label:"Responsibility in this process"}],[
  ["Payroll Admin / Tenant Admin","Configure output routings for the legal entity, open the approved cycle, post the journal to S/4, and review the posting result."],
  ["Finance","Review the journal lines, debit and credit totals, employee count and validation results before posting."],
],C.navy));

push(sec(4,"Key Concepts"));
[
  "Approved or closed cycle — the required cycle state for journal creation. A dry-run cycle does not have a journal.",
  "Output routing — maps a pay item to a G/L account and contra account for the pay group’s company code.",
  "Net-pay routing — net_pay has its own routing and creates the net credit line.",
  "Balanced journal — total debits equal total credits. Here both totals are EGP 230,056.25.",
  "Idempotency — the system refuses to build a second live journal for the same cycle. The No duplicate post blocker is a safety feature.",
  "Post to G/L — transmits the balanced journal to S/4; on success the period shows the S/4 document number and the journal is live in the ledger."
].forEach(t=>push(bullet(t)));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Configuration — G/L Mapping"));
push(lead("Output routings map each pay item to its G/L account and contra account for the pay group’s company code. For Egypt Monthly, the relevant legal entity is company code 1000. The configured outputs below produce the seven verified journal lines; net_pay supplies its own credit routing."));
push(H2("Task — Review the output routings"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(dataTable([{w:3440,label:"Routing output"},{w:1000,label:"DR/CR"},{w:1200,label:"Account"},{w:1600,label:"Company code"},{w:2120,label:"Amount in this journal (EGP)"}],[
  ["Basic Salary → Salaries & Wages","Debit","6100","1000","200,000.00"],
  ["Egypt SI — Employer → SI Employer Expense","Debit","6150","1000","30,056.25"],
  ["Net pay → Net Payroll Payable","Credit","2100","1000","163,149.83"],
  ["Egypt Income Tax (PIT) → Income Tax Payable","Credit","2210","1000","19,117.17"],
  ["Egypt SI — Employee → Social Insurance Payable","Credit","2220","1000","17,633.00"],
  ["Egypt SI — Employer → Social Insurance Payable","Credit","2220","1000","30,056.25"],
  ["Egypt Martyrs & Victims Fund → Martyrs Fund Payable","Credit","2230","1000","100.00"],
],C.teal));
push(spacer(40), callout("best","Review the company code and both sides of each routing before relying on the journal output. The exact journal remains the final check."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(6,"Step-by-Step — Build & Post the Journal"));
push(lead("The approved cycle is available in the G/L Posting portfolio. Open it to review the built journal and validation results, inspect any posting response, and confirm the output routing configuration used for the journal."));

push(H2("Task 1 — Locate the approved cycle"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Open G/L Posting and locate Egypt Monthly · August 2026.","Operations › G/L Posting","The portfolio shows cycle egypt_monthly:2026P08 with 16 employees, total EGP 230,056.25 and status Posted. G/L mapping and Export journal are available from the posting area.","01-posting-portfolio.png","G/L Posting portfolio — Egypt Monthly · August 2026, posted to the ledger."));

push(H2("Task 2 — Review the built journal"));
push(roleTag("Finance"), spacer(60));
push(...step(1,"Open the cycle and review the stage rail, totals, journal preview and validation checklist.","G/L Posting › Egypt Monthly · August 2026","Cycle approved, Journal built and Validated & balanced are complete. The journal has 7 lines for 16 employees; total debits and credits are both EGP 230,056.25. The green banner confirms it is posted to the ledger as S/4 document 1000000123 (fiscal year 2026), and the stage rail is complete through Post to S/4 and Period locked.","02-cycle-posted.png","Cycle detail — the journal is built, balanced and posted to G/L (S/4 document 1000000123).","The summary tiles round both totals to EGP 230.1K. Use the exact journal total, EGP 230,056.25, for reconciliation."));

push(H2("Task 3 — Confirm the posting in Post history"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Open Post history and confirm the successful posting.","Cycle detail › Post history › PAY-2026-08-R1","The posting for journal reference PAY-2026-08-R1 shows Posted, with S/4 document number 1000000123. The journal is live in the general ledger.","03-post-history-posted.png","Post history — the journal is posted to S/4 as document 1000000123.","Journal reference PAY-2026-08-R1 identifies the posting; S/4 document 1000000123 is its reference in the general ledger."));

push(H2("Task 4 — Confirm the G/L mapping used by the journal"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Open G/L mapping and review the configured routing outputs for legal entity 1000.","Cycle detail › G/L mapping","The G/L Mapping page shows the routing configuration for legal entity 1000. Confirm the seven routing outputs documented in section 5 and their debit, credit and contra accounts.","04-gl-mapping-7-routings.png","G/L Mapping — routing outputs for legal entity 1000.","These routings drove the posted journal, and remain the mapping for future cycles on this company code."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(7,"Validation & Expected Results"));
push(dataTable([{w:3400,label:"Check"},{w:5960,label:"Expected result"}],[
  ["Cycle","egypt_monthly:2026P08 is approved and contains 16 employees."],
  ["Journal build","The stage rail shows Journal built with 7 lines and 16 employees."],
  ["Debits","6100 Salaries & Wages EGP 200,000.00 plus 6150 SI Employer Expense EGP 30,056.25 = EGP 230,056.25."],
  ["Credits","2100 Net Payroll Payable EGP 163,149.83; 2210 Income Tax Payable EGP 19,117.17; 2220 Social Insurance Payable EGP 17,633.00 plus EGP 30,056.25; 2230 Martyrs Fund Payable EGP 100.00 = EGP 230,056.25."],
  ["Balance","Total debits equal total credits: EGP 230,056.25, with difference 0."],
  ["Validation","8 checks pass. No duplicate post is the single blocker because a live journal already exists for the cycle; this is correct idempotency protection."],
  ["Posting result","Post to S/4 succeeds; the period shows Posted with S/4 document 1000000123 and the journal is live in the ledger."],
  ["Period locked","Once posted, the period can be closed and locked; the posted journal is retained."],
],C.navy));

push(sec(8,"Common Errors & Troubleshooting"));
push(dataTable([{w:3400,label:"Symptom"},{w:5960,label:"What it means / what to do"}],[
  ["No journal is available for the cycle","The cycle may still be a dry run. G/L Posting requires an approved or closed cycle."],
  ["No duplicate post is marked Blocker","Expected safety behaviour. A live journal already exists for the cycle, so the system refuses to build a second one. Review and use the existing journal."],
  ["“No duplicate post” blocker","A live journal already exists for the cycle — idempotency protection; the system will not build a second journal over a posted one."],
  ["Journal not balanced","Debits do not equal credits. Check the output routings — every pay item and net_pay needs a routing to a G/L account for the company code."],
  ["A journal line or account is not as expected","Review the output routing for the pay item and company code 1000, including its account and contra account."],
  ["The tiles show EGP 230.1K","The tiles are rounded. Reconcile against the exact total EGP 230,056.25 shown in the journal and posting detail."],
],C.crimson));

push(sec(9,"Tips & Notes"));
push(callout("tip","Use the journal preview for the exact figures; the summary tiles show rounded totals."));
push(callout("best","Have Finance review all seven lines, the 16-employee count and the exact debit/credit equality before the Payroll Admin posts or retries."));
push(callout("note","The No duplicate post blocker protects the cycle from a second live journal. It is not a journal defect."));
push(callout("note","A posted journal is identified by its journal reference (PAY-2026-08-R1) and its S/4 document number (1000000123). Reverse posting is available if a correction is needed before close."));

push(sec(10,"Key Terms"));
push(dataTable([{w:2900,label:"Term"},{w:6460,label:"Meaning"}],[
  ["G/L Posting","The process that turns an approved cycle’s results into a balanced journal and transmits it to S/4."],
  ["Output routing","The company-code-scoped mapping from a pay item to a G/L account and contra account."],
  ["Contra account","The opposite-side account supplied by an output routing."],
  ["Balanced journal","A journal whose total debits equal total credits."],
  ["Live journal","The existing journal for a cycle; idempotency prevents another one from being built."],
  ["Idempotency","Protection against creating or posting the same cycle journal twice."],
  ["S/4 document number","The reference S/4 returns for the posted journal (here 1000000123) — its identity in the general ledger."],
  ["Journal reference","The Nabd reference for the posting (here PAY-2026-08-R1)."],
],C.teal));

push(sec(11,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can review the G/L mapping, reconcile the approved cycle’s journal, post the balanced journal to S/4, and confirm the posted result and its document number."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join(OUT,"BP-10_GL_Posting_KUT.docx")); console.log("docx written"); })();
