# Creative Studio plugin

## Product boundary

`niceapps-creative-studio` is the repository-owned Codex plugin for turning the niceapps.club catalog into evidence-based App Store creative workflows. The first vertical is screenshot strategy. App icon analysis/generation is the planned second vertical; metadata work remains outside the MVP except for copy context needed by screenshots.

The screenshot workflow supports both published and unreleased apps. A published app may start from an App Store URL or Apple ID. An unreleased app starts from user-provided product material. In either path the skill normalizes known facts first and asks only questions that can materially change the positioning, source-screen selection, copy, or visual direction.

Raw in-app screenshots are required for final compositions. Simulator, Xcode, TestFlight, and physical-device capture are explicitly outside the first version. When raw screens are absent, the skill may complete a brief, narrative, and requested shot list but must not claim to have rendered final assets.

## Plugin composition

The repository-local plugin lives at `plugins/niceapps-creative-studio/` and currently contains:

- `skills/screenshot-studio/` — app understanding, question selection, reference reasoning, narrative/copy, staged delivery, and a diagnostic quality rubric;
- `mcp-server/` — a local stdio MCP server that reads the existing public Worker API;
- `.mcp.json` — plugin-local server launch configuration;
- `evals/cases.json` — initial published, unreleased, missing-asset, and reference-gap behavioral cases.

The MCP exposes three read-only tools:

- `search_apps` searches normalized catalog text and an optional exact category;
- `get_app` returns one catalog entry and screenshot URLs by slug;
- `import_app_store` delegates public App Store lookup to the existing Worker endpoint.

Search results are reference candidates, not evidence of conversion performance. The current text/category scorer is intentionally small and is expected to evolve toward richer visual and communication metadata after real-app evaluation.

## Deferred capabilities

- Screenshot composition rendering and PNG export are not yet MCP capabilities.
- App icon retrieval, analysis, direction generation, and image generation are not yet implemented.
- Keyword popularity, difficulty, ranking, and full ASO analysis are not part of the current product promise.
- Local Simulator capture is deferred until the core app-understanding, retrieval, narrative, and render workflow proves useful.
- The plugin is repo-local and has not been added to a personal or team marketplace.

## Evaluation contract

Every realistic trial should diagnose product understanding, reference relevance, narrative, copy, UI selection, visual-system coherence, and readiness. Failures should be attached to the narrowest layer: missing context, retrieval, unsupported claims, narrative, source-screen selection, visual execution, or missing assets.

The committed evaluation cases are initial invariants rather than proof of quality. Real applications across materially different product types are required before the workflow can be considered validated.

## Evidence

- **Verified 2026-09-04:** plugin manifest and MCP configuration validate; the screenshot skill passes the skill validator; three catalog unit tests pass; an SDK client listed all three tools; a live `search_apps` call returned production catalog results.
- **Not verified:** installation through a marketplace, a full Codex invocation using the packaged skill and tools together, real-app output quality, renderer/export behavior, icon workflow, or production deployment.
