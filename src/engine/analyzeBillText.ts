import type { BillObject, BillLean } from "@/src/types/bill";
import type { PolicyDimension } from "@/src/types/mp";
import { POLICY_DIMENSIONS } from "@/src/types/mp";
import {
  ISSUE_KEYWORDS,
  MONEY_BILL_KEYWORDS,
  AMENDMENT_KEYWORDS,
  ABSURD_PATTERNS,
} from "@/src/data/keywords";

// List of Indian states for affected_states detection
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh",
];

/**
 * Client-side bill text analysis using keyword matching.
 * No API call needed — runs entirely in the browser.
 */
export function analyzeBillText(text: string): BillObject {
  const lowerText = text.toLowerCase();

  // Step 1: Absurdity detection
  const isAbsurd = ABSURD_PATTERNS.some((p) => p.test(text));

  // Step 2: Bill type detection
  const isMoney = MONEY_BILL_KEYWORDS.some((kw) => lowerText.includes(kw));
  const isAmendment = AMENDMENT_KEYWORDS.some((kw) =>
    lowerText.includes(kw)
  );

  const bill_type = isAmendment
    ? "constitutional_amendment"
    : isMoney
      ? "money"
      : "ordinary";

  // Step 3: Keyword matching across 15 dimensions
  const issueWeights: Partial<Record<PolicyDimension, number>> = {};
  const issuePositions: Partial<Record<PolicyDimension, number>> = {};

  let totalRightMatches = 0;
  let totalLeftMatches = 0;
  let totalMatches = 0;

  for (const dim of POLICY_DIMENSIONS) {
    const kw = ISSUE_KEYWORDS[dim];
    const rightCount = countMatches(lowerText, kw.right);
    const leftCount = countMatches(lowerText, kw.left);
    const neutralCount = countMatches(lowerText, kw.neutral);
    const dimTotal = rightCount + leftCount + neutralCount;

    if (dimTotal > 0) {
      // Weight: more matches = more confident, capped at 0.95
      issueWeights[dim] = Math.min(dimTotal * 0.15, 0.95);

      // Position: right keywords push toward 1.0
      issuePositions[dim] =
        0.15 + (rightCount / dimTotal) * 0.7;

      totalRightMatches += rightCount;
      totalLeftMatches += leftCount;
      totalMatches += dimTotal;
    }
  }

  // Step 4: Lean detection
  let lean: BillLean = "center";
  if (totalMatches > 0) {
    const rightRatio = totalRightMatches / totalMatches;
    if (rightRatio > 0.6) lean = "right";
    else if (rightRatio < 0.4) lean = "left";
  }

  // Step 5: Affected states detection
  const affected_states = INDIAN_STATES.filter((state) =>
    lowerText.includes(state.toLowerCase())
  );

  // Step 6: Controversy level
  let controversy = 0.4; // baseline
  if (isAbsurd) controversy = 1.0;
  else if (totalMatches === 0) controversy = 0.75; // gibberish
  else if (lean !== "center") controversy = 0.7;

  // Step 7: Constitutional dimensions (simplified)
  const constitutional_dimensions: Partial<
    Record<string, number>
  > = {};

  if (isAmendment) {
    constitutional_dimensions.basic_structure = 0.7;
    constitutional_dimensions.fundamental_rights = 0.5;
  }
  if (issueWeights.minority_rights && issueWeights.minority_rights > 0.5) {
    constitutional_dimensions.religious_freedom = 0.6;
    constitutional_dimensions.equality_provisions = 0.5;
  }
  if (issueWeights.federalism && issueWeights.federalism > 0.5) {
    constitutional_dimensions.federal_balance = 0.6;
  }

  return {
    name: generateBillName(text),
    bill_type,
    introduced_by: "government",
    introducing_house: isMoney ? "lok_sabha" : "lok_sabha",
    ministry_responsible: "Government of India",
    issueWeights,
    issuePositions,
    affected_industries: [],
    affected_states,
    caste_implications: "",
    religious_implications: "",
    constitutional_dimensions,
    controversy_level: controversy,
    requires_special_majority: bill_type === "constitutional_amendment",
    requires_state_ratification: false,
    is_whip_issued: true,
    lean,
    isAbsurd,
  };
}

function countMatches(text: string, keywords: string[]): number {
  return keywords.reduce((count, kw) => {
    const regex = new RegExp(kw.toLowerCase(), "gi");
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}

function generateBillName(text: string): string {
  // Take first ~60 chars, clean up, add "Bill" if not present
  const clean = text
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);

  if (clean.toLowerCase().includes("bill") || clean.toLowerCase().includes("act")) {
    return clean;
  }
  return clean + " Bill";
}
