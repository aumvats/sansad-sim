import { useState } from "react";

interface Props {
  onDismiss: () => void;
}

const STEP_0 = {
  title: "SansadSim",
  subtitle: "See how India legislates — an interactive simulation of the Indian Parliament",
  body: "Type any bill in plain English or pick a preset, then watch it move through Lok Sabha, Rajya Sabha, Presidential Assent, and Supreme Court review.",
};

const STEP_1_ITEMS = [
  { icon: "📝", label: "Write a Bill", desc: "Describe legislation in plain English" },
  { icon: "🏛", label: "Watch Lok Sabha Vote", desc: "543 MPs vote party-by-party with rare whip defiance" },
  { icon: "⚖️", label: "Rajya Sabha & President", desc: "Bill proceeds through upper house and presidential assent" },
  { icon: "📜", label: "See the Outcome", desc: "Enacted, defeated, or struck down by Supreme Court" },
];

const STEP_2_FEATURES = [
  "Party-first voting — India's anti-defection law means parties decide, not individuals",
  "15 real Indian parties with ideology profiles and coalition dynamics",
  "9 preset bills covering major Indian policy debates",
  "Playback controls — pause, scrub backward, speed up to 4×",
];

const TOTAL_STEPS = 3;

export function OnboardingPopup({ onDismiss }: Props) {
  const [step, setStep] = useState(0);
  const isLast = step === TOTAL_STEPS - 1;

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
          border: "2px solid var(--ls-primary)",
          borderRadius: 16,
          padding: "32px 40px",
          maxWidth: 520,
          width: "90%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          animation: "counter-in 0.3s ease",
        }}
      >
        {/* Step content */}
        <div key={step} style={{ animation: "counter-in 0.25s ease" }}>
          {/* Step 1: Welcome */}
          {step === 0 && (
            <>
              <h2
                className="serif"
                style={{
                  fontSize: "var(--text-xl)",
                  color: "var(--ls-primary)",
                  marginBottom: 8,
                  textAlign: "center",
                  letterSpacing: "-0.02em",
                }}
              >
                {STEP_0.title}
              </h2>
              <p
                style={{
                  fontSize: "var(--text-md)",
                  color: "var(--text-secondary)",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                {STEP_0.subtitle}
              </p>
              <p
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--text-muted)",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                {STEP_0.body}
              </p>
            </>
          )}

          {/* Step 2: How It Works */}
          {step === 1 && (
            <>
              <h3
                className="serif"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--text-primary)",
                  marginBottom: 16,
                  textAlign: "center",
                  letterSpacing: "-0.02em",
                }}
              >
                How It Works
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {STEP_1_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 20, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "var(--text-base)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Key Features */}
          {step === 2 && (
            <>
              <h3
                className="serif"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--text-primary)",
                  marginBottom: 16,
                  textAlign: "center",
                  letterSpacing: "-0.02em",
                }}
              >
                Key Features
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {STEP_2_FEATURES.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: "var(--text-base)",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        color: "var(--ls-primary)",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      ·
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom bar: dots + skip + next */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid var(--border-light)",
          }}
        >
          {/* Skip */}
          <button
            onClick={onDismiss}
            style={{
              background: "none",
              border: "none",
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            Skip
          </button>

          {/* Step dots */}
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    i === step ? "var(--ls-primary)" : "var(--border)",
                  transition: "background 0.2s ease",
                }}
              />
            ))}
          </div>

          {/* Next / Get Started */}
          <button
            onClick={isLast ? onDismiss : () => setStep(step + 1)}
            style={{
              padding: "8px 20px",
              background: "var(--ls-primary)",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: "var(--text-base)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isLast ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
