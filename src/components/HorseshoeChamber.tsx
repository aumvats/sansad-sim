import { useMemo } from "react";
import type { MPProfile } from "@/src/types/mp";
import type { PartyStance } from "@/src/types/bill";
import { getPartyColor, vote as voteColors } from "@/src/lib/colors";
import { computeHorseshoeLayout } from "@/src/lib/layout";

interface Props {
  members: MPProfile[];
  votes: Map<string, boolean>;
  partyStances: Map<string, PartyStance>;
  defections: Set<string>;
  dotRadius: number;
  onHover: (mp: MPProfile | null, pos: { x: number; y: number }) => void;
}

export function HorseshoeChamber({
  members,
  votes,
  partyStances: _partyStances,
  defections,
  dotRadius,
  onHover,
}: Props) {
  // Split members into treasury (NDA) and opposition sides
  const { treasury, opposition } = useMemo(() => {
    const t: MPProfile[] = [];
    const o: MPProfile[] = [];
    for (const mp of members) {
      if (mp.alliance === "NDA") t.push(mp);
      else o.push(mp);
    }
    // Sort by party size within each side
    const sortByParty = (a: MPProfile, b: MPProfile) => {
      if (a.party !== b.party) return a.party.localeCompare(b.party);
      if (a.is_minister !== b.is_minister) return a.is_minister ? -1 : 1;
      return a.name.localeCompare(b.name);
    };
    t.sort(sortByParty);
    o.sort(sortByParty);
    return { treasury: t, opposition: o };
  }, [members]);

  // Compute seat positions
  const layout = useMemo(
    () =>
      computeHorseshoeLayout(treasury.length, opposition.length, dotRadius),
    [treasury.length, opposition.length, dotRadius]
  );

  return (
    <g className="horseshoe-chamber">
      {/* Speaker's chair */}
      <text
        x={400}
        y={25}
        textAnchor="middle"
        fontSize={10}
        fill="var(--text-secondary)"
        fontWeight={600}
      >
        SPEAKER
      </text>
      <rect
        x={385}
        y={30}
        width={30}
        height={8}
        rx={2}
        fill="var(--ls-primary)"
        opacity={0.6}
      />

      {/* Treasury bench (right side) */}
      <g className="treasury-bench">
        {treasury.map((mp, i) => {
          const pos = layout.treasury[i];
          if (!pos) return null;
          return (
            <MemberDot
              key={mp.id}
              mp={mp}
              cx={pos.cx}
              cy={pos.cy}
              r={pos.r}
              votes={votes}
              defections={defections}
              onHover={onHover}
            />
          );
        })}
      </g>

      {/* Opposition bench (left side) */}
      <g className="opposition-bench">
        {opposition.map((mp, i) => {
          const pos = layout.opposition[i];
          if (!pos) return null;
          return (
            <MemberDot
              key={mp.id}
              mp={mp}
              cx={pos.cx}
              cy={pos.cy}
              r={pos.r}
              votes={votes}
              defections={defections}
              onHover={onHover}
            />
          );
        })}
      </g>

      {/* Center aisle label */}
      <text
        x={400}
        y={500}
        textAnchor="middle"
        fontSize={8}
        fill="var(--text-muted)"
      >
        WELL OF THE HOUSE
      </text>
    </g>
  );
}

// ── Member Dot Component ────────────────────────────────

interface DotProps {
  mp: MPProfile;
  cx: number;
  cy: number;
  r: number;
  votes: Map<string, boolean>;
  defections: Set<string>;
  onHover: (mp: MPProfile | null, pos: { x: number; y: number }) => void;
}

function MemberDot({ mp, cx, cy, r, votes, defections, onHover }: DotProps) {
  const hasVoted = votes.has(mp.id);
  const votedYea = votes.get(mp.id);
  const defied = defections.has(mp.id);

  const partyColor = getPartyColor(mp.party);

  let fill: string;
  if (hasVoted) {
    fill = votedYea ? voteColors.yea : voteColors.nay;
  } else {
    fill = partyColor.primary;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      opacity={hasVoted ? 1 : 0.9}
      stroke={defied ? partyColor.primary : "none"}
      strokeWidth={defied ? 2 : 0}
      style={{
        cursor: "pointer",
        transition: "fill 0.15s ease",
        animation: defied
          ? "whip-shake 0.4s ease, pulse-glow 1.5s ease infinite"
          : hasVoted
            ? "vote-pop 0.2s ease"
            : undefined,
      }}
      onMouseEnter={(e) => onHover(mp, { x: e.clientX, y: e.clientY })}
      onMouseLeave={() => onHover(null, { x: 0, y: 0 })}
      onMouseMove={(e) => onHover(mp, { x: e.clientX, y: e.clientY })}
    >
      <title>{mp.name} ({mp.party})</title>
    </circle>
  );
}
