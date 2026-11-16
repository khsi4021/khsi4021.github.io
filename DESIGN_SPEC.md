# Design spec: academic, light by default

The site reads like a research group page or a typeset preprint: a warm-white page, black serif text, one deep blue for links and the current state, hairline rules instead of boxes, numbered sections with their labels in a left margin column, and figures on white plates with numbered captions. Nothing floats, glows, lifts or is pill-shaped.

Source of truth for the tokens is `src/styles/global.css`, in the `:root` / `[data-theme]` blocks and the `@theme` blocks. This file explains them. Keep the two in sync.

## Principles

1. **Text-led.** Pages are reading pages. Structure comes from rules, numbering and type, not from tiles or colour bands.
2. **Light by default, dark on request.** `<html data-theme="light">` is the default, also without JS. A two-state toggle switches light ↔ dark and remembers the choice in `localStorage`. An inline head script applies it before first paint. The operating system's colour-scheme preference is not followed automatically.
3. **One accent.** Deep blue marks the primary button, the selected tab, the selected filter and the current page in the nav. Links use the slightly lighter `--flow` blue. Orange, green and purple (`--viz-2` to `--viz-4`) appear only as data series.
4. **Figures are evidence.** Plots keep the colours they were produced with, in both themes (see "Figures").
5. **Numbers link to evidence.** A headline number links to the part of the project page it comes from.
6. **Honest status colours.** PASS uses `--ok`, FAIL uses `--fail`, and the word is always printed, so colour is never the only signal. FAIL rows are never hidden.
7. **Never uppercase.** Labels and table headers are sentence case. Uppercasing breaks Greek symbols (ζ → Z, ω → Ω).

## Colour

| Token             | Light     | Dark      | Use                                                                    |
| ----------------- | --------- | --------- | ---------------------------------------------------------------------- |
| `--bg`            | `#faf9f6` | `#10141b` | page (warm white paper)                                                |
| `--bg-raised`     | `#ffffff` | `#141922` | lightbox dialog                                                        |
| `--surface`       | `#ffffff` | `#161b25` | cards, tiles, code blocks, interactive panels                          |
| `--surface-2`     | `#f1efe9` | `#1d2430` | inline code, pressed states, the Earth disc in the 3D viewer           |
| `--border`        | `#dcd8ce` | `#2a3240` | hairline rules (decorative only)                                       |
| `--border-strong` | `#8c887e` | `#6b7586` | outlines of buttons and badges, plot zero lines                        |
| `--text`          | `#16181d` | `#e6e8ec` | body, headings, 2 px section rules                                     |
| `--text-muted`    | `#474c57` | `#a9b0bc` | secondary text, captions                                               |
| `--text-faint`    | `#5c616c` | `#98a1b0` | labels, metadata, source paths                                         |
| `--accent`        | `#1b3f7a` | `#8fb0ea` | primary button, selected tab and filter, current nav item              |
| `--accent-ink`    | `#ffffff` | `#0c1220` | text on the accent                                                     |
| `--flow`          | `#1d4e9e` | `#9dbcf0` | links, focus ring                                                      |
| `--viz-2`         | `#a8410e` | `#f0a860` | second data series (orange)                                            |
| `--viz-3`         | `#17703f` | `#5fd0a0` | third data series (green)                                              |
| `--viz-4`         | `#6b3fa8` | `#c0a8f0` | fourth data series (purple)                                            |
| `--ok`            | `#17663a` | `#5fd0a0` | PASS                                                                   |
| `--warn`          | `#7a4c06` | `#e8c060` | placeholder marking, "to confirm"                                      |
| `--fail`          | `#a81c1c` | `#ff8a80` | FAIL                                                                   |
| `--paper`         | `#ffffff` | `#e6e6e6` | figure plate (dark value = white × 0.9, to match the dimmed figure)    |
| `--paper-ink`     | `#1a1a1a` | `#1a1a1a` | text on a figure plate                                                 |
| `--glow`          | `#e9eef7` | `#1c2a44` | flat accent wash (name kept from the earlier design; never a gradient) |
| `--shadow-card`   | `none`    | `none`    | no shadows anywhere                                                    |

Every text colour was checked with the WCAG 2 relative-luminance formula against `--bg`, `--surface`, `--surface-2` and `--glow` in both themes. All pairs are ≥ 4.5 : 1; the lowest is 5.26 : 1 (light `--viz-2` on `--glow`). `--border-strong` is ≥ 3 : 1 on `--bg` and `--surface` in both themes, so it is the colour for control outlines; `--border` is a decorative hairline and never the only indicator of a control.

Print uses black on white with the light accent, whichever theme is active.

## Type

| Role                       | Family                   | Token                             |
| -------------------------- | ------------------------ | --------------------------------- |
| Reading text and headings  | Source Serif 4 Variable  | `--font-serif`, `--font-display`  |
| Interface text             | Source Sans 3 Variable   | `--font-sans`                     |
| Code, numeric cells, paths | Geist Mono Variable      | `--font-mono`                     |

All three are self-hosted through Fontsource. Fallbacks: Georgia, Arial, and a metric-matched `Geist Mono Fallback` on Courier New.

- **Serif:** body prose, h1–h4, project titles, the TL;DR, key-number values.
- **Sans:** header nav, footer, breadcrumbs, section labels, figure captions, tables, the project sidebar, tabs, filters, buttons, badges. `.eyebrow` and `.mono-label` keep their class names but are sans.
- **Mono:** code blocks, inline code, `.num` table cells and the "Source:" path under a caption. Never for labels.

| Step | Token         | Size                          | Use                                   |
| ---- | ------------- | ----------------------------- | ------------------------------------- |
| xs   | `--text-xs`   | 13 px (0.8125rem)             | labels, badges, metadata              |
| sm   | `--text-sm`   | 15 px (0.9375rem)             | captions, tables, sidebar, tabs       |
| base | `--text-base` | 17 px; body runs 17 → 18 px   | body                                  |
| lg   | `--text-lg`   | 20 px (1.25rem)               | lede, project hook                    |
| xl   | `--text-xl`   | 23 px (1.4375rem)             | h3                                    |
| 2xl  | `--text-2xl`  | 28 px (1.75rem)               | h2                                    |
| 3xl  | `--text-3xl`  | 38 px (2.375rem)              | h1 maximum                            |

Page titles use `clamp(1.75rem, 4vw, 2.375rem)`: 28 px on a phone, 38 px at most. Nothing on the site is larger than 38 px. Key-number values are 26 px serif with lining tabular figures. Headings are weight 600, tracking −0.012em, line-height 1.2, `text-wrap: balance`. Body line-height is 1.6. No words inside a heading are coloured.

## Layout

- **Page width:** `.wrap` is 70rem (1120 px) with 1.25rem side padding (2rem from 768 px). Prose is capped at 68ch, a lede at 60ch.
- **Header:** not sticky. Name on the left, plain text links on the right; the current page is ink, semibold, with a 2 px accent underline. Below 1024 px the links sit behind a "Menu" button.
- **Footer:** a 2 px ink rule, then name, contents and contact columns. No box.
- **Page header on inner pages:** a serif h1 at the page-title size, an optional lede, then the first section.
- **Numbered sections (`.sec`):** each top-level section has a hairline on top (the first one a 2 px ink rule). From 1024 px it is a grid with an 11rem left column for the label and the content on the right; below that the label stacks above the content. The label is `.sec-label` (sans, 15 px, semibold) and starts with its number in `<span class="n">1</span>`.

  ```html
  <section class="sec" aria-labelledby="direction-label">
    <h2 id="direction-label" class="sec-label"><span class="n">1</span>Research direction</h2>
    <div>…</div>
  </section>
  ```

- **Project pages** do not use the margin column: breadcrumb, header (title plate and TL;DR plate), the key-number row, then the tabs with the details list on the right (15rem, sticky below the tab bar; above the tabs on small screens).
- **Radius:** `--radius-sm` 2 px (badges, figure plates, small buttons), `--radius` 3 px (buttons), `--radius-lg` 4 px (cards and tiles). No `rounded-full` anywhere.
- **Shadow, gradient, blur:** none.

## Motion

Colour and border-colour transitions of 120 ms on hover; nothing moves on hover. The only moving content is simulation video on project pages: it plays only while on screen, has a visible Play/Pause button and never autoplays under `prefers-reduced-motion: reduce` (the poster shows instead). Reduced motion also disables every transition.

## Components

- **Cards and tiles (`.card`, `.tile`):** a white plate (`--surface`) with a 1 px hairline and 4 px radius. A linked card darkens its border to `--border-strong` on hover; no lift.
- **Project card (Projects page):** the thumbnail scaled to fit a white plate (`object-fit: contain`, never cropped, so plot axes stay visible), then type label and dates, serif title, hook, and the topics as plain sans text. The whole card is the link.
- **Filters:** plain text buttons in two rows (Topic, Type). The selected one is ink, semibold and underlined in the accent.
- **Type label (`TypeBadge`):** small sans text in a hairline box, one neutral style for all four types.
- **Project header:** type label, course and dates in sans; serif h1 at the page-title size; the hook; the TL;DR in a second plate.
- **Key numbers (`Readouts`):** one ruled row (2 px ink rule above, hairline below, hairlines between cells) with serif numerals over sans labels. Two per row on phones. Values come only from frontmatter `metrics`.
- **Project details (`MetaSidebar`):** an unboxed definition list under a 2 px ink rule, hairline between rows; topics are comma-separated links to the filtered Projects page.
- **Tabs:** text tabs on a hairline; the selected tab is ink, semibold, with a 2 px accent underline. Sticky at the top of the viewport on a solid page-colour bar. Keyboard-operable (←/→/Home/End) and deep-linkable through `#overview`, `#technical`, `#results`, `#reflection` and `#code`.
- **Callout:** a left-ruled note with no box. The rule is `--border-strong` for a note, `--text` for a known gap and `--warn` for "to confirm"; the label text states which.
- **Code (`CodeSnippet`):** title in sans semibold under a 2 px ink rule, source path in mono, then the code on `--surface` with a hairline and square corners. Shiki themes: `github-light-high-contrast` (light) and `github-dark-default` (dark); the weakest token on that ground is 5.0 : 1 and 5.6 : 1.
- **Equations:** KaTeX, with the equation tag right-aligned in sans.
- **Buttons:** `.btn` is a 1 px `--border-strong` outline, 3 px radius, sans semibold. `.btn-primary` is filled with the accent; use at most one per page. Everything else is a text link.
- **Focus:** a 2 px `--flow` outline with a 2 px offset on every interactive element.

## Figures

- A figure is a white plate (`.figure-ground`, `--paper`) with a 1 px hairline, 2 px radius and 0.75rem padding (1.25rem from 640 px). Clicking opens the lightbox.
- The caption sits below the plate in sans 15 px `--text-muted`, capped at 68ch, and starts with the number in bold ink: **Fig. 3**. Numbers are assigned automatically in document order (videos share the sequence). An optional "Source:" path follows on its own line in mono.
- Figures are never cropped. Thumbnails in lists use `object-fit: contain`.
- **Dark mode does not re-ink figures.** Images and videos inside `.figure-ground` get `filter: brightness(0.9)` and the plate becomes `#e6e6e6` (white × 0.9), so a white-ground plot meets its plate with no seam and is less glaring on the dark page. Hue and colour-map direction are untouched. The earlier invert-and-hue-rotate treatment is gone; the `.reink` and `.keep-ink` classes and the `keepInk` / `thumbnailKeepInk` props are accepted and do nothing.
- The lightbox always shows the original image on pure white, and print removes the dimming.
- Interactive panels (the pole map and the 3D encounter viewer) are not on a paper plate: they sit on `--surface` with a hairline, read their colours from the tokens when they draw, and redraw on `themechange`. Series: `--text` for the reference, then `--accent`, `--viz-2`, `--viz-3`, `--viz-4`; markers also differ by shape.

## Placeholder convention

Copy that is waiting for Khalil's own wording is not drafted for him. It is one plain sentence saying what will go there, inside a placeholder block:

```html
<div class="placeholder">
  <p>A paragraph on the research questions I want to work on will go here.</p>
</div>
```

`.placeholder` draws a 3 px `--warn` rule on the left and prints the label "Placeholder text" above the sentence automatically. To finish a block, replace the sentence and remove the `placeholder` class. Facts that still need checking are marked in the source with `TODO(Khalil)` comments (JSX comments, so they are not emitted into the built pages).

## Brand assets

`node scripts/make-brand-assets.mjs` writes the favicon set (the blunt-body-and-bow-shock mark, white on deep blue `#1b3f7a`) and the default link-preview image (1200 × 630: name in a serif, "Aerospace Engineering Sciences, University of Colorado Boulder" in sans, a thin rule and the mark in deep blue on the paper colour `#faf9f6`).
