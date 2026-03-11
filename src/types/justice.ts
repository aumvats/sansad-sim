import type { ConstitutionalDimension } from "./bill";

export interface JusticeProfile {
  id: string;
  name: string;
  is_cji: boolean;
  appointed_year: number;

  /** Per-constitutional-dimension position (0–1) */
  constitutional_positions: Record<ConstitutionalDimension, number>;

  /** Tendency to defer to Parliament (0–1) */
  deference_to_legislature: number;
  /** Willingness to strike down laws (0–1) */
  willingness_to_overturn: number;
  /** Receptiveness to PIL/public interest (0–1) */
  pil_receptiveness: number;

  known_for: string;
}

export interface SCResult {
  challenged: boolean;
  benchSize?: 5 | 7 | 9;
  votes?: Array<{ justiceId: string; upheld: boolean }>;
  result?: "UPHELD" | "STRUCK_DOWN" | "NOT_CHALLENGED";
}
