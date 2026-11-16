# How to update the site

All edits are made locally, previewed with `npm run dev`, and published with a `git push`. GitHub Actions rebuilds and deploys in about 2 minutes.

## Add a new project

1. **Copy the template.** Copy `templates/project-template.mdx` to `src/content/projects/<slug>.mdx`. The slug becomes the URL, `/projects/<slug>/`.
2. **Add images.** Create `src/assets/projects/<slug>/` and put your figures there as PNG or JPG. Wide figures at about 2000 px are ideal; Astro converts and resizes them automatically. Aim for:
   - axes labelled with units,
   - the site's series colours (blue `#1b3f7a`, orange `#a8410e`, green `#17703f`, purple `#6b3fa8`),
   - a plain white background. Figures are shown on a white plate in both themes; dark mode only dims them slightly and never inverts their colours.
3. **Fill in the frontmatter.**
   - `type` must be one of Personal / Course / Team. It is also the Type filter on the projects page.
   - `context` (optional) is a short second label shown as its own small badge next to the type badge, for work that also belongs somewhere else. DebriSolver is `type: Personal` with `context: Competition`, so its card shows "Personal" and "Competition" side by side. The context is not a filter on the Projects page. When `context` is set on a project that is not a course project, the `course` line is labelled "Built for" in the project details.
   - `tags` must come from the list in the template.
   - `tldr` should be 40 words or fewer.
   - `order` is the reading order on the projects page, lowest first. It ranks relevance to hypersonic CFD together with complexity and recency. Current order: 1 hypersonic-solver, 2 newtonian-aero, 3 sim6dof, 4 debrisolver, 5 reserved for the heat-diffusion project, 6 aircraft-design-toolbox, 7 tsunami-simulation, 8 target-shooting, 9 bottle-rocket, 10 tcas-simulation, 11 cpp-rpg, 12 candy-land. To insert a project, renumber the ones after it.
   - `group` and `contribution` (both optional) are kept in the schema but are not shown anywhere since Home stopped listing projects. Fill them in if you like; they cost nothing.
   - `featured` is still in the schema but does not decide anything that is shown.
4. **Write the tabs.** Each `<TabPanel id="…">` becomes a tab. Delete tabs you don't need, and list the remaining ones in `tabs:`. These components are available without importing:
   - `<Figure src={img} alt="…" source="…">caption</Figure>`, numbered automatically ("Fig. 1", "Fig. 2"…), with a lightbox.
   - `<Readouts items={[{ value: "…", label: "…" }]} />`, a ruled row of key numbers.
   - `<Equation tex={String.raw`…`} label="3" />`, rendered with KaTeX at build time.
   - `<CodeSnippet code={snip} lang="python" title="…" source="…">why it matters</CodeSnippet>`. Put the excerpt in `src/snippets/` and import it with `?raw`. Keep it under 40 lines.
   - `<Callout tone="note|honest|todo" title="…">…</Callout>`.
   - `<Video src="/media/file.mp4" poster={img} alt="…">caption</Video>`. Put the MP4 in `public/media/`.
5. **Preview** with `npm run dev`. Then run `npm run build` to catch frontmatter errors: the schema in `src/content.config.ts` rejects missing or invalid fields with a clear message.
6. **Publish:**
   ```bash
   git add -A
   git commit -m "Add project: <title>"
   git push
   ```

## Common edits

| What                                 | Where                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email, LinkedIn, degree wording, GPA | `src/data/site.ts`. `degree` is the plain statement used across the site; `degreeWithDate` (with the graduation date) is used only in the Home header; `gpa` is shown under Education on the Home page.                                                                                                                                                                          |
| CV                                   | Save as `public/cv/Khalil-Sidani-CV.pdf`. The CV page and download button appear automatically.                                                                                                                                                                                                                                                                                  |
| Project report PDF                   | Save it in `public/reports/` and set `links: { report: "/reports/<file>.pdf" }` in the project's frontmatter. The sidebar then shows "Final report (PDF, size)" plus a Download link. Files there are published as they are, so check them first.                                                                                                                                |
| Headshot                             | Save it as `src/assets/headshot/headshot.jpg` (or `.png` / `.webp`), cropped to portrait 4:5, about 600 × 750 px. It replaces the "Headshot to come" frame on Home automatically; no code change.                                                                                                                                                                                |
| Flow Vis pieces                      | Put the image in `src/assets/flowvis/` and add or edit the entry in `src/data/flowvis.ts` (`slug`, `media`, `brief` for the card text, `technique`, `caption`, `alt`). The card on `/flow-vis/` and the page at `/flow-vis/<slug>/` are generated from that entry.                                                                                                               |
| Skills matrix                        | `src/data/skills.ts`. Each skill links to the project where it was used.                                                                                                                                                                                                                                                                                                         |
| Home (incl. About), Research text    | `src/pages/index.astro` (Home also holds the biography, education, timeline, awards and skills; `/about/` only forwards there), `research.astro`. Copy that is waiting for your own wording sits in a `<div class="placeholder">` block (pale blue block with an accent left rule, labelled "Placeholder text"). Replace the sentence inside and remove the `placeholder` class. |
| Colours, fonts, spacing              | `src/styles/global.css` (tokens) and `DESIGN_SPEC.md`                                                                                                                                                                                                                                                                                                                            |
| Favicon and link-preview image       | Edit `scripts/make-brand-assets.mjs`, then run `node scripts/make-brand-assets.mjs`.                                                                                                                                                                                                                                                                                             |

## Regenerating figures

New figures were generated with MATLAB from copies of the course code in `.scratch/`, which is gitignored and never touches the original repo. Run `matlab -batch "make_figures"` from `.scratch/`, or `make_figures('tsunami')` for one job. Copy the PNGs from `.scratch/out/` into `src/assets/`.

## First push (one time)

```bash
git remote add origin https://github.com/khsi4021/khsi4021.github.io.git
git branch -M main
git push -u origin main
```

Then follow the "Deploy" steps in `README.md` to switch Pages to GitHub Actions.
