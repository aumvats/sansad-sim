import type { PartyStance } from "./bill";

export type SimStage =
  | "idle"
  | "lok_sabha"
  | "rajya_sabha"
  | "joint_sitting"
  | "president"
  | "sc_review"
  | "outcome";

export type TimelineEventType =
  | "stage"
  | "party_stance"
  | "vote"
  | "defection"
  | "counter"
  | "chamber_result"
  | "presidential_action"
  | "sc_bench_formed"
  | "sc_vote"
  | "sc_result"
  | "pause"
  | "outcome";

export interface TimelineEvent {
  /** Timestamp in milliseconds */
  t: number;
  type: TimelineEventType;

  // Polymorphic payload
  val?: string;
  id?: string;
  /** true = yea, false = nay */
  v?: boolean;
  party?: string;
  stance?: PartyStance;
  /** Yea count */
  y?: number;
  /** Nay count */
  n?: number;
  /** Abstain count */
  a?: number;
  ok?: boolean;
  chamber?: string;
  benchSize?: number;
  next?: string;
}

export interface Timeline {
  events: TimelineEvent[];
  duration: number;
}
