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
   - `order` is the reading order on the home page and the projects page, lowest first. It ranks relevance to hypersonic CFD together with complexity and recency. Current order: 1 hypersonic-solver, 2 newtonian-aero, 3 sim6dof, 4 debrisolver, 5 reserved for the heat-diffusion project, 6 aircraft-design-toolbox, 7 tsunami-simulation, 8 target-shooting, 9 bottle-rocket, 10 tcas-simulation, 11 cpp-rpg, 12 candy-land. To insert a project, renumber the ones after it.
   - `group` (optional) is the heading the project is listed under on the home page. The groups in use are `Hypersonics`, `Simulation and verification`, `Numerical methods`, `Earlier coursework` and `Software fundamentals`. Headings are printed in order of first appearance, so keep the projects of one group next to each other in `order`; without `group` the project falls under "Other work".
   - `contribution` (optional) is one sentence on what the project contributes toward hypersonic CFD. It is printed under the project in the home-page list. Say so plainly when the link is loose.
   - `featured` is still in the schema but no longer decides what the home page shows.
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

| What                                 | Where                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email, LinkedIn, degree wording, GPA | `src/data/site.ts`. `degree` is the plain statement used across the site; `degreeWithDate` (with the graduation date) is used only in the Home header; `gpa` is shown under Education on the About page.                                                                                 |
| CV                                   | Save as `public/cv/Khalil-Sidani-CV.pdf`. The CV page and download button appear automatically.                                                                                                                                                                                          |
| Headshot                             | Put it in `src/assets/headshot.jpg` and replace the placeholder block in `src/pages/about.astro`.                                                                                                                                                                                        |
| Flow Vis pieces                      | Put the image in `src/assets/flowvis/` and add or edit the entry in `src/data/flowvis.ts` (`slug`, `media`, `brief` for the card text, `technique`, `caption`, `alt`). The card on `/flow-vis/` and the page at `/flow-vis/<slug>/` are generated from that entry.                       |
| Skills matrix                        | `src/data/skills.ts`. Each skill links to the project where it was used.                                                                                                                                                                                                                 |
| Home, About, Research text           | `src/pages/index.astro`, `about.astro`, `research.astro`. Copy that is waiting for your own wording sits in a `<div class="placeholder">` block (pale blue block with an accent left rule, labelled "Placeholder text"). Replace the sentence inside and remove the `placeholder` class. |
| Colours, fonts, spacing              | `src/styles/global.css` (tokens) and `DESIGN_SPEC.md`                                                                                                                                                                                                                                    |
| Favicon and link-preview image       | Edit `scripts/make-brand-assets.mjs`, then run `node scripts/make-brand-assets.mjs`.                                                                                                                                                                                                     |

## Regenerating figures

New figures were generated with MATLAB from copies of the course code in `.scratch/`, which is gitignored and never touches the original repo. Run `matlab -batch "make_figures"` from `.scratch/`, or `make_figures('tsunami')` for one job. Copy the PNGs from `.scratch/out/` into `src/assets/`.

## First push (one time)

```bash
git remote add origin https://github.com/khsi4021/khsi4021.github.io.git
git branch -M main
git push -u origin main
```

Then follow the "Deploy" steps in `README.md` to switch Pages to GitHub Actions.
