# Screenshot experience

## Detail gallery

App detail screenshots are presented in a horizontally scrollable, keyboard-focusable rail. Cards share a responsive height and use `object-fit: contain`, so different source aspect ratios remain aligned without cropping the phone artwork. The rail uses scroll snap and smooth scrolling, plus named Previous/Next screenshot buttons disabled at their respective boundaries. Introductory copy states the screenshot count and explains the branded copy behavior before interaction; touch devices show the individual copy label without hover.

A progress line tracks the rail’s real `scrollLeft` range. Nico’s mark moves with the normalized progress value. Updates are throttled with `requestAnimationFrame`; a ResizeObserver updates progress and arrow boundaries when the rail or images resize. The observer and animation frame are cleaned up on unmount. Each app detail remounts on slug change to reset gallery state.

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
- `ClipboardItem` and `navigator.clipboard.write` are checked before image generation; unsupported browsers receive an error instead of starting unnecessary downloads. Copy actions keep their existing PNG/banner contract.
- Image loading preserves the app accent as an icon fallback when a remote icon cannot be fetched.

## Known limitations

- Export rendering is implemented in `src/main.tsx` rather than a separately tested module.
- On 2026-09-05, real-image single and combined PNG creation succeeded in Chrome with a clipboard test adapter (410,394 and 3,870,189 bytes). This validates generation and success feedback, not the system clipboard permission/write or exported banner visual fidelity. No committed browser regression suite exists.
- Remote images must be fetchable with CORS for canvas export.

## Evidence

- **Verified:** `loadBitmap`, `withExportBanner`, `screenshotAsPng`, `screenshotsAsOnePng`, `copyPng`, and `ScreenshotGallery` in `src/main.tsx`; gallery/copy rules in `src/styles.css`.
- **Observed during 2026-09-04 implementation:** aligned gallery cards and updated mascot pose were visually inspected locally; production page availability was verified after deployment.
