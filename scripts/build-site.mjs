/**
 * Assemble the public deployment artifact in ./_site (used by the GitHub Pages workflow and for local checks).
 * Copies only what the static site needs; excludes docs, backend, reference, scripts, node_modules, env and Docker files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, '_site');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const copy = (rel) => { const src = path.join(root, rel); if (!fs.existsSync(src)) return; fs.cpSync(src, path.join(out, rel), { recursive: true }); };
fs.readdirSync(root).filter((f) => f.endsWith('.html')).forEach(copy);
['robots.txt', 'sitemap.xml', 'CNAME', '.nojekyll'].forEach(copy);
copy('assets');
// strip build sources and notes that are not needed in production
for (const rel of ['assets/css/input.css', 'assets/js/main.js', 'assets/js/contact-form.js']) fs.rmSync(path.join(out, rel), { force: true });
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/README\.md$/i.test(e.name)) fs.rmSync(p); } };
walk(path.join(out, 'assets'));
const files = []; const list = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? list(p) : files.push(path.relative(out, p)); } }; list(out);
const forbidden = files.filter((f) => /(^|\/)\.env|backend\/|reference\/|docs\/|node_modules|docker-compose|Dockerfile|\.example$/.test(f));
if (forbidden.length) { console.error('Forbidden files in artifact: ' + forbidden.join(', ')); process.exit(1); }
console.log(`_site assembled: ${files.length} files, ${(files.reduce((s, f) => s + fs.statSync(path.join(out, f)).size, 0) / 1024).toFixed(0)} KB`);
