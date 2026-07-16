const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const { Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,VerticalAlign,AlignmentType }=require("docx");
const IMG=(f)=>path.join("screenshots/bp02_shots",f);
const meta={ bpId:"BP-02", title:"Employee Master Data Foundation", module:"Nabd Core",
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
  ["Module","Nabd Core — SuccessFactors employee & Foundation replication"],
  ["Business process","BP-02 — Employee Master Data Foundation"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","2.0"],["Status","Draft"],
  ["Environment","Nabd Core — QA / project tenant"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","09 Jul 2026","Initial draft from code + feature docs","Nabd Delivery Team"],
  ["2.0","12 Jul 2026","Real Data Browser screenshots per action; removed Prerequisites section; metadata completed","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("The Employee Master Data Foundation is Nabd’s own copy of every employee’s record — replicated one way from SAP SuccessFactors — together with the Foundation reference catalog (companies, departments, job codes and more) that those records point at. Every other part of Nabd, from the payroll engine to reports, reads this foundation. This manual explains what it holds, where it comes from, and how to find, read and verify it."));
push(H2("After this training you will be able to:"));
["Understand what the employee master data and the Foundation catalog contain, and how they fit together.",
 "Find any employee and open their full record in the Data Browser.",
 "Read a person’s effective-dated job and compensation history correctly.",
 "Browse the Foundation reference catalog — companies, departments, job codes and more.",
 "Know what your role is allowed to see, and why some fields are masked."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","Every record hangs off one stable key — the SuccessFactors personIdExternal — which survives rehires and transfers. It is why a rehired employee keeps their full history in Nabd."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","After Core Integration (BP-01) has synced employees and Foundation."],
  ["Frequency","Ongoing — a read-only reference used every day."],
  ["Roles involved","Integration Administrator (full view); Consultant (sensitive fields masked)."],
  ["Inputs","SuccessFactors employee + Foundation syncs (one-way)."],
  ["Outputs","A browsable, effective-dated foundation the whole product reads from."],
  ["Where","Nabd Core › Operations › Data Browser"],
],C.magenta));

push(sec(3,"Roles & Responsibilities"));
push(lead("Master data is read-only in Nabd — it is edited upstream in SuccessFactors. What you can see depends on your role, because sensitive fields are masked."));
push(dataTable([{w:2600,label:"Role"},{w:6760,label:"What they see"}],[
  ["Integration Administrator","The full record in the Data Browser, including sensitive fields such as salary, national ID and bank details."],
  ["Consultant","The same records and structure, but with sensitive fields (salary, national ID, bank) masked."],
],C.magenta));
push(spacer(80), callout("warn","Employee master data is edited in SuccessFactors, not Nabd. The Data Browser is a read-only view, and sensitive fields (salary, national ID, bank account) are shown or masked according to your role."));

push(sec(4,"Process Overview"));
push(lead("The employee sync pulls each person from SuccessFactors one way and lands them as a set of linked records — identity, employment, and effective-dated job, compensation and pay-component history — plus contacts, addresses, identity documents, dependents and bank accounts. Nabd never writes any of it back upstream. Job and pay data are kept as effective-dated slices: the slice that applies today is the open one — its “Effective to” reads Current. Alongside people, the Foundation sync lands the reference catalog those records point at — a person’s job slice carries codes; the Foundation catalog gives those codes their names."));
push(spacer(40), callout("note","The open, current slice uses the date 9999-12-31 as its “Effective to”, shown in the app as Current. Everything else is history."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(5,"Step-by-Step"));
push(lead("The whole foundation is viewable from one place — the Data Browser. Follow the tasks in order; each shows the action, where to find it, and what you should see."));

push(H2("Task 1 — Open the Data Browser and find a person"));
push(roleTag("Integration Administrator  /  Consultant"), spacer(60));
push(...step(1,"Open the Data Browser.","Nabd Core › Operations › Data Browser","A three-part view opens: a category rail, an employee list, and a detail pane. People is selected and the first person’s Overview is shown — identity (name, Person ID, hire date, tenure, job title, manager) and today’s effective values.","01-overview.png","The Data Browser — People category, an employee’s Overview open."));
push(...step(2,"Confirm People is selected, then find a person by name or Person ID.","Data Browser › People › Search","The middle list shows every synced employee with a count (for example “82 of 82”), and filters as you type. Select a name to open its detail pane.",null,null,"The stable key is the Person ID (external) — it survives rehires."));

push(H2("Task 2 — Read a person’s record across the tabs"));
push(roleTag("Integration Administrator  /  Consultant"), spacer(60));
push(...step(1,"Open the Job history tab.","person › Job history","One row per effective-dated slice. The slice that applies today is tagged Current, with its effective-from date, event, job code, title, company and country.","02-job-history.png","Job history — one effective-dated slice per change; the open slice is tagged Current."));
push(...step(2,"Open the Compensation tab to read the salary summary.","person › Compensation","The salary summary appears. These fields are masked unless your role may see compensation.","03-compensation.png","Compensation — salary summary (visible to roles that hold the tier; masked otherwise)."));
push(...step(3,"Open Pay components to see the recurring pay lines.","person › Pay components","The individual recurring pay-component amounts (for example base, housing, transport), each stored per effective slice.","04-pay-components.png","Pay components — recurring pay lines per effective slice."));
push(...step(4,"Open the Personal tab.","person › Personal","Contact details, addresses, identity documents and dependents. National ID and similar identity fields are masked unless your role may see them.","05-personal.png","Personal — contacts, addresses and identity documents (identity fields masked per role)."));

push(H2("Task 3 — Browse the Foundation catalog"));
push(roleTag("Integration Administrator  /  Consultant"), spacer(60));
push(...step(1,"Switch to the Foundation category.","Data Browser › Foundation","A list of Foundation tables appears — Companies, Departments, Job Codes, Locations, and more.","06-foundation-tables.png","The Foundation category — the reference tables synced from SuccessFactors."));
push(...step(2,"Choose a table — for example Job Codes — and filter to find an entry.","Foundation › Job Codes › Filter","A grid of rows appears with the code, name and status, and a row count; the grid filters as you type.","07-foundation-jobcodes.png","The Foundation catalog — the Job Codes table.","A Foundation row carries an “Active” status — check it before relying on a catalog row."));

push(H2("Task 4 — Trace a record back to its source"));
push(roleTag("Integration Administrator"), spacer(60));
push(...step(1,"Open a person and select the Raw snapshot tab.","person › Raw snapshot","The raw record SuccessFactors sent on the last sync, exactly as received — use it to confirm the source of any value."));
push(callout("tip","If the raw snapshot holds the right value but Nabd shows a different one, it is a mapping or sync issue to raise. If the snapshot is also wrong, the fix belongs in SuccessFactors."), spacer(120));

push(sec(6,"Validation & Expected Results"));
push(lead("You are looking at a complete, healthy foundation when all of the following are true."));
push(dataTable([{w:2600,label:"Check"},{w:2760,label:"Where"},{w:4000,label:"Expected result"}],[
  ["Employees are present","Data Browser › People","The list shows the expected head-count."],
  ["A record is complete","People › Overview · Job history","Identity is populated and there is a current job slice tagged Current."],
  ["Compensation is present","People › Compensation · Pay components","A salary summary and pay-component rows appear (masked per role)."],
  ["Foundation is populated","Data Browser › Foundation","Job Codes, Companies, Departments and similar tables have rows."],
  ["Masking behaves","Data Browser (per role)","Sensitive fields are visible only to roles that hold the tier."],
]));

push(sec(7,"Common Errors & Troubleshooting"));
push(dataTable([{w:2900,label:"Symptom"},{w:3100,label:"Likely cause"},{w:3360,label:"What to do"}],[
  ["The People list is empty","The employee sync has not landed any data yet.","Run the Employees stream (BP-01, Task 5) and confirm it succeeds on the Hub."],
  ["A Foundation table shows “No rows”","The Foundation sync has not populated that table.","Run the Foundation stream, then reopen the table."],
  ["A field shows “—”","The value is empty in SuccessFactors, or its category is out of scope.","Check it in SuccessFactors, or enable the category in Advanced › Data scope and re-sync."],
  ["Salary / national ID / bank look masked","Your role does not hold the tier for that field.","By design — a role with the matching tier sees the raw value."],
  ["A record looks out of date","The last sync was a while ago, or a delta run is pending.","Check the stream’s last sync on the Hub and run Sync now if needed."],
],C.crimson));

push(sec(8,"Tips & Notes"));
[["best","Use personIdExternal, not the SuccessFactors userId, to refer to a person. It is stable across rehires, so a rehired employee keeps their full history under the same key."],
 ["tip","On Job history and Compensation, the slice tagged Current is what applies today; the older slices are history. Read them to see exactly what was true on a past date."],
 ["note","The Data Browser is read-only. To correct any employee master data, fix it in SuccessFactors and re-sync — Nabd never writes back upstream."]].forEach(t=>{push(callout(t[0],t[1])); push(spacer(80));});

push(sec(9,"Key Terms"));
push(dataTable([{w:2600,label:"Term"},{w:6760,label:"Meaning"}],[
  ["Employee master data","The per-person record replicated from SuccessFactors — identity, employment, job and pay history, contacts and documents."],
  ["Foundation","The SuccessFactors reference catalogs — companies, departments, job codes, locations, pay components — that employee records point at."],
  ["personIdExternal","The stable employee key that survives rehires and transfers; the identifier Nabd uses everywhere."],
  ["Effective dating","Keeping job and pay data as dated slices; the open slice (Effective to = Current) is the one that applies today."],
  ["Pay component","One line of recurring pay — for example base, housing or transport — stored per effective slice."],
  ["Sensitivity tier","The rule that decides which roles may see a sensitive field such as salary, national ID or bank details."],
  ["Raw snapshot","The unmodified record SuccessFactors sent on a sync, kept so you can confirm the source of any value."],
]));

push(sec(10,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they have completed this Employee Master Data Foundation training and can find, read and verify a person’s record independently."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join("screenshots/bp02_shots","BP-02_Employee_Master_Data_Foundation_KUT.docx")); })();
