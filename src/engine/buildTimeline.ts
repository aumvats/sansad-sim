import type { BillObject, PartyStance } from "@/src/types/bill";
import type { MPProfile } from "@/src/types/mp";
import type { PartyProfile } from "@/src/types/party";
import type { JusticeProfile } from "@/src/types/justice";
import type { Timeline, TimelineEvent } from "@/src/types/timeline";
import { getBillPipeline, checkMajority } from "./billTypeRouter";
import { computePartyStance } from "./computePartyStance";
import {
  computeWhipDefiance,
  computeIndividualVote,
} from "./computeWhipDefiance";
import { computePresidentialAction } from "./computePresidentialAction";
import { computeSCReview } from "./computeSCReview";
import { shouldTriggerJointSitting } from "./computeJointSitting";

const LS_VOTE_STAGGER = 6; // ms between LS votes
const RS_VOTE_STAGGER = 8; // ms between RS votes
const PARTY_STANCE_STAGGER = 200; // ms between party announcements
const SC_VOTE_STAGGER = 300; // ms between SC justice votes
const STAGE_PAUSE = 500; // ms pause between stages

interface BuildTimelineParams {
  bill: BillObject;
  lsMembers: MPProfile[];
  rsMembers: MPProfile[];
  parties: PartyProfile[];
  justices: JusticeProfile[];
}

/**
 * Build the complete simulation timeline — an immutable array of events
 * with timestamps. The animation system derives all visual state from
 * scanning this array up to the current playhead position.
 */
export function buildTimeline(params: BuildTimelineParams): Timeline {
  const { bill, lsMembers, rsMembers, parties, justices } = params;
  const events: TimelineEvent[] = [];
  let t = 0;

  const pipeline = getBillPipeline(bill);

  // Compute party stances upfront
  const partyStances = new Map<string, PartyStance>();
  for (const party of parties) {
    const isRuling = party.alliance === "NDA";
    const stance = computePartyStance(party, bill, isRuling);
    partyStances.set(party.short_name, stance);
  }

  let lsResult = { yea: 0, nay: 0, abstain: 0, passed: false };
  let rsResult = { yea: 0, nay: 0, abstain: 0, passed: false };

  for (const pipelineStage of pipeline) {
    if (pipelineStage.stage === "lok_sabha") {
      // --- LOK SABHA ---
      events.push({ t, type: "stage", val: "lok_sabha" });
      t += 200;

      // Announce party stances
      t = announcePartyStances(events, t, parties, partyStances);
      t += STAGE_PAUSE;

      // Vote
      const lsVoteResult = runChamberVote(
        events,
        t,
        lsMembers,
        partyStances,
        bill,
        LS_VOTE_STAGGER,
        "lok_sabha"
      );
      t = lsVoteResult.endTime;

      const lsPassed = pipelineStage.advisory
        ? true // Advisory stage always "passes"
        : checkMajority(
            lsVoteResult.yea,
            lsVoteResult.nay,
            lsVoteResult.abstain,
            543,
            pipelineStage.majorityType
          );

      lsResult = {
        yea: lsVoteResult.yea,
        nay: lsVoteResult.nay,
        abstain: lsVoteResult.abstain,
        passed: lsPassed,
      };

      t += 200;
      events.push({
        t,
        type: "chamber_result",
        chamber: "lok_sabha",
        y: lsVoteResult.yea,
        n: lsVoteResult.nay,
        a: lsVoteResult.abstain,
        ok: lsPassed,
      });

      if (!lsPassed && !pipelineStage.advisory) {
        t += STAGE_PAUSE;
        events.push({
          t,
          type: "outcome",
          val: bill.bill_type === "constitutional_amendment"
            ? "Defeated in Lok Sabha — failed to achieve special majority"
            : "Defeated in Lok Sabha",
        });
        return { events, duration: t };
      }

      t += STAGE_PAUSE;
      events.push({ t, type: "pause", next: "rajya_sabha" });

    } else if (pipelineStage.stage === "rajya_sabha") {
      // --- RAJYA SABHA ---
      events.push({ t, type: "stage", val: "rajya_sabha" });
      t += 200;

      t = announcePartyStances(events, t, parties, partyStances);
      t += STAGE_PAUSE;

      const rsVoteResult = runChamberVote(
        events,
        t,
        rsMembers,
        partyStances,
        bill,
        RS_VOTE_STAGGER,
        "rajya_sabha"
      );
      t = rsVoteResult.endTime;

      let rsPassed: boolean;
      if (pipelineStage.advisory) {
        // Money bill: RS recommendations are advisory only
        rsPassed = true;
      } else {
        rsPassed = checkMajority(
          rsVoteResult.yea,
          rsVoteResult.nay,
          rsVoteResult.abstain,
          245,
          pipelineStage.majorityType
        );
      }

      rsResult = {
        yea: rsVoteResult.yea,
        nay: rsVoteResult.nay,
        abstain: rsVoteResult.abstain,
        passed: rsPassed,
      };

      t += 200;
      events.push({
        t,
        type: "chamber_result",
        chamber: "rajya_sabha",
        y: rsVoteResult.yea,
        n: rsVoteResult.nay,
        a: rsVoteResult.abstain,
        ok: rsPassed,
        val: pipelineStage.advisory
          ? "Rajya Sabha recommendations noted (advisory only)"
          : undefined,
      });

      if (!rsPassed) {
        // Check for joint sitting (ordinary bills only)
        if (
          shouldTriggerJointSitting(
            lsResult.passed,
            false,
            bill.bill_type
          )
        ) {
          t += STAGE_PAUSE;
          events.push({ t, type: "stage", val: "joint_sitting" });

          const jointYea = lsResult.yea + rsResult.yea;
          const jointNay = lsResult.nay + rsResult.nay;
          const jointPassed = jointYea > jointNay;

          t += 1000;
          events.push({
            t,
            type: "chamber_result",
            chamber: "joint_sitting",
            y: jointYea,
            n: jointNay,
            ok: jointPassed,
          });

          if (!jointPassed) {
            t += STAGE_PAUSE;
            events.push({
              t,
              type: "outcome",
              val: "Defeated in Joint Sitting",
            });
            return { events, duration: t };
          }
        } else {
          // Amendment or no joint sitting triggered
          t += STAGE_PAUSE;
          events.push({
            t,
            type: "outcome",
            val: bill.bill_type === "constitutional_amendment"
              ? "Defeated in Rajya Sabha — failed to achieve special majority"
              : "Defeated in Rajya Sabha",
          });
          return { events, duration: t };
        }
      }

      t += STAGE_PAUSE;
      events.push({ t, type: "pause", next: "president" });

    } else if (pipelineStage.stage === "president") {
      // --- PRESIDENTIAL ACTION ---
      events.push({ t, type: "stage", val: "president" });
      t += 500;

      const action = pipelineStage.mustPass
        ? "ASSENT"
        : computePresidentialAction(bill);

      events.push({ t, type: "presidential_action", val: action });

      if (action === "RETURN") {
        t += STAGE_PAUSE;
        events.push({
          t,
          type: "outcome",
          val: "Returned by President for reconsideration",
        });
        return { events, duration: t };
      }

      if (action === "POCKET_VETO") {
        t += STAGE_PAUSE;
        events.push({
          t,
          type: "outcome",
          val: "Pocket Veto — President withholds assent indefinitely",
        });
        return { events, duration: t };
      }

      t += STAGE_PAUSE;
      events.push({ t, type: "pause", next: "sc_review" });

    } else if (pipelineStage.stage === "sc_review") {
      // --- SUPREME COURT REVIEW ---
      events.push({ t, type: "stage", val: "sc_review" });
      t += 300;

      const scResult = computeSCReview(bill, justices);

      if (!scResult.challenged) {
        events.push({
          t,
          type: "sc_result",
          val: "NOT_CHALLENGED",
          ok: true,
        });
      } else {
        events.push({
          t,
          type: "sc_bench_formed",
          benchSize: scResult.benchSize,
        });
        t += 500;

        // Individual justice votes
        if (scResult.votes) {
          for (const jv of scResult.votes) {
            t += SC_VOTE_STAGGER;
            events.push({
              t,
              type: "sc_vote",
              id: jv.justiceId,
              v: jv.upheld,
            });
          }
        }

        t += 300;
        events.push({
          t,
          type: "sc_result",
          val: scResult.result,
          ok: scResult.result === "UPHELD",
        });

        if (scResult.result === "STRUCK_DOWN") {
          t += STAGE_PAUSE;
          events.push({
            t,
            type: "outcome",
            val: "Struck down by Supreme Court — violates Basic Structure",
          });
          return { events, duration: t };
        }
      }

      t += STAGE_PAUSE;
    }
  }

  // Final outcome: ENACTED
  events.push({
    t,
    type: "outcome",
    val: bill.bill_type === "constitutional_amendment"
      ? "Enacted as Constitutional Amendment"
      : "Signed into law",
  });

  return { events, duration: t };
}

// ── Helpers ─────────────────────────────────────────────

function announcePartyStances(
  events: TimelineEvent[],
  startTime: number,
  parties: PartyProfile[],
  stances: Map<string, PartyStance>
): number {
  let t = startTime;

  // Sort parties by seat count (largest first)
  const sorted = [...parties]
    .filter((p) => p.lok_sabha_seats + p.rajya_sabha_seats > 0)
    .sort(
      (a, b) =>
        b.lok_sabha_seats + b.rajya_sabha_seats -
        (a.lok_sabha_seats + a.rajya_sabha_seats)
    );

  for (const party of sorted) {
    const stance = stances.get(party.short_name);
    if (stance) {
      events.push({
        t,
        type: "party_stance",
        party: party.short_name,
        stance,
      });
      t += PARTY_STANCE_STAGGER;
    }
  }

  return t;
}

interface VoteResult {
  yea: number;
  nay: number;
  abstain: number;
  endTime: number;
}

function runChamberVote(
  events: TimelineEvent[],
  startTime: number,
  members: MPProfile[],
  partyStances: Map<string, PartyStance>,
  bill: BillObject,
  stagger: number,
  _chamber: string
): VoteResult {
  let t = startTime;
  let yea = 0;
  let nay = 0;
  let abstain = 0;

  events.push({ t, type: "counter", y: 0, n: 0, a: 0 });

  // Group members by party, sort parties by size (largest first)
  const byParty = new Map<string, MPProfile[]>();
  for (const mp of members) {
    const party = mp.party;
    if (!byParty.has(party)) byParty.set(party, []);
    byParty.get(party)!.push(mp);
  }

  // Sort parties by size descending
  const sortedParties = Array.from(byParty.entries()).sort(
    (a: [string, MPProfile[]], b: [string, MPProfile[]]) =>
      b[1].length - a[1].length
  );

  for (const [partyName, partyMembers] of sortedParties) {
    const partyStance = partyStances.get(partyName) ?? "ABSTAIN";

    // Sort: ministers first, then leaders, then by name
    const sorted = partyMembers.sort((a, b) => {
      if (a.is_minister !== b.is_minister) return a.is_minister ? -1 : 1;
      if (a.is_party_leader !== b.is_party_leader)
        return a.is_party_leader ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    for (const mp of sorted) {
      t += stagger;

      // Check for whip defiance
      const defied = computeWhipDefiance(mp, partyStance, bill);

      let voteYea: boolean;

      if (defied) {
        // Defied whip — vote opposite to party
        if (partyStance === "SUPPORT") voteYea = false;
        else if (partyStance === "OPPOSE") voteYea = true;
        else voteYea = computeIndividualVote(mp, bill);

        events.push({
          t,
          type: "defection",
          id: mp.id,
          v: voteYea,
          party: partyName,
        });
      } else if (
        bill.introduced_by === "private_member" &&
        !bill.is_whip_issued
      ) {
        // Free vote — individual decision
        voteYea = computeIndividualVote(mp, bill);
        events.push({ t, type: "vote", id: mp.id, v: voteYea });
      } else {
        // Normal vote following party line
        if (partyStance === "SUPPORT") {
          voteYea = true;
        } else if (partyStance === "OPPOSE") {
          voteYea = false;
        } else {
          // Abstain — still counted
          abstain++;
          events.push({ t, type: "counter", y: yea, n: nay, a: abstain });
          continue;
        }
        events.push({ t, type: "vote", id: mp.id, v: voteYea });
      }

      if (voteYea) yea++;
      else nay++;

      events.push({ t, type: "counter", y: yea, n: nay, a: abstain });
    }
  }

  return { yea, nay, abstain, endTime: t };
}
