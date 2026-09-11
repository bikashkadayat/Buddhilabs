# Formspree live test plan

Run this **after** the real endpoint is in `assets/js/business-config.js` and the site is deployed. Do not run it before
confirming with the business owner that a test inquiry may be sent to salesbuddhilabs@gmail.com.

## Pre-deployment checks (automated, already passing – see docs/final-production-qa-report.md)
- Endpoint validation: only `https://formspree.io/f/<form-id>` (6+ alphanumeric characters) activates the form; blank or
  placeholder values such as `[PASTE_FORMSPREE_ENDPOINT]` keep demo mode.
- Payload field names: `full_name`, `organization`, `email`, `phone`, `interest`, `interest_label`, `budget_range`,
  `message`, `consent`, `source_page`, `submitted_at`, `_subject` (no other data).
- Loading state, duplicate-submit guard, honeypot, success only after HTTP 2xx, error handler on failure – all verified
  with a mocked Formspree response.

## Manual post-deployment test
1. Open `https://buddhilabs.bikashkadayat.com.np/contact.html`.
2. Confirm the "Online form submission is being configured" notice is **gone** (endpoint active).
3. Submit a test inquiry with safe, non-sensitive values: name "Website Test", organization "Buddhi Labs QA",
   email you control, interest "General Business Inquiry", message "Test submission from the live website – please ignore."
4. Confirm the green message "Thank you for contacting Buddhi Labs. Your inquiry has been received, and our team will get
   back to you as soon as possible." appears only after the request completes.
5. Confirm the email reaches **salesbuddhilabs@gmail.com** (and the backup recipient if configured in Formspree).
6. Confirm it is not in spam; if it is, mark "Not spam" and add the Formspree sender to contacts.
7. Confirm the email includes the selected interest, budget range and `source_page` URL.
8. Open `contact.html?interest=hrms-demo` and `contact.html?interest=ev-risk-demo`: the interest field must be
   preselected (HRMS Demo / EV Risk Intelligence Demo) and the "You are enquiring about" line shown.
9. Submit once with an invalid email to confirm the inline error, then once with the network disconnected (browser
   DevTools → offline) to confirm the red error message with salesbuddhilabs@gmail.com appears and no success is shown.
10. Delete the test submission from the Formspree dashboard if desired and record the test date in docs/go-live-checklist.md.

## If the test fails
- HTTP 4xx from Formspree: the form ID is wrong or the recipient email is not verified – check the Formspree dashboard.
- No email: check Formspree "Submissions" (the entry exists → email delivery/spam issue; missing → endpoint mismatch).
- Success message never appears: open the browser console; a CORS or network error means the endpoint is not a
  Formspree URL or Formspree is blocking the domain (add the site domain in Formspree → Settings → Restrict to Domain).
