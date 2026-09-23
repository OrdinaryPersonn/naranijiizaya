# Наран Ижий Заяа НҮТББ — support website

A multilingual, mobile-first one-page website for a Mongolian cancer-support nonprofit or volunteer organization. The default language is Mongolian; English, Simplified Chinese, and Russian are also included.

Organization content and Shagdar Ariunaa’s profile are adapted from `Naran_Ijii_Zayaa_NGO_Website_Profile.docx` and `Shagdar_Ariunaa_Website_Profile.docx` supplied in this folder. Mongolian is the original language; English, Simplified Chinese, and Russian translations are included. The initiative, eight activity areas, regional work, and international cooperation are represented without adding dates, impact statistics, named partners, or credentials absent from those documents.

The documents contain no official logo, photos, contact details, volunteer form, donation information, or merchandise inventory. The site uses a text wordmark and content panels, hides the sample merchandise, and leaves missing contact/payment fields unconfigured. The pre-existing Facebook URL is retained; it is not verified by either document. Existing educational health content still requires the review described in `LAUNCH_CHECKLIST.md`.

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run typecheck
npm run build
npm run preview
```

## Project map

- `src/App.tsx` — page composition and accessible interactions.
- `src/styles.css` — responsive layout, print styles, reduced-motion support, and CSS variable usage.
- `src/config/site.ts` — the one place for organization name, logo, domain, form, donations, contact, and social links.
- `src/config/theme.ts` — brand color tokens applied to the document at runtime.
- `src/i18n/translations.ts` — all UI and medical-support copy for `mn`, `en`, `zh`, and `ru`.
- `src/data/organizationCopy.ts` — localized organization, initiative, activities, cooperation and Ariunaa profile content.
- `src/data/organization.ts` — canonical Mongolian content exported from the same source.
- `src/data/stories.ts` — reusable consent-aware story model. Only `published && consentConfirmed` stories are eligible to display.
- `src/data/merch.ts` — reusable merchandise catalog model.
- `src/data/references.ts` — medical reference metadata, URLs, review dates, and review-needed flags.
- `public/brand`, `public/donation`, `public/images` — replaceable SVG placeholders and future assets.

## Where to replace placeholders

1. Edit `src/config/site.ts` to supply the production domain, email, phone, address, logo path, volunteer form URL, donation QR, bank fields, privacy URL, and confirmed social URLs. The organization name is already populated from the profile.
2. Point `logoPath` to the official logo when provided. Until then, the header/footer display the organization name with the existing sun motif. Update the favicon in `public/brand/favicon.svg` if needed.
3. Replace the donation image and fill all donation fields together. The UI hides bank details until bank name, account name, and account number are all configured.
4. Ariunaa’s supplied website profile appears in its own section. A separate community story model remains in `src/data/stories.ts` for future consented stories; it is not currently rendered.
5. Sample products in `src/data/merch.ts` are excluded from display. Populate real catalog data and finish the price, availability and purchase UI before enabling published products.
6. Update medical copy and `src/data/references.ts` only after qualified clinical and local-context review.

## Localization

The active locale is stored in `localStorage` under `preferred-locale` and mirrored in the `?lang=` query parameter. Add a new locale to `src/i18n/types.ts`, add a complete translation object to `src/i18n/translations.ts`, add localized organization copy to `src/data/organizationCopy.ts`, then add the language to `locales` in `src/App.tsx` and to the language select in `Header`.

Do not add runtime machine translation. Keep copy in source-controlled translation data and have Mongolian reviewed as the original-language experience.

## SEO and deployment

`index.html` includes localized metadata, Open Graph metadata, canonical and hreflang links. `public/robots.txt` and `public/sitemap.xml` are included. This is a Vite static build, so it can deploy to Netlify, Vercel static hosting, Cloudflare Pages, GitHub Pages, or any static web host.

Recommended deployment:

1. Replace placeholders and complete human review.
2. Run lint, typecheck, build, accessibility review, and device QA.
3. Deploy the `dist` directory with SPA fallback to `index.html`.
4. Configure the production domain in `SITE_CONFIG.siteUrl`, update canonical/sitemap URLs, and connect the organization’s email/domain DNS.
5. Re-run the production build after every content or asset change.
