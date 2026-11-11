#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pipelineOnly = process.argv.includes('--pipeline-only');
let passed = 0;
let failed = 0;
const pass = (message) => { passed += 1; console.log(`PASS  ${message}`); };
const fail = (message) => { failed += 1; console.error(`FAIL  ${message}`); };
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

function validJson(relative) {
  try { return JSON.parse(read(relative)); } catch (error) { fail(`${relative}: ${error.message}`); return null; }
}

function walk(directory, extension) {
  const full = path.join(root, directory);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory() && ['node_modules', '.git'].includes(entry.name)) return [];
    return entry.isDirectory() ? walk(relative, extension) : (!extension || entry.name.endsWith(extension) ? [relative] : []);
  });
}

function checkPipeline() {
  const pkg = validJson('build-pipeline/package.json');
  if (pkg) pass('build-pipeline/package.json is valid JSON');
  const scripts = walk('build-pipeline', '.js');
  let syntaxFailures = 0;
  for (const relative of scripts) {
    const result = spawnSync(process.execPath, ['--check', path.join(root, relative)], { encoding: 'utf8' });
    if (result.status !== 0) { syntaxFailures += 1; fail(`${relative} syntax: ${(result.stderr || result.stdout).trim()}`); }
  }
  if (!syntaxFailures) pass(`${scripts.length} pipeline JavaScript files pass node --check`);
  for (const asset of ['build-pipeline/assets/raptors_icon.png', 'build-pipeline/assets/sap_gold.png']) {
    fs.existsSync(path.join(root, asset)) ? pass(`${asset} exists`) : fail(`${asset} missing`);
  }
  const machinePaths = scripts.filter((relative) => /[A-Za-z]:\\Users\\|Nabd-Claude|outputs[\\/]kut_build/.test(read(relative)));
  machinePaths.length ? fail(`pipeline contains machine-specific paths: ${machinePaths.join(', ')}`) : pass('pipeline has no machine-specific paths');
}

checkPipeline();
if (pipelineOnly) {
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

const plugin = validJson('.claude-plugin/plugin.json');
const market = validJson('.claude-plugin/marketplace.json');
if (plugin) pass('plugin manifest is valid JSON');
if (market) pass('marketplace manifest is valid JSON');
if (plugin && market) {
  const entry = market.plugins?.find((item) => item.name === plugin.name);
  entry ? pass('marketplace contains plugin entry') : fail('marketplace plugin entry missing');
  plugin.version === market.metadata?.version && plugin.version === entry?.version
    ? pass(`manifest versions agree at ${plugin.version}`) : fail('manifest versions do not agree');
  plugin.name === 'nabd-pay-kit' && market.name === 'nabd-kit'
    ? pass('manifest names match install contract') : fail('manifest names changed unexpectedly');
}

const required = [
  'README.md', 'INSTALL.md', 'qa/SOURCE_BASELINE.md', 'qa/PLUGIN_TEST_PLAN.md', 'qa/TEST_REPORT.md',
  'reference/ASSUMPTIONS.md', 'reference/PREREQUISITES.md', 'reference/SEEDED_DATA.md',
  'reference/FEATURE_INVENTORY.md', 'reference/BUSINESS_PROCESSES.md', 'reference/BANK_TEMPLATES.md',
  'knowledge-base/KB-01_Nabd_System_Guide.md', 'knowledge-base/KB-02_KUT_UAT_Methodology.md',
  'knowledge-base/KB-04_Lessons_and_Playbook.md', 'knowledge-base/KB-05_Environment_Runtime_and_Data.md',
  'knowledge-base/KB-06_Agent_Orchestration_and_Delegation.md',
  'templates/ANOMALY_REGISTER_TEMPLATE.md', 'templates/COVERAGE_AUDIT_TEMPLATE.md', 'templates/capture_TEMPLATE.mjs',
];
const missing = required.filter((relative) => !fs.existsSync(path.join(root, relative)));
missing.length ? fail(`missing required files: ${missing.join(', ')}`) : pass(`${required.length} required files exist`);

const skillFiles = walk('skills', 'SKILL.md');
skillFiles.length === 5 ? pass('five skills found') : fail(`expected five skills; found ${skillFiles.length}`);
const names = [];
for (const relative of skillFiles) {
  const content = read(relative);
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const name = match?.[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = match?.[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  const allowedKeys = new Set(['name', 'description', 'license', 'allowed-tools', 'metadata']);
  const keys = [...(match?.[1].matchAll(/^([A-Za-z][A-Za-z0-9-]*):/gm) || [])].map((item) => item[1]);
  const unexpected = keys.filter((key) => !allowedKeys.has(key));
  const validName = name && /^[a-z0-9-]+$/.test(name) && !name.startsWith('-') && !name.endsWith('-') && !name.includes('--') && name.length <= 64;
  const validDescription = description && description.length <= 1024 && !/[<>]/.test(description);
  if (validName && validDescription && !unexpected.length) { names.push(name); pass(`${relative} frontmatter`); }
  else fail(`${relative} invalid frontmatter (name/description/keys)`);
}
new Set(names).size === names.length ? pass('skill names are unique') : fail('duplicate skill names');

const commands = walk('commands', '.md');
commands.length === 5 ? pass('five commands found') : fail(`expected five commands; found ${commands.length}`);
for (const relative of commands) {
  const content = read(relative);
  /^---\r?\n[\s\S]*?^description:\s*.+$/m.test(content) ? pass(`${relative} has description`) : fail(`${relative} missing description`);
}

const bankCandidates = [
  'qa/bank-templates/cib-txt.candidate.json',
  'qa/bank-templates/hsbc-csv.candidate.json',
  'qa/bank-templates/credit-agricole-xlsx.candidate.json',
  'qa/bank-templates/qnb-xlsx.candidate.json',
];
let validBankCandidates = 0;
for (const relative of bankCandidates) {
  if (validJson(relative)) validBankCandidates += 1;
}
validBankCandidates === bankCandidates.length
  ? pass('four bank-template candidate files are valid JSON')
  : fail(`only ${validBankCandidates}/${bankCandidates.length} bank-template candidate files are valid JSON`);
const bankHarnesses = walk('qa/bank-templates', '.cjs');
bankHarnesses.push('qa/bank-templates/eligible_generation_candidates.test.js');
let bankHarnessSyntaxFailures = 0;
for (const relative of bankHarnesses) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, relative)], { encoding: 'utf8' });
  if (result.status !== 0) {
    bankHarnessSyntaxFailures += 1;
    fail(`${relative} syntax: ${(result.stderr || result.stdout).trim()}`);
  }
}
if (!bankHarnessSyntaxFailures) pass(`${bankHarnesses.length} bank-template harnesses pass node --check`);

const activeText = ['README.md', 'INSTALL.md', ...walk('skills', '.md'), ...walk('commands', '.md'),
  ...walk('reference', '.md'), ...walk('knowledge-base', '.md'), ...walk('templates')]
  .filter((relative) => relative.replaceAll('\\', '/') !== 'knowledge-base/KB-05_Environment_Runtime_and_Data.md');
const absolutePaths = activeText.filter((relative) => /[A-Za-z]:\\Users\\|Nabd-Claude|outputs[\\/]kut_build/.test(read(relative)));
absolutePaths.length ? fail(`active docs contain machine-specific paths: ${absolutePaths.join(', ')}`) : pass('active docs have no machine-specific paths');
const oldRuntime = activeText.filter((relative) => /NABD_ALT|55432|controlled\s+17|17-person roster/i.test(read(relative)));
oldRuntime.length ? fail(`active docs assert obsolete runtime state: ${oldRuntime.join(', ')}`) : pass('active docs do not assert obsolete runtime state');
const mojibake = activeText.filter((relative) => /â[€™”“–—†‡€¢]|Ã—|Â·/.test(read(relative)));
mojibake.length ? fail(`active docs contain mojibake: ${mojibake.join(', ')}`) : pass('active docs are UTF-8 clean');

const readme = read('README.md');
const install = read('INSTALL.md');
const installLine = `/plugin install ${plugin?.name}@${market?.name}`;
readme.includes(installLine) && install.includes(installLine) ? pass('install commands match manifests') : fail('install commands do not match manifests');
if (plugin && readme.includes(`Version ${plugin.version}`)) pass('README version matches manifest');
else fail('README version does not match manifest');

const git = spawnSync('git', ['ls-files'], { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' });
if (git.status === 0) {
  const stray = git.stdout.split(/\r?\n/).filter((file) => /(^|\/)node_modules\/|screenshots\/|\.(docx|pptx)$/i.test(file));
  stray.length ? fail(`tracked generated/dependency files: ${stray.join(', ')}`) : pass('git hygiene excludes dependencies, screenshots and generated artifacts');
}

console.log(`\nTier 0: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
