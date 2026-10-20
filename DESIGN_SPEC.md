# Design spec: direction C, "aerospace modern"

Source of truth for the tokens is `src/styles/global.css`, in the `@theme` and `:root` / `[data-theme]` blocks. This file explains them. Keep the two in sync.

## Principles

1. **Figures and equations come first.** Every figure sits on a light "paper" card (`--paper`) in both themes, because the source plots were drawn for a light background. Body text is 16–17 px, and equations are rendered with KaTeX at 1.1 em.
2. **Dark-first, light-ready.** Dark is the default (also without JS). A two-state toggle switches dark ↔ light and remembers the choice in `localStorage`. An inline head script prevents a flash of the wrong theme.
3. **One motif.** A bow shock and streamlines around a blunt body. This is the geometry of the lead project, so it isn't decoration for its own sake. It appears in the hero and as a faint divider. Nothing else animates by default.
4. **Instrument read-outs.** Key numbers are shown as mono read-outs ("−1.45 % Fay–Riddell"). Each one links to its source on the project page.
5. **Honest status colours.** PASS uses `--ok`, FAIL uses `--fail`, info uses `--muted`. FAIL rows are never hidden.

## Colour

| Token | Dark | Light | Use | Contrast on `--bg` / `--surface` (dark; light) |
|---|---|---|---|---|
| `--bg` | `#0A0D13` | `#F6F5F1` | page | |
| `--bg-raised` | `#10151E` | `#FFFFFF` | header and footer bands | |
| `--surface` | `#151B26` | `#FFFFFF` | cards, panels | |
| `--surface-2` | `#1B2230` | `#EFEDE7` | code, chips, table stripes | |
| `--border` | `#252E3E` | `#DDD9CF` | hairlines | |
| `--border-strong` | `#354055` | `#C3BDB0` | hover, focus-adjacent | |
| `--text` | `#E8ECF3` | `#10141C` | body | 16.4 / 14.6; 16.9 / 18.4 |
| `--text-muted` | `#A3ADBD` | `#4B5464` | secondary text | 8.6 / 7.6; 7.0 / 7.6 |
| `--text-faint` | `#8290A3` | `#646C7A` | meta, captions ≥ 12 px | 6.0 / 5.3 (4.9 on `--surface-2`); 4.9 / 5.3 (4.5 on `--surface-2`) |
| `--accent` | `#FF8A4C` | `#B93C0B` | "heat": primary actions, highlights | 8.3 / 7.4; 5.2 / 5.6 (4.8 on `--surface-2`) |
| `--flow` | `#6CCBFF` | `#0369A1` | "flow": links, eyebrows, tags | 10.8 / 9.6; 5.4 / 5.9 |
| `--ok` | `#4ADE9C` | `#15803D` | PASS | 11.3 / 10.0; 4.6 / 5.0 |
| `--fail` | `#FF6B6B` | `#B91C1C` | FAIL | 7.0 / 6.2; 5.9 / 6.5 |
| `--paper` | `#FAFAF8` | `#FAFAF8` | figure backgrounds | |

Ratios were computed with the WCAG 2 relative-luminance formula. Every pair meets AA (≥ 4.5 : 1) for normal text. Primary buttons are 8.3 : 1 (dark) and 5.7 : 1 (light). Faint text and the light accent were darkened after a Lighthouse check found 4.39 : 1 on `--surface-2`.

The figure palette is colorblind-safe and shared with the existing project plots:
- blue `#2B7BD6`
- orange `#E8673A`
- green `#16A37B`
- purple `#7B4FC4`
- near-black `#1A1A1A`

Interactive plots (Observable Plot) use the same colours.

## Type

| Role | Family | Weights |
|---|---|---|
| Display (h1–h3, read-outs) | Space Grotesk Variable | 500–600 |
| Text | Inter Variable | 400–600 |
| Mono (labels, data, code) | JetBrains Mono Variable | 400–500 |

All fonts are self-hosted through Fontsource. The scale is a fluid ~1.25 ratio:

| Step | Size | Use |
|---|---|---|
| xs | 12 px | mono labels |
| sm | 14 px | captions, meta |
| base | 16 → 17 px | body |
| lg | 20 px | lede |
| xl | 25 px | h3 |
| 2xl | 31 px | h2 |
| 3xl | 39 px | page h1 |
| 4xl | clamp(38 px, 6vw, 68 px) | hero |

Line height is 1.65 for body text and 1.05–1.2 for display. Prose width is capped at 72ch.

## Space, radius, shadow

- **Spacing:** 4 px base (Tailwind default scale). Section rhythm is 64–96 px on desktop and 48 px on mobile. Page gutter is 16 px on mobile and 24 px from 768 px.
- **Max width:** 1200 px for the layout, 72ch for prose.
- **Radius:** `--radius-sm` 6 px (chips, inputs), `--radius` 10 px (buttons, read-outs), `--radius-lg` 14 px (cards, figures).
- **Shadow:** dark uses none (borders do the work). Light uses `0 1px 2px rgb(16 20 28 / .06), 0 4px 16px rgb(16 20 28 / .05)` on cards.

## Motion

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 150 ms | hovers |
| `--dur` | 250 ms | tab switches, card lift |
| `--dur-slow` | 400 ms | lightbox |
| `--ease` | `cubic-bezier(.2, .8, .2, 1)` | everything |

The hero streamlines drift with a slow dash animation (3.2 s loop). Under `prefers-reduced-motion: reduce`, every animation and transition is disabled, and videos show their poster without autoplay.

## Components

- **Cards:** 1 px border; they lift 2 px on hover. The thumbnail sits on paper.
- **Type badge:** mono, uppercase. Colours: Personal = flow, Competition = accent, Team = muted, Course = faint.
- **Tabs:** an underline indicator in `--accent`. The tablist is keyboard-operable (←/→/Home/End) and deep-linkable through `#overview`, `#technical`, `#results`, `#reflection` and `#code`.
- **Figures:** numbered automatically ("Fig. 3"). Captions are mono-labelled, and clicking a figure opens a lightbox.
- **Focus:** a 2 px `--flow` outline with a 2 px offset on every interactive element.
