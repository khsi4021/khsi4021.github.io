// Generates the favicon set and the default Open Graph image from SVG.
// Run: node scripts/make-brand-assets.mjs
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

// Palette: the light theme tokens in src/styles/global.css (see DESIGN_SPEC.md).
const paper = "#faf9f6"; // --bg
const ink = "#16181d"; // --text
const muted = "#474c57"; // --text-muted
const rule = "#dcd8ce"; // --border
const blue = "#1b3f7a"; // --accent

// Text is rendered by the system's font stack when the PNG is made, so these
// name widely installed fonts close to the site's Source Serif / Source Sans.
const serif = "Georgia, 'Times New Roman', serif";
const sans = "'Segoe UI', Arial, Helvetica, sans-serif";

// Mark: a blunt body (circle) behind a bow shock (arc), white on deep blue.
const mark = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="8" fill="${blue}"/>
  <path d="M22 9 Q8 32 22 55" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
  <circle cx="40" cy="32" r="13" fill="none" stroke="#ffffff" stroke-width="4"/>
</svg>`;

// Open Graph card (1200 x 630): name, affiliation, a thin rule and the mark.
const og = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="${paper}"/>
  <rect x="80" y="78" width="1040" height="3" fill="${ink}"/>
  <text x="80" y="300" font-family="${serif}" font-size="92" fill="${ink}">Khalil Sidani</text>
  <rect x="80" y="348" width="640" height="1.5" fill="${rule}"/>
  <text x="80" y="408" font-family="${sans}" font-size="31" fill="${muted}">Aerospace Engineering Sciences,</text>
  <text x="80" y="450" font-family="${sans}" font-size="31" fill="${muted}">University of Colorado Boulder</text>
  <g fill="none" stroke="${blue}" stroke-linecap="round">
    <path d="M905 170 Q800 315 905 460" stroke-width="9"/>
    <circle cx="1010" cy="315" r="92" stroke-width="7"/>
  </g>
  <rect x="80" y="551" width="1040" height="1.5" fill="${rule}"/>
</svg>`;

await mkdir("public", { recursive: true });
await mkdir("src/assets", { recursive: true });
await writeFile("public/favicon.svg", mark(64).trim() + "\n");
await sharp(Buffer.from(mark(32)))
  .png()
  .toFile("public/favicon-32.png");
await sharp(Buffer.from(mark(180)))
  .png()
  .toFile("public/apple-touch-icon.png");
await sharp(Buffer.from(og)).png().toFile("src/assets/og-default.png");
console.log("brand assets written");
