# Launch settings template – Buddhi Labs

Fill in this template and hand it to the developer (or apply the values yourself). Public values go into
`assets/js/business-config.js`; private values go into `.env` / `backend/.env` (never committed).
✅ = already supplied · ⬜ = still needed

## A. Public company information (→ business-config.js `company` / `contact`)
| Item | Value | Status |
|---|---|---|
| Display name | Buddhi Labs | ✅ |
| Legal name | | ⬜ |
| Registration number | | ⬜ |
| Domain | https://buddhilabs.bikashkadayat.com.np | ✅ |
| Canonical URL | https://buddhilabs.bikashkadayat.com.np | ✅ |
| Office address | New Baneshwar, Kathmandu, Nepal | ✅ |
| Business hours | 10:00 AM – 5:00 PM | ✅ (days of week not specified) |
| Sales email | salesbuddhilabs@gmail.com | ✅ |
| Support email | supportbuddhilabs@gmail.com | ✅ |
| Privacy email | (falls back to sales email on legal pages; dedicated address recommended) | ⬜ |
| Phone | +977 9705811712 | ✅ |
| WhatsApp | +977 9705811712 (wa.me/9779705811712) | ✅ |
| Google Maps URL / embed | | ⬜ |

## B. Social links (→ `social`; icons stay hidden until filled)
| Platform | URL | Status |
|---|---|---|
| LinkedIn | | ⬜ |
| Facebook | | ⬜ |
| Instagram | | ⬜ |
| YouTube | | ⬜ |
| X/Twitter | | ⬜ |

## C. Contact form (→ `form`; secrets → .env only)
| Item | Value | Status |
|---|---|---|
| Selected provider | Formspree | ✅ |
| Formspree endpoint / Netlify / custom API URL | https://formspree.io/f/________ | ⬜ |
| Inquiry recipient email | kadayatxbikash2008@gmail.com (owner); salesbuddhilabs@gmail.com recommended for leads | ✅ |
| Spam protection choice | Formspree built-in + honeypot; reCAPTCHA/Turnstile optional | ⬜ decide |
| Turnstile / reCAPTCHA public (site) key | | ⬜ |
| Backend configuration confirmation (only if custom API is used later) | not used on GitHub Pages | n/a |

## D. Analytics (→ `analytics`; loads only with cookie consent)
| Item | Value | Status |
|---|---|---|
| GA4 Measurement ID (G-…) | | ⬜ |
| GTM Container ID (GTM-…) | | ⬜ |
| Microsoft Clarity project ID | | ⬜ |
| Meta Pixel ID | | ⬜ |
| Search Console verification token | | ⬜ |

## E. Products (→ `products`; page copy)
| Item | Value | Status |
|---|---|---|
| HRMS confirmed features | | ⬜ |
| HRMS availability | to-be-confirmed | ⬜ |
| HRMS deployment model | to-be-confirmed | ⬜ |
| HRMS pricing decision | request-demo | ⬜ confirm |
| EV Risk confirmed features | | ⬜ |
| EV Risk availability | to-be-confirmed | ⬜ |
| EV Risk deployment model | to-be-confirmed | ⬜ |
| EV Risk pricing decision | request-demo | ⬜ confirm |

## F. Media
| Item | Status |
|---|---|
| Team photos (Bikash Kadayat, Karan Rai, Nabraj Kadayat) | ⬜ |
| Team LinkedIn URLs (optional, with approval) | ⬜ |
| HRMS screenshots (redacted, docs/product-image-guide.md) | ⬜ |
| EV Risk screenshots | ⬜ |
| Demo videos | ⬜ |
| Client logo permissions | ⬜ |
| Testimonial approval status | ⬜ |

## G. Legal
| Item | Value | Status |
|---|---|---|
| Legal review completed? | | ⬜ |
| Privacy policy effective date | | ⬜ |
| Terms effective date | | ⬜ |
| Jurisdiction | | ⬜ |
| Data retention policy | | ⬜ |
| Cookie policy approval | | ⬜ |
| Third-party processors list (Formspree, GitHub Pages, Google Fonts, analytics if enabled) | | ⬜ |

## H. Deployment
| Item | Value | Status |
|---|---|---|
| Hosting provider | GitHub Pages | ✅ |
| DNS provider | | ⬜ |
| VPS IP or deployment project | GitHub repository: ______ (owner: [YOUR_GITHUB_USERNAME]) | ⬜ |
| SSL status | GitHub-managed after domain validation | ⬜ |
| Backup procedure | git repository (tag before each release) | ⬜ confirm |
| Form test completed | | ⬜ |
| Analytics test completed | | ⬜ (no trackers configured) |
| Sitemap submitted to Search Console | | ⬜ |
