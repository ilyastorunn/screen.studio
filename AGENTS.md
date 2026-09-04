# niceapps.club agent contract

This file applies to the entire repository. The project wiki in `docs/wiki/` is the durable memory shared by maintainers and AI agents; keeping it current is part of completing every task.

## Before making changes

1. Read `docs/wiki/index.md` and the newest entries in `docs/wiki/log.md`.
2. Read the wiki page that owns the area being changed. If no page owns it yet, inspect the implementation first and decide whether the subject deserves a dedicated page.
3. Verify important claims against current source, tests, configuration, or runtime behavior. Wiki prose is context, not a substitute for direct evidence.
4. When the wiki and implementation disagree, treat the mismatch as work to resolve or record; never silently assume either one is current.

## Wiki maintenance is mandatory

- Every completed code, UI, content-model, configuration, test, documentation, migration, or deployment change must be recorded in `docs/wiki/log.md`. Closely related edits from one task may share one entry, but no completed change may be omitted as “just mechanical.”
- Update the affected durable wiki pages in the same task. Describe the resulting current behavior, not the editing process.
- Remove or explicitly mark claims that the change made stale. Do not leave contradictory “current state” descriptions behind.
- A new durable site feature, subsystem, integration, brand/design system, operational workflow, or independently evolving product concept gets its own lowercase Markdown page in `docs/wiki/` when it will need repeated updates or independent links.
- Small refinements belong on the existing owner page; do not create one-file-per-tweak documentation.
- Whenever a page is created, renamed, or retired, update `docs/wiki/index.md`, its reading order, and all affected relative links.
- Record durable product or architecture choices, including rationale and date, in a dedicated decisions section/page once such decisions exist. Keep unresolved conflicts explicitly unresolved.

## Log format

Keep `docs/wiki/log.md` reverse chronological. Every entry must include:

- **Scope:** what changed and why.
- **Affected areas:** relevant source, configuration, migration, asset, and wiki paths.
- **Decisions:** durable choices made during the work; write `None` when the task made no durable decision.
- **Verification:** exact tests, builds, visual checks, runtime checks, or deployment evidence performed. State what was not verified.
- **Deployment:** production/staging result, URL or version when applicable; otherwise `Not deployed`.
- **Follow-up:** remaining work, risks, or `None`.

Use dates in `YYYY-MM-DD` format. Attribute owner decisions as decisions, and label evidence as `verified`, `documented`, `inferred`, `unresolved`, or `superseded` when that distinction matters.

## Completion gate

Before reporting a task complete:

1. Run verification proportional to the change. For application code, the default minimum is `npm run build` and `npm test`; add visual checks for UI work and production checks for deployments.
2. Update every affected wiki page and append the log entry.
3. Check wiki links and repo-relative paths touched by the task.
4. Report any unverified behavior, stale documentation, or unresolved decision to the user.

Do not rewrite user-authored source documents as a side effect of wiki maintenance. Preserve unrelated working-tree changes.
