# Design spec: academic, light by default

The site reads like a research group page or a typeset preprint: a warm-white page, black serif text, one deep blue for links and the current state, hairline rules instead of boxes, a pale blue wash on the header and footer bands, numbered sections with their labels in a left margin column, and figures on white plates with numbered captions. Nothing floats, glows, lifts or is pill-shaped.

Source of truth for the tokens is `src/styles/global.css`, in the `:root` / `[data-theme]` blocks and the `@theme` blocks. This file explains them. Keep the two in sync.

## Principles

1. **Text-led and compact.** Pages are reading pages. Structure comes from rules, numbering and type, not from tiles. Vertical space between parts is small (see "Layout"); line-height inside text is not reduced.
2. **Light by default, dark on request.** `<html data-theme="light">` is the default, also without JS. A two-state toggle switches light ↔ dark and remembers the choice in `localStorage`. An inline head script applies it before first paint. The operating system's colour-scheme preference is not followed automatically.
3. **One accent, used throughout.** Deep blue marks the primary button, the selected tab, the selected filter, the current page in the nav, section labels and their numbers, the 2 px rule above the first section, and placeholder blocks. Its flat pale wash (`--glow`) sits behind the site header, the footer, placeholder blocks and table heads. Text links in page content use the slightly lighter `--flow` blue and are underlined. Orange, green and purple (`--viz-2` to `--viz-4`) appear only as data series.
4. **Figures are evidence.** Plots keep the colours they were produced with, in both themes (see "Figures").
5. **Numbers link to evidence.** A headline number links to the part of the project page it comes from.
6. **Honest status colours.** PASS uses `--ok`, FAIL uses `--fail`, and the word is always printed, so colour is never the only signal. FAIL rows are never hidden.
7. **Never uppercase.** Labels and table headers are sentence case. Uppercasing breaks Greek symbols (ζ → Z, ω → Ω).

## Colour

| Token             | Light     | Dark      | Use                                                                      |
| ----------------- | --------- | --------- | ------------------------------------------------------------------------ |
| `--bg`            | `#faf9f6` | `#10141b` | page (warm white paper)                                                  |
| `--bg-raised`     | `#ffffff` | `#141922` | lightbox dialog                                                          |
| `--surface`       | `#ffffff` | `#161b25` | cards, tiles, code blocks, interactive panels                            |
| `--surface-2`     | `#f1efe9` | `#1d2430` | inline code, pressed states, the Earth disc in the 3D viewer             |
| `--border`        | `#dcd8ce` | `#2a3240` | hairline rules (decorative only)                                         |
| `--border-strong` | `#8c887e` | `#6b7586` | outlines of buttons and badges, plot zero lines                          |
| `--text`          | `#16181d` | `#e6e8ec` | body, headings                                                           |
| `--text-muted`    | `#474c57` | `#a9b0bc` | secondary text, captions                                                 |
| `--text-faint`    | `#5c616c` | `#98a1b0` | labels, metadata, source paths                                           |
| `--accent`        | `#1b3f7a` | `#8fb0ea` | primary button, selected state, section labels, 2 px rules, placeholders |
| `--accent-ink`    | `#ffffff` | `#0c1220` | text on the accent                                                       |
| `--flow`          | `#1d4e9e` | `#9dbcf0` | links, focus ring                                                        |
| `--viz-2`         | `#a8410e` | `#f0a860` | second data series (orange)                                              |
| `--viz-3`         | `#17703f` | `#5fd0a0` | third data series (green)                                                |
| `--viz-4`         | `#6b3fa8` | `#c0a8f0` | fourth data series (purple)                                              |
| `--ok`            | `#17663a` | `#5fd0a0` | PASS                                                                     |
| `--warn`          | `#7a4c06` | `#e8c060` | "to confirm" callouts only (placeholders no longer use it)               |
| `--fail`          | `#a81c1c` | `#ff8a80` | FAIL                                                                     |
| `--paper`         | `#ffffff` | `#e6e6e6` | figure plate (dark value = white × 0.9, to match the dimmed figure)      |
| `--paper-ink`     | `#1a1a1a` | `#1a1a1a` | text on a figure plate                                                   |
| `--glow`          | `#e9eef7` | `#1c2a44` | flat accent wash: header and footer bands, placeholders, table heads     |
| `--shadow-card`   | `none`    | `none`    | no shadows anywhere                                                      |

Every text colour was checked with the WCAG 2 relative-luminance formula against `--bg`, `--surface`, `--surface-2` and `--glow` in both themes. All pairs are ≥ 4.5 : 1; the lowest is 5.26 : 1 (light `--viz-2` on `--glow`). The pairs added with the blue wash: `--accent` on `--bg` 9.78 (light) / 8.41 (dark), `--accent` on `--glow` 8.85 / 6.53, `--flow` on `--bg` 7.57 / 9.57, `--flow` on `--glow` 6.84 / 7.44, `--text-muted` on `--glow` 7.39 / 6.57, `--text-faint` on `--glow` 5.33 / 5.51. `--border-strong` is ≥ 3 : 1 on `--bg` and `--surface` in both themes, so it is the colour for control outlines; `--border` is a decorative hairline and never the only indicator of a control.

Print uses black on white with the light accent, whichever theme is active.

## Type

| Role                       | Family                  | Token                            |
| -------------------------- | ----------------------- | -------------------------------- |
| Reading text and headings  | Source Serif 4 Variable | `--font-serif`, `--font-display` |
| Interface text             | Source Sans 3 Variable  | `--font-sans`                    |
| Code, numeric cells, paths | Geist Mono Variable     | `--font-mono`                    |

All three are self-hosted through Fontsource. Fallbacks: Georgia, Arial, and a metric-matched `Geist Mono Fallback` on Courier New.

- **Serif:** body prose, h1–h4, project titles, the TL;DR, key-number values.
- **Sans:** header nav, footer, breadcrumbs, section labels, figure captions, tables, the project sidebar, tabs, filters, buttons, badges. `.eyebrow` and `.mono-label` keep their class names but are sans.
- **Mono:** code blocks, inline code, `.num` table cells and the "Source:" path under a caption. Never for labels.

| Step | Token         | Size                        | Use                             |
| ---- | ------------- | --------------------------- | ------------------------------- |
| xs   | `--text-xs`   | 13 px (0.8125rem)           | labels, badges, metadata        |
| sm   | `--text-sm`   | 15 px (0.9375rem)           | captions, tables, sidebar, tabs |
| base | `--text-base` | 17 px; body runs 17 → 18 px | body                            |
| lg   | `--text-lg`   | 20 px (1.25rem)             | lede, project hook              |
| xl   | `--text-xl`   | 23 px (1.4375rem)           | h3                              |
| 2xl  | `--text-2xl`  | 28 px (1.75rem)             | h2                              |
| 3xl  | `--text-3xl`  | 38 px (2.375rem)            | h1 maximum                      |

Page titles use `clamp(1.75rem, 4vw, 2.375rem)`: 28 px on a phone, 38 px at most. Nothing on the site is larger than 38 px. Key-number values are 26 px serif with lining tabular figures. Headings are weight 600, tracking −0.012em, line-height 1.2, `text-wrap: balance`. Body line-height is 1.6. No words inside a heading are coloured.

## Layout

- **Page width:** `.wrap` is 70rem (1120 px) with 1.25rem side padding (2rem from 768 px). Prose is capped at 68ch, a lede at 60ch.
- **Header:** not sticky. A full-width band on `--glow` with a hairline below. Name on the left, plain text links on the right; the current page is ink, semibold, with a 2 px accent underline. Below 1024 px the links sit behind a "Menu" button.
- **Footer:** a full-width band on `--glow` under a 2 px accent rule, 2.5rem below the content, with name, contents (two columns) and contact.
- **Page header on inner pages:** a serif h1 at the page-title size, an optional lede, then the first section. The title starts 1.5rem below the header band (1.75rem from 768 px) and the first section rule follows 1.25rem after the header block. These three distances are set once, by unlayered rules at the end of `global.css` (`main > .wrap:first-child` and its first `header`), and override spacing utilities written on a page.
- **Numbered sections (`.sec`):** each top-level section has a hairline on top (the first one a 2 px accent rule) and 1.5rem of padding above and below (1.75rem from 1024 px). From 1024 px it is a grid with an 11rem left column for the label, a 2.5rem gap and the content on the right; below that the label stacks above the content. The label is `.sec-label` (sans, 15 px, semibold, accent blue) and starts with its number in `<span class="n">1</span>`.

  ```html
  <section class="sec" aria-labelledby="direction-label">
    <h2 id="direction-label" class="sec-label"><span class="n">1</span>Research direction</h2>
    <div>…</div>
  </section>
  ```

- **Project pages** do not use the margin column: breadcrumb, header (title plate and TL;DR plate), the key-number row, then the tabs with the details list on the right (15rem, sticky below the tab bar; above the tabs on small screens).
- **Inside a section:** blocks are 0.75rem to 1.25rem apart; list rows have 0.5rem to 0.75rem of padding. Prose paragraphs are 0.9em apart, an h2 has 1.6em above it and an h3 1.4em. Where a list of short entries would be tall, set it in two columns from 768 px (as in "Beyond the code" on About).
- **Radius:** `--radius-sm` 2 px (badges, figure plates, small buttons), `--radius` 3 px (buttons), `--radius-lg` 4 px (cards and tiles). No `rounded-full` anywhere.
- **Shadow, gradient, blur:** none.

## Motion

Colour and border-colour transitions of 120 ms on hover; nothing moves on hover, with one exception: a Flow Vis card unfolds its description downward in 200 ms. The only other moving content is simulation video on project pages: it plays only while on screen, has a visible Play/Pause button and never autoplays under `prefers-reduced-motion: reduce` (the poster shows instead). Reduced motion also disables every transition.

## Components

- **Cards and tiles (`.card`, `.tile`):** a white plate (`--surface`) with a 1 px hairline and 4 px radius. A linked card darkens its border to `--border-strong` on hover; no lift.
- **Project card (Projects page):** the thumbnail scaled to fit a white plate (`object-fit: contain`, never cropped, so plot axes stay visible), then type label and dates, serif title, hook, and the topics as plain sans text. The whole card is the link.
- **Filters:** plain text buttons in two rows (Topic, Type). The selected one is ink, semibold and underlined in the accent.
- **Type label (`TypeBadge`):** small sans text in a hairline box, one neutral style for every type (Personal, Course, Team). An optional frontmatter `context` (for example `Competition`) is printed as a second badge of the same size directly after the type badge, tinted with the accent (`--accent` text on `--glow`) so it reads as a secondary tag. The context is a label only and is not a filter. Plain-text lists (the Home reading list, the project details sidebar) print it after a middle dot, as in "Personal · Competition".
- **Project header:** type label, course and dates in sans; serif h1 at the page-title size; the hook; the TL;DR in a second plate.
- **Key numbers (`Readouts`):** one ruled row (2 px accent rule above, hairline below, hairlines between cells) with serif numerals over sans labels. Two per row on phones. Values come only from frontmatter `metrics`.
- **Project details (`MetaSidebar`):** an unboxed definition list under a 2 px accent rule, hairline between rows; topics are comma-separated links to the filtered Projects page.
- **Tabs:** text tabs on a hairline; the selected tab is ink, semibold, with a 2 px accent underline. Sticky at the top of the viewport on a solid page-colour bar. Keyboard-operable (←/→/Home/End) and deep-linkable through `#overview`, `#technical`, `#results`, `#reflection` and `#code`.
- **Callout:** a left-ruled note with no box. The rule is `--border-strong` for a note, `--text` for a known gap and `--accent` for "to confirm"; the label text states which.
- **Code (`CodeSnippet`):** title in sans semibold under a 2 px accent rule, source path in mono, then the code on `--surface` with a hairline and square corners. Shiki themes: `github-light-high-contrast` (light) and `github-dark-default` (dark); the weakest token on that ground is 5.0 : 1 and 5.6 : 1.
- **Equations:** KaTeX, with the equation tag right-aligned in sans.
- **Buttons:** `.btn` is a 1 px `--border-strong` outline, 3 px radius, sans semibold. `.btn-primary` is filled with the accent; use at most one per page. Everything else is a text link.
- **Text links:** an anchor with no class of its own inside a `p`, `dd`, `td`, `li` or `figcaption` in `main` is `--flow` blue with a 1 px underline (2 px on hover). Cards, buttons and nav items carry classes and are not affected.
- **Tables:** head cells sit on `--glow` (all `.prose` tables, and any table with the class `table-tint`). The skills matrix has a 2 px accent rule on top and its group names in the accent.
- **Path flowchart (`PathFlow`, Research page):** an ordered list drawn as blocks joined by arrows, three per row when the chart is at least 38rem wide and one column with down arrows below that. Each block has a date line, a title (a link where a page exists) and a one-sentence note on what the step adds. Colour states the kind: a neutral top rule for coursework, an accent top rule on a plain surface for a team project, an accent top rule on a `--glow` wash for a personal project, and an accent fill for the goal. A legend sits underneath. No motion and no client JS.
- **Flow Vis showcase:** one row of image cards (4 across from 1024 px, 2 from 600 px, 1 below). Each card is a square image with a caption bar (assignment and title), a hairline border and `--radius` corners. On hover or keyboard focus the card grows downward into a vertical rectangle with the short description under the image; nothing covers the photograph and nothing else on the page moves (the extension is absolutely positioned, with 11rem reserved under the grid). On touch screens and below 600 px the description is always shown in the card. Each card links to `/flow-vis/<slug>/`.
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

`.placeholder` is a pale blue block (`--glow`) with a 3 px `--accent` rule on the left, and prints the label "Placeholder text" in the accent above the sentence automatically. No amber. `.draft-badge` uses the same blue pair. To finish a block, replace the sentence and remove the `placeholder` class. Facts that still need checking are marked in the source with `TODO(Khalil)` comments (JSX comments, so they are not emitted into the built pages).

## Brand assets

`node scripts/make-brand-assets.mjs` writes the favicon set (the blunt-body-and-bow-shock mark, white on deep blue `#1b3f7a`) and the default link-preview image (1200 × 630: name in a serif, "Aerospace Engineering Sciences, University of Colorado Boulder" in sans, a thin rule and the mark in deep blue on the paper colour `#faf9f6`).
