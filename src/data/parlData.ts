/**
 * Seed MP data — programmatically generated profiles for 543 LS + 245 RS MPs.
 * This file generates deterministic mock profiles based on real party seat distributions.
 * Will be replaced by scraped/AI-generated profiles in a later phase.
 */

import type { MPProfile, House, Alliance, PolicyPositions, BehavioralTraits } from "@/src/types/mp";
import { PARTIES } from "./partyProfiles";

// ── Indian states and their constituencies ────────────────────
const STATES: Array<{ state: string; lsSeats: number; rsSeats: number }> = [
  { state: "Uttar Pradesh", lsSeats: 80, rsSeats: 31 },
  { state: "Maharashtra", lsSeats: 48, rsSeats: 19 },
  { state: "West Bengal", lsSeats: 42, rsSeats: 16 },
  { state: "Bihar", lsSeats: 40, rsSeats: 16 },
  { state: "Tamil Nadu", lsSeats: 39, rsSeats: 18 },
  { state: "Madhya Pradesh", lsSeats: 29, rsSeats: 11 },
  { state: "Karnataka", lsSeats: 28, rsSeats: 12 },
  { state: "Gujarat", lsSeats: 26, rsSeats: 11 },
  { state: "Rajasthan", lsSeats: 25, rsSeats: 10 },
  { state: "Andhra Pradesh", lsSeats: 25, rsSeats: 11 },
  { state: "Odisha", lsSeats: 21, rsSeats: 10 },
  { state: "Kerala", lsSeats: 20, rsSeats: 9 },
  { state: "Telangana", lsSeats: 17, rsSeats: 7 },
  { state: "Assam", lsSeats: 14, rsSeats: 7 },
  { state: "Jharkhand", lsSeats: 14, rsSeats: 6 },
  { state: "Punjab", lsSeats: 13, rsSeats: 7 },
  { state: "Chhattisgarh", lsSeats: 11, rsSeats: 5 },
  { state: "Haryana", lsSeats: 10, rsSeats: 5 },
  { state: "Delhi", lsSeats: 7, rsSeats: 3 },
  { state: "Jammu & Kashmir", lsSeats: 5, rsSeats: 4 },
  { state: "Uttarakhand", lsSeats: 5, rsSeats: 3 },
  { state: "Himachal Pradesh", lsSeats: 4, rsSeats: 3 },
  { state: "Tripura", lsSeats: 2, rsSeats: 1 },
  { state: "Meghalaya", lsSeats: 2, rsSeats: 1 },
  { state: "Manipur", lsSeats: 2, rsSeats: 1 },
  { state: "Nagaland", lsSeats: 1, rsSeats: 1 },
  { state: "Arunachal Pradesh", lsSeats: 2, rsSeats: 1 },
  { state: "Mizoram", lsSeats: 1, rsSeats: 1 },
  { state: "Sikkim", lsSeats: 1, rsSeats: 1 },
  { state: "Goa", lsSeats: 2, rsSeats: 1 },
];

// ── Party seat allocations (approximate 18th LS) ────────────
interface PartySeatAlloc {
  party: string;
  alliance: Alliance;
  lsSeats: number;
  rsSeats: number;
}

const SEAT_ALLOC: PartySeatAlloc[] = [
  { party: "BJP", alliance: "NDA", lsSeats: 240, rsSeats: 86 },
  { party: "INC", alliance: "INDIA", lsSeats: 99, rsSeats: 26 },
  { party: "SP", alliance: "INDIA", lsSeats: 37, rsSeats: 4 },
  { party: "TMC", alliance: "INDIA", lsSeats: 29, rsSeats: 13 },
  { party: "DMK", alliance: "INDIA", lsSeats: 22, rsSeats: 10 },
  { party: "TDP", alliance: "NDA", lsSeats: 16, rsSeats: 3 },
  { party: "JD(U)", alliance: "NDA", lsSeats: 12, rsSeats: 5 },
  { party: "SHS", alliance: "NDA", lsSeats: 7, rsSeats: 3 },
  { party: "LJP", alliance: "NDA", lsSeats: 5, rsSeats: 1 },
  { party: "AAP", alliance: "INDIA", lsSeats: 3, rsSeats: 10 },
  { party: "CPI(M)", alliance: "INDIA", lsSeats: 4, rsSeats: 5 },
  { party: "YSRCP", alliance: "none", lsSeats: 4, rsSeats: 6 },
  { party: "BJD", alliance: "none", lsSeats: 1, rsSeats: 8 },
  { party: "BSP", alliance: "none", lsSeats: 0, rsSeats: 1 },
  // Fill remaining with NDA "other" and independent
  { party: "NDA-Other", alliance: "NDA", lsSeats: 20, rsSeats: 12 },
  { party: "INDIA-Other", alliance: "INDIA", lsSeats: 24, rsSeats: 16 },
  { party: "IND", alliance: "other", lsSeats: 20, rsSeats: 36 },
];

// ── Seeded random (deterministic) ────────────────────────────
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ── Helper: generate policy positions blending party ideology ──
function generateMPIssues(
  partyIdeology: PolicyPositions | undefined,
  rng: () => number
): PolicyPositions {
  const base: PolicyPositions = partyIdeology ?? {
    hindu_nationalism: 0.5, economic_liberalization: 0.5, federalism: 0.5,
    social_welfare: 0.5, defense_security: 0.5, agricultural_policy: 0.5,
    caste_reservation: 0.5, environmental_regulation: 0.5, digital_tech_policy: 0.5,
    foreign_policy: 0.5, labor_reform: 0.5, education_policy: 0.5,
    healthcare_policy: 0.5, minority_rights: 0.5, anti_corruption: 0.5,
  };

  const result: Record<string, number> = {};
  for (const [key, val] of Object.entries(base)) {
    // Add ±0.1 noise clamped to [0, 1]
    const noise = (rng() - 0.5) * 0.2;
    result[key] = Math.max(0, Math.min(1, val + noise));
  }
  return result as unknown as PolicyPositions;
}

function generateBehavior(
  partyDiscipline: number,
  rng: () => number
): BehavioralTraits {
  return {
    party_loyalty: Math.max(0.5, Math.min(1, partyDiscipline + (rng() - 0.5) * 0.2)),
    whip_defiance_risk: Math.max(0, Math.min(0.3, (1 - partyDiscipline) * 0.3 + rng() * 0.05)),
    coalition_flexibility: 0.3 + rng() * 0.4,
    regional_allegiance: 0.3 + rng() * 0.5,
    ideological_rigidity: 0.3 + rng() * 0.4,
    media_influence: rng() * 0.5,
    corporate_proximity: rng() * 0.5,
    grassroots_connection: 0.4 + rng() * 0.4,
  };
}

// ── Indian first names and surnames by region ─────────────────
const FIRST_NAMES = [
  "Rajesh", "Suresh", "Amit", "Priya", "Sunita", "Ramesh", "Vijay",
  "Anita", "Sanjay", "Kavita", "Deepak", "Meena", "Arun", "Geeta",
  "Manoj", "Lakshmi", "Ravi", "Rekha", "Ashok", "Sarita", "Vinod",
  "Kamla", "Prakash", "Usha", "Mohan", "Nirmala", "Sunil", "Poonam",
  "Rahul", "Smita", "Ajay", "Seema", "Nitin", "Aarti", "Kiran",
  "Jaya", "Dinesh", "Padma", "Hemant", "Asha", "Gaurav", "Neha",
  "Harish", "Shanti", "Mukesh", "Sudha", "Yogesh", "Manju", "Rakesh",
  "Rita", "Bharat", "Sita", "Gopal", "Lata", "Pawan", "Durga",
  "Satish", "Kamini", "Naresh", "Indira", "Balram", "Pushpa", "Dev",
  "Kalpana", "Jagdish", "Rukmini", "Trilok", "Shobha", "Omprakash",
  "Saroj", "Mahesh", "Vimla", "Dharmendra", "Gayatri", "Chandra",
];

const SURNAMES = [
  "Kumar", "Sharma", "Singh", "Verma", "Gupta", "Patel", "Reddy",
  "Nair", "Pillai", "Mukherjee", "Banerjee", "Das", "Rao", "Iyer",
  "Naidu", "Choudhary", "Tiwari", "Yadav", "Mishra", "Pandey",
  "Joshi", "Saxena", "Srivastava", "Thakur", "Bhat", "Hegde",
  "Deshmukh", "Patil", "Pawar", "Shinde", "Kaur", "Gill", "Sodhi",
  "Bose", "Ghosh", "Sen", "Roy", "Dutta", "Chatterjee", "Swamy",
  "Gowda", "Raju", "Sethi", "Khanna", "Kapoor", "Malhotra",
  "Mehta", "Shah", "Gandhi", "Chavan", "More", "Kulkarni",
];

const CONSTITUENCY_PREFIXES = [
  "North", "South", "East", "West", "Central", "New", "Old", "Greater",
];

const ARCHETYPES = [
  "party_loyalist", "grassroots", "technocrat", "ideologue",
  "regional_satrap", "dynast", "independent_voice",
] as const;

const TEMPERAMENTS = ["measured", "firebrand", "populist", "diplomatic"] as const;
const CONSTITUENCY_TYPES = ["urban", "semi-urban", "rural", "tribal"] as const;
const SEAT_SAFETY_VALUES = ["safe", "competitive", "vulnerable"] as const;

// ── Main generation function ─────────────────────────────────

function generateMembers(house: House): MPProfile[] {
  const members: MPProfile[] = [];
  const rng = seededRandom(house === "lok_sabha" ? 42 : 7777);

  let stateIdx = 0;
  let seatInState = 0;
  const totalSeats = house === "lok_sabha" ? 543 : 245;

  for (const alloc of SEAT_ALLOC) {
    const seats = house === "lok_sabha" ? alloc.lsSeats : alloc.rsSeats;
    const partyProfile = PARTIES.find((p) => p.short_name === alloc.party);

    for (let i = 0; i < seats; i++) {
      // Pick state
      const stateInfo = STATES[stateIdx % STATES.length];
      const maxSeatsInState = house === "lok_sabha" ? stateInfo.lsSeats : stateInfo.rsSeats;

      const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
      const surname = SURNAMES[Math.floor(rng() * SURNAMES.length)];
      const name = `${firstName} ${surname}`;

      const prefix = CONSTITUENCY_PREFIXES[Math.floor(rng() * CONSTITUENCY_PREFIXES.length)];
      const constituency = `${prefix} ${stateInfo.state.split(" ")[0]}`;

      const isMinister = alloc.alliance === "NDA" && i < 2 && rng() > 0.6;
      const isLeader = i === 0 && seats > 5;

      const id = `${house === "lok_sabha" ? "LS" : "RS"}-${alloc.party}-${i}`;

      members.push({
        id,
        name,
        constituency: house === "lok_sabha" ? constituency : stateInfo.state,
        state: stateInfo.state,
        house,
        party: alloc.party,
        alliance: alloc.alliance === "none" ? "none" : alloc.alliance as Alliance,
        tier: (isMinister || isLeader) ? 1 : 2,
        terms_served: Math.floor(rng() * 4) + 1,
        is_minister: isMinister,
        is_party_leader: isLeader,
        issues: generateMPIssues(partyProfile?.ideology, rng),
        behavior: generateBehavior(partyProfile?.whip_discipline ?? 0.8, rng),
        anti_defection: {
          has_defied_whip_before: rng() < 0.03,
          defection_risk: rng() < 0.05 ? "moderate" : rng() < 0.15 ? "low" : "negligible",
          protected_by_numbers: false,
        },
        constituency_type: CONSTITUENCY_TYPES[Math.floor(rng() * CONSTITUENCY_TYPES.length)],
        reserved_category: rng() < 0.18 ? "SC" : rng() < 0.08 ? "ST" : "general",
        seat_safety: SEAT_SAFETY_VALUES[Math.floor(rng() * SEAT_SAFETY_VALUES.length)],
        archetype: ARCHETYPES[Math.floor(rng() * ARCHETYPES.length)],
        temperament: TEMPERAMENTS[Math.floor(rng() * TEMPERAMENTS.length)],
        known_for: `${alloc.party} representative from ${stateInfo.state}`,
      });

      seatInState++;
      if (seatInState >= maxSeatsInState) {
        stateIdx++;
        seatInState = 0;
      }
    }
  }

  return members.slice(0, totalSeats);
}

// ── SC Justices ──────────────────────────────────────────────
import type { JusticeProfile } from "@/src/types/justice";

const JUSTICE_NAMES = [
  "D.Y. Chandrachud", "Sanjiv Khanna", "B.R. Gavai", "Surya Kant",
  "Hrishikesh Roy", "Abhay S. Oka", "Vikram Nath", "J.K. Maheshwari",
  "P.S. Narasimha", "Manoj Misra", "Rajesh Bindal", "Aravind Kumar",
  "C.T. Ravikumar", "Bela M. Trivedi", "Pankaj Mithal",
];

function generateJustices(): JusticeProfile[] {
  const rng = seededRandom(9999);
  return JUSTICE_NAMES.map((name, i) => ({
    id: `SC-${i}`,
    name,
    is_cji: i === 0,
    appointed_year: 2015 + Math.floor(rng() * 10),
    constitutional_positions: {
      fundamental_rights: 0.5 + (rng() - 0.5) * 0.4,
      directive_principles: 0.5 + (rng() - 0.5) * 0.4,
      basic_structure: 0.5 + (rng() - 0.5) * 0.4,
      federal_balance: 0.5 + (rng() - 0.5) * 0.4,
      equality_provisions: 0.5 + (rng() - 0.5) * 0.4,
      religious_freedom: 0.5 + (rng() - 0.5) * 0.4,
      right_to_property: 0.5 + (rng() - 0.5) * 0.4,
      freedom_of_speech: 0.5 + (rng() - 0.5) * 0.4,
      right_to_privacy: 0.5 + (rng() - 0.5) * 0.4,
      due_process: 0.5 + (rng() - 0.5) * 0.4,
    },
    deference_to_legislature: 0.3 + rng() * 0.5,
    willingness_to_overturn: 0.2 + rng() * 0.5,
    pil_receptiveness: 0.3 + rng() * 0.5,
    known_for: `Constitutional law expertise`,
  }));
}

// ── Exports ──────────────────────────────────────────────────

export const LS_MEMBERS: MPProfile[] = generateMembers("lok_sabha");
export const RS_MEMBERS: MPProfile[] = generateMembers("rajya_sabha");
export const ALL_MEMBERS: MPProfile[] = [...LS_MEMBERS, ...RS_MEMBERS];
export const SC_JUSTICES: JusticeProfile[] = generateJustices();
