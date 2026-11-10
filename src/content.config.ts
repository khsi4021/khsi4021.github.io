import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const TAGS = [
  "Hypersonics",
  "CFD/Numerical",
  "Aerodynamics",
  "Flight Dynamics & Control",
  "Orbital/SSA",
  "Aircraft Design",
  "Machine Learning",
  "Experimental",
  "Software",
] as const;

export const TYPES = ["Personal", "Course", "Team", "Competition"] as const;

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      /** One-sentence description for meta tags and the sidebar. */
      summary: z.string(),
      /** One-line hook for cards. */
      hook: z.string(),
      /** TL;DR, 40 words or fewer. */
      tldr: z.string(),
      type: z.enum(TYPES),
      course: z.string().optional(),
      team: z.string().optional(),
      role: z.string(),
      dates: z.string(),
      /** ISO date used for sorting (end of project). */
      date: z.coerce.date(),
      tags: z.array(z.enum(TAGS)).min(1),
      stack: z.array(z.string()),
      featured: z.boolean().default(false),
      order: z.number(),
      heroImage: image(),
      heroAlt: z.string(),
      thumbnail: image(),
      thumbnailAlt: z.string(),
      /** Colour-mapped thumbnail: keep its colours on a paper card in dark mode. */
      thumbnailKeepInk: z.boolean().default(false),
      /** Key numbers shown as read-outs. Each must be quoted from a source. */
      metrics: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
      links: z
        .object({
          repo: z.url().optional(),
          report: z.string().optional(),
          video: z.string().optional(),
          demo: z.string().optional(),
        })
        .default({}),
      status: z.enum(["complete", "in progress", "archived"]),
      /** Tabs present on this page, in order. */
      tabs: z
        .array(z.enum(["overview", "technical", "results", "reflection", "code"]))
        .default(["overview", "technical", "results", "reflection", "code"]),
      tier: z.enum(["flagship", "supporting", "fundamentals"]),
    }),
});

export const collections = { projects };
