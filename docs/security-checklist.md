# Security checklist

## Static site (nginx in `docker/nginx.conf`)
| Header | Value | Status |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Configured |
| `X-Frame-Options` | `SAMEORIGIN` (plus CSP `frame-ancestors 'self'`) | Configured |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Configured |
| `Permissions-Policy` | camera, microphone, geolocation, payment, usb, interest-cohort all disabled | Configured |
| `Content-Security-Policy` | see allow-list below | Configured |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Set by Caddy (docker/Caddyfile) only where HTTPS terminates; enable on other hosts **after** HTTPS is verified |
| `Cache-Control` | HTML 10 min, images/fonts 30 d–1 y, CSS/JS 30 d | Configured |
| `server_tokens off`, dotfiles/reference/docs/config files return 404 | | Configured |

### CSP allow-list (remove sources you do not use)
| Directive | Sources | Why |
|---|---|---|
| `script-src` | self, googletagmanager.com, google-analytics.com, clarity.ms, connect.facebook.net, google.com, gstatic.com | GA4/GTM, Clarity, Meta Pixel, reCAPTCHA v3 |
| `style-src` | self, `'unsafe-inline'`, fonts.googleapis.com | Google Fonts stylesheet; inline styles from the consent banner and the GTM noscript iframe |
| `font-src` | self, fonts.gstatic.com, data: | Google Fonts files; inline SVG data URIs in CSS |
| `img-src` | self, data:, google-analytics.com, googletagmanager.com, facebook.com, *.clarity.ms | tracker pixels; data-URI icons |
| `connect-src` | self, formspree.io, google-analytics.com, region1.google-analytics.com, googletagmanager.com, *.clarity.ms, facebook.com, google.com | form POST (Formspree), analytics beacons, reCAPTCHA |
| `frame-src` | self, google.com, maps.google.com, googletagmanager.com | Google Maps embed, reCAPTCHA, GTM preview |
| `form-action` | self, formspree.io | native form fallback |
| `object-src 'none'`, `base-uri 'self'`, `upgrade-insecure-requests` | | hardening |
If the API runs on a different origin (e.g. `api.buddhilabs.com`), add it to `connect-src`.
Test with the browser console after enabling each third-party service; a blocked resource shows a CSP error.

## GitHub Pages (current deployment)
- [x] Static only: no backend, database, SMTP or secrets are involved; the artifact (`scripts/build-site.mjs`) refuses to include `.env*`, `backend/`, `reference/`, `docs/`, Docker files or `*.example`.
- [x] HTTPS is provided by GitHub Pages once the custom domain is validated ("Enforce HTTPS").
- [ ] Custom response headers (CSP etc.) are **not** supported on GitHub Pages; the nginx configuration applies only to the optional VPS deployment. Third-party sources in use: Google Fonts, Formspree (when enabled).

## Secrets and configuration
- [x] `.env`, `backend/.env`, `*.db` and `node_modules` are in `.gitignore`; `.env.example` files contain placeholders only.
- [x] `assets/js/business-config.js` (and the `site-config.js` adapter) hold **public** values only (IDs and endpoints that are visible in any browser anyway). Never put SMTP passwords, database URLs, reCAPTCHA secret keys or API tokens there.
- [x] Docker image excludes `docs/`, `reference/`, `backend/`, `scripts/`, compose files and env files (`.dockerignore` + Dockerfile copy list).
- [ ] Rotate `POSTGRES_PASSWORD`, SMTP and reCAPTCHA secrets if they were ever pasted into a chat, ticket or commit.

## Backend (`backend/server.js`) – when the custom provider is enabled
- [x] Server-side validation of every field; interest and budget values checked against fixed lists; message length limits; control characters stripped.
- [x] Parameterized SQL (PostgreSQL `$1…$9`, SQLite prepared statements); no string-built queries.
- [x] Rate limiting per IP (default 5 requests / 10 min) with `trust proxy` so the real client IP is used behind the proxy.
- [x] Honeypot rejection; optional reCAPTCHA v3 server-side verification with minimum score.
- [x] CORS restricted to `ALLOWED_ORIGINS`; no wildcard.
- [x] Startup fails fast when required production variables are missing; SMTP misconfiguration is warned, not silently ignored.
- [x] Error responses are generic JSON; logs contain only error codes and lead IDs, never payload contents.
- [x] `X-Powered-By` disabled; JSON body limit 32 KB; `Cache-Control: no-store`; runs as non-root `node` user in Docker.
- [x] PostgreSQL has no published port in `docker-compose.prod.yml`; named volume for data.
- [ ] Set up off-site backups of the `pgdata` volume (or `/data/leads.db`) and test a restore.
- [ ] Review lead retention in line with the Privacy Policy (delete old leads on a schedule).

## Transport
- [ ] HTTPS only in production (Caddy auto-TLS or platform TLS); HTTP → HTTPS and apex → www redirects verified.
- [ ] HSTS enabled only after HTTPS works on every subdomain covered.
- [ ] If domain email is used: SPF, DKIM and DMARC records published so notification emails are not rejected.

## Front-end
- [x] Forms submit only to configured endpoints; demonstration mode never sends data.
- [x] Analytics scripts load only with a configured ID **and** analytics consent; no PII is sent in events.
- [x] External links opened from config use `rel="noopener"`.
- [x] No inline third-party scripts with fake IDs; all trackers are injected from config.

## Operational
- [ ] Keep nginx/Caddy/Node/PostgreSQL images updated (`docker compose pull` monthly).
- [ ] Monitor `/healthz` (web) and `/api/health` (API) with an uptime service.
- [ ] Keep a rollback image tag before each deployment.
