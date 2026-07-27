# Architecture

## Runtime shape

The browser loads the Vite-built React app. `src/main.tsx` owns the catalog UI, hash-based routing, local starter data, and the default API fetch. The default API base is `https://screen-studio-api.ilyastorunn.workers.dev`; `VITE_API_URL` can override it.

The Cloudflare Worker in `worker/index.ts` exposes:

- `GET /api/apps` — public catalog read from D1.
- `POST /api/apps` — authenticated create/upsert.
- `PUT /api/apps/:slug` — authenticated update.
- `DELETE /api/apps/:slug` — authenticated delete.
- `POST /api/assets` — authenticated multipart upload to R2.
- `GET /api/assets/:key` — public R2 asset read with long-lived caching.

Write requests require the `X-Admin-Token` header to match `ADMIN_API_KEY`. CORS is currently permissive (`*`).

## Storage

D1 stores the `apps` table defined in [`migrations/0001_create_apps.sql`](../../migrations/0001_create_apps.sql). Screenshot URLs are stored as JSON text in D1. R2 is bound as `ASSETS` in [`wrangler.toml`](../../wrangler.toml).

`supabase/schema.sql` and `src/lib/supabase.ts` define an alternative Supabase path, but the active application route is `AdminCloud` and the public catalog uses the Cloudflare API. This is an unresolved migration/cleanup boundary, not two confirmed production backends.

## Evidence

- **verified**: `src/main.tsx`, `worker/index.ts`, `migrations/0001_create_apps.sql`, `wrangler.toml`.
- **documented**: `README.md` describes Cloudflare Pages hosting and a future Supabase migration.
