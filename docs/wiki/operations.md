# Operations

## Local workflow

```bash
npm install
npm run dev
npm run build
npm test
```

Vite normally serves the project at `http://localhost:5173`. `npm run build` runs `tsc -b` and the Vite production build. `npm test` runs all `worker/*.test.ts` files with Node’s test runner.

## Cloudflare resources

- Pages project: `screen-studio`.
- Production domains: `niceapps.club`, `www.niceapps.club`.
- Admin domain: `admin-screen-studio.devanta.net`.
- Worker: `screen-studio-api` at `https://screen-studio-api.ilyastorunn.workers.dev`.
- D1 database: `screen-studio-db`, bound as `DB`.
- R2 bucket: `screen-studio-assets`, bound as `ASSETS`.

Pages currently reports no Git provider. The local repository uses `origin = https://github.com/ilyastorunn/screen.studio.git`; deployment does not automatically push or commit working-tree changes.

## Production deployment order

When migrations, Worker code, and frontend code change together, use:

1. `npm run build` and `npm test`.
2. `npx --no-install wrangler d1 migrations list screen-studio-db --remote`.
3. `npx --no-install wrangler d1 migrations apply screen-studio-db --remote`.
4. `npx --no-install wrangler deploy`.
5. Rebuild if the frontend changed after verification.
6. `npx --no-install wrangler pages deploy dist --project-name screen-studio --branch main`.
7. Verify the custom domain, deployment URL, and `GET /api/apps`.

Do not put secret values in commands, logs, or wiki pages. The admin token is a Worker secret and the browser stores the user-entered value in `localStorage` under `screen-admin-token`.

## Last verified production rollout

On 2026-09-04:

- `0003_dot_pick.sql` was the only pending D1 migration and applied successfully.
- Worker version `f204ebfc-95b8-44b4-a514-0c43839b89e2` deployed successfully.
- Pages deployment `https://b804819b.screen-studio.pages.dev` completed and the custom domain served the matching production asset hashes.
- `https://niceapps.club` returned HTTP 200.
- `GET https://screen-studio-api.ilyastorunn.workers.dev/api/apps` returned HTTP 200.

## Operational gaps

- Pages deploy is manual; there is no committed CI/CD workflow.
- `wrangler.toml` configures the Worker but lacks `pages_build_output_dir`; Wrangler therefore ignores it for the explicit Pages deploy and uses the CLI project/directory arguments.
- Production secrets are intentionally not documented or inspected beyond successful authenticated resource configuration.
- No automated smoke test currently validates the deployed HTML asset hashes or API after each release.

## Evidence

- **Verified:** `package.json`, `vite.config.ts`, `wrangler.toml`, Git remote/branch inspection, Wrangler resource/deploy output, and HTTP checks on 2026-09-04.
