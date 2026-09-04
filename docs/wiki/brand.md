# Brand system

## The Dot identity

The Dot is the site’s character system, not a decorative replacement for arbitrary letters in the wordmark. The header and favicon use a three-character club mark; larger poses are reserved for moments where a character has a product role.

## Characters and roles

- **Nico — discovery — `#F3FF19`:** appears in the hero garden, empty/discovery states, gallery progress, and the compact pointing pose in Next Discovery.
- **Poppy — picks — `#FF5A49`:** owns Poppy’s Pick and its featured-card peek pose.
- **Miso — exports — `#F4F1E8`:** marks the “Copy all” action and represents screenshot preparation.

Screenshot exports choose one of the three characters at random and render “{Name} made it for you!” between the app identity and `nice apps club` credit.

## Visual contract

Public UI uses semantic tokens scoped to `.public-shell`:

- Page `#080808`, surface `#101010`, raised surface `#151515`.
- Text `#F4F1E8`, muted `#969690`, faint `#62625E`, line `#2A2A28`.
- Dot yellow `#F3FF19`, coral accent/signal `#FF5A49`.
- Media radius: `14px`.

Inter is the display/body base and DM Mono is used for labels, metadata, search, and utility copy. The public theme is dark-only, but semantic variables are the required extension point for any future theme.

## Motion and accessibility

- Hero copy/media and collection cards enter with short CSS animations.
- Hero media scales subtly on hover; featured Poppy peeks upward; cards use small lift states.
- Smooth document scrolling and gallery scrolling are enabled only where appropriate.
- `prefers-reduced-motion: reduce` removes transitions, animations, and smooth scrolling without removing function.
- Decorative mascots use empty alt text; meaningful hero and Next Discovery poses have descriptive alt text.

## Asset inventory

- `public/favicon.svg` — three-character favicon.
- `public/brand/dot-club.svg` — header club mark.
- `public/brand/dot-mark.svg` — Nico mark.
- `public/brand/dot-peek.svg` — Nico peek.
- `public/brand/dot-stretch.svg` — compact Nico pointing pose.
- `public/brand/poppy-peek.svg` — Poppy’s Pick pose.
- `public/brand/miso-mark.svg` — Miso export mark.
- `public/brand/dot-garden.jpg` and `.png` — 4:3 hero artwork.
- `public/brand/og-image.png` — social sharing image.

Use SVG for compact UI marks and raster formats for the detailed garden/social scenes. Do not recolor a character into another role without updating this page and the associated product meaning.

## Evidence

- **Verified:** `src/main.tsx`, `.public-shell` rules in `src/styles.css`, `index.html`, and `public/brand/` inspected on 2026-09-04.
- **Documented owner decision:** the three named colors/roles and random export-banner character were approved on 2026-09-04.
