// build_chrome.js — intro (1) + 16 business-process transitions + outro (1) = 18 slides,
// styled with the EXACT same toolkit functions the individual decks use:
//   intro       -> S.titleSlide      (identical to every deck's title slide)
//   transition  -> S.sectionDivider  (identical to every deck's section dividers)
//   outro       -> S.closingSlide    (identical to every deck's sign-off slide)
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const S = require("./build_slides.js");
const { W, H } = S;
const OUT = path.join(
  "C:\\Users\\EslamAwad\\OneDrive - Raptors Technology\\Desktop\\Nabd Pay\\Nabd-Claude\\Nabd-KUT-Material-V1.0",
  "_chrome.pptx"
);

// Program-level meta drives the intro title slide, exactly as a module's meta does.
const meta = {
  module: "Nabd Payroll",
  bpId: "KUT · V1.0",
  title: "Complete Program — All Business Processes",
  version: "1.0",
  status: "Release",
  date: "16 July 2026",
};

const MODULES = [
  { n: 1, code: "BP-01", title: "Core Integration & Configuration", sub: "Connect to SuccessFactors and sync employees & foundation data" },
  { n: 2, code: "BP-02", title: "Employee Master Data Foundation", sub: "Inspect synced people and their effective-dated records" },
  { n: 3, code: "FD-CAL-01", title: "Pay Calendars & Cycles", sub: "Define the pay calendar and generate its cycles" },
  { n: 4, code: "Config Guide", title: "Payroll Configuration Guide", sub: "Component Studio, Parameters and Bracket Tables — the calculation catalogue" },
  { n: 5, code: "BP-03", title: "Payroll Readiness & Opening a Cycle", sub: "Run readiness checks and open the payroll cycle" },
  { n: 6, code: "FD-RUN-01", title: "Run Payroll — Dry Run", sub: "Simulate the run and review results before committing" },
  { n: 7, code: "FD-RUN-02", title: "Finalize & Close a Payroll Period", sub: "Cut off, run, approve, post to G/L, and close the period" },
  { n: 8, code: "BP-PAYSLIP", title: "Payslips — Template & Bulk Generation", sub: "Design a template and bulk-generate payslips from a closed run" },
  { n: 9, code: "BP-09", title: "Bank File Generation", sub: "Produce and validate the bank payment file" },
  { n: 10, code: "BP-10", title: "G/L Posting", sub: "Build the balanced journal and post it to S/4" },
  { n: 11, code: "BP-REPORT", title: "Payroll Reports", sub: "Statutory, management and audit reports for the run" },
  { n: 12, code: "BP-ANALYTICS", title: "Payroll Analytics", sub: "The executive cost board — KPIs, cost drivers and Gross to Net" },
  { n: 13, code: "BP-13", title: "Off-Cycle Payroll — One-Time Payments", sub: "Run an off-cycle one-time payment outside the regular cycle" },
  { n: 14, code: "BP-RETRO", title: "Retroactive Payroll", sub: "Back-dated change triggers and the next-cycle recompute" },
  { n: 15, code: "BP-LOAN", title: "Loans & Advances", sub: "Loan recovery schedules, compliance guardrails and policy" },
  { n: 16, code: "BP-18", title: "End-of-Service & Leave Provisioning", sub: "End-of-service and leave-provision scheme configuration" },
];

(async () => {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "KUT", width: W, height: H }); pptx.layout = "KUT";

  // 1 — intro, exact deck title-slide style
  S.titleSlide(pptx, meta);

  // 2..17 — one transition per business process, exact deck section-divider style
  MODULES.forEach((m) =>
    S.sectionDivider(pptx, "Business Process " + String(m.n).padStart(2, "0") + "  ·  " + m.code, m.title, m.sub));

  // 18 — outro, exact deck sign-off style
  S.closingSlide(pptx, meta);

  await pptx.writeFile({ fileName: OUT });
  console.log("wrote", OUT, "(", 2 + MODULES.length, "slides )");
})();
