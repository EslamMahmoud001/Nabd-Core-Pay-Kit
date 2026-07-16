const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const { Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,VerticalAlign,AlignmentType }=require("docx");
const IMG=(f)=>path.join("screenshots/rdy_shots",f);
const meta={ bpId:"BP-03", title:"Payroll Readiness & Opening a Cycle", module:"Nabd Pay",
  version:"1.0", status:"Draft", date:"12 July 2026", classification:"Internal — Project Use" };
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
  ["Module","Nabd Pay  ·  Control Center + Readiness"],
  ["Business process","BP-03 — Payroll Readiness & Opening a Cycle"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","1.0"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","12 Jul 2026","New KUT — opening a pay cycle and clearing pre-cycle health, with live screenshots","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("Before payroll can run, a pay cycle must be open and every pre-run check must pass. This manual shows how to open the current pay period from the Control Center, then use the Readiness dashboard (Pre-Cycle Health) to confirm everything is in place — and how to read and clear the blockers that stop a run."));
push(H2("After this training you will be able to:"));
["Open the current pay period for a calendar from the Control Center.",
 "Read the Pre-Cycle Health summary — blockers, warnings, checks passed, and records affected.",
 "Work through each gate group and understand what every check means.",
 "Clear a blocker using its View list and Fix actions, and know when the run can start."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","A warning is advisory — you can run with warnings. A blocker stops the run: the Open run wizard button stays disabled until every blocker is cleared."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","A pay period is due to run and its calendar exists."],
  ["Frequency","Every pay period, before the run."],
  ["Roles involved","Payroll Administrator (opens the cycle and clears readiness)."],
  ["Inputs","An open cycle, activated configuration, and complete employee data."],
  ["Outputs","A green Pre-Cycle Health — zero blockers — that enables the run."],
  ["Where","Nabd Pay › Control Center (open the cycle) and Readiness (Pre-Cycle Health)."],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(dataTable([{w:2600,label:"Role"},{w:6760,label:"Responsibility in this process"}],[
  ["Payroll Administrator","Opens the pay period in Control Center, reviews Pre-Cycle Health, and clears each blocker before the run."],
  ["Configuration Admin","Fixes configuration-side blockers (activate the country pack, assign earning / tax / SI / EoS bases)."],
],C.magenta));
push(spacer(80), callout("warn","Opening a cycle stamps it against the current calendar version and freezes which employees are in scope. Clear the readiness blockers before you run — a run started with unmet gates produces wrong or zero pay."));

push(sec(4,"Process Overview"));
push(lead("Getting ready to run moves through three stages:"));
["Open the pay period for the calendar in the Control Center.",
 "Open the Readiness dashboard and read the Pre-Cycle Health summary.",
 "Work down the gate groups, clearing each blocker until the run is enabled."].forEach((s,i)=>push(flowPill(i+1,s)));
push(spacer(40), callout("note","Pre-Cycle Health groups its checks into Setup & period, Pay setup, Employee data, and Pay-out & approvals. Each check is a green tick (passed), a red blocker, or an amber warning — with View list and Fix actions on the ones that need attention."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step"));
push(lead("Follow the tasks in order."));

push(H2("Task 1 — Open the pay cycle"));
push(roleTag("Payroll Administrator"), spacer(60));
push(...step(1,"Open the Payroll Control Center.","Nabd Pay › Control Center","The cockpit lists each calendar with its status counters (Open, In approval, Approved, Closed). A calendar with no open period shows an Open <period> button.","01-control-center.png","The Payroll Control Center — each calendar and its open period."));
push(...step(2,"Open the current period for your calendar.","Control Center › Egypt Monthly › Open 08.2026","A “Cycle opened” confirmation appears; the calendar now shows the period as OPEN with a Run payroll action, and the header pay-group badge switches to OPEN.","02-control-center-expanded.png","The calendar with its period open — ready to assess and run.","Opening a cycle pins the calendar version and freezes the in-scope employees for that period."));

push(H2("Task 2 — Check Pre-Cycle Health"));
push(roleTag("Payroll Administrator"), spacer(60));
push(...step(1,"Open the Readiness dashboard.","Nabd Pay › Readiness","Pre-Cycle Health shows the pay calendar, period, status and employees in scope, then a headline verdict (for example “Not ready — 7 blockers”) and four counters: Blockers, Warnings, Checks passed, and Records affected.","03-readiness-overview.png","Pre-Cycle Health — the headline verdict and the blocker / warning / passed counters."));
push(...step(2,"Work down the gate groups and read each check.","Readiness › gate groups","Checks are grouped into Setup & period, Pay setup, Employee data, and Pay-out & approvals. Each check is a green tick (passed), a red blocker, or an amber warning. A blocker shows how many records it affects, with View list and Fix actions.","04-readiness-gates.png","The gate groups — each check with its status and, for blockers, View list / Fix."));

push(H2("Task 3 — Clear the blockers"));
push(roleTag("Payroll Administrator  /  Configuration Admin"), spacer(60));
push(...step(1,"For each blocker, use View list to see the affected records and Fix to resolve it.","Readiness › blocker › View list / Fix","View list opens the affected employees or objects; Fix jumps to the screen where you resolve it (for example activating the country pack, assigning an earning / tax / SI / EoS basis, or completing employee bank / National-ID data). After fixing, choose Refresh to re-check.",null,null,"Typical blockers: “Country pack activated”, “Earning assigned”, “Social-insurance / Tax / End-of-service basis”, “Bank account on file”, “National ID on file”."));
push(callout("caution","“No earning component assigned — these employees would be paid zero” and “No active country pack — statutory amounts cannot be computed” are the two blockers that most often explain a zero-value run. Clear them (activate pay items and the country pack) before running."), spacer(120));

push(sec(6,"Validation & Expected Results"));
push(lead("You are ready to run when:"));
push(dataTable([{w:2900,label:"Check"},{w:2900,label:"Where"},{w:3560,label:"Expected result"}],[
  ["A cycle is open","Control Center","The period shows OPEN with a Run payroll action."],
  ["No blockers remain","Readiness","Blockers = 0; the verdict reads Ready."],
  ["Warnings reviewed","Readiness","Any remaining amber warnings are understood and accepted."],
  ["Run is enabled","Readiness","The Open run wizard button is active."],
]));

push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:2900,label:"Blocker",},{w:3100,label:"What it means"},{w:3360,label:"How to clear it"}],[
  ["Country pack activated","No active statutory pack for this calendar — statutory amounts can’t compute.","Activate the country pack for the calendar’s country."],
  ["Earning assigned","No earning component assigned — those employees would be paid zero.","Activate an earning Pay Item and ensure employees carry an earning (via SF binding or a Rule)."],
  ["Tax / SI / End-of-service basis","No pay is tagged as the tax / SI / EoS base — those amounts can’t compute.","Set the bucket flags on the relevant Pay Items so pay feeds the right statutory base."],
  ["Bank account on file","Payment cannot be disbursed without banking details.","Complete the employee’s bank details in SuccessFactors and re-sync."],
  ["National ID on file","National ID missing — it is the SI + tax key.","Complete the National ID in SuccessFactors and re-sync."],
],C.crimson));

push(sec(8,"Tips & Notes"));
[["best","Clear blockers top-down: Setup & period first (pack, cycle, cutoff), then Pay setup (the statutory bases), then Employee data. Fixing the earlier groups often clears later ones."],
 ["tip","Use each blocker’s View list to see exactly which employees or objects are affected before you fix — it scopes the work."],
 ["note","Warnings never block a run, but read them: they flag things you may want to correct before you commit an actual run."]].forEach(t=>{push(callout(t[0],t[1])); push(spacer(80));});

push(sec(9,"Key Terms"));
push(dataTable([{w:2600,label:"Term"},{w:6760,label:"Meaning"}],[
  ["Pay cycle","One numbered period (e.g. 08.2026) that a run executes against; opened from the Control Center."],
  ["Pre-Cycle Health","The Readiness dashboard — the pre-run checks that gate a payroll run."],
  ["Blocker","A failed check that stops the run until it is cleared."],
  ["Warning","An advisory check — the run can proceed, but review it first."],
  ["Gate group","A section of related checks — Setup & period, Pay setup, Employee data, Pay-out & approvals."],
  ["Statutory basis","The pay total a statutory calculation reads — the tax base, the SI base, or the EoS base."],
  ["In scope","The employees frozen into a cycle when it opens."],
]));

push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can open a pay cycle and clear Pre-Cycle Health to a runnable state independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join("screenshots/rdy_shots","BP-03_Payroll_Readiness_and_Opening_a_Cycle_KUT.docx")); })();
