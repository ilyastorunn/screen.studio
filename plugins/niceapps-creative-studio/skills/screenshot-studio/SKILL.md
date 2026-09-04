---
name: screenshot-studio
description: Analyze an iOS app and plan an evidence-based App Store screenshot set using relevant niceapps.club references. Use for screenshot audits, creative direction, messaging, story sequencing, or preparing a new set for a published or unreleased app. Do not use for app icon design or keyword-ranking research.
---

# Screenshot Studio

Create a screenshot strategy that is specific to the product and grounded in visible evidence. Do not imitate a reference set or claim that aesthetic similarity proves conversion performance.

## Establish the app context

Support either entry path:

- For a published app, accept an App Store URL or Apple ID and use the catalog MCP import tool when available. Treat imported metadata as a starting point, not a complete product brief.
- For an unreleased app, inspect the material the user provides: product description, landing page, feature list, Figma export, onboarding copy, or raw in-app screenshots.

Before asking questions, extract what is already known. Ask only questions whose answers can materially change positioning, screen selection, copy, or visual direction. Prioritize unresolved facts about the target audience, core problem, differentiator, strongest features, launch market/language, and desired brand character.

Raw in-app images are required before producing final screenshot compositions. If the user has none, request them and stop at a useful brief or shot list. Do not attempt Simulator, Xcode, TestFlight, or physical-device capture in this version.

“Final” means directly uploadable to App Store Connect, not a contact sheet, mockup, or art-direction image. Before rendering, select an Apple-supported screenshot slot for the target device family and locale. Produce one opaque RGB PNG or JPEG per screenshot at that slot's exact pixel dimensions. Preserve supplied product UI pixel-for-pixel; generative models may create backgrounds or direction references but must not redraw, reinterpret, or replace the source UI in a final asset.

Record the normalized app brief using [references/app-brief.md](references/app-brief.md). Mark uncertain claims instead of filling gaps with invented product capabilities.

## Retrieve references

Use the niceapps catalog MCP when available:

1. Search by product language and category to establish product-adjacent candidates.
2. Search by desired character or communication terms to find visually or rhetorically adjacent candidates.
3. Inspect a small, explainable group rather than collecting a large moodboard.

Select references using three independent signals: product relevance, visual character, and communication pattern. Category is useful but never sufficient by itself. State the reason each chosen reference is relevant. If the catalog lacks a convincing match, disclose that limitation rather than forcing one.

## Build the screenshot story

Define one positioning statement and one primary audience before writing individual screens. Then create a sequence in which each screen has a distinct job. A typical set may cover the hook, primary workflow, outcome, differentiator, secondary capability, trust, and close, but adapt the sequence to the app rather than enforcing a fixed count.

For every proposed screen provide:

- communication job;
- headline and optional supporting copy;
- source in-app image or requested UI state;
- composition direction;
- evidence from the app brief;
- relevant reference pattern, if any.

Keep claims within demonstrated or user-confirmed product capabilities. Prefer user outcomes over a feature inventory. Maintain enough visual continuity to read as one campaign without repeating the same composition on every screen.

## Deliver in stages

Do not jump from a sparse brief directly to polished assets.

1. Confirm the normalized brief and selected references.
2. Present the screenshot narrative and copy.
3. Present two or three materially different visual directions when a direction has not already been chosen.
4. Use contact sheets only as optional direction/critique artifacts; never present them as the deliverable requested by a user who asked for final screenshots.
5. Produce final compositions only after raw screens exist, the direction is sufficiently determined, and a supported App Store Connect slot has been selected.
6. Export each frame separately, verify dimensions, format, color channels, file integrity, sequence naming, copy, and source-UI fidelity, then review the set with [references/quality-rubric.md](references/quality-rubric.md).

If no renderer is available, state that final delivery is blocked and provide the specification only as an intermediate artifact. Do not call the task complete or describe a generated mockup as ready. A final delivery must include the individual files, selected App Store slot, exact dimensions, ordered upload manifest, and verification evidence.
