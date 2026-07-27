# Implementation

## Public experience

- `#/` renders the home page with hero content, search, category filters, catalog cards, theme toggle, and footer links.
- `#/apps/:slug` renders an app detail page with description, metadata, contact link, and screenshot gallery.
- The app initially has six local starter entries in `src/main.tsx`; a successful non-empty API response replaces them.
- Search currently matches app names only. Category filtering is client-side.

## Admin experience

`#/admin` renders the Cloudflare admin UI. It loads entries from D1, stores the admin token in `localStorage` under `screen-admin-token`, supports app upsert/delete, and uploads one screenshot at a time to R2.

## Content model

An app has `slug`, `name`, `category`, `description`, `icon`, `accent`, `screenshots`, and display/update timestamps. The frontend maps the API's `updated_at` to its display `updated` field.

## Important paths

- `src/main.tsx` — UI, starter catalog, routing, API integration.
- `src/styles.css` — all current visual styling and responsive rules.
- `worker/index.ts` — API, auth gate, D1 queries, R2 upload/read.
- `migrations/0001_create_apps.sql` — D1 schema.
- `supabase/schema.sql`, `src/lib/supabase.ts` — legacy/alternative Supabase implementation.

## Gaps not verified

- No automated tests were present in the inspected repository.
- Deployment, production secrets, D1 migration execution, and R2 permissions were not verified.
- The fallback/local admin component remains in source, but the main router currently selects the Cloudflare admin path.
