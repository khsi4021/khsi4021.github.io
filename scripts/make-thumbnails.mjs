// Schematic thumbnails for projects that have no result figure in the
// source folders. These are labelled "schematic" on the image and in alt text.
// Run: node scripts/make-thumbnails.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const W = 1600,
  H = 1000;
const paper = "#FAFAF8",
  ink = "#1A1A1A",
  muted = "#6B6B6B",
  grid = "#E2E2DE";
const blue = "#2B7BD6",
  orange = "#E8673A",
  green = "#16A37B";

const frame = (body, label) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${paper}"/>
  <g stroke="${grid}" stroke-width="2">
    ${Array.from({ length: 15 }, (_, i) => `<line x1="${(i + 1) * 100}" y1="0" x2="${(i + 1) * 100}" y2="${H}"/>`).join("")}
    ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${(i + 1) * 100}" x2="${W}" y2="${(i + 1) * 100}"/>`).join("")}
  </g>
  ${body}
  <text x="60" y="${H - 50}" font-family="Consolas, monospace" font-size="34" fill="${muted}">${label}</text>
</svg>`;

const tcas = frame(
  `
  <path d="M120 820 L1480 180" stroke="${blue}" stroke-width="10" fill="none" stroke-dasharray="0"/>
  <path d="M140 160 L1460 760" stroke="${orange}" stroke-width="10" fill="none"/>
  <g fill="${blue}">${[0.15, 0.3, 0.45].map((t) => `<circle cx="${120 + 1360 * t}" cy="${820 - 640 * t}" r="16"/>`).join("")}</g>
  <g fill="${orange}">${[0.15, 0.3, 0.45].map((t) => `<circle cx="${140 + 1320 * t}" cy="${160 + 600 * t}" r="16"/>`).join("")}</g>
  <line x1="830" y1="486" x2="808" y2="527" stroke="${ink}" stroke-width="5"/>
  <circle cx="820" cy="505" r="70" fill="none" stroke="${green}" stroke-width="6" stroke-dasharray="14 10"/>
  <text x="910" y="470" font-family="Segoe UI, Arial" font-size="44" fill="${ink}">closest approach</text>
  <text x="120" y="120" font-family="Segoe UI, Arial" font-size="48" font-weight="700" fill="${ink}">Two tracks, fitted and extrapolated</text>`,
  "schematic · TCAS closest-approach geometry",
);

const asen2804 = frame(
  `
  <path d="M140 860 C 260 560, 360 330, 520 250 S 900 260, 1460 760" stroke="${blue}" stroke-width="10" fill="none"/>
  <path d="M140 860 C 260 560, 360 330, 520 250" stroke="${orange}" stroke-width="14" fill="none"/>
  <circle cx="520" cy="250" r="16" fill="${ink}"/>
  <text x="560" y="230" font-family="Segoe UI, Arial" font-size="40" fill="${ink}">apogee: glide begins</text>
  <text x="170" y="600" font-family="Segoe UI, Arial" font-size="40" fill="${orange}">boost</text>
  <text x="1080" y="470" font-family="Segoe UI, Arial" font-size="40" fill="${blue}">glide</text>
  <line x1="100" y1="860" x2="1500" y2="860" stroke="${ink}" stroke-width="4"/>
  <text x="120" y="120" font-family="Segoe UI, Arial" font-size="48" font-weight="700" fill="${ink}">Boost-ascent, glide-descent vehicle model</text>`,
  "schematic · ASEN 2804 flight phases",
);

const term = (title, lines, label) =>
  frame(
    `
  <rect x="160" y="140" width="1280" height="700" rx="24" fill="#151B26"/>
  <circle cx="220" cy="190" r="12" fill="${orange}"/><circle cx="260" cy="190" r="12" fill="#F5C451"/><circle cx="300" cy="190" r="12" fill="${green}"/>
  <text x="360" y="200" font-family="Consolas, monospace" font-size="30" fill="#A3ADBD">${title}</text>
  ${lines
    .map(
      (l, i) =>
        `<text x="220" y="${290 + i * 66}" font-family="Consolas, monospace" font-size="40" fill="${l.c ?? "#E8ECF3"}">${l.t}</text>`,
    )
    .join("")}`,
    label,
  );

const rpg = term(
  "entity.txt  (game content is data-driven)",
  [
    { t: "$ g++ -std=c++17 Entity.cpp Game.cpp Map.cpp -o proj2", c: "#A3ADBD" },
    { t: "name|type|hp|stamina|defense|...|gold", c: "#6CCBFF" },
    { t: "Sirens|I|30|100|25|...|25" },
    { t: "Giants|I|22|75|50|...|35" },
    { t: "Cyclops|E|56|75|75|...|100", c: "#FF8A4C" },
    { t: "Entity / Map / Game classes load these at start", c: "#4ADE9C" },
  ],
  "schematic · C++ text RPG (rows from entity.txt)",
);
const candy = term(
  "riddles.txt",
  [
    { t: "$ g++ Board.cpp games.cpp MainGame.cpp player.cpp -o proj2", c: "#A3ADBD" },
    { t: "■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■", c: "#FF8A4C" },
    { t: "I have cities, but no houses. I have", c: "#6CCBFF" },
    { t: "mountains, but no trees. I have water,", c: "#6CCBFF" },
    { t: "but no fish. What am I?   |map", c: "#6CCBFF" },
    { t: "Board, Player and mini-game classes", c: "#4ADE9C" },
  ],
  "schematic · C++ Candy Land game (riddle from riddles.txt)",
);

await mkdir("src/assets/projects/tcas", { recursive: true });
await mkdir("src/assets/projects/asen2804", { recursive: true });
await mkdir("src/assets/projects/cpp", { recursive: true });
await sharp(Buffer.from(tcas)).png().toFile("src/assets/projects/tcas/schematic.png");
await sharp(Buffer.from(asen2804)).png().toFile("src/assets/projects/asen2804/schematic.png");
await sharp(Buffer.from(rpg)).png().toFile("src/assets/projects/cpp/rpg.png");
await sharp(Buffer.from(candy)).png().toFile("src/assets/projects/cpp/candy.png");
console.log("thumbnails written");
