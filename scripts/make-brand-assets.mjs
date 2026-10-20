// Generates the favicon set and the default Open Graph image from SVG.
// Run: node scripts/make-brand-assets.mjs
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const bg = "#0a0d13";
const accent = "#ff8a4c";
const flow = "#6ccbff";

// Mark: a blunt body (circle) with a bow shock arc.
const mark = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="14" fill="${bg}"/>
  <path d="M22 8 Q8 32 22 56" fill="none" stroke="${accent}" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="40" cy="32" r="14" fill="none" stroke="${flow}" stroke-width="4"/>
</svg>`;

const og = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="${bg}"/>
  <g fill="none" stroke="${flow}" stroke-opacity=".45" stroke-width="2" stroke-dasharray="6 16">
    ${[-4, -3, -2, -1, 1, 2, 3, 4]
      .map((k) => {
        const y = 315 + k * 62;
        const s = Math.sign(k);
        return `<path d="M640 ${y} H${780 + Math.abs(k) * 8} C 840 ${y}, 880 ${315 + s * (150 + Math.abs(k) * 22)}, 960 ${315 + s * (150 + Math.abs(k) * 22)} S 1160 ${y + s * 30}, 1220 ${y + s * 40}"/>`;
      })
      .join("")}
  </g>
  <path d="M842 40 Q760 315 842 590" fill="none" stroke="${accent}" stroke-width="5"/>
  <circle cx="1000" cy="315" r="130" fill="#151b26" stroke="#354055" stroke-width="2"/>
  <text x="72" y="250" font-family="Segoe UI, Arial, sans-serif" font-size="74" font-weight="700" fill="#e8ecf3">Khalil Sidani</text>
  <text x="72" y="320" font-family="Segoe UI, Arial, sans-serif" font-size="34" fill="#a3adbd">Simulation tools for hypersonic flight</text>
  <text x="72" y="380" font-family="Consolas, monospace" font-size="24" fill="${flow}">CFD · HYPERSONICS · FLIGHT DYNAMICS · SSA</text>
  <text x="72" y="560" font-family="Consolas, monospace" font-size="22" fill="#7c879a">khsi4021.github.io</text>
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
