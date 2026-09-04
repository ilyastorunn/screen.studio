# niceapps.club project wiki

## Current status

`niceapps.club` is an open-source, community-curated catalog of thoughtful app design. The production public site is [niceapps.club](https://niceapps.club); it runs as a Vite + React single-page application with hash routing, a Cloudflare Worker API, D1 content storage, and R2 screenshot storage.

The public experience currently uses the dark-only The Dot identity. Nico, Poppy, and Miso have distinct product roles across discovery, featured picks, and screenshot exports. The home page, app-detail experience, global search, Poppy’s Pick, branded screenshot copying, admin import flow, migrations, tests, and production deployment are implemented.

This wiki is the durable synthesis layer. Source code, tests, configuration, reproduced runtime behavior, and current project-owner decisions remain authoritative. Repository agents must follow [`AGENTS.md`](../../AGENTS.md): read the wiki before work and update it before declaring work complete.

## Reading order

1. [Product](product.md) — promise, audience, scope, and public surfaces.
2. [Architecture](architecture.md) — runtime boundaries, storage, API, and data flow.
3. [Brand system](brand.md) — The Dot identity, mascot roles, tokens, assets, and motion.
4. [Catalog and discovery](catalog.md) — search, filters, layout, Poppy’s Pick, and next discovery.
5. [Screenshot experience](screenshots.md) — gallery, copy/export pipeline, and constraints.
6. [Implementation](implementation.md) — current routes, admin behavior, content model, and important paths.
7. [Operations](operations.md) — local verification, Cloudflare resources, deployment, and production evidence.
8. [Creative Studio plugin](creative-studio.md) — MCP/Skill product boundary, current tools, evaluation, and deferred capabilities.
9. [Decisions](decisions.md) — durable product and architecture choices.
10. [Log](log.md) — reverse-chronological changes and verification history.

## Evidence snapshot

- **Verified 2026-09-04:** inspected `src/`, `worker/`, `migrations/`, public brand assets, test files, Vite/Wrangler configuration, package scripts, current Git state, and production deployment results.
- **Tested 2026-09-04:** `npm test` passes 10 Node tests; `npm run build` completes the TypeScript and Vite production build.
- **Observed 2026-09-04:** `niceapps.club`, the Pages deployment URL, and `GET /api/apps` responded successfully after deployment.

## Known limitations

- Cloudflare Pages is deployed manually and is not connected to a Git provider.
- No browser end-to-end or automated visual-regression suite currently covers the public UI, clipboard output, or admin flows.
- R2 is configured and bound to the Worker, but a fresh production upload was not performed during the 2026-09-04 wiki audit.
- The public theme is intentionally dark-only; semantic tokens exist, but no light-theme implementation or public toggle exists.
- The repo-local Creative Studio plugin has not been installed through a marketplace or validated on real application briefs yet.

New durable features or subsystems receive a dedicated lowercase page when they need independent links or repeated updates. Smaller refinements update the existing page that owns the subject.
