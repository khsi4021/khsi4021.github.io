// Generates the favicon set and the default Open Graph image from SVG.
// Run: node scripts/make-brand-assets.mjs
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

// Palette: "Bento, navy + electric blue" (DESIGN_SPEC.md).
const bg = "#070b14";
const tile = "#0d1424";
const line = "#1e2a42";
const glow = "#16295a";
const accent = "#4c8dff";
const flow = "#8fb5ff";
const ink = "#eaf0fb";
const muted = "#93a0b8";

// Mark: a blunt body (circle) with a bow shock arc.
const mark = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="16" fill="${bg}"/>
  <path d="M22 8 Q8 32 22 56" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="40" cy="32" r="14" fill="none" stroke="${flow}" stroke-width="4"/>
</svg>`;

// Open Graph card: two Bento tiles on the page background.
const og = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="g" cx="0" cy="0" r="1.2">
      <stop offset="0" stop-color="${glow}"/>
      <stop offset=".62" stop-color="${tile}"/>
    </radialGradient>
    <clipPath id="c"><rect x="792" y="36" width="372" height="558" rx="34"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="${bg}"/>
  <rect x="36" y="36" width="738" height="558" rx="34" fill="url(#g)" stroke="${line}" stroke-width="2"/>
  <text x="84" y="104" font-family="Consolas, monospace" font-size="22" fill="${muted}">Aerospace Engineering Sciences · CU Boulder</text>
  <text x="84" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="68" font-weight="600" letter-spacing="-2" fill="${ink}">Simulation tools for</text>
  <text x="84" y="378" font-family="Segoe UI, Arial, sans-serif" font-size="68" font-weight="600" letter-spacing="-2" fill="${ink}"><tspan fill="${accent}">hypersonic</tspan> flight.</text>
  <text x="84" y="530" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="600" fill="${ink}">Khalil Sidani</text>
  <text x="84" y="566" font-family="Consolas, monospace" font-size="20" fill="${muted}">khsi4021.github.io</text>
  <rect x="792" y="36" width="372" height="558" rx="34" fill="${tile}" stroke="${line}" stroke-width="2"/>
  <g clip-path="url(#c)">
    <g fill="none" stroke="${flow}" stroke-opacity=".5" stroke-width="2" stroke-dasharray="6 14">
      ${[-4, -3, -2, -1, 1, 2, 3, 4]
        .map((k) => {
          const y = 315 + k * 58;
          const s = Math.sign(k);
          const d = 130 + Math.abs(k) * 20;
          return `<path d="M780 ${y} H${880 + Math.abs(k) * 6} C 920 ${y}, 950 ${315 + s * d}, 1010 ${315 + s * d} S 1150 ${y + s * 28}, 1200 ${y + s * 36}"/>`;
        })
        .join("")}
    </g>
    <path d="M940 70 Q872 315 940 560" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="1060" cy="315" r="104" fill="${bg}" stroke="${line}" stroke-width="2"/>
  </g>
</svg>`;

await mkdir("public", { recursive: true });
await mkdir("src/assets", { recursive: true });
await writeFile("public/favicon.svg", mark(64).trim());
await sharp(Buffer.from(mark(32)))
  .png()
  .toFile("public/favicon-32.png");
await sharp(Buffer.from(mark(180)))
  .png()
  .toFile("public/apple-touch-icon.png");
await sharp(Buffer.from(og)).png().toFile("src/assets/og-default.png");
console.log("brand assets written");
