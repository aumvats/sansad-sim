import type { BillObject, PartyStance } from "@/src/types/bill";
import type { MPProfile, PolicyDimension } from "@/src/types/mp";

/**
 * Layer 2: Determine if an individual MP defies the party whip.
 * This is RARE (~2% base) due to the anti-defection law.
 * Returns true if the MP defies the whip (votes opposite to party stance).
 */
export function computeWhipDefiance(
  mp: MPProfile,
  partyStance: PartyStance,
  bill: BillObject
): boolean {
  // Loyal soldiers never defy
  if (mp.behavior.party_loyalty > 0.9) return false;

  // Private member bills without whip → no defiance concept
  if (bill.introduced_by === "private_member" && !bill.is_whip_issued) {
    return false; // Will use individual vote instead
  }

  let defectionRisk = 0.02; // 2% base — extremely rare

  // Constituency conflict increases risk
  const constituencyConflict = checkConstituencyConflict(mp, bill);
  if (constituencyConflict) {
    defectionRisk += mp.behavior.regional_allegiance * 0.1;
  }

  // Prior defiance history
  if (mp.anti_defection.has_defied_whip_before) {
    defectionRisk += 0.05;
  }

  // High defection risk profile
  if (mp.anti_defection.defection_risk === "high") {
    defectionRisk += 0.08;
  } else if (mp.anti_defection.defection_risk === "moderate") {
    defectionRisk += 0.04;
  }

  // The 2/3 rule: if 2/3 of party MPs split, it's not defection
  if (mp.anti_defection.protected_by_numbers) {
    defectionRisk += 0.15; // Much less risky
  }

  // Low party loyalty increases risk
  if (mp.behavior.party_loyalty < 0.5) {
    defectionRisk += 0.05;
  }

  // Add noise
  const noise = Math.random() * 0.05;

  // Defiance happens only when risk + noise exceeds high threshold
  return defectionRisk + noise > 0.95;
}

/**
 * For free votes (no whip): compute individual MP's vote based on personal alignment.
 */
export function computeIndividualVote(
  mp: MPProfile,
  bill: BillObject
): boolean {
  let alignment = 0;
  let totalWeight = 0;

  for (const [dim, weight] of Object.entries(bill.issueWeights)) {
    const dimension = dim as PolicyDimension;
    const billPos = bill.issuePositions[dimension] ?? 0.5;
    const mpPos = mp.issues[dimension] ?? 0.5;
    const distance = Math.abs(mpPos - billPos);

    alignment += (1 - distance) * weight;
    totalWeight += weight;
  }

  const baseProb = totalWeight > 0 ? alignment / totalWeight : 0.5;

  // Add personality noise
  const noise =
    (1 - mp.behavior.ideological_rigidity) * (Math.random() - 0.5) * 0.3;

  return baseProb + noise > 0.5;
}

/** Check if a bill conflicts with the MP's constituency interests */
function checkConstituencyConflict(
  mp: MPProfile,
  bill: BillObject
): boolean {
  // If the bill affects the MP's state and the MP has high regional allegiance
  if (
    bill.affected_states.length > 0 &&
    bill.affected_states.includes(mp.state)
  ) {
    // Check if the bill opposes the MP's dominant issues
    if (mp.dominant_issues) {
      for (const issue of mp.dominant_issues) {
        const dim = issue as PolicyDimension;
        const billPos = bill.issuePositions[dim];
        const mpPos = mp.issues[dim];
        if (
          billPos !== undefined &&
          mpPos !== undefined &&
          Math.abs(billPos - mpPos) > 0.5
        ) {
          return true;
        }
      }
    }
  }
  return false;
}
