// Site-wide facts. Placeholders are marked TODO(Khalil).
export const site = {
  name: "Khalil Sidani",
  title: "Khalil Sidani · Aerospace engineering, hypersonics & CFD",
  description:
    "Portfolio of Khalil Sidani: hypersonic boundary-layer and heating solvers, conjunction-risk analysis, flight simulation and aircraft design. CU Boulder aerospace engineering.",
  positioning: "Aerospace engineer building simulation tools for hypersonic flight.",
  location: "Boulder, Colorado · from Bahrain",
  // TODO(Khalil): LinkedIn URL.
  email: "khsi4021@colorado.edu",
  // Shown on the Contact page only.
  phone: { display: "+1 (407) 718-0695", tel: "+14077180695" },
  linkedin: "TODO_LINKEDIN",
  github: "https://github.com/khsi4021",
  githubUser: "khsi4021",
  cvPath: "/cv/Khalil-Sidani-CV.pdf",
  // The plain statement of the degree, used everywhere except the Home header.
  degree: "B.S. Aerospace Engineering Sciences, University of Colorado Boulder",
  // Home header only: the degree with the graduation date.
  degreeWithDate: "B.S. Aerospace Engineering Sciences, University of Colorado Boulder, expected May 2027",
  // From the CV.
  gpa: { cumulative: "3.274", major: "3.515" },
  minors: "Dual minor in Applied Mathematics and Engineering Management",
  applying: "Applying to aerospace MS/PhD programs for Fall 2027 (CFD and hypersonics).",
};

export const hasEmail = !site.email.startsWith("TODO");
export const hasLinkedIn = !site.linkedin.startsWith("TODO");

export const nav = [
  { href: "/research/", label: "Research" },
  { href: "/projects/", label: "Projects" },
  { href: "/coursework/", label: "Coursework" },
  { href: "/flow-vis/", label: "Flow Visualization" },
  { href: "/cv/", label: "CV" },
  { href: "/contact/", label: "Contact" },
];
