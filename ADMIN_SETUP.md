# Admin panel and Cloudflare deployment

The editor at `https://naranijiizaya.org/admin` manages prices, product-group visibility, phone, email, address, social links and the order link. It supports Mongolian and English. Prices apply to all numbered variants within a product group. Photo uploads, product creation and page-copy editing are not included in this first version.

Changes are saved to Cloudflare D1. New visitors see saved changes on their next page load; an already-open page refreshes content on focus and every minute. Website deployments preserve saved content. Invalid prices and unsafe URLs are rejected, and concurrent editors cannot silently overwrite each other's changes.

## 1. Connect GitHub to the existing Worker

In Cloudflare, open **Workers & Pages → naranijiizaya → Settings → Build** and connect **OrdinaryPersonn/naranijiizaya**. Choose:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

Cloudflare must install dependencies from `package-lock.json` (or use `npm ci` if an install command is requested). Enable automatic builds for pushes to `main`. Existing Vercel integrations do not deploy this Cloudflare Worker or its database.

The checked-in Wrangler configuration keeps the existing Worker name and both custom domains. Wrangler 4.168.0 or later automatically provisions the `CONTENT_DB` D1 binding, reusing the linked database on subsequent deploys. The Worker initializes its table and starting content once with `CREATE TABLE IF NOT EXISTS` and `INSERT OR IGNORE`; no manual SQL migration is needed for this initial schema. The deployment account needs permission to create/bind D1 databases and deploy the Worker.

For a manual first deployment from this folder:

```bash
npm ci
npx wrangler login
npm run deploy
```

After deployment, `/api/content` should return JSON. Until authentication is configured below, `/admin` and its write API return an error and cannot edit content. The public website remains accessible.

## 2. Choose who can edit

Use an email inbox you control. In **Cloudflare Zero Trust → Access → Applications**, add a **Self-hosted** application called **Naran Ijii Zaya Admin**. Add these four public hostname/path entries to the **same application**:

| Hostname | Path |
| --- | --- |
| `naranijiizaya.org` | `/admin*` |
| `naranijiizaya.org` | `/api/admin*` |
| `www.naranijiizaya.org` | `/admin*` |
| `www.naranijiizaya.org` | `/api/admin*` |

Add an **Allow** policy restricted to the exact email addresses of the editors. Enable **One-time PIN** as a login method if you want Cloudflare to email a sign-in code. Protect only these paths; protecting the entire Worker would require visitors to log in to the public site.

Copy the application's **Application Audience (AUD) Tag** from its settings, and note your Zero Trust team domain, which looks like `https://your-team.cloudflareaccess.com`.

## 3. Set the Worker's sign-in configuration

In **Workers & Pages → naranijiizaya → Settings → Variables and Secrets**, add:

| Name | Value |
| --- | --- |
| `ACCESS_TEAM_DOMAIN` | Your full `https://your-team.cloudflareaccess.com` URL |
| `ACCESS_AUD` | The Access application's AUD tag |
| `ADMIN_EMAILS` | The approved editor email addresses, separated by commas |

These are runtime settings. Keep the email allowlist in Cloudflare, not in GitHub. Save/deploy the settings. `keep_vars: true` preserves dashboard variables on later Wrangler deployments; secrets are also retained.

The Worker verifies the Access JWT signature, issuer, audience, expiration and editor email on **every admin request**. Requests through `workers.dev` or other hostnames cannot bypass this check. Admin responses and content API responses are not cached. Saves require a same-origin JSON request.

## 4. Verify and use

1. Open the public website in a signed-out browser: it must remain public.
2. Open `https://naranijiizaya.org/admin`, enter your approved email and sign-in code.
3. Edit a price or contact field and click **Хадгалах / Save changes**. A success message appears only after the database confirms the update.
4. Refresh the public shop to verify the change. Use **Show in shop** to hide or restore a product group.
5. If another editor saved first, use **Reload latest** before making further edits. Reloading discards unsaved edits only after confirmation.

Use the same database binding for future deployments. Do not delete/recreate the D1 database to update the website. Before structural schema changes, export a backup or use D1 recovery tools.

## Local development and checks

```bash
npm ci
npm test
npm run build
npm run dev:worker
```

Wrangler serves the built frontend and API at `http://localhost:8787`, backed by local D1 storage. For frontend hot reload, also run `npm run dev`; its `/api` proxy targets the local Worker. Local sign-in stays locked unless valid Access configuration and a verified identity are supplied. There is no production password or development bypass in the app. Tests use signed test JWTs and an in-memory SQLite database.

## References

- [Workers Git integration and builds](https://developers.cloudflare.com/workers/ci-cd/)
- [Automatic resource provisioning](https://developers.cloudflare.com/changelog/post/2025-10-24-automatic-resource-provisioning/)
- [Access hostname and path protection](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)
- [Validating Access JWTs](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
