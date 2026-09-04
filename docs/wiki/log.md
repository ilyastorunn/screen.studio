# Project log

## 2026-09-04 — Mascot-stage ellipse removal

- **Scope:** Removed the decorative shared ellipse beneath the clustered hero mascots so the characters sit directly on the page background.
- **Affected areas:** `src/styles.css`, `docs/wiki/log.md`.
- **Decisions:** The clustered hero silhouette does not use a ground ring or pedestal decoration.
- **Verification:** `npm run build` succeeded; all 10 `npm test` cases passed; the hero was visually inspected locally and the ellipse was confirmed absent; `git diff --check` and the wiki link/path check passed.
- **Deployment:** Not deployed.
- **Follow-up:** None.

## 2026-09-04 — Clustered club-member hero

- **Scope:** Refined the hero character stage so Poppy, Miso, and Nico overlap like the favicon’s low-high-low silhouette; replaced the previous formal heading with the more playful “Small crew. Big taste.” and renamed the eyebrow to “The Club Members.”
- **Affected areas:** `src/main.tsx`, `src/styles.css`, `docs/wiki/brand.md`, `implementation.md`, `decisions.md`, and `log.md`.
- **Decisions:** Multi-character hero compositions follow the clustered club-mark hierarchy instead of evenly spaced character columns. Miso anchors the taller center position, with Poppy and Nico on the lower outer edges.
- **Verification:** `npm run build` succeeded; all 10 `npm test` cases passed; desktop and `390×844` layouts were visually inspected locally; Poppy’s keyboard-focus introduction was exercised; browser console warnings/errors were empty; `git diff --check` and the wiki link/path check passed.
- **Deployment:** Not deployed.
- **Follow-up:** None.

## 2026-09-04 — Editorial mascot hero and integration teaser

- **Scope:** Replaced the raster garden hero with a backgroundless Nico, Poppy, and Miso character stage; added short role introductions, distinct hover/focus gestures, and a compact reserved area for the upcoming MCP/Skill offering.
- **Affected areas:** `src/main.tsx`, `src/styles.css`, `public/brand/poppy-mark.svg`, `docs/wiki/product.md`, `brand.md`, `implementation.md`, `decisions.md`, and `log.md`.
- **Decisions:** The home hero introduces all three club characters directly. The MCP/Skill teaser remains non-interactive until real destinations exist. Character motion is CSS-only, role-specific, focus-accessible, and disabled by reduced-motion preferences.
- **Verification:** `npm run build` succeeded; all 10 `npm test` cases passed; desktop and `390×844` layouts were visually inspected locally; Nico’s focus introduction was exercised; browser console warnings/errors were empty; `git diff --check` and the wiki link/path check passed.
- **Deployment:** Not deployed.
- **Follow-up:** Replace the teaser’s coming-soon state with final MCP/Skill copy and destinations when the project owner supplies them.

## 2026-09-04 — Current-state wiki backfill

- **Scope:** Reconciled the project wiki with the current product, The Dot identity, catalog/search behavior, screenshot system, admin/API implementation, schema history, tests, and verified production rollout.
- **Affected areas:** `docs/wiki/index.md`, `product.md`, `architecture.md`, `brand.md`, `catalog.md`, `screenshots.md`, `implementation.md`, `operations.md`, `decisions.md`, and `log.md`.
- **Decisions:** Split durable, independently evolving product areas into focused topic pages; retained architecture and implementation as cross-cutting current-state pages. Marked Supabase and the old theme-toggle/test/deployment claims as superseded instead of carrying them forward.
- **Verification:** Inspected `AGENTS.md`, README/contribution sources, all wiki pages, `src/main.tsx`, `src/catalog.ts`, `src/app-store.ts`, relevant `src/styles.css` rules, `worker/index.ts`, all migrations/tests, brand assets, package/Vite/Wrangler configuration, Git history, and the 2026-09-04 deployment evidence. `npm run build` succeeded, all 10 `npm test` cases passed, `git diff --check` passed, and the wiki inventory/link/path/chronology lint passed for all 10 pages.
- **Deployment:** Not deployed; wiki-only update. Production state documented from the verified 2026-09-04 rollout.
- **Follow-up:** Add automated browser coverage for UI/clipboard/admin flows and consider a committed Pages deployment configuration/workflow.

## 2026-09-04 — Production rollout of The Dot redesign

- **Scope:** Published the Dot Pick schema, updated Worker API, and current public frontend to Cloudflare production.
- **Affected areas:** `migrations/0003_dot_pick.sql`, `worker/index.ts`, `dist/`, Cloudflare D1/Worker/Pages resources.
- **Decisions:** Applied production changes in migration → Worker → frontend order; kept Pages deployment manual.
- **Verification:** `npm run build` succeeded; all 10 Node tests passed; D1 reported only `0003_dot_pick.sql` pending before it applied successfully; `niceapps.club`, the Pages deployment, and `GET /api/apps` returned HTTP 200.
- **Deployment:** Worker version `f204ebfc-95b8-44b4-a514-0c43839b89e2`; Pages preview `https://b804819b.screen-studio.pages.dev`; custom domain `https://niceapps.club`.
- **Follow-up:** None for rollout. Git-provider automation remains unconfigured.

## 2026-09-04 — Three-character club and branded screenshot export

- **Scope:** Replaced the single generic mascot role with Nico, Poppy, and Miso; repaired Nico’s next-discovery pose; assigned product roles; redesigned individual/combined screenshot credit banners; constrained multi-shot banner height.
- **Affected areas:** `src/main.tsx`, `src/styles.css`, `public/brand/dot-club.svg`, `dot-stretch.svg`, `poppy-peek.svg`, `miso-mark.svg`, and related brand assets.
- **Decisions:** Nico owns discovery, Poppy owns picks, and Miso owns exports. Export banners randomly select one named mascot and remain subordinate to screenshot content.
- **Verification:** `npm run build` succeeded; all 10 Node tests passed; Nico’s SVG and live public/detail layouts were visually inspected locally; `git diff --check` passed.
- **Deployment:** Included in the 2026-09-04 production rollout above.
- **Follow-up:** Automated canvas-export visual testing is still absent.

## 2026-09-04 — Mandatory wiki operating contract

- **Scope:** Added a repository-wide agent contract that makes the wiki the durable project memory and requires documentation maintenance as part of every completed change.
- **Affected areas:** `AGENTS.md`, `docs/wiki/index.md`, `docs/wiki/log.md`.
- **Decisions:** Every completed repository change must be represented in the reverse-chronological log; durable independently evolving features receive dedicated topic pages, while small refinements update their existing owner page.
- **Verification:** Inspected the existing wiki structure and links; verified that no prior `AGENTS.md` or `CLAUDE.md` existed at repository root.
- **Deployment:** Not deployed; documentation and agent operating rules only.
- **Follow-up:** Completed by the current-state wiki backfill above.

## 2026-09-03 — The Dot public redesign and discovery system

- **Scope:** Rebuilt the public home/detail experience around The Dot, added the hero garden, club favicon/metadata, responsive catalog grid, global search popover, Poppy’s Pick data path, screenshot copy/gallery progress, next discovery, motion/reduced-motion behavior, and App Store admin import improvements.
- **Affected areas:** `src/main.tsx`, `src/styles.css`, `src/catalog.ts`, `src/app-store.ts`, `worker/index.ts`, `migrations/0003_dot_pick.sql`, `worker/*.test.ts`, `public/brand/`, `public/favicon.svg`, `index.html`, `vite.config.ts`, and public metadata files.
- **Decisions:** Public v1 is dark-only; The Dot may drive the visual system; search preserves route context; the explicit featured selection is singular; admin visual redesign remains out of scope.
- **Verification:** TypeScript/Vite production build and 10 Node tests passed during implementation; desktop/mobile layouts and key interactions were visually reviewed locally. No automated browser test was added.
- **Deployment:** Deployed on 2026-09-04; see the rollout entry above.
- **Follow-up:** Continue detail-page refinement with wiki updates required by `AGENTS.md`.

## 2026-07-28 — Initial project memory

- **Scope:** Inspected README, package manifest, React entrypoint/styles, Supabase files, Worker, D1 migration, and Wrangler configuration.
- **Affected areas:** Initial `docs/wiki/index.md`, `architecture.md`, `implementation.md`, and `log.md`.
- **Decisions:** None; this was an initial evidence capture.
- **Verification:** Source/configuration inspection completed; no test suite or deployment run performed.
- **Deployment:** Not deployed.
- **Follow-up:** **Superseded/resolved:** Supabase was removed in commit `25a0b67`; tests and verified deployment evidence were added and documented on 2026-09-04.
