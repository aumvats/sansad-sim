interface Props {
  playing: boolean;
  playhead: number;
  duration: number;
  speed: number;
  onToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onScrub: (playhead: number) => void;
  counters: { yea: number; nay: number; abstain: number };
}

const SPEEDS = [0.5, 1, 2, 4];

export function PlaybackControls({
  playing,
  playhead,
  duration,
  speed,
  onToggle,
  onSpeedChange,
  onScrub,
  counters,
}: Props) {
  const progress = duration > 0 ? (playhead / duration) * 100 : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.06)",
        fontSize: "var(--text-sm)",
        position: "sticky",
        bottom: 0,
        zIndex: 20,
      }}
    >
      {/* Play/Pause */}
      <button
        onClick={onToggle}
        style={{
          width: 42,
          height: 42,
          border: "none",
          borderRadius: "50%",
          background: playing ? "var(--ls-primary)" : "var(--ls-accent)",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
          boxShadow: playing ? "none" : "0 0 0 3px var(--ls-light)",
          transition: "background 0.2s ease, box-shadow 0.2s ease",
        }}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? "⏸" : "▶"}
      </button>

      {/* Scrub bar */}
      <div style={{ flex: 1, position: "relative" }}>
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={playhead}
          onChange={(e) => onScrub(Number(e.target.value))}
          style={{ width: "100%", cursor: "pointer" }}
          aria-label="Timeline scrubber"
        />
      </div>

      {/* Speed selector */}
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            style={{
              padding: "2px 6px",
              fontSize: "var(--text-xs)",
              border: `1px solid ${s === speed ? "var(--ls-primary)" : "var(--border)"}`,
              borderRadius: 4,
              background: s === speed ? "var(--ls-light)" : "transparent",
              color: s === speed ? "var(--ls-dark)" : "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Vote tally */}
      <div
        style={{
          display: "flex",
          gap: 8,
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        <span style={{ color: "var(--yea)" }}>{counters.yea} Y</span>
        <span style={{ color: "var(--nay)" }}>{counters.nay} N</span>
        {counters.abstain > 0 && (
          <span style={{ color: "var(--text-muted)" }}>
            {counters.abstain} A
          </span>
        )}
      </div>
    </div>
  );
}
