# Phase 3 – Inputs required from Buddhi Labs

Status of every real-world value needed for production. **No value below has been supplied yet**; nothing was
invented. Placeholders on the site remain visible until the "Current Value" column is filled and the change is applied.
Send values to the developer or edit the file(s) in the last column.

Status legend: **Missing** = not provided · **Provided** = received and applied · **N/A** = not applicable

## Company details

| Category | Required Item | Current Value | Status | File(s) Affected |
|----------|---------------|---------------|--------|------------------|
| Company | Official legal company name | `[TO BE CONFIRMED: Legal Company Name]` | Missing | privacy.html, terms.html, index.html JSON-LD |
| Company | Company registration number (if publicly displayed) | `[TO BE CONFIRMED: Company Registration Details]` | Missing | privacy.html, terms.html |
| Company | Official domain name | `https://www.buddhilabs.com` (placeholder) | Missing | all *.html (canonical/OG/JSON-LD), sitemap.xml, robots.txt, site-config.js, docker/nginx.conf CSP, docker-compose.prod.yml |
| Company | Office address | `[TO BE CONFIRMED: Office Address]` | Missing | site-config.js `ADDRESS`; privacy.html, terms.html |
| Company | City and country | Kathmandu, Nepal | Provided | footer, contact, JSON-LD |
| Company | Business hours | `[TO BE CONFIRMED: Business Hours]` | Missing | site-config.js `BUSINESS_HOURS` |
| Company | Official sales email | `[TO BE CONFIRMED: Official Email]` | Missing | site-config.js `SALES_EMAIL`; backend `.env` `NOTIFY_EMAIL_TO` |
| Company | Official support email | `[TO BE CONFIRMED: Support Email]` | Missing | site-config.js `SUPPORT_EMAIL` |
| Company | Official phone number | `[TO BE CONFIRMED: Phone Number]` | Missing | site-config.js `PHONE`, `PHONE_DISPLAY` |
| Company | WhatsApp number (only if available) | – | Missing | site-config.js `WHATSAPP` |
| Company | Google Maps URL or embed code | – (map placeholder shown) | Missing | site-config.js `GOOGLE_MAPS_EMBED_URL` |

## Social profiles (icons stay hidden until a URL is set)

| Category | Required Item | Current Value | Status | File(s) Affected |
|----------|---------------|---------------|--------|------------------|
| Social | LinkedIn URL | – | Missing | site-config.js `SOCIAL.linkedin` |
| Social | Facebook URL | – | Missing | site-config.js `SOCIAL.facebook` |
| Social | Instagram URL | – | Missing | site-config.js `SOCIAL.instagram` |
| Social | YouTube URL | – | Missing | site-config.js `SOCIAL.youtube` |
| Social | X/Twitter URL (only if active) | – | Missing | site-config.js `SOCIAL.x` |

## Product information

| Category | Required Item | Current Value | Status | File(s) Affected |
|----------|---------------|---------------|--------|------------------|
| Product | Confirmed HRMS features | 8 features worded as supplied in Phase 2 brief | Provided (wording) / capabilities unconfirmed | hrms.html |
| Product | Confirmed EV Risk Intelligence features | 8 features worded as supplied in Phase 2 brief | Provided (wording) / capabilities unconfirmed | ev-risk-intelligence.html |
| Product | Confirmed integrations | "integration-ready; scoped during implementation" | Missing | hrms.html, ev-risk-intelligence.html, products.html |
| Product | Confirmed deployment model (cloud / on-premise / both) | "based on implementation scope" | Missing | hrms.html FAQ, products.html FAQ |
| Product | Confirmed product availability (GA / pilot / beta) | not stated | Missing | products.html, hrms.html, ev-risk-intelligence.html |
| Product | Confirmed support model (hours, channels, response targets) | "confirmed in writing" | Missing | products.html FAQ, contact.html FAQ |
| Product | Pricing decision: public pricing / request quote / no pricing page | "On request" | Missing (decision) | products.html comparison + FAQ |
| Product | Actual demo booking method (form only / calendar link / phone) | contact form (demo mode) | Missing | contact.html, CTAs |

## Media

| Category | Required Item | Current Value | Status | File(s) Affected |
|----------|---------------|---------------|--------|------------------|
| Media | Official transparent logo file (if available) | Derived from supplied PNG (`buddhi-labs-logo-transparent.png`) | Provided (derived) | assets/brand/ |
| Media | HRMS dashboard screenshot | "Product preview coming soon" visual | Missing | assets/images/products/hrms/dashboard.webp; index.html, hrms.html, products.html |
| Media | HRMS employee / attendance / leave / payroll screenshots | – | Missing | assets/images/products/hrms/*.webp; hrms.html gallery |
| Media | EV Risk dashboard screenshot | "Product preview coming soon" visual | Missing | assets/images/products/ev-risk/dashboard.webp; ev-risk-intelligence.html, products.html |
| Media | EV Risk fleet / risk score / alerts / reports screenshots | – | Missing | assets/images/products/ev-risk/*.webp |
| Media | Team member names, roles, bios | Bikash Kadayat – Founder & CEO; Karan Rai – Chief Marketing Officer; Nabraj Kadayat – Chief Operations Manager (bios supplied) | Provided | team.html, about.html, index.html |
| Media | Team member photographs and LinkedIn URLs (approved) | branded initial avatars, no social links | Missing | team.html (`.avatar-initials` → `<img>`; social-links comment in each card) |
| Media | Office photos (only if available) | stylised illustration | Missing | about.html, assets/images/team/ |
| Media | Client logos (only with permission) | none shown | Missing | index.html (section to be added) |
| Media | Product demo videos (only if available) | – | Missing | hrms.html, ev-risk-intelligence.html hero |
| Media | Approved testimonials (name, role, organization, approval) | none shown | Missing | index.html (section to be added) |

## Technical configuration

| Category | Required Item | Current Value | Status | File(s) Affected |
|----------|---------------|---------------|--------|------------------|
| Form | Chosen contact-form method (Formspree / Netlify / Node backend / FastAPI) | `FORM_PROVIDER: 'none'` (demonstration mode) | Missing (decision) | site-config.js |
| Form | Formspree form ID OR backend endpoint | – | Missing | site-config.js `CONTACT_FORM_ENDPOINT` |
| Form | Recipient sales email | – | Missing | backend `.env` `NOTIFY_EMAIL_TO` or provider dashboard |
| Form | Recipient support email | – | Missing | site-config.js `SUPPORT_EMAIL` |
| Form | SMTP provider details (only if Node backend is used) | – | Missing | backend `.env` `SMTP_*` (server only) |
| Form | PostgreSQL decision (only if Node backend is used) | SQLite default | Missing (decision) | backend `.env` `DATABASE_URL`, docker-compose.prod.yml |
| Analytics | GA4 Measurement ID | – | Missing | site-config.js `GA4_MEASUREMENT_ID` |
| Analytics | Google Tag Manager container ID (optional) | – | Missing | site-config.js `GTM_CONTAINER_ID` |
| Analytics | Google Search Console verification token | commented meta tag | Missing | head of every page (build partial) |
| Analytics | Microsoft Clarity project ID (optional) | – | Missing | site-config.js `CLARITY_PROJECT_ID` |
| Analytics | Meta Pixel ID (optional) | – | Missing | site-config.js `META_PIXEL_ID` |
| Analytics | Cookie-consent requirement for target markets (legal decision) | banner implemented, shown when any tracker is configured | Missing (legal review) | docs/legal-review-checklist.md |
| Security | reCAPTCHA v3 site key + secret key (optional) | – | Missing | site-config.js `RECAPTCHA_SITE_KEY`; backend `.env` `RECAPTCHA_SECRET_KEY` |
| Hosting | Hosting provider / VPS access details | – | Missing | docs/deployment-checklist.md |
| Hosting | Domain DNS access details | – | Missing | docs/deployment-checklist.md |
| Hosting | Domain email DNS (MX/SPF/DKIM/DMARC) if using domain email | – | Missing | DNS provider |

## Legal

| Category | Required Item | Current Value | Status | File(s) Affected |
|----------|---------------|---------------|--------|------------------|
| Legal | Effective date, jurisdiction, retention periods, third-party services list, cookie policy wording | placeholders | Missing | privacy.html, terms.html |
| Legal | Adviser approval of privacy.html and terms.html | draft banners visible | Missing | docs/legal-review-checklist.md |
