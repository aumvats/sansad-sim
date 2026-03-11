import { useState, useCallback, useMemo } from "react";
import type { BillObject } from "@/src/types/bill";
import type { MPProfile } from "@/src/types/mp";
import type { SimStage } from "@/src/types/timeline";

import { LS_MEMBERS, RS_MEMBERS, SC_JUSTICES } from "@/src/data/parlData";
import { PARTIES } from "@/src/data/partyProfiles";

import { useSimulation } from "@/src/hooks/useSimulation";
import { usePlayback } from "@/src/hooks/usePlayback";
import { useResponsive } from "@/src/hooks/useResponsive";

import { BillInput } from "./BillInput";
import { HorseshoeChamber } from "./HorseshoeChamber";
import { RajyaSabhaChamber } from "./RajyaSabhaChamber";
import { AllianceBar } from "./AllianceBar";
import { PlaybackControls } from "./PlaybackControls";
import { MemberTooltip } from "./MemberTooltip";
import { StageIndicator } from "./StageIndicator";
import { PartyBreakdown } from "./PartyBreakdown";
import { CoalitionTensionMeter } from "./CoalitionTensionMeter";
import { ExecutivePanel } from "./ExecutivePanel";
import { SupremeCourtBench } from "./SupremeCourtBench";
import { OutcomeCard } from "./OutcomeCard";

const simData = {
  lsMembers: LS_MEMBERS,
  rsMembers: RS_MEMBERS,
  parties: PARTIES,
  justices: SC_JUSTICES,
};

export function SansadSim() {
  const responsive = useResponsive();
  const { state, startSimulation, deriveStateFromPlayhead, reset } =
    useSimulation(simData);

  const playback = usePlayback(state.timeline, deriveStateFromPlayhead);

  // Tooltip state
  const [hoveredMp, setHoveredMp] = useState<MPProfile | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleHover = useCallback(
    (mp: MPProfile | null, pos: { x: number; y: number }) => {
      setHoveredMp(mp);
      setTooltipPos(pos);
    },
    []
  );

  const handleBillSubmit = useCallback(
    (bill: BillObject) => {
      startSimulation(bill);
    },
    [startSimulation]
  );

  const handleReset = useCallback(() => {
    playback.pause();
    playback.setPlayhead(0);
    reset();
  }, [playback, reset]);

  // Determine which stages are skipped based on bill type
  const skippedStages = useMemo(() => {
    const skipped = new Set<SimStage>();
    if (!state.bill) return skipped;
    if (state.bill.bill_type === "money") {
      skipped.add("rajya_sabha");
      skipped.add("joint_sitting");
      skipped.add("sc_review");
    }
    if (
      state.bill.bill_type !== "money" &&
      !state.timeline?.events.some(
        (e) => e.type === "stage" && e.val === "joint_sitting"
      )
    ) {
      skipped.add("joint_sitting");
    }
    return skipped;
  }, [state.bill, state.timeline]);

  // Current chamber members for display
  const currentMembers = useMemo(() => {
    if (state.stage === "rajya_sabha") return RS_MEMBERS;
    return LS_MEMBERS;
  }, [state.stage]);

  const isLsChamber =
    state.stage === "lok_sabha" || state.stage === "joint_sitting";
  const isRsChamber = state.stage === "rajya_sabha";

  // ── Idle: show bill input ──
  if (state.stage === "idle") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <BillInput onSubmit={handleBillSubmit} />
      </div>
    );
  }

  // ── Active simulation ──
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      {/* Alliance Bar — persistent top */}
      <AllianceBar
        members={currentMembers}
        partyStances={state.partyStances}
        totalSeats={isRsChamber ? 245 : 543}
        majorityMark={isRsChamber ? 123 : 272}
        chamberLabel={isRsChamber ? "Rajya Sabha" : "Lok Sabha"}
        compact={responsive.isMobile}
      />

      {/* Stage Indicator */}
      <div style={{ padding: "0 16px" }}>
        <StageIndicator
          currentStage={state.stage}
          skippedStages={skippedStages}
        />
      </div>

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: responsive.isMobile ? "column" : "row",
          overflow: "hidden",
        }}
      >
        {/* Chamber SVG — main area */}
        <div
          style={{
            flex: 1,
            minHeight: responsive.isMobile ? 300 : 400,
            position: "relative",
          }}
        >
          {(isLsChamber ||
            state.stage === "president" ||
            state.stage === "sc_review" ||
            state.stage === "outcome") && (
            <svg
              viewBox="0 0 800 550"
              style={{ width: "100%", height: "100%" }}
              aria-label="Lok Sabha chamber visualization"
            >
              <HorseshoeChamber
                members={LS_MEMBERS}
                votes={state.votes}
                partyStances={state.partyStances}
                defections={state.defections}
                dotRadius={responsive.dotRadius}
                onHover={handleHover}
              />
            </svg>
          )}

          {isRsChamber && (
            <svg
              viewBox="0 0 800 400"
              style={{ width: "100%", height: "100%" }}
              aria-label="Rajya Sabha chamber visualization"
            >
              <RajyaSabhaChamber
                members={RS_MEMBERS}
                votes={state.votes}
                partyStances={state.partyStances}
                defections={state.defections}
                dotRadius={responsive.dotRadius}
                onHover={handleHover}
              />
            </svg>
          )}
        </div>

        {/* Sidebar — desktop: right panel, mobile: below */}
        <div
          style={{
            width: responsive.isMobile ? "100%" : 280,
            padding: responsive.isMobile ? "8px 12px" : "12px 16px",
            borderLeft: responsive.isMobile
              ? "none"
              : "1px solid var(--border-light)",
            borderTop: responsive.isMobile
              ? "1px solid var(--border-light)"
              : "none",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            background: "var(--card)",
          }}
        >
          {/* Bill info */}
          {state.bill && (
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "var(--text-base)",
                  color: "var(--text-primary)",
                  marginBottom: 4,
                }}
              >
                {state.bill.name}
              </div>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  padding: "1px 6px",
                  borderRadius: 4,
                  background:
                    state.bill.bill_type === "money"
                      ? "var(--yea)"
                      : state.bill.bill_type === "constitutional_amendment"
                        ? "#C9A84C"
                        : "var(--text-muted)",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {state.bill.bill_type === "money"
                  ? "Money Bill"
                  : state.bill.bill_type === "constitutional_amendment"
                    ? "Amendment"
                    : "Ordinary"}
              </span>
            </div>
          )}

          {/* Coalition Tension */}
          {(isLsChamber || isRsChamber) && (
            <CoalitionTensionMeter
              members={currentMembers}
              partyStances={state.partyStances}
              votes={state.votes}
            />
          )}

          {/* Party Breakdown */}
          {(isLsChamber || isRsChamber) && (
            <PartyBreakdown
              members={currentMembers}
              votes={state.votes}
              partyStances={state.partyStances}
              chamberLabel={isRsChamber ? "Rajya Sabha" : "Lok Sabha"}
            />
          )}

          {/* Executive Panel */}
          {(state.stage === "president" || state.presidentialAction) && (
            <ExecutivePanel action={state.presidentialAction} />
          )}

          {/* Supreme Court */}
          {(state.stage === "sc_review" || state.scResult) && (
            <SupremeCourtBench scResult={state.scResult} />
          )}
        </div>
      </div>

      {/* Playback Controls — bottom */}
      <PlaybackControls
        playing={playback.playing}
        playhead={playback.playhead}
        duration={state.timeline?.duration ?? 0}
        speed={playback.speed}
        onToggle={playback.toggle}
        onSpeedChange={playback.setSpeed}
        onScrub={playback.setPlayhead}
        counters={state.counters}
      />

      {/* Member Tooltip */}
      {hoveredMp && (
        <MemberTooltip
          member={hoveredMp}
          pos={tooltipPos}
          partyStance={state.partyStances.get(hoveredMp.party)}
          defied={state.defections.has(hoveredMp.id)}
        />
      )}

      {/* Outcome Overlay */}
      {state.finalOutcome && (
        <OutcomeCard
          outcome={state.finalOutcome}
          lsResult={state.lsResult}
          rsResult={state.rsResult}
          presidentialAction={state.presidentialAction}
          scResult={state.scResult}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
