import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const manifestPath = process.argv[2];
if (!manifestPath) throw new Error("Usage: node render-screenshot-set.mjs <manifest.json>");

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const manifestDir = path.dirname(path.resolve(manifestPath));
const outputDir = path.resolve(manifestDir, manifest.outputDir);
const { width, height } = manifest.canvas;

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function textBlock(lines, { x, y, size, lineHeight, fill, weight = 500, letterSpacing = 0 }) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="SF Pro Display, SF Pro Text, Helvetica Neue, Arial, sans-serif" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}">${lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`).join("")}</text>`;
}

function backgroundSvg(frame) {
  const [top, bottom, glow] = frame.palette;
  return Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0.78" y2="1">
        <stop offset="0" stop-color="${top}"/>
        <stop offset="0.62" stop-color="${bottom}"/>
        <stop offset="1" stop-color="#050607"/>
      </linearGradient>
      <radialGradient id="glow" cx="${frame.glowX ?? "78%"}" cy="${frame.glowY ?? "28%"}" r="62%">
        <stop offset="0" stop-color="${glow}" stop-opacity="0.72"/>
        <stop offset="0.48" stop-color="${glow}" stop-opacity="0.12"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="19"/><feColorMatrix type="saturate" values="0"/></filter>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#sky)"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
    <path d="M0 1810 L180 1500 L350 1710 L570 1300 L760 1650 L990 1190 L1290 1580 L1290 2796 L0 2796 Z" fill="#090c0e" opacity="0.68"/>
    <path d="M0 2120 L220 1840 L430 2040 L690 1720 L900 2010 L1110 1680 L1290 1910 L1290 2796 L0 2796 Z" fill="#050607" opacity="0.86"/>
    <rect y="2180" width="${width}" height="616" fill="#020303" opacity="0.62"/>
    <rect width="${width}" height="${height}" filter="url(#grain)" opacity="0.035"/>
  </svg>`);
}

function copySvg(frame) {
  const headline = textBlock(frame.headline, {
    x: frame.copy.x,
    y: frame.copy.y,
    size: frame.copy.headlineSize ?? 112,
    lineHeight: frame.copy.headlineLineHeight ?? 116,
    fill: "#f6f4ee",
    weight: 650,
    letterSpacing: -3,
  });
  const headlineHeight = (frame.headline.length - 1) * (frame.copy.headlineLineHeight ?? 116);
  const bodyY = frame.copy.bodyY ?? frame.copy.y + headlineHeight + 112;
  const body = frame.body?.length ? textBlock(frame.body, {
    x: frame.copy.x,
    y: bodyY,
    size: frame.copy.bodySize ?? 46,
    lineHeight: frame.copy.bodyLineHeight ?? 60,
    fill: "#c6c8c8",
    weight: 420,
  }) : "";
  return Buffer.from(`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${headline}${body}</svg>`);
}

function brandSvg(frame) {
  const anchor = frame.brandAlign === "right" ? "end" : "start";
  const x = frame.brandAlign === "right" ? width - 86 : 86;
  return Buffer.from(`<svg width="${width}" height="180" xmlns="http://www.w3.org/2000/svg">
    <text x="${x}" y="112" text-anchor="${anchor}" fill="#f2f0ea" font-family="SF Pro Display, Helvetica Neue, Arial, sans-serif" font-size="39" font-weight="650" letter-spacing="7">UNSCROLL</text>
  </svg>`);
}

async function roundedUi(frame) {
  if (!frame.source) return null;
  const sourcePath = path.resolve(manifestDir, frame.source);
  const metadata = await sharp(sourcePath).metadata();
  const uiWidth = frame.ui.width;
  const uiHeight = Math.round(uiWidth * metadata.height / metadata.width);
  const radius = frame.ui.radius ?? 66;
  const mask = Buffer.from(`<svg width="${uiWidth}" height="${uiHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="${uiWidth}" height="${uiHeight}" rx="${radius}" fill="#fff"/></svg>`);
  const image = await sharp(sourcePath)
    .resize({ width: uiWidth })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  const shadow = Buffer.from(`<svg width="${uiWidth + 80}" height="${uiHeight + 100}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="s" x="-40%" y="-30%" width="180%" height="180%"><feGaussianBlur stdDeviation="28"/></filter></defs><rect x="40" y="28" width="${uiWidth}" height="${uiHeight}" rx="${radius}" fill="#000" opacity="0.75" filter="url(#s)"/><rect x="39" y="1" width="${uiWidth + 2}" height="${uiHeight + 2}" rx="${radius + 1}" fill="none" stroke="#ddd8ca" stroke-opacity="0.34" stroke-width="3"/></svg>`);
  return { image, shadow, width: uiWidth, height: uiHeight };
}

function proofCardSvg(card) {
  if (!card) return null;
  return Buffer.from(`<svg width="${card.width}" height="${card.height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="${card.width - 6}" height="${card.height - 6}" rx="34" fill="#111416" fill-opacity="0.94" stroke="#d2b17a" stroke-opacity="0.52" stroke-width="3"/>
    ${textBlock(card.kicker ? [card.kicker] : [], { x: 42, y: 68, size: 28, lineHeight: 34, fill: "#c6b185", weight: 650, letterSpacing: 4 })}
    ${textBlock(card.value, { x: 42, y: card.valueY ?? 164, size: card.valueSize ?? 82, lineHeight: card.valueLineHeight ?? 88, fill: "#f4f0e8", weight: 650, letterSpacing: -2 })}
    ${textBlock(card.caption, { x: 42, y: card.captionY ?? card.height - 62, size: 29, lineHeight: 38, fill: "#aeb2b2", weight: 450 })}
  </svg>`);
}

await fs.mkdir(outputDir, { recursive: true });

for (const frame of manifest.frames) {
  const layers = [
    { input: backgroundSvg(frame), left: 0, top: 0 },
  ];
  const ui = await roundedUi(frame);
  if (ui) {
    layers.push({ input: ui.shadow, left: frame.ui.x - 40, top: frame.ui.y - 28 });
    layers.push({ input: ui.image, left: frame.ui.x, top: frame.ui.y });
  }
  const proofCard = proofCardSvg(frame.proofCard);
  if (proofCard) layers.push({ input: proofCard, left: frame.proofCard.x, top: frame.proofCard.y });
  layers.push({ input: copySvg(frame), left: 0, top: 0 });
  layers.push({ input: brandSvg(frame), left: 0, top: height - 190 });

  const outputPath = path.join(outputDir, frame.file);
  await sharp({ create: { width, height, channels: 3, background: "#050607" } })
    .composite(layers)
    .toColourspace("srgb")
    .removeAlpha()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);
  const result = await sharp(outputPath).metadata();
  if (result.width !== width || result.height !== height || result.channels !== 3 || result.format !== "png") {
    throw new Error(`Invalid output ${outputPath}: ${JSON.stringify(result)}`);
  }
  console.log(`${frame.file}: ${result.width}x${result.height}, ${result.space}, ${result.channels} channels`);
}

await fs.writeFile(path.join(outputDir, "upload-order.json"), `${JSON.stringify({
  slot: manifest.slot,
  locale: manifest.locale,
  width,
  height,
  files: manifest.frames.map((frame) => frame.file),
}, null, 2)}\n`);

const thumbWidth = 258;
const thumbHeight = 559;
const gap = 22;
const qaWidth = thumbWidth * 4 + gap * 5;
const qaHeight = thumbHeight * 2 + gap * 3;
const qaLayers = [];
for (const [index, frame] of manifest.frames.entries()) {
  const thumb = await sharp(path.join(outputDir, frame.file))
    .resize({ width: thumbWidth, height: thumbHeight, fit: "fill" })
    .png()
    .toBuffer();
  qaLayers.push({
    input: thumb,
    left: gap + (index % 4) * (thumbWidth + gap),
    top: gap + Math.floor(index / 4) * (thumbHeight + gap),
  });
}
await sharp({ create: { width: qaWidth, height: qaHeight, channels: 3, background: "#e9e7e1" } })
  .composite(qaLayers)
  .png({ compressionLevel: 9 })
  .toFile(path.join(outputDir, "qa-contact-sheet.png"));
