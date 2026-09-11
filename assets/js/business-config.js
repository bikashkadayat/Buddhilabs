/* =====================================================================
   Buddhi Labs – PUBLIC business configuration
   ---------------------------------------------------------------------
   Public configuration only. Never add API keys, passwords, SMTP
   credentials, Formspree account passwords, CAPTCHA secret keys,
   database URLs, or other private credentials to this file.
   Everything here is downloaded by every visitor's browser.

   Private/server values belong in .env files (see .env.example and
   backend/.env.example) which are git-ignored.

   Empty strings mean "not configured": the site keeps its visible
   [TO BE CONFIRMED: …] placeholders, hides optional blocks (social icons,
   WhatsApp, map), keeps the form in safe demonstration mode and loads no
   analytics. Nothing breaks when a value is empty.

   To change the public domain, do NOT edit only this file – run
   `npm run set-domain -- https://your-domain` so canonical tags, sitemap,
   robots.txt and JSON-LD stay in sync (see README).
   ===================================================================== */
window.BUDDHI_LABS_CONFIG = {

  /* ---- Company: public identity and location.
          legalName / registrationNumber are shown on legal pages only when filled. ---- */
  company: {
    displayName: "Buddhi Labs",
    legalName: "",
    registrationNumber: "",
    domain: "https://buddhilabs.bikashkadayat.com.np",
    canonicalUrl: "https://buddhilabs.bikashkadayat.com.np",
    city: "Kathmandu",
    country: "Nepal",
    address: "New Baneshwar, Kathmandu, Nepal",
    businessHours: "10:00 AM – 5:00 PM"
  },

  /* ---- Contact: rendered as mailto:/tel:/wa.me links wherever data-contact="…" appears.
          phone = E.164 digits for the tel: link, phoneDisplay = readable text.
          whatsapp = international number, digits only (wa.me/<digits>).
          privacyEmail: leave empty to fall back to salesEmail on legal pages (documented). ---- */
  contact: {
    salesEmail: "salesbuddhilabs@gmail.com",
    supportEmail: "supportbuddhilabs@gmail.com",
    privacyEmail: "",
    phone: "+9779705811712",
    phoneDisplay: "+977 9705811712",
    whatsapp: "9779705811712",
    mapsUrl: ""
  },

  /* ---- Social: icons stay hidden until a real profile URL is entered. Never use "#" or guesses. ---- */
  social: {
    linkedin: "",
    facebook: "",
    instagram: "",
    youtube: "",
    x: ""
  },

  /* ---- Contact form.
          provider: "demo" | "formspree" | "netlify" | "custom-api"
          endpoint: Formspree → https://formspree.io/f/FORM_ID ; custom-api → https://api.example/api/contact
          The form stays in demonstration mode until provider AND endpoint are valid (netlify needs no endpoint).
          recipientEmail is informational (where the provider delivers leads); it is not used by the browser.
          Only PUBLIC site keys go here (Turnstile/reCAPTCHA site key). Secret keys never. ---- */
  form: {
    provider: "formspree",
    endpoint: "",
    recipientEmail: "kadayatxbikash2008@gmail.com",
    turnstileSiteKey: "",
    recaptchaSiteKey: ""
  },

  /* ---- Analytics: each tracker loads only when its ID is set AND the visitor accepts analytics cookies.
          The cookie banner appears only when at least one ID is set.
          searchConsoleVerification: value of the HTML-tag method; inserted at runtime AND should be pasted into the
          <head> template for reliable verification (see docs/analytics-setup.md). ---- */
  analytics: {
    ga4MeasurementId: "",
    gtmContainerId: "",
    clarityProjectId: "",
    metaPixelId: "",
    searchConsoleVerification: ""
  },

  /* ---- Products: business decisions that page copy should respect (informational; no pricing is rendered).
          availability: "to-be-confirmed" | "available" | "pilot"
          pricingMode:  "request-demo" | "request-quote" | "public"  (public pricing pages are not implemented)
          deploymentModel: "to-be-confirmed" | "cloud" | "on-premise" | "both" ---- */
  products: {
    hrms:   { availability: "to-be-confirmed", pricingMode: "request-demo", deploymentModel: "to-be-confirmed" },
    evRisk: { availability: "to-be-confirmed", pricingMode: "request-demo", deploymentModel: "to-be-confirmed" }
  }
};
