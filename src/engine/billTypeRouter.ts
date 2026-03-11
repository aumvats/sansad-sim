import type { BillObject } from "@/src/types/bill";
import type { House } from "@/src/types/mp";
import type { SimStage } from "@/src/types/timeline";

export interface PipelineStage {
  stage: SimStage;
  chamber?: House;
  majorityType: "simple" | "special";
  /** If true, this stage is advisory only (e.g., RS on Money Bills) */
  advisory?: boolean;
  /** If true, the result at this stage is predetermined (e.g., President MUST sign) */
  mustPass?: boolean;
}

/**
 * Get the legislative pipeline for a bill based on its type.
 * Different bill types follow different routes through Parliament.
 */
export function getBillPipeline(bill: BillObject): PipelineStage[] {
  switch (bill.bill_type) {
    case "ordinary":
      return getOrdinaryPipeline(bill);
    case "money":
      return getMoneyPipeline();
    case "constitutional_amendment":
      return getAmendmentPipeline();
  }
}

/** Ordinary Bill: Both houses, simple majority, joint sitting possible */
function getOrdinaryPipeline(bill: BillObject): PipelineStage[] {
  const stages: PipelineStage[] = [
    {
      stage: "lok_sabha",
      chamber: "lok_sabha",
      majorityType: "simple",
    },
    {
      stage: "rajya_sabha",
      chamber: "rajya_sabha",
      majorityType: "simple",
    },
    // Joint sitting added dynamically if deadlock (LS passes, RS rejects)
    {
      stage: "president",
      majorityType: "simple",
    },
    {
      stage: "sc_review",
      majorityType: "simple",
    },
  ];

  // If bill starts in Rajya Sabha, swap order
  if (bill.introducing_house === "rajya_sabha") {
    [stages[0], stages[1]] = [stages[1], stages[0]];
  }

  return stages;
}

/**
 * Money Bill: Lok Sabha only, RS gets 14 days advisory.
 * President CANNOT return money bills.
 */
function getMoneyPipeline(): PipelineStage[] {
  return [
    {
      stage: "lok_sabha",
      chamber: "lok_sabha",
      majorityType: "simple",
    },
    {
      stage: "rajya_sabha",
      chamber: "rajya_sabha",
      majorityType: "simple",
      advisory: true, // RS can only recommend, not block
    },
    {
      stage: "president",
      majorityType: "simple",
      mustPass: true, // President MUST give assent to money bills
    },
  ];
}

/**
 * Constitutional Amendment: Both houses with special majority.
 * NO joint sitting possible. President MUST sign.
 * SC can still strike down under Basic Structure Doctrine.
 */
function getAmendmentPipeline(): PipelineStage[] {
  return [
    {
      stage: "lok_sabha",
      chamber: "lok_sabha",
      majorityType: "special",
    },
    {
      stage: "rajya_sabha",
      chamber: "rajya_sabha",
      majorityType: "special",
    },
    {
      stage: "president",
      majorityType: "simple",
      mustPass: true, // President MUST sign amendments
    },
    {
      stage: "sc_review",
      majorityType: "simple",
      // SC can strike down even amendments under Basic Structure Doctrine
    },
  ];
}

/**
 * Check if a bill passed with the required majority.
 * Special majority = >50% total membership AND ≥2/3 present and voting.
 */
export function checkMajority(
  yea: number,
  nay: number,
  abstain: number,
  totalMembers: number,
  majorityType: "simple" | "special"
): boolean {
  if (majorityType === "simple") {
    return yea > nay;
  }

  // Special majority for constitutional amendments
  const presentAndVoting = yea + nay; // Abstentions don't count
  const halfOfTotal = Math.floor(totalMembers / 2) + 1;
  const twoThirdsOfPresent = Math.ceil((presentAndVoting * 2) / 3);

  return yea >= halfOfTotal && yea >= twoThirdsOfPresent;
}
