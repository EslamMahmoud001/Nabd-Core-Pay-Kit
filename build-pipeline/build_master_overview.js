// build_master_overview.js — ONE deck that walks the whole Nabd Payroll KUT V1.0 program.
// Reuses the shared slide toolkit (build_slides.js). Output: the V1.0 package root.
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const S = require("./build_slides.js");
const { C, W, H, M, FS } = S;

const ASSET = (f) => path.join(__dirname, "assets", f);
const IMG = (f) => path.join(__dirname, "screenshots", f);
const OUT = path.join(
  "C:\\Users\\EslamAwad\\OneDrive - Raptors Technology\\Desktop\\Nabd Pay\\Nabd-Claude\\Nabd-KUT-Material-V1.0",
  "Nabd_Payroll_KUT_Program_Overview.pptx"
);

const meta = { module: "Nabd Payroll", bpId: "KUT · V1.0", title: "Key User Training — Program Overview",
  version: "1.0", status: "Release", date: "16 July 2026" };

// ── module catalogue (learning order) ──────────────────────────────
const GROUPS = [
  { key: "A", name: "Setup & Foundation", sub: "Connect, load people, and configure the calculation catalogue" },
  { key: "B", name: "Regular Payroll Lifecycle", sub: "Open a cycle, run it, and close the period" },
  { key: "C", name: "Payments & Outputs", sub: "Payslips, bank file, ledger, reports and analytics" },
  { key: "D", name: "Specialized Processes", sub: "Off-cycle, retro, loans, and end-of-service" },
];

const MODULES = [
  { n: 1, g: "A", code: "BP-01", title: "Core Integration & Configuration",
    pts: ["Connect Nabd to SuccessFactors and run the employee & foundation sync.", "The source of truth for all downstream payroll data.", "Role: Tenant Admin."],
    img: IMG("bp01_shots/01-connection-page.png") },
  { n: 2, g: "A", code: "BP-02", title: "Employee Master Data Foundation",
    pts: ["Inspect synced people in the Data Browser — 17 of 17 employees.", "Job, compensation, pay components, personal and foundation tables.", "Everything is effective-dated."],
    img: IMG("bp02_shots/01-overview.png") },
  { n: 3, g: "A", code: "FD-CAL-01", title: "Pay Calendars & Cycles",
    pts: ["Define the pay calendar and generate its cycles.", "Frequency, cut-off and pay dates per pay group.", "The scaffolding every run hangs off."],
    img: IMG("fdcal01_real/01-calendar-list.png") },
  { n: 4, g: "A", code: "Config Guide", title: "Payroll Configuration Guide",
    pts: ["Component Studio, Parameters and Bracket Tables — the calculation catalogue.", "One catalogue, three owners: country pack, tenant, and SF-seeded.", "Activate a pay item before it can participate in a run."],
    img: IMG("cfg_shots/01-component-studio.png") },

  { n: 5, g: "B", code: "BP-03", title: "Payroll Readiness & Opening a Cycle",
    pts: ["Run readiness checks, then open the payroll cycle.", "Confirm the cohort is complete before you compute.", "The gate into the run lifecycle."],
    img: IMG("rdy_shots/01-control-center.png") },
  { n: 6, g: "B", code: "FD-RUN-01", title: "Run Payroll — Dry Run",
    pts: ["Simulate the run and review results before committing.", "Gross 200,000.00 · Deductions 36,850.17 · Net 163,149.83 · 16 employees.", "A dry run is side-effect free."],
    img: IMG("fdrun01_real/01-scope-dry-run.png") },
  { n: 7, g: "B", code: "FD-RUN-02", title: "Finalize & Close a Payroll Period",
    pts: ["Cut off → actual run → 2-stage approve → post to G/L → close.", "Close is permanent and locks the period.", "Driven from the Control Center."],
    img: IMG("fdrun02_real/01-control-center-ready-to-close.png") },

  { n: 8, g: "C", code: "BP-PAYSLIP", title: "Payslips — Template & Bulk Generation",
    pts: ["Design a payslip template, then bulk-generate from a closed run.", "16 payslips generated · 0 skipped · 0 failed.", "Confirm-gated: type GENERATE to run."],
    img: IMG("payslips_real/10-generation-complete-16.png") },
  { n: 9, g: "C", code: "BP-09", title: "Bank File Generation",
    pts: ["Produce the bank payment file for the run.", "Totals and file structure validated before release.", "Duplicate-payment protection built in."],
    img: IMG("bp09_real/01-new-template-starters.png") },
  { n: 10, g: "C", code: "BP-10", title: "G/L Posting",
    pts: ["Build the balanced journal (DR 230,056.25 = CR 230,056.25) and post to S/4.", "Posted as S/4 document 1000000123 — the all-green stage rail.", "Idempotent: no duplicate post over a posted journal."],
    img: IMG("bp10_real/02-cycle-posted.png") },
  { n: 11, g: "C", code: "BP-REPORT", title: "Payroll Reports",
    pts: ["Nine run-scoped reports across Statutory, Management and Audit.", "Preview the actual content — Payroll Register, PIT Register.", "Generate-all / export per category."],
    img: IMG("reports_real/02-payroll-register-preview-rows.png") },
  { n: 12, g: "C", code: "BP-ANALYTICS", title: "Payroll Analytics",
    pts: ["The executive cost board — KPIs, cost drivers, Gross→Net.", "Net 163.1K · Headcount 16 · CTC 230.1K for E1 / Aug 2026.", "Scoped by the selected pay group and period."],
    img: IMG("analytics_real/01-analytics-e1-august-2026-kpis.png") },

  { n: 13, g: "D", code: "BP-13", title: "Off-Cycle Payroll — One-Time Payments",
    pts: ["Run an off-cycle one-time payment run outside the regular cycle.", "A 4-step wizard: run type → payments → simulate → submit.", "Paid gross; statutory settles in the regular cycle."],
    img: IMG("bp13_real/01-workbench.png") },
  { n: 14, g: "D", code: "BP-RETRO", title: "Retroactive Payroll",
    pts: ["Back-dated change triggers that recompute on the next cycle.", "Auto-detected or raised manually; notes required for audit.", "Deltas above threshold gate the next cycle's close."],
    img: IMG("retro_real/01-retro-dashboard-pending-triggers.png") },
  { n: 15, g: "D", code: "BP-LOAN", title: "Loans & Advances",
    pts: ["Loan recovery schedules, originated from approved SF advances.", "Compliance guardrails keep recovery within legal limits.", "Personal loan: 30,000 over 12 months — the recovery plan."],
    img: IMG("loans_real/02-sherif-personal-loan-detail-recovery-plan.png") },
  { n: 16, g: "D", code: "BP-18", title: "End-of-Service & Leave Provisioning",
    pts: ["Configure the EoS and leave-provision statutory schemes.", "Both are statutory — read-only / limited in-place edit.", "The accrual ledger records each period's provision."],
    img: IMG("bp18_real/01-scheme-studio.png") },
];

// ── custom slides ──────────────────────────────────────────────────
function dots(s, x, y) {
  [C.teal, C.magenta, C.lime, C.crimson, C.teal].forEach((c, i) =>
    s.addShape("ellipse", { x: x + i * 0.32, y, w: 0.16, h: 0.16, fill: { color: c }, line: { type: "none" } }));
}

function titleSlide(pptx) {
  const s = pptx.addSlide(); s.background = { color: C.navy };
  try { s.addImage({ path: ASSET("raptors_icon.png"), x: W / 2 - 0.55, y: 0.85, w: 1.1, h: 1.23 }); } catch (e) {}
  s.addText("NABD PAYROLL", { x: 0, y: 2.25, w: W, h: 0.9, fontFace: FS, fontSize: 52, bold: true, color: "FFFFFF", align: "center", charSpacing: 4 });
  s.addText("Key User Training  ·  Complete Program", { x: 0, y: 3.15, w: W, h: 0.5, fontFace: FS, fontSize: 18, bold: true, color: C.teal, align: "center", charSpacing: 2 });
  s.addShape("roundRect", { x: W / 2 - 4.6, y: 3.95, w: 9.2, h: 1.35, rectRadius: 0.1, fill: { color: "1B2657" }, line: { color: C.teal, width: 1 } });
  s.addText("16 modules  ·  Word + Slides  ·  real application screenshots", { x: W / 2 - 4.6, y: 4.12, w: 9.2, h: 0.35, fontFace: FS, fontSize: 13, bold: true, color: C.teal, align: "center", charSpacing: 1 });
  s.addText("One walkthrough of the entire payroll lifecycle", { x: W / 2 - 4.6, y: 4.5, w: 9.2, h: 0.7, fontFace: FS, fontSize: 24, bold: true, color: "FFFFFF", align: "center" });
  dots(s, W / 2 - 0.72, 5.65);
  s.addText("Version 1.0  ·  Release  ·  16 July 2026", { x: 0, y: 6.05, w: W, h: 0.35, fontFace: FS, fontSize: 12, color: "C9CEDE", align: "center" });
  s.addText("Raptors Technology  ·  SAP Gold Partner", { x: 0, y: 6.9, w: W, h: 0.3, fontFace: FS, fontSize: 11, color: "8B93B0", align: "center" });
}

function eyebrow(s, text, x, y, w, color) {
  s.addText(text.toUpperCase(), { x, y, w, h: 0.3, fontFace: FS, fontSize: 11, bold: true, color: color || C.magenta, charSpacing: 2, align: "left" });
}
function footer(s, right) {
  s.addText([{ text: "Nabd Payroll", options: { bold: true, color: C.navy } }, { text: "  ·  Key User Training · V1.0", options: { color: C.grey } }],
    { x: M, y: H - 0.42, w: 8, h: 0.3, fontFace: FS, fontSize: 9, align: "left" });
  s.addText(right || "", { x: W - 4.5 - M, y: H - 0.42, w: 4.5, h: 0.3, fontFace: FS, fontSize: 9, color: C.grey, align: "right" });
  s.addShape("line", { x: M, y: H - 0.5, w: W - 2 * M, h: 0, line: { color: C.line, width: 1 } });
}

// The map slide: all 16 modules as a compact grid, grouped by colour.
function mapSlide(pptx) {
  const s = pptx.addSlide();
  eyebrow(s, "The whole program", M, 0.35, 8);
  s.addText("16 Modules, in Learning Order", { x: M, y: 0.65, w: W - 2 * M, h: 0.8, fontFace: FS, fontSize: 28, bold: true, color: C.navy });
  const gCol = { A: C.teal, B: C.magenta, C: C.lime, D: C.crimson };
  const cols = 4, cw = (W - 2 * M - (cols - 1) * 0.25) / cols;
  GROUPS.forEach((grp, ci) => {
    const x = M + ci * (cw + 0.25); let y = 1.75;
    s.addShape("roundRect", { x, y, w: cw, h: 0.55, rectRadius: 0.06, fill: { color: gCol[grp.key] }, line: { type: "none" } });
    s.addText(grp.name, { x: x + 0.12, y, w: cw - 0.24, h: 0.55, fontFace: FS, fontSize: 12.5, bold: true, color: grp.key === "C" ? "3F4A0C" : "FFFFFF", valign: "middle" });
    y += 0.7;
    MODULES.filter((m) => m.g === grp.key).forEach((m) => {
      s.addShape("roundRect", { x, y, w: cw, h: 0.92, rectRadius: 0.05, fill: { color: C.tint }, line: { color: C.line, width: 1 } });
      s.addText(String(m.n).padStart(2, "0"), { x: x + 0.1, y: y + 0.08, w: 0.55, h: 0.35, fontFace: FS, fontSize: 15, bold: true, color: gCol[grp.key] === C.lime ? "8CA81E" : gCol[grp.key] });
      s.addText(m.code, { x: x + 0.62, y: y + 0.12, w: cw - 0.7, h: 0.28, fontFace: FS, fontSize: 9, bold: true, color: C.grey });
      s.addText(m.title, { x: x + 0.1, y: y + 0.42, w: cw - 0.2, h: 0.45, fontFace: FS, fontSize: 10.5, color: C.ink, valign: "top" });
      y += 1.0;
    });
  });
  footer(s, "The 16 modules");
}

// One rich content slide per module: bullets left, real screenshot right.
function moduleSlide(pptx, m) {
  const gCol = { A: C.teal, B: C.magenta, C: "8CA81E", D: C.crimson };
  const grp = GROUPS.find((g) => g.key === m.g);
  const s = pptx.addSlide();
  // number pill + code
  s.addShape("roundRect", { x: M, y: 0.4, w: 1.15, h: 1.15, rectRadius: 0.1, fill: { color: gCol[m.g] }, line: { type: "none" } });
  s.addText(String(m.n).padStart(2, "0"), { x: M, y: 0.4, w: 1.15, h: 1.15, fontFace: FS, fontSize: 40, bold: true, color: m.g === "C" ? "3F4A0C" : "FFFFFF", align: "center", valign: "middle" });
  eyebrow(s, grp.name + "  ·  " + m.code, M + 1.35, 0.45, 6, gCol[m.g]);
  s.addText(m.title, { x: M + 1.35, y: 0.72, w: 5.4, h: 1.0, fontFace: FS, fontSize: 23, bold: true, color: C.navy, valign: "top" });
  // bullets
  s.addText(m.pts.map((t) => ({ text: t, options: { bullet: { code: "2022", indent: 16 }, color: C.body, fontSize: 14, paraSpaceAfter: 12, fontFace: FS } })),
    { x: M, y: 1.95, w: 6.1, h: 4.3, valign: "top" });
  // screenshot right
  const sx = 6.9, sw = W - M - sx, iw = sw, ih = iw / 1.6, iy = 1.15 + (5.15 - ih) / 2;
  s.addShape("roundRect", { x: sx - 0.05, y: iy - 0.05, w: iw + 0.1, h: ih + 0.1, rectRadius: 0.05, fill: { color: "FFFFFF" }, line: { color: C.line, width: 1 } });
  try { s.addImage({ path: m.img, x: sx, y: iy, w: iw, h: ih }); } catch (e) {
    s.addText("screenshot", { x: sx, y: iy + ih / 2, w: iw, h: 0.4, align: "center", color: C.grey, fontFace: FS });
  }
  s.addText("Document " + String(m.n).padStart(2, "0") + "  ·  Word manual + slide deck in the V1.0 pack", { x: sx, y: iy + ih + 0.1, w: iw, h: 0.5, fontFace: FS, fontSize: 10, italic: true, color: C.grey, align: "center" });
  footer(s, m.code);
}

function scopeSlide(pptx) {
  const s = pptx.addSlide();
  eyebrow(s, "Scope of V1.0", M, 0.35, 8);
  s.addText("What's Covered — and What Comes Next", { x: M, y: 0.65, w: W - 2 * M, h: 0.8, fontFace: FS, fontSize: 26, bold: true, color: C.navy });
  s.addShape("roundRect", { x: M, y: 1.8, w: (W - 2 * M) / 2 - 0.2, h: 4.2, rectRadius: 0.08, fill: { color: C.tealTint }, line: { type: "none" } });
  s.addText("IN THIS RELEASE", { x: M + 0.3, y: 2.0, w: 5, h: 0.35, fontFace: FS, fontSize: 12, bold: true, color: C.teal, charSpacing: 2 });
  s.addText([
    "15 of the 18 payroll lifecycle areas, end to end.",
    "Every module built from real application screenshots on the training tenant.",
    "Both formats per module: a Word manual and a matching slide deck.",
  ].map((t) => ({ text: t, options: { bullet: { code: "2022", indent: 16 }, color: C.body, fontSize: 14, paraSpaceAfter: 12, fontFace: FS } })),
    { x: M + 0.3, y: 2.45, w: (W - 2 * M) / 2 - 0.8, h: 3.3, valign: "top" });
  const rx = M + (W - 2 * M) / 2 + 0.2;
  s.addShape("roundRect", { x: rx, y: 1.8, w: (W - 2 * M) / 2 - 0.2, h: 4.2, rectRadius: 0.08, fill: { color: C.amberTint }, line: { type: "none" } });
  s.addText("PLANNED NEXT", { x: rx + 0.3, y: 2.0, w: 5, h: 0.35, fontFace: FS, fontSize: 12, bold: true, color: C.amber, charSpacing: 2 });
  s.addText([
    "Data Import — bulk data loads.",
    "AI & Compliance — the assisted-compliance surface.",
    "A dedicated Approval-inbox walkthrough and Country-Pack activation.",
  ].map((t) => ({ text: t, options: { bullet: { code: "2022", indent: 16 }, color: C.body, fontSize: 14, paraSpaceAfter: 12, fontFace: FS } })),
    { x: rx + 0.3, y: 2.45, w: (W - 2 * M) / 2 - 0.8, h: 3.3, valign: "top" });
  footer(s, "Scope");
}

function closingSlide(pptx) {
  const s = pptx.addSlide(); s.background = { color: C.navy };
  s.addText("One program. The whole payroll lifecycle.", { x: 1, y: 2.5, w: W - 2, h: 1.0, fontFace: FS, fontSize: 34, bold: true, color: "FFFFFF", align: "center" });
  s.addText("Open the matching Word manual or slide deck for any module in the V1.0 pack.", { x: 2, y: 3.6, w: W - 4, h: 0.7, fontFace: FS, fontSize: 16, color: "C9CEDE", align: "center" });
  dots(s, W / 2 - 0.72, 4.7);
  s.addText("Raptors Technology  ·  SAP Gold Partner", { x: 0, y: 6.9, w: W, h: 0.3, fontFace: FS, fontSize: 11, color: "8B93B0", align: "center" });
}

// ── build ──────────────────────────────────────────────────────────
(async () => {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "KUT", width: W, height: H }); pptx.layout = "KUT";
  titleSlide(pptx);
  S.bulletsSlide(pptx, meta, "About this program", "How to Use This Pack", [
    "16 self-contained modules, numbered in the order you would learn them.",
    "Grouped into four stages: Setup & Foundation, Regular Payroll Lifecycle, Payments & Outputs, and Specialized Processes.",
    "Every module ships as a Word manual (Docs/) and a slide deck (PPT/) in the same numbered order.",
    "Each screenshot is a real capture from the running Nabd application — no mock-ups.",
    "This deck is the guided tour; open any module's own file for the full step-by-step.",
  ], "How to use");
  mapSlide(pptx);
  GROUPS.forEach((grp) => {
    S.sectionDivider(pptx, "Stage " + grp.key, grp.name, grp.sub);
    MODULES.filter((m) => m.g === grp.key).forEach((m) => moduleSlide(pptx, m));
  });
  scopeSlide(pptx);
  closingSlide(pptx);
  await pptx.writeFile({ fileName: OUT });
  console.log("wrote", OUT);
})();
