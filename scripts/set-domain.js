#!/usr/bin/env node
/**
 * Buddhi Labs – set the public domain everywhere it matters.
 *   node scripts/set-domain.js https://www.example.com      (or: npm run set-domain -- https://www.example.com)
 *
 * Replaces the CURRENT domain (read from sitemap.xml) in approved public files only:
 *   *.html (canonical, og:url, og:image, twitter:image, JSON-LD URLs), sitemap.xml, robots.txt, CNAME,
 *   assets/js/business-config.js, .env.example, backend/.env.example, README.md, docs/*.md
 * Never touches .env files, node_modules, backend/node_modules, reference/ or Docker images.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const arg = process.argv[2];
function fail(msg) { console.error('✖ ' + msg); process.exit(1); }
if (!arg) fail('Usage: node scripts/set-domain.js https://www.your-domain.com');
let url;
try { url = new URL(arg); } catch { fail(`"${arg}" is not a valid URL.`); }
if (url.protocol !== 'https:') fail('Domain must use https://');
if (url.pathname !== '/' || url.search || url.hash) fail('Provide the site root only (no path, query or fragment), e.g. https://www.example.com');
if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname) || url.hostname.includes('..')) fail(`"${url.hostname}" is not a valid hostname.`);
if (url.username || url.password) fail('Credentials are not allowed in the domain.');
const NEW = 'https://' + url.hostname.toLowerCase();

// current domain = first <loc> in sitemap.xml
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const m = sitemap.match(/<loc>(https?:\/\/[^/<]+)/);
if (!m) fail('Could not read the current domain from sitemap.xml');
const OLD = m[1];
if (OLD === NEW) { console.log(`Domain is already ${NEW}. Nothing to do.`); process.exit(0); }

const targets = [];
const add = (rel) => { const p = path.join(root, rel); if (fs.existsSync(p) && fs.statSync(p).isFile()) targets.push(rel); };
fs.readdirSync(root).filter((f) => f.endsWith('.html')).forEach(add);
['sitemap.xml', 'robots.txt', 'CNAME', 'assets/js/business-config.js', '.env.example', 'backend/.env.example', 'README.md'].forEach(add);
if (fs.existsSync(path.join(root, 'docs'))) fs.readdirSync(path.join(root, 'docs')).filter((f) => f.endsWith('.md')).forEach((f) => add('docs/' + f));

const oldHost = OLD.replace(/^https?:\/\//, '');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const reFull = new RegExp(esc(OLD), 'g');
const reHostOnly = new RegExp('(?<![\\w./-])' + esc(oldHost) + '(?![\\w-])', 'g');   // bare host (CNAME, ALLOWED_ORIGINS docs, DOMAIN=…)
let updated = [], total = 0;
for (const rel of targets) {
  const p = path.join(root, rel);
  const before = fs.readFileSync(p, 'utf8');
  let after = before.replace(reFull, NEW);
  if (rel === 'CNAME') after = url.hostname.toLowerCase() + '\n';
  else after = after.replace(reHostOnly, url.hostname.toLowerCase());
  if (after !== before) { fs.writeFileSync(p, after); const n = (before.match(reFull) || []).length + (before.match(reHostOnly) || []).length; updated.push([rel, n]); total += n; }
}
// sanity checks
const leftovers = [];
for (const rel of targets) { const s = fs.readFileSync(path.join(root, rel), 'utf8'); if (s.includes(oldHost)) leftovers.push(rel); }
console.log(`Domain updated: ${OLD} → ${NEW}`);
updated.forEach(([f, n]) => console.log(`  ✔ ${f} (${n} replacement${n === 1 ? '' : 's'})`));
console.log(`${updated.length} file(s), ${total} replacement(s).`);
if (leftovers.length) { console.warn('⚠ Old host still present in: ' + leftovers.join(', ')); process.exit(2); }
console.log('Next: npm run build, review the diff, redeploy, then resubmit sitemap.xml in Search Console.');
