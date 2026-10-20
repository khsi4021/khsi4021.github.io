# khsi4021.github.io

Source for **Khalil (Lilo) Sidani's engineering portfolio**: hypersonic boundary-layer and heating solvers, conjunction-risk analysis, flight simulation and aircraft design.

Live site: <https://khsi4021.github.io> (once deployed)

## Stack

- [Astro 7](https://astro.build) static site with MDX content collections. There is one `.mdx` file per project, with a typed frontmatter schema in `src/content.config.ts`.
- Tailwind CSS 4, with design tokens in `src/styles/global.css` (see `DESIGN_SPEC.md`).
- KaTeX, rendered at build time, for equations.
- Astro `<Image>` for responsive WebP output.
- three.js for the DebriSolver 3D encounter viewer and Observable Plot for the Sim6DOF pole map. Both are lazy-loaded islands. Everything else is plain HTML with a little vanilla JS: tabs, filters, lightbox and theme toggle.
- Self-hosted fonts: Space Grotesk, Inter and JetBrains Mono.

## Develop

Requires Node ≥ 22.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
npm run check      # type-check .astro / .ts
npm run lint       # ESLint
npm run format     # Prettier
```

## Layout

```
src/
  content/projects/   one .mdx per project (template: templates/project-template.mdx)
  pages/              home, projects, coursework, research, flow-vis, about, cv, contact
  components/         ProjectCard, ProjectGrid, ProjectTabs, TabPanel, MetaSidebar, Figure,
                      Equation, CodeSnippet, SkillsMatrix, Timeline, Gallery, EncounterViewer, PoleMap…
  assets/             figures (optimised at build time)
  snippets/           curated code excerpts imported with ?raw
  data/               site facts, skills, encounter and pole-map data
public/               favicon, robots.txt, media/ (videos), cv/ (PDF)
scripts/              brand-asset and thumbnail generators (node scripts/<name>.mjs)
design-explorations/  three static design mockups (A, B, C; C is built)
```

## Deploy (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` builds with the official `withastro/action` and deploys on every push to `main`.

One-time setup on GitHub:

1. Create a **public** repository named exactly **`khsi4021.github.io`**. Leave it empty: no README, license or .gitignore.
2. Push this folder to it (the commands are in `HOW_TO_UPDATE.md`).
3. In the repo, open **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to go green (about 2 minutes). The site will be at <https://khsi4021.github.io>.

If you use a different repo name (a "project site"), the site is served from `https://khsi4021.github.io/<repo>/`. Set `base: "/<repo>"` in `astro.config.mjs`. Internal links are root-relative, so they'd also need the base prefix, which is easier to avoid by using the user-site name above.

## Custom domain (later)

1. Buy the domain and add DNS records at your registrar: four `A` records for the apex domain pointing to GitHub Pages' IPs (listed in GitHub's "Managing a custom domain" docs), and/or a `CNAME` for `www` pointing to `khsi4021.github.io`.
2. In **Settings → Pages → Custom domain**, enter the domain, save, and tick **Enforce HTTPS** once the certificate is issued.
3. Change `site` in `astro.config.mjs` and the sitemap line in `public/robots.txt` to the new domain, then push.

## Content rules

Every number on the site comes from the projects' own code, results or reports. Unknowns are marked `TODO(Lilo)` in the source. Graded coursework is shown as short excerpts only, and teammates are described by role.
