import type { SimStage } from "@/src/types/timeline";

interface Props {
  currentStage: SimStage;
  skippedStages: Set<SimStage>;
}

const STAGES: Array<{ key: SimStage; label: string; color: string }> = [
  { key: "lok_sabha", label: "Lok Sabha", color: "var(--ls-primary)" },
  { key: "rajya_sabha", label: "Rajya Sabha", color: "var(--rs-primary)" },
  { key: "joint_sitting", label: "Joint Sitting", color: "var(--text-secondary)" },
  { key: "president", label: "President", color: "var(--text-primary)" },
  { key: "sc_review", label: "SC Review", color: "var(--text-secondary)" },
];

const ORDER: SimStage[] = ["lok_sabha", "rajya_sabha", "joint_sitting", "president", "sc_review", "outcome"];

function stageIndex(stage: SimStage): number {
  const idx = ORDER.indexOf(stage);
  return idx === -1 ? -1 : idx;
}

export function StageIndicator({ currentStage, skippedStages }: Props) {
  const currentIdx = stageIndex(currentStage);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "8px 0",
        overflowX: "auto",
        fontSize: "var(--text-xs)",
      }}
    >
      {STAGES.map((stage, i) => {
        const idx = stageIndex(stage.key);
        const isActive = stage.key === currentStage;
        const isCompleted = currentIdx > idx;
        const isSkipped = skippedStages.has(stage.key);

        return (
          <div key={stage.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {i > 0 && (
              <div
                style={{
                  width: 16,
                  height: 1,
                  background: isCompleted ? stage.color : "var(--border)",
                }}
              />
            )}
            <div
              style={{
                padding: "3px 8px",
                borderRadius: 12,
                background: isActive
                  ? stage.color
                  : isCompleted
                    ? `${stage.color}20`
                    : "transparent",
                color: isActive
                  ? "white"
                  : isCompleted
                    ? stage.color
                    : isSkipped
                      ? "var(--text-muted)"
                      : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 400,
                textDecoration: isSkipped ? "line-through" : "none",
                whiteSpace: "nowrap",
                animation: isActive ? "stage-pulse 2s ease-in-out infinite" : undefined,
              }}
            >
              {isCompleted && !isSkipped && "✓ "}
              {stage.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
