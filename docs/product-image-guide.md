# Product image guide

How to prepare and add screenshots for Buddhi Labs HRMS and the EV Risk Intelligence System. Until approved files
exist, the site shows a branded "Product preview coming soon" visual instead of any illustrative dashboard.

## Folder structure and file names

```
assets/images/products/
├── hrms/
│   ├── dashboard.webp            hero + products card
│   ├── employee-management.webp
│   ├── attendance.webp
│   ├── leave-management.webp
│   └── payroll.webp
└── ev-risk/
    ├── dashboard.webp            hero + products card
    ├── fleet-overview.webp
    ├── vehicle-risk-score.webp
    ├── alerts.webp
    └── reports.webp
```
Keep original, unedited captures **outside the repository** (or in a private folder) – only redacted, optimized
versions belong in `assets/`.

## Dimensions, formats, size
| Use | Size | Ratio | Format | Max size |
|---|---|---|---|---|
| Hero / card screenshot | 1440 × 900 (2×: 2880 × 1800 optional) | 16:10 | WebP (AVIF optional, with WebP fallback) | 200 KB (2×: 350 KB) |
| Gallery / feature screenshot | 1200 × 750 | 16:10 | WebP | 150 KB |
| Open Graph share image | 1200 × 630 | 1.91:1 | PNG or JPG | 300 KB |

Capture at 100 % browser zoom on a 1440-px-wide window with the browser UI cropped out. Do not upscale small captures.

## Redaction requirements (mandatory before publishing)
Remove or replace: real employee names, photos, salaries, allowances, bank details, national IDs, phone numbers,
email addresses, vehicle registration numbers, driver names, customer or client names, contract values, internal
URLs, API keys and anything marked confidential. Prefer a demo tenant with sample data over blurring production data.
Blur only as a last resort and verify the blur cannot be reversed (apply pixelation, then export – do not rely on
layered edits).

## Conversion (command line)
```bash
# ImageMagick
magick input.png -resize 1440x900 -quality 82 assets/images/products/hrms/dashboard.webp
# or cwebp
cwebp -q 82 -resize 1440 900 input.png -o assets/images/products/hrms/dashboard.webp
# Python (Pillow)
python3 -c "from PIL import Image; Image.open('input.png').convert('RGB').resize((1440,900)).save('dashboard.webp','WEBP',quality=82,method=6)"
```

## Replacing the "coming soon" visual
Each placeholder is a `<div class="preview-placeholder" …>` inside a `<div class="screen-frame">` (index.html hero,
hrms.html hero, ev-risk-intelligence.html hero, products.html cards). Replace the placeholder `div` with:
```html
<img src="assets/images/products/hrms/dashboard.webp" alt="Buddhi Labs HRMS dashboard showing workforce summary widgets"
     width="1440" height="900" loading="lazy" decoding="async">
```
Use `loading="eager"` and `fetchpriority="high"` only for the home-page hero image (above the fold); every other
screenshot should be `loading="lazy"`. Always keep `width` and `height` so the layout does not shift while loading.
For a gallery on the product page, use the `feature_grid` card pattern with one `<img>` per card.

## Alt-text style
Describe what the screen shows, starting with the product name, no "image of":
- "Buddhi Labs HRMS dashboard showing workforce summary widgets"
- "Buddhi Labs HRMS employee management interface"
- "Buddhi Labs HRMS attendance monitoring screen"
- "Buddhi Labs HRMS payroll report preview"
- "Buddhi Labs EV Risk Intelligence dashboard showing fleet risk overview"
- "EV Risk Intelligence fleet monitoring interface"
- "EV Risk Intelligence vehicle risk score details"
- "EV Risk Intelligence alert and event monitoring view"

## Approval
Record who approved each screenshot and the date in docs/phase-3-inputs-required.md before it goes live.
