// Flow Visualization (ATLS 5151) gallery entries.
// To add an image: put it in src/assets/flow-vis/ and set `file` to its name.
// TODO(Lilo): images, techniques and captions (see TODO_FOR_LILO.md §3).
export type FlowVisEntry = {
  title: string;
  technique: string;
  caption: string;
  file?: string; // e.g. "marangoni.jpg" in src/assets/flow-vis/
  alt?: string;
};

export const flowVis: FlowVisEntry[] = [
  {
    title: "Marangoni flow: milk, dye and soap",
    technique: "Technique to add",
    caption: "Surface-tension-driven flow when soap lowers the surface tension of milk and drags the dye with it.",
  },
  {
    title: "Chladni patterns",
    technique: "Technique to add",
    caption: "Sand collecting on the nodal lines of a vibrating plate at resonance.",
  },
  {
    title: "Clouds",
    technique: "Technique to add",
    caption: "Cloud photography for the course's cloud assignment.",
  },
];
