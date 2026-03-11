/** SansadSim 3-Layer Color System (from doc 05 §3) */

// --- Layer 1: Surface tokens (sandstone palette) ---
export const surface = {
  bg: "#FAF6F0",
  bgDeep: "#F0E8DA",
  card: "#FFFFFF",
  border: "#DDD3C3",
  borderLight: "#EDE6D9",
} as const;

export const text = {
  primary: "#1C1710",
  secondary: "#5C5346",
  muted: "#9C8F7E",
  inverse: "#FFFFFF",
} as const;

// --- Layer 2: Chamber colors ---
export const lokSabha = {
  primary: "#0E6B5E",
  accent: "#1A9E8F",
  light: "#E6F5F2",
  dark: "#0A4F45",
} as const;

export const rajyaSabha = {
  primary: "#A8323C",
  accent: "#D94452",
  light: "#FBEAEC",
  dark: "#7A2028",
} as const;

// --- Layer 3: Party colors (primary + tint) ---
export const partyColors: Record<string, { primary: string; tint: string }> = {
  // NDA
  BJP: { primary: "#F47216", tint: "#FDE8D3" },
  "JD(U)": { primary: "#1E7A34", tint: "#D9F0E0" },
  TDP: { primary: "#FFD700", tint: "#FFF8DC" },
  SHS: { primary: "#E85D26", tint: "#FCDDD1" },
  LJP: { primary: "#2E86C1", tint: "#D6EAF8" },
  "NDA Other": { primary: "#C9A84C", tint: "#F5EDD5" },

  // INDIA
  INC: { primary: "#00AACC", tint: "#D4F1F9" },
  TMC: { primary: "#2BAF5B", tint: "#D5F0E0" },
  DMK: { primary: "#B22222", tint: "#F4D4D4" },
  AAP: { primary: "#005BAA", tint: "#D0E4F5" },
  SP: { primary: "#E23D28", tint: "#FBDBDB" },
  "INDIA Other": { primary: "#7C8EA0", tint: "#E2E7ED" },

  // Left
  "CPI(M)": { primary: "#CC0000", tint: "#F5CCCC" },
  CPI: { primary: "#E60000", tint: "#F5CCCC" },

  // Regional / Unaligned
  YSRCP: { primary: "#1565C0", tint: "#DDEAF7" },
  BJD: { primary: "#4CAF50", tint: "#D4EDDA" },
  BRS: { primary: "#E91E8C", tint: "#FDDDEF" },
  AIADMK: { primary: "#E53935", tint: "#FCDBDA" },
  BSP: { primary: "#1560BD", tint: "#D6E4F5" },
  "NCP-SP": { primary: "#004B87", tint: "#D0E0F0" },
  "SHS-UBT": { primary: "#FF5722", tint: "#FFE0D0" },

  // Fallback
  Other: { primary: "#9E9E9E", tint: "#ECECEC" },
  Independent: { primary: "#9E9E9E", tint: "#ECECEC" },
};

/** Get party color with fallback */
export function getPartyColor(shortName: string): {
  primary: string;
  tint: string;
} {
  return partyColors[shortName] ?? partyColors["Other"];
}

// --- Vote outcome colors ---
export const vote = {
  yea: "#1B7A3D",
  nay: "#B33030",
  abstain: "#9E8C6C",
} as const;

// --- Alliance meta colors ---
export const alliance = {
  NDA: "#F47216",
  INDIA: "#00AACC",
  Other: "#9E9E9E",
  majorityLine: "#1C1710",
} as const;
