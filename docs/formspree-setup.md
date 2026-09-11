# Formspree setup (contact form)

Formspree is the selected contact-form provider for the GitHub Pages deployment. **Status (Phase 4B): endpoint still not supplied** – the value received was the placeholder `[PASTE_FORMSPREE_ENDPOINT]`, which the site deliberately refuses,
so the form is in safe demonstration mode: it validates locally, sends nothing, never shows a false success, and shows
"Online form submission is being configured. You can contact Buddhi Labs directly at salesbuddhilabs@gmail.com or call
+977 9705811712."

## Activate in 10 steps
1. Go to https://formspree.io and sign in (or create an account) with the owner email (kadayatxbikash2008@gmail.com).
2. Create a new form (New Form → name it "Buddhi Labs website").
3. Configure the verified destination email. Formspree sends a verification link to that address.
4. Prefer **salesbuddhilabs@gmail.com** as the business lead recipient (add kadayatxbikash2008@gmail.com as an extra
   recipient in the form settings if desired).
5. Copy the endpoint shown in the Integration tab, in the format `https://formspree.io/f/FORM_ID`.
6. Paste only the public endpoint into `assets/js/business-config.js`:
   ```js
   form: {
     provider: "formspree",
     endpoint: "https://formspree.io/f/FORM_ID",
   ```
7. Set `endpoint` exactly as above (the site accepts only `https://formspree.io/f/<id>` with a 6+ character id; anything
   else, including bracketed placeholders, keeps demo mode). Run `npm run build:js` if you edit the JS; commit and push –
   GitHub Pages redeploys automatically. `recipientEmail` stays `salesbuddhilabs@gmail.com`; add the backup recipient
   (kadayatxbikash2008@gmail.com) in the Formspree dashboard, not in the website code.
8. Test a real website submission from https://buddhilabs.bikashkadayat.com.np/contact.html?interest=hrms-demo and check
   that the page shows the green success message (it appears only after Formspree returns HTTP 200).
9. Check spam protection in Formspree (Settings → Spam): keep Formspree's built-in filtering on; optionally enable
   reCAPTCHA there. The site also sends a honeypot field (`website`) that Formspree ignores unless you add a spam rule.
10. Confirm receipt of the email in the recipient inbox. Do **not** add the Formspree account password, API keys or
    private credentials anywhere in the website files.

## Fields sent
`full_name`, `organization`, `email`, `phone`, `interest` (slug), `interest_label`, `budget_range`, `message`,
`consent`, `source_page`, `submitted_at`, plus `_subject` (email subject line). Nothing else is sent.

## Live test
Follow docs/formspree-live-test.md after deployment.

## Behaviour once active
- Loading state (button disabled, "Sending…"), success message "Thank you for contacting Buddhi Labs. Your inquiry has been received, and our team will get back to you as soon as possible." only on a 2xx response, error message "We could not submit your inquiry at this time. Please try again or contact us directly at salesbuddhilabs@gmail.com." on network/provider failure,
  duplicate submissions blocked while a request is in flight, honeypot retained, all interest preselections unchanged
  (`hrms-demo`, `ev-risk-demo`, `software-development`, `it-support`, `seo-services`, `it-training`, `general-inquiry`).
- Formspree's free plan has a monthly submission limit; monitor usage in the dashboard.
- Keep `docs/analytics-setup.md` rules: form events never include the visitor's name, email, phone or message.
