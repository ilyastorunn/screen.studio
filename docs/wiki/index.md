# screen.studio project wiki

## Current status

`screen.studio` is a small open-source, community-curated catalog of app design. The current public UI is a Vite + React single-page app with hash routing. The active data path is a Cloudflare Worker backed by D1, with R2 used for uploaded screenshot assets.

This wiki is a synthesis layer. Source code and configuration remain authoritative; claims below are marked by the evidence they came from.

## Reading order

1. [Architecture](architecture.md) — runtime boundaries and data flow.
2. [Implementation](implementation.md) — current routes, content model, and important paths.
3. [Log](log.md) — durable changes and verification history.

## Evidence and known uncertainty

- **verified**: inspected current source/configuration in `src/`, `worker/`, `migrations/`, `wrangler.toml`, and `package.json` on 2026-07-28.
- `README.md` still describes Supabase as the “next backend phase”, while the current app fetches the Cloudflare API by default. Treat the README backend note as stale or transitional until the project owner decides whether Supabase remains supported.
- No automated test suite or committed deployment workflow was found in the inspected files.
