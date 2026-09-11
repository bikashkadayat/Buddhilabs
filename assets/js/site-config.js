/* =====================================================================
   Buddhi Labs – Site configuration
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to connect the website to real
   services. It is loaded on every page before the other scripts.
   Leave a value empty ('') to keep that feature disabled.

   See docs/contact-form-integration.md and docs/analytics-setup.md.
   The same keys are listed in .env.example for server-side use.
   ===================================================================== */
window.BUDDHI_CONFIG = {
  /* ---- Domain (also replace in <link rel="canonical">, sitemap.xml, robots.txt) ---- */
  SITE_URL: 'https://www.buddhilabs.com',

  /* ---- Contact form ----
     FORM_PROVIDER: 'none' | 'custom' | 'formspree' | 'netlify'
       none      – demonstration mode: no submission is attempted, a notice is shown
       custom    – POST JSON to CONTACT_FORM_ENDPOINT (e.g. '/api/contact', see /backend)
       formspree – POST JSON to your Formspree endpoint, e.g. 'https://formspree.io/f/xxxxxxxx'
       netlify   – POST form-encoded data to '/' (Netlify Forms; add data-netlify="true" is handled automatically) */
  FORM_PROVIDER: 'none',
  CONTACT_FORM_ENDPOINT: '',
  RECAPTCHA_SITE_KEY: '',          // Google reCAPTCHA v3 site key (optional)

  /* ---- Contact details (shown in header/footer/contact page when set) ---- */
  SALES_EMAIL: '',                 // e.g. 'sales@buddhilabs.com'
  SUPPORT_EMAIL: '',               // e.g. 'support@buddhilabs.com'
  PHONE: '',                       // e.g. '+977-1-XXXXXXX'
  PHONE_DISPLAY: '',               // e.g. '+977-1-XXX XXXX'
  WHATSAPP: '',                    // e.g. '9779800000000' (digits only, optional)
  ADDRESS: '',                     // e.g. 'Street, Ward, Kathmandu 44600, Nepal'
  BUSINESS_HOURS: '',              // e.g. 'Sunday – Friday, 9:00 – 18:00 NPT'
  GOOGLE_MAPS_EMBED_URL: '',       // Google Maps "Embed a map" iframe src

  /* ---- Social profiles (icons are hidden until a URL is set) ---- */
  SOCIAL: {
    linkedin: '',
    facebook: '',
    x: '',
    youtube: ''
  },

  /* ---- Analytics (scripts are only injected when an ID is present) ---- */
  GA4_MEASUREMENT_ID: '',          // e.g. 'G-XXXXXXXXXX'
  GTM_CONTAINER_ID: '',            // e.g. 'GTM-XXXXXXX'
  CLARITY_PROJECT_ID: '',          // Microsoft Clarity (optional)
  META_PIXEL_ID: ''                // Meta Pixel (optional)
};
