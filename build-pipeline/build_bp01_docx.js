const path=require("path"), fs=require("fs");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const { Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,VerticalAlign,AlignmentType }=require("docx");
const IMG=(f)=>path.join("screenshots/bp01_shots",f);

const meta={ bpId:"BP-01", title:"Core Integration Configuration", module:"Nabd Core",
  version:"2.0", status:"Draft", date:"12 July 2026", classification:"Internal — Project Use" };

function lead(t){ return P(R(t,{size:20,color:C.body}),{spacing:{after:120}}); }
function roleTag(role){ return callout("role", role, {label:"PERFORMED BY"}); }
function sec(n,t){ return H1(`${n}.  ${t}`); }
function flowPill(n,text){ const W=L.CONTENT_W; const noB={top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE}};
  return new Table({width:{size:W,type:WidthType.DXA},columnWidths:[560,W-560],rows:[new TableRow({children:[
    new TableCell({width:{size:560,type:WidthType.DXA},borders:noB,verticalAlign:VerticalAlign.CENTER,shading:{fill:C.teal,type:ShadingType.CLEAR},children:[P(R(String(n),{bold:true,size:24,color:"FFFFFF"}),{alignment:AlignmentType.CENTER})]}),
    new TableCell({width:{size:W-560,type:WidthType.DXA},borders:noB,verticalAlign:VerticalAlign.CENTER,shading:{fill:C.tint,type:ShadingType.CLEAR},margins:{top:80,bottom:80,left:180,right:140},children:[P(R(text,{size:19,color:C.ink}))]})]})]});
}

// step with optional image + optional callout after
function step(n, action, nav, expected, img, imgCap){
  const out=[ stepHeader(n,{action,nav,expected}) ];
  if(img) out.push(...figureImg(IMG(img), imgCap));
  out.push(spacer(120));
  return out;
}

const body=[];
const push=(...x)=>x.forEach(e=>body.push(e));
push(...coverPage(meta));

// Document Control
push(H1("Document Control"));
push(kvTable([
  ["Module","Nabd Core — SuccessFactors + S/4HANA Cloud integration"],
  ["Business process","BP-01 — Core Integration Configuration"],
  ["Document owner","Nabd Delivery Team"],
  ["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],
  ["Approved by","Pending approval"],
  ["Version","2.0"],["Status","Draft"],
  ["Environment","Nabd Core — QA / project tenant"],
  ["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","09 Jul 2026","Initial draft generated from code + feature docs","Nabd Delivery Team"],
  ["2.0","12 Jul 2026","Real screenshots captured per action; removed Prerequisites section; metadata completed","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));

// Contents
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

// 1 Purpose
push(sec(1,"Purpose & Learning Outcomes"));
push(lead("This manual walks you through configuring the connection between Nabd and your upstream systems — SAP SuccessFactors (people data) and SAP S/4HANA Cloud (the general-ledger master) — and getting the first data load to land cleanly. Core is the integration layer every other module reads from, so this setup is the first thing a new deployment needs."));
push(H2("After this training you will be able to:"));
["Point Nabd at your SuccessFactors and S/4HANA Cloud tenants and confirm each connection is open.",
 "Choose which categories of employee data are brought into Nabd (data scope).",
 "Set when each data stream syncs on its own schedule.",
 "Run the first sync and confirm employees and reference data have loaded."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","Core runs one dedicated Nabd deployment per customer — one application and one database. There is no shared environment and no tenant switching; every setting here applies to your deployment only."));

// 2 Process at a glance
push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","A new Nabd deployment, or re-pointing an existing connection."],
  ["Frequency","Once at onboarding; edited as systems or scope change."],
  ["Roles involved","Integration Administrator (setup); Consultant (can run a sync)."],
  ["Inputs","BTP destinations, SF Company ID, S/4 chart-of-accounts key."],
  ["Outputs","Open, tested connections and a first data load into Nabd."],
  ["Downstream","Every other Nabd module reads people & reference data from Core."],
],C.magenta));

// 3 Roles
push(sec(3,"Roles & Responsibilities"));
push(lead("Two roles take part. Setting up or repointing a connection, changing data scope, and editing schedules are administrator actions; running a sync can also be done by a consultant."));
push(dataTable([{w:2600,label:"Role"},{w:6760,label:"Responsibility in this process"}],[
  ["Integration Administrator","Sets up and repoints the SuccessFactors and S/4HANA Cloud connections, chooses data scope, and edits the sync schedules. Only this role can change connection identity."],
  ["Consultant","Can run a sync on demand and view stream health, but cannot change connection identity or tuning."],
],C.magenta));
push(spacer(80), callout("warn","Reading a stream's status is open to everyone who signs in, but changing the connection identity (destination, company ID, auth type) is restricted to the Integration Administrator."));

// 4 Overview
push(sec(4,"Process Overview"));
push(lead("A sync is a one-way pull: Nabd fetches from the upstream system, transforms the records, and writes them into its own database — nothing is ever written back to SuccessFactors or S/4HANA Cloud. Each category of data is its own stream (Employees, Leave, Foundation, Time-account balances, GL accounts) running on its own schedule. Configuration happens in four short stages:"));
["Connect — register the BTP destination + identity for each system, then test the pipe.",
 "Scope — choose which employee data categories to bring in, and your operating countries.",
 "Schedule — set how often each stream syncs.",
 "Load & verify — run the first sync and confirm the data landed."].forEach((s,i)=>push(flowPill(i+1,s)));
push(spacer(60));

// Execution
push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step Configuration"));
push(lead("Follow the tasks in order. Each step shows the action, where to find it, and what you should see. Screenshots are from the QA / project tenant."));

push(H2("Task 1 — Set up the SuccessFactors connection"));
push(roleTag("Integration Administrator"), spacer(60));
push(...step(1,"Open the Connection page.","Settings › Connection","The page shows a card for SuccessFactors and a card for S/4HANA Cloud.","01-connection-page.png","The Connection page — one card per upstream system."));
push(...step(2,"On the SuccessFactors card, choose Set up (or Edit configuration if a connection already exists).","SuccessFactors card › Set up / ⋮ More actions › Edit configuration","The Set up SuccessFactors connection editor opens."));
push(...step(3,"Choose the Auth Type. Use OAuth via BTP Destination for a live deployment.","Editor › Auth Type","The BTP-destination hint updates to describe the chosen auth."));
push(...step(4,"Enter the BTP Destination Name exactly as configured in BTP, then your SF Company ID.","Auth Type › BTP Destination Name › SF Company ID","Both fields accept your values. The destination name is case-sensitive.","02-sf-setup-editor.png","The Edit SF connection editor — auth type, BTP destination and Company ID."));
push(...step(5,"Optionally enter the SF portal URL (only powers the “Edit in SuccessFactors” links). Then choose Save configuration.","Editor › SF portal URL (optional) › Save configuration","A “Configuration saved.” confirmation appears and the card shows the destination and company."));
push(...step(6,"Choose Test connection to probe the pipe.","SuccessFactors card › Test connection","The setup tests expand and show each check passing — BTP destination resolvable, SF endpoint reachable, authentication valid — and the badge reads Connected.","03-setup-tests-passing.png","Setup tests · 3/3 passing — the connection is verified end-to-end."));

push(H2("Task 2 — Set up the S/4HANA Cloud connection"));
push(roleTag("Integration Administrator"), spacer(60));
push(...step(1,"On the same Connection page, find the S/4HANA Cloud card and choose Set up.","Settings › Connection › S/4HANA Cloud card › Set up","The Set up S/4HANA Cloud connection editor opens."));
push(...step(2,"Enter the BTP Destination Name for S/4, then the Chart of accounts key. Choose Create connection, then Test connection.","Editor › BTP Destination Name › Chart of accounts › Create connection › Test connection","The status reads Connected and the message confirms the destination and auth are valid.","04-s4-card.png","Both systems on the Connection page — SuccessFactors connected, S/4HANA Cloud ready to set up."));
push(callout("caution","If the S/4 test returns a SuccessFactors error page, the destination is pointing at your SF tenant instead of S/4. Update the BTP destination to the S/4 hostname and test again."), spacer(120));

push(H2("Task 3 — Choose what data to sync (data scope)"));
push(roleTag("Integration Administrator"), spacer(60));
push(...step(1,"Open the Advanced page.","Settings › Advanced","Grouped tuning sections appear: Performance, Retry behavior, Data scope, Retention, and more."));
push(...step(2,"In the Data scope section, switch each data category on or off as your project requires — Compensation, Bank accounts, Identity documents, Dependents, Emergency contacts, Positions, and others.","Advanced › Data scope","Each toggle reflects your choice. A category switched off is skipped on every sync and its fields stay empty in Nabd.","05-advanced-data-scope.png","The Advanced page — Performance, Retry behavior, and the Data scope toggles."));
push(...step(3,"Leave Active employees only on unless you explicitly need historical or inactive records. Under Operating countries, select the countries where your employees are paid, then choose Save changes.","Advanced › Performance / Operating countries › Save changes","An “Advanced settings saved.” confirmation appears."));
push(callout("warn","Data-scope toggles are not retroactive. Switching a category on brings it in on the next sync onward — records already synced are not back-filled. Set scope before your first full load whenever you can."), spacer(120));

push(H2("Task 4 — Set the sync schedules"));
push(roleTag("Integration Administrator"), spacer(60));
push(...step(1,"Open the Schedule page.","Settings › Schedule","A card appears for each stream (Employees, Leave, Foundation) with a Frequency picker and a live schedule preview, above a 24-hour timeline.","06-sync-schedule.png","The Schedule page — per-stream cards with frequency, time and the cron expression preview."));
push(...step(2,"For each stream, choose a Frequency and fill the contextual fields (the time for Daily at, or the interval for Every N hours). Then choose Save changes.","Schedule › stream card › Frequency › Save changes","The expression preview and the Next badge update, and a “Schedule saved.” confirmation appears."));
push(callout("note","All schedule times are in UTC. You can pause a single stream from its card with Disable, and resume it with Enable, without changing its schedule."), spacer(120));

push(H2("Task 5 — Run the first sync and load the data"));
push(roleTag("Integration Administrator  /  Consultant"), spacer(60));
push(...step(1,"Open the Hub and choose Sync all now (or open a single stream and choose Sync now).","Hub › Sync all now","The affected streams move to a running state and show “Running now…”."));
push(...step(2,"Wait for the runs to finish, then open Data Streams › Employees to confirm the load.","Data Streams › Employees","The stream reads Healthy; Total active persons in Nabd matches the expected head-count and the last sync shows records processed with 0 errored.","07-stream-employees.png","The Employees stream after the first sync — 82 active persons, Healthy, 0 errored."));

push(H2("Task 6 — Manage a stream from the Actions tab"));
push(roleTag("Integration Administrator"), spacer(60));
push(...step(1,"Open a stream and choose the Actions tab to run or repair it.","Data Streams › Employees › Actions","The Actions tab shows the current query mode plus Run sync now, Re-initialize from scratch, and Rewind pointer controls.","08-stream-actions.png","The Employees stream Actions tab — run sync, re-initialize, or rewind the pointer."));
push(callout("note","Re-initialize from scratch runs a full initialLoad (every employee, no delta filter) — use it after onboarding or if the delta pointer is suspected to be missing rows. Rewind pointer re-fetches a fixed window on the next sync."), spacer(120));

// 6 Validation
push(sec(6,"Validation & Expected Results"));
push(lead("The configuration is complete when all of the following are true."));
push(dataTable([{w:2600,label:"Check"},{w:2760,label:"Where"},{w:4000,label:"Expected result"}],[
  ["SuccessFactors connection","Settings › Connection","Status badge reads Connected; setup tests pass."],
  ["S/4HANA Cloud connection","Settings › Connection","Status badge reads Connected."],
  ["Data scope","Settings › Advanced","Categories in project scope are on; operating countries selected."],
  ["Schedules","Settings › Schedule","Each stream shows a Next run; no stream is unintentionally paused."],
  ["First load","Hub","All streams Healthy; Runs today shows successes, not failures."],
  ["Employees","Data Streams › Employees","Head-count matches the expected number of active employees."],
  ["Foundation","Data Streams › Foundation","Reports Healthy with active reference accounts."],
]));

// 7 Troubleshooting
push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:2900,label:"Symptom"},{w:3100,label:"Likely cause"},{w:3360,label:"What to do"}],[
  ["Connection test fails immediately","BTP destination name mistyped or wrong capitalisation.","Re-enter the BTP Destination Name exactly as configured in BTP; it is case-sensitive."],
  ["S/4 test shows a SuccessFactors error page","The destination points at the SF tenant, not S/4.","Update the BTP destination to the S/4 hostname and test again."],
  ["Test is slow, then recovers","SuccessFactors returned a temporary rate-limit or transient error.","Retry. The sync engine backs off and retries automatically on transient errors."],
  ["Operating-countries list looks generic","Foundation has not synced yet, so the picker shows a fallback list.","Run a Foundation sync; the picker then loads live countries."],
  ["Employees synced but salary / bank empty","Compensation or Bank accounts scope is switched off.","Switch the category on in Advanced › Data scope, then re-sync (new data onward)."],
],C.crimson));

// 8 Tips
push(sec(8,"Tips & Notes"));
[["best","Set your data scope (Task 3) before the very first employee load. Because scope changes are not retroactive, getting it right up front saves a full re-pull later."],
 ["tip","Use Test connection as a quick pre-flight any time a sync behaves oddly — it confirms in seconds whether the pipe itself is the problem before you dig into the data."],
 ["note","Foundation reference data (companies, departments, job codes) refreshes on its own weekly schedule. If a newly-added company or job code is missing in Nabd, run the Foundation stream rather than Employees."]].forEach(t=>{push(callout(t[0],t[1])); push(spacer(80));});

// 9 Key terms
push(sec(9,"Key Terms"));
push(dataTable([{w:2600,label:"Term"},{w:6760,label:"Meaning"}],[
  ["BTP destination","A connection profile managed in SAP BTP that holds the upstream address and credentials. Nabd refers to it by name and never stores the credentials itself."],
  ["Company ID","The identifier of your SuccessFactors tenant."],
  ["Chart of accounts","The S/4HANA Cloud key identifying the general-ledger account structure. Nabd syncs one chart per deployment."],
  ["Stream","One category of data that syncs on its own schedule — Employees, Leave, Foundation, Time-account balances, or GL accounts."],
  ["Foundation","The reference catalogs from SuccessFactors — companies, departments, divisions, job codes, locations, pay components and similar."],
  ["Data scope","The set of employee data categories you choose to bring into Nabd, configured on the Advanced page."],
  ["Sync","A one-way pull of data from an upstream system into Nabd. Nabd never writes back."],
]));

// 10 Sign-off
push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they have completed this Core Integration Configuration training and can set up and verify the upstream connections independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join("screenshots/bp01_shots","BP-01_Core_Integration_Configuration_KUT.docx")); })();
