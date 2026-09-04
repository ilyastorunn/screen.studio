# Implementation

## Public composition

`src/main.tsx` currently contains the public component composition:

- `Brand`, `Header`, `Hero`, `Collection`, `DotPickCard`, `AppCard`, and `Footer` build the home experience.
- `Detail`, `ScreenshotGallery`, and `NextDiscovery` build app pages.
- `AppIcon` and `ScreenshotStrip` normalize repeated app presentation.
- `Home`, `Detail`, and `AdminCloud` are selected by hash/host state in `App`.

The public home and detail pages share `.public-shell`, header, footer, search state, catalog state, and dark semantic tokens. The admin is excluded from the public redesign scope.

The home `Hero` keeps the discovery statement on the left and uses backgroundless Poppy, Miso, and Nico marks as an editorial character stage on the right. The trio overlap in the same low-high-low silhouette as the favicon rather than occupying separate columns. Each mascot is keyboard focusable and exposes a short role introduction; CSS-only character-specific gestures run on hover/focus unless reduced motion is requested. A compact, currently non-interactive MCP/Skill teaser reserves the route beneath the primary CTA until the integration destinations and final copy exist.

## Detail behavior

Detail pages render app icon, category, optional developer, responsive title sizing, short description, platform/update metadata, optional website and App Store links, contact link, screenshot gallery, “Why {App}?” content, and the next catalog item. Long descriptions split into a lead paragraph and expandable remainder.

The page document title becomes `{App} | nice apps club` and returns to `nice apps club` when the detail component unmounts.

## Admin behavior

`#/admin` and the dedicated admin hostname render `AdminCloud`. It:

- loads the catalog from D1 with three attempts and incremental retry delay;
- stores the admin token only in the current browser’s `localStorage`;
- creates/upserts and deletes apps through the Worker;
- imports App Store metadata directly from Apple first, then falls back to the Worker endpoint;
- always targets the US storefront and preserves Apple 429 retry information;
- uploads multiple screenshots sequentially to R2;
- previews/removes screenshots before save;
- sets or clears Poppy’s Pick.

Import fills name, descriptions, category, developer, platform, App Store URL, website, icon, and normalized screenshots. GitHub issue submissions do not call this admin flow and cannot automatically set the featured flag.

## Content model

An `AppItem` contains:

- required: `slug`, `name`, `category`, `description`, `icon`, `screenshots`, `accent`, and display `updated`;
- optional/detail: `long_description`, `app_store_url`, `developer`, `website_url`, `platform`, `updated_at`, and `is_dot_pick`.

The frontend maps D1 `updated_at` into a localized display date and parses serialized screenshot JSON. An icon may be an HTTP/API image or a text/emoji fallback.

## Error, empty, and accessibility states

- Public catalog fetch failure preserves fallback apps.
- Search, collection, screenshot, and admin loading/empty/error states have visible messaging.
- Links and controls receive explicit focus-visible outlines.
- The screenshot rail is keyboard focusable and app images carry contextual alt text.
- Reduced-motion CSS disables nonessential motion.

## Verification

The current Node test suite contains 10 tests across:

- Apple storefront, ID extraction, metadata parsing, and 429 handling;
- catalog filtering, featured fallback, and next-discovery wrapping;
- Dot Pick API round-trip and D1 batch behavior.

The build validates TypeScript and produces the Vite production bundle. Browser-level tests do not yet cover visual layout, clipboard behavior, admin authentication, R2 upload, or hash navigation.

## Important paths

- `src/main.tsx` — routing, state, public/admin UI, API integration, clipboard export.
- `src/styles.css` — public identity, responsive UI, motion, admin styles.
- `src/catalog.ts` — search/filter, featured selection, next discovery.
- `src/app-store.ts` — client Apple lookup parsing.
- `worker/index.ts` — Worker API, auth, D1, R2, server-side Apple fallback.
- `worker/*.test.ts` — Node test suite.
- `migrations/*.sql` — D1 schema history.
- `public/brand/` — The Dot raster and SVG assets.
- `index.html`, `public/favicon.svg`, `public/robots.txt`, `public/sitemap.xml` — metadata and discoverability.
- `vite.config.ts`, `wrangler.toml` — local proxy and Cloudflare bindings.

## Known gaps

- `src/main.tsx` remains a large single module; the planned public component boundaries are conceptual functions rather than separate files.
- The initial legacy/global style layer remains above `.public-shell` in `src/styles.css`; public rules override it and admin still depends on parts of it.
- The Worker accepts both POST upsert and PUT update, while the current admin save flow uses POST upsert.
- UI, clipboard, and production smoke coverage remain manual.

## Evidence

- **Verified:** implementation and test paths above inspected on 2026-09-04; `npm run build` and `npm test` completed successfully.
