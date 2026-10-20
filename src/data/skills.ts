// Skills matrix. Every entry links to where it is used, so a reader can check
// the claim. Sources: the project folders and Lilo's CV (Oct 2026).
export type Skill = { name: string; where: { label: string; href: string }[] };
export type SkillGroup = { group: string; skills: Skill[] };

const p = (slug: string, label: string) => ({ label, href: `/projects/${slug}/` });
const c = (anchor: string, label: string) => ({ label, href: `/coursework/#${anchor}` });
const beyond = (label: string) => ({ label, href: "/about/#beyond" });
const cv = { label: "CV", href: "/cv/" };

export const skillMatrix: SkillGroup[] = [
  {
    group: "Languages",
    skills: [
      { name: "Python", where: [p("hypersonic-solver", "Hypersonic solver"), p("debrisolver", "DebriSolver")] },
      {
        name: "MATLAB",
        where: [
          p("aircraft-design-toolbox", "Capstone weight model"),
          p("debrisolver", "DebriSolver maneuvers"),
          c("numerical-methods", "APPM 3050"),
        ],
      },
      { name: "C++", where: [p("cpp-rpg", "Text RPG"), p("candy-land", "Board game")] },
      { name: "Arduino (C)", where: [c("more", "ASEN 3300")] },
      { name: "C#, JavaScript, React Native", where: [cv] },
    ],
  },
  {
    group: "Simulation & CFD",
    skills: [
      { name: "Compressible similarity BL (BVP)", where: [p("hypersonic-solver", "Hypersonic solver")] },
      {
        name: "Finite differences (wave, heat)",
        where: [p("tsunami-simulation", "Tsunami"), c("numerical-methods", "APPM 3050")],
      },
      { name: "Panel methods & lifting line", where: [c("computational-aero", "ASEN 3802")] },
      { name: "Simulink 6-DOF", where: [p("sim6dof", "Sim6DOF")] },
      {
        name: "ODE integration & event detection",
        where: [p("target-shooting", "Target sim"), p("bottle-rocket", "Bottle rocket")],
      },
      { name: "Orbit propagation (2-body + J2), STMs", where: [p("debrisolver", "DebriSolver")] },
      { name: "ANSYS (structural)", where: [beyond("NASA RASC-AL")] },
      { name: "OpenRocket", where: [beyond("High-power rocketry")] },
    ],
  },
  {
    group: "Analysis & ML",
    skills: [
      { name: "XGBoost, SHAP", where: [p("debrisolver", "DebriSolver")] },
      { name: "Monte Carlo verification", where: [p("debrisolver", "DebriSolver")] },
      { name: "Constrained optimisation (fmincon, MultiStart)", where: [p("debrisolver", "DebriSolver")] },
      {
        name: "Regression, sweeps and sensitivity studies",
        where: [p("aircraft-design-toolbox", "Capstone design trades")],
      },
      { name: "Linearisation & modal analysis", where: [p("sim6dof", "Sim6DOF")] },
    ],
  },
  {
    group: "Tools",
    skills: [
      { name: "pytest", where: [p("hypersonic-solver", "144 tests")] },
      { name: "Git", where: [p("debrisolver", "Per-phase commits")] },
      {
        name: "NumPy, SciPy, pandas, Matplotlib",
        where: [p("hypersonic-solver", "Hypersonic solver"), p("debrisolver", "DebriSolver")],
      },
      { name: "Plotly", where: [p("debrisolver", "3D encounter scenes")] },
      { name: "Fusion 360 (CAD)", where: [beyond("High-power rocketry")] },
      { name: "Raspberry Pi", where: [cv] },
    ],
  },
  {
    group: "Lab & Experimental",
    skills: [
      { name: "Wind-tunnel pressure measurements", where: [c("experimental", "ASEN 2802")] },
      { name: "Thermocouple data reduction", where: [c("experimental", "ASEN 3802")] },
      { name: "Vacuum-chamber testing (LN₂ cooling)", where: [beyond("CubeSat payload")] },
      { name: "Flow visualisation (photography)", where: [{ label: "Flow Vis", href: "/flow-vis/" }] },
    ],
  },
];

// Short strip for the home page.
export const skillStrip = [
  "Python",
  "MATLAB / Simulink",
  "C++",
  "SciPy solve_bvp",
  "pytest",
  "XGBoost + SHAP",
  "fmincon",
  "Monte Carlo",
  "Git",
  "ANSYS",
];
