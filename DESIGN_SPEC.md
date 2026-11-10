# Design spec: "Bento, navy + electric blue"

Chosen by Lilo on 2026-10-20 from the round-3 mockups (`design-explorations/round-3/B2-bento-blues.html#navy`). It replaces direction C ("aerospace modern"), which is kept in git history and in `design-explorations/`.

Source of truth for the tokens is `src/styles/global.css`, in the `@theme` and `:root` / `[data-theme]` blocks. This file explains them. Keep the two in sync.

## Principles

1. **Tiles, not sections.** Content sits in rounded tiles on a near-black navy page. The home page is a Bento grid mixing the intro, the tsunami video, headline numbers, featured projects, "Now", tools, Flow Vis, coursework and contact. Project pages reuse the same tiles (header, TL;DR, read-outs, sidebar).
2. **Figures re-inked for dark.** In dark mode, figures and the tsunami video get `filter: invert(1) hue-rotate(180deg)` plus `mix-blend-mode: screen` (classes `.figure-ground` + `.reink`), so the white plot ground takes the tile colour and hues stay roughly the same. The lightbox and print always show the original colours. Re-inking is approximate; re-exporting figures with a dark style is the long-term fix. Exception: sequential colour-mapped media (for example a pressure-coefficient surface) set `keepInk` and stay on a light paper card in dark mode, because inverting lightness would reverse the colour scale.
3. **Dark-first, light-ready.** Dark is the default (also without JS). A two-state toggle switches dark ↔ light and remembers the choice in `localStorage`. An inline head script prevents a flash of the wrong theme.
4. **One accent.** Electric blue marks actions, the selected tab, highlighted numbers and the contact tile. Orange (`--viz-2`) appears only as a second data series.
5. **Numbers link to evidence.** Every headline number on the home page links to the section of the project page it comes from.
6. **Honest status colours.** PASS uses `--ok`, FAIL uses `--fail`. FAIL rows are never hidden.

## Colour

| Token                             | Dark                              | Light                             | Use                                                      |
| --------------------------------- | --------------------------------- | --------------------------------- | -------------------------------------------------------- |
| `--bg`                            | `#070B14`                         | `#F4F7FC`                         | page                                                     |
| `--bg-raised`                     | `#0A1020`                         | `#FFFFFF`                         | raised bands                                             |
| `--surface`                       | `#0D1424`                         | `#FFFFFF`                         | tiles                                                    |
| `--surface-2`                     | `#131C30`                         | `#EEF2F9`                         | chips, code, active nav pill                             |
| `--border`                        | `#1E2A42`                         | `#DBE3F0`                         | tile borders, hairlines                                  |
| `--border-strong`                 | `#2E3D5C`                         | `#C3CFE2`                         | plot zero lines, badges                                  |
| `--text`                          | `#EAF0FB`                         | `#0B1324`                         | body                                                     |
| `--text-muted`                    | `#93A0B8`                         | `#4A5873`                         | secondary text                                           |
| `--text-faint`                    | `#8A98B2`                         | `#5B6880`                         | mono labels, meta                                        |
| `--accent`                        | `#4C8DFF`                         | `#1F5FE0`                         | electric blue: primary actions, selected tab, highlights |
| `--accent-ink`                    | `#050A14`                         | `#FFFFFF`                         | text on accent                                           |
| `--flow`                          | `#8FB5FF`                         | `#1A55C4`                         | links, eyebrows, focus ring                              |
| `--viz-2` / `--viz-3` / `--viz-4` | `#FFB547` / `#4ADE9C` / `#C4A5FF` | `#C2410C` / `#12804A` / `#7B4FC4` | extra data series (pole map, 3D viewer)                  |
| `--ok` / `--warn` / `--fail`      | `#4ADE9C` / `#F5C451` / `#FF6B6B` | `#126C33` / `#8A5508` / `#B91C1C` | status                                                   |
| `--glow`                          | `#16295A`                         | `#DCE8FF`                         | radial glow on the intro and Flow Vis tiles              |
| `--paper`                         | `#FAFAF8`                         | `#FAFAF8`                         | figure ground in light mode and the lightbox             |

Every text colour above was checked with the WCAG 2 relative-luminance formula against `--bg`, `--bg-raised`, `--surface` and `--surface-2` in both themes. All pairs are ≥ 4.5 : 1. The lowest are light `--viz-2` on `--surface-2` (4.61) and light `--accent` on `--surface-2` (4.96). Text on the accent tile is 6.2 : 1 (dark) and 5.6 : 1 (light).

Interactive plots read their series colours from these tokens at draw time and redraw on `themechange`: text colour for the reference (Etkin), then accent, `--viz-2`, `--viz-3`, `--viz-4`. Markers also differ by shape, so the series don't rely on colour alone.

## Type

| Role                      | Family              | Weights |
| ------------------------- | ------------------- | ------- |
| Headings and text         | Geist Variable      | 400–600 |
| Mono (labels, data, code) | Geist Mono Variable | 400–500 |

Both are self-hosted through Fontsource and preloaded. Metric-matched fallbacks (`Geist Fallback` on Arial, `Geist Mono Fallback` on Courier New) keep the font swap from shifting layout. Headings use −0.03 em tracking (the hero −0.035 em). Mono labels are sentence case with +0.04 em tracking; nothing is uppercased, because uppercasing breaks Greek symbols (ζ → Z).

| Step   | Size                   | Use                         |
| ------ | ---------------------- | --------------------------- |
| xs     | 12 px                  | mono labels                 |
| sm     | 14 px                  | captions, meta, tile blurbs |
| base   | 16 → 17 px             | body                        |
| lg     | 20 px                  | lede                        |
| xl     | 25 px                  | h3, tile titles             |
| 2xl    | 31 px                  | h2                          |
| hero   | clamp(36 px, …, 56 px) | home h1                     |
| metric | clamp(32 px, …, 46 px) | big numbers in metric tiles |

## Layout, radius, shadow

- **Bento grid:** 4 columns from 1024 px, 2 columns from 640 px, rows `minmax(190px, auto)`, gap 14 px, `grid-auto-flow: dense` so the 2-column layout has no holes. Below 640 px everything is full width except the metric tiles, which sit two per row.
- **Tiles:** 22 px radius, 1 px border, 22 px padding (18 px on mobile). Linked tiles lift 2 px and turn the border accent on hover.
- **Header:** sticky, name on the left, nav as a pill group (active item on `--surface-2`), round theme and menu buttons.
- **Max width:** 1280 px for the layout, 72ch for prose.
- **Radius:** `--radius-sm` 8 px, `--radius` 14 px (read-outs, figures in prose), `--radius-lg` 22 px (tiles). Buttons, chips, badges and tabs are full pills.
- **Shadow:** dark uses none. Light uses `0 1px 2px rgb(11 19 36 / .05), 0 8px 24px rgb(11 19 36 / .06)` on tiles.

## Motion

Hovers 150–250 ms with `cubic-bezier(.2, .8, .2, 1)`. The only moving content is the tsunami video. It plays only while on screen, starts after the page has loaded, has a visible Play/Pause button, and never autoplays under `prefers-reduced-motion: reduce` (the poster shows instead). Reduced motion also disables tile lift and all transitions.

## Components

- **Project cards (Projects page):** tile with the re-inked thumbnail, the type badge over the figure, date, title, hook and tag chips.
- **Type badge:** mono pill on `--surface-2`. Personal = flow, Competition = accent, Team = text, Course = muted.
- **Tabs:** a pill segmented control; the selected tab is filled with the accent. Keyboard-operable (←/→/Home/End) and deep-linkable through `#overview`, `#technical`, `#results`, `#reflection` and `#code`. Sticky under the header.
- **Read-outs:** separate small tiles under the project header.
- **Figures:** numbered automatically ("Fig. 3"). Clicking opens a lightbox with the original colours.
- **Focus:** a 2 px `--flow` outline with a 2 px offset on every interactive element (accent-ink on the contact tile).
