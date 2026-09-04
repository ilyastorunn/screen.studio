# Decisions

## 2026-09-04 — Creative Studio combines a skill with a thin MCP

**Status:** Accepted.

The first Creative Studio vertical is screenshot strategy for published and unreleased iOS apps. The skill owns app understanding, selective clarification, reference reasoning, narrative, copy, and quality review. A thin read-only MCP owns deterministic access to niceapps.club and the existing App Store import endpoint. Raw in-app screens are required for final compositions; Simulator capture, icon generation, rendering/export, and full ASO analysis are deferred.

**Rationale:** Separating judgment from data access keeps tools testable and prevents unimplemented generation capabilities from appearing in the product promise. Deferring Simulator capture isolates the core value chain for real-app evaluation.

**Source:** Project-owner product decisions on 2026-09-04; `plugins/niceapps-creative-studio/`.

## 2026-09-04 — The home hero introduces the club

**Status:** Accepted.

The live hero uses backgroundless Poppy, Miso, and Nico marks in an editorial character stage instead of the raster garden scene. The trio overlap in the favicon’s low-high-low club silhouette, with Miso anchoring the middle, rather than appearing as three evenly spaced cards. Each character has a short introduction and distinct hover/focus gesture. The left column reserves a compact, non-link MCP/Skill teaser until real destinations are available.

**Rationale:** The identity should explain its characters directly, remain visually light, and create a clear future path from discovery into agent workflows without shipping dead navigation.

**Source:** Project-owner design direction; `Hero` in `src/main.tsx` and hero rules in `src/styles.css`.

## 2026-09-04 — Wiki is mandatory project memory

**Status:** Accepted.

Every completed repository change must update the relevant wiki owner page and append a reverse-chronological entry to `log.md`. Durable independently evolving subjects receive their own page; small changes update an existing page. `AGENTS.md` is the operational contract.

**Source:** Project-owner decision and [`AGENTS.md`](../../AGENTS.md).

## 2026-09-04 — Three mascots have stable product roles

**Status:** Accepted.

Nico owns discovery, Poppy owns featured picks, and Miso owns screenshot export. Their colors and roles are meaningful; the trio may appear together in the club mark and randomized export credit.

**Rationale:** The club identity gains variety without using mascots as arbitrary decoration.

**Source:** Project-owner design approval; implementation in `src/main.tsx` and `public/brand/`.

## 2026-09-04 — Screenshot exports use an original club credit

**Status:** Accepted.

Copied screenshots retain the app identity, show a random named mascot with “made it for you,” and credit `nice apps club`. The multi-shot banner stays visually subordinate to screenshot content.

**Source:** Project-owner design approval; implementation in `withExportBanner`.

## 2026-09-03 — The Dot is the site identity

**Status:** Accepted.

The public experience may be redesigned around The Dot rather than forcing the mascot into the previous visual system. The identity appears in the wordmark/club mark, favicon, hero scene, editorial picks, discovery, and footer moments.

**Source:** Project-owner design approval; assets in `public/brand/`.

## 2026-09-03 — Public v1 is dark-only

**Status:** Accepted.

The public theme toggle is removed. Components use semantic `.public-shell` tokens so a future light theme can be added without replacing the component contract. Admin styling remains independent.

**Source:** Project-owner redesign plan; `.public-shell` implementation in `src/styles.css`.

## 2026-09-03 — Featured selection is singular and editorial

**Status:** Accepted.

Only one explicit app may be featured at a time. The database enforces singular selection, the admin controls it, and the public presentation is “Poppy’s Pick.” When no explicit row exists, the first/newest catalog item is a presentation fallback.

**Source:** Project-owner redesign plan; `migrations/0003_dot_pick.sql`, `worker/index.ts`, and `src/catalog.ts`.

## 2026-09-03 — Search must preserve context

**Status:** Accepted.

Focusing or typing in search must not automatically navigate away from an app detail page. Results appear in the shared header popover; navigation occurs only when a result is chosen.

**Source:** Project-owner UX feedback; `Header` implementation in `src/main.tsx`.
