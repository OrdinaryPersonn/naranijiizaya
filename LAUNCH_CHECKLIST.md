# Launch checklist

- [x] Add real organization name from supplied NGO profile
- [x] Add organization activities, initiative, regional and international work
- [x] Add Shagdar Ariunaa’s supplied website profile
- [x] Adapt supplied content for all four site languages
- [ ] Add official logo
- [ ] Confirm yellow brand color
- [ ] Add volunteer Google Form
- [ ] Add official donation QR
- [ ] Verify donation bank information
- [ ] Add official email
- [ ] Add phone number if wanted
- [ ] Add organization address if wanted
- [ ] Confirm existing Facebook link belongs to the organization (not supplied in the profiles)
- [ ] Add Instagram
- [ ] Add other social links
- [ ] Add approved organization photos
- [ ] Add real patient/community stories
- [ ] Confirm documented consent for stories/photos
- [ ] Add actual merchandise
- [ ] Add merchandise photography
- [ ] Add merchandise pricing
- [ ] Add purchase/contact method
- [ ] Clinically review Mongolian medical information
- [ ] Review Mongolian writing
- [ ] Review English
- [ ] Review Simplified Chinese
- [ ] Review Russian
- [ ] Verify local healthcare information
- [ ] Verify medical references
- [ ] Verify review dates
- [ ] Add final legal/privacy information
- [ ] Configure production domain
- [ ] Configure organization email
- [ ] Run accessibility review
- [ ] Run mobile QA
- [ ] Run production build

## Known intentional placeholders

Organization and Ariunaa profile content now comes from the two supplied DOCX files, with translations in `src/data/organizationCopy.ts`. The Mongolian canonical export in `src/data/organization.ts` shares that source. Missing operational details remain empty in `src/config/site.ts`. Development stories and merchandise are not shown. Original SVG placeholders remain available in `public/brand`, `public/donation`, and `public/images`, but are not displayed on the page. No bank details, contact details, patient testimonials, impact statistics or merchandise inventory have been invented.
