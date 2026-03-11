import type { PartyStance } from "@/src/types/bill";
import type { MPProfile } from "@/src/types/mp";
import { alliance as allianceColors } from "@/src/lib/colors";

interface Props {
  members: MPProfile[];
  partyStances: Map<string, PartyStance>;
  totalSeats: number;
  majorityMark: number;
  chamberLabel: string;
  compact?: boolean;
}

export function AllianceBar({
  members,
  partyStances,
  totalSeats,
  majorityMark,
  chamberLabel,
  compact = false,
}: Props) {
  // Count seats by alliance
  const ndaSeats = members.filter((m) => m.alliance === "NDA").length;
  const indiaSeats = members.filter((m) => m.alliance === "INDIA").length;
  const otherSeats = totalSeats - ndaSeats - indiaSeats;

  const ndaPct = (ndaSeats / totalSeats) * 100;
  const indiaPct = (indiaSeats / totalSeats) * 100;
  const otherPct = (otherSeats / totalSeats) * 100;
  const majorityPct = (majorityMark / totalSeats) * 100;

  const barHeight = compact ? 24 : 36;

  return (
    <div
      style={{
        width: "100%",
        padding: compact ? "4px 8px" : "8px 16px",
        background: "var(--card)",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      {!compact && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
            fontSize: "var(--text-xs)",
            color: "var(--text-secondary)",
          }}
        >
          <span>{chamberLabel}</span>
          <span>Majority: {majorityMark}</span>
        </div>
      )}

      <div
        style={{
          position: "relative",
          height: barHeight,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          background: "var(--border-light)",
        }}
      >
        {/* NDA segment */}
        <div
          style={{
            width: `${ndaPct}%`,
            background: allianceColors.NDA,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.3s ease",
          }}
        >
          {!compact && ndaSeats > 0 && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "white",
                fontWeight: 600,
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              NDA ({ndaSeats})
            </span>
          )}
        </div>

        {/* Others segment */}
        <div
          style={{
            width: `${otherPct}%`,
            background: allianceColors.Other,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.3s ease",
          }}
        >
          {!compact && otherSeats > 0 && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "white",
                fontWeight: 600,
              }}
            >
              {otherSeats}
            </span>
          )}
        </div>

        {/* INDIA segment */}
        <div
          style={{
            width: `${indiaPct}%`,
            background: allianceColors.INDIA,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "width 0.3s ease",
          }}
        >
          {!compact && indiaSeats > 0 && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "white",
                fontWeight: 600,
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              INDIA ({indiaSeats})
            </span>
          )}
        </div>

        {/* Majority line */}
        <div
          style={{
            position: "absolute",
            left: `${majorityPct}%`,
            top: 0,
            bottom: 0,
            width: 2,
            background: allianceColors.majorityLine,
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}
