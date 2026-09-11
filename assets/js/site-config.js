/* =====================================================================
   Buddhi Labs – runtime adapter (do not edit values here)
   ---------------------------------------------------------------------
   All public business values live in assets/js/business-config.js.
   This file maps that nested structure to the flat window.BUDDHI_CONFIG
   object consumed by main.js and contact-form.js, and applies safe
   defaults so every page works even if business-config.js is empty.
   ===================================================================== */
(function () {
  var b = window.BUDDHI_LABS_CONFIG || {};
  var co = b.company || {}, ct = b.contact || {}, so = b.social || {}, fo = b.form || {}, an = b.analytics || {};
  var providerMap = { demo: 'none', none: 'none', formspree: 'formspree', netlify: 'netlify', 'custom-api': 'custom', custom: 'custom' };
  var digits = function (v) { return String(v || '').replace(/[^\d]/g, ''); };
  window.BUDDHI_CONFIG = {
    SITE_URL: co.canonicalUrl || co.domain || '',
    COMPANY_NAME: co.displayName || 'Buddhi Labs',
    LEGAL_NAME: co.legalName || '',
    REGISTRATION_NUMBER: co.registrationNumber || '',
    CITY: co.city || '', COUNTRY: co.country || '',
    FORM_PROVIDER: providerMap[String(fo.provider || 'demo').toLowerCase()] || 'none',
    CONTACT_FORM_ENDPOINT: fo.endpoint || '',
    RECAPTCHA_SITE_KEY: fo.recaptchaSiteKey || '',
    TURNSTILE_SITE_KEY: fo.turnstileSiteKey || '',
    SALES_EMAIL: ct.salesEmail || '',
    SUPPORT_EMAIL: ct.supportEmail || '',
    PRIVACY_EMAIL: ct.privacyEmail || '',
    PHONE: ct.phone || '',
    PHONE_DISPLAY: ct.phoneDisplay || ct.phone || '',
    WHATSAPP: digits(ct.whatsapp),
    ADDRESS: ct.address || co.address || '',
    BUSINESS_HOURS: co.businessHours || '',
    GOOGLE_MAPS_EMBED_URL: ct.mapsUrl || '',
    SOCIAL: { linkedin: so.linkedin || '', facebook: so.facebook || '', instagram: so.instagram || '', youtube: so.youtube || '', x: so.x || '' },
    GA4_MEASUREMENT_ID: an.ga4MeasurementId || '',
    GTM_CONTAINER_ID: an.gtmContainerId || '',
    CLARITY_PROJECT_ID: an.clarityProjectId || '',
    META_PIXEL_ID: an.metaPixelId || '',
    SEARCH_CONSOLE_VERIFICATION: an.searchConsoleVerification || '',
    PRODUCTS: b.products || {}
  };
})();
