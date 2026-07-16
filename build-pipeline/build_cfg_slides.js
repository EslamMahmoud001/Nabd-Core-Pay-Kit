const path=require("path");
const S=require("./build_slides.js");
const PptxGenJS=require("pptxgenjs");
const IMG=(f)=>path.join("screenshots/cfg_shots",f);
const meta={ bpId:"CFG-01", title:"Payroll Configuration", module:"Nabd Pay", version:"2.0", status:"Draft", date:"July 2026" };
const outcomes=[
  "Classify Pay Items and set each cumulation/behaviour flag deliberately, then activate them.",
  "Author a calculation Rule with the formula language — choosing the right phase and output.",
  "Maintain the supporting catalogues (Parameters, Brackets, Counters, Populations) rules depend on.",
  "Know who may configure what, and why draft items never run."];
const rolesTbl={head:["Role","Can they configure?"],rows:[
  ["Tenant Admin / Consultant / Payroll Admin","Yes — author Pay Items, Rules and the catalogues."],
  ["Payroll Manager / HR Director / Finance","No — approver roles cannot edit configuration."]]};
const glossaryTbl={head:["Term","Meaning"],rows:[
  ["Pay Item","The identity of a pay line — kind, the buckets it feeds (G T S V), edge-case behaviour."],
  ["Rule","One calculation — a formula, a phase (when it fires) and an output (Pay Item, Binding, Counter)."],
  ["Phase","When a rule fires — Prepare, Rate, Earn, Pre-tax adjust, Post-tax."],
  ["Parameter / Bracket","Effective-dated values and tiered rate tables that rules reference."],
  ["Draft / Active","A scaffolded item is a Draft (excluded from runs) until reviewed and Activated."]]};
const troubleTbl={head:["Symptom","Likely cause","What to do"],rows:[
  ["A pay item never appears on results","The item is still Draft.","Open it, review the flags, Activate — drafts are excluded from runs."],
  ["“No rule — computes 0”","No Rule feeds a calculated pay item.","Author a Rule whose output targets that Pay Item, or set an SF binding."],
  ["A formula can’t find a value","A referenced Parameter/Bracket/Counter is missing.","Create it (or seed from the country pack), then re-validate."]]};
const validation=[
  "Each item you will run is Active (not Draft) with the correct bucket flags.",
  "Each rule has a phase, an output kind + target, and a valid formula.",
  "The rates, tables and counters your rules reference exist.",
  "Any population a rule targets is defined."];
const tips=[
  {kind:"best",text:"BEST PRACTICE — Scaffold Pay Items to save typing, but review every bucket flag before activating."},
  {kind:"tip",text:"TIP — Start a Rule from the closest starter template; it pre-fills the key, names and formula."},
  {kind:"note",text:"NOTE — Everything is effective-dated: a change opens a new dated version, never overwriting history."}];
const STEPS=[
  {tag:"Task 1 — Pay Items",role:"Tenant Admin / Consultant / Payroll Admin",n:1,action:"Open Component Studio and review the catalogue.",nav:"Configuration › Component Studio",expected:"Every Pay Item with its kind, owner and the buckets it feeds; scaffold or add items.",img:"01-component-studio.png",cap:"Component Studio — the Pay Item catalogue."},
  {tag:"Task 1 — Pay Items",role:"Tenant Admin / Consultant / Payroll Admin",n:2,action:"Open a Pay Item, review its flags, then Activate.",nav:"Component Studio › Configure",expected:"Identity, SF binding, effective window and the cumulation contract (buckets). Draft items must be activated.",img:"02-pay-item-editor.png",cap:"The Pay Item editor — identity + bucket contract."},
  {tag:"Task 2 — Rules",role:"Tenant Admin / Consultant / Payroll Admin",n:1,action:"Start a rule from a template in Rule Studio.",nav:"Configuration › Rule Studio › New rule",expected:"“If population, then write formula to output.” A template pre-fills the 4-step wizard (Identity → Output → Formula → Review).",img:"03-rule-studio.png",cap:"Rule Studio — start from a template."},
  {tag:"Task 3 — Catalogues",role:"Tenant Admin / Consultant / Payroll Admin",n:1,action:"Maintain Parameters.",nav:"Configuration › Parameters",expected:"Effective-dated rates, thresholds and limits that rules reference by key.",img:"04-parameters.png",cap:"Parameters — effective-dated values."},
  {tag:"Task 3 — Catalogues",role:"Tenant Admin / Consultant / Payroll Admin",n:2,action:"Maintain Bracket Tables.",nav:"Configuration › Bracket Tables",expected:"Tiered rate tables — income-tax brackets, EoS scales — rules look up.",img:"05-brackets.png",cap:"Bracket Tables — tiered rate tables."},
  {tag:"Task 3 — Catalogues",role:"Tenant Admin / Consultant / Payroll Admin",n:3,action:"Maintain Counters.",nav:"Configuration › Counters",expected:"Running balances (e.g. leave taken) that rules read and update.",img:"06-counters.png",cap:"Counters — running balances."},
  {tag:"Task 3 — Catalogues",role:"Tenant Admin / Consultant / Payroll Admin",n:4,action:"Maintain Populations.",nav:"Configuration › Populations",expected:"Saved employee scopes a rule can target (or apply to All employees).",img:"07-populations.png",cap:"Populations — saved employee scopes."},
];
(async()=>{
  const pptx=new PptxGenJS(); pptx.defineLayout({name:"KUT",width:S.W,height:S.H}); pptx.layout="KUT";
  const eq=(n)=>{const t=S.W-2*S.M;return Array(n).fill(+(t/n).toFixed(2));};
  S.titleSlide(pptx,meta);
  S.bulletsSlide(pptx,meta,"What you will learn","Learning Outcomes",outcomes,meta.bpId+"  ·  Outcomes");
  S.tableSlide(pptx,meta,"Who configures","Roles & Responsibilities",rolesTbl.head,rolesTbl.rows,[4.2,8.33],S.C.magenta,meta.bpId+"  ·  Roles");
  S.sectionDivider(pptx,"Section","Configure the payroll engine","Pay Items, Rules and the catalogues they depend on");
  STEPS.forEach(st=>S.stepSlide(pptx,meta,{tag:st.tag,role:st.role,n:st.n,action:st.action,nav:st.nav,expected:st.expected,imgPath:IMG(st.img),screenshot:st.cap,footerRight:meta.bpId+"  ·  "+st.tag.split("—")[0].trim()}));
  S.bulletsSlide(pptx,meta,"How you know it worked","Validation & Expected Results",validation,meta.bpId+"  ·  Validation");
  S.tableSlide(pptx,meta,"If something goes wrong","Common Errors & Troubleshooting",troubleTbl.head,troubleTbl.rows,eq(3),S.C.crimson,meta.bpId+"  ·  Troubleshooting");
  S.tipsSlide(pptx,meta,tips);
  S.tableSlide(pptx,meta,"Reference","Key Terms",glossaryTbl.head,glossaryTbl.rows,[3.4,8.93],S.C.navy,meta.bpId+"  ·  Key terms");
  S.closingSlide(pptx,meta);
  await pptx.writeFile({fileName:path.join("screenshots/cfg_shots","Nabd_Pay_Configuration_Guide_KUT.pptx")});
  console.log("deck: "+STEPS.length+" step slides");
})();
