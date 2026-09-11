# GitHub Pages deployment

The site is fully static: HTML, compiled CSS, minified JS and assets. GitHub Pages needs no Docker, backend, database,
Caddy or Node runtime. The backend and Docker files remain in the repository as optional future infrastructure and are
excluded from the Pages artifact by `scripts/build-site.mjs`.

| Item | Value |
|---|---|
| Hosting | GitHub Pages (GitHub Actions source) |
| Custom domain | `buddhilabs.bikashkadayat.com.np` (`CNAME` file at repo root, copied into the artifact) |
| Canonical URL | `https://buddhilabs.bikashkadayat.com.np` |
| Workflow | `.github/workflows/deploy-pages.yml` – `npm ci` → `npm run build` → `npm run build:site` → upload `_site` → deploy |
| 404 | `404.html` at the root is served automatically by GitHub Pages |
| Jekyll | disabled via `.nojekyll` (keeps `_site`-style paths and dotfiles intact) |

## Step-by-step
1. Push the project to a GitHub repository (default branch `main`; edit the branch name in the workflow if different).
   Compiled assets (`assets/css/site.min.css`, `assets/js/*.min.js`) are committed, and the workflow rebuilds them anyway.
2. Go to the repository **Settings**.
3. Open **Pages**.
4. Under "Build and deployment", set **Source: GitHub Actions**. The first push to `main` runs the workflow; check the
   **Actions** tab for the green "Deploy to GitHub Pages" run.
5. In Pages → **Custom domain**, enter `buddhilabs.bikashkadayat.com.np` and save (GitHub will also read the `CNAME` file).
6. Configure DNS at the DNS provider for `bikashkadayat.com.np`.
7. Because this is a subdomain, create a **CNAME record**:
   - Host/Name: `buddhilabs`
   - Target/Value: `[YOUR_GITHUB_USERNAME].github.io` (replace with the GitHub account or organization that owns the repo)
   - TTL: default (or 300 s during setup)
8. Wait for DNS propagation (minutes to a few hours). GitHub shows "DNS check successful" in Pages settings when ready.
9. Tick **Enforce HTTPS** once GitHub has validated the domain and issued the certificate (can take up to an hour after DNS).
10. Test `https://buddhilabs.bikashkadayat.com.np` and confirm the padlock, the logo, compiled styling and the contact page.
11. Test: `/does-not-exist` (404 page), `/sitemap.xml`, `/robots.txt`, the sales/support `mailto:` links, the `tel:` link,
    the WhatsApp link, and every "Request a Demo" / service CTA (each must preselect the right interest on the contact form).

## After go-live
- Submit `https://buddhilabs.bikashkadayat.com.np/sitemap.xml` in Google Search Console (verify the property first – see
  docs/analytics-setup.md; no verification token has been supplied yet).
- When the Formspree endpoint is available, update `assets/js/business-config.js` and push (docs/formspree-setup.md).
- Every push to `main` redeploys; keep `npm run build` results committed so the site also works on plain static hosts.

## Local preview of the exact artifact
```bash
npm ci && npm run build && npm run build:site
python3 -m http.server 8000 --directory _site      # http://localhost:8000
```

## Not configured yet (do not assume)
DNS CNAME record, GitHub Pages custom-domain validation and HTTPS enforcement must be done by the repository owner; the
GitHub username is not known to this project and is written as `[YOUR_GITHUB_USERNAME]` above.
