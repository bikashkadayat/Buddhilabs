# Contact form integration

The contact form (`contact.html`) is driven by `assets/js/contact-form.js` and configured entirely in
`assets/js/business-config.js` (`form` block; `site-config.js` adapts it). **Selected provider: Formspree** – see
docs/formspree-setup.md. Endpoint not yet supplied → demonstration mode. **Until a provider is configured the form is in demonstration mode**: validation runs,
but nothing is submitted and a clearly styled notice tells visitors to contact Buddhi Labs directly. The form never
shows a success message unless the provider responds with HTTP 2xx.

## Configuration keys

| Key (site-config.js) | Values | Notes |
|---|---|---|
| `form.provider` | `demo` · `formspree` · `netlify` · `custom-api` | `demo`, or any provider without a valid endpoint, = demonstration mode |
| `form.endpoint` | URL | Formspree: must match `https://formspree.io/f/<id>`; custom-api: https URL or `/api/...` |
| `form.recaptchaSiteKey` | public site key | Optional. Loads reCAPTCHA v3 and adds `g-recaptcha-response` (secret key stays server-side) |
| `contact.salesEmail` / `contact.phone` | | Shown in the demonstration-mode notice ("Online form submission is being configured…") |

The same keys are listed in `.env.example` for server-side or CI use.

## Payload sent by the form

JSON (custom / Formspree) or form-encoded (Netlify):

```json
{
  "full_name": "…", "organization": "…", "email": "…", "phone": "…",
  "interest": "hrms-demo",           // machine value, see below
  "interest_label": "HRMS Demo",     // human-readable label
  "budget_range": "1l-5l",           // optional
  "message": "…", "consent": "yes",
  "source_page": "https://buddhilabs.bikashkadayat.com.np/contact.html?interest=hrms-demo",
  "submitted_at": "2026-09-11T10:15:00.000Z",
  "_subject": "Buddhi Labs website enquiry: HRMS Demo",   // Formspree email subject
  "g-recaptcha-response": "…"        // only when reCAPTCHA is enabled
}
```

### Interest values and CTA links

CTA buttons across the site pass `?interest=<slug>`; the form pre-selects the matching option and shows a
"You are enquiring about…" line.

| Link | Pre-selected option |
|---|---|
| `contact.html?interest=hrms-demo` (alias `hrms`) | HRMS Demo |
| `contact.html?interest=ev-risk-demo` (alias `ev`, `ev-risk`) | EV Risk Intelligence Demo |
| `contact.html?interest=demo` | Product Demo (General) |
| `contact.html?interest=software-development` | Software Development Project |
| `contact.html?interest=it-support` | IT Support |
| `contact.html?interest=seo-services` | SEO Services |
| `contact.html?interest=it-training` | IT Training |
| `contact.html?interest=general` or `general-inquiry` | General Business Inquiry |
| `contact.html?interest=partnership` / `careers` | Partnership / Careers |

## Option 1 – Formspree

1. Create a form at formspree.io and copy the endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `site-config.js`: `FORM_PROVIDER: 'formspree'`, `CONTACT_FORM_ENDPOINT: 'https://formspree.io/f/abcdwxyz'`.
3. In Formspree, set the notification email (sales inbox) and enable spam filtering. Formspree accepts JSON when
   the request has `Accept: application/json` (already set).
4. Test a submission; the success message appears only after Formspree returns 200.

## Option 2 – Netlify Forms

1. Deploy the site on Netlify.
2. In `site-config.js`: `FORM_PROVIDER: 'netlify'`. The script adds `data-netlify="true"` and the `form-name`
   field automatically and posts form-encoded data to `/`.
3. Netlify needs the form to exist in the HTML at build time – it does (`<form name="contact">`). Add a hidden
   `data-netlify-honeypot="website"` attribute in `contact.html` if you want Netlify to use the existing honeypot field.
4. Configure notifications in the Netlify dashboard (Forms → Notifications).

## Option 3 – Custom Node.js/Express backend (included, production-ready)

`backend/server.js` implements `POST /api/contact` and `GET /api/health`:
server-side validation and sanitization, fixed allow-lists for interest/budget, per-IP rate limiting, honeypot,
optional reCAPTCHA v3 verification, CORS restricted to `ALLOWED_ORIGINS`, **PostgreSQL** (when `DATABASE_URL` is set,
parameterized queries, UUID ids) or SQLite fallback, **SMTP email notification** to `NOTIFY_EMAIL_TO`, generic JSON
errors, startup validation of required environment variables, no stack traces or payloads in logs.

1. `cp backend/.env.example backend/.env` and fill in `ALLOWED_ORIGINS`, `NOTIFY_EMAIL_TO`, `SMTP_HOST`, `SMTP_PORT`,
   `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (and `DATABASE_URL`, `RECAPTCHA_SECRET_KEY` if used). Secrets stay on the server.
2. Local test: `cd backend && npm install && NODE_ENV=development node server.js` → `curl localhost:3000/api/health`.
3. Production: `docker compose -f docker-compose.prod.yml up -d --build` (services `web`, `api`, `db`, `reverse-proxy`).
4. In `site-config.js`: `FORM_PROVIDER: 'custom'`, `CONTACT_FORM_ENDPOINT: '/api/contact'`; rebuild and deploy the site.
5. Send a test enquiry and confirm (a) HTTP 201 in the network tab, (b) a row in the `leads` table, (c) the email arrives.

Table (PostgreSQL): `backend/schema.sql` – `id UUID, full_name, organization, email, phone, interest, budget_range,
message, consent_given, source_page, created_at`. No IP addresses or user agents are stored.

## Option 4 – FastAPI backend (alternative, not included)

If the team prefers Python, implement the same contract: Pydantic model with the field limits above, `slowapi` or a
Redis counter for rate limiting, `asyncpg`/SQLAlchemy with the same `leads` table, `aiosmtplib` for notification,
`CORSMiddleware` with the production origin only, `/api/health`. Keep the JSON response shape `{ok, id | errors}`
so the front-end needs no change.

## Required validation (client and server)

| Field | Rule |
|---|---|
| name | required, ≥ 2 characters |
| email | required, valid format |
| phone | optional; digits, `+`, spaces, dashes, 7–20 chars |
| subject / interest | required, one of the listed options |
| message | required, ≥ 20 characters |
| consent | required checkbox linking to the Privacy Policy |
| website (honeypot) | must be empty |

The included backend re-validates every rule; never trust client-side validation alone.

## Spam protection options

1. **Honeypot field** – included (`website`, hidden from humans).
2. **reCAPTCHA v3** – set `RECAPTCHA_SITE_KEY`; verify the token server-side.
3. **Rate limiting** – included in the backend (10 requests per 10 minutes per IP); Formspree/Netlify provide their own.
4. **Server-side email/domain checks** – optional; reject disposable domains if abuse appears.

## Security recommendations

- Serve the site over HTTPS only (see docs/deployment-checklist.md); form data must never travel in clear text.
- Keep secrets (reCAPTCHA secret, SMTP credentials) on the server in `.env`, never in `site-config.js`.
- Restrict CORS on the API to the live domain (`ALLOWED_ORIGIN`).
- Log submissions without storing more than necessary, and follow the retention period in the Privacy Policy.
- Test the error path (stop the backend or use a wrong endpoint) and confirm the red error alert appears and no
  success message is shown.

## Analytics events emitted by the form

`contact_form_start` (first field focused), `contact_form_validation_error`, `contact_form_submit`,
`contact_form_success`, `contact_form_error`, `hrms_demo_form_open` and `ev_risk_demo_form_open` (page opened with the
matching `?interest=`). Events carry only the interest slug and form mode – never names, emails, phone numbers or message
text – and leave the browser only when a tracker is configured **and** the visitor accepted analytics cookies.
See docs/analytics-setup.md.
