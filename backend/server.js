/**
 * Buddhi Labs – Contact form API (production)
 * ------------------------------------------------------------------
 *   POST /api/contact  validate -> sanitize -> rate-limit -> store -> notify -> JSON
 *   GET  /api/health   liveness probe
 *
 * Storage : PostgreSQL when DATABASE_URL is set (parameterized queries), otherwise SQLite (node:sqlite).
 * Email   : SMTP notification to NOTIFY_EMAIL_TO when SMTP_HOST/SMTP_USER/SMTP_PASS are set.
 * Secrets : only from environment variables (.env, never committed). Errors are logged without payload data.
 * CORS    : restricted to ALLOWED_ORIGINS (comma-separated) - production domain + localhost for development.
 * See docs/contact-form-integration.md and docs/security-checklist.md.
 */
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

/* ---------- Environment validation ---------- */
const env = process.env;
if (!env.SMTP_PASS && env.SMTP_PASSWORD) env.SMTP_PASS = env.SMTP_PASSWORD;
if (!env.RECAPTCHA_SECRET_KEY && env.RECAPTCHA_SECRET) env.RECAPTCHA_SECRET_KEY = env.RECAPTCHA_SECRET;
const NODE_ENV = env.NODE_ENV || 'development';
const PORT = Number(env.PORT || 3000);
const REQUIRED = NODE_ENV === 'production' ? ['ALLOWED_ORIGINS', 'NOTIFY_EMAIL_TO'] : [];
const missing = REQUIRED.filter((k) => !env[k]);
if (missing.length) {
  console.error(`[startup] Missing required environment variables: ${missing.join(', ')}. See backend/.env.example.`);
  process.exit(1);
}
const smtpVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
const smtpConfigured = smtpVars.every((k) => !!env[k]);
if (NODE_ENV === 'production' && !smtpConfigured) {
  console.warn('[startup] SMTP not fully configured (' + smtpVars.filter((k) => !env[k]).join(', ') + ' missing). Leads will be stored but no email notification will be sent.');
}
const ALLOWED_ORIGINS = (env.ALLOWED_ORIGINS || 'http://localhost:8000,http://localhost:8080,http://127.0.0.1:8000')
  .split(',').map((s) => s.trim()).filter(Boolean);

/* ---------- Storage ---------- */
let store;
if (env.DATABASE_URL) {
  const { default: pg } = await import('pg');
  const pool = new pg.Pool({ connectionString: env.DATABASE_URL, max: 5 });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name VARCHAR(150) NOT NULL,
      organization VARCHAR(150),
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      interest VARCHAR(100) NOT NULL,
      budget_range VARCHAR(100),
      message TEXT NOT NULL,
      consent_given BOOLEAN NOT NULL DEFAULT FALSE,
      source_page VARCHAR(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
  store = {
    kind: 'postgresql',
    async insert(l) {
      const r = await pool.query(
        `INSERT INTO leads (full_name, organization, email, phone, interest, budget_range, message, consent_given, source_page)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [l.full_name, l.organization, l.email, l.phone, l.interest, l.budget_range, l.message, l.consent_given, l.source_page]);
      return r.rows[0].id;
    },
    async ping() { await pool.query('SELECT 1'); }
  };
} else {
  const { DatabaseSync } = await import('node:sqlite');
  const DB_PATH = env.DB_PATH || path.join(process.cwd(), 'data', 'leads.db');
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec(`CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY, full_name TEXT NOT NULL, organization TEXT, email TEXT NOT NULL, phone TEXT,
      interest TEXT NOT NULL, budget_range TEXT, message TEXT NOT NULL, consent_given INTEGER NOT NULL DEFAULT 0,
      source_page TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
  const stmt = db.prepare(`INSERT INTO leads (id, full_name, organization, email, phone, interest, budget_range, message, consent_given, source_page)
                           VALUES (?,?,?,?,?,?,?,?,?,?)`);
  store = {
    kind: 'sqlite',
    async insert(l) {
      const id = crypto.randomUUID();
      stmt.run(id, l.full_name, l.organization, l.email, l.phone, l.interest, l.budget_range, l.message, l.consent_given ? 1 : 0, l.source_page);
      return id;
    },
    async ping() { db.prepare('SELECT 1').get(); }
  };
}

/* ---------- Email ---------- */
let mailer = null;
if (smtpConfigured) {
  const { default: nodemailer } = await import('nodemailer');
  mailer = nodemailer.createTransport({
    host: env.SMTP_HOST, port: Number(env.SMTP_PORT || 587), secure: env.SMTP_SECURE === 'true',
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
  });
}
const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function notify(lead, id) {
  if (!mailer || !env.NOTIFY_EMAIL_TO) return false;
  const rows = [['Name', lead.full_name], ['Organization', lead.organization], ['Email', lead.email], ['Phone', lead.phone],
                ['Interest', lead.interest], ['Budget range', lead.budget_range], ['Source', lead.source_page]];
  await mailer.sendMail({
    from: env.SMTP_FROM || env.SMTP_USER,
    to: env.NOTIFY_EMAIL_TO,
    replyTo: lead.email,
    subject: `[Buddhi Labs website] ${lead.interest} - ${lead.full_name}`,
    text: `New enquiry (#${id})\n\n` + rows.map(([k, v]) => `${k}: ${v || '-'}`).join('\n') + `\n\nMessage:\n${lead.message}\n`,
    html: `<p><strong>New enquiry</strong> (#${esc(id)})</p><table>` + rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v || '-')}</td></tr>`).join('') + `</table><p>${esc(lead.message).replace(/\n/g, '<br>')}</p>`
  });
  return true;
}

/* ---------- App ---------- */
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', env.TRUST_PROXY === 'true' ? 1 : false);
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  }
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ---------- Rate limiting (in-memory; use a shared store if you run several API instances) ---------- */
const WINDOW_MS = Number(env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const MAX_HITS = Number(env.RATE_LIMIT_MAX || 5);
const hits = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) { const recent = v.filter((t) => now - t < WINDOW_MS); if (recent.length) hits.set(k, recent); else hits.delete(k); }
}, WINDOW_MS).unref();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now); hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

/* ---------- Validation & sanitization ---------- */
// strip ASCII control characters except tab/newline/carriage-return, trim, cap length
const CONTROL = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const clean = (v, max) => (typeof v === 'string' ? v.replace(CONTROL, '').trim().slice(0, max) : '');
const INTERESTS = new Set(['hrms-demo', 'ev-risk-demo', 'product-demo', 'software-development', 'it-support', 'seo-services', 'it-training', 'general', 'partnership', 'careers']);
const BUDGETS = new Set(['', 'not-sure', 'under-1l', '1l-5l', '5l-20l', 'over-20l']);
function validate(body) {
  const errors = {};
  const lead = {
    full_name: clean(body.full_name || body.name, 150),
    organization: clean(body.organization || body.company, 150),
    email: clean(body.email, 255).toLowerCase(),
    phone: clean(body.phone, 50),
    interest: clean(body.interest, 100),
    budget_range: clean(body.budget_range, 100),
    message: clean(body.message, 5000),
    consent_given: body.consent === 'yes' || body.consent === true,
    source_page: clean(body.source_page || body.source, 255)
  };
  if (lead.full_name.length < 2) errors.name = 'Name is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errors.email = 'Valid email is required.';
  if (lead.phone && !/^[+\d][\d\s\-()]{6,19}$/.test(lead.phone)) errors.phone = 'Phone number looks invalid.';
  if (!INTERESTS.has(lead.interest)) errors.interest = 'Please choose a valid topic.';
  if (!BUDGETS.has(lead.budget_range)) lead.budget_range = '';
  if (lead.message.length < 20) errors.message = 'Message must be at least 20 characters.';
  if (!lead.consent_given) errors.consent = 'Consent is required.';
  if (clean(body.website, 10)) errors.spam = 'Rejected.'; // honeypot
  return { lead, errors };
}
async function verifyRecaptcha(token, ip) {
  if (!env.RECAPTCHA_SECRET_KEY) return true;
  if (!token) return false;
  try {
    const r = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.RECAPTCHA_SECRET_KEY, response: token, remoteip: ip })
    });
    const j = await r.json();
    return !!j.success && (j.score === undefined || j.score >= Number(env.RECAPTCHA_MIN_SCORE || 0.5));
  } catch { return false; }
}

/* ---------- Routes ---------- */
app.get('/api/health', async (_req, res) => {
  try { await store.ping(); res.json({ ok: true, storage: store.kind, email: !!mailer, env: NODE_ENV }); }
  catch { res.status(503).json({ ok: false }); }
});

app.post('/api/contact', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ ok: false, errors: { rate: 'Too many requests. Please try again later.' } });
  const { lead, errors } = validate(req.body || {});
  if (Object.keys(errors).length) return res.status(400).json({ ok: false, errors });
  if (!(await verifyRecaptcha(req.body['g-recaptcha-response'], ip))) {
    return res.status(400).json({ ok: false, errors: { captcha: 'Verification failed. Please try again.' } });
  }
  try {
    const id = await store.insert(lead);
    let emailed = false;
    try { emailed = await notify(lead, id); }
    catch (e) { console.error(`[lead ${id}] email notification failed: ${e.code || e.message}`); }
    console.log(`[lead ${id}] stored (${store.kind}) interest=${lead.interest} emailed=${emailed}`);
    return res.status(201).json({ ok: true, id });
  } catch (e) {
    console.error(`[contact] storage failure: ${e.code || e.message}`);
    return res.status(500).json({ ok: false, errors: { server: 'Could not save your message. Please try again later.' } });
  }
});

app.use((_req, res) => res.status(404).json({ ok: false, errors: { notFound: 'Not found' } }));
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(`[error] ${err.type || err.code || err.message}`); // no stack traces or payloads in logs/responses
  res.status(err.status || 500).json({ ok: false, errors: { server: 'Request could not be processed.' } });
});

app.listen(PORT, () => console.log(`Buddhi Labs contact API (${NODE_ENV}) on http://localhost:${PORT} storage=${store.kind} email=${!!mailer} origins=${ALLOWED_ORIGINS.join(',')}`));
