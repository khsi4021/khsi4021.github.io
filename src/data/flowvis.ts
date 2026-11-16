// Flow Visualization (ATLS 5151, Fall 2026) entries, in page order.
// Every description, number and technique detail below is taken from my own
// reports and flowvis.org posts for each assignment. Do not add physics or
// numbers that are not in those reports. Media lives in src/assets/flowvis/
// (images, video posters) and public/media/ (video). The showcase
// (/flow-vis/) and the detail pages (/flow-vis/<slug>/) both read from here.
import type { ImageMetadata } from "astro";
import milkDye from "@/assets/flowvis/flowvis-milk-dye.jpg";
import chladniPoster from "@/assets/flowvis/flowvis-chladni-poster.jpg";
import cremeBrulee from "@/assets/flowvis/flowvis-creme-brulee.png";
import greenFlamePoster from "@/assets/flowvis/flowvis-green-flame-poster.jpg";

// How each piece is shown on its detail page:
//  photo: resized image, opens in the lightbox.
//  video: poster frame plus a video file in /public/media (loaded only on play).
//  link:  poster frame that links to the flowvis.org post.
export type FlowVisMedia =
  | { kind: "photo"; image: ImageMetadata }
  | { kind: "video"; image: ImageMetadata; src: string }
  | { kind: "link"; image: ImageMetadata; linkText: string };

export type FlowVisId = "milk-dye" | "chladni" | "creme-brulee" | "green-flame";

export type FlowVisEntry = {
  id: FlowVisId;
  /** URL segment of the detail page: /flow-vis/<slug>/. */
  slug: string;
  media: FlowVisMedia;
  /** One or two sentences for the showcase card, taken from the text below. */
  brief: string;
  /** Short name shown in the section label column. */
  label: string;
  title: string;
  assignment: string;
  /** Date of the flowvis.org post. */
  date: string;
  dateISO: string;
  /** Who made it, only as far as the report states. */
  credit?: string;
  /** Paragraphs, in my own report's terms. */
  description: string[];
  /** Shown as placeholder text when the report is not written yet. */
  pending?: string;
  technique: { field: string; value: string }[];
  alt: string;
  caption: string;
  post: string;
};

export const flowVis: FlowVisEntry[] = [
  {
    id: "milk-dye",
    slug: "milk-and-dye",
    media: { kind: "photo", image: milkDye },
    brief:
      "Blue food dye on whole milk after a drop of dish detergent touches the surface. The surrounding surface pulls outward from that point, dragging the dye with it into radial filaments.",
    label: "Milk and dye",
    title: "Surfactant-driven Marangoni flow in a milk pool",
    assignment: "Get Wet, first individual image",
    date: "8 September 2026",
    dateISO: "2026-09-08",
    credit: "Individual work.",
    description: [
      "Blue food dye sits on the surface of a shallow pool of whole milk. Touching the surface with a cotton swab loaded with dish detergent collapses the surface tension at the point of contact, and the surrounding surface pulls outward from that point, dragging the dye with it into radial filaments.",
      "In my report I estimate that the detergent drops the surface tension from about 52 mN/m to roughly 25 mN/m. The cleared disc opens to a radius of roughly 5 cm in about 0.3 s, an average velocity of U ≈ 0.17 m/s, which gives a Reynolds number of about 4.4 × 10² on the milk depth and about 4.4 × 10³ on the in-plane length.",
      "The Marangoni number (≈ 6.8 × 10⁸) and the Péclet number for the dye (≈ 1.7 × 10⁷) are both large, so the transport is done almost entirely by the flow rather than by diffusion. That is why the filaments stay sharp instead of blurring into the milk.",
    ],
    technique: [
      {
        field: "Fluid",
        value: "Whole milk (3.25% fat) at 24 °C, about 5 mm deep, in a semi-translucent ceramic dish 24 cm across",
      },
      { field: "Tracer", value: "Water-based blue food dye, four drops placed 4–6 cm from the centre" },
      { field: "Surfactant", value: "Undiluted dish detergent on a cotton swab, touched to the surface at the centre" },
      { field: "Lighting", value: "Two flashlights beneath the dish, shining up through the milk, room lights off" },
      {
        field: "Camera",
        value: "Apple iPhone 17 Pro, handheld, Ultra Wide camera (13 mm, f/2.2), lens axis normal to the surface",
      },
      { field: "Exposure", value: "Automatic: 1/121 s, ISO 125" },
      { field: "Field of view", value: "Roughly 18 × 12 cm" },
      { field: "Image size", value: "3024 × 4032 px original, 1300 × 900 px after cropping and editing" },
      {
        field: "Processing",
        value: "GIMP: crop, local brightness lift through a gradient mask, white balance, levels, dark gray padding",
      },
    ],
    alt: "Top view of a white milk surface with blue dye pulled into curved, feathered filaments around two pale cleared regions.",
    caption: "Blue food dye on whole milk after a drop of dish detergent touches the surface.",
    post: "https://www.flowvis.org/2026/09/08/khalil-sidani-get-wet-2026/",
  },
  {
    id: "chladni",
    slug: "chladni-plates",
    // TODO(Khalil): the Chladni video is 50 MB, too large to host here. Once ffmpeg is
    // installed (winget install Gyan.FFmpeg) a compressed copy can go in
    // public/media/flowvis-chladni.mp4 and this entry can become kind: "video".
    media: { kind: "link", image: chladniPoster, linkText: "Watch the video on flowvis.org" },
    brief:
      "A video of sand on a 30 × 30 cm plate driven at seven frequencies between 209 Hz and 1774 Hz. The sand collects along the lines where there is very little movement.",
    label: "Chladni plates",
    title: "Chladni patterns: sand on a vibrating plate",
    assignment: "Team First",
    date: "23 September 2026",
    dateISO: "2026-09-23",
    credit: "Team of three.",
    description: [
      "This is a video of sand on a 30 × 30 cm plate driven at seven frequencies between 209 Hz and 1774 Hz. The vibrations move the sand away from the parts of the plate that shake more, so it collects along the lines where there is very little movement. The resulting shapes are called Chladni patterns.",
      "The sand pattern is a picture of the plate's vibration mode. A metal plate is restored by bending stiffness and obeys the Kirchhoff-Love plate equation. The plate thickness and material were not measured, so the report assumes aluminum, which gives a bending wavelength that falls from 0.20 m at 209 Hz to 0.070 m at 1774 Hz. That is why the patterns become finer as the frequency rises.",
      "The experiment mainly demonstrates vibration and granular motion rather than a typical fluid flow.",
    ],
    technique: [
      { field: "Plate", value: "30 × 30 cm" },
      { field: "Driving signal", value: "Sinusoidal, 15 V peak to peak" },
      { field: "Frequencies", value: "209, 350, 505, 825, 1111, 1443 and 1774 Hz" },
      { field: "Tracer", value: "Fine white sand, spread just enough to cover the plate" },
      { field: "Lighting", value: "Room lights off, two flashlights held on opposite sides of the plate" },
      { field: "Camera", value: "Canon EOS Rebel T7 in movie mode, automatic exposure" },
      { field: "Lens", value: "18–55 mm zoom at its widest view (estimated 18 mm), roughly 33 cm from the plate" },
      { field: "Video", value: "1920 × 1080 px at 25 fps" },
      { field: "Editing", value: "Google Vids: frequency labels, a title and music" },
    ],
    alt: "Top view of a square black plate with white sand gathered into a rounded diamond around the centre bolt and eight loops along the edges, labelled 1,111 Hz.",
    caption: "One frame of the video: the sand pattern at 1111 Hz.",
    post: "https://www.flowvis.org/2026/09/23/khalil-sidani-team-first-visual/",
  },
  {
    id: "creme-brulee",
    slug: "creme-brulee",
    media: { kind: "photo", image: cremeBrulee },
    brief:
      "A handheld torch flame strikes a shallow layer of granulated sugar on a dish of crème brûlée. The image holds two coupled flows: the hot gas jet of the flame and the slow, viscous motion of the molten sugar beneath it.",
    label: "Crème brûlée",
    title: "A torch flame impinging on a crème brûlée",
    assignment: "Team Second",
    date: "21 October 2026",
    dateISO: "2026-10-21",
    credit:
      "Team of three. I set up the camera and took the photos; my teammates operated the torch, positioned the flash and selected the camera settings.",
    description: [
      "A handheld torch flame strikes a shallow layer of granulated sugar on a dish of crème brûlée. The image holds two coupled flows in one frame: the hot gas jet of the flame spreading across the dish, and the slow, viscous motion of the molten sugar beneath it as it bubbles and darkens.",
      "The torch is tilted at roughly 30° to the surface, so the jet strikes the sugar near a stagnation point and sweeps downstream as a wall jet that widens into a fan, which is the shape of the orange glow. In my report I estimate a jet Reynolds number of about 2.6 × 10³ at the torch exit, falling to about 1 × 10³ in the hot gas, which matches the long, smooth, curved filaments in the flame. A Richardson number of about 8 × 10⁻⁴ says that jet momentum, not buoyancy, drives the gas onto the sugar.",
      "The melt is extremely viscous: a 2 mm bubble rises at about 3 mm/s, a Reynolds number of about 0.01. The gas above the dish and the liquid below it are five orders of magnitude apart in Reynolds number in one frame.",
    ],
    technique: [
      {
        field: "Flow",
        value:
          "Handheld torch (burner tube inner diameter 14 mm) held about 5 cm from the dish, tilted roughly 30° to the surface",
      },
      {
        field: "Dish",
        value: "Aluminum foil dish 8.4 cm in diameter: vanilla pudding topped with granulated white sugar 5 mm deep",
      },
      { field: "Tracer", value: "None. The flame is seen by its own light and the melt by the caramelization itself" },
      {
        field: "Lighting",
        value: "The flame's own emission, plus a camera flash held above and to the left of the dish",
      },
      {
        field: "Camera",
        value:
          "Canon EOS Rebel T5, EF-S 18–55 mm lens at 55 mm, approximately 35 cm from the dish, from directly above",
      },
      { field: "Exposure", value: "Manual: f/11, 1/80 s, ISO 6400, daylight white balance" },
      { field: "Image size", value: "5184 × 3456 px original, 1795 × 1055 px after cropping" },
      { field: "Processing", value: "GIMP: crop, contrast and color curve" },
    ],
    alt: "Top view of an orange flame fanning out to the left from bright yellow-white clumps of burning sugar, with a blue torch jet entering at the right edge and a dark charred patch left of centre.",
    caption:
      "Top view. The blue torch jet enters from the right, burns the sugar at the impingement point and spreads to the left as an orange, soot-laden fan.",
    post: "https://www.flowvis.org/2026/10/21/khalil-sidani-teams-second/",
  },
  {
    id: "green-flame",
    slug: "green-flame",
    media: { kind: "video", image: greenFlamePoster, src: "/media/flowvis-green-flame.mp4" },
    brief:
      "Burning isopropyl alcohol with crushed copper sulphate thrown in to change the color of the flame to green.",
    label: "Green flame",
    title: "Green flame from copper sulphate in burning isopropyl alcohol",
    assignment: "Team Third",
    date: "11 November 2026",
    dateISO: "2026-11-11",
    // TODO(Khalil): team size and your own role for Team Third.
    description: [
      "Burning isopropyl alcohol with crushed copper sulphate thrown in to change the color of the flame to green.",
    ],
    // TODO(Khalil): replace with the physics and technique once the Team Third report is written.
    pending:
      "A description of the flow physics and the visualization technique will go here once the report is written.",
    technique: [
      { field: "Fuel", value: "Isopropyl alcohol" },
      { field: "Additive", value: "Crushed copper sulphate" },
      { field: "Video", value: "1920 × 1080 px, 32 s" },
    ],
    alt: "Three small glass containers in a dark room, each with a pale orange flame edged in green.",
    caption: "Video, 32 s. Press play to load it (4.9 MB).",
    post: "https://www.flowvis.org/2026/11/11/khalil-sidani-teams-third/",
  },
];
