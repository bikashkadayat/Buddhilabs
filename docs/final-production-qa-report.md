# Final production QA report – Buddhi Labs website (Phase 3)

**Date of testing:** 2026-09-11
**Build under test:** compiled Tailwind (`assets/css/site.min.css`), minified JS, consent-gated analytics, demonstration-mode
contact form, hardened Node backend (tested standalone), nginx security/caching config (reviewed; Docker image not built on
this machine because Docker is not installed here).
**Method:** static audit scripts + headless Chromium driven through the Chrome DevTools Protocol (Node 22). Screenshots
reviewed at 375, 768 and 1440 px.

## Pages tested (12)
index, products, hrms, ev-risk-intelligence, services, about, contact, blog, blog-post-template (noindex), privacy,
terms, 404 (noindex).

## Functional checks
| Check | Result |
|---|---|
| Header navigation, active-state highlighting (product pages highlight "Products") | PASS |
| Mobile menu open/close, `aria-expanded`, Escape closes (375 px) | PASS |
| All CTAs resolve; product demo CTAs carry `?interest=hrms-demo` / `ev-risk-demo` | PASS (803 links, 0 broken, 0 missing anchors) |
| Interest preselection incl. `hrms_demo_form_open` / `ev_risk_demo_form_open` events | PASS |
| Contact form validation: inline errors, `aria-invalid`, focus to first error, `contact_form_validation_error` event | PASS |
| Loading state (`aria-busy`, disabled submit) and success state after provider 2xx (intercepted fetch) | PASS |
| Error state on failed endpoint; no success shown | PASS (Phase 2 test re-run in Phase 3 build) |
| Demonstration mode: no submission, clear notice, no success | PASS |
| Payload contains name, organization, email, phone, interest, budget_range, message, consent, source, submitted_at | PASS |
| Cookie consent: no banner without tracker IDs; footer link hidden | PASS |
| Cookie consent with tracker configured: banner shown, analytics unchecked by default, GA not loaded before consent, first button focused | PASS |
| Reject → stored `analytics:false`, no tracker loaded, events stay in local `dataLayer` only | PASS |
| Accept → stored `analytics:true`, GA script injected; footer "Cookie preferences" reopens banner | PASS |
| Manage preferences → checkbox + Save honoured; Escape = reject | PASS |
| Consent banner usable at 320 px (288 px wide, all 4 buttons focusable) | PASS |
| Keyboard navigation: skip link first, logo second, visible `:focus-visible` outline | PASS |
| No PII in analytics events (event names, interest slugs, link labels only) | PASS (code review + payload inspection) |

## Responsive checks
Horizontal overflow measured (`scrollWidth > innerWidth`) on all 12 pages at **320, 375, 400, 768, 1024, 1280, 1440 px**:
**0 overflows / 84 page-width combinations.** Official logo aspect ratio 2.634 natural = 2.634 rendered on every page.

## SEO checks
- 12 unique titles, 12 unique meta descriptions (all ≤ 160 chars); canonical, OG (1200×630 image), Twitter tags on every page.
- All canonicals use the configured domain `https://buddhilabs.bikashkadayat.com.np` (placeholder until the real domain is confirmed).
- Sitemap lists exactly the 10 indexable pages; robots.txt references the sitemap and disallows `/api/`, `/404.html`, `/blog-post-template.html`.
- JSON-LD: Organization + WebSite (home), ItemList + FAQPage (products), SoftwareApplication + FAQPage (both products),
  4 × Service (services), ContactPage + FAQPage (contact). FAQ text equals FAQPage schema on all four pages (verified programmatically).
- No fabricated ratings, reviews, prices, addresses or social profiles in structured data.

## Performance findings
| Item | Result |
|---|---|
| Tailwind CDN removed | Yes – 0 references; compiled `site.min.css` 29.6 KB (≈6 KB gzipped) |
| JavaScript | `main.min.js` 9 KB, `contact-form.min.js` 5.9 KB, `site-config.js` 2.5 KB |
| Page weight (local assets, incl. logo + favicon) | 101–162 KB raw, **60–88 KB gzipped**; plus Google Fonts (Inter 400/500/600, Poppins 600/700, `display=swap`) |
| Largest assets | original logo PNG/JPG 61–69 KB (kept unchanged as the brand source; not loaded by pages), OG image 55 KB, header lockup 40 KB (1×) / 44 KB (2× srcset) |
| Images | 43 `<img>` elements: all have `alt`, `width` and `height`; every below-the-fold image is `loading="lazy"`; no image without dimensions → no image-driven layout shift |
| Illustrative dashboards | Removed; replaced by CSS/`logo-mark` "Product preview coming soon" cards (no fake data, no extra image bytes) |
| Console | 0 errors, 0 warnings on all pages (Tailwind CDN warning gone) |
| Caching (nginx) | HTML 10 min; CSS/JS 30 d; images 30 d immutable; fonts 1 y; sitemap/robots 1 h |
| Render path | CSS is a single stylesheet; JS is `defer`; fonts use `font-display: swap` |

## Security findings
| Item | Result |
|---|---|
| Secrets in public files | None. Only commented `G-XXXXXXXXXX` / `GTM-XXXXXXX` placeholders found by the scanner. `.env*` ignored; no `.env` present; `.env.example` files contain placeholders only |
| nginx headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy` configured; `server_tokens off`; dotfiles, `/reference/`, `/docs/`, `/scripts/`, `/backend/`, config/source extensions return 404 |
| HSTS | Set by Caddy only where HTTPS terminates (docker/Caddyfile); not set inside the nginx container by design |
| Backend (tested standalone with SQLite) | `/api/health` OK; valid lead → 201; invalid payload → 400 with field errors; honeypot → rejected; disallowed origin → no CORS headers; 4th request in window → 429; production start without `ALLOWED_ORIGINS`/`NOTIFY_EMAIL_TO` → exits with clear message; 404 → JSON; logs contain lead id and interest only |
| Backend not tested | PostgreSQL path and SMTP delivery (no database/SMTP credentials available); reCAPTCHA verification (no keys) |
| Docker | Multi-stage `Dockerfile`, `docker-compose.prod.yml` (Caddy + web + api + db, PostgreSQL without published port, named volumes) written and reviewed; **not built/run here – Docker is not installed on the test machine** |

## Known limitations
1. Contact form remains in **demonstration mode** – no provider has been chosen and no recipient email exists.
2. No analytics IDs; consent banner therefore does not show on the live site until an ID is configured (by design).
3. Product pages show "Product preview coming soon" instead of screenshots.
4. `[TO BE CONFIRMED: …]` placeholders: 88 occurrences / 19 distinct (contact details, business hours, legal entity
   details, dates, jurisdiction). All are listed in docs/phase-3-inputs-required.md.
5. Legal pages carry draft banners pending legal review.
6. Team section is company-focused (no individuals) until approvals exist; no testimonials or client logos (policy in docs).
7. Docker image build and Caddy TLS flow could not be executed on this machine; the configuration follows the documented
   commands and should be verified on the target VPS.
8. In-memory rate limiting is per API instance; use a shared store if the API is scaled horizontally.

## Remaining business-owner actions
See docs/phase-3-inputs-required.md (all "Missing" rows) and docs/go-live-checklist.md (⚠ items). In priority order:
1. Choose the form provider and supply the recipient sales email (plus SMTP details if using the Node backend).
2. Supply phone, sales/support emails, office address, business hours, Google Maps embed, social URLs.
3. Confirm the domain and hosting; provide DNS access.
4. Provide approved, redacted HRMS and EV Risk screenshots.
5. Confirm product capabilities (integrations, deployment model, availability, support model) and the pricing decision.
6. Legal review of privacy.html and terms.html; confirm cookie-consent requirements for target markets.
7. GA4 / GTM IDs and the Search Console verification token (optional but recommended).
8. Team details, testimonials and client logos only with approval.

## Go-live recommendation
**Ready after required details are added.** The build is technically complete and verified: compiled CSS, no console
errors, responsive at all tested widths, accessible navigation and forms, security headers and caching configured,
consent-gated analytics, hardened backend, and SEO metadata in place. Launch is blocked only by missing business
information: contact details, a working form provider/recipient email, the confirmed domain, and legal review. Nothing
fabricated has been added to bridge those gaps.


---

## Addendum – Team page (2026-09-11)

**Change:** new `team.html` (leadership team), "Team" added to desktop nav, mobile menu and footer quick links, leadership
preview on about.html, compact team strip on index.html, Person JSON-LD (name, jobTitle, worksFor, team URL only),
sitemap entry. Confirmed members: Bikash Kadayat – Founder & CEO; Karan Rai – Chief Marketing Officer; Nabraj Kadayat –
Chief Operations Manager. No photographs or social links were supplied; branded initial avatars (`.avatar-initials`,
brand dark #023530 with white initials, `role="img"` + descriptive `aria-label`) are used instead.

| Check | Result |
|---|---|
| team.html loads; exactly one H1; title, description (149 chars), canonical, OG and Twitter tags present | PASS |
| Team link in desktop nav, mobile menu (visible when opened) and footer on all 13 pages; active state on team.html | PASS |
| Home "Meet the Team" and About "Meet Our Team" links resolve; `?interest=general-inquiry` preselects General Business Inquiry | PASS |
| Internal links: 850 checked, 0 broken, 0 missing anchors | PASS |
| Names and titles exact; no COO / Chief Operating Officer / Operations Director wording; no bios in schema | PASS |
| No stock photos, no AI portraits, no social links, no old team placeholders on any public page | PASS |
| Avatars render (96 px on team page, 52 px in previews) with brand colours; 15.9:1 contrast for white on #023530 | PASS |
| No horizontal overflow at 320 / 375 / 768 / 1024 / 1440 px on team, about, index, contact | PASS |
| Console errors on tested pages | 0 |
| Keyboard order: skip link → logo → Home → Products → Services → Team → About → Insights, visible focus rings | PASS |
| Contact demo mode, cookie-consent gating and compiled CSS unaffected | PASS |
| Sitemap includes team.html; robots.txt unchanged and valid | PASS |

Remaining for this section: approved profile photographs and optional LinkedIn URLs (docs/phase-3-inputs-required.md).

---

## Addendum – Central business configuration + GitHub Pages (Phase 4A, 2026-09-11)

**Changes:** `assets/js/business-config.js` (single public configuration; `site-config.js` is now an adapter), config-driven
population of company/contact/social/map/analytics values in `main.js`, Formspree selected (endpoint blank → safe demo mode),
`scripts/set-domain.js` applied with `https://buddhilabs.bikashkadayat.com.np`, `CNAME`, `.nojekyll`,
`.github/workflows/deploy-pages.yml`, `scripts/build-site.mjs` (public artifact), confirmed contact details baked into the
HTML and rendered as links, JSON-LD Organization contact points, WhatsApp link, map/social blocks hidden, new docs.

### Static checks
| Check | Result |
|---|---|
| Internal links | 862 checked, 0 broken, 0 missing anchors |
| Images | 44, all with alt; no stock photos, no map placeholder image |
| Canonical / og:url on all 13 pages | all `https://buddhilabs.bikashkadayat.com.np/…` |
| Sitemap | 11 public pages incl. team.html, correct domain; 404 and article template are noindex and excluded |
| robots.txt | `Sitemap: https://buddhilabs.bikashkadayat.com.np/sitemap.xml` |
| JSON-LD | 11 blocks parse; all 28 URLs on the new domain; Organization has address, sales/support contact points |
| Old domain leftovers | none in HTML/XML/TXT/JS/MD/env examples |
| Tailwind CDN / off-brand classes / `href="#"` social or map links | 0 / none / 0 |
| Secrets in public JS | none; `.env` files absent; `.gitignore` covers `.env`, `backend/.env`, `_site/` |
| Remaining placeholders | 23 occurrences, all legal-entity/legal-review items (legal name, registration, dates, jurisdiction, retention, third-party list) + company history note |

### Runtime – Scenario B (real configuration)
| Check | Result |
|---|---|
| 12 pages × 320/375/768/1024/1440 px: no horizontal overflow | PASS (60/60) |
| Console errors on all pages | 0 |
| `mailto:salesbuddhilabs@gmail.com`, `mailto:supportbuddhilabs@gmail.com` | PASS |
| `tel:+9779705811712` shown as "+977 9705811712" | PASS |
| WhatsApp `https://wa.me/9779705811712`, new tab, `noopener noreferrer`, label "Chat with Buddhi Labs on WhatsApp" | PASS |
| Address "New Baneshwar, Kathmandu, Nepal", hours "10:00 AM – 5:00 PM" | PASS |
| No map, no social icons, no cookie banner, footer cookie link hidden, no tracker scripts requested | PASS |
| Form: Formspree selected, endpoint blank → notice "Online form submission is being configured… salesbuddhilabs@gmail.com … +977 9705811712", valid submit sends **no** request and shows **no** success | PASS |
| Interest preselection: hrms-demo, ev-risk-demo, software-development, it-support, seo-services, it-training, general-inquiry | PASS (7/7) |
| Formspree with valid endpoint (stubbed): POST to endpoint with full_name, organization, email, phone, interest, budget_range, message, consent, source_page, submitted_at; success only after 200; duplicate submit blocked | PASS |
| Formspree with non-Formspree endpoint | stays in demo mode (PASS) |
| Consent banner with a test GA4 id: appears, GA not loaded before consent or after reject | PASS |
| Privacy page: sales email used as privacy fallback; legal name placeholder and draft banner retained | PASS |

### Runtime – Scenario A (empty configuration, served via request interception)
index, contact, privacy, team, about: page loads, 0 console errors, no empty `mailto:`/`tel:`/`wa.me` links, WhatsApp and
support blocks hidden, social icons hidden, map hidden, no cookie banner, form in demonstration mode with the generic
placeholder message – PASS (5/5). Baked-in address text remains visible (progressive enhancement).

### Domain script
Rejects `http://`, URLs with a path, non-URLs, URLs with credentials and missing argument; updated 25 files / 132
replacements; no old-host leftovers; `.env` files untouched.

### GitHub Pages artifact
`npm run build` + `npm run build:site` succeed; `_site` = 38 files (947 KB): 13 HTML pages, assets, CNAME
(`buddhilabs.bikashkadayat.com.np`), robots.txt, sitemap.xml, `.nojekyll`. No `.env`, backend, reference, docs, Docker or
source files included; no localhost/absolute paths. Workflow YAML parses.

### Not verifiable here
Actual GitHub Pages deployment, DNS CNAME, HTTPS enforcement and Formspree delivery require the repository owner's GitHub
account, DNS provider and a Formspree endpoint.

**Go-live recommendation:** ready to publish on GitHub Pages once the owner enables Pages, creates the DNS CNAME and
enforces HTTPS; the contact form stays in safe demo mode until the Formspree endpoint is added.
