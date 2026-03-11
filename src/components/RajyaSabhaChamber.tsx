import { useMemo } from "react";
import type { MPProfile } from "@/src/types/mp";
import type { PartyStance } from "@/src/types/bill";
import { getPartyColor, vote as voteColors } from "@/src/lib/colors";
import { computeRectangleLayout } from "@/src/lib/layout";

interface Props {
  members: MPProfile[];
  votes: Map<string, boolean>;
  partyStances: Map<string, PartyStance>;
  defections: Set<string>;
  dotRadius: number;
  onHover: (mp: MPProfile | null, pos: { x: number; y: number }) => void;
}

export function RajyaSabhaChamber({
  members,
  votes,
  partyStances,
  defections,
  dotRadius,
  onHover,
}: Props) {
  // Group: ruling left, opposition right, others/nominated separate
  const { ruling, opposition, others } = useMemo(() => {
    const r: MPProfile[] = [];
    const o: MPProfile[] = [];
    const oth: MPProfile[] = [];
    for (const mp of members) {
      if (mp.alliance === "NDA") r.push(mp);
      else if (mp.alliance === "INDIA") o.push(mp);
      else oth.push(mp);
    }
    return { ruling: r, opposition: o, others: oth };
  }, [members]);

  const allOrdered = useMemo(
    () => [...ruling, ...others, ...opposition],
    [ruling, others, opposition]
  );

  const layout = useMemo(
    () => computeRectangleLayout(allOrdered.length, dotRadius, 750, 50),
    [allOrdered.length, dotRadius]
  );

  return (
    <g className="rajya-sabha-chamber">
      {/* Chairman */}
      <text
        x={400}
        y={25}
        textAnchor="middle"
        fontSize={10}
        fill="var(--text-secondary)"
        fontWeight={600}
      >
        CHAIRMAN
      </text>
      <rect
        x={385}
        y={30}
        width={30}
        height={8}
        rx={2}
        fill="var(--rs-primary)"
        opacity={0.6}
      />

      {/* Members in rows */}
      {allOrdered.map((mp, i) => {
        const pos = layout[i];
        if (!pos) return null;

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
            key={mp.id}
            cx={pos.cx}
            cy={pos.cy}
            r={pos.r}
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
          >
            <title>{mp.name} ({mp.party})</title>
          </circle>
        );
      })}
    </g>
  );
}
