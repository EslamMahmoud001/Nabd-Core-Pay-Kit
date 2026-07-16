// capture_TEMPLATE.mjs — the house pattern for Nabd screenshot capture.
//
// Copy to  <app-repo>/Payroll_KUT/Nabd-User-Manual/Screenshots/capture_<id>.mjs
// and RUN FROM THE RUNNING NABD REPO ROOT (the one serving :3003, so Playwright resolves there):
//     node "<abs path>/capture_<id>.mjs"
//
// Principles (KB-04 §3):
//   • Assert each screen by its REAL text before shooting; write _failure.png + url + body head on any failure.
//   • md5 every PNG; THROW on a duplicate (byte-identical screens are the #1 silent capture bug).
//   • Advance wizards via FOOTER buttons, not step-rail nodes. Use selectOption / a select's inputValue()
//     for native <select> — never assert a select's option as visible text.
//   • Poll async state (aria-selected tabs, row counts) instead of reading once.
//   • Do NOT put \b after a digit in any regex (textContent concatenates: "STEP 2One-time…").
//   • Viewing/preview only unless the task truly calls for a consequential action.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

// ── config ──────────────────────────────────────────────────────────
const PAY  = 'http://localhost:3003';   // Nabd Pay   (use 3002 for Core screens)
const OUT_DIR = 'C:\\path\\to\\Screenshots\\<ID>';   // absolute; one folder per module
fs.mkdirSync(OUT_DIR, { recursive: true });

// ── resolve Playwright's chromium from the app repo ─────────────────
function loadChromium() {
  const bases = [process.cwd(), path.join(process.cwd(), 'app-pay'), path.join(process.cwd(), '..'), path.join(process.cwd(), '..', 'app-pay')];
  for (const b of bases) {
    try {
      const req = createRequire(path.join(b, 'noop.js'));
      let m; try { m = req('@playwright/test'); } catch { m = req('playwright'); }
      if (m && m.chromium) { console.log('Using Playwright from:', b); return m.chromium; }
    } catch {}
  }
  throw new Error('Could not resolve Playwright chromium — run from the app repo root.');
}

// ── screenshot with md5 dedup guard ─────────────────────────────────
const seen = new Map();
const log = [];
async function shot(page, name) {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  const md5 = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
  if ([...seen.values()].includes(md5)) throw new Error(`DUPLICATE screenshot ${name}.png (md5 ${md5.slice(0,8)}) — a stalled flow shot the same screen twice.`);
  seen.set(name, md5);
  log.push(`  OK   ${name}.png  (md5 ${md5.slice(0,8)})`);
}

// ── assert visible text before shooting ─────────────────────────────
async function assertExact(page, text, label = text, timeout = 20000) {
  await page.getByText(text, { exact: true }).first().waitFor({ state: 'visible', timeout });
  log.push(`  assert exact: ${JSON.stringify(label)}`);
}
async function assertBodyIncludes(page, text, label = text, timeout = 20000) {
  await page.locator('body', { hasText: text }).first().waitFor({ state: 'visible', timeout });
  log.push(`  assert text: ${JSON.stringify(label)}`);
}

// ── run ─────────────────────────────────────────────────────────────
const run = async () => {
  const chromium = loadChromium();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
    httpCredentials: { username: 'ahmed', password: 'ahmed' },
  });
  await ctx.addCookies([{ name: 'dev_user', value: 'ahmed', domain: 'localhost', path: '/' }]);
  const page = await ctx.newPage();
  let failed = null;
  console.log(`\n=== <ID> capture ===\n`);

  try {
    // 01 — <describe screen>
    await page.goto(`${PAY}/<route>`, { waitUntil: 'networkidle', timeout: 30000 });
    await assertExact(page, '<real heading text>');
    // ...more asserts that prove the screen shows the state this step describes...
    await shot(page, '01-<screen-name>');

    // 02 — <next screen> ...
  } catch (e) {
    failed = String(e?.message || e).split('\n')[0];
    log.push(`  FLOW STOPPED — ${failed}`);
    try {
      await page.screenshot({ path: path.join(OUT_DIR, '_failure.png'), fullPage: false });
      log.push(`  failure URL : ${page.url()}`);
      log.push(`  body head   : ${(await page.locator('body').innerText()).slice(0, 240).replace(/\s+/g, ' ')}`);
    } catch {}
  }

  await browser.close();
  console.log(log.join('\n'));
  console.log(`\n--- md5 summary (${seen.size} unique) ---`);
  for (const [name, md5] of seen) console.log(`  ${md5}  ${name}.png`);
  if (failed) { console.log(`\n*** CAPTURE FAILED: ${failed}\n*** Do not use this screenshot set.`); process.exit(1); }
  console.log('\nAll screenshots are unique.');
};

run();
