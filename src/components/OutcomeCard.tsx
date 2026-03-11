import type { ChamberResult, PresidentialAction } from "@/src/types/simulation";
import type { SCResult } from "@/src/types/justice";

interface Props {
  outcome: string;
  lsResult: ChamberResult | null;
  rsResult: ChamberResult | null;
  presidentialAction: PresidentialAction | null;
  scResult: SCResult | null;
  onReset: () => void;
}

export function OutcomeCard({
  outcome,
  lsResult,
  rsResult,
  presidentialAction,
  scResult,
  onReset,
}: Props) {
  const isPositive =
    outcome.includes("Signed") ||
    outcome.includes("Enacted");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(250,246,240,0.92)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "var(--card)",
          border: `2px solid ${isPositive ? "var(--yea)" : "var(--nay)"}`,
          borderRadius: 16,
          padding: "32px 40px",
          maxWidth: 480,
          width: "90%",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            fontSize: 40,
            marginBottom: 8,
          }}
        >
          {isPositive ? "✓" : "✗"}
        </div>

        <h2
          className="serif"
          style={{
            fontSize: "var(--text-xl)",
            color: isPositive ? "var(--yea)" : "var(--nay)",
            marginBottom: 16,
          }}
        >
          {outcome}
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            marginBottom: 24,
          }}
        >
          {lsResult && (
            <div>
              Lok Sabha: {lsResult.yea} Yea · {lsResult.nay} Nay
              {lsResult.abstain > 0 && ` · ${lsResult.abstain} Abstain`}
              {" — "}
              <strong style={{ color: lsResult.passed ? "var(--yea)" : "var(--nay)" }}>
                {lsResult.passed ? "PASSED" : "DEFEATED"}
              </strong>
            </div>
          )}
          {rsResult && (
            <div>
              Rajya Sabha: {rsResult.yea} Yea · {rsResult.nay} Nay
              {rsResult.abstain > 0 && ` · ${rsResult.abstain} Abstain`}
              {" — "}
              <strong style={{ color: rsResult.passed ? "var(--yea)" : "var(--nay)" }}>
                {rsResult.passed ? "PASSED" : "DEFEATED"}
              </strong>
            </div>
          )}
          {presidentialAction && (
            <div>
              President:{" "}
              <strong>{presidentialAction}</strong>
            </div>
          )}
          {scResult && scResult.challenged && (
            <div>
              Supreme Court:{" "}
              <strong
                style={{
                  color:
                    scResult.result === "UPHELD"
                      ? "var(--yea)"
                      : "var(--nay)",
                }}
              >
                {scResult.result}
              </strong>
            </div>
          )}
        </div>

        <button
          onClick={onReset}
          style={{
            padding: "10px 32px",
            background: "var(--ls-primary)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: "var(--text-base)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Another Bill
        </button>
      </div>
    </div>
  );
}
