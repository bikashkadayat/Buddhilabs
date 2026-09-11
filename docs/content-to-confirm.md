# Content to confirm before launch

> Phase 3 note: the consolidated, status-tracked version of this list is **docs/phase-3-inputs-required.md**. Product screenshots now use a "Product preview coming soon" visual (see docs/product-image-guide.md) and the team section is company-focused until individual details are approved.

Every item below is either shown on the website as a `[TO BE CONFIRMED: …]` placeholder, hidden until configured, or
needed to replace placeholder graphics. Provide the values to the developer, or edit the files listed.

| # | Item | Where it is used | How to update |
|---|------|------------------|---------------|
| 1 | **Official phone number** | Footer (every page), contact page | `assets/js/site-config.js` → `PHONE` and `PHONE_DISPLAY` |
| 2 | **Official sales email** | Footer, contact page, demonstration-mode notice, "Prefer email?" line | `site-config.js` → `SALES_EMAIL` |
| 3 | **Support email** | Contact page | `site-config.js` → `SUPPORT_EMAIL` |
| 4 | **Office address** | Footer, contact page, privacy/terms | `site-config.js` → `ADDRESS`; privacy.html / terms.html placeholders |
| 5 | **Business hours** | Footer, contact page | `site-config.js` → `BUSINESS_HOURS` |
| 6 | **Google Maps location** | Contact page map | `site-config.js` → `GOOGLE_MAPS_EMBED_URL` (Google Maps → Share → Embed a map → copy the `src`) |
| 7 | **WhatsApp number** (optional) | Not shown until set | `site-config.js` → `WHATSAPP`; add a link if desired |
| 8 | **Social media URLs** (LinkedIn, Facebook, X, YouTube) | Footer icons are hidden until set | `site-config.js` → `SOCIAL` |
| 9 | **Real team member names, roles** | ✅ Confirmed: Bikash Kadayat (Founder & CEO), Karan Rai (Chief Marketing Officer), Nabraj Kadayat (Chief Operations Manager) – shown on team.html, about.html, index.html | Photos and LinkedIn URLs still pending: replace the `.avatar-initials` element in team.html with an `<img>` (square, 400×400+, `assets/images/team/`) |
| 10 | **Company history / founding year** | about.html "Who we are" (HTML comment placeholder) | Edit about.html |
| 11 | **Client logos** | Not shown (no section until logos are approved) | Add a "Trusted by" strip on index.html once logos and permission are available |
| 12 | **Client testimonials** | Not shown (removed; no fabricated quotes) | Add a testimonials section on index.html once written approval is received |
| 13 | **Actual product screenshots** – HRMS | index.html hero, hrms.html hero, products.html card | Replace `assets/images/products/hrms-dashboard.svg` (1440×900 PNG/WebP recommended) |
| 14 | **Actual product screenshots** – EV Risk | ev-risk-intelligence.html hero, products.html card | Replace `assets/images/products/ev-dashboard.svg` |
| 15 | **Demo video URLs** (optional) | Product hero `screen-frame` blocks | Replace the `<img>` with an `<iframe>`/`<video>` where the `PLACEHOLDER VISUAL` comment is |
| 16 | **Pricing information** (if public) | products.html comparison row shows "On request"; products FAQ | Edit products.html and the FAQ answer (and its JSON-LD twin) |
| 17 | **Confirmed product capabilities** | hrms.html / ev-risk-intelligence.html feature text uses "integration-ready", "based on implementation scope" | Confirm which integrations, hosting, mobile access or data feeds are actually available, then adjust wording |
| 18 | **Privacy policy legal details** | privacy.html: legal name, registration number, address, email, effective date, third-party services, retention periods, cookie policy | See docs/legal-review-checklist.md |
| 19 | **Terms of service legal details** | terms.html: legal name, registration number, address, jurisdiction, liability wording, effective date | See docs/legal-review-checklist.md |
| 20 | **Company registration details** | privacy.html, terms.html | Legal name and registration number |
| 21 | **Google Analytics 4 Measurement ID** | Loaded by main.js when set | `site-config.js` → `GA4_MEASUREMENT_ID` |
| 22 | **Google Tag Manager container ID** (if used instead of GA4 direct) | `site-config.js` → `GTM_CONTAINER_ID` | |
| 23 | **Google Search Console verification value** | `<head>` of every page (commented meta tag) | Uncomment and paste in the build partial / all HTML files; see docs/analytics-setup.md |
| 24 | **Domain name** | Canonical, Open Graph, sitemap.xml, robots.txt, site-config.js | Search-and-replace `https://www.buddhilabs.com` |
| 25 | **Hosting / VPS details** | Deployment | See docs/deployment-checklist.md |
| 26 | **Form provider decision** | Contact form is in demonstration mode | `site-config.js` → `FORM_PROVIDER`, `CONTACT_FORM_ENDPOINT`; see docs/contact-form-integration.md |
| 27 | **reCAPTCHA v3 keys** (optional) | Contact form | `site-config.js` → `RECAPTCHA_SITE_KEY`; secret key in backend `.env` |
| 28 | **Support response expectations** | Contact FAQ says "within a few business days"; products FAQ says confirmed in writing | Adjust once a support policy exists |
| 29 | **Open Graph image** (optional improvement) | `assets/brand/og-image.png` is composed from the logo; a designed 1200×630 image can replace it | Replace the file, keep the name |
| 30 | **Insights articles** | blog.html shows six "Coming Soon" drafts | Provide final article text; publish using blog-post-template.html |

## Placeholders currently visible on the site

Search the HTML for `TO BE CONFIRMED` to see them all:

```bash
grep -o "\[TO BE CONFIRMED:[^]]*\]" *.html | sort | uniq -c
```
