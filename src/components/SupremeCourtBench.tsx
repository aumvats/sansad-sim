import type { SCResult } from "@/src/types/justice";

interface Props {
  scResult: SCResult | null;
}

export function SupremeCourtBench({ scResult }: Props) {
  if (!scResult || !scResult.challenged) return null;

  const resultColor =
    scResult.result === "UPHELD" ? "var(--yea)" : "var(--nay)";

  return (
    <div
      style={{
        padding: "12px 16px",
        background: "var(--card)",
        border: `1px solid ${resultColor}`,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "var(--text-base)",
          color: "var(--text-primary)",
          marginBottom: 8,
        }}
      >
        Supreme Court of India
      </div>

      {/* Bench visualization */}
      {scResult.votes && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          {scResult.votes.map((v, i) => (
            <div
              key={v.justiceId}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: v.upheld ? "var(--yea)" : "var(--nay)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                border:
                  i === scResult.votes!.length - 1
                    ? "2px solid var(--text-primary)"
                    : "none",
              }}
              title={`Justice ${v.justiceId}: ${v.upheld ? "UPHELD" : "STRUCK DOWN"}`}
            >
              {v.upheld ? "U" : "S"}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          textAlign: "center",
          fontWeight: 600,
          color: resultColor,
          fontSize: "var(--text-sm)",
        }}
      >
        {scResult.result === "UPHELD"
          ? `UPHELD — ${scResult.benchSize}-judge bench`
          : `STRUCK DOWN — ${scResult.benchSize}-judge bench`}
      </div>
    </div>
  );
}
