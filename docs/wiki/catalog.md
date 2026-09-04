# Catalog and discovery

## Header search

Search is global and context-preserving. Focusing the input does not navigate. Typing opens a header popover with up to eight name matches; choosing a result opens its detail route and clears the query. `⌘K`/`Ctrl+K` focuses the field. Up/Down selects a result and Enter opens it; Escape dismisses the popover while retaining the query. Clear resets the query. Outside pointer interaction and focus leaving the header dismiss results. A combobox/listbox relationship exposes the selected result to assistive technology. The result count reports the actual total, with “Showing 8 of N” when limited.

Search matches app names and categories, with trimmed, case-insensitive matching. It does not replace the home collection or move the user back to the home route. Category filtering remains inside the home collection.

## Home collection

Categories are derived from the loaded catalog and filtered client-side. The heading names the selected category and the count is a polite live status. Filter buttons have 44px minimum targets; desktop categories wrap and mobile categories scroll horizontally with a visible scrollbar. The `#apps` link mounts the collection and scrolls it below the sticky header, including when used from a detail page. The collection uses a 12-column desktop grid:

- Poppy’s Pick spans eight columns.
- One standard card spans the remaining four columns in the featured row.
- Subsequent standard cards span four columns each, producing three equal columns.
- The layout becomes two columns at `1100px`, then one column at `520px`.

Every standard screenshot strip uses the same `25 / 18` media ratio, takes the first three screenshots, and contains each complete source image without cropping. Card names may wrap to two lines; category text is 12px. The featured copy is more compact on mobile. The featured app is removed from the standard-card list so it is not duplicated.

## Poppy’s Pick

`selectDotPick` returns the explicit `is_dot_pick` row or falls back to the first/newest catalog item. The featured treatment is shown only when that app is part of the current collection filter. The database partial unique index and Worker write batch enforce one explicit pick.

The admin exposes “Set as Poppy’s Pick.” Internal names such as `DotPickCard`, `selectDotPick`, and `is_dot_pick` are retained and should not be interpreted as public copy.

## Next discovery

Detail pages use catalog order to select the next app and wrap from the final item back to the first. A one-item catalog has no Next Discovery section. Nico owns this discovery moment.

## Loading and fallback behavior

The app starts with an empty catalog and a skeleton loading state. A successful API response, including an empty array, becomes the current catalog. Requests time out after 15 seconds. Failure displays a connection message and Retry action; no fictional sample apps are substituted. A successful empty response has its own editorial empty state. Missing detail routes show a dedicated loading, error/retry, or not-found state instead of silently displaying the home page.

## Verification coverage

`worker/catalog.test.ts` covers:

- explicit pick selection and newest-item fallback;
- trimmed, case-insensitive name/category search with category filtering;
- next-discovery wrapping and one-item behavior.

Manual Playwright/Chrome checks on 2026-09-05 exercised keyboard search, category filters, collection return, API error → retry → empty, unknown routes, and 320/390/768/1024/1440px layouts. No committed browser regression suite exists.

## Evidence

- **Verified:** `src/catalog.ts`, `Header`, `Collection`, `DotPickCard`, `ScreenshotStrip`, and `NextDiscovery` in `src/main.tsx`; collection/search responsive rules in `src/styles.css`; `worker/catalog.test.ts`.
