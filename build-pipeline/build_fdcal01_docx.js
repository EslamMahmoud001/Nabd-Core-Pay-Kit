const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const { Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,VerticalAlign,AlignmentType }=require("docx");
const IMG=(f)=>path.join("screenshots/fdcal01_real",f);
const meta={ bpId:"FD-CAL-01", title:"Pay Calendars & Cycles", module:"Nabd Pay",
  version:"2.0", status:"Draft", date:"12 July 2026", classification:"Internal — Project Use" };
function lead(t){ return P(R(t,{size:20,color:C.body}),{spacing:{after:120}}); }
function roleTag(role){ return callout("role", role, {label:"PERFORMED BY"}); }
function sec(n,t){ return H1(`${n}.  ${t}`); }
function flowPill(n,text){ const W=L.CONTENT_W; const noB={top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}};
  return new Table({width:{size:W,type:WidthType.DXA},columnWidths:[560,W-560],rows:[new TableRow({children:[
    new TableCell({width:{size:560,type:WidthType.DXA},borders:noB,verticalAlign:VerticalAlign.CENTER,shading:{fill:C.teal,type:ShadingType.CLEAR},children:[P(R(String(n),{bold:true,size:24,color:"FFFFFF"}),{alignment:AlignmentType.CENTER})]}),
    new TableCell({width:{size:W-560,type:WidthType.DXA},borders:noB,verticalAlign:VerticalAlign.CENTER,shading:{fill:C.tint,type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:180,right:140},children:[P(R(text,{size:19,color:C.ink}))]})]})]});
}
function step(n, action, nav, expected, img, cap, note){
  const out=[ stepHeader(n,{action,nav,expected,note}) ];
  if(img) out.push(...figureImg(IMG(img), cap));
  out.push(spacer(120)); return out;
}
const body=[]; const push=(...x)=>x.forEach(e=>body.push(e));
push(...coverPage(meta));
push(H1("Document Control"));
push(kvTable([
  ["Module","Nabd Pay  ·  Configuration › Cycles › Calendars"],
  ["Business process","FD-CAL-01 — Pay Calendars & Cycles"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","2.0"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant (/config/calendars-v2)"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","09 Jul 2026","Initial feature documentation (reference style)","Documenter agent"],
  ["2.0","12 Jul 2026","Converted to task-based KUT; real per-step screenshots; metadata completed","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("A Pay Calendar defines how one pay group’s payroll runs — how often periods repeat, where each period starts, when the data is frozen for a run (the data cutoff), when employees are paid, the working week it honours, and the rules for retroactive changes and rounding. A Calendar is the rule; a Cycle is one concrete, numbered period generated from that rule (for example “07.2026”). This manual covers creating and managing a Pay Calendar end to end."));
push(H2("After this training you will be able to:"));
["Create a Pay Calendar through the 5-step wizard and bind it to a pay group.",
 "Set the period-generation rule — frequency, anchor, cutoff and pay-date offsets, and working week.",
 "Set the retro window and rounding policy that a run inherits.",
 "Review every value before saving, and manage a calendar afterwards (version history, duplicate, archive)."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","One pay group binds to exactly one calendar. That binding decides which employees run on which calendar. Saving the wizard writes the generation rule (Calendar) and the retro/rounding policy together in one action."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","Onboarding a pay group, or changing how a group’s payroll runs."],
  ["Frequency","Once per pay group; edited as the rule changes (effective-dated)."],
  ["Roles involved","Payroll Admin / Tenant Admin (create & edit); Payroll Manager (view + version history only)."],
  ["Inputs","A pay group, a frequency + anchor, offsets, and a retro/rounding policy."],
  ["Outputs","A saved calendar that generates numbered cycles for its pay group."],
  ["Where","Nabd Pay › Configuration › Cycles › Calendars (/config/calendars-v2)"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2600,label:"Role"},{w:6760,label:"What they can do"}],[
  ["Payroll Admin / Tenant Admin","Create, edit, duplicate, archive and delete calendars. Only these roles change the generation rule or policy."],
  ["Payroll Manager","View the calendar list and open version history — but cannot create, edit, duplicate, archive or delete."],
],C.magenta));
push(spacer(80), callout("warn","A calendar’s rule is effective-dated. Saving with the same effective date corrects the current version in place; a later date opens a new version; an earlier date is rejected. A version whose date falls inside an already-open cycle is rejected — an open period is pinned to the version it opened with."));

push(sec(4,"Key Concepts"));
["Calendar vs. Cycle — the Calendar is the deterministic rule (frequency, anchor, offsets, naming); a Cycle is one materialized, numbered period stamped from it, carrying its own lifecycle (open → approved → closed).",
 "Period anchor — where a period starts. Its shape depends on the frequency: a day-of-month for Monthly, a weekday for Weekly, a date for Biweekly, a month + day for Quarterly/Annual. Semi-monthly uses two split-day fields instead.",
 "Offsets — the pay date and data cutoff are each a signed number of days from the period’s END. Positive lands after the period ends; negative freezes data or pays before it closes.",
 "Config pinning — when a cycle opens it pins the exact calendar version it runs against, so a later edit can never silently change a period that is already open."].forEach(t=>push(bullet(t)));
push(spacer(40), callout("note","The Period preview and next-open-cycle banner on the wizard call the same backend generator that stamps a real cycle — so what you preview is exactly what a cycle will open with."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step"));
push(lead("Creating or editing a calendar is a 5-step wizard, reached from the New calendar button on the list (or by clicking a row to edit). Follow the steps in order."));

push(H2("Task 1 — Open the Calendars list"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Open the Pay Calendars list.","Nabd Pay › Configuration › Cycles › Calendars","The list shows every calendar with its country, frequency, cutoff/pay offsets, working week, retro window and closed-period flag. Use the search box and country chips to filter, and the per-row menu for version history, duplicate, archive and delete.","01-calendar-list.png","The Pay Calendars list — one row per calendar, with search and per-row actions."));

push(H2("Task 2 — Create a pay calendar"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Choose New calendar and fill Step 1 — Identity.","New calendar › Key, Display name (EN), Country, Effective from","Enter a short lowercase Key (e.g. egypt_monthly — locked after creation), the English display name, the Country (also the statutory country), and the Effective-from date. A banner explains whether that date corrects the current version, forks a new one, or will be rejected.","02-step1-identity.png","Step 1 — Identity: key, display name, country and effective-from."));
push(...step(2,"Set Step 2 — Period generation.","Step 2 › Frequency, Period anchor, offsets, Working week","Choose the Frequency (the anchor control changes shape to match), set the anchor (for Monthly, the day of month), the cutoff and pay-date offsets (signed days from period end, −60…60), the period naming, and the working week. The Period preview updates live.","03-step2-period-generation.png","Step 2 — Period generation: the rule, offsets and live preview."));
push(...step(3,"Bind the pay group on Step 3 — Regional.","Step 3 › Employee pay group","Pick the SuccessFactors pay group this calendar runs. Every employee whose SF pay group matches lands on this calendar. The binding is singular — one pay group maps to one calendar.","04-step3-regional.png","Step 3 — Regional: the SuccessFactors pay-group binding."));
push(...step(4,"Set the policy on Step 4 — Policy.","Step 4 › Retro window, Default rounding, Decimal places, Lock closed periods","Set the retro window (months a retroactive change can still be picked up), the default rounding rule and decimal places, and whether edits inside a closed period are blocked. Sensible defaults are pre-filled (24 months, Half up, 2 dp, Lock on).","05-step4-policy.png","Step 4 — Policy: retro window, rounding and closed-period lock."));
push(...step(5,"Review every value on Step 5, then Save.","Step 5 › Review › Save calendar","The Review lists every value grouped by step, each with an Edit link back to its step. Choose Save calendar — one action writes the Calendar and its policy together.","06-step5-review.png","Step 5 — Review: every value, with Edit links, before saving.","Save writes both the generation rule and the retro/rounding policy in one action."));

push(H2("Task 3 — Manage a calendar"));
push(roleTag("Payroll Admin / Tenant Admin"), spacer(60));
push(...step(1,"Use the per-row actions to manage an existing calendar.","Calendars list › row menu › Version history / Duplicate / Archive / Delete","Version history opens a drawer listing every effective-dated version (newest first). Duplicate pre-fills the wizard from the row but clears the Key. Archive sets a calendar inactive once it has a committed cycle. Delete is disabled — with a tooltip pointing to Archive — once payroll has completed."));
push(callout("caution","A calendar that has completed payroll (a closed cycle, posted results, or GL/bank references) cannot be hard-deleted — it is archived instead, preserving history. Only a calendar that never ran a committed cycle can be deleted."), spacer(120));

push(sec(6,"Validation & Expected Results"));
push(lead("The wizard reveals inline errors only when you try to advance an invalid step. A calendar is correctly set up when:"));
push(dataTable([{w:2900,label:"Check"},{w:2900,label:"Where"},{w:3560,label:"Expected result"}],[
  ["Identity is complete","Step 1","Key, Display name (EN), Country and Effective from are all set."],
  ["The rule is valid","Step 2","Frequency and its anchor are set; both offsets are whole numbers between −60 and 60."],
  ["A pay group is bound","Step 3","An Employee pay group is selected."],
  ["Policy is set","Step 4","Retro window is 0–60 months; rounding and decimal places chosen."],
  ["Saved & listed","List","The new calendar appears in the list with its country, frequency and offsets."],
]));

push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:2900,label:"Symptom"},{w:3100,label:"Likely cause"},{w:3360,label:"What to do"}],[
  ["“Next” is blocked with a field error","A required field on that step is empty or out of range.","Fix the highlighted field — the anchor is range-checked for its frequency; offsets must be −60…60."],
  ["Effective-from date is rejected","The date is earlier than the calendar’s current version (a back-date).","Choose the current version’s date to correct in place, or a later date to open a new version."],
  ["“In-window edit” rejected on save","The chosen effective date falls inside an already-open cycle.","An open period is pinned; pick a date outside any open cycle’s window."],
  ["Delete is disabled","The calendar already has a committed / closed cycle or posted results.","Use Archive instead — it preserves history without deleting."],
],C.crimson));

push(sec(8,"Tips & Notes"));
[["tip","Use Duplicate to create a similar calendar fast — it pre-fills the wizard and only asks you for a new, unique Key."],
 ["best","Set the offsets thoughtfully: a negative cutoff offset freezes data before the period closes; a negative pay-date offset pays early. Both are signed days from the period’s END, not its start."],
 ["note","All period boundaries, cutoff and pay dates come from one backend generator — the preview you see while configuring is exactly what a real cycle opens with."]].forEach(t=>{push(callout(t[0],t[1])); push(spacer(80));});

push(sec(9,"Key Terms"));
push(dataTable([{w:2600,label:"Term"},{w:6760,label:"Meaning"}],[
  ["Calendar","The deterministic rule — frequency, anchor, offsets, naming — that generates a pay group’s periods."],
  ["Cycle","One materialized, numbered period stamped from a calendar (e.g. 07.2026), with its own lifecycle."],
  ["Period anchor","Where a period starts; its shape depends on the frequency (day-of-month, weekday, date, or month+day)."],
  ["Data cutoff","The point at which a cycle’s employee data is frozen for that run, so the calculation stays reproducible."],
  ["Offset","A signed number of days from the period’s END, used for the cutoff date and the pay date."],
  ["Effective dating","Versioning a calendar’s rule by its Effective-from date (delimit-and-extend)."],
  ["Config pinning","A cycle pins the exact calendar version it opened against, so later edits can’t change an open period."],
]));

push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can create, review and manage a Pay Calendar independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join("screenshots/fdcal01_real","FD-CAL-01_Pay_Calendars_and_Cycles_KUT.docx")); })();
