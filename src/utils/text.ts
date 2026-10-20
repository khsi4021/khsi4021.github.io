// Keep "6-DOF" and similar together when a title wraps.
export const nbHyphen = (s: string) => s.replace(/(\d)-(?=[A-Z])/g, "$1‑");
