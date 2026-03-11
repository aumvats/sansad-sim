import { useState, useCallback, useRef } from "react";
import type { BillObject, PartyStance } from "@/src/types/bill";
import type { MPProfile } from "@/src/types/mp";
import type { PartyProfile } from "@/src/types/party";
import type { JusticeProfile } from "@/src/types/justice";
import type { SimStage, Timeline, TimelineEvent } from "@/src/types/timeline";
import type {
  ChamberResult,
  PresidentialAction,
  SimulationState,
} from "@/src/types/simulation";
import type { SCResult } from "@/src/types/justice";
import { buildTimeline } from "@/src/engine/buildTimeline";
import { last } from "@/src/lib/utils";

export interface UseSimulationReturn {
  state: SimulationState;
  startSimulation: (bill: BillObject) => void;
  deriveStateFromPlayhead: (playhead: number) => void;
  reset: () => void;
}

const INITIAL_STATE: SimulationState = {
  stage: "idle",
  bill: null,
  timeline: null,
  votes: new Map(),
  partyStances: new Map(),
  defections: new Set(),
  counters: { yea: 0, nay: 0, abstain: 0 },
  lsResult: null,
  rsResult: null,
  presidentialAction: null,
  scResult: null,
  finalOutcome: null,
};

interface SimDataRef {
  lsMembers: MPProfile[];
  rsMembers: MPProfile[];
  parties: PartyProfile[];
  justices: JusticeProfile[];
}

export function useSimulation(data: SimDataRef): UseSimulationReturn {
  const [state, setState] = useState<SimulationState>({ ...INITIAL_STATE });
  const timelineRef = useRef<Timeline | null>(null);

  const startSimulation = useCallback(
    (bill: BillObject) => {
      const timeline = buildTimeline({
        bill,
        lsMembers: data.lsMembers,
        rsMembers: data.rsMembers,
        parties: data.parties,
        justices: data.justices,
      });

      timelineRef.current = timeline;

      setState({
        ...INITIAL_STATE,
        stage: "lok_sabha",
        bill,
        timeline,
      });
    },
    [data]
  );

  const deriveStateFromPlayhead = useCallback((playhead: number) => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const fired = timeline.events.filter((e) => e.t <= playhead);

    // Derive current stage
    const stageEvent = last(fired.filter((e) => e.type === "stage"));
    const stage = (stageEvent?.val as SimStage) ?? "idle";

    // Derive votes
    const votes = new Map<string, boolean>();
    const defections = new Set<string>();
    for (const e of fired) {
      if (e.type === "vote" && e.id !== undefined && e.v !== undefined) {
        votes.set(e.id, e.v);
      }
      if (e.type === "defection" && e.id !== undefined && e.v !== undefined) {
        votes.set(e.id, e.v);
        defections.add(e.id);
      }
    }

    // Derive party stances
    const partyStances = new Map<string, PartyStance>();
    for (const e of fired) {
      if (e.type === "party_stance" && e.party && e.stance) {
        partyStances.set(e.party, e.stance);
      }
    }

    // Derive counters
    const counterEvent = last(fired.filter((e) => e.type === "counter"));
    const counters = {
      yea: counterEvent?.y ?? 0,
      nay: counterEvent?.n ?? 0,
      abstain: counterEvent?.a ?? 0,
    };

    // Derive chamber results
    const chamberResults = fired.filter((e) => e.type === "chamber_result");
    const lsChamber = chamberResults.find((e) => e.chamber === "lok_sabha");
    const rsChamber = chamberResults.find((e) => e.chamber === "rajya_sabha");

    const lsResult: ChamberResult | null = lsChamber
      ? {
          yea: lsChamber.y ?? 0,
          nay: lsChamber.n ?? 0,
          abstain: lsChamber.a ?? 0,
          passed: lsChamber.ok ?? false,
        }
      : null;

    const rsResult: ChamberResult | null = rsChamber
      ? {
          yea: rsChamber.y ?? 0,
          nay: rsChamber.n ?? 0,
          abstain: rsChamber.a ?? 0,
          passed: rsChamber.ok ?? false,
        }
      : null;

    // Derive presidential action
    const presEvent = last(
      fired.filter((e) => e.type === "presidential_action")
    );
    const presidentialAction =
      (presEvent?.val as PresidentialAction) ?? null;

    // Derive SC result
    const scEvent = last(fired.filter((e) => e.type === "sc_result"));
    const scResult: SCResult | null = scEvent
      ? {
          challenged: scEvent.val !== "NOT_CHALLENGED",
          result: scEvent.val as SCResult["result"],
        }
      : null;

    // Derive outcome
    const outcomeEvent = last(
      fired.filter((e) => e.type === "outcome")
    );
    const finalOutcome = outcomeEvent?.val ?? null;

    setState((prev) => ({
      ...prev,
      stage: finalOutcome ? "outcome" : stage,
      votes,
      partyStances,
      defections,
      counters,
      lsResult,
      rsResult,
      presidentialAction,
      scResult,
      finalOutcome,
    }));
  }, []);

  const reset = useCallback(() => {
    timelineRef.current = null;
    setState({ ...INITIAL_STATE });
  }, []);

  return { state, startSimulation, deriveStateFromPlayhead, reset };
}
