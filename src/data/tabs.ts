export const TAB_LABELS = {
  overview: "Overview",
  technical: "Technical",
  results: "Results",
  reflection: "Reflection",
  code: "Code",
} as const;
export type TabId = keyof typeof TAB_LABELS;
