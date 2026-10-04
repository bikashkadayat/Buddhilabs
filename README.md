# Buddhi Labs – Official Website

Production-ready marketing and lead-generation website for **Buddhi Labs** (Kathmandu, Nepal):
SaaS products (**HRMS System**, **EV Risk Intelligence System**) and IT services
(Software Development, IT Support, SEO, IT Training).

---

## 1. Overview

| Item | Choice |
|---|---|
| Type | Static, multi-page website (11 public pages + article template + 404) |
| Frontend | HTML5, compiled Tailwind CSS v3 (`assets/css/site.min.css`), design-system CSS, vanilla JS (minified with esbuild) |
| Backend | Optional Node.js + Express `/api/contact` (PostgreSQL or SQLite, SMTP notifications, rate limiting, CORS allow-list); Formspree and Netlify Forms also supported |
| Hosting | Any static host, or Docker + nginx (`Dockerfile`, `docker-compose.yml`) |
| SEO | Per-page title/description, Open Graph, Twitter Card, canonical, JSON-LD, `sitemap.xml`, `robots.txt` |

### Why this stack
* **Framework-light.** A marketing site does not need a SPA. Plain HTML loads fast, is trivially crawlable, and any developer can edit it.
* **Compiled Tailwind CSS** (`tailwind.config.js` + `assets/css/input.css` → `assets/css/site.min.css`, ~30 KB minified). The compiled file is committed, so the site runs from any static server without a build step; run `npm run build` after changes.
* **Vanilla JS** (`main.js`, `contact-form.js`, minified to `*.min.js`) for the mobile menu, consent banner, consent-gated analytics, form validation and submission, plus the interactive layer: staggered scroll reveal, reading-progress line, back-to-top, rotating hero phrase, count-up stats, card spotlight and screenshot tilt (fine pointers only), subscription-length picker and the screenshot lightbox. Everything respects `prefers-reduced-motion`. No runtime dependencies.
* **Backend is optional and isolated.** The form works in mock mode today; switching to the Express API or a form service is a one-line change.

### How content is organized
* `index.html` – overview of everything, designed to convert (hero, products, services, benefits, process, testimonials, blog teaser, CTA).
* `products.html` – overview of both products with a comparison table and FAQ.
* `hrms.html` and `ev-risk-intelligence.html` – dedicated product pages: hero, tagline, who-it-is-for, problems, features, benefits, integrations and CTAs.
* `services.html` – four sections (`#software-development`, `#it-support`, `#seo`, `#it-training`), each with what/who/deliverables/benefits/CTA.
* `team.html` – leadership team (Founder & CEO, Chief Marketing Officer, Chief Operations Manager) with initial-based avatars until photographs are approved.
* `about.html`, `contact.html`, `blog.html` (Insights), `blog-post-template.html`, `privacy.html`, `terms.html`, `404.html`.

---

## 2. Folder structure

```
buddhi-labs/
├── index.html                  Homepage
├── products.html               Products overview + comparison
├── hrms.html                   HRMS System product page
├── ev-risk-intelligence.html   EV Risk Intelligence product page
├── services.html               4 service sections
├── team.html                   Leadership team page
├── about.html                  Company, mission, values, team
├── contact.html                Contact form + info + FAQ
├── blog.html                   Blog listing
├── blog-post-template.html     Single-article template
├── privacy.html                Privacy Policy
├── terms.html                  Terms of Service
├── 404.html                    Not-found page (served by nginx)
├── sitemap.xml
├── robots.txt
├── .env.example                Environment keys mirrored from site-config.js
├── docs/                       Launch documentation (see section 7)
├── assets/
│   ├── css/input.css           Tailwind directives + design-system CSS (source)
│   ├── css/site.min.css        Compiled, minified CSS (committed; npm run build)
│   ├── js/
│   │   ├── business-config.js  ← EDIT THIS: all public business values (no secrets)
│   │   ├── site-config.js      adapter (do not edit)
│   │   ├── main.js / main.min.js            Menu, consent, analytics, tracking, config fill, interactive enhancements
│   │   └── contact-form.js / contact-form.min.js  Validation + provider submission
│   ├── brand/                  Official logo + derived favicons / OG image (see "Logo")
│   └── images/
│       ├── hero/ products/ services/ team/ blog/   ← drop real photos here
│       └── products/*.svg      Placeholder dashboard mockups, avatars, covers, map
├── backend/                    OPTIONAL contact API (Express + SQLite)
│   ├── server.js
│   ├── schema.sql              PostgreSQL schema for `leads`
│   ├── package.json
│   └── Dockerfile
├── docker/nginx.conf
├── Dockerfile                  nginx image serving the static site
├── docker-compose.yml
├── .dockerignore
└── README.md
```

---

## 3. Running the site

### Install and build (Node 22)
```bash
npm install            # tailwindcss + esbuild (dev only)
npm run build          # CSS → assets/css/site.min.css, JS → assets/js/*.min.js
npm run dev            # Tailwind watch mode while editing HTML/CSS
```

### Without Docker (any OS)
```bash
# from the project root (compiled assets are committed, so this works without npm)
python3 -m http.server 8000
```
Open <http://localhost:8000>. Opening the HTML files directly from disk also works, but a local server is recommended so `?interest=` query parameters and fetch calls behave normally.

### With Docker
```bash
docker compose up --build
```
Open <http://localhost:8080>. The image is nginx serving the static files with gzip, cache headers, clean URLs (`/products` → `products.html`) and the custom 404 page.

To deploy, push the image to your registry or simply copy the repository to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, cPanel). No build step is required.

### Production deployment
See **docs/deployment-checklist.md** for VPS (Docker + Nginx/Caddy + Let's Encrypt), static hosting platforms, domain, HTTPS/HSTS, www redirects and Search Console submission.

### Optional backend (Node ≥ 22.13)
```bash
cd backend
npm install
npm start                         # http://localhost:3000
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"HRMS System demo","message":"We have 120 employees and want to see payroll."}'
```
Leads are stored in `backend/data/leads.db` (SQLite). For Docker, uncomment the `api` service in `docker-compose.yml` and the `/api/` proxy block in `docker/nginx.conf`.

---

## 4. Customization guide

**Start with `assets/js/business-config.js`** – the single public configuration file (company details, contact
links, social URLs, form provider/endpoint, analytics IDs, product decisions). `assets/js/site-config.js` is only an
adapter and must not be edited. Values left empty keep the site in a safe state: `[TO BE CONFIRMED: …]` placeholders stay
visible, optional blocks (social icons, WhatsApp, map) stay hidden, no tracking loads and the contact form stays in
demonstration mode. **Public vs private:** anything in `business-config.js` is downloaded by every visitor – never put
API keys, SMTP passwords, database URLs or CAPTCHA secret keys there; those belong in `.env` / `backend/.env`
(git-ignored; templates in `.env.example` and `backend/.env.example`).

### Public domain
The canonical domain is `https://buddhilabs.bikashkadayat.com.np`. To change it everywhere (canonical/OG tags, JSON-LD,
sitemap.xml, robots.txt, CNAME, business-config.js, env examples, docs) run:
```bash
npm run set-domain -- https://www.your-domain.com
npm run build
```
The script accepts only an https:// site root, refuses invalid URLs, never touches `.env` files or dependencies, and
prints the list of files it changed. Search engines do not reliably read metadata inserted by JavaScript, so the domain is
written into the static files at build time rather than at runtime.

### Deployment (current): GitHub Pages
See **docs/github-pages-deployment.md**. `npm run build:site` assembles the public artifact in `_site/`; the workflow in
`.github/workflows/deploy-pages.yml` builds and deploys it on every push to `main`. `CNAME` holds the custom domain.
Docker, the backend and PostgreSQL remain optional (docs/deployment-checklist.md) and are not required for Pages.



| What | Where |
|---|---|
| **Logo** | Official raster files live in `assets/brand/` (see "Logo" below). To update, replace `buddhi-labs-logo.png` and regenerate the derived files with the same crops; keep `width`/`height` attributes on the header/footer `<img>` in the same aspect ratio. |
| **Brand colors / fonts** | `assets/js/tailwind.config.js` (Tailwind `primary`/`accent`/`gray` scales) and the `:root` variables at the top of `assets/css/styles.css`. Keep both in sync. Values are documented under "Brand color system". |
| **Domain** | Search-and-replace `buddhilabs.bikashkadayat.com.np` in all HTML files, `sitemap.xml`, `robots.txt`. |
| **Contact details** | `assets/js/business-config.js` → `company` and `contact` (sales/support/privacy email, phone, WhatsApp, address, hours, maps URL). Legal pages pick up the same values via `data-contact` / `data-company` hooks. |
| **Social links** | `business-config.js` → `social`; footer icons appear only for https URLs. |
| **Product copy / screenshots** | `hrms.html`, `ev-risk-intelligence.html`, `products.html`. Replace `assets/images/products/hrms-dashboard.svg` and `ev-dashboard.svg` with real screenshots or embed a video where the `<!-- Replace ... -->` comments are. |
| **Services copy** | `services.html`. |
| **Team, testimonials, client logos** | `about.html` team cards are placeholders; testimonials and logo strips are intentionally absent until real, approved content exists (docs/content-to-confirm.md). |
| **Blog posts** | Copy `blog-post-template.html`, edit head tags + content, add a card to `blog.html` and a `<url>` to `sitemap.xml`. |
| **Map** | `contact.html`, replace the placeholder image with a Google Maps `<iframe>` (comment shows how). |

### Connecting the contact form
Set `form.provider` and `form.endpoint` in `assets/js/business-config.js`. Supported: `formspree` (selected; see **docs/formspree-setup.md** and **docs/formspree-live-test.md**), `netlify`, `custom-api` (included backend). The form leaves demonstration mode only when the provider is exactly `formspree` and the endpoint is exactly `https://formspree.io/f/<form-id>`; it never fakes a success. Full guide: **docs/contact-form-integration.md**.

### Analytics & Search Console
Enter `analytics.ga4MeasurementId` / `gtmContainerId` (optionally Clarity, Meta Pixel, Search Console token) in `business-config.js`; scripts load only when set **and** the visitor accepts analytics cookies. Search Console verification tag is commented in every `<head>`. Events emitted: `request_demo_click`, `hrms_demo_click`, `ev_risk_demo_click`, `service_inquiry_click`, `contact_form_*`, `phone_click`, `email_click`. Guide: **docs/analytics-setup.md**.

### Tailwind build (production)
Tailwind runs as a build step: `tailwind.config.js` scans all HTML and the two JS files; `assets/css/input.css` holds the directives plus the design-system CSS; `npm run build:css` writes the minified `assets/css/site.min.css`. If you add a utility class only inside JavaScript strings, list it in `scripts/safelist.txt`.

---

## 5. UI/UX design system

### Brand
Professional, innovative, trustworthy. Nepal-based, global standard. Tone: clear, friendly, solution-oriented. No lorem ipsum anywhere.

### Logo
The official logo is the raster file supplied by Buddhi Labs (`assets/brand/buddhi-labs-logo.png`, 2000×2000, dark teal background with the white dotted-radial symbol and "BUDDHI LABS" wordmark). It is used as-is: never redrawn, recoloured, stretched or rotated.

| File | What it is | Where it is used |
|---|---|---|
| `buddhi-labs-logo.png` / `.jpg` | Original asset, untouched | Source of truth, JSON-LD `logo` |
| `buddhi-labs-logo-lockup.png` (+`@1x`) | Same pixels with the empty margins trimmed, brand background kept | Header and footer (`<img class="brand-logo">`, height-only sizing, 2× `srcset`) |
| `buddhi-labs-logo-transparent.png` | Same lockup with the background keyed to transparent | Optional, for placement on other dark surfaces |
| `logo-mark.png` / `logo-mark-transparent.png` | Square crop of the symbol only, padded with brand background | Hero badge, favicons |
| `favicon.png`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` | Down-scaled mark | `<link rel="icon">`, home-screen icon |
| `og-image.png` / `.jpg` | 1200×630 social image composed from the original lockup pixels | Open Graph / Twitter cards |
| `reference/traced-svg-not-official/` | Vector approximations found in the project; kept outside `assets/` for reference only | Not used anywhere, excluded from Docker |

Decorative dot patterns on the site (`.hero-grid`, `.brand-dots`, `.brand-burst`, `.dots-light`) are CSS-generated and inspired by the symbol; they are separate from, and never substitute for, the logo.

### Brand color system
All colours were extracted from the logo. The background samples at `#023530` (98% of pixels), the foreground is pure white, and the anti-aliased edge pixels give the mid tones `#436966`, `#708D8A`, `#AABBB9`. Every other value is the same 174° hue at a different lightness. Tokens live in `assets/css/styles.css` (`:root`) and `assets/js/tailwind.config.js` (`primary`, `accent` and a teal-tinted `gray` scale). Contrast ratios are WCAG 2.1; AA = 4.5:1 for normal text, AAA = 7:1.

| Name | HEX | RGB | HSL | Usage | Contrast notes |
|---|---|---|---|---|---|
| Brand Dark | `#023530` | rgb(2, 53, 48) | hsl(174, 93%, 11%) | Logo background. Header, hero, footer, dark sections, mobile menu. | White text on it: 13.5:1 (AAA) |
| Brand Darker | `#01221F` | rgb(1, 34, 31) | hsl(175, 94%, 7%) | Deepest teal for hero gradient start and burst patterns. | White text: 16.8:1 (AAA) |
| Brand Primary | `#0B5A50` | rgb(11, 90, 80) | hsl(172, 78%, 20%) | Primary buttons, links and headings accents on light surfaces. | White on it: 8.1:1 (AAA); on white: 8.1:1 (AAA) |
| Primary Hover | `#064238` | rgb(6, 66, 56) | hsl(170, 83%, 14%) | Primary button hover. | White on it: 11.4:1 (AAA) |
| Brand Accent | `#2FA391` | rgb(47, 163, 145) | hsl(171, 55%, 41%) | Icons, hover borders, badges, social hover. Decorative use. | On dark: 4.4:1 (large text / UI only); on white: 3.1:1 (not for small text) |
| Accent Soft | `#79D1C1` | rgb(121, 209, 193) | hsl(169, 49%, 65%) | Accent CTA buttons and accent text on dark backgrounds. | On dark: 7.5:1 (AAA); dark text on it: 7.5:1 (AAA) |
| Accent Dark | `#1F8676` | rgb(31, 134, 118) | hsl(171, 62%, 32%) | Accent-coloured text and icons on light surfaces. | On white: 4.4:1 (AA) |
| Brand Light | `#DCEDE9` | rgb(220, 237, 233) | hsl(166, 32%, 90%) | Light green surface: icon boxes, badges, highlighted cards. | Body text on it: 13.5:1 (AAA) |
| Brand Surface | `#F4F9F8` | rgb(244, 249, 248) | hsl(168, 29%, 97%) | Alternating section backgrounds. | Body text on it: 15.4:1 (AAA) |
| Brand White | `#FFFFFF` | rgb(255, 255, 255) | hsl(0, 0%, 100%) | Logo foreground, text on dark, cards. | — |
| Brand Text | `#0F2320` | rgb(15, 35, 32) | hsl(171, 40%, 10%) | Headings and body text on light backgrounds. | On white: 16.4:1 (AAA) |
| Brand Muted | `#5D7976` | rgb(93, 121, 118) | hsl(174, 13%, 42%) | Secondary text, captions, hints. | On white: 4.7:1 (AA) |
| Brand Border | `#CFE0DC` | rgb(207, 224, 220) | hsl(166, 22%, 85%) | Card, input and divider borders. | Non-text; 1.4:1 vs white is intentional for subtle borders |
| Logo Edge Tone | `#436966` | rgb(67, 105, 102) | hsl(175, 22%, 34%) | Sampled from the logo anti-aliasing; used as gray-600 for muted text. | On white: 6.1:1 (AA) |
| Logo Edge Tone | `#AABBB9` | rgb(170, 187, 185) | hsl(173, 11%, 70%) | Sampled from the logo; used as gray-300 for placeholders and disabled text. | Non-text use only |
| Form Error | `#B4483A` | rgb(180, 72, 58) | hsl(7, 51%, 47%) | Functional colour for validation errors only. Not part of the brand palette. | On white: 5.3:1 (AA) |

Semantic states: success uses the accent scale (`#D3F2EB` background, `#0B4A41` text); error uses the muted brick above. No blue, purple, orange or neon colours appear anywhere in the UI.

### Typography
* **Headings:** Poppins 500/600/700 (fallback Inter, system sans).
* **Body:** Inter 400/500/600 (fallback Open Sans, system sans).
* Scale: H1 `text-4xl → 5xl`, H2 `text-3xl → 4xl`, H3 `text-xl/2xl`, body `text-base`, small `text-sm`, labels `text-xs uppercase tracking-wider`.

### Layout & spacing
* Max content width 1280px (`.container-x`) with 16 / 24 / 32px side gutters.
* 12-column grid via Tailwind (`lg:grid-cols-12`, `lg:col-span-*`).
* Vertical rhythm: `.section` = 64px (mobile) / 96px (desktop); `.section-sm` = 48px. Spacing scale follows Tailwind 4/8/12/16/24/32/48/64.

### Components (in `assets/css/styles.css`)
| Class | Purpose |
|---|---|
| `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-accent` / `.btn-white` / `.btn-ghost-light` | Buttons; sizes `.btn-sm`, `.btn-lg` |
| `.card`, `.card-hover` | Product / service / blog / testimonial cards |
| `.icon-box`, `.icon-box-accent` | 48px rounded icon container |
| `.badge`, `.badge-accent` | Pills for categories and product labels |
| `.eyebrow` | Small uppercase section label with accent bar |
| `.check-list` | Benefit lists with check icons |
| `.hero-gradient`, `.hero-grid`, `.gradient-text` | Hero and CTA banner backgrounds |
| `.screen-frame` | Framed screenshot / video container |
| `.form-label`, `.form-input`, `.form-error`, `.form-hint`, `.form-alert-*` | Form system with error/success states |
| `.nav-link`, `.mobile-link` | Header navigation with active state |
| `.prose-article` | Blog article typography |
| `.reveal` | Scroll-in animation (progressive enhancement) |

### Section patterns
* **Hero:** gradient background, eyebrow badge, H1 with gradient highlight, sub-headline, primary + ghost CTA, trust bullets, framed screenshot.
* **Features:** grid of cards, each icon + title + one-sentence description.
* **Benefits:** `.check-list` with bold lead phrase + explanation.
* **Who is it for:** 2×2 grid of persona cards.
* **Problems we solve:** dark card with red "x" markers, placed beside the persona card.
* **Testimonials:** quote mark, quote, avatar, role, organization type.
* **Process:** numbered 4-step row with connector line on desktop.
* **CTA banner:** gradient card before footer with two CTAs.

### UX & accessibility
* Semantic landmarks (`header`, `nav`, `main`, `section[aria-labelledby]`, `footer`), skip link, visible focus rings.
* Mobile hamburger menu with `aria-expanded`, Escape to close, body scroll lock.
* Smooth scroll for anchors, respects `prefers-reduced-motion`.
* Form: required-field markers, inline errors on blur/submit, `aria-invalid`, live-region success/error alerts, honeypot anti-spam.
* All images have `alt` text (decorative avatars use empty `alt`).
* Sticky header offset for anchored sections (`scroll-margin-top`).

---

## 6. Extending the site
* **Pricing page:** copy `services.html` head, reuse `.card` grid with three tiers.
* **Case studies:** reuse the blog card + article template.
* **Client portal link:** add a `.btn-secondary` next to "Request Demo" in the header.
* **Separate product pages:** move each `<section id="hrms">` / `<section id="ev-risk">` into its own file and update nav + sitemap.
* **CMS:** the blog markup is deliberately simple so it can be generated by Eleventy, Hugo, Astro or a headless CMS later.

---

## 7. Documentation (docs/)
| File | Purpose |
|---|---|
| `docs/content-to-confirm.md` | Every placeholder and business detail the owner must provide |
| `docs/contact-form-integration.md` | Formspree, Netlify Forms, custom API, validation, spam and security |
| `docs/analytics-setup.md` | GA4, GTM, Search Console, optional Clarity/Meta Pixel, event list |
| `docs/seo-content-plan.md` | 17 planned Insights articles with intent, keyword, outline and CTA |
| `docs/legal-review-checklist.md` | What a legal adviser must confirm on privacy.html and terms.html |
| `docs/deployment-checklist.md` | VPS/Docker, static hosting, domain, HTTPS, redirects, launch checklist |
| `docs/final-qa-report.md` | Phase 2 QA record |
| `docs/phase-3-inputs-required.md` | Status table of every real value still required (company, media, technical) |
| `docs/product-image-guide.md` | Screenshot sizes, formats, redaction rules, naming, how to replace the preview visual |
| `docs/testimonial-and-client-logo-policy.md` | Permission, attribution, approval and removal rules |
| `docs/security-checklist.md` | Headers, CSP allow-list, secrets, backend and transport checks |
| `docs/go-live-checklist.md` | Launch checkboxes |
| `docs/final-production-qa-report.md` | Production QA results and go-live recommendation |
| `docs/launch-settings-template.md` | Fill-in template of every launch value (public + private) |
| `docs/formspree-setup.md` | Activating the Formspree endpoint |
| `docs/github-pages-deployment.md` | GitHub Pages + custom domain + DNS steps |

## 8. Files that must never be committed
`.env`, `backend/.env`, `*.db`, `backend/data/`, `node_modules/`, `_site/` (build output) – all listed in `.gitignore`. `.env.example` files contain placeholders only.

## 9. Content policy
No fabricated clients, testimonials, statistics, certifications or unverified product capabilities appear on the site. Product features use "integration-ready", "based on implementation scope" and "subject to available data sources" wording until capabilities are confirmed. Unknown business details appear as `[TO BE CONFIRMED: …]`.
# Buddhilabs
# Buddhilabs
