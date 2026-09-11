/* =====================================================================
   Buddhi Labs – Global site behaviour
   - Mobile menu toggle (hamburger)
   - Active navigation highlighting
   - Header shadow on scroll
   - Smooth scroll for in-page anchors (with reduced-motion respect)
   - Scroll-reveal animations (progressive enhancement)
   - Current year in footer
   No dependencies.
   ===================================================================== */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var cfg = window.BUDDHI_CONFIG || {};

  /* ---------- Cookie consent + consent-gated analytics ----------
     Trackers load only when (a) an ID is configured in site-config.js AND (b) the visitor accepted analytics
     cookies. The banner is only shown when at least one tracker ID is configured, because without trackers
     the site sets no non-essential cookies. Consent is stored in localStorage (no server, no cookie). */
  var CONSENT_KEY = 'buddhi_consent_v1';
  var trackersConfigured = !!(cfg.GA4_MEASUREMENT_ID || cfg.GTM_CONTAINER_ID || cfg.CLARITY_PROJECT_ID || cfg.META_PIXEL_ID);
  function readConsent() { try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); } catch (e) { return null; } }
  function writeConsent(analytics) { try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: !!analytics, ts: new Date().toISOString() })); } catch (e) { /* storage unavailable: treat as no consent */ } }
  window.buddhiConsent = { get: readConsent, hasAnalytics: function () { var c = readConsent(); return !!(c && c.analytics); } };

  function loadScript(src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); return s; }
  window.dataLayer = window.dataLayer || [];
  var analyticsLoaded = false;
  function loadAnalytics() {
    if (analyticsLoaded || !trackersConfigured || !window.buddhiConsent.hasAnalytics()) return;
    analyticsLoaded = true;
    if (cfg.GTM_CONTAINER_ID) {
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      loadScript('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(cfg.GTM_CONTAINER_ID));
    }
    if (cfg.GA4_MEASUREMENT_ID) {
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.GA4_MEASUREMENT_ID));
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', cfg.GA4_MEASUREMENT_ID, { anonymize_ip: true });
    }
    if (cfg.CLARITY_PROJECT_ID) {
      (function (c, l, a, r, i) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        var t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; l.head.appendChild(t); })(window, document, 'clarity', 'script', cfg.CLARITY_PROJECT_ID);
    }
    if (cfg.META_PIXEL_ID) {
      (function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', cfg.META_PIXEL_ID); window.fbq('track', 'PageView');
    }
    // flush events queued before consent
    (window.__buddhiQueue || []).forEach(function (q) { window.buddhiTrack(q[0], q[1]); }); window.__buddhiQueue = [];
  }

  function renderConsentBanner(force) {
    if (!trackersConfigured) return;
    if (!force && readConsent()) return;
    if (document.getElementById('consent-banner')) return;
    var el = document.createElement('section');
    el.id = 'consent-banner'; el.className = 'consent-banner';
    el.setAttribute('role', 'region'); el.setAttribute('aria-labelledby', 'consent-title');
    el.innerHTML =
      '<h2 id="consent-title" class="font-heading font-semibold text-base">Cookies on this website</h2>' +
      '<p class="mt-2 text-sm text-primary-100">We use essential cookies to make the site work. With your permission we also use analytics cookies to understand how the site is used. See our <a href="privacy.html#cookies">Privacy Policy</a>.</p>' +
      '<div class="consent-prefs" id="consent-prefs">' +
        '<label class="consent-toggle"><input type="checkbox" id="consent-analytics"><span><strong>Analytics cookies</strong><br><span class="text-primary-100">Help us measure visits and improve the site. Off by default.</span></span></label>' +
        '<p class="consent-toggle mt-3"><input type="checkbox" checked disabled aria-label="Essential cookies, always on"><span><strong>Essential</strong><br><span class="text-primary-100">Required for the site to function. Always on.</span></span></p>' +
      '</div>' +
      '<div class="mt-4 flex flex-wrap gap-2">' +
        '<button type="button" class="btn btn-accent btn-sm" data-consent="accept">Accept analytics cookies</button>' +
        '<button type="button" class="btn btn-ghost-light btn-sm" data-consent="reject">Reject non-essential</button>' +
        '<button type="button" class="btn btn-ghost-light btn-sm" data-consent="manage" aria-expanded="false" aria-controls="consent-prefs">Manage preferences</button>' +
        '<button type="button" class="btn btn-ghost-light btn-sm hidden" data-consent="save">Save preferences</button>' +
      '</div>';
    document.body.appendChild(el);
    var prefs = el.querySelector('#consent-prefs'), cb = el.querySelector('#consent-analytics');
    var current = readConsent(); if (current) cb.checked = !!current.analytics;
    function close() { el.remove(); }
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]'); if (!b) return;
      var a = b.getAttribute('data-consent');
      if (a === 'accept') { writeConsent(true); close(); loadAnalytics(); }
      if (a === 'reject') { writeConsent(false); close(); }
      if (a === 'save') { writeConsent(cb.checked); close(); if (cb.checked) loadAnalytics(); }
      if (a === 'manage') { var open = prefs.classList.toggle('is-open'); b.setAttribute('aria-expanded', String(open)); el.querySelector('[data-consent=save]').classList.toggle('hidden', !open); }
    });
    el.addEventListener('keydown', function (e) { if (e.key === 'Escape') { writeConsent(false); close(); } });
    el.querySelector('[data-consent=accept]').focus({ preventScroll: true });
  }
  window.buddhiOpenConsent = function () { renderConsentBanner(true); };
  document.querySelectorAll('[data-open-consent]').forEach(function (a) {
    if (!trackersConfigured) { a.hidden = true; return; }
    a.addEventListener('click', function (e) { e.preventDefault(); renderConsentBanner(true); });
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { renderConsentBanner(false); loadAnalytics(); });
  else { renderConsentBanner(false); loadAnalytics(); }

  /* ---------- Event tracking helper (used by data-track attributes and the contact form) ---------- */
  /* Only non-identifying parameters may be passed here (event names, interest slugs, link labels/URLs).
     Never pass names, emails, phone numbers or message content. */
  window.__buddhiQueue = window.__buddhiQueue || [];
  window.buddhiTrack = function (eventName, params) {
    var data = Object.assign({ event: eventName, page_path: window.location.pathname }, params || {});
    try {
      window.dataLayer.push(data);                       // always available for debugging/GTM
      if (!trackersConfigured) return;
      if (!window.buddhiConsent.hasAnalytics()) return;   // no consent: nothing leaves the browser
      if (!analyticsLoaded) { window.__buddhiQueue.push([eventName, params]); return; }
      if (typeof window.gtag === 'function' && cfg.GA4_MEASUREMENT_ID) window.gtag('event', eventName, params || {});
    } catch (e) { /* analytics must never break the page */ }
  };
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button'); if (!el) return;
    var name = el.getAttribute('data-track');
    var href = el.getAttribute('href') || '';
    if (!name) {
      if (href.indexOf('tel:') === 0) name = 'phone_click';
      else if (href.indexOf('mailto:') === 0) name = 'email_click';
      else if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) name = 'whatsapp_click';
    }
    if (name) window.buddhiTrack(name, { link_text: (el.textContent || '').trim().slice(0, 80), link_url: href });
  });

  /* ---------- Business configuration helpers (values come from assets/js/business-config.js) ----------
     All DOM writes use textContent / setAttribute – never innerHTML – so config values are rendered as text. */
  function getBusinessConfig() { return window.BUDDHI_LABS_CONFIG || {}; }
  function isConfigured(value) { return typeof value === 'string' ? value.trim().length > 0 : !!value; }
  window.getBusinessConfig = getBusinessConfig; window.isConfigured = isConfigured;

  function setLink(el, href, text, opts) {
    opts = opts || {};
    var a = document.createElement('a');
    a.href = href; a.textContent = text;
    a.className = el.getAttribute('data-link-class') || 'hover:text-white transition-colors';
    if (opts.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    if (opts.label) a.setAttribute('aria-label', opts.label);
    while (el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(a);
  }
  function hideBlock(el) { var block = el.closest('[data-optional]') || el; block.hidden = true; }

  /* data-company="displayName|legalName|registrationNumber|address|businessHours|city|country" */
  function populateCompanyDetails() {
    var co = getBusinessConfig().company || {};
    document.querySelectorAll('[data-company]').forEach(function (el) {
      var v = co[el.getAttribute('data-company')];
      if (isConfigured(v)) el.textContent = v;            // otherwise keep the visible [TO BE CONFIRMED] placeholder
    });
  }

  /* data-contact="salesEmail|supportEmail|privacyEmail|phone|whatsapp|address|hours|mapsUrl" (legacy kebab-case accepted) */
  function populateContactLinks() {
    var alias = { 'sales-email': 'salesEmail', 'support-email': 'supportEmail', 'privacy-email': 'privacyEmail', 'phone': 'phone', 'whatsapp': 'whatsapp', 'address': 'address', 'hours': 'hours', 'maps': 'mapsUrl', 'mapsUrl': 'mapsUrl' };
    var entries = {
      salesEmail:   cfg.SALES_EMAIL   ? ['mailto:' + cfg.SALES_EMAIL, cfg.SALES_EMAIL, { label: 'Email Buddhi Labs sales at ' + cfg.SALES_EMAIL }] : null,
      supportEmail: cfg.SUPPORT_EMAIL ? ['mailto:' + cfg.SUPPORT_EMAIL, cfg.SUPPORT_EMAIL, { label: 'Email Buddhi Labs support at ' + cfg.SUPPORT_EMAIL }] : null,
      privacyEmail: (cfg.PRIVACY_EMAIL || cfg.SALES_EMAIL) ? ['mailto:' + (cfg.PRIVACY_EMAIL || cfg.SALES_EMAIL), (cfg.PRIVACY_EMAIL || cfg.SALES_EMAIL), {}] : null,
      phone:        cfg.PHONE ? ['tel:' + cfg.PHONE.replace(/[^+\d]/g, ''), cfg.PHONE_DISPLAY, { label: 'Call Buddhi Labs at ' + cfg.PHONE_DISPLAY }] : null,
      whatsapp:     cfg.WHATSAPP ? ['https://wa.me/' + cfg.WHATSAPP, 'Chat on WhatsApp', { external: true, label: 'Chat with Buddhi Labs on WhatsApp' }] : null,
      mapsUrl:      cfg.GOOGLE_MAPS_EMBED_URL ? [cfg.GOOGLE_MAPS_EMBED_URL, 'View on Google Maps', { external: true, label: 'Open the Buddhi Labs office location on Google Maps' }] : null,
      address:      cfg.ADDRESS ? [null, cfg.ADDRESS] : null,
      hours:        cfg.BUSINESS_HOURS ? [null, cfg.BUSINESS_HOURS] : null
    };
    document.querySelectorAll('[data-contact]').forEach(function (el) {
      var key = alias[el.getAttribute('data-contact')] || el.getAttribute('data-contact');
      var e = entries[key];
      if (!e) { if (el.hasAttribute('data-optional') || el.closest('[data-optional]')) hideBlock(el); return; }   // keep placeholder text for required items
      if (e[0]) setLink(el, e[0], e[1], e[2]); else el.textContent = e[1];
      var block = el.closest('[data-optional]'); if (block) block.hidden = false;
    });
  }

  /* data-social="linkedin|facebook|instagram|youtube|x" – icons stay hidden unless a URL exists; wrapper hidden if none */
  function populateSocialLinks() {
    var any = false;
    document.querySelectorAll('[data-social]').forEach(function (el) {
      var url = (cfg.SOCIAL || {})[el.getAttribute('data-social')];
      if (isConfigured(url) && /^https:\/\//.test(url)) { el.href = url; el.hidden = false; el.setAttribute('rel', 'noopener noreferrer'); el.setAttribute('target', '_blank'); any = true; }
      else { el.hidden = true; }
    });
    document.querySelectorAll('[data-social-wrap]').forEach(function (w) { w.hidden = !any; });
  }

  /* Map: only rendered when a real embed URL exists; the container stays hidden otherwise (no empty iframe). */
  function populateMapLink() {
    var slot = document.getElementById('map-embed'); if (!slot) return;
    var url = cfg.GOOGLE_MAPS_EMBED_URL;
    if (!isConfigured(url) || !/^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(url)) { slot.hidden = true; return; }
    var f = document.createElement('iframe');
    f.src = url; f.width = '100%'; f.height = '320'; f.loading = 'lazy'; f.title = 'Buddhi Labs office location';
    f.setAttribute('style', 'border:0'); f.setAttribute('allowfullscreen', ''); f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    while (slot.firstChild) slot.removeChild(slot.firstChild);
    slot.appendChild(f); slot.hidden = false;
  }

  /* Search Console verification: runtime insertion is a convenience only – paste the tag into the HTML head for
     reliable verification (docs/analytics-setup.md). */
  function populateAnalyticsMeta() {
    if (!isConfigured(cfg.SEARCH_CONSOLE_VERIFICATION)) return;
    if (document.querySelector('meta[name="google-site-verification"]')) return;
    var m = document.createElement('meta'); m.name = 'google-site-verification'; m.content = cfg.SEARCH_CONSOLE_VERIFICATION;
    document.head.appendChild(m);
  }

  populateCompanyDetails(); populateContactLinks(); populateSocialLinks(); populateMapLink(); populateAnalyticsMeta();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var iconOpen = document.getElementById('icon-menu-open');
  var iconClose = document.getElementById('icon-menu-close');

  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (iconOpen && iconClose) {
      iconOpen.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
    }
    document.body.classList.toggle('overflow-hidden', open && window.innerWidth < 1024);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(menu.classList.contains('hidden'));
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        setMenu(false);
        toggle.focus();
      }
    });
    // Close when a link inside is clicked
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    // Reset if the viewport grows to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) setMenu(false);
    });
  }

  /* ---------- Active nav link ---------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  var current = path.replace('.html', '') || 'index';
  if (current === '' ) current = 'index';
  if (current === 'blog-post-template') current = 'blog';
  var navAlias = { 'hrms': 'products', 'ev-risk-intelligence': 'products' };
  var navCurrent = navAlias[current] || current;
  document.querySelectorAll('[data-nav]').forEach(function (link) {
    if (link.getAttribute('data-nav') === current || link.getAttribute('data-nav') === navCurrent) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Smooth scroll for same-page anchors ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.pushState(null, '', id);
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
