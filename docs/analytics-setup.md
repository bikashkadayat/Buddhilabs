# Analytics and Search Console setup

No tracking script is loaded until (1) an ID is entered in `assets/js/business-config.js` (`analytics` block) **and** (2) the visitor accepts
analytics cookies in the consent banner. `assets/js/main.js` injects the snippets at runtime. Commented reference
snippets remain in the `<head>` of every page for teams that prefer inline tags – if you use them, wrap them in the
same consent check or remove the banner requirement after legal review.

## Cookie consent banner
- Appears on first visit **only when at least one tracker ID is configured** (without trackers the site sets no
  non-essential cookies, so no banner is shown).
- Buttons: **Accept analytics cookies**, **Reject non-essential**, **Manage preferences** (analytics checkbox, off by
  default; essential shown as always-on) and **Save preferences**. Nothing is pre-selected.
- Keyboard accessible (focus lands on the first button; Escape = reject), brand palette, bottom-right card on desktop,
  full-width card on mobile; it never blocks the page.
- Choice stored in `localStorage` key `buddhi_consent_v1` as `{analytics: bool, ts}`; nothing is sent to a server.
- "Cookie preferences" link in the footer reopens the banner (hidden when no trackers are configured).
- Events fired before consent are queued and flushed once analytics loads; without consent they stay in `dataLayer`
  only (useful for local debugging) and never leave the browser.
- Whether a banner is legally required for your markets must be confirmed by legal review
  (docs/legal-review-checklist.md). The implementation is a good-practice default, not a compliance guarantee.

## Google Analytics 4

1. Create a GA4 property and web data stream; copy the Measurement ID (`G-XXXXXXXXXX`).
2. `business-config.js` → `analytics.ga4MeasurementId: "G-XXXXXXXXXX"`.
3. Reload the site and confirm hits in GA4 → Realtime.

## Google Tag Manager (alternative or in addition)

1. Create a container; copy the ID (`GTM-XXXXXXX`).
2. `business-config.js` → `analytics.gtmContainerId: "GTM-XXXXXXX"`.
3. Optionally uncomment the `<noscript>` GTM iframe in the `<body>` of each page (search for `googletagmanager.com/ns.html`).
4. If you use GTM, configure GA4 inside GTM and leave `GA4_MEASUREMENT_ID` empty to avoid double tagging.

## Google Search Console

1. Add the property (URL-prefix: `https://buddhilabs.bikashkadayat.com.np/`, or the Domain property via DNS).
2. HTML-tag method: copy the `content` value. Paste it into `business-config.js` → `analytics.searchConsoleVerification`
   (inserted at runtime as a convenience) **and** uncomment/paste it into the `<meta name="google-site-verification">` tag
   in the `<head>` of every page – Google may not execute JavaScript during verification, so the static tag is the
   reliable method. No token has been supplied yet.
3. Verify, then submit `https://buddhilabs.bikashkadayat.com.np/sitemap.xml` under Sitemaps.

## Optional: Microsoft Clarity and Meta Pixel

- `business-config.js` → `analytics.clarityProjectId` (Clarity → Settings → Setup → project ID).
- `business-config.js` → `analytics.metaPixelId`. Review the Privacy Policy and cookie wording before enabling either.

## Recommended events (already emitted)

Events are pushed to `dataLayer` and, when GA4 is configured, sent via `gtag('event', …)`. Wire them to CTA buttons
with the `data-track` attribute; phone, email and WhatsApp links are detected automatically.

| Event | Trigger |
|---|---|
| `request_demo_click` | Header, hero and CTA "Request a Demo" buttons |
| `hrms_demo_click` | "Request an HRMS Demo" buttons |
| `ev_risk_demo_click` | "Request an EV Risk Demo" buttons |
| `service_inquiry_click` | Service CTAs and service cards |
| `contact_form_start` | First interaction with a form field |
| `contact_form_validation_error` | Submit attempted with invalid fields |
| `contact_form_submit` | Valid form submitted (includes `interest` and `form_mode`) |
| `hrms_demo_form_open` / `ev_risk_demo_form_open` | Contact page opened with the matching `?interest=` |
| `contact_form_success` | Provider confirmed submission |
| `contact_form_error` | Submission failed |
| `phone_click` | Any `tel:` link |
| `email_click` | Any `mailto:` link |
| `whatsapp_click` | Any `wa.me` / WhatsApp link (only if added later) |

Mark `contact_form_success`, `hrms_demo_click` and `ev_risk_demo_click` as conversions (key events) in GA4.

## Privacy rules for events
Events may carry: event name, page path, interest slug, form mode, link text/URL. Events must **never** carry names,
email addresses, phone numbers, organization names or message content. GA4 is configured with `anonymize_ip: true`.

## Verifying

Open the browser console and run `dataLayer` after clicking a CTA; entries appear even before GA4 is configured or
consent is given, which makes the setup testable without an account. To test the banner locally, temporarily set
`analytics.ga4MeasurementId: "G-TEST"` in business-config.js, clear `localStorage`, reload, then revert.
