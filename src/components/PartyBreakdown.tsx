import type { MPProfile } from "@/src/types/mp";
import type { PartyStance } from "@/src/types/bill";
import { getPartyColor } from "@/src/lib/colors";

interface Props {
  members: MPProfile[];
  votes: Map<string, boolean>;
  partyStances: Map<string, PartyStance>;
  chamberLabel: string;
}

interface PartyTally {
  party: string;
  seats: number;
  yea: number;
  nay: number;
  abstain: number;
  stance: PartyStance | undefined;
}

export function PartyBreakdown({
  members,
  votes,
  partyStances,
  chamberLabel,
}: Props) {
  // Group by party and compute tallies
  const byParty = new Map<string, MPProfile[]>();
  for (const mp of members) {
    const list = byParty.get(mp.party) ?? [];
    list.push(mp);
    byParty.set(mp.party, list);
  }

  const tallies: PartyTally[] = Array.from(byParty.entries())
    .map(([party, mps]) => {
      let yea = 0;
      let nay = 0;
      let abstain = 0;
      for (const mp of mps) {
        const vote = votes.get(mp.id);
        if (vote === true) yea++;
        else if (vote === false) nay++;
        // If voted but not yea/nay, it's abstain (we don't track abstain in votes map,
        // but we can count members who haven't voted yet as pending)
      }
      // Members who have a party stance but haven't been individually counted
      const voted = yea + nay;
      abstain = mps.length - voted; // Remaining are either pending or abstained

      return {
        party,
        seats: mps.length,
        yea,
        nay,
        abstain,
        stance: partyStances.get(party),
      };
    })
    .sort((a, b) => b.seats - a.seats);

  return (
    <div style={{ fontSize: "var(--text-xs)" }}>
      <div
        style={{
          fontWeight: 600,
          fontSize: "var(--text-sm)",
          marginBottom: 8,
          color: "var(--text-primary)",
        }}
      >
        {chamberLabel} — Party Breakdown
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {tallies.map((t) => {
          const colors = getPartyColor(t.party);
          return (
            <div
              key={t.party}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 0",
              }}
            >
              {/* Party dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: colors.primary,
                  flexShrink: 0,
                }}
              />

              {/* Party name + seats */}
              <div style={{ flex: 1, minWidth: 0, color: "var(--text-secondary)" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {t.party}
                </span>{" "}
                ({t.seats})
                {t.stance && (
                  <span
                    style={{
                      marginLeft: 4,
                      color:
                        t.stance === "SUPPORT"
                          ? "var(--yea)"
                          : t.stance === "OPPOSE"
                            ? "var(--nay)"
                            : "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    {t.stance}
                  </span>
                )}
              </div>

              {/* Y/N/A columns */}
              <div style={{ display: "flex", gap: 6, fontWeight: 600, flexShrink: 0 }}>
                <span style={{ color: "var(--yea)", minWidth: 24, textAlign: "right" }}>
                  {t.yea || "·"}
                </span>
                <span style={{ color: "var(--nay)", minWidth: 24, textAlign: "right" }}>
                  {t.nay || "·"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
