import type { BillObject, PartyStance } from "./bill";
import type { SimStage, Timeline } from "./timeline";

export interface ChamberResult {
  yea: number;
  nay: number;
  abstain: number;
  passed: boolean;
}

export type PresidentialAction = "ASSENT" | "RETURN" | "POCKET_VETO";

export interface SimulationState {
  stage: SimStage;
  bill: BillObject | null;
  timeline: Timeline | null;

  /** MP id → voted yea (true) or nay (false) */
  votes: Map<string, boolean>;
  /** Party short_name → stance */
  partyStances: Map<string, PartyStance>;
  /** Set of MP ids that defied the whip */
  defections: Set<string>;

  counters: {
    yea: number;
    nay: number;
    abstain: number;
  };

  lsResult: ChamberResult | null;
  rsResult: ChamberResult | null;
  presidentialAction: PresidentialAction | null;
  scResult: import("./justice").SCResult | null;
  finalOutcome: string | null;
}
