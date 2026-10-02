import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Analyzer, formatConsoleReport } from 'semantica11y';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'reports');
const REPORT_FILE = path.join(REPORT_DIR, 'semantica11y-report.txt');
const SITE_URL = 'https://annmariedittell.github.io/';
const SKIP_DIRS = new Set(['.git', 'node_modules', 'reports']);
const failOnFindings = process.argv.includes('--fail-on-findings');

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.well-known') continue;
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

function publishedUrl(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  if (normalized === 'index.html') return SITE_URL;
  if (normalized.endsWith('/index.html')) {
    return new URL(normalized.replace(/index\.html$/, ''), SITE_URL).href;
  }
  return new URL(normalized, SITE_URL).href;
}

const files = (await collectHtmlFiles(ROOT)).sort();
const totals = { pages: files.length, findings: 0, errors: 0, warnings: 0, suggestions: 0 };
const reports = [];

console.log(`Semantica11y: scanning ${files.length} HTML pages...\n`);

for (const file of files) {
  const relativePath = path.relative(ROOT, file);
  const html = await readFile(file, 'utf8');
  const analyzer = new Analyzer();
  const results = await analyzer.analyzeHTML(html, publishedUrl(relativePath));

  totals.findings += results.summary.total;
  totals.errors += results.summary.errors;
  totals.warnings += results.summary.warnings;
  totals.suggestions += results.summary.suggestions;

  const report = formatConsoleReport(results, { colors: false });
  reports.push(`FILE: ${relativePath}\n${report}`);

  console.log(`${relativePath}: ${results.summary.total} finding(s) ` +
    `(${results.summary.errors} error, ${results.summary.warnings} warning, ` +
    `${results.summary.suggestions} suggestion)`);
}

await mkdir(REPORT_DIR, { recursive: true });
const summary = [
  'Semantica11y Portfolio Audit',
  '============================',
  `Pages scanned: ${totals.pages}`,
  `Total findings: ${totals.findings}`,
  `Errors: ${totals.errors}`,
  `Warnings: ${totals.warnings}`,
  `Suggestions: ${totals.suggestions}`,
  '',
].join('\n');

await writeFile(REPORT_FILE, `${summary}${reports.join('\n\n')}`, 'utf8');

console.log(`\n${summary.trim()}`);
console.log(`\nDetailed report: ${path.relative(ROOT, REPORT_FILE)}`);
console.log('Semantica11y focuses on semantic HTML and ARIA patterns; it does not replace manual WCAG, keyboard, or screen-reader testing.');

if (failOnFindings && (totals.errors > 0 || totals.warnings > 0)) {
  console.error('\nAudit gate failed because errors or warnings were found.');
  process.exitCode = 1;
}
