import type { ChamberResult } from "@/src/types/simulation";

/**
 * Joint Sitting (Article 108).
 * Triggered when Lok Sabha and Rajya Sabha disagree on an Ordinary Bill.
 * All 543 LS + 245 RS = 788 MPs vote together. Simple majority.
 * Lok Sabha always wins due to numerical superiority.
 *
 * This is extremely rare — only 3 times in 75 years of Indian democracy:
 * 1. Dowry Prohibition Act (1961)
 * 2. Banking Service Commission (Repeal) Act (1978)
 * 3. Prevention of Terrorism Act (2002)
 */
export function computeJointSitting(
  lsResult: ChamberResult,
  rsResult: ChamberResult
): ChamberResult {
  const totalYea = lsResult.yea + rsResult.yea;
  const totalNay = lsResult.nay + rsResult.nay;
  const totalAbstain = lsResult.abstain + rsResult.abstain;

  return {
    yea: totalYea,
    nay: totalNay,
    abstain: totalAbstain,
    passed: totalYea > totalNay,
  };
}

/**
 * Check if a joint sitting should be triggered.
 * Only for Ordinary Bills, only when one house passes and the other rejects.
 */
export function shouldTriggerJointSitting(
  lsPassed: boolean,
  rsPassed: boolean,
  billType: string
): boolean {
  if (billType !== "ordinary") return false;
  // Joint sitting when houses disagree
  return lsPassed !== rsPassed;
}
