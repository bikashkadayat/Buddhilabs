/* =====================================================================
   Buddhi Labs – Global site behaviour
   - Mobile menu toggle (hamburger)
   - Active navigation highlighting
   - Header shadow on scroll
   - Smooth scroll for in-page anchors (with reduced-motion respect)
   - Scroll-reveal animations (progressive enhancement, staggered)
   - Reading progress line, back-to-top button
   - Rotating hero phrase, product showcase tabs, count-up stats
   - Card spotlight and screenshot tilt (fine pointers only)
   - HRMS subscription length picker, screenshot lightbox
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

  /* ---------- Scroll reveal: stagger siblings so grids cascade in ---------- */
  document.querySelectorAll('.reveal').forEach(function (el) {
    var parent = el.parentElement; if (!parent) return;
    var siblings = Array.prototype.filter.call(parent.children, function (c) { return c.classList.contains('reveal'); });
    if (siblings.length < 2) return;
    el.style.transitionDelay = (Math.min(siblings.indexOf(el), 5) * 80) + 'ms';
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

  /* =====================================================================
     Interactive enhancements. Every block is optional: it only runs when the
     matching markup exists, and animation is skipped under reduced motion.
     ===================================================================== */
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Reading progress line + back-to-top button ---------- */
  var progress = null;
  if (header) { progress = document.createElement('span'); progress.className = 'scroll-progress'; progress.setAttribute('aria-hidden', 'true'); header.appendChild(progress); }
  var toTop = document.createElement('button');
  toTop.type = 'button'; toTop.className = 'to-top'; toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>';
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });
  document.body.appendChild(toTop);
  var ticking = false;
  function onScrollEnhance() {
    ticking = false;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScrollEnhance); } }, { passive: true });
  onScrollEnhance();

  /* ---------- Rotating hero phrase ---------- */
  document.querySelectorAll('[data-rotate-words]').forEach(function (wrap) {
    var words = Array.prototype.slice.call(wrap.children);
    if (words.length < 2 || reduceMotion) return;
    var i = 0, timer;
    function next() {
      var cur = words[i]; i = (i + 1) % words.length; var nxt = words[i];
      cur.classList.add('is-leaving');
      setTimeout(function () { cur.setAttribute('aria-hidden', 'true'); cur.classList.remove('is-leaving'); }, 450);
      nxt.removeAttribute('aria-hidden');
    }
    function start() { stop(); timer = setInterval(next, 3000); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    start();
  });

  /* ---------- Product showcase: tabs + autoplay + keyboard ---------- */
  document.querySelectorAll('[data-showcase]').forEach(function (box) {
    var tabs = Array.prototype.slice.call(box.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(box.querySelectorAll('[data-showcase-panel]'));
    if (!tabs.length || tabs.length !== panels.length) return;
    var idx = 0, timer, paused = false, delay = parseInt(box.getAttribute('data-showcase-interval') || '5000', 10);
    function show(n, focus) {
      idx = (n + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        var on = k === idx;
        t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panels.forEach(function (p, k) { p.classList.toggle('is-active', k === idx); if (k === idx && p.getAttribute('loading') === 'lazy') p.loading = 'eager'; });
    }
    function play() { if (reduceMotion || paused) return; stop(); timer = setInterval(function () { show(idx + 1); }, delay); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { show(k); paused = true; stop(); window.buddhiTrack('showcase_tab_click', { tab: t.getAttribute('data-tab') || k }); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); show(idx + 1, true); paused = true; stop(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); show(idx - 1, true); paused = true; stop(); }
        if (e.key === 'Home') { e.preventDefault(); show(0, true); }
        if (e.key === 'End') { e.preventDefault(); show(tabs.length - 1, true); }
      });
    });
    box.addEventListener('mouseenter', stop); box.addEventListener('mouseleave', play);
    box.addEventListener('focusin', stop); box.addEventListener('focusout', play);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
    show(0); play();
  });

  /* ---------- Count-up statistics ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function fmt(n) { return n.toLocaleString('en-US'); }
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0, suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(Math.round(target * eased)) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else { counters.forEach(runCounter); }
  }

  /* ---------- Pointer spotlight on cards + 3D tilt on framed screenshots ---------- */
  if (finePointer && !reduceMotion) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.card-hover');
      if (card) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      }
    }, { passive: true });
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 4;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(1200px) rotateX(' + (-y * max).toFixed(2) + 'deg) rotateY(' + (x * max).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Subscription length picker (HRMS plan card) ---------- */
  document.querySelectorAll('[data-plan-picker]').forEach(function (box) {
    var buttons = Array.prototype.slice.call(box.querySelectorAll('[role="radio"]'));
    var priceEl = box.querySelector('[data-plan-price]'), periodEl = box.querySelector('[data-plan-period]');
    var noteEl = box.querySelector('[data-plan-note]'), cta = box.querySelector('[data-plan-cta]');
    var monthly = parseInt(box.getAttribute('data-monthly-price') || '999', 10);
    if (!buttons.length || !priceEl) return;
    function select(btn, announce) {
      var price = parseInt(btn.getAttribute('data-price'), 10), months = parseInt(btn.getAttribute('data-months'), 10);
      var label = btn.getAttribute('data-label'), plan = btn.getAttribute('data-plan');
      buttons.forEach(function (b) { var on = b === btn; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
      priceEl.classList.add('is-updating');
      setTimeout(function () {
        priceEl.textContent = fmt(price); priceEl.classList.remove('is-updating');
        if (periodEl) periodEl.textContent = months === 1 ? 'per month' : 'for ' + months + ' months';
        if (noteEl) {
          var save = monthly * months - price;
          noteEl.textContent = months === 1 ? 'Pay month by month. Cancel any time at the end of a period.'
            : 'About NPR ' + fmt(Math.round(price / months)) + ' per month · save NPR ' + fmt(save) + ' compared with paying monthly';
        }
        if (cta) { cta.textContent = 'Choose ' + label; cta.href = 'contact.html?interest=hrms-subscription&plan=' + encodeURIComponent(plan); cta.setAttribute('data-plan', plan); }
      }, reduceMotion ? 0 : 160);
      if (announce) window.buddhiTrack('hrms_plan_select', { plan: plan });
    }
    buttons.forEach(function (b, k) {
      b.addEventListener('click', function () { select(b, true); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (k + 1) % buttons.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (k - 1 + buttons.length) % buttons.length;
        if (n !== null) { e.preventDefault(); buttons[n].focus(); select(buttons[n], true); }
      });
    });
    select(buttons.filter(function (b) { return b.getAttribute('aria-checked') === 'true'; })[0] || buttons[0], false);
  });

  /* ---------- Screenshot lightbox (figures marked data-lightbox) ---------- */
  var figures = Array.prototype.slice.call(document.querySelectorAll('figure[data-lightbox]'));
  if (figures.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Screenshot viewer');
    lb.innerHTML =
      '<span class="lightbox-count" aria-live="polite"></span>' +
      '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>' +
      '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous screenshot"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg></button>' +
      '<img alt="">' +
      '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next screenshot"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg></button>' +
      '<p class="lightbox-caption"></p>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lightbox-caption'), lbCount = lb.querySelector('.lightbox-count');
    var lbIndex = 0, lastTrigger = null;
    function lbShow(n) {
      lbIndex = (n + figures.length) % figures.length;
      var fig = figures[lbIndex], img = fig.querySelector('img'), cap = fig.querySelector('figcaption');
      lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
      lbCap.innerHTML = cap ? cap.innerHTML.replace(/<h3[^>]*>/, '<strong>').replace('</h3>', '</strong>') : '';
      lbCount.textContent = (lbIndex + 1) + ' / ' + figures.length;
    }
    function lbOpen(n, trigger) {
      lastTrigger = trigger || null; lbShow(n); lb.hidden = false; document.body.classList.add('lightbox-open');
      requestAnimationFrame(function () { lb.classList.add('is-open'); lb.querySelector('.lightbox-close').focus(); });
      window.buddhiTrack('screenshot_open', { index: lbIndex });
    }
    function lbClose() {
      lb.classList.remove('is-open'); document.body.classList.remove('lightbox-open');
      setTimeout(function () { lb.hidden = true; if (lastTrigger) lastTrigger.focus(); }, reduceMotion ? 0 : 250);
    }
    figures.forEach(function (fig, k) {
      var img = fig.querySelector('img'); if (!img) return;
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'lightbox-trigger';
      btn.setAttribute('aria-label', 'Enlarge screenshot: ' + ((fig.querySelector('figcaption h3') || {}).textContent || img.alt));
      img.parentNode.insertBefore(btn, img); btn.appendChild(img);
      btn.addEventListener('click', function () { lbOpen(k, btn); });
    });
    lb.querySelector('.lightbox-close').addEventListener('click', lbClose);
    lb.querySelector('.lightbox-prev').addEventListener('click', function () { lbShow(lbIndex - 1); });
    lb.querySelector('.lightbox-next').addEventListener('click', function () { lbShow(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
      if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
      if (e.key === 'Tab') { // keep focus inside the dialog
        var f = lb.querySelectorAll('button'); var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    var touchX = null;
    lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (touchX === null) return; var dx = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
