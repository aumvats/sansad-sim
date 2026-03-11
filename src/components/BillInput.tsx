import { useState } from "react";
import type { BillObject } from "@/src/types/bill";
import { PRESET_BILLS } from "@/src/data/presetBills";
import { analyzeBillText } from "@/src/engine/analyzeBillText";

interface Props {
  onSubmit: (bill: BillObject) => void;
}

const BILL_TYPE_COLORS: Record<string, string> = {
  ordinary: "var(--text-muted)",
  money: "var(--yea)",
  constitutional_amendment: "#C9A84C",
};

const BILL_TYPE_LABELS: Record<string, string> = {
  ordinary: "Ordinary Bill",
  money: "Money Bill",
  constitutional_amendment: "Constitutional Amendment",
};

const LEAN_LABELS: Record<string, string> = {
  left: "Left / Opposition",
  center: "Center / Bipartisan",
  right: "Right / NDA",
};

export function BillInput({ onSubmit }: Props) {
  const [text, setText] = useState("");

  function handleCustomSubmit() {
    if (text.trim().length < 10) return;
    const bill = analyzeBillText(text);
    onSubmit(bill);
  }

  return (
    <div
      style={{
        maxWidth: 800,
        width: "100%",
        padding: "0 16px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1
          className="serif"
          style={{
            fontSize: "var(--text-xxl)",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          SansadSim
        </h1>
        <p
          style={{
            fontSize: "var(--text-md)",
            color: "var(--text-secondary)",
          }}
        >
          See how India legislates.
        </p>
      </div>

      {/* Custom bill input */}
      <div style={{ marginBottom: 24 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe a bill in plain English... e.g., 'A bill to mandate minimum support prices for all agricultural produce and ban corporate farming'"
          rows={3}
          style={{
            width: "100%",
            padding: "12px 16px",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontFamily: "inherit",
            fontSize: "var(--text-base)",
            background: "var(--card)",
            color: "var(--text-primary)",
            resize: "vertical",
            outline: "none",
          }}
        />
        <button
          onClick={handleCustomSubmit}
          disabled={text.trim().length < 10}
          style={{
            marginTop: 8,
            padding: "10px 24px",
            background:
              text.trim().length < 10
                ? "var(--border)"
                : "var(--ls-primary)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: "var(--text-base)",
            fontWeight: 600,
            cursor:
              text.trim().length < 10 ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          Simulate
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{ flex: 1, height: 1, background: "var(--border-light)" }}
        />
        <span
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          or try a preset
        </span>
        <div
          style={{ flex: 1, height: 1, background: "var(--border-light)" }}
        />
      </div>

      {/* Preset bills grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {PRESET_BILLS.map((bill) => (
          <button
            key={bill.name}
            onClick={() => onSubmit(bill)}
            style={{
              padding: "12px 16px",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              textAlign: "left",
              cursor: "pointer",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--ls-accent)";
              e.currentTarget.style.boxShadow =
                "0 2px 8px rgba(14,107,94,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: BILL_TYPE_COLORS[bill.bill_type],
                  color: "white",
                  fontWeight: 600,
                }}
              >
                {BILL_TYPE_LABELS[bill.bill_type]}
              </span>
            </div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "var(--text-base)",
                color: "var(--text-primary)",
                marginBottom: 4,
              }}
            >
              {bill.name}
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
              }}
            >
              {LEAN_LABELS[bill.lean]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
