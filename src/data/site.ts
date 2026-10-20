// Site-wide facts. Placeholders are marked TODO(Lilo); see TODO_FOR_LILO.md §3.
export const site = {
  name: "Khalil Sidani",
  nickname: "Lilo",
  title: "Khalil Sidani · Aerospace engineering, hypersonics & CFD",
  description:
    "Engineering portfolio of Khalil (Lilo) Sidani: hypersonic boundary-layer and heating solvers, conjunction-risk analysis, flight simulation and aircraft design. CU Boulder aerospace engineering.",
  positioning: "Aerospace engineer building simulation tools for hypersonic flight.",
  location: "Boulder, Colorado · from Bahrain",
  // TODO(Lilo): LinkedIn URL.
  email: "khsi4021@colorado.edu",
  linkedin: "TODO_LINKEDIN",
  github: "https://github.com/khsi4021",
  githubUser: "khsi4021",
  cvPath: "/cv/Khalil-Sidani-CV.pdf",
  degree: "B.S. Aerospace Engineering Sciences, University of Colorado Boulder, expected May 2027",
  minors: "Dual minor in Applied Mathematics and Engineering Management",
  applying: "Applying to aerospace MS/PhD programs for Fall 2027 (CFD and hypersonics).",
};

export const hasEmail = !site.email.startsWith("TODO");
export const hasLinkedIn = !site.linkedin.startsWith("TODO");

export const nav = [
  { href: "/projects/", label: "Projects" },
  { href: "/coursework/", label: "Coursework" },
  { href: "/research/", label: "Research" },
  { href: "/flow-vis/", label: "Flow Vis" },
  { href: "/about/", label: "About" },
  { href: "/cv/", label: "CV" },
  { href: "/contact/", label: "Contact" },
];
