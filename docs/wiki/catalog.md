# Catalog and discovery

## Header search

Search is global and context-preserving. Focusing the input does not navigate. Typing opens a header popover with up to eight name matches; choosing a result opens its detail route and clears the query. `⌘K`/`Ctrl+K` focuses the field and Escape clears/blurs it.

Search currently matches app names only. It does not replace the home collection or move the user back to the home route. Category filtering remains inside the home collection.

## Home collection

Categories are derived from the loaded catalog and filtered client-side. The collection uses a 12-column desktop grid:

- Poppy’s Pick spans eight columns.
- One standard card spans the remaining four columns in the featured row.
- Subsequent standard cards span four columns each, producing three equal columns.
- The layout becomes two columns at `1100px`, then one column at `520px`.

Every standard screenshot strip uses the same `25 / 18` media ratio, takes the first three screenshots, and aligns metadata consistently. The featured app is removed from the standard-card list so it is not duplicated.

## Poppy’s Pick

`selectDotPick` returns the explicit `is_dot_pick` row or falls back to the first/newest catalog item. The featured treatment is shown only when that app is part of the current collection filter. The database partial unique index and Worker write batch enforce one explicit pick.

The admin exposes “Set as Poppy’s Pick.” Internal names such as `DotPickCard`, `selectDotPick`, and `is_dot_pick` are retained and should not be interpreted as public copy.

## Next discovery

Detail pages use catalog order to select the next app and wrap from the final item back to the first. A one-item catalog has no Next Discovery section. Nico owns this discovery moment.

## Loading and fallback behavior

The app starts with three local fallback entries. A successful non-empty API response replaces them. API failure or an empty response leaves the fallback visible. Empty collection results use a branded state rather than a blank grid.

## Verification coverage

`worker/catalog.test.ts` covers:

- explicit pick selection and newest-item fallback;
- trimmed, case-insensitive name search with category filtering;
- next-discovery wrapping and one-item behavior.

There is no browser-level test for popover keyboard behavior, layout breakpoints, or live filter animation.

## Evidence

- **Verified:** `src/catalog.ts`, `Header`, `Collection`, `DotPickCard`, `ScreenshotStrip`, and `NextDiscovery` in `src/main.tsx`; collection/search responsive rules in `src/styles.css`; `worker/catalog.test.ts`.
