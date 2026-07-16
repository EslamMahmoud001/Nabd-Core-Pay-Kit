const { buildDoc, writeDoc } = require("./kutlib");
const { renderKut } = require("./render");
const P = (t) => "[ " + t + " ]";

const model = {
  guideMode: true,
  meta: { bpId: "BP-00", title: "[ Business Process Name ]", module: "Nabd Pay",
    version: "0.1", status: "Draft", date: "[ Month YYYY ]", classification: "Internal — Project Use" },
  control: [
    ["Module", "Nabd Pay  ·  [ sub-area, e.g. Payroll Runs ]"],
    ["Business process", "BP-00 — [ Business Process Name ]"],
    ["Document owner", P("Name, role")], ["Author", P("Name, role")],
    ["Reviewed by", P("Name, role")], ["Approved by", P("Name, role")],
    ["Version", "0.1"], ["Status", "Draft  /  In review  /  Released"],
    ["Environment", P("QA tenant URL")], ["Classification", "Internal — Project Use"],
  ],
  revisions: [["0.1", P("dd Mmm yyyy"), "Initial draft", P("Author name")], ["", "", "", ""]],
  purpose: P("In one or two plain-language sentences, describe what this business process achieves and why it matters to the business."),
  outcomes: [P("Verb + outcome, e.g. Run a complete payroll cycle"), P("Verb + outcome"), P("Verb + outcome")],
  processInfo: [
    ["Trigger", P("What starts this process, e.g. Monthly pay cycle opens")],
    ["Frequency", P("e.g. Monthly / On demand")],
    ["Roles involved", P("List EVERY role that takes part, e.g. Config Admin, Payroll Administrator")],
    ["Inputs", P("Data / configuration this process consumes")],
    ["Outputs", P("What this process produces, e.g. Dry-run results")],
    ["Upstream / downstream", P("Preceding and following processes, e.g. after BP03, before BP13")],
  ],
  roles: [
    [P("Configuration Admin"), P("Config permission / group"), P("Sets up the process (parameters, rules, roles)")],
    [P("Operator role"), P("Operator permission / group"), P("Runs / executes the process")],
    [P("Reviewer role"), P("Reviewer permission / group"), P("Reviews or approves the output")],
  ],
  overview: [P("Stage 1 — short label"), P("Stage 2 — short label"), P("Stage 3 — short label"), P("Stage 4 — short label")],
  configIntro: P("Describe the one-time setup that makes this process executable. Delete this whole section if the process needs no configuration."),
  configTasks: [
    { name: P("Configuration task — e.g. Set up parameters & rules"), role: P("Configuration Admin"),
      intro: P("Optional: what this configuration achieves."),
      steps: [
        { action: P("Imperative config action"), nav: P("Config > Page > Control (real labels)"),
          expected: P("What confirms the setting is saved"), screenshot: "Screenshot of the configuration screen — circle the field/control." },
        { action: P("Imperative config action"), nav: P("Navigation path"),
          expected: P("Expected result"), screenshot: "Screenshot for this step." },
      ] },
  ],
  tasks: [
    { name: P("Task name — a logical grouping of steps"), role: P("Operator role — who performs this task"),
      intro: P("Optional: one line describing what this task accomplishes."),
      steps: [
        { action: P("Imperative action — one action only"), nav: P("Menu > Page > Button (real labels)"),
          expected: P("What the user should see when this step succeeds"), screenshot: "Screenshot for this step — circle the control the user clicks." },
        { action: P("Imperative action"), nav: P("Navigation path"),
          expected: P("Expected result"), screenshot: "Screenshot for this step." },
      ] },
    { name: P("Second task — e.g. another role's part of the process"), role: P("Reviewer role — who performs this task"),
      steps: [
        { action: P("Imperative action"), nav: P("Navigation path"),
          expected: P("Expected result"), note: P("Optional note or helpful detail"), screenshot: "Screenshot for this step." },
      ] },
  ],
  validation: [P("Observable statement of a correct outcome"), P("Observable statement"), P("Observable statement")],
  troubleshooting: [
    [P("What the user sees"), P("Why it happens"), P("How to resolve it")],
    [P("What the user sees"), P("Why it happens"), P("How to resolve it")],
  ],
  tips: [
    { kind: "tip", text: P("A helpful shortcut or good-practice tip.") },
    { kind: "note", text: P("Additional context worth knowing.") },
    { kind: "best", text: P("A recommended habit that makes the task easier.") },
  ],
  glossary: [[P("Term"), P("Plain-language definition")], [P("Term"), P("Plain-language definition")]],
};

module.exports = { model };
if (require.main === module) (async () => { await writeDoc(buildDoc(model.meta, renderKut(model)), "Nabd_Pay_KUT_Template.docx"); })();
