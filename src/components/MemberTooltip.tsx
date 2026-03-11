import type { MPProfile } from "@/src/types/mp";
import type { PartyStance } from "@/src/types/bill";
import { getPartyColor } from "@/src/lib/colors";

interface Props {
  member: MPProfile;
  pos: { x: number; y: number };
  partyStance: PartyStance | undefined;
  defied: boolean;
}

export function MemberTooltip({ member, pos, partyStance, defied }: Props) {
  const colors = getPartyColor(member.party);

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x + 12,
        top: pos.y - 8,
        background: colors.tint,
        border: `2px solid ${colors.primary}`,
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: "var(--text-sm)",
        color: "var(--text-primary)",
        pointerEvents: "none",
        zIndex: 100,
        maxWidth: 280,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{member.name}</div>
      <div style={{ color: "var(--text-secondary)", marginBottom: 4 }}>
        {member.party} · {member.constituency}, {member.state}
      </div>
      <div style={{ color: "var(--text-secondary)", marginBottom: 4 }}>
        {member.alliance} Alliance
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border-light)",
          paddingTop: 4,
          marginTop: 4,
        }}
      >
        {partyStance && (
          <div>
            Party stance:{" "}
            <strong
              style={{
                color:
                  partyStance === "SUPPORT"
                    ? "var(--yea)"
                    : partyStance === "OPPOSE"
                      ? "var(--nay)"
                      : "var(--text-muted)",
              }}
            >
              {partyStance}
            </strong>
          </div>
        )}
        <div>
          Whip:{" "}
          <span>
            Issued{" "}
            {defied && (
              <strong style={{ color: "var(--nay)" }}>
                — DEFIED WHIP
              </strong>
            )}
          </span>
        </div>
        <div>
          Defection risk:{" "}
          {member.anti_defection.defection_risk}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border-light)",
          paddingTop: 4,
          marginTop: 4,
          fontSize: "var(--text-xs)",
          color: "var(--text-muted)",
        }}
      >
        {member.constituency_type} · {member.seat_safety} seat ·{" "}
        {member.archetype}
      </div>
    </div>
  );
}
