# Deployment checklist

## Run locally

```bash
# from the project root
python3 -m http.server 8000        # http://localhost:8000
```

## Build assets (CSS + JS)

```bash
npm install                        # once
npm run build                      # compiles assets/css/site.min.css and assets/js/*.min.js
npm run dev                        # Tailwind watch mode while editing
```
The compiled files are committed, so `python3 -m http.server` works without a build. Rebuild after editing
`assets/css/input.css`, `tailwind.config.js`, any HTML (new utility classes) or `assets/js/*.js`.

## Run with Docker

```bash
docker compose up --build          # http://localhost:8080
```

The multi-stage image runs `npm run build`, then serves the static files with nginx (gzip, security headers, cache
rules, clean URLs, custom 404) – see `docker/nginx.conf`.

## Domain decisions
| Decision | Value | Where to change |
|---|---|---|
| Primary (canonical) host | `https://www.buddhilabs.com` (www) | `<link rel="canonical">`, OG/JSON-LD URLs in every HTML file, `sitemap.xml`, `robots.txt`, `assets/js/site-config.js` `SITE_URL`, `docker/Caddyfile` / `.env` `DOMAIN`, `backend/.env` `ALLOWED_ORIGINS`, CSP in `docker/nginx.conf` if the API is on another host |
| Redirects | `http://*` → `https://`, `buddhilabs.com` → `https://www.buddhilabs.com` (301) | Caddy (VPS) or platform settings |
| DNS records | `A`/`AAAA` for `www` and apex → server IP (VPS) or `CNAME www` → platform host + apex ALIAS/ANAME; keep TTL low during cutover | DNS provider |
| SSL | Let's Encrypt via Caddy (automatic) or platform-managed | Caddyfile / platform |
| Email DNS (if domain email) | MX for the mail provider, `SPF` TXT, `DKIM` TXT, `DMARC` TXT (`_dmarc`) | DNS provider |
| Form/API subdomain (optional) | `api.buddhilabs.com` → add to `ALLOWED_ORIGINS` and CSP `connect-src`; or keep `/api/` on the same host (default) | backend/.env, nginx.conf, Caddyfile |

If the real domain differs, run once from the project root and rebuild:
```bash
NEW=https://www.your-domain.com; grep -rl "https://www.buddhilabs.com" --include=*.html --include=*.xml --include=*.txt --include=*.js --include=*.conf --include=Caddyfile --include=.env.example . | xargs sed -i "s#https://www.buddhilabs.com#$NEW#g"
```

## Production options

### A. Static website on VPS using Docker + Nginx
1. Provision a VPS (Ubuntu LTS), install Docker and Docker Compose, open ports 80 and 443.
2. `git clone` the project, `cp .env.example .env`, set `DOMAIN`/`APEX_DOMAIN`.
3. Remove the `api` and `db` services from `docker-compose.prod.yml` (static only), then
   `docker compose -f docker-compose.prod.yml up -d --build`. Caddy obtains the certificate automatically.
4. Alternative without Caddy: run `docker compose up -d --build` (port 8080) and put host Nginx/Certbot in front:
   - **Caddy** (simplest, automatic HTTPS):
     ```
     www.buddhilabs.com {
         reverse_proxy localhost:8080
     }
     buddhilabs.com {
         redir https://www.buddhilabs.com{uri} permanent
     }
     ```
   - **Nginx + Certbot**: create a server block proxying to `127.0.0.1:8080`, then
     `sudo certbot --nginx -d buddhilabs.com -d www.buddhilabs.com` and enable auto-renewal (`certbot renew --dry-run`).
4. Enforce HTTPS: redirect all port-80 traffic to `https://`, add
   `Strict-Transport-Security "max-age=31536000; includeSubDomains"` once HTTPS is confirmed working.
5. Choose the canonical host (www or non-www) and 301-redirect the other. The site uses `https://www.buddhilabs.com`
   in canonical tags and sitemap; keep them consistent with the redirect.

### B. Netlify
1. New site from Git; build command `npm run build`; publish directory `.` (root). Node 22 in environment settings.
2. Custom domain → let Netlify issue TLS; enable "Force HTTPS" and set the primary domain to `www`.
3. Netlify Forms (optional): `FORM_PROVIDER: 'netlify'` in site-config.js; the form is detected from `contact.html`
   at build time. Headers: add a `_headers` file mirroring `docker/nginx.conf` if you want the same CSP.
4. 404: Netlify serves `404.html` automatically.

### C. Cloudflare Pages
1. Create a Pages project from Git; build command `npm run build`; output directory `/`.
2. Custom domain + automatic TLS; add a Bulk Redirect (apex → www) and enable "Always use HTTPS".
3. Add a `_headers` file for security headers; use Formspree or the VPS API for the form (Pages has no forms feature).

### D. GitHub Pages (only if no backend is required)
1. Commit compiled `assets/css/site.min.css` and `assets/js/*.min.js` (already committed) – Pages does not run npm.
2. Settings → Pages → deploy from branch; add the custom domain (`CNAME` file) and enforce HTTPS.
3. Use Formspree for the form; custom security headers are not supported on GitHub Pages.

### E. Full website with backend and PostgreSQL on VPS (Docker Compose)
1. Provision a VPS; install Docker; open 80/443 only (PostgreSQL stays internal).
2. `cp .env.example .env` (set `DOMAIN`, `APEX_DOMAIN`, a strong `POSTGRES_PASSWORD`) and
   `cp backend/.env.example backend/.env` (set `ALLOWED_ORIGINS=https://www.buddhilabs.com`, `NOTIFY_EMAIL_TO`, `SMTP_*`,
   optional `RECAPTCHA_SECRET_KEY`).
3. In `assets/js/site-config.js`: `FORM_PROVIDER: 'custom'`, `CONTACT_FORM_ENDPOINT: '/api/contact'`; rebuild.
4. `docker compose -f docker-compose.prod.yml up -d --build` → services `reverse-proxy` (Caddy), `web`, `api`, `db`.
   Caddy routes `/api/*` to the API and everything else to nginx; PostgreSQL uses the named volume `pgdata`.
5. Verify: `curl -s https://www.buddhilabs.com/api/health` → `{"ok":true,"storage":"postgresql",...}`; submit a test enquiry.
6. Backups: `docker exec buddhilabs-db pg_dump -U buddhi buddhilabs > backup.sql` on a schedule.

### Legacy: host Nginx + Certbot in front of the web container
## Domain setup
- `A`/`AAAA` records (VPS) or `CNAME` (platform) for `www`; apex record or ALIAS/ANAME for the root domain.
- Lower TTL before switching, raise it after.
- Update `https://www.buddhilabs.com` everywhere if the final domain differs:
  ```bash
  grep -rl "www.buddhilabs.com" --include=*.html --include=*.xml --include=*.txt --include=*.js . | xargs sed -i 's#https://www.buddhilabs.com#https://www.your-domain.com#g'
  ```

## After the domain is live
- Update `lastmod` in `sitemap.xml`; confirm `robots.txt` points to the live sitemap URL.
- Verify the property in Google Search Console and submit `sitemap.xml` (docs/analytics-setup.md).
- Request indexing of the home page and product pages.
- Check `https://www.buddhilabs.com/assets/brand/og-image.png` renders in a social-share debugger (Facebook Sharing Debugger, LinkedIn Post Inspector).

## Launch checklist
- [ ] Logo assets confirmed (official logo already in `assets/brand/`; replace OG image with a designed one if desired)
- [ ] Real contact details entered in `assets/js/site-config.js` (phone, emails, address, hours, maps embed, social URLs)
- [ ] Form backend connected (`FORM_PROVIDER` ≠ `none`) and a test submission received
- [ ] Analytics configured (GA4 / GTM) and Search Console verified
- [ ] Domain configured and canonical host chosen (www/non-www redirect)
- [ ] SSL certificate issued; HTTPS enforced; HSTS added
- [ ] Mobile layout verified on real devices (320 px, 375 px, 768 px)
- [ ] Contact form tested: validation errors, success state, error state (stop the backend and retry)
- [ ] Sitemap verified in the browser and submitted to Search Console
- [ ] robots.txt verified (allows `/`, disallows `/api/`, `/404.html`, `/blog-post-template.html`)
- [ ] Privacy Policy and Terms reviewed and approved (docs/legal-review-checklist.md); draft banners removed
- [ ] All CTA buttons tested; each pre-selects the correct contact interest
- [ ] 404 page tested (`/does-not-exist`)
- [ ] Placeholder screenshots, team cards and `[TO BE CONFIRMED]` items replaced (docs/content-to-confirm.md)
- [ ] Final project backed up (git tag or archive) before go-live

## Rollback
Keep the previous Docker image (`docker image ls`) or platform deploy; both allow instant rollback to the last known-good version.
