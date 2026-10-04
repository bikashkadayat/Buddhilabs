/* =====================================================================
   Buddhi Labs – Contact form
   ---------------------------------------------------------------------
   - Client-side validation with accessible inline errors
   - Pre-selects the "I am interested in" option from ?interest=<slug>
   - Loading, success and error states
   - Honeypot + optional reCAPTCHA v3 spam protection
   - Provider-based submission driven by assets/js/site-config.js:
       FORM_PROVIDER = 'none'      → demonstration mode (no submission)
                       'custom'    → POST JSON to CONTACT_FORM_ENDPOINT
                       'formspree' → POST JSON to CONTACT_FORM_ENDPOINT
                       'netlify'   → POST form-encoded to '/' (Netlify Forms)
   - Never shows a success state unless the provider confirms 2xx.
   - Emits analytics events (no personal data, only the interest slug):
     contact_form_start, contact_form_validation_error, contact_form_submit,
     contact_form_success, contact_form_error, hrms_demo_form_open,
     ev_risk_demo_form_open (see main.js → buddhiTrack, consent-gated).
   See docs/contact-form-integration.md.
   ===================================================================== */
(function () {
  'use strict';

  var cfg = window.BUDDHI_CONFIG || {};
  var provider = (cfg.FORM_PROVIDER || 'none').toLowerCase();
  var endpoint = cfg.CONTACT_FORM_ENDPOINT || '';
  var track = window.buddhiTrack || function () {};

  var form = document.getElementById('contact-form');
  if (!form) return;

  var successBox = document.getElementById('form-success');
  var errorBox = document.getElementById('form-error');
  var demoBox = document.getElementById('form-demo-mode');
  var submitBtn = form.querySelector('[type="submit"]');
  var submitLabel = submitBtn ? submitBtn.innerHTML : '';

  // Provider is active only with a valid endpoint (Formspree endpoints must look like https://formspree.io/f/<id>)
  // Formspree: provider must be exactly "formspree" and the endpoint exactly https://formspree.io/f/<form-id>
  // (a bracketed placeholder such as [PASTE_FORMSPREE_ENDPOINT] never validates).
  var validEndpoint = provider === 'formspree' ? /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{6,}$/.test(endpoint.trim())
                    : provider === 'custom' ? /^(https:\/\/[^\s]+|\/[^\s]*)$/.test(endpoint.trim()) : false;
  var configured = provider === 'netlify' ? true : validEndpoint;

  /* ---------- Demonstration mode notice ---------- */
  if (!configured && demoBox) {
    // Build the notice with DOM APIs only (no innerHTML with config values)
    var text = demoBox.querySelector('[data-demo-text]');
    if (text) {
      while (text.firstChild) text.removeChild(text.firstChild);
      function link(href, label) { var a = document.createElement('a'); a.href = href; a.textContent = label; a.className = 'font-semibold underline underline-offset-2'; return a; }
      if (cfg.SALES_EMAIL || cfg.PHONE) {
        text.appendChild(document.createTextNode('Online form submission is being configured. You can contact Buddhi Labs directly'));
        if (cfg.SALES_EMAIL) { text.appendChild(document.createTextNode(' at ')); text.appendChild(link('mailto:' + cfg.SALES_EMAIL, cfg.SALES_EMAIL)); }
        if (cfg.PHONE) { text.appendChild(document.createTextNode(cfg.SALES_EMAIL ? ' or call ' : ' by calling ')); text.appendChild(link('tel:' + cfg.PHONE.replace(/[^+\d]/g, ''), cfg.PHONE_DISPLAY)); }
        text.appendChild(document.createTextNode('.'));
      } else {
        text.appendChild(document.createTextNode('The form is currently in demonstration mode. Please contact us directly at [TO BE CONFIRMED: Official Email].'));
      }
    }
    demoBox.classList.add('is-visible');
  } else if (demoBox) {
    demoBox.classList.remove('is-visible');   // valid provider + endpoint: the configuration notice must not show
  }

  /* ---------- Netlify Forms attributes ---------- */
  if (provider === 'netlify') {
    form.setAttribute('data-netlify', 'true');
    form.setAttribute('name', form.getAttribute('name') || 'contact');
    if (!form.querySelector('[name="form-name"]')) {
      var fn = document.createElement('input');
      fn.type = 'hidden'; fn.name = 'form-name'; fn.value = form.getAttribute('name');
      form.appendChild(fn);
    }
  }

  /* ---------- Pre-select interest from URL ---------- */
  var params = new URLSearchParams(window.location.search);
  var interest = (params.get('interest') || '').toLowerCase();
  var subjectSelect = form.querySelector('#subject');
  // Slugs used by CTA links across the site → <option value="...">
  var interestAlias = {
    'hrms-demo': 'hrms-demo', 'hrms': 'hrms-demo',
    'hrms-subscription': 'hrms-subscription', 'hrms-plan': 'hrms-subscription', 'subscription': 'hrms-subscription',
    'ev-risk-demo': 'ev-risk-demo', 'ev': 'ev-risk-demo', 'ev-risk': 'ev-risk-demo',
    'demo': 'product-demo',
    'software-development': 'software-development', 'software': 'software-development',
    'it-support': 'it-support', 'support': 'it-support',
    'seo-services': 'seo-services', 'seo': 'seo-services',
    'it-training': 'it-training', 'training': 'it-training',
    'general': 'general', 'general-inquiry': 'general', 'careers': 'careers', 'partnership': 'partnership'
  };
  if (interest && subjectSelect && interestAlias[interest]) {
    subjectSelect.value = interestAlias[interest];
    if (interestAlias[interest] === 'hrms-demo') track('hrms_demo_form_open');
    if (interestAlias[interest] === 'ev-risk-demo') track('ev_risk_demo_form_open');
    var plan = (params.get('plan') || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (interestAlias[interest] === 'hrms-subscription') track('hrms_subscription_form_open', plan ? { plan: plan } : undefined);
    var ctx = document.getElementById('form-context');
    if (ctx) {
      var label = subjectSelect.options[subjectSelect.selectedIndex].text;
      ctx.textContent = 'You are enquiring about: ' + label + (plan ? ' (' + plan + ' plan)' : '') + '. You can change this below.';
      ctx.hidden = false;
    }
  }

  /* ---------- Validation ---------- */
  var validators = {
    name: function (v) {
      if (!v.trim()) return 'Please enter your full name.';
      if (v.trim().length < 2) return 'Name looks too short.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Please enter a valid email address.';
      return '';
    },
    phone: function (v) {
      if (!v.trim()) return '';
      if (!/^[+\d][\d\s\-()]{6,19}$/.test(v.trim())) return 'Please enter a valid phone number (digits, +, spaces).';
      return '';
    },
    company: function () { return ''; },
    budget: function () { return ''; }, // optional
    subject: function (v) { return v ? '' : 'Please tell us what you are interested in.'; },
    message: function (v) {
      if (!v.trim()) return 'Please write a short message.';
      if (v.trim().length < 20) return 'Please add a little more detail (at least 20 characters).';
      return '';
    },
    consent: function (v, el) { return el.checked ? '' : 'Please agree to the privacy policy so we can respond.'; }
  };

  function fieldWrapper(el) { return el.closest('.form-field'); }
  function showError(el, message) {
    var wrap = fieldWrapper(el); if (!wrap) return;
    var err = wrap.querySelector('.form-error');
    if (message) {
      wrap.classList.add('has-error'); el.setAttribute('aria-invalid', 'true');
      if (err) err.textContent = message;
    } else {
      wrap.classList.remove('has-error'); el.removeAttribute('aria-invalid');
      if (err) err.textContent = '';
    }
  }
  function validateField(el) {
    var fn = validators[el.name]; if (!fn) return true;
    var msg = fn(el.value, el); showError(el, msg); return !msg;
  }

  var started = false;
  form.querySelectorAll('input, select, textarea').forEach(function (el) {
    el.addEventListener('focus', function () { if (!started) { started = true; track('contact_form_start'); } });
    el.addEventListener('blur', function () { validateField(el); });
    el.addEventListener('input', function () { if (fieldWrapper(el) && fieldWrapper(el).classList.contains('has-error')) validateField(el); });
    el.addEventListener('change', function () { validateField(el); });
  });

  function setAlert(box, visible, text) {
    if (!box) return;
    box.classList.toggle('is-visible', visible);
    if (text) { var t = box.querySelector('[data-alert-text]'); if (t) t.textContent = text; }
    if (visible) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.setAttribute('aria-busy', String(on));
    submitBtn.innerHTML = on ? 'Sending…' : submitLabel;
  }

  /* ---------- reCAPTCHA v3 (optional) ---------- */
  function getRecaptchaToken() {
    var key = cfg.RECAPTCHA_SITE_KEY;
    if (!key) return Promise.resolve('');
    return new Promise(function (resolve) {
      function exec() {
        window.grecaptcha.ready(function () {
          window.grecaptcha.execute(key, { action: 'contact' }).then(resolve, function () { resolve(''); });
        });
      }
      if (window.grecaptcha) return exec();
      var s = document.createElement('script');
      s.src = 'https://www.google.com/recaptcha/api.js?render=' + encodeURIComponent(key);
      s.onload = exec; s.onerror = function () { resolve(''); };
      document.head.appendChild(s);
    });
  }

  /* ---------- Submission ---------- */
  function send(payload) {
    if (provider === 'netlify') {
      var body = new URLSearchParams();
      Object.keys(payload).forEach(function (k) { body.append(k, payload[k]); });
      body.append('form-name', form.getAttribute('name') || 'contact');
      return fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
    }
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  var inFlight = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (inFlight) return;                       // never send duplicate requests
    setAlert(successBox, false);
    setAlert(errorBox, false);

    // Honeypot: bots fill hidden fields, humans do not
    var honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value) return;

    var valid = true, firstInvalid = null;
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (el.name === 'website' || el.name === 'form-name') return;
      if (!validateField(el)) { valid = false; if (!firstInvalid) firstInvalid = el; }
    });
    if (!valid) { firstInvalid.focus(); track('contact_form_validation_error'); return; }

    if (!configured) {
      // Demonstration mode: never pretend the message was sent.
      if (demoBox) { demoBox.classList.add('is-visible'); demoBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      track('contact_form_submit', { form_mode: 'demo' });
      return;
    }

    var payload = {
      full_name: form.name.value.trim(),
      organization: form.company.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      interest: form.subject.value,
      interest_label: form.subject.options[form.subject.selectedIndex].text,
      budget_range: form.budget ? form.budget.value : '',
      message: form.message.value.trim(),
      consent: 'yes',
      source_page: window.location.href,
      submitted_at: new Date().toISOString(),
      _subject: 'Buddhi Labs website enquiry: ' + form.subject.options[form.subject.selectedIndex].text   // used by Formspree as the email subject
    };
    track('contact_form_submit', { interest: payload.interest, form_mode: provider });
    inFlight = true;
    setLoading(true);

    getRecaptchaToken().then(function (token) {
      if (token) payload['g-recaptcha-response'] = token;
      return send(payload);
    }).then(function (res) {
      if (!res || !res.ok) throw new Error('Request failed with status ' + (res && res.status));
      form.reset();
      form.querySelectorAll('.has-error').forEach(function (w) { w.classList.remove('has-error'); });
      setAlert(successBox, true);
      track('contact_form_success', { interest: payload.interest });
    }).catch(function (err) {
      if (window.console) console.error('[Buddhi Labs] Contact form submission failed:', err && err.message);
      setAlert(errorBox, true, cfg.SALES_EMAIL ? 'We could not submit your inquiry at this time. Please try again or contact us directly at ' + cfg.SALES_EMAIL + '.' : 'We could not submit your inquiry at this time. Please try again or contact us using the details on this page.');
      track('contact_form_error');
    }).finally(function () { inFlight = false; setLoading(false); });
  });
})();
