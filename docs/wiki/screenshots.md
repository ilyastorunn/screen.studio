# Screenshot experience

## Detail gallery

App detail screenshots are presented in a horizontally scrollable, keyboard-focusable rail. Cards share a responsive height and use `object-fit: contain`, so different source aspect ratios remain aligned without cropping the phone artwork. The rail uses scroll snap and smooth scrolling.

A progress line tracks the rail’s real `scrollLeft` range. Nico’s mark moves with the normalized progress value. Updates are throttled with `requestAnimationFrame`.

## Clipboard actions

Clicking an individual screenshot prepares a PNG and writes it through the browser Clipboard API. “Copy all” downloads all screenshots, normalizes them to one height, places them in a horizontal strip, and copies a single PNG.

Both outputs add an off-white nice apps club banner:

- app icon and shortened app name on the left;
- a random Nico, Poppy, or Miso with “{Name} made it for you!” in the center;
- `nice apps club` on the right.

The banner is based on source height rather than combined width and is clamped to `84–140px`, preventing a wide multi-shot export from creating an oversized footer. Combined output is capped at `14,000px` wide and `1,200px` screenshot height, with proportional widths, `18px` outer padding, and `12px` gaps.

## Failure and feedback states

- Per-shot buttons show copying/copied status.
- “Copy all” shows combining/copied status.
- Clipboard or fetch failures surface an accessible alert.
- `ClipboardItem` and `navigator.clipboard.write` are required; unsupported browsers receive an error instead of a silent failure.
- Image loading preserves the app accent as an icon fallback when a remote icon cannot be fetched.

## Known limitations

- Export rendering is implemented in `src/main.tsx` rather than a separately tested module.
- Clipboard results and banner collision behavior are not covered by automated browser tests.
- Remote images must be fetchable with CORS for canvas export.

## Evidence

- **Verified:** `loadBitmap`, `withExportBanner`, `screenshotAsPng`, `screenshotsAsOnePng`, `copyPng`, and `ScreenshotGallery` in `src/main.tsx`; gallery/copy rules in `src/styles.css`.
- **Observed during 2026-09-04 implementation:** aligned gallery cards and updated mascot pose were visually inspected locally; production page availability was verified after deployment.
