export type House = "lok_sabha" | "rajya_sabha";
export type Alliance = "NDA" | "INDIA" | "other" | "none";
export type ConstituencyType = "urban" | "semi-urban" | "rural" | "tribal";
export type ReservedCategory = "general" | "SC" | "ST";
export type SeatSafety = "safe" | "competitive" | "vulnerable";
export type DefectionRisk = "negligible" | "low" | "moderate" | "high";
export type ProfileTier = 1 | 2;

export type Archetype =
  | "dynast"
  | "grassroots"
  | "technocrat"
  | "ideologue"
  | "regional_satrap"
  | "party_loyalist"
  | "independent_voice";

export type Temperament =
  | "measured"
  | "firebrand"
  | "populist"
  | "diplomatic";

/** 15 Indian policy dimensions — 0.0 to 1.0 */
export interface PolicyPositions {
  /** 0 = secular, 1 = hindutva */
  hindu_nationalism: number;
  /** 0 = socialist, 1 = free market */
  economic_liberalization: number;
  /** 0 = strong center, 1 = state autonomy */
  federalism: number;
  /** 0 = minimal, 1 = expansive */
  social_welfare: number;
  /** 0 = dovish, 1 = hawkish */
  defense_security: number;
  /** 0 = corporate reform, 1 = farmer protectionist */
  agricultural_policy: number;
  /** 0 = merit-only, 1 = expand reservations */
  caste_reservation: number;
  /** 0 = development first, 1 = green priority */
  environmental_regulation: number;
  /** 0 = minimal regulation, 1 = heavy regulation */
  digital_tech_policy: number;
  /** 0 = non-aligned, 1 = western-aligned */
  foreign_policy: number;
  /** 0 = pro-worker, 1 = pro-employer */
  labor_reform: number;
  /** 0 = state-controlled, 1 = privatized */
  education_policy: number;
  /** 0 = private-led, 1 = universal public */
  healthcare_policy: number;
  /** 0 = uniform laws, 1 = protect customs */
  minority_rights: number;
  /** 0 = status quo, 1 = aggressive reform */
  anti_corruption: number;
}

export type PolicyDimension = keyof PolicyPositions;

export const POLICY_DIMENSIONS: PolicyDimension[] = [
  "hindu_nationalism",
  "economic_liberalization",
  "federalism",
  "social_welfare",
  "defense_security",
  "agricultural_policy",
  "caste_reservation",
  "environmental_regulation",
  "digital_tech_policy",
  "foreign_policy",
  "labor_reform",
  "education_policy",
  "healthcare_policy",
  "minority_rights",
  "anti_corruption",
];

/** 8 behavioral traits — 0.0 to 1.0 */
export interface BehavioralTraits {
  party_loyalty: number;
  whip_defiance_risk: number;
  coalition_flexibility: number;
  regional_allegiance: number;
  ideological_rigidity: number;
  media_influence: number;
  corporate_proximity: number;
  grassroots_connection: number;
}

export interface AntiDefectionProfile {
  has_defied_whip_before: boolean;
  defection_risk: DefectionRisk;
  /** True if 2/3 of party MPs split — then it's not defection */
  protected_by_numbers: boolean;
}

export interface MPProfile {
  id: string;
  name: string;
  constituency: string;
  state: string;
  house: House;
  party: string;
  alliance: Alliance;
  tier: ProfileTier;
  terms_served: number;
  is_minister: boolean;
  portfolio?: string;
  is_party_leader: boolean;
  leadership_role?: string;

  issues: PolicyPositions;
  behavior: BehavioralTraits;
  anti_defection: AntiDefectionProfile;

  constituency_type: ConstituencyType;
  reserved_category: ReservedCategory;
  seat_safety: SeatSafety;

  archetype: Archetype;
  temperament: Temperament;
  known_for: string;

  // Tier-1 only
  criminal_cases_pending?: number;
  declared_assets_crore?: number;
  dominant_issues?: string[];
  key_industries?: string[];
}
