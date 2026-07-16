// render.js — KUT content model -> document body (shared by template + example)
const L = require("./kutlib");
const { C, R, P, spacer, H1, H2, H3, eyebrow, kvTable, dataTable, callout, step,
        bullet, coverPage, TableOfContents, Paragraph, PageBreak, AlignmentType } = L;
const { Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle, VerticalAlign } = require("docx");

function lead(text) { return P(R(text, { size: 20, color: C.body }), { spacing: { after: 120 } }); }

// Small "performed by" role tag rendered under a task heading
function roleTag(role) {
  const W = L.CONTENT_W;
  const noB = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W],
    rows: [ new TableRow({ children: [ new TableCell({ width: { size: W, type: WidthType.DXA }, borders: noB,
      shading: { fill: C.magTint, type: ShadingType.CLEAR }, margins: { top: 50, bottom: 50, left: 150, right: 120 },
      children: [ P([ R("PERFORMED BY   ", { bold: true, size: 14, color: C.magenta, characterSpacing: 16 }),
        R(role, { bold: true, size: 17, color: "5E1A50" }) ]) ] }) ] }) ] });
}

function flowPill(n, text) {
  const W = L.CONTENT_W;
  const noB = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
  return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [560, W - 560],
    rows: [ new TableRow({ children: [
      new TableCell({ width: { size: 560, type: WidthType.DXA }, borders: noB, verticalAlign: VerticalAlign.CENTER,
        shading: { fill: C.teal, type: ShadingType.CLEAR },
        children: [P(R(String(n), { bold: true, size: 24, color: "FFFFFF" }), { alignment: AlignmentType.CENTER })] }),
      new TableCell({ width: { size: W - 560, type: WidthType.DXA }, borders: noB, verticalAlign: VerticalAlign.CENTER,
        shading: { fill: C.tint, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 180, right: 140 },
        children: [P(R(text, { size: 19, color: C.ink }))] }),
    ]}) ] });
}

function renderKut(m) {
  const g = m.guideMode;
  const kids = [];
  const push = (...x) => x.forEach((e) => kids.push(e));
  let n = 0; const S = (t) => H1(`${++n}.  ${t}`);
  const hasConfig = m.configTasks && m.configTasks.length;

  // Cover
  push(...coverPage(m.meta));

  // Document Control
  push(eyebrow("Document Control"), H1("Document Control"));
  push(kvTable(m.control)); push(spacer(120));
  push(H3("Revision history"));
  push(dataTable([{ w: 1100, label: "Version" }, { w: 1500, label: "Date" }, { w: 3160, label: "Summary of change" }, { w: 3600, label: "Author" }], m.revisions));
  if (g) push(spacer(100), callout("guide",
    "Fill every field in Document Control before circulating. Bump the version and add a Revision-history row on each change so trainers always know which build a manual matches."));
  push(new Paragraph({ children: [new PageBreak()] }));

  // Contents
  push(eyebrow("Contents"), H1("Contents"));
  push(new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }));
  push(P(R("Right-click the table and choose “Update Field” in Word to refresh page numbers.", { italics: true, size: 16, color: C.grey }), { spacing: { before: 80 } }));
  push(new Paragraph({ children: [new PageBreak()] }));

  // 1 Purpose
  push(S("Purpose & Learning Outcomes"));
  push(lead(m.purpose));
  push(H3("After this training you will be able to:"));
  m.outcomes.forEach((o) => push(bullet(o)));
  if (g) push(spacer(80), callout("guide",
    "State the business purpose in one or two sentences a first-time user understands. Write outcomes as observable actions, each starting with a verb (Run…, Review…, Verify…)."));

  // 2 At a glance
  push(S("Process at a Glance"));
  push(kvTable(m.processInfo, C.magenta));
  if (g) push(spacer(80), callout("guide",
    "Capture the operational envelope: trigger, frequency, the roles involved, inputs and outputs. Under “Roles involved”, list EVERY role that touches the process — this is an overall user manual, not a single-role guide."));

  // 3 Roles & responsibilities
  push(S("Roles & Responsibilities"));
  push(lead(m.rolesIntro || "This manual covers the complete business process across every role that participates in it. The table below lists each role, the system permission it maps to, and what it is accountable for. Later sections are grouped by the role that performs them."));
  push(dataTable([{ w: 2400, label: "Role" }, { w: 3100, label: "System permission" }, { w: 3860, label: "Responsibility in this process" }], m.roles, C.magenta));
  if (g) push(spacer(80), callout("guide",
    "List all participating roles — configuration/admin, the operator(s) who run the process, approvers, and any view-only roles. Every role listed here should have steps somewhere in the Configuration or Execution sections."));

  // 5 Process overview
  push(S("Process Overview"));
  push(lead(m.overviewIntro || "At a high level the process runs in the following stages. Each stage is detailed step-by-step in the sections that follow."));
  m.overview.forEach((s, i) => push(flowPill(i + 1, s)));
  push(spacer(60));

  // 6 Configuration (optional)
  if (hasConfig) {
    push(new Paragraph({ children: [new PageBreak()] }));
    push(S("Configuration"));
    push(lead(m.configIntro || "These one-time setup steps make the business process executable. They are normally performed by the implementation or configuration team before key users run the process. Skip this section if your environment is already configured."));
    if (g) push(callout("guide",
      "Use this section for the configuration a consultant/admin performs so the process can run at all (parameters, rules, roles, cycles, master data). Same step format as execution. Delete this whole section if the process needs no configuration."), spacer(120));
    m.configTasks.forEach((task, ti) => {
      push(H2(`Configuration ${ti + 1} — ${task.name}`));
      if (task.role) push(roleTag(task.role), spacer(60));
      if (task.intro) push(lead(task.intro));
      task.steps.forEach((s, si) => push(...step(si + 1, s)));
    });
  }

  // 7 Execution
  push(new Paragraph({ children: [new PageBreak()] }));
  push(S(hasConfig ? "Step-by-Step Execution" : "Step-by-Step Instructions"));
  push(lead(m.stepsIntro || "Follow the tasks in order. Each step shows the action to take, where to find it in Nabd Pay, and what you should see when it succeeds. Tasks are grouped by the role that performs them. Replace each screenshot slot with your own annotated capture."));
  if (g) push(callout("guide", [
    P(R("For every step provide four things:", { size: 19, color: C.body }), { spacing: { after: 40 } }),
    bullet([R("Action", { bold: true }), R(" — a single imperative instruction (one action per step).")]),
    bullet([R("Navigate", { bold: true }), R(" — the exact menu/route/button path, using the app’s real labels.")]),
    bullet([R("Expected result", { bold: true }), R(" — what confirms the step worked (message, value, screen change).")]),
    bullet([R("Screenshot", { bold: true }), R(" — an annotated capture; circle the control the user clicks.")]),
    P(R("Tag each task with the role that performs it. Sequence tasks so each one leaves the system in the state the next task needs — that is what removes the need for a separate prerequisites list.", { size: 19, color: C.body }), { spacing: { before: 60 } }),
  ]), spacer(120));

  m.tasks.forEach((task, ti) => {
    push(H2(`Task ${ti + 1} — ${task.name}`));
    if (task.role) push(roleTag(task.role), spacer(60));
    if (task.intro) push(lead(task.intro));
    task.steps.forEach((s, si) => push(...step(si + 1, s)));
  });

  // 8 Validation
  push(S("Validation & Expected Results"));
  push(lead(m.validationIntro || "The process is complete and correct when all of the following are true:"));
  m.validation.forEach((v) => push(bullet(v)));

  // 9 Troubleshooting
  push(S("Common Errors & Troubleshooting"));
  push(dataTable([{ w: 2900, label: "Symptom" }, { w: 3100, label: "Likely cause" }, { w: 3360, label: "Resolution" }], m.troubleshooting, C.crimson));

  // 10 Tips
  push(S("Tips & Notes"));
  m.tips.forEach((t) => { push(callout(t.kind, t.text)); push(spacer(80)); });

  // 11 Glossary
  push(S("Key Terms"));
  push(dataTable([{ w: 2600, label: "Term" }, { w: 6760, label: "Meaning" }], m.glossary, C.navy));

  // 12 Sign-off
  push(S("Training Sign-Off"));
  push(lead("By signing below, the trainee confirms they have completed this Key User Training and can perform their part of the process independently in the QA environment."));
  push(dataTable([{ w: 2600, label: "Field" }, { w: 6760, label: "" }],
    [["Trainee name", ""], ["Role", ""], ["Trainer / KUT owner", ""], ["Date completed", ""], ["Trainee signature", ""], ["Result", "☐  Competent      ☐  Needs follow-up"]], C.navy));

  return kids;
}

module.exports = { renderKut };
