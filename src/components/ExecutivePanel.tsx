import type { PresidentialAction } from "@/src/types/simulation";

interface Props {
  action: PresidentialAction | null;
}

export function ExecutivePanel({ action }: Props) {
  if (!action) return null;

  const color =
    action === "ASSENT"
      ? "var(--yea)"
      : action === "RETURN"
        ? "var(--nay)"
        : "var(--text-muted)";

  const label =
    action === "ASSENT"
      ? "Signed into Law"
      : action === "RETURN"
        ? "Returned to Parliament"
        : "Pocket Veto — No Action";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: "var(--card)",
        border: `1px solid ${color}`,
        borderRadius: 12,
      }}
    >
      {/* Ashoka emblem silhouette (simplified) */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: `${color}15`,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {action === "ASSENT" ? "✓" : action === "RETURN" ? "↩" : "—"}
      </div>

      <div>
        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "var(--text-base)" }}>
          President of India
        </div>
        <div style={{ color, fontWeight: 600, fontSize: "var(--text-sm)" }}>
          {label}
        </div>
      </div>
    </div>
  );
}
