import type { MPProfile } from "@/src/types/mp";
import type { PartyStance } from "@/src/types/bill";
import { getPartyColor } from "@/src/lib/colors";

interface Props {
  members: MPProfile[];
  partyStances: Map<string, PartyStance>;
  votes: Map<string, boolean>;
}

interface PartyBar {
  party: string;
  seats: number;
  supportPct: number;
  stance: PartyStance | undefined;
}

export function CoalitionTensionMeter({ members, partyStances, votes }: Props) {
  // Only show NDA parties (ruling coalition)
  const ndaMembers = members.filter((m) => m.alliance === "NDA");

  const byParty = new Map<string, MPProfile[]>();
  for (const mp of ndaMembers) {
    const list = byParty.get(mp.party) ?? [];
    list.push(mp);
    byParty.set(mp.party, list);
  }

  const bars: PartyBar[] = Array.from(byParty.entries())
    .map(([party, mps]) => {
      const stance = partyStances.get(party);
      let supporting = 0;
      for (const mp of mps) {
        const vote = votes.get(mp.id);
        if (vote === true) supporting++;
      }
      const votedCount = mps.filter((mp) => votes.has(mp.id)).length;
      const supportPct = votedCount > 0 ? (supporting / votedCount) * 100 : stance === "SUPPORT" ? 100 : stance === "OPPOSE" ? 0 : 50;

      return { party, seats: mps.length, supportPct, stance };
    })
    .sort((a, b) => b.seats - a.seats);

  const totalNDA = ndaMembers.length;
  const firmSeats = bars.reduce((acc, b) => {
    if (b.stance === "SUPPORT") return acc + b.seats;
    return acc;
  }, 0);

  return (
    <div style={{ fontSize: "var(--text-xs)" }}>
      <div
        style={{
          fontWeight: 600,
          fontSize: "var(--text-sm)",
          color: "var(--text-primary)",
          marginBottom: 4,
        }}
      >
        NDA Coalition
      </div>
      <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
        Firm: {firmSeats} / {totalNDA} seats · Majority needs: 272
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {bars.map((b) => {
          const colors = getPartyColor(b.party);
          const barColor =
            b.supportPct >= 60
              ? colors.primary
              : b.supportPct >= 40
                ? "#D4A017"
                : "var(--nay)";

          return (
            <div key={b.party}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {b.party} ({b.seats})
                </span>
                <span style={{ color: barColor, fontWeight: 600 }}>
                  {Math.round(b.supportPct)}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: "var(--border-light)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${b.supportPct}%`,
                    height: "100%",
                    background: barColor,
                    borderRadius: 3,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
