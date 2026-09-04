# Creative Studio plugin

## Product boundary

`niceapps-creative-studio` is the repository-owned Codex plugin for turning the niceapps.club catalog into evidence-based App Store creative workflows. The first vertical is screenshot strategy. App icon analysis/generation is the planned second vertical; metadata work remains outside the MVP except for copy context needed by screenshots.

The screenshot workflow supports both published and unreleased apps. A published app may start from an App Store URL or Apple ID. An unreleased app starts from user-provided product material. In either path the skill normalizes known facts first and asks only questions that can materially change the positioning, source-screen selection, copy, or visual direction.

Raw in-app screenshots are required for final compositions. Simulator, Xcode, TestFlight, and physical-device capture are explicitly outside the first version. When raw screens are absent, the skill may complete a brief, narrative, and requested shot list but must not claim to have rendered final assets.

When the user requests final output, the deliverable contract is direct App Store Connect usability: select a current Apple-supported device slot, export every frame separately at an accepted size, remove alpha, preserve real source UI, provide deterministic ordering, and visually inspect both full-resolution and storefront-scale output. Contact sheets are optional iteration/QA artifacts and never satisfy a final-output request.

## Plugin composition

The repository-local plugin lives at `plugins/niceapps-creative-studio/` and currently contains:

- `skills/screenshot-studio/` — app understanding, question selection, reference reasoning, narrative/copy, staged delivery, and a diagnostic quality rubric;
- `scripts/render-screenshot-set.mjs` — manifest-driven deterministic PNG composition and QA-sheet rendering with Sharp;
- `mcp-server/` — a local stdio MCP server that reads the existing public Worker API;
- `.mcp.json` — plugin-local server launch configuration;
- `evals/cases.json` — initial published, unreleased, missing-asset, and reference-gap behavioral cases.

The MCP exposes three read-only tools:

- `search_apps` searches normalized catalog text and an optional exact category;
- `get_app` returns one catalog entry and screenshot URLs by slug;
- `import_app_store` tries the existing Worker endpoint, then falls back to a direct public Apple lookup from the local MCP process when the Worker route fails.

Search results are reference candidates, not evidence of conversion performance. The current text/category scorer is intentionally small and is expected to evolve toward richer visual and communication metadata after real-app evaluation.

## Deferred capabilities

- Screenshot rendering is a local deterministic skill script, not an MCP capability or remote service.
- App icon retrieval, analysis, direction generation, and image generation are not yet implemented.
- Keyword popularity, difficulty, ranking, and full ASO analysis are not part of the current product promise.
- Local Simulator capture is deferred until the core app-understanding, retrieval, narrative, and render workflow proves useful.
- The plugin is repo-local and has not been added to a personal or team marketplace.

## Evaluation contract

Every realistic trial should diagnose product understanding, reference relevance, narrative, copy, UI selection, visual-system coherence, and readiness. Failures should be attached to the narrowest layer: missing context, retrieval, unsupported claims, narrative, source-screen selection, visual execution, or missing assets.

The committed evaluation cases are initial invariants rather than proof of quality. Real applications across materially different product types are required before the workflow can be considered validated.

## First real-app evaluation

The 2026-09-04 Unscroll trial is recorded in `plugins/niceapps-creative-studio/evals/results/unscroll-2026-09-04.md`. It completed published-app context gathering, local product-material inspection, catalog retrieval, visual reference selection, current-set diagnosis, and a replacement narrative without asking redundant questions.

The trial found that the live set's strongest differentiators—10-second Shield and 60-second Hard Mode—were buried in positions five and six behind generic outcome/progress framing. It recommended a mechanism-first sequence while preserving Unscroll's existing sanctuary identity.

A subsequent image-generation pass produced three art-direction contact sheets in `output/screenshot-prototypes/unscroll-v1/`. The first core pass proved the direction but repeated one phone composition; a targeted second pass introduced threshold crops, UI breakouts, asymmetry, and a cool-to-warm rhythm. A separate privacy/brand pair supplied the strongest closing sequence. These are concept evidence only: generative output may mutate source UI or text and is not a substitute for deterministic individual App Store exports. The production path must place approved captures pixel-for-pixel and render copy/layout separately.

After the product owner rejected contact sheets as an insufficient deliverable, the workflow gained a manifest-driven Sharp renderer and a hard final-output gate. The Unscroll trial now includes seven separate opaque sRGB PNGs at `1290 × 2796` in `output/screenshot-prototypes/unscroll-asc-v1/en-US/APP_IPHONE_67/`, with upload ordering and a reduced QA sheet. The real captures are composited directly; generated contact-sheet UI is not reused.

The same trial exposed a live integration failure: Apple returned 403 to the Worker import route while direct local lookup succeeded. `import_app_store` now falls back to a direct public Apple lookup from the local MCP process. The fallback is regression-tested and passed a live Unscroll import.

## Evidence

- **Verified 2026-09-04:** plugin manifest and MCP configuration validate; the screenshot skill passes the skill validator; four catalog/import unit tests pass; an SDK client listed all three tools; live `search_apps` and fallback `import_app_store` calls returned production results.
- **Verified 2026-09-04:** three Unscroll art-direction contact sheets were generated from approved raw captures and visually compared; the targeted revision corrected the first pass's repeated composition pattern.
- **Verified 2026-09-04:** Apple's current official screenshot specification accepts `1290 × 2796` as an iPhone 6.9-inch portrait size and rejects alpha. Seven ordered Unscroll outputs were rendered at that size as opaque sRGB PNGs, inspected as a reduced set, and spot-checked at full resolution.
- **Not verified:** installation through a marketplace, upload through the App Store Connect UI/API, other device slots/locales, icon workflow, or production deployment.
