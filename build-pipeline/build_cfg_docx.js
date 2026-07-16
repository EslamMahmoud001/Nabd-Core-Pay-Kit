const path=require("path");
const L=require("./kutlib");
const { C,H1,H2,P,R,kvTable,dataTable,callout,bullet,coverPage,buildDoc,writeDoc,stepHeader,figureImg,spacer,TableOfContents,Paragraph,PageBreak }=L;
const IMG=(f)=>path.join("screenshots/cfg_shots",f);
const meta={ bpId:"CFG-01", title:"Payroll Configuration", module:"Nabd Pay",
  version:"2.0", status:"Draft", date:"12 July 2026", classification:"Internal — Project Use" };
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
  ["Module","Nabd Pay  ·  Configuration (Component Studio, Rule Studio, catalogues)"],
  ["Business process","CFG-01 — Payroll Configuration (core authoring surfaces)"],
  ["Document owner","Nabd Delivery Team"],["Author","Nabd Delivery Team"],
  ["Reviewed by","Pending review"],["Approved by","Pending approval"],
  ["Version","2.0"],["Status","Draft"],
  ["Environment","Nabd Pay — QA / project tenant"],["Classification","Internal — Project Use"],
]));
push(spacer(120), H2("Revision history"));
push(dataTable([{w:1100,label:"Version"},{w:1500,label:"Date"},{w:3160,label:"Summary of change"},{w:3600,label:"Author"}],[
  ["1.0","09 Jul 2026","Initial configuration reference (broad, reference style)","Nabd Delivery Team"],
  ["2.0","12 Jul 2026","Task-based KUT of the core config surfaces; real screenshots; metadata completed","Nabd Delivery Team"],
]));
push(new Paragraph({children:[new PageBreak()]}));
push(H1("Contents"));
push(new TableOfContents("Table of Contents",{hyperlink:true,headingStyleRange:"1-2"}));
push(P(R("Right-click and choose “Update Field” in Word to refresh page numbers.",{italics:true,size:16,color:C.grey}),{spacing:{before:80}}));
push(new Paragraph({children:[new PageBreak()]}));

push(sec(1,"Purpose & Learning Outcomes"));
push(lead("This manual covers the core payroll configuration surfaces in Nabd Pay — the Pay Item catalogue (Component Studio), calculation Rules (Rule Studio), and the supporting catalogues (Parameters, Brackets, Counters, Populations). Together these define what the payroll engine can produce and how it calculates. (Preflight/Readiness and the Approval workflow are covered in their own manuals.)"));
push(H2("After this training you will be able to:"));
["Classify Pay Items and set each cumulation and behaviour flag deliberately, then activate them.",
 "Author a calculation Rule with the formula language, choosing the right phase and output.",
 "Maintain the supporting catalogues — Parameters, Brackets, Counters, and Populations — that Rules depend on.",
 "Know who may configure what, and why draft items never run."].forEach(o=>push(bullet(o)));
push(spacer(60), callout("note","One catalogue, three owners: some items and tables ship in a Country pack, some are Tenant-authored, and some are seeded (scaffolded) from SuccessFactors as drafts. Everything is effective-dated — a change opens a new dated version rather than overwriting history."));

push(sec(2,"Process at a Glance"));
push(kvTable([
  ["Trigger","Standing up a deployment, or changing how payroll calculates."],
  ["Frequency","During setup; maintained as rules, rates and packs change."],
  ["Roles involved","Tenant Admin, Consultant, Payroll Admin (author). Approver roles (Payroll Manager, HR Director, Finance) cannot edit configuration."],
  ["Inputs","SuccessFactors pay components, country-pack rules, and the calculations your policy needs."],
  ["Outputs","Activated Pay Items and Rules the engine reads at run time; catalogues they depend on."],
  ["Where","Nabd Pay › Configuration (Component Studio, Rule Studio, Parameters, Brackets, Counters, Populations)"],
],C.magenta));

push(sec(3,"Key Concepts"));
["Pay Item — the canonical identity of a line item. It declares what kind of line it is (earning / deduction), which statutory buckets it feeds (Gross, Taxable, SI base, Valuation basis), and how the engine treats edge cases. Rules and SF bindings produce the value; the Pay Item classifies it.",
 "Rule — one calculation: “if population, then write formula to output.” Every rule has a phase (when it fires — Prepare, Rate, Earn, Pre-tax adjust, Post-tax) and an output kind (Pay Item, Binding, or Counter).",
 "Supporting catalogues — Parameters (effective-dated values formulas reference), Brackets (tiered rate tables such as tax brackets and EoS scales), Counters (running balances like leave taken), and Populations (saved employee scopes a rule applies to).",
 "Draft vs active — an item scaffolded from SuccessFactors is a draft: a typing shortcut with inferred flags. Draft items never run — a person must review every flag and Activate them first."].forEach(t=>push(bullet(t)));
push(spacer(40), callout("warn","Scaffolded items carry no tax or social-insurance treatment from SuccessFactors — review every bucket flag before you activate an item, or it will feed the wrong statutory bases."));

push(new Paragraph({children:[new PageBreak()]}));
push(sec(4,"Step-by-Step"));
push(lead("Follow the tasks in order. Configuration authoring is restricted to Tenant Admin, Consultant and Payroll Admin."));

push(H2("Task 1 — Pay Items (Component Studio)"));
push(roleTag("Tenant Admin / Consultant / Payroll Admin"), spacer(60));
push(...step(1,"Open Component Studio and review the Pay Item catalogue.","Nabd Pay › Configuration › Component Studio","The catalogue lists every Pay Item with its kind, owner, and the buckets it feeds (G T S V). Search and filter by owner (All / Tenant / Country pack) and country. Use Scaffold from catalogue to seed drafts for SF pay components, or Add pay item to create one.","01-component-studio.png","Component Studio — the Pay Item catalogue (46 items seeded from the Egypt pack)."));
push(...step(2,"Open a Pay Item, review its classification, then Activate it.","Component Studio › Configure (on a row)","A side panel opens with the item’s identity (key, name, kind, country, unit, currency, rounding), its optional SF pay-component binding, its effective window, and the cumulation contract (which buckets it feeds). A draft item shows a banner; review the flags and choose Activate — a draft never participates in a run.","02-pay-item-editor.png","The Pay Item editor — identity, SF binding, effective window and the bucket contract.","Setting the SF binding passes the employee’s SF value straight through — no Rule needed. Leave it empty if a Rule or Scheme emits the item."));

push(H2("Task 2 — Rules (Rule Studio)"));
push(roleTag("Tenant Admin / Consultant / Payroll Admin"), spacer(60));
push(...step(1,"Open Rule Studio and start a new rule from a template.","Nabd Pay › Configuration › Rule Studio › New rule","Every calculation is one Rule — “if population, then write formula to output.” Pick a starter template (e.g. “Overtime × 1.5”, “Basic salary passthrough”, “Percent of component”) to pre-fill the key, names and formula, then work through the 4-step wizard: Identity → Output (phase + kind + target) → Formula → Review.","03-rule-studio.png","Rule Studio — start a rule from a template, then author it in the 4-step wizard."));
push(callout("note","Phase decides when the formula fires (Prepare · Rate · Earn · Pre-tax adjust · Post-tax); output kind decides what the result becomes (a Pay Item line, a named Binding other rules read, or a Counter delta). Choose the phase by what the formula needs to read."), spacer(120));

push(H2("Task 3 — Supporting catalogues"));
push(roleTag("Tenant Admin / Consultant / Payroll Admin"), spacer(60));
push(...step(1,"Maintain Parameters — the effective-dated values formulas reference.","Configuration › Parameters › New parameter","Parameters hold rates, thresholds and limits that Rules and Schemes read by key. Add a parameter (or seed from a country pack); each is effective-dated.","04-parameters.png","Parameters — effective-dated rates, thresholds and limits."));
push(...step(2,"Maintain Bracket Tables — the tiered rate tables rules look up.","Configuration › Bracket Tables › Browse country pack","Bracket tables hold tiered/step calculations — income-tax brackets, end-of-service scales, and similar. Add a table or seed one from a country pack.","05-brackets.png","Bracket Tables — tiered rate tables (tax brackets, EoS scales)."));
push(...step(3,"Maintain Counters — the running balances payroll updates.","Configuration › Counters","A Counter is a running balance (for example leave taken) that Rules read and update via a Counter-kind output. Define the counter, then wire it into payroll from a rule.","06-counters.png","Counters — running balances wired into payroll by rules."));
push(...step(4,"Maintain Populations — the saved employee scopes a rule targets.","Configuration › Populations","A Population is a saved scope of employees. A Rule can target a Population, or apply to “All employees”. Define the scope here, then reference it from a Rule’s Identity step.","07-populations.png","Populations — saved employee scopes that rules target."));

push(sec(5,"Validation & Expected Results"));
push(lead("Configuration is in good shape when:"));
push(dataTable([{w:2900,label:"Check"},{w:2900,label:"Where"},{w:3560,label:"Expected result"}],[
  ["Pay Items classified","Component Studio","Each item you will run is Active (not Draft) with the correct bucket flags."],
  ["Rules author cleanly","Rule Studio","Each rule has a phase, an output kind and target, and a valid formula."],
  ["Catalogues populated","Parameters / Brackets / Counters","The rates, tables and counters your rules reference exist."],
  ["Scopes exist","Populations","Any population a rule targets is defined."],
]));

push(sec(6,"Common Errors & Troubleshooting"));
push(dataTable([{w:2900,label:"Symptom"},{w:3100,label:"Likely cause"},{w:3360,label:"What to do"}],[
  ["A pay item never appears on results","The item is still Draft.","Open it in Component Studio, review the flags, and Activate — drafts are excluded from runs."],
  ["“No rule — computes 0”","No Rule feeds a calculated pay item.","Author a Rule in Rule Studio whose output targets that Pay Item, or set the item’s SF binding for a passthrough."],
  ["A formula can’t find a value","The Parameter, Bracket table or Counter it references doesn’t exist.","Create the missing catalogue entry (or seed it from the country pack), then re-validate the rule."],
  ["A rule applies to the wrong people","The population scope is wrong or missing.","Fix the Population, or set the rule to “All employees”."],
],C.crimson));

push(sec(7,"Tips & Notes"));
[["best","Scaffold Pay Items from the country pack to save typing — but treat every scaffolded item as a draft and review its bucket flags before activating."],
 ["tip","Start a Rule from the closest starter template; it pre-fills the key, names and formula so you only adjust the specifics."],
 ["note","Everything here is effective-dated. A change opens a new dated version rather than overwriting history — you can always see what applied on a past date."]].forEach(t=>{push(callout(t[0],t[1])); push(spacer(80));});

push(sec(8,"Key Terms"));
push(dataTable([{w:2600,label:"Term"},{w:6760,label:"Meaning"}],[
  ["Pay Item","The canonical identity of a pay line — its kind, the buckets it feeds, and its edge-case behaviour."],
  ["Cumulation contract","Which statutory buckets a Pay Item feeds: Gross (G), Taxable (T), SI base (S), Valuation basis (V)."],
  ["Rule","One calculation — a formula, a phase (when it fires) and an output (Pay Item, Binding, or Counter)."],
  ["Phase","When in the cycle a rule fires — Prepare, Rate, Earn, Pre-tax adjust, or Post-tax."],
  ["Parameter","An effective-dated value (rate, threshold, limit) that rules and schemes reference by key."],
  ["Bracket table","A tiered / step rate table (income-tax brackets, EoS scales) that rules look up."],
  ["Counter","A running balance (e.g. leave taken) that rules read and update."],
  ["Population","A saved scope of employees that a rule can target."],
  ["Draft / Active","A scaffolded item is a Draft (excluded from runs) until a person reviews its flags and Activates it."],
]));

push(sec(9,"Training Sign-Off"));
push(lead("By signing below, the trainee confirms they can classify Pay Items, author Rules, and maintain the supporting catalogues independently in the QA environment."));
push(dataTable([{w:2600,label:"Field"},{w:6760,label:""}],[
  ["Trainee name",""],["Role",""],["Trainer / KUT owner",""],["Date completed",""],["Trainee signature",""],["Result","☐  Competent      ☐  Needs follow-up"],
],C.navy));

(async()=>{ await writeDoc(buildDoc(meta,body), path.join("screenshots/cfg_shots","Nabd_Pay_Configuration_Guide_KUT.docx")); })();
