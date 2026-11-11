// Copy into a project working area and run from the Nabd app clone root.
// Usage: node capture_<id>.mjs <output-directory>
// Optional env: NABD_BASE_URL, NABD_DEV_USER. Local Basic auth is read from
// NABD_BASIC_USER/NABD_BASIC_PASSWORD only when both are set; never hard-code secrets.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const BASE_URL = process.env.NABD_BASE_URL || 'http://localhost:3003';
const OUT_DIR = path.resolve(process.argv[2] || path.join(process.cwd(), 'Screenshots', 'MODULE-ID'));
const DEV_USER = process.env.NABD_DEV_USER;
fs.mkdirSync(OUT_DIR, { recursive: true });

function loadChromium() {
  for (const base of [process.cwd(), path.join(process.cwd(), 'app-pay'), path.join(process.cwd(), 'app-core')]) {
    try {
      const req = createRequire(path.join(base, 'noop.js'));
      let pkg;
      try { pkg = req('@playwright/test'); } catch { pkg = req('playwright'); }
      if (pkg?.chromium) return pkg.chromium;
    } catch {}
  }
  throw new Error('Playwright Chromium was not found from the application clone.');
}

const seen = new Map();
const manifest = [];

async function capture(page, name, expectation) {
  await expectation();
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
  const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const duplicate = [...seen.entries()].find(([, prior]) => prior === hash);
  if (duplicate) throw new Error(`Duplicate screenshot: ${name}.png equals ${duplicate[0]}.png`);
  seen.set(name, hash);
  manifest.push({ name, file, sha256: hash, url: page.url() });
}

const chromium = loadChromium();
const browser = await chromium.launch();
const credentials = process.env.NABD_BASIC_USER && process.env.NABD_BASIC_PASSWORD
  ? { username: process.env.NABD_BASIC_USER, password: process.env.NABD_BASIC_PASSWORD }
  : undefined;
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 2,
  httpCredentials: credentials,
});
if (DEV_USER) await context.addCookies([{ name: 'dev_user', value: DEV_USER, domain: 'localhost', path: '/' }]);
const page = await context.newPage();

try {
  await page.goto(`${BASE_URL}/<verified-route>`, { waitUntil: 'networkidle', timeout: 30_000 });
  await capture(page, '01-verified-screen', async () => {
    await page.getByRole('heading', { name: '<verified heading>' }).waitFor({ state: 'visible' });
    // Add assertions that uniquely prove the intended state. Mask sensitive fields before capture.
  });

  fs.writeFileSync(path.join(OUT_DIR, 'capture-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Captured ${manifest.length} unique screenshot(s) to ${OUT_DIR}`);
} catch (error) {
  try { await page.screenshot({ path: path.join(OUT_DIR, '_failure.png'), fullPage: false }); } catch {}
  console.error(`Capture failed at ${page.url()}: ${error.message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
