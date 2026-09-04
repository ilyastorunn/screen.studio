# Product

## Promise

nice apps club is a hand-picked collection of apps worth opening. Its public language is intentionally editorial and quiet: “Find something nice.” and “Curated apps. No noise.” The site emphasizes visual App Store material, clear discovery, and lightweight paths to the app’s website or App Store listing.

## Audience

- People looking for thoughtfully designed apps.
- Designers and developers studying App Store screenshot presentation.
- App makers who want to suggest an app through the public GitHub issue template.
- The project owner, who curates production content through the Cloudflare admin.

## Current public surfaces

- A dark-only home page with an editorial three-mascot hero, a reserved MCP/Skill integration teaser, global search, category filters, Poppy’s Pick, a responsive app grid, and shared footer.
- App detail pages with icon, title, developer/category metadata, links, screenshot gallery, expandable description, and circular next discovery.
- Per-screenshot and combined screenshot copy actions that add a nice apps club credit banner.
- GitHub-based community suggestions; submitted apps are not automatically promoted to Poppy’s Pick.

## Scope boundaries

- The public site is curated rather than an account-based marketplace; there is no public login, rating, or user collection system.
- Public v1 has no light-theme toggle.
- The admin is an operational content tool and is not required to share the public visual identity.
- App content is sourced from D1, with App Store import and manual review in the admin.

## Product language

- Product/site name: `nice apps club` in UI copy; canonical domain: `niceapps.club`.
- Featured selection: `Poppy’s Pick` in public and admin UI. Internal code/database names retain `DotPick` and `is_dot_pick` for compatibility.
- Mascot family: Nico, Poppy, and Miso; see [Brand system](brand.md).

## Evidence

- **Verified:** public and admin copy in `src/main.tsx`, contribution flow in `CONTRIBUTING.md` and `.github/ISSUE_TEMPLATE/app-request.yml`, metadata in `index.html`.
- **Documented owner decisions:** dark public v1, The Dot identity, mascot roles, and editorial copy were approved during the 2026-09-03/04 design review.
