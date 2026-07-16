const path = require("path");
const PptxGenJS = require("pptxgenjs");
const ASSET = (f) => path.join(__dirname, "assets", f);

const C = { teal:"43BECC", navy:"121B43", magenta:"8E257A", lime:"BCD647", crimson:"E21F4A",
  ink:"1A1A2E", body:"2B2B3A", grey:"6B6B7B", line:"D9DCE6",
  tint:"F4F6FB", tealTint:"EAF8FA", limeTint:"F5F9E4", magTint:"F6EAF3", crimTint:"FCEAEE", navyTint:"E9EBF2", amberTint:"FBF1DF", amber:"C77A00", green:"2E7D32" };
const W = 13.33, H = 7.5, M = 0.5;
const FS = "Arial";

function footer(slide, meta, right) {
  slide.addText([{ text:(meta.module||"Nabd Pay"), options:{ bold:true, color:C.navy }}, { text:"  ·  Key User Training", options:{ color:C.grey }}],
    { x:M, y:H-0.42, w:7, h:0.3, fontFace:FS, fontSize:9, align:"left" });
  slide.addText(right||"", { x:W-4.5-M, y:H-0.42, w:4.5, h:0.3, fontFace:FS, fontSize:9, color:C.grey, align:"right" });
  slide.addShape("line", { x:M, y:H-0.5, w:W-2*M, h:0, line:{ color:C.line, width:1 } });
}
function eyebrow(slide, text, x, y, w, color) {
  slide.addText(text.toUpperCase(), { x, y, w, h:0.3, fontFace:FS, fontSize:11, bold:true, color:color||C.magenta, charSpacing:2, align:"left" });
}
function title(slide, text, opts={}) {
  slide.addText(text, { x:M, y:0.5, w:W-2*M, h:0.8, fontFace:FS, fontSize:30, bold:true, color:C.navy, align:"left", ...opts });
}
function dots(slide, x, y) {
  [C.teal,C.magenta,C.lime,C.crimson,C.teal].forEach((c,i)=>
    slide.addShape("ellipse",{ x:x+i*0.32, y, w:0.16, h:0.16, fill:{color:c}, line:{type:"none"} }));
}

function titleSlide(pptx, meta) {
  const s = pptx.addSlide(); s.background = { color:C.navy };
  try { s.addImage({ path:ASSET("raptors_icon.png"), x:W/2-0.55, y:0.9, w:1.1, h:1.23 }); } catch(e){}
  s.addText((meta.module||"Nabd Pay").toUpperCase(), { x:0, y:2.3, w:W, h:0.9, fontFace:FS, fontSize:52, bold:true, color:"FFFFFF", align:"center", charSpacing:4 });
  s.addText("Key User Training  ·  User Manual", { x:0, y:3.2, w:W, h:0.5, fontFace:FS, fontSize:18, bold:true, color:C.teal, align:"center", charSpacing:2 });
  s.addShape("roundRect",{ x:W/2-4.2, y:4.0, w:8.4, h:1.35, rectRadius:0.1, fill:{color:"1B2657"}, line:{color:C.teal, width:1} });
  s.addText(meta.bpId+"  ·  "+meta.module, { x:W/2-4.2, y:4.15, w:8.4, h:0.35, fontFace:FS, fontSize:13, bold:true, color:C.teal, align:"center", charSpacing:2 });
  s.addText(meta.title, { x:W/2-4.2, y:4.5, w:8.4, h:0.75, fontFace:FS, fontSize:28, bold:true, color:"FFFFFF", align:"center" });
  dots(s, W/2-0.72, 5.6);
  s.addText("Version "+meta.version+"  ·  "+meta.status+"  ·  "+meta.date, { x:0, y:6.0, w:W, h:0.35, fontFace:FS, fontSize:12, color:"C9CEDE", align:"center" });
  s.addText("Raptors Technology  ·  SAP Gold Partner", { x:0, y:6.9, w:W, h:0.3, fontFace:FS, fontSize:11, color:"8B93B0", align:"center" });
}

function sectionDivider(pptx, kicker, titleText, subtitle) {
  const s = pptx.addSlide(); s.background = { color:C.navy };
  eyebrowCentered(s, kicker);
  s.addText(titleText, { x:1, y:2.9, w:W-2, h:1.1, fontFace:FS, fontSize:44, bold:true, color:"FFFFFF", align:"center" });
  if (subtitle) s.addText(subtitle, { x:1.5, y:4.0, w:W-3, h:0.8, fontFace:FS, fontSize:16, color:"C9CEDE", align:"center" });
  dots(s, W/2-0.72, 5.1);
}
function eyebrowCentered(s, text){ s.addText(text.toUpperCase(), { x:0, y:2.4, w:W, h:0.4, fontFace:FS, fontSize:14, bold:true, color:C.teal, align:"center", charSpacing:3 }); }

function bulletsSlide(pptx, meta, eb, titleText, items, right) {
  const s = pptx.addSlide(); eyebrow(s, eb, M, 0.35, 8); title(s, titleText, { y:0.65 });
  const col = items.length > 5;
  const half = Math.ceil(items.length/2);
  const mk = (arr, x, w) => arr.map((it,i)=>({ text:it, options:{ bullet:{ code:"2022", indent:16 }, color:C.body, fontSize:15, paraSpaceAfter:10, fontFace:FS }}));
  if (col) {
    s.addText(mk(items.slice(0,half)), { x:M, y:1.7, w:(W-2*M)/2-0.2, h:5.0, valign:"top" });
    s.addText(mk(items.slice(half)), { x:M+(W-2*M)/2+0.2, y:1.7, w:(W-2*M)/2-0.2, h:5.0, valign:"top" });
  } else {
    s.addText(mk(items), { x:M, y:1.7, w:W-2*M, h:5.0, valign:"top" });
  }
  footer(s, meta, right);
}

function infoGridSlide(pptx, meta, titleText, pairs, right) {
  const s = pptx.addSlide(); eyebrow(s, "Process at a glance", M, 0.35, 8); title(s, titleText, { y:0.65 });
  const cols=2, gw=(W-2*M-0.4)/cols, gh=1.35, gy=1.7, gx=M;
  pairs.forEach((p,i)=>{ const r=Math.floor(i/cols), c=i%cols; const x=gx+c*(gw+0.4), y=gy+r*(gh+0.25);
    s.addShape("roundRect",{ x, y, w:gw, h:gh, rectRadius:0.08, fill:{color:C.tint}, line:{color:C.line, width:1} });
    s.addText(p[0].toUpperCase(), { x:x+0.25, y:y+0.15, w:gw-0.5, h:0.3, fontFace:FS, fontSize:11, bold:true, color:C.magenta, charSpacing:1 });
    s.addText(p[1], { x:x+0.25, y:y+0.48, w:gw-0.5, h:gh-0.6, fontFace:FS, fontSize:13, color:C.body, valign:"top" });
  });
  footer(s, meta, right);
}

function tableSlide(pptx, meta, eb, titleText, header, rows, colW, headFill, right) {
  const s = pptx.addSlide(); eyebrow(s, eb, M, 0.35, 8); title(s, titleText, { y:0.65 });
  const head = header.map(h=>({ text:h, options:{ fill:{color:headFill||C.navy}, color:"FFFFFF", bold:true, fontSize:12, align:"left", valign:"middle" }}));
  const body = rows.map((r,ri)=> r.map(c=>({ text:c, options:{ fill:{color: ri%2?C.tint:"FFFFFF"}, color:C.body, fontSize:11.5, align:"left", valign:"top" }})));
  s.addTable([head, ...body], { x:M, y:1.7, w:W-2*M, colW, border:{ type:"solid", color:C.line, pt:1 }, rowH:0.3, margin:6, fontFace:FS, autoPage:false });
  footer(s, meta, right);
}

function rolesSlide(pptx, meta, rows) {
  tableSlide(pptx, meta, "Who uses this manual", "Roles & Responsibilities",
    ["Role","System permission","Responsibility in this process"], rows, [3.0, 3.5, 5.83], C.magenta, meta.bpId+"  ·  Roles");
}
function prereqSlide(pptx, meta, rows) {
  const s = pptx.addSlide(); eyebrow(s, "Before you start", M, 0.35, 8); title(s, "Prerequisites & Preconditions", { y:0.65 });
  const y0=1.75, rh=0.82;
  rows.forEach((r,i)=>{ const y=y0+i*rh;
    s.addShape("roundRect",{ x:M, y, w:W-2*M, h:rh-0.14, rectRadius:0.06, fill:{color: i%2?C.tint:"FFFFFF"}, line:{color:C.line, width:1} });
    s.addText("", { x:M+0.18, y:y+0.16, w:0.34, h:0.34, fontFace:FS });
    s.addShape("rect",{ x:M+0.2, y:y+0.16, w:0.32, h:0.32, fill:{color:"FFFFFF"}, line:{color:C.magenta, width:1.5} });
    s.addText(r[0], { x:M+0.75, y:y+0.05, w:3.9, h:rh-0.2, fontFace:FS, fontSize:13, bold:true, color:C.ink, valign:"middle" });
    s.addText(r[1], { x:M+4.8, y:y+0.05, w:W-2*M-5.0, h:rh-0.2, fontFace:FS, fontSize:12, color:C.body, valign:"middle" });
  });
  footer(s, meta, meta.bpId+"  ·  Prerequisites");
}
function overviewSlide(pptx, meta, items) {
  const s = pptx.addSlide(); eyebrow(s, "The big picture", M, 0.35, 8); title(s, "Process Overview", { y:0.65 });
  const y0=1.7, rh=Math.min(0.9,(5.2/items.length)); 
  items.forEach((it,i)=>{ const y=y0+i*(rh+0.08);
    s.addShape("ellipse",{ x:M, y, w:rh-0.14, h:rh-0.14, fill:{color:C.teal}, line:{type:"none"} });
    s.addText(String(i+1), { x:M, y, w:rh-0.14, h:rh-0.14, fontFace:FS, fontSize:16, bold:true, color:"FFFFFF", align:"center", valign:"middle" });
    s.addShape("roundRect",{ x:M+rh, y, w:W-2*M-rh, h:rh-0.14, rectRadius:0.06, fill:{color:C.tint}, line:{type:"none"} });
    s.addText(it, { x:M+rh+0.25, y, w:W-2*M-rh-0.5, h:rh-0.14, fontFace:FS, fontSize:14, color:C.ink, valign:"middle" });
  });
  footer(s, meta, meta.bpId+"  ·  Overview");
}

function stepSlide(pptx, meta, ctx) {
  const s = pptx.addSlide();
  // task + role tag pill
  s.addShape("roundRect",{ x:M, y:0.4, w:8.5, h:0.42, rectRadius:0.21, fill:{color:C.magTint}, line:{type:"none"} });
  s.addText([{ text:ctx.tag+"   ", options:{ bold:true, color:C.magenta }}, { text:"·  "+ctx.role, options:{ color:"5E1A50" }}],
    { x:M+0.25, y:0.4, w:8.2, h:0.42, fontFace:FS, fontSize:12, valign:"middle" });
  // step number circle
  s.addShape("ellipse",{ x:M, y:1.15, w:0.85, h:0.85, fill:{color:C.magenta}, line:{type:"none"} });
  s.addText(String(ctx.n), { x:M, y:1.15, w:0.85, h:0.85, fontFace:FS, fontSize:26, bold:true, color:"FFFFFF", align:"center", valign:"middle" });
  // action
  s.addText(ctx.action, { x:M+1.1, y:1.1, w:5.0, h:0.95, fontFace:FS, fontSize:21, bold:true, color:C.navy, valign:"middle" });
  // navigate card
  let cy = 2.35;
  s.addShape("roundRect",{ x:M, y:cy, w:6.0, h:1.15, rectRadius:0.06, fill:{color:C.magTint}, line:{type:"none"} });
  s.addText("NAVIGATE", { x:M+0.2, y:cy+0.12, w:5.6, h:0.28, fontFace:FS, fontSize:10, bold:true, color:C.magenta, charSpacing:2 });
  s.addText(ctx.nav, { x:M+0.2, y:cy+0.42, w:5.6, h:0.65, fontFace:FS, fontSize:13, color:C.body, valign:"top" });
  cy += 1.35;
  // expected card
  s.addShape("roundRect",{ x:M, y:cy, w:6.0, h:1.25, rectRadius:0.06, fill:{color:C.tealTint}, line:{type:"none"} });
  s.addText("EXPECTED RESULT", { x:M+0.2, y:cy+0.12, w:5.6, h:0.28, fontFace:FS, fontSize:10, bold:true, color:C.green, charSpacing:2 });
  s.addText(ctx.expected, { x:M+0.2, y:cy+0.42, w:5.6, h:0.75, fontFace:FS, fontSize:12.5, color:C.body, valign:"top" });
  cy += 1.45;
  if (ctx.note) {
    s.addShape("roundRect",{ x:M, y:cy, w:6.0, h:0.75, rectRadius:0.06, fill:{color:C.amberTint}, line:{type:"none"} });
    s.addText([{ text:"NOTE  ", options:{ bold:true, color:C.amber }}, { text:ctx.note, options:{ color:"6E4400" }}],
      { x:M+0.2, y:cy+0.1, w:5.6, h:0.55, fontFace:FS, fontSize:11, valign:"middle" });
  }
  // screenshot region (right) — real image if provided, else placeholder
  const sx=6.9, sw=W-M-sx;
  if (ctx.imgPath) {
    const iw=sw, ih=iw/1.6, iy=1.15+(5.15-ih)/2;
    s.addShape("roundRect",{ x:sx-0.05, y:iy-0.05, w:iw+0.1, h:ih+0.1, rectRadius:0.05, fill:{color:"FFFFFF"}, line:{color:C.line, width:1} });
    s.addImage({ path:ctx.imgPath, x:sx, y:iy, w:iw, h:ih });
    if (ctx.screenshot) s.addText(ctx.screenshot, { x:sx, y:iy+ih+0.08, w:iw, h:0.7, fontFace:FS, fontSize:10, italic:true, color:C.grey, align:"center", valign:"top" });
  } else {
    s.addShape("roundRect",{ x:sx, y:1.15, w:sw, h:5.15, rectRadius:0.08, fill:{color:C.tint}, line:{color:C.teal, width:1.25, dashType:"dash"} });
    s.addText("SCREENSHOT", { x:sx, y:3.2, w:sw, h:0.45, fontFace:FS, fontSize:18, bold:true, color:C.grey, align:"center", charSpacing:3 });
    s.addText(ctx.screenshot, { x:sx+0.4, y:3.7, w:sw-0.8, h:1.2, fontFace:FS, fontSize:12, italic:true, color:C.grey, align:"center", valign:"top" });
  }
  footer(s, meta, ctx.footerRight);
}

function tipsSlide(pptx, meta, tips) {
  const s = pptx.addSlide(); eyebrow(s, "Good to know", M, 0.35, 8); title(s, "Tips & Notes", { y:0.65 });
  const map={ note:[C.tealTint,C.teal,"NOTE"], tip:[C.limeTint,"8CA81E","TIP"], best:[C.limeTint,"8CA81E","BEST PRACTICE"], warn:[C.crimTint,C.crimson,"IMPORTANT"], caution:[C.amberTint,C.amber,"CAUTION"] };
  const y0=1.7, rh=(5.1/tips.length);
  tips.forEach((t,i)=>{ const y=y0+i*rh; const m=map[t.kind]||map.note;
    s.addShape("roundRect",{ x:M, y, w:W-2*M, h:rh-0.2, rectRadius:0.06, fill:{color:m[0]}, line:{type:"none"} });
    s.addShape("ellipse",{ x:M+0.25, y:y+(rh-0.2)/2-0.11, w:0.22, h:0.22, fill:{color:m[1]}, line:{type:"none"} });
    s.addText([{ text:m[2]+"   ", options:{ bold:true, color:m[1] }}, { text:t.text, options:{ color:C.body }}],
      { x:M+0.7, y:y+0.05, w:W-2*M-1.0, h:rh-0.3, fontFace:FS, fontSize:12.5, valign:"middle" });
  });
  footer(s, meta, meta.bpId+"  ·  Tips");
}

function closingSlide(pptx, meta) {
  const s = pptx.addSlide(); s.background={ color:C.navy };
  s.addText("Training Sign-Off", { x:1, y:2.2, w:W-2, h:0.9, fontFace:FS, fontSize:40, bold:true, color:"FFFFFF", align:"center" });
  s.addText("Confirm you can perform your part of this process independently in the QA environment.",
    { x:2, y:3.2, w:W-4, h:0.7, fontFace:FS, fontSize:16, color:"C9CEDE", align:"center" });
  s.addText([{text:"Trainee ______________________     ",options:{}},{text:"Date __________     ",options:{}},{text:"Result:  ☐ Competent   ☐ Follow-up",options:{}}],
    { x:1.5, y:4.3, w:W-3, h:0.5, fontFace:FS, fontSize:14, color:"FFFFFF", align:"center" });
  dots(s, W/2-0.72, 5.4);
  s.addText("Raptors Technology  ·  SAP Gold Partner", { x:0, y:6.9, w:W, h:0.3, fontFace:FS, fontSize:11, color:"8B93B0", align:"center" });
}

function buildDeck(model, outPath) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name:"KUT", width:W, height:H }); pptx.layout="KUT";
  const meta = model.meta;
  titleSlide(pptx, meta);
  bulletsSlide(pptx, meta, "What you will learn", "Learning Outcomes", model.outcomes, meta.bpId+"  ·  Outcomes");
  infoGridSlide(pptx, meta, "Process at a Glance", model.processInfo, meta.bpId+"  ·  At a glance");
  rolesSlide(pptx, meta, model.roles);
  overviewSlide(pptx, meta, model.overview);

  const hasConfig = model.configTasks && model.configTasks.length;
  if (hasConfig) {
    sectionDivider(pptx, "Section", "Configuration", "One-time setup performed by the configuration team");
    model.configTasks.forEach((task, ti) => task.steps.forEach((st, si) =>
      stepSlide(pptx, meta, { tag:"Configuration "+(ti+1)+" — "+task.name, role:task.role||"Configuration Admin",
        n:si+1, action:st.action, nav:st.nav, expected:st.expected, note:st.note, screenshot:st.screenshot,
        footerRight:meta.bpId+"  ·  Config "+(ti+1)+"."+(si+1) })));
  }
  sectionDivider(pptx, "Section", hasConfig?"Execution":"Step-by-Step", "The steps each role performs, in order");
  model.tasks.forEach((task, ti) => task.steps.forEach((st, si) =>
    stepSlide(pptx, meta, { tag:"Task "+(ti+1)+" — "+task.name, role:task.role||"Key user",
      n:si+1, action:st.action, nav:st.nav, expected:st.expected, note:st.note, screenshot:st.screenshot,
      footerRight:meta.bpId+"  ·  Task "+(ti+1)+"."+(si+1) })));

  bulletsSlide(pptx, meta, "How you know it worked", "Validation & Expected Results", model.validation, meta.bpId+"  ·  Validation");
  tableSlide(pptx, meta, "If something goes wrong", "Common Errors & Troubleshooting",
    ["Symptom","Likely cause","Resolution"], model.troubleshooting, [4.1,4.1,4.13], C.crimson, meta.bpId+"  ·  Troubleshooting");
  tipsSlide(pptx, meta, model.tips);
  tableSlide(pptx, meta, "Reference", "Key Terms", ["Term","Meaning"],
    model.glossary, [3.2, 9.13], C.navy, meta.bpId+"  ·  Key terms");
  closingSlide(pptx, meta);

  return pptx.writeFile({ fileName: outPath }).then(()=>console.log("wrote", outPath));
}

module.exports = { buildDeck, titleSlide, sectionDivider, bulletsSlide, infoGridSlide, tableSlide, rolesSlide, overviewSlide, stepSlide, tipsSlide, closingSlide, footer, C, W, H, M, FS };
if (require.main === module) (async () => {
  const ex = require("./build_example.js").model;
  const tpl = require("./build_template.js").model;
  await buildDeck(ex, "BP-04_Regular_Payroll_Dry_Run_KUT.pptx");
  await buildDeck(tpl, "Nabd_Pay_KUT_Template.pptx");
})();
