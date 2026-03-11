import type { BillObject, ConstitutionalDimension } from "@/src/types/bill";
import type { JusticeProfile, SCResult } from "@/src/types/justice";

/**
 * Post-enactment Supreme Court review.
 * Unlike the US (pre-enactment), India's SC reviews laws AFTER they're passed,
 * via PILs or direct constitutional challenges.
 * SC can strike down even Constitutional Amendments under Basic Structure Doctrine.
 */
export function computeSCReview(
  bill: BillObject,
  justices: JusticeProfile[]
): SCResult {
  // Step 1: Will the law be challenged?
  const challengeProb = computeChallengeProbability(bill);

  if (Math.random() > challengeProb) {
    return { challenged: false, result: "NOT_CHALLENGED" };
  }

  // Step 2: Determine bench size based on constitutional weight
  const constitutionalWeight = Object.values(
    bill.constitutional_dimensions
  ).reduce((sum, w) => sum + w, 0);

  const benchSize: 5 | 7 | 9 =
    constitutionalWeight > 2.0 ? 9 : constitutionalWeight > 1.0 ? 7 : 5;

  // Step 3: Select bench (CJI + senior-most justices)
  const bench = selectBench(justices, benchSize);

  // Step 4: Each justice votes
  const votes = bench.map((justice) => ({
    justiceId: justice.id,
    upheld: computeJusticeVote(justice, bill),
  }));

  const upheldCount = votes.filter((v) => v.upheld).length;
  const majority = Math.ceil(benchSize / 2);

  return {
    challenged: true,
    benchSize,
    votes,
    result: upheldCount >= majority ? "UPHELD" : "STRUCK_DOWN",
  };
}

function computeChallengeProbability(bill: BillObject): number {
  let prob = 0;

  const dims = bill.constitutional_dimensions;

  if ((dims.fundamental_rights ?? 0) > 0.5) prob += 0.4;
  if ((dims.federal_balance ?? 0) > 0.5) prob += 0.3;
  if ((dims.basic_structure ?? 0) > 0.3) prob += 0.5;
  if ((dims.religious_freedom ?? 0) > 0.5) prob += 0.25;
  if ((dims.right_to_privacy ?? 0) > 0.5) prob += 0.2;

  if (bill.controversy_level > 0.7) prob += 0.2;

  // Constitutional amendments are more likely to be challenged
  if (bill.bill_type === "constitutional_amendment") prob += 0.3;

  return Math.min(prob, 0.95);
}

function selectBench(
  justices: JusticeProfile[],
  size: 5 | 7 | 9
): JusticeProfile[] {
  // CJI always heads the bench
  const cji = justices.find((j) => j.is_cji);
  const others = justices
    .filter((j) => !j.is_cji)
    .sort((a, b) => a.appointed_year - b.appointed_year) // Senior-most first
    .slice(0, size - (cji ? 1 : 0));

  return cji ? [cji, ...others] : others.slice(0, size);
}

function computeJusticeVote(
  justice: JusticeProfile,
  bill: BillObject
): boolean {
  let alignment = 0;
  let totalWeight = 0;

  for (const [dim, weight] of Object.entries(bill.constitutional_dimensions)) {
    const dimension = dim as ConstitutionalDimension;
    const justicePos = justice.constitutional_positions[dimension] ?? 0.5;
    // Higher justice position = more expansive interpretation (uphold)
    alignment += justicePos * weight;
    totalWeight += weight;
  }

  let base = totalWeight > 0 ? 0.5 + (alignment / totalWeight) * 0.3 : 0.5;

  // Judicial philosophy modifiers
  base += justice.deference_to_legislature * 0.15;
  base -= justice.willingness_to_overturn * 0.1;

  // Minimal noise (justices are more predictable than politicians)
  base += (Math.random() - 0.5) * 0.1;

  return base > 0.5; // true = UPHOLD
}
