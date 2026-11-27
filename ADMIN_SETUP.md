# Admin panel setup

The editor at `https://naranijiizaya.org/admin` manages product-group prices and visibility, contact details, social links and the order link. It supports Mongolian and English. Changes are stored in Cloudflare D1 and survive future website deployments.

## Set your admin password

Zero Trust and Cloudflare Access are **not required**.

1. Open **Cloudflare → Workers & Pages → naranijiizaya → Settings → Variables and Secrets**.
2. Select **Add**, choose the **Secret** type, and enter the name `ADMIN_PASSWORD`.
3. Enter a unique password or passphrase of **at least 16 characters**. A password manager can generate and store it. Enter it directly in Cloudflare; do not put it in GitHub or chat.
4. Save/deploy the setting.
5. Open `https://naranijiizaya.org/admin` and sign in with that password.

There is one shared administrator password in this version. Anyone who knows it can edit the supported website settings. Individual editor accounts are not included. To change or recover the password, replace the `ADMIN_PASSWORD` secret in Cloudflare and deploy the setting. Existing sessions stop working after the password changes.

If you previously configured an Access application for this site's admin paths, remove those paths from that application so it does not intercept the password sign-in screen. Unused `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, and `ADMIN_EMAILS` settings can be removed; the app no longer reads them.

## Using the editor

- Prices apply to all numbered variants in the group.
- **Show in shop** hides or restores a group.
- Empty contact fields are hidden on the public website. Links must start with `https://`.
- Click **Хадгалах / Save changes** to publish an edit. New page loads show the saved content; open pages refresh on focus and every minute.
- If another editor saved first, reload the latest version before making further changes.
- Click **Sign out** when finished. Sessions also expire after eight hours.

Photo uploads, adding new products, payment QR editing, and general page-copy editing are not included in this first version.

## Automatic deployment

The existing Cloudflare Worker is connected to **OrdinaryPersonn/naranijiizaya**, production branch **main**. Its build command is `npm run build` and deploy command is `npx wrangler deploy`. Pushes trigger a new Cloudflare build; content changes saved through the admin panel do not require a push.

Wrangler provisions/reuses the `CONTENT_DB` D1 binding. The Worker initializes its tables with `CREATE TABLE IF NOT EXISTS` and seeds initial content with `INSERT OR IGNORE`. It never resets saved prices on deployment. Preserve this binding/database when changing the website. Export a D1 backup before structural database changes.

If a build says a hostname has externally managed DNS records, remove only the conflicting A/AAAA/CNAME for that exact hostname and attach it through **Worker → Settings → Domains & Routes → Custom Domain**, then retry the build. Keep email records and other hostnames unchanged.

## Authentication behavior

- The password exists only as a Cloudflare Worker secret. It is never stored in the frontend, repository, browser storage or database.
- Successful sign-in sets a random, host-only, `Secure`, `HttpOnly`, `SameSite=Strict` cookie. D1 stores a hash of the session token, its expiration and a password-bound verification tag.
- Every private API request checks its session, expiration, hostname and current password. The public `/admin` page is only the sign-in shell; opening it does not grant permission to read or change settings.
- Logout deletes the server-side session, preventing replay of that cookie.
- Sign-in is limited to ten attempts per client IP per fifteen minutes, shared across hostnames and Worker instances. Mutation endpoints require same-origin JSON requests.
- The admin page and API responses use `Cache-Control: no-store`.

## Local checks

```bash
npm ci
npm test
npm run build
npx wrangler deploy --dry-run
npm run dev:worker
```

Wrangler runs the built frontend and local D1 at `http://localhost:8787`. To test sign-in locally, set a separate testing-only `ADMIN_PASSWORD` in an ignored `.dev.vars` file. Never reuse the production password in test fixtures. For frontend hot reload, also run `npm run dev`; the API proxy targets port 8787. A local login uses the same server authentication checks as production.

Manual production deployment, if needed:

```bash
npx wrangler login
npm run deploy
```

[Cloudflare Worker secrets documentation](https://developers.cloudflare.com/workers/configuration/secrets/)
