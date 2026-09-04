# Architecture

## Runtime shape

The browser loads a Vite-built React application. `src/main.tsx` owns application state, hash routing, public composition, the Cloudflare admin, API loading, and clipboard image generation. Public pages share `.public-shell`; the admin remains visually and structurally independent.

Routes are selected without a router dependency:

- `#/` or an empty hash — public home.
- `#/apps/:slug` — public app detail when the slug exists in the loaded catalog.
- `#/admin` — admin UI.
- Requests on `admin-screen-studio.devanta.net` render the admin regardless of hash.

Production API requests default to `https://screen-studio-api.ilyastorunn.workers.dev`. `VITE_API_URL` can override that origin. During Vite development, `/api` is proxied to the production Worker so the browser can use same-origin paths.

## Data flow

1. The React app starts with three fallback entries from `src/main.tsx`.
2. It requests `GET /api/apps` and replaces the fallback only when the API returns a non-empty catalog.
3. `parseApp` normalizes screenshots, optional detail fields, timestamps, icon data, and `is_dot_pick`.
4. Public search, category filtering, Poppy’s Pick selection, and next-discovery ordering run client-side in `src/catalog.ts`.
5. Admin writes go through the Worker; screenshots uploaded through the admin are stored in R2 and their public API URLs are stored with the D1 app row.

## Worker API

`worker/index.ts` exposes:

- `GET /api/apps` — public catalog, newest rows first.
- `POST /api/apps` — authenticated create/upsert.
- `PUT /api/apps/:slug` — authenticated update.
- `DELETE /api/apps/:slug` — authenticated delete.
- `GET /api/import/app-store` — Apple lookup/search fallback using the US storefront.
- `POST /api/assets` — authenticated multipart R2 upload.
- `GET /api/assets/:key` — public R2 read with immutable one-year caching.

All write methods require `X-Admin-Token` to match the Worker secret `ADMIN_API_KEY`. API CORS currently allows any origin. `ADMIN_EMAIL` exists in the environment type but is not used by current authorization logic.

## Storage and migrations

The D1 binding is `DB`, backed by `screen-studio-db`. The R2 binding is `ASSETS`, backed by `screen-studio-assets`.

- [`0001_create_apps.sql`](../../migrations/0001_create_apps.sql) creates the base catalog table.
- [`0002_app_details.sql`](../../migrations/0002_app_details.sql) adds long description, App Store URL, developer, website, and platform.
- [`0003_dot_pick.sql`](../../migrations/0003_dot_pick.sql) adds `is_dot_pick` and a partial unique index allowing at most one selected row.

Screenshot arrays are serialized as JSON text in D1. The Worker uses a D1 batch to clear the previous pick and write the new pick atomically. Supabase is no longer part of the repository or active architecture; the prior wiki description of it as an alternative path is superseded.

## Static delivery

Cloudflare Pages serves `dist/`. `public/_redirects` rewrites all paths to `index.html`, while navigation inside the app uses hashes. `index.html` owns canonical, favicon, Open Graph, Twitter, theme-color, and document-title metadata.

## Creative Studio plugin

`plugins/niceapps-creative-studio/` is a repository-local Codex plugin, separate from the browser runtime. Its `screenshot-studio` skill owns reasoning and workflow guidance. Its Node stdio MCP server owns deterministic catalog access and calls the existing public Worker API; it does not write D1/R2 data or render assets.

The MCP server is launched from the plugin root through `.mcp.json` and currently exposes catalog search, single-app retrieval, and App Store import. Pure catalog normalization/scoring logic has Node tests. Root `npm test` includes those plugin tests after the Worker suite.

## Evidence

- **Verified:** `src/main.tsx`, `src/catalog.ts`, `src/app-store.ts`, `worker/index.ts`, `migrations/*.sql`, `vite.config.ts`, `wrangler.toml`, and `public/_redirects` inspected on 2026-09-04.
- **Verified:** Supabase files are absent from the current tree; removal is recorded by commit `25a0b67`.
