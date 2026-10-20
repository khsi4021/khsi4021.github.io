# How to update the site

All edits are made locally, previewed with `npm run dev`, and published with a `git push`. GitHub Actions rebuilds and deploys in about 2 minutes.

## Add a new project

1. **Copy the template.** Copy `templates/project-template.mdx` to `src/content/projects/<slug>.mdx`. The slug becomes the URL, `/projects/<slug>/`.
2. **Add images.** Create `src/assets/projects/<slug>/` and put your figures there as PNG or JPG. Wide figures at about 2000 px are ideal; Astro converts and resizes them automatically. Aim for:
   - axes labelled with units,
   - the site palette (blue `#2B7BD6`, orange `#E8673A`, green `#16A37B`, purple `#7B4FC4`),
   - a light `#FAFAF8` background.
3. **Fill in the frontmatter.**
   - `type` must be one of Personal / Course / Team / Competition.
   - `tags` must come from the list in the template.
   - `tldr` should be 40 words or fewer.
   - Set `featured: true` to show the project on the home page (four fit best).
   - `order` controls the position in lists.
4. **Write the tabs.** Each `<TabPanel id="…">` becomes a tab. Delete tabs you don't need, and list the remaining ones in `tabs:`. These components are available without importing:
   - `<Figure src={img} alt="…" source="…">caption</Figure>`, numbered automatically, with a lightbox.
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

| What | Where |
|---|---|
| Email, LinkedIn, degree wording | `src/data/site.ts` |
| CV | Save as `public/cv/Khalil-Sidani-CV.pdf`. The CV page and download button appear automatically. |
| Headshot | Put it in `src/assets/headshot.jpg` and replace the placeholder block in `src/pages/about.astro`. |
| Flow Vis images | Put images in `src/assets/flow-vis/`, then set `file:`, `technique:`, `caption:` and `alt:` for each entry in `src/data/flowvis.ts`. |
| Skills matrix | `src/data/skills.ts`. Each skill links to the project where it was used. |
| Home, About, Research text | `src/pages/index.astro`, `about.astro`, `research.astro`. The `draft` badges show only in `npm run dev`. |
| Colours, fonts, spacing | `src/styles/global.css` (tokens) and `DESIGN_SPEC.md` |

## Regenerating figures

New figures were generated with MATLAB from copies of the course code in `.scratch/`, which is gitignored and never touches the original repo. Run `matlab -batch "make_figures"` from `.scratch/`, or `make_figures('tsunami')` for one job. Copy the PNGs from `.scratch/out/` into `src/assets/`.

## First push (one time)

```bash
git remote add origin https://github.com/khsi4021/khsi4021.github.io.git
git branch -M main
git push -u origin main
```

Then follow the "Deploy" steps in `README.md` to switch Pages to GitHub Actions.
