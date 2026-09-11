# Final QA report – Buddhi Labs website (Phase 2)

> Superseded for launch purposes by **docs/final-production-qa-report.md** (Phase 3: compiled Tailwind, consent banner, hardened backend, security headers). Kept as the Phase 2 record.

Date: 2026-09-11 · Environment: static build served with `python3 -m http.server`, tested in headless Chromium via
Chrome DevTools Protocol (script kept outside the repository). Re-run the static checks with the commands at the end.

## Pages checked (12)

| Page | Indexable | JSON-LD | H1 | 320 px horizontal scroll | Console errors |
|---|---|---|---|---|---|
| index.html | yes | Organization + WebSite | 1 | none | none¹ |
| products.html | yes | ItemList + FAQPage | 1 | none | none¹ |
| hrms.html | yes | SoftwareApplication + FAQPage | 1 | none | none¹ |
| ev-risk-intelligence.html | yes | SoftwareApplication + FAQPage | 1 | none | none¹ |
| services.html | yes | 4 × Service | 1 | none | none¹ |
| about.html | yes | – | 1 | none | none¹ |
| contact.html | yes | ContactPage + FAQPage | 1 | none | none¹ |
| blog.html | yes | – | 1 | none | none¹ |
| blog-post-template.html | **noindex** (draft) | – | 1 | none | none¹ |
| privacy.html | yes (draft banner) | – | 1 | none | none¹ |
| terms.html | yes (draft banner) | – | 1 | none | none¹ |
| 404.html | noindex | – | 1 | none | none¹ |

¹ The only console message on every page is Tailwind's Play-CDN notice ("cdn.tailwindcss.com should not be used in
production"). It is a warning, not an error, and is listed under Known limitations.

## Tests completed

### Static checks (all pages)
- Internal links and anchors: **821 links, 0 broken, 0 missing anchors**.
- Every `<img>` has an `alt` attribute; decorative logo-mark images use empty alt.
- HTML tag balance verified for structural elements on all pages.
- Titles and meta descriptions: **12 unique titles, 12 unique descriptions**, all descriptions ≤ 160 characters.
- Canonical, Open Graph (incl. 1200×630 image), Twitter Card and favicon tags present on every page.
- FAQ visible text equals FAQPage JSON-LD on hrms, ev-risk-intelligence, products and contact (programmatically compared).
- Off-brand Tailwind colour classes (blue/red/orange/purple/…): **none**. Off-brand hex values in CSS/JS/HTML: **none**.
- Stale `assets/img/` paths: **0**. "Lorem ipsum": **0**.
- Unsupported-claim scan (24/7, real-time, guarantee, award, ISO, certified, trusted by, number one, thousands, best…):
  only matches are the site's own "we do not guarantee" disclaimers, the EV FAQ that explicitly denies prediction/prevention
  claims, and Tailwind `leading-*` class names.
- Every `contact.html?interest=` slug used on the site maps to a form option; every alias target exists in the `<select>`.
- Official logo: header `<img>` natural aspect ratio 2.634 = rendered ratio 2.634 on all pages (no distortion); the file
  is the raster lockup cut from the original PNG, not an SVG or text substitute.
- sitemap.xml lists the 10 public pages; robots.txt allows `/`, disallows `/api/`, `/404.html`, `/blog-post-template.html`.

### Functional checks (headless Chromium)
| Check | Result |
|---|---|
| Mobile menu opens, `aria-expanded` toggles, Escape closes | PASS |
| `?interest=` preselect for hrms-demo, ev-risk-demo, software-development, it-support, seo-services, it-training, demo, general and legacy aliases hrms / ev | PASS (10/10) |
| Demonstration mode: notice visible, valid submit shows **no** success and no error | PASS |
| Empty submit: 5 inline errors, `aria-invalid` set, focus moved to first invalid field | PASS |
| Failed submission with a custom endpoint that returns 404: error alert shown, no success | PASS |
| Keyboard: first Tab reaches skip link, second reaches logo; `:focus-visible` outline rendered | PASS |
| `request_demo_click` pushed to `dataLayer` on CTA click | PASS |
| Social icons hidden and `[TO BE CONFIRMED]` placeholders shown while config is empty | PASS |
| Setting `SALES_EMAIL` / `SOCIAL.linkedin` in config renders mailto link and shows icon | PASS |
| No horizontal scrolling at 320 px on any page | PASS (12/12) |
| Text contrast | Palette documented in README with WCAG ratios; body text 15.6:1, white on brand dark 15.9:1, muted text 5.0:1 |

### Visual review
Desktop (1366 px) and mobile (320 px) screenshots of index, hrms, services and contact reviewed: brand header/hero/footer,
logo sizing, card layouts, demonstration-mode notice and CTA placement render as intended.

## Remaining placeholders (visible on the site)
`[TO BE CONFIRMED: …]` appears for: Official Email, Support Email, Phone Number, Office Address, Business Hours (footer
and contact page), Team Member Name / Role (about.html, 4 cards), Founding year (HTML comment), and on privacy.html /
terms.html: Legal Company Name, Company Registration Details, Effective Date, Review Date, Jurisdiction, third-party
services, retention policy, cookie policy and two adviser-review notes. Full list with locations: docs/content-to-confirm.md.

Placeholder graphics: HRMS and EV dashboard illustrations, blog cover, office illustration, avatar, map (all under
`assets/images/products/`). Each is labelled "illustrative" or "placeholder" in visible text or alt text.

## Known limitations
1. ~~Tailwind Play CDN~~ – resolved in Phase 3 (compiled `assets/css/site.min.css`).
2. **Contact form is in demonstration mode** until `FORM_PROVIDER` is set (docs/contact-form-integration.md).
3. **Analytics is inactive** until IDs are entered; events are still pushed to `dataLayer` for testing.
4. **Legal pages are drafts** with a visible banner; not legal advice until reviewed (docs/legal-review-checklist.md).
5. **Insights** shows six "Coming Soon" drafts; no articles are published. The article template is noindex.
6. **No testimonials, client logos or statistics** are shown, by design, until real approved content exists.
7. Scroll-reveal animation uses IntersectionObserver; content is fully visible without JavaScript (`.no-js` fallback).
8. Product capability wording ("integration-ready", "based on implementation scope", "subject to available data
   sources") should be tightened once the business confirms what is actually available.

## Required business-owner actions before launch
1. Provide contact details, social URLs, map embed and business hours → `assets/js/site-config.js`.
2. Choose and configure a form provider; send a test enquiry end to end.
3. Provide real product screenshots (or demo videos) for HRMS and EV Risk Intelligence.
4. Provide team names, roles and photos; confirm company history text.
5. Confirm product capabilities so feature wording can be finalized; confirm whether pricing is public.
6. Complete legal review of privacy.html and terms.html; remove draft banners.
7. Enter GA4/GTM IDs and Search Console verification; confirm the final domain and run the domain replace command.
8. Approve any testimonials or client logos before they are added.

## Re-run the static checks
```bash
# links/anchors/alt/metadata audit
python3 - <<'PY'
import re,pathlib,html.parser,collections
pages=sorted(pathlib.Path('.').glob('*.html'));ids={};links=[];meta={}
class P(html.parser.HTMLParser):
    def __init__(s,p):super().__init__();s.p=p;s.t=False
    def handle_starttag(s,tag,attrs):
        a=dict(attrs)
        if 'id' in a:ids.setdefault(s.p,set()).add(a['id'])
        for k in('href','src'):
            if k in a:links.append((s.p,a[k]))
        if tag=='img' and 'alt' not in a:print('MISSING ALT',s.p,a.get('src'))
        if tag=='meta' and a.get('name')=='description':meta.setdefault(s.p,{})['d']=a['content']
        if tag=='title':s.t=True
    def handle_data(s,d):
        if s.t:meta.setdefault(s.p,{})['t']=d.strip();s.t=False
for p in pages:P(p.name).feed(p.read_text())
bad=0
for pg,l in links:
    if l.startswith(('http','mailto:','tel:','data:')) or l=='#':continue
    t,_,f=l.partition('#');t=t.split('?')[0];tp=pg if not t else t
    if t and not pathlib.Path(tp).exists():print('BROKEN',pg,l);bad+=1;continue
    if f and tp.endswith('.html') and f not in ids.get(tp,set()):print('MISSING ANCHOR',pg,l);bad+=1
print('links',len(links),'broken',bad,'| unique titles',len({m['t'] for m in meta.values()}),'/ unique descriptions',len({m['d'] for m in meta.values()}),'of',len(meta))
PY
# placeholders still visible
grep -o "\[TO BE CONFIRMED:[^]]*\]" *.html | sort | uniq -c
```
