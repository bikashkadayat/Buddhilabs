# Content to confirm before launch

> **Phase 4A status (2026-09-11):** confirmed and applied via `assets/js/business-config.js` – display name, domain `https://buddhilabs.bikashkadayat.com.np`, office address (New Baneshwar, Kathmandu, Nepal), business hours (10:00 AM – 5:00 PM), sales email, support email, phone/WhatsApp (+977 9705811712), team names and roles. **Still required:** Formspree endpoint, LinkedIn URL, Facebook URL, Instagram URL, YouTube URL, X/Twitter URL, Google Maps URL/embed, legal company name and registration number, dedicated privacy email (sales email is used as the fallback on legal pages), product capability/availability/deployment/pricing confirmation, product screenshots, team photos, demo videos, testimonials/logos with permission, legal approval details, analytics and Search Console IDs.

> Phase 3 note: the consolidated, status-tracked version of this list is **docs/phase-3-inputs-required.md**. Product screenshots now use a "Product preview coming soon" visual (see docs/product-image-guide.md) and the team section is company-focused until individual details are approved.

Every item below is either shown on the website as a `[TO BE CONFIRMED: …]` placeholder, hidden until configured, or
needed to replace placeholder graphics. Provide the values to the developer, or edit the files listed.

| # | Item | Where it is used | How to update |
|---|------|------------------|---------------|
| 1 | **Official phone number** | ✅ +977 9705811712 | `business-config.js` → `contact.phone` / `phoneDisplay` |
| 2 | **Official sales email** | ✅ salesbuddhilabs@gmail.com | `business-config.js` → `contact.salesEmail` |
| 3 | **Support email** | ✅ supportbuddhilabs@gmail.com | `business-config.js` → `contact.supportEmail` |
| 4 | **Office address** | ✅ New Baneshwar, Kathmandu, Nepal | `business-config.js` → `company.address` |
| 5 | **Business hours** | ✅ 10:00 AM – 5:00 PM (days not specified) | `business-config.js` → `company.businessHours` |
| 6 | **Google Maps URL/embed** | ⬜ still required (map stays hidden) | `business-config.js` → `contact.mapsUrl` |
| 7 | **WhatsApp number** | ✅ wa.me/9779705811712 | `business-config.js` → `contact.whatsapp` |
| 8 | **Social media URLs** | ⬜ still required: LinkedIn, Facebook, Instagram, YouTube, X/Twitter (icons hidden) | `business-config.js` → `social` |
| 9 | **Real team member names, roles** | ✅ Confirmed (updated 2026-10-04): Bikash Kadayat (Founder & CEO), Nabraj Kadayat (Chief Operations Manager), Nirmal B.K (Full Stack Developer), Chhatra Kadayat (Frontend Developer), Ram Chandra KC (UI/UX & Customer Success), Bharat Rawal (Sales & Marketing Executive) – shown on team.html, about.html, index.html. Photos live for all six. | Photos and LinkedIn URLs still pending: replace the `.avatar-initials` element in team.html with an `<img>` (square, 400×400+, `assets/images/team/`) |
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
| 24 | **Domain name** | ✅ https://buddhilabs.bikashkadayat.com.np | `npm run set-domain -- <url>` |
| 25 | **Hosting / VPS details** | Deployment | See docs/deployment-checklist.md |
| 26 | **Form provider** | ✅ Formspree selected; ⬜ endpoint still required (form in demo mode) | `business-config.js` → `form.endpoint`; docs/formspree-setup.md |
| 27 | **reCAPTCHA v3 keys** (optional) | Contact form | `site-config.js` → `RECAPTCHA_SITE_KEY`; secret key in backend `.env` |
| 28 | **Support response expectations** | Contact FAQ says "within a few business days"; products FAQ says confirmed in writing | Adjust once a support policy exists |
| 29 | **Open Graph image** (optional improvement) | `assets/brand/og-image.png` is composed from the logo; a designed 1200×630 image can replace it | Replace the file, keep the name |
| 30 | **Insights articles** | blog.html shows six "Coming Soon" drafts | Provide final article text; publish using blog-post-template.html |

## Placeholders currently visible on the site

Search the HTML for `TO BE CONFIRMED` to see them all:

```bash
grep -o "\[TO BE CONFIRMED:[^]]*\]" *.html | sort | uniq -c
```
