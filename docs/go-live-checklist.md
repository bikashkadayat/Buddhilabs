# Go-live checklist – Buddhi Labs website

Tick every box before switching DNS to production. Items marked ⚠ are currently **blocked** on information the
business must provide (see docs/phase-3-inputs-required.md).

## Brand and content
- [x] Official logo verified (assets/brand/buddhi-labs-logo.png and derived files; no SVG/text substitutes)
- [x] Official contact information added (business-config.js: sales/support email, phone, WhatsApp, address, hours) – ⬜ Google Maps URL still missing
- [x] Official domain configured: https://buddhilabs.bikashkadayat.com.np (canonical, OG, JSON-LD, sitemap, robots, CNAME)
- [ ] ⚠ HRMS screenshots approved and added (assets/images/products/hrms/)
- [ ] ⚠ EV Risk screenshots approved and added (assets/images/products/ev-risk/)
- [x] Team details approved (names, roles, bios on team.html; photos/LinkedIn optional – see phase-3-inputs-required.md)
- [ ] ⚠ Social links (none supplied; icons hidden)
- [ ] ⚠ Product claims verified (integrations, deployment model, availability, support model)
- [ ] ⚠ Legal pages reviewed and draft banners removed (docs/legal-review-checklist.md)
- [ ] Client testimonials approved, if used (docs/testimonial-and-client-logo-policy.md)

## Lead generation
- [ ] ⚠ Formspree endpoint entered in business-config.js (provider selected; endpoint missing → demo mode)
- [ ] ⚠ Recipient email tested (real submission received in the sales inbox)
- [ ] Demo inquiry type tested (?interest=hrms-demo and ?interest=ev-risk-demo preselect correctly – verified in QA)
- [ ] Spam protection enabled (honeypot active; reCAPTCHA or provider filtering configured)
- [x] Form error message tested (QA: failed endpoint shows error, no success)
- [ ] Form success message tested against the live provider

## SEO
- [x] Unique titles verified (12/12)
- [x] Meta descriptions verified (unique, ≤ 160 characters)
- [x] Canonical domain configured
- [x] Sitemap updated (10 public pages)
- [x] robots.txt verified
- [ ] ⚠ Google Search Console verified (meta tag placeholder in every head)
- [ ] Sitemap submitted
- [x] Open Graph image verified (assets/brand/og-image.png, 1200×630)
- [ ] Google Business Profile created or updated, if applicable

## Analytics
- [x] Cookie consent tested (banner appears only when a tracker ID is set; accept/reject/manage; keyboard accessible)
- [ ] GA4 configured (business-config.js analytics.ga4MeasurementId) – not supplied; no trackers load
- [x] Demo CTA events tracked (request_demo_click, hrms_demo_click, ev_risk_demo_click – verified in dataLayer)
- [x] Contact form events tracked (start, validation_error, submit, success, error, *_form_open)
- [x] No PII is sent to analytics (events carry interest slugs and link labels only)

## Deployment
- [ ] GitHub Pages enabled (Settings → Pages → Source: GitHub Actions) and workflow run green
- [ ] DNS CNAME `buddhilabs` → `[YOUR_GITHUB_USERNAME].github.io` created
- [ ] Custom domain validated in GitHub and "Enforce HTTPS" ticked
- [x] Static artifact build tested locally (`npm ci && npm run build && npm run build:site`)
- [ ] Backup created (git tag + `pgdata` volume snapshot if the API is used)
- [ ] Monitoring plan defined (/healthz, /api/health uptime checks)
- [x] 404 page tested (nginx error_page → 404.html, noindex)
- [ ] Contact form tested in production
