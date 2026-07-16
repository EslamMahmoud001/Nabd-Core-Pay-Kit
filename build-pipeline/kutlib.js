// kutlib.js — shared brand system + component builders for Nabd Pay KUT documents
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, LevelFormat, TableOfContents, HeadingLevel,
  BorderStyle, WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak,
  TabStopType, TabStopPosition,
} = require("docx");

const C = {
  teal: "43BECC", navy: "121B43", magenta: "8E257A", lime: "BCD647", crimson: "E21F4A",
  ink: "1A1A2E", body: "2B2B3A", grey: "6B6B7B", line: "D9DCE6",
  tint: "F4F6FB", tealTint: "EAF8FA", limeTint: "F5F9E4",
  magTint: "F6EAF3", crimTint: "FCEAEE", navyTint: "E9EBF2", amber: "C77A00", amberTint: "FBF1DF",
};
const ASSET = (f) => path.join(__dirname, "assets", f);
const CONTENT_W = 9360;

const R = (text, o = {}) => new TextRun({ text, font: "Arial", ...o });
const border = (color = C.line, size = 1, style = BorderStyle.SINGLE) => ({ style, size, color });
const allBorders = (color = C.line, size = 1) => ({
  top: border(color, size), bottom: border(color, size),
  left: border(color, size), right: border(color, size),
});
const noBorders = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
  insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
};
const cellMargins = { top: 90, bottom: 90, left: 140, right: 140 };

function P(children, o = {}) {
  return new Paragraph({ children: Array.isArray(children) ? children : [children], ...o });
}
function spacer(h = 120) { return new Paragraph({ spacing: { after: h }, children: [R("")] }); }
function H1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R(text)] }); }
function H2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [R(text)] }); }
function H3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [R(text)] }); }

function rule(color = C.teal, size = 18) {
  return new Paragraph({ spacing: { before: 40, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size, color, space: 1 } }, children: [R("")] });
}
function eyebrow(text, color = C.magenta) {
  return new Paragraph({ spacing: { after: 40 },
    children: [R(text.toUpperCase(), { bold: true, size: 16, color, characterSpacing: 20 })] });
}

function kvTable(rows, labelFill = C.navy, labelColor = "FFFFFF") {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2700, 6660],
    rows: rows.map(([k, v]) => new TableRow({ children: [
      new TableCell({ width: { size: 2700, type: WidthType.DXA }, borders: allBorders(), margins: cellMargins,
        shading: { fill: labelFill, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
        children: [P(R(k, { bold: true, size: 19, color: labelColor }))] }),
      new TableCell({ width: { size: 6660, type: WidthType.DXA }, borders: allBorders(), margins: cellMargins,
        verticalAlign: VerticalAlign.CENTER,
        children: [P(Array.isArray(v) ? v : R(v, { size: 19, color: C.body }))] }),
    ]})),
  });
}

function dataTable(cols, rows, headFill = C.navy) {
  const widths = cols.map((c) => c.w);
  const mkCell = (content, w, o = {}) => new TableCell({
    width: { size: w, type: WidthType.DXA }, borders: allBorders(), margins: cellMargins,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    children: (Array.isArray(content) ? content : [content]).map((c) =>
      typeof c === "string" ? P(R(c, { size: 18, color: C.body, ...(o.run || {}) }), o.p || {}) : c),
  });
  const headRow = new TableRow({ tableHeader: true, children: cols.map((c) =>
    mkCell(P(R(c.label, { bold: true, size: 18, color: "FFFFFF" })), c.w, { fill: headFill })) });
  const bodyRows = rows.map((r, ri) => new TableRow({ children: r.map((cell, ci) =>
    mkCell(cell, widths[ci], { fill: ri % 2 ? C.tint : "FFFFFF" })) }));
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths,
    rows: [headRow, ...bodyRows] });
}

const CALLOUTS = {
  note:    { fill: C.tealTint,  bar: C.teal,    label: "NOTE",          color: C.navy },
  tip:     { fill: C.limeTint,  bar: "8CA81E",  label: "TIP",           color: "3F4A0C" },
  best:    { fill: C.limeTint,  bar: "8CA81E",  label: "BEST PRACTICE", color: "3F4A0C" },
  warn:    { fill: C.crimTint,  bar: C.crimson, label: "IMPORTANT",     color: "8A1230" },
  caution: { fill: C.amberTint, bar: C.amber,   label: "CAUTION",       color: "6E4400" },
  role:    { fill: C.magTint,   bar: C.magenta, label: "WHO DOES THIS", color: "5E1A50" },
  guide:   { fill: C.navyTint,  bar: C.navy,    label: "HOW TO USE THIS TEMPLATE", color: C.navy },
};
function callout(kind, textOrRuns, opts = {}) {
  const s = CALLOUTS[kind] || CALLOUTS.note;
  const label = opts.label || s.label;
  const bodyParas = (Array.isArray(textOrRuns) && textOrRuns[0] instanceof Paragraph)
    ? textOrRuns
    : [P(Array.isArray(textOrRuns) ? textOrRuns : R(textOrRuns, { size: 19, color: C.body }))];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [70, CONTENT_W - 70],
    rows: [ new TableRow({ children: [
      new TableCell({ width: { size: 70, type: WidthType.DXA }, borders: noBorders,
        shading: { fill: s.bar, type: ShadingType.CLEAR }, children: [P(R(""))] }),
      new TableCell({ width: { size: CONTENT_W - 70, type: WidthType.DXA }, borders: noBorders,
        shading: { fill: s.fill, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 180, right: 160 },
        children: [ P(R(label, { bold: true, size: 15, color: s.bar, characterSpacing: 20 }),
          { spacing: { after: 40 } }), ...bodyParas ] }),
    ]})],
  });
}

function step(n, { action, nav, expected, screenshot, note }) {
  const chip = new TableCell({
    width: { size: 620, type: WidthType.DXA }, borders: noBorders,
    shading: { fill: C.magenta, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 0, right: 0 },
    children: [P(R(String(n), { bold: true, size: 26, color: "FFFFFF" }), { alignment: AlignmentType.CENTER })],
  });
  const bodyChildren = [ P(R(action, { bold: true, size: 20, color: C.ink })) ];
  if (nav) bodyChildren.push(P([ R("Navigate:  ", { bold: true, size: 17, color: C.magenta }),
    R(nav, { size: 18, color: C.body }) ], { spacing: { before: 40 } }));
  if (expected) bodyChildren.push(P([ R("Expected result:  ", { bold: true, size: 17, color: "2E7D32" }),
    R(expected, { size: 18, color: C.body }) ], { spacing: { before: 40 } }));
  if (note) bodyChildren.push(P([ R("Note:  ", { bold: true, size: 17, color: C.teal }),
    R(note, { size: 18, color: C.body }) ], { spacing: { before: 40 } }));
  const body = new TableCell({
    width: { size: CONTENT_W - 620, type: WidthType.DXA }, borders: noBorders,
    margins: { top: 70, bottom: 70, left: 170, right: 120 }, children: bodyChildren,
  });
  const headerTbl = new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [620, CONTENT_W - 620],
    borders: { ...allBorders(C.line, 1), insideHorizontal: border(C.line, 1), insideVertical: { style: BorderStyle.NONE } },
    rows: [ new TableRow({ children: [chip, body] }) ],
  });
  return [ headerTbl, screenshotBox(screenshot), spacer(140) ];
}

function screenshotBox(caption) {
  const inner = [
    P(R("SCREENSHOT", { bold: true, size: 20, color: C.grey, characterSpacing: 30 }),
      { alignment: AlignmentType.CENTER, spacing: { before: 220, after: 20 } }),
    P(R(caption || "Paste the annotated screenshot for this step here.", { italics: true, size: 17, color: C.grey }),
      { alignment: AlignmentType.CENTER, spacing: { after: 220 } }),
  ];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [ new TableRow({ children: [ new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA }, borders: allBorders(C.teal, 1),
      shading: { fill: C.tint, type: ShadingType.CLEAR }, children: inner }) ] }) ],
  });
}

function bullet(text, opts = {}) {
  return new Paragraph({ numbering: { reference: "kbullets", level: opts.level || 0 },
    spacing: { after: 60 }, children: Array.isArray(text) ? text : [R(text, { size: 19, color: C.body })] });
}
function numbered(text, opts = {}) {
  return new Paragraph({ numbering: { reference: "knums", level: 0 },
    spacing: { after: 60 }, children: Array.isArray(text) ? text : [R(text, { size: 19, color: C.body })] });
}

function coverPage(meta) {
  const icon = fs.readFileSync(ASSET("raptors_icon.png"));
  const sap = fs.readFileSync(ASSET("sap_gold.png"));
  return [
    spacer(220),
    P(new ImageRun({ type: "png", data: icon, transformation: { width: 92, height: 103 },
      altText: { title: "Raptors", description: "Raptors icon", name: "raptors" } }),
      { alignment: AlignmentType.CENTER }),
    spacer(120),
    P(R((meta.module || "Nabd Pay").toUpperCase(), { bold: true, size: 60, color: C.navy, characterSpacing: 30 }),
      { alignment: AlignmentType.CENTER, spacing: { after: 20 } }),
    P(R("Key User Training  ·  User Manual", { size: 24, color: C.teal, bold: true, characterSpacing: 20 }),
      { alignment: AlignmentType.CENTER, spacing: { after: 260 } }),
    new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
      rows: [ new TableRow({ children: [ new TableCell({
        width: { size: CONTENT_W, type: WidthType.DXA }, borders: noBorders,
        shading: { fill: C.navy, type: ShadingType.CLEAR },
        margins: { top: 320, bottom: 320, left: 300, right: 300 },
        children: [
          P(R(meta.bpId + "  ·  " + (meta.module || "Nabd Pay"), { size: 20, color: C.teal, bold: true, characterSpacing: 20 }),
            { alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
          P(R(meta.title, { bold: true, size: 40, color: "FFFFFF" }), { alignment: AlignmentType.CENTER }),
        ] }) ]}) ] }),
    new Table({ width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W/5, CONTENT_W/5, CONTENT_W/5, CONTENT_W/5, CONTENT_W/5],
      rows: [ new TableRow({ children: [C.teal, C.magenta, C.lime, C.crimson, C.navy].map((col) =>
        new TableCell({ width: { size: CONTENT_W/5, type: WidthType.DXA }, borders: noBorders,
          shading: { fill: col, type: ShadingType.CLEAR }, children: [P(R("", { size: 6 }))] })) }) ] }),
    spacer(360),
    kvTable([
      ["Document type", "Key User Training (KUT) — step-by-step user manual"],
      ["Business process", meta.bpId + " — " + meta.title],
      ["Version", meta.version],
      ["Status", meta.status],
      ["Date", meta.date],
      ["Classification", meta.classification || "Internal — Project Use"],
    ]),
    spacer(500),
    P([ R("Delivered by ", { size: 18, color: C.grey }),
        R("Raptors Technology", { size: 18, color: C.navy, bold: true }),
        R("   ·   SAP Gold Partner", { size: 18, color: C.grey }) ], { alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
    P(new ImageRun({ type: "png", data: sap, transformation: { width: 150, height: 87 },
      altText: { title: "SAP Gold Partner", description: "SAP Gold Partner", name: "sap" } }),
      { alignment: AlignmentType.CENTER }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function buildDoc(meta, bodyChildren) {
  return new Document({
    creator: "Raptors Technology", title: meta.bpId + " " + meta.title + " — KUT",
    styles: {
      default: { document: { run: { font: "Arial", size: 20, color: C.body } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 30, bold: true, font: "Arial", color: C.navy },
          paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 0,
            border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: C.teal, space: 6 } } } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 24, bold: true, font: "Arial", color: C.magenta },
          paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 21, bold: true, font: "Arial", color: C.navy },
          paragraph: { spacing: { before: 160, after: 60 }, outlineLevel: 2 } },
      ],
    },
    numbering: { config: [
      { reference: "kbullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { run: { color: C.teal }, paragraph: { indent: { left: 460, hanging: 260 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 900, hanging: 260 } } } } ] },
      { reference: "knums", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 460, hanging: 300 } } } } ] },
    ] },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 },
        margin: { top: 1300, right: 1440, bottom: 1300, left: 1440 } } },
      headers: { default: new Header({ children: [ new Table({
        width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [5600, 3760],
        borders: { ...noBorders, bottom: border(C.line, 4) },
        rows: [ new TableRow({ children: [
          new TableCell({ borders: { ...noBorders, bottom: border(C.line, 4) }, width: { size: 5600, type: WidthType.DXA },
            children: [P([ R(meta.module || "Nabd Pay", { bold: true, size: 16, color: C.navy }),
              R("  ·  Key User Training", { size: 16, color: C.grey }) ])] }),
          new TableCell({ borders: { ...noBorders, bottom: border(C.line, 4) }, width: { size: 3760, type: WidthType.DXA },
            children: [P(R(meta.bpId + "  ·  v" + meta.version, { size: 16, color: C.grey }),
              { alignment: AlignmentType.RIGHT })] }),
        ]}) ] }) ] }) },
      footers: { default: new Footer({ children: [ new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        border: { top: border(C.line, 4) }, spacing: { before: 60 },
        children: [ R(meta.classification || "Internal — Project Use", { size: 15, color: C.grey }),
          R("\t", {}), R("Raptors Technology  ·  Page ", { size: 15, color: C.grey }),
          new TextRun({ children: [PageNumber.CURRENT], size: 15, color: C.grey }),
          R(" of ", { size: 15, color: C.grey }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 15, color: C.grey }) ] }) ] }) },
      children: bodyChildren,
    }],
  });
}

async function writeDoc(doc, outPath) {
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buf);
  console.log("wrote", outPath, buf.length, "bytes");
}

module.exports = {
  C, CONTENT_W, R, P, spacer, H1, H2, H3, rule, eyebrow, kvTable, dataTable,
  callout, step, screenshotBox, bullet, numbered, coverPage, buildDoc, writeDoc,
  Paragraph, PageBreak, TextRun, TableOfContents, AlignmentType, HeadingLevel,
};

// ---- additions for HTML-sourced KUTs (real screenshots) ----
const _docx = require("docx");
function stepHeader(n, { action, nav, expected, note }) {
  const chip = new _docx.TableCell({
    width: { size: 620, type: _docx.WidthType.DXA }, borders: noBorders,
    shading: { fill: C.magenta, type: _docx.ShadingType.CLEAR }, verticalAlign: _docx.VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 0, right: 0 },
    children: [P(R(String(n), { bold: true, size: 26, color: "FFFFFF" }), { alignment: _docx.AlignmentType.CENTER })],
  });
  const body = [ P(R(action, { bold: true, size: 20, color: C.ink })) ];
  if (nav) body.push(P([ R("Navigate:  ", { bold: true, size: 17, color: C.magenta }), R(nav, { size: 18, color: C.body }) ], { spacing: { before: 40 } }));
  if (expected) body.push(P([ R("Expected result:  ", { bold: true, size: 17, color: "2E7D32" }), R(expected, { size: 18, color: C.body }) ], { spacing: { before: 40 } }));
  if (note) body.push(P([ R("Note:  ", { bold: true, size: 17, color: C.teal }), R(note, { size: 18, color: C.body }) ], { spacing: { before: 40 } }));
  const bodyCell = new _docx.TableCell({ width: { size: CONTENT_W - 620, type: _docx.WidthType.DXA }, borders: noBorders,
    margins: { top: 70, bottom: 70, left: 170, right: 120 }, children: body });
  return new _docx.Table({ width: { size: CONTENT_W, type: _docx.WidthType.DXA }, columnWidths: [620, CONTENT_W - 620],
    borders: allBorders(C.line, 1), rows: [ new _docx.TableRow({ children: [chip, bodyCell] }) ] });
}
function figureImg(imgPath, caption, wIn) {
  const fs2 = require("fs");
  const buf = fs2.readFileSync(imgPath);
  // read real PNG dimensions from IHDR (bytes 16-23, big-endian)
  let aspect = 1.6;
  try { const pw = buf.readUInt32BE(16), ph = buf.readUInt32BE(20); if (pw && ph) aspect = pw / ph; } catch (e) {}
  const w = wIn || 6.5; const h = w / aspect;
  const kids = [ P(new _docx.ImageRun({ type: "png", data: buf,
    transformation: { width: Math.round(w * 96), height: Math.round(h * 96) },
    altText: { title: caption || "screenshot", description: caption || "screenshot", name: "shot" } }),
    { alignment: _docx.AlignmentType.CENTER, spacing: { before: 40, after: caption ? 20 : 60 } }) ];
  if (caption) kids.push(P(R(caption, { italics: true, size: 16, color: C.grey }), { alignment: _docx.AlignmentType.CENTER, spacing: { after: 120 } }));
  return kids;
}
module.exports.stepHeader = stepHeader;
module.exports.figureImg = figureImg;
