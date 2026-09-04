# Implementation

## Public composition

`src/main.tsx` currently contains the public component composition:

- `Brand`, `Header`, `Hero`, `Collection`, `DotPickCard`, `AppCard`, and `Footer` build the home experience.
- `Detail`, `ScreenshotGallery`, and `NextDiscovery` build app pages.
- `AppIcon` and `ScreenshotStrip` normalize repeated app presentation.
- `Home`, `Detail`, and `AdminCloud` are selected by hash/host state in `App`.

The public home and detail pages share `.public-shell`, header, footer, search state, catalog state, and dark semantic tokens. Admin retains its separate visual identity; its editor uses a native modal dialog for keyboard focus containment, Escape dismissal, and focus restoration. Closing is disabled while import/upload/save runs. The page behind the editor is scroll-locked; mobile admin rows and sticky form actions improve operability.

The compact home `Hero` keeps the discovery statement on the left and uses backgroundless Poppy, Miso, and Nico marks as an editorial character stage on the right. The trio overlap in the same low-high-low silhouette as the favicon rather than occupying separate columns. Each mascot is keyboard focusable and exposes a short role introduction; CSS-only character-specific gestures run on hover/focus unless reduced motion is requested. A compact, currently non-interactive MCP/Skill teaser reserves the route beneath the primary CTA until the integration destinations and final copy exist.

## Detail behavior

Detail pages render app icon, category, optional developer, wrapping title, full short description, platform/update metadata, a prominent “View on App Store” action when available, optional website and contact links, screenshot gallery, “About {App}” content, and the next catalog item. Icons fall back to an initial when the remote image fails. “Back to all apps” returns directly to the collection. Next Discovery is compact on mobile. Long descriptions split into a lead paragraph and expandable remainder; expanded content flows in the document without a nested scroll area. Very long unbroken names wrap in both detail headings and About copy.

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

- Public catalog loading, failed fetch/retry, empty catalog, and missing routes are distinct states; fictional fallback apps were removed. Requests time out after 15 seconds.
- Search, collection, screenshot, and admin loading/empty/error states have visible messaging.
- Links and controls receive explicit focus-visible outlines. A skip link focuses the main landmark; detail navigation focuses it after loading. Search supports keyboard result selection and dismissal.
- The screenshot rail is keyboard focusable and app images carry contextual alt text.
- Reduced-motion CSS disables nonessential motion.

## Verification

The current Worker/client Node test suite contains 11 tests across:

- Apple storefront, ID extraction, metadata parsing, and 429 handling;
- catalog filtering, featured fallback, and next-discovery wrapping;
- Dot Pick API round-trip and D1 batch behavior.

The build validates TypeScript and produces the Vite production bundle. Manual Playwright/Chrome checks on 2026-09-05 covered responsive visual layout, category/search keyboard navigation, hash routes, gallery scrolling, PNG generation through a clipboard adapter, API error/retry/empty states, long unbroken titles, absent screenshots, and admin dialog focus/Escape/restoration. Actual clipboard permissions, authenticated admin mutations, and R2 uploads were not exercised. There is no committed browser regression suite.

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

## 2026-09-05 UI/UX audit

**Verified against source and local Chrome with the live catalog:** the previous hero consumed almost the full first desktop viewport; search promised category lookup but matched names only and had no arrow/Enter selection; failed requests silently retained fictional examples; missing app links rendered the home page; oversized/nowrap titles and tiny metadata limited readability; screenshots lacked directional controls; admin editing lacked modal semantics.

The current implementation addresses these through compact responsive hierarchy, larger controls/text, category-aware keyboard search, explicit data/route states, wrapping titles, gallery arrows and instructional feedback, and a native admin dialog. The original dark identity, mascot roles, editorial pick and export branding remain. These are implementation decisions under the owner's broad UI/UX request, not separately approved brand changes. No skills were used.
