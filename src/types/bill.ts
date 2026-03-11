import type { House, PolicyDimension } from "./mp";

export type BillType = "ordinary" | "money" | "constitutional_amendment";
export type BillIntroducer = "government" | "private_member";
export type PartyStance = "SUPPORT" | "OPPOSE" | "ABSTAIN";
export type BillLean = "left" | "center" | "right";

export type ConstitutionalDimension =
  | "fundamental_rights"
  | "directive_principles"
  | "basic_structure"
  | "federal_balance"
  | "equality_provisions"
  | "religious_freedom"
  | "right_to_property"
  | "freedom_of_speech"
  | "right_to_privacy"
  | "due_process";

export const CONSTITUTIONAL_DIMENSIONS: ConstitutionalDimension[] = [
  "fundamental_rights",
  "directive_principles",
  "basic_structure",
  "federal_balance",
  "equality_provisions",
  "religious_freedom",
  "right_to_property",
  "freedom_of_speech",
  "right_to_privacy",
  "due_process",
];

export interface BillObject {
  name: string;
  bill_type: BillType;
  introduced_by: BillIntroducer;
  introducing_house: House;
  ministry_responsible: string;

  /** Per-dimension importance weight (0–0.95) */
  issueWeights: Partial<Record<PolicyDimension, number>>;
  /** Per-dimension stance (0–1) */
  issuePositions: Partial<Record<PolicyDimension, number>>;

  affected_industries: string[];
  affected_states: string[];
  caste_implications: string;
  religious_implications: string;

  /** Per-constitutional-dimension weight */
  constitutional_dimensions: Partial<
    Record<ConstitutionalDimension, number>
  >;

  controversy_level: number;
  requires_special_majority: boolean;
  requires_state_ratification: boolean;
  is_whip_issued: boolean;

  lean: BillLean;
  isAbsurd: boolean;
}
