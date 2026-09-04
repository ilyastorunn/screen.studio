# Project log

## 2026-09-05 — Public discovery and accessible interaction refinement

- **Scope:** Audited source, current wiki, and local UI with live catalog data without skills. Compacted desktop/mobile hero, strengthened collection CTA, enlarged metadata and control targets, preserved uncropped artwork, added category-aware keyboard search, fixed route/collection-return behavior, replaced fictional fallbacks with loading/error/retry/empty states, made long detail copy wrap, highlighted the App Store action, added gallery arrows and copy guidance, and improved admin dialog focus/mobile layout. Preserved pre-existing Creative Studio/package/output changes.
- **Affected areas:** `src/main.tsx`, `src/styles.css`, `src/catalog.ts`, `worker/catalog.test.ts`; `docs/wiki/index.md`, `catalog.md`, `architecture.md`, `brand.md`, `screenshots.md`, `implementation.md`, `operations.md`, `decisions.md`, and `log.md`.
- **Decisions:** Agent implementation choices under the owner's broad UI/UX authorization: preserve The Dot identity; prioritize collection access; expose honest catalog states; support name/category keyboard search; use native admin dialog semantics. See `decisions.md`.
- **Verification:** `npm run build`; `npm test` (11 Worker/client + 4 plugin tests); `git diff --check`; touched wiki link/path check. Manual Playwright with installed Chrome: `/tmp/niceapps-ux/check.mjs`, `states.mjs`, and `final-check.mjs` exercised 320/390/768/1024/1440px home/detail widths with no horizontal overflow, search arrows/Enter/Escape, categories, gallery arrows, collection return, unknown routes, simulated 503 → retry → empty, empty gallery, extreme unbroken title, and native modal focus containment/Escape/restoration. Desktop/mobile home, collection, detail, and mobile admin screenshots were inspected. Browser page errors were empty in the smoke run. Real source-image single/combined PNG generation passed through a clipboard adapter (410,394 / 3,870,189 bytes); actual system clipboard writes/permission prompts and export-banner visual fidelity were not verified. Authenticated admin save/delete/import/upload and production changes were not exercised. Initial harness assumptions about native browser focus and hash-only data reload were corrected; the extreme-name check exposed and led to fixing About-heading overflow before it passed.
- **Deployment:** Not deployed; local preview at `http://127.0.0.1:5173`.
- **Follow-up:** No committed browser regression suite; retain manual browser checks for now. Production publication and authenticated admin/real clipboard checks remain outside this verified result.

## 2026-09-04 — ASC-ready Unscroll screenshot export

- **Scope:** Corrected the screenshot product contract so final means directly uploadable App Store Connect assets, not contact sheets. Added a manifest-driven Sharp renderer, produced seven ordered Unscroll screenshots from real supplied UI captures, generated a separate QA sheet and upload manifest, and corrected full-resolution copy/layout collisions found during visual review.
- **Affected areas:** `plugins/niceapps-creative-studio/skills/screenshot-studio/`, `scripts/render-screenshot-set.mjs`, `evals/unscroll-render-manifest.json`, `evals/results/unscroll-2026-09-04.md`, `output/screenshot-prototypes/unscroll-asc-v1/`, root `package.json`/lockfile, `docs/wiki/creative-studio.md`, `decisions.md`, and `log.md`.
- **Decisions:** Final screenshot delivery requires separate files in a current Apple-supported slot, opaque accepted formats, faithful supplied UI, deterministic sequence naming, and full/reduced-size QA. Contact sheets remain intermediate-only. The first production target is `en-US` iPhone 6.9-inch portrait at `1290 × 2796`.
- **Verification:** Apple’s official current screenshot specification was checked for accepted `1290 × 2796` portrait PNGs and the no-alpha rule. The renderer verified all seven files as `1290 × 2796`, sRGB, three-channel PNGs; the seven-file ZIP inventory was checked. The complete set was visually inspected at reduced storefront-like size; Insights and Journey were inspected at full resolution and rerendered after correcting collisions. `npm run build` succeeded; root `npm test` passed 10 Worker/app tests and 4 plugin MCP tests; official plugin and skill validation passed; `git diff --check` and touched wiki path checks passed.
- **Deployment:** Not deployed and not uploaded to App Store Connect; upload-ready files are local.
- **Follow-up:** Test the same renderer and final-output gate on apps with materially different visual systems, then generalize device-slot presets and localization handling.

## 2026-09-04 — Unscroll screenshot visual prototype

- **Scope:** Exercised the screenshot skill's generation and critique loop on the approved Unscroll direction. Produced a first five-frame contact sheet, identified its repeated phone composition, generated a more varied revision, and produced a coordinated privacy/brand closing pair. Recorded the prompt set, output roles, and the boundary between generative art direction and truthful production rendering.
- **Affected areas:** `output/screenshot-prototypes/unscroll-v1/`, `plugins/niceapps-creative-studio/evals/results/unscroll-2026-09-04.md`, `docs/wiki/creative-studio.md`, and `docs/wiki/log.md`.
- **Decisions:** Use generated contact sheets for fast direction finding and critique, not final App Store exports. Prefer the varied core pass and privacy/brand closing pair. Final assets must use exact source captures with deterministic typography/layout and separate `1290 × 2796` exports.
- **Verification:** All three PNGs were generated and visually inspected; their dimensions were confirmed as `1693 × 929`, `1734 × 907`, and `1726 × 911`. The first and revised core passes were compared for narrative clarity and composition diversity. `npm run build` succeeded; root `npm test` passed 10 Worker/app tests and 4 plugin MCP tests; `git diff --check` and touched wiki path checks passed. The official plugin/skill validator was not rerun because the local Python environments lack `PyYAML`; those plugin/skill definitions were unchanged by this visual pass and passed validation in the preceding task. Production pixel fidelity and individual App Store exports were not verified.
- **Deployment:** Not deployed; the files are local concept artifacts.
- **Follow-up:** Build the deterministic renderer, reconstruct the selected concepts from exact raw captures, and validate the first individual export set at storefront size.

## 2026-09-04 — First real screenshot-skill evaluation

- **Scope:** Ran the complete pre-render screenshot workflow on the published Unscroll app using its live App Store listing, sibling-repo product context, seven live screenshots, approved real-device captures, and niceapps.club references. Recorded the normalized brief, current-set audit, reference rationale, three visual directions, recommended seven-frame narrative, and diagnostic score. Fixed the App Store MCP import after the trial exposed a Worker-side Apple 403.
- **Affected areas:** `plugins/niceapps-creative-studio/mcp-server/src/catalog.js`, `mcp-server/test/catalog.test.js`, `evals/results/unscroll-2026-09-04.md`, `docs/wiki/creative-studio.md`, and `log.md`.
- **Decisions:** Preserve Unscroll's sanctuary identity but move to a mechanism-first sequence: Shield, Focus setup, Hard Mode, Insights, Journey, precise privacy, then brand close. Keep Routines/Habits out until approved raw captures exist. Let the local MCP fall back directly to Apple's public lookup when the Worker import fails.
- **Verification:** `npm run build` succeeded; root `npm test` passed 10 Worker/app tests and 4 plugin MCP tests; plugin validation and `git diff --check` passed. A live fallback import returned Unscroll, Productivity, Apple ID `6766120727`, and seven screenshots. The live listing, local evidence, seven current compositions, and four selected niceapps.club reference sets were inspected. No new screenshot was rendered.
- **Deployment:** Not deployed; no marketplace entry or App Store write was made.
- **Follow-up:** Choose a visual direction and implement the renderer/recomposition path; add a Routines/Habits frame only after obtaining a truthful raw capture. Correct the sibling doomscroll marketing context's stale 1.1 release-state statement separately.

## 2026-09-04 — Creative Studio plugin foundation

- **Scope:** Added the repository-local `niceapps-creative-studio` Codex plugin foundation, the first `screenshot-studio` skill for published and unreleased apps, a read-only catalog/App Store import MCP server, diagnostic references, and initial behavioral evaluation cases. Kept Simulator capture, final rendering/export, icon generation, and full ASO outside this first slice so the core workflow can be tested honestly.
- **Affected areas:** `plugins/niceapps-creative-studio/`, root `package.json`, `docs/wiki/index.md`, `product.md`, `architecture.md`, `creative-studio.md`, `decisions.md`, and `log.md`.
- **Decisions:** Package the product as one plugin with a judgment-oriented screenshot skill and deterministic read-only MCP. Require user-provided raw in-app screens for final compositions; support useful brief/shot-list work when screens are absent. Defer Simulator capture and icon work until the screenshot workflow is validated with real apps.
- **Verification:** `npm run build` succeeded; root `npm test` passed 10 Worker/app tests and 3 plugin MCP tests; official plugin and skill validators passed; an MCP SDK client listed `search_apps`, `get_app`, and `import_app_store`; a live `search_apps` call returned production catalog results; `git diff --check` passed. Wiki path/link checks passed for the touched pages. No full Codex invocation or visual output was verified.
- **Deployment:** Not deployed; no marketplace entry was created.
- **Follow-up:** Run the first real-app evaluation set; add a renderer only after app understanding, retrieval, and narrative quality are acceptable. Add the icon vertical after screenshot validation.

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
