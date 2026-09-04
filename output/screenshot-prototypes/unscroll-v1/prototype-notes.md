# Unscroll screenshot prototype pass

Date: 2026-09-04

These images are art-direction contact sheets produced with the built-in image-generation model. They demonstrate the screenshot skill's proposed narrative, composition language, and iteration loop. They are not App Store-ready exports.

## Files

- `01-core-five-contact-sheet.png` — first pass for Shield, Focus, Hard Mode, Insights, and Journey. It establishes the product-first sanctuary direction, but repeats the headline-above-phone composition too often.
- `02-privacy-brand-contact-sheet.png` — privacy proof and brand close. The restrained dark report frame and warm phone-free closing frame create a strong ending.
- `03-core-five-varied-contact-sheet.png` — targeted second pass with threshold crops, UI breakouts, asymmetry, and a cool-to-warm sequence. This is the preferred art-direction reference.

## Prompt set

All three generations used Unscroll's approved raw device captures as image references and asked the built-in model to preserve the supplied UI rather than redesigning the app.

Core-five direction:

> Create a premium App Store screenshot campaign contact sheet for Unscroll in a “sanctuary, product first” direction. Tell a mechanism-first story across Shield, Focus setup, Hard Mode, Insights, and Journey. Use the supplied real app captures as the dominant product evidence; combine obsidian editorial fields, restrained misty landscape atmosphere, pearl typography, and mineral-blue accents. Keep every claim grounded in the supplied screens.

Targeted iteration:

> Preserve the same five-frame story and headlines, but remove the repeated straight-phone template. Give every frame a distinct communication job and silhouette: threshold crop for Shield, selected-app breakouts for Focus, an emphatic sixty-second state for Hard Mode, one enlarged data proof for Insights, and one milestone breakout for Journey. Build a coherent cool-to-warm rhythm without letting scenery overpower the UI.

Closing-pair direction:

> Create two coordinated closing frames: a precise privacy proof using the supplied seven-day Screen Time report, followed by a warm, phone-free sanctuary card carrying the promise “A pause, built in.” Keep the first product-led and the second intentionally emotional.

## Production boundary

Image generation can alter small UI details, text, icons, or proportions even when real screenshots are supplied. The concepts therefore cannot be shipped as truthful App Store assets. A production renderer must place the original captures pixel-for-pixel, render all copy deterministically, and export each frame separately at the required App Store dimensions. Generated elements may be used only as approved background or art-direction material.

## Proposed production flow

1. Normalize the published or unreleased app brief.
2. Retrieve and visually inspect relevant niceapps.club references.
3. Define the set narrative, evidence for each frame, and defensible copy.
4. Generate one or more low-cost contact-sheet directions.
5. Score the result for product understanding, narrative, copy, UI selection, visual coherence, and readiness; revise the weakest layer.
6. Rebuild the selected direction with exact source captures and deterministic typography/layout.
7. Export individual `1290 × 2796` PNGs and run storefront-size, safe-area, text, and claim QA.
