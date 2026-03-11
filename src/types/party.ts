import type { Alliance, PolicyDimension, PolicyPositions } from "./mp";

export type PartyType = "national" | "state" | "registered_unrecognized";
export type AllianceRole = "anchor" | "partner" | "outside_support";
export type BargainingLeverage = "high" | "medium" | "low";

export interface PartyProfile {
  name: string;
  short_name: string;
  symbol: string;
  type: PartyType;
  alliance: Alliance;
  alliance_role: AllianceRole;

  lok_sabha_seats: number;
  rajya_sabha_seats: number;
  state_governments_held: string[];

  /** Party-level policy positions — PRIMARY driver of voting */
  ideology: PolicyPositions;

  /** How strictly the party enforces the whip (0–1) */
  whip_discipline: number;
  /** How reliably the party honors coalition commitments (0–1) */
  coalition_reliability: number;
  /** Tendency to oppose for opposition's sake (0–1) */
  opposition_instinct: number;
  /** National vs state-specific focus (0 = national, 1 = regional) */
  regional_focus: number;
  /** Does the party need the ruling coalition for survival? (0–1) */
  government_dependency: number;

  bargaining_leverage: BargainingLeverage;
  /** Policy dimensions the party will never compromise on */
  known_dealbreakers: PolicyDimension[];
  /** Party short_names of bitter rivals */
  bitter_rivals: string[];

  /** Primary hex color for visualization */
  color: string;
  /** Lighter tint for tooltip backgrounds */
  tint: string;
}
