import type { BillObject, PartyStance } from "@/src/types/bill";
import type { PolicyDimension } from "@/src/types/mp";
import type { PartyProfile } from "@/src/types/party";

/**
 * Layer 1: Determine a party's official stance on a bill.
 * This is the PRIMARY driver of voting in Indian Parliament.
 */
export function computePartyStance(
  party: PartyProfile,
  bill: BillObject,
  isRulingCoalition: boolean
): PartyStance {
  // Private member bills without whip → pure issue alignment
  if (bill.introduced_by === "private_member" && !bill.is_whip_issued) {
    return stanceFromAlignment(computeIssueAlignment(party.ideology, bill));
  }

  if (isRulingCoalition) {
    return computeRulingStance(party, bill);
  }

  if (party.alliance === "INDIA") {
    return computeOppositionStance(party, bill);
  }

  // Regional / unaligned parties
  return computeUnalignedStance(party, bill);
}

/** Ruling coalition logic */
function computeRulingStance(
  party: PartyProfile,
  bill: BillObject
): PartyStance {
  // Anchor party (BJP) always supports its own government bills
  if (party.alliance_role === "anchor") {
    return "SUPPORT";
  }

  // Coalition partner — check dealbreakers first
  const alignment = computeIssueAlignment(party.ideology, bill);

  for (const dealbreaker of party.known_dealbreakers) {
    const billWeight = bill.issueWeights[dealbreaker] ?? 0;
    const billPos = bill.issuePositions[dealbreaker] ?? 0.5;
    const partyPos = party.ideology[dealbreaker];

    // If the bill strongly touches a dealbreaker and opposes the party's position
    if (billWeight > 0.6 && Math.abs(partyPos - billPos) > 0.4) {
      // High-leverage partners can oppose; low-leverage partners abstain
      return party.bargaining_leverage === "high" ? "OPPOSE" : "ABSTAIN";
    }
  }

  // Coalition loyalty calculation
  const coalitionPull =
    party.coalition_reliability * 0.4 +
    party.government_dependency * 0.3 +
    (1 - leverageToNumber(party.bargaining_leverage)) * 0.3;

  const combined = coalitionPull + alignment;

  if (combined > 0.6) return "SUPPORT";
  if (combined > 0.35) return "ABSTAIN";
  return "OPPOSE"; // Coalition strain (rare)
}

/** Opposition alliance logic */
function computeOppositionStance(
  party: PartyProfile,
  bill: BillObject
): PartyStance {
  const alignment = computeIssueAlignment(party.ideology, bill);

  // High opposition instinct → oppose unless truly non-controversial
  if (party.opposition_instinct > 0.8) {
    if (alignment > 0.7 && bill.controversy_level < 0.3) {
      return "SUPPORT"; // Bipartisan on non-controversial
    }
    return "OPPOSE";
  }

  if (alignment > 0.7 && bill.controversy_level < 0.3) return "SUPPORT";
  if (alignment > 0.5) return "ABSTAIN";
  return "OPPOSE";
}

/** Regional/unaligned party logic */
function computeUnalignedStance(
  party: PartyProfile,
  bill: BillObject
): PartyStance {
  const alignment = computeIssueAlignment(party.ideology, bill);
  const regionalImpact = computeRegionalImpact(
    party.state_governments_held,
    bill.affected_states
  );

  // Strong regional impact overrides ideology
  if (regionalImpact > 0.5) return "SUPPORT";
  if (regionalImpact < -0.5) return "OPPOSE";

  // Fall through to alignment
  const combined = alignment + regionalImpact * 0.3;
  if (combined > 0.55) return "SUPPORT";
  if (combined > 0.35) return "ABSTAIN";
  return "OPPOSE";
}

/**
 * Weighted issue alignment between party ideology and bill positions.
 * Returns 0–1 (1 = perfect alignment).
 */
function computeIssueAlignment(
  partyIdeology: Record<PolicyDimension, number>,
  bill: BillObject
): number {
  let alignment = 0;
  let totalWeight = 0;

  for (const [dim, weight] of Object.entries(bill.issueWeights)) {
    const dimension = dim as PolicyDimension;
    const billPos = bill.issuePositions[dimension] ?? 0.5;
    const partyPos = partyIdeology[dimension] ?? 0.5;
    const distance = Math.abs(partyPos - billPos);

    alignment += (1 - distance) * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? alignment / totalWeight : 0.5;
}

/** Regional impact: positive if bill helps party's states, negative if hurts */
function computeRegionalImpact(
  partyStates: string[],
  billStates: string[]
): number {
  if (billStates.length === 0 || partyStates.length === 0) return 0;

  const overlap = partyStates.filter((s) => billStates.includes(s));
  if (overlap.length === 0) return 0;

  // More overlap = stronger impact (positive for now — could be refined)
  return (overlap.length / partyStates.length) * 0.8;
}

function leverageToNumber(leverage: "high" | "medium" | "low"): number {
  switch (leverage) {
    case "high": return 0.8;
    case "medium": return 0.5;
    case "low": return 0.2;
  }
}

function stanceFromAlignment(alignment: number): PartyStance {
  if (alignment > 0.6) return "SUPPORT";
  if (alignment > 0.4) return "ABSTAIN";
  return "OPPOSE";
}
