# Brand system

## The Dot identity

The Dot is the site’s character system, not a decorative replacement for arbitrary letters in the wordmark. The header and favicon use a three-character club mark; larger poses are reserved for moments where a character has a product role.

When all three characters appear together, their preferred composition follows the club mark: Poppy and Nico form the lower outer shapes while the taller Miso anchors the middle. The group should read as one clustered silhouette rather than three evenly spaced character cards.

## Characters and roles

- **Nico — discovery — `#F3FF19`:** appears in the hero character stage, empty/discovery states, gallery progress, and the compact pointing pose in Next Discovery.
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

- Hero copy/character stage and collection cards enter with short CSS animations.
- The hero trio use distinct, role-shaped hover/focus gestures: Nico leans to look, Poppy squashes and hops, and Miso sways. Featured Poppy peeks upward and app cards use small lift states.
- Smooth document scrolling and gallery scrolling are enabled only where appropriate.
- `prefers-reduced-motion: reduce` removes transitions, animations, and smooth scrolling without removing function.
- Decorative mascot artwork uses empty alt text; the keyboard-focusable hero introductions and meaningful Next Discovery pose carry accessible names.

## Asset inventory

- `public/favicon.svg` — three-character favicon.
- `public/brand/dot-club.svg` — header club mark.
- `public/brand/dot-mark.svg` — Nico mark.
- `public/brand/poppy-mark.svg` — Poppy mark.
- `public/brand/dot-peek.svg` — Nico peek.
- `public/brand/dot-stretch.svg` — compact Nico pointing pose.
- `public/brand/poppy-peek.svg` — Poppy’s Pick pose.
- `public/brand/miso-mark.svg` — Miso export mark.
- `public/brand/dot-garden.jpg` and `.png` — retained 4:3 campaign artwork; not used by the current live hero.
- `public/brand/og-image.png` — social sharing image.

Use SVG for compact UI marks and raster formats for detailed campaign/social scenes. Do not recolor a character into another role without updating this page and the associated product meaning.

## Evidence

- **Verified:** `src/main.tsx`, `.public-shell` rules in `src/styles.css`, `index.html`, and `public/brand/` inspected on 2026-09-04.
- **Documented owner decision:** the three named colors/roles and random export-banner character were approved on 2026-09-04.
