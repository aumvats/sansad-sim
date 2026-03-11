import { useState, useEffect, useCallback, useRef } from "react";
import type { Timeline } from "@/src/types/timeline";

export interface UsePlaybackReturn {
  playing: boolean;
  playhead: number;
  speed: number;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setPlayhead: (playhead: number) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

export function usePlayback(
  timeline: Timeline | null,
  onPlayheadChange: (playhead: number) => void
): UsePlaybackReturn {
  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [speed, setSpeed] = useState(1);

  const playheadRef = useRef(playhead);
  playheadRef.current = playhead;

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const autoResumeRef = useRef<number | null>(null);

  // Clear auto-resume if user manually interacts
  useEffect(() => {
    if (playing && autoResumeRef.current) {
      clearTimeout(autoResumeRef.current);
      autoResumeRef.current = null;
    }
  }, [playing]);

  // RAF loop
  useEffect(() => {
    if (!timeline || !playing) return;

    let lastFrame = performance.now();
    let rafId: number;

    function tick(now: number) {
      const dt = now - lastFrame;
      lastFrame = now;

      const next = playheadRef.current + dt * speedRef.current;

      // Check for pause events
      const pauseEvent = timeline!.events.find(
        (e) =>
          e.type === "pause" &&
          e.t > playheadRef.current &&
          e.t <= next
      );

      if (pauseEvent) {
        setPlayhead(pauseEvent.t);
        playheadRef.current = pauseEvent.t;
        onPlayheadChange(pauseEvent.t);
        // Auto-resume after a brief pause instead of hard-stopping
        setPlaying(false);
        autoResumeRef.current = window.setTimeout(() => {
          setPlaying(true);
        }, 1500);
        return;
      }

      // Check end
      if (next >= timeline!.duration) {
        setPlayhead(timeline!.duration);
        playheadRef.current = timeline!.duration;
        onPlayheadChange(timeline!.duration);
        setPlaying(false);
        return;
      }

      setPlayhead(next);
      playheadRef.current = next;
      onPlayheadChange(next);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [timeline, playing, onPlayheadChange]);

  const play = useCallback(() => setPlaying(true), []);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => setPlaying((p) => !p), []);

  const handleSetPlayhead = useCallback(
    (value: number) => {
      setPlayhead(value);
      playheadRef.current = value;
      onPlayheadChange(value);
    },
    [onPlayheadChange]
  );

  // Reset playhead when timeline changes
  useEffect(() => {
    if (timeline) {
      setPlayhead(0);
      playheadRef.current = 0;
      setPlaying(true);
    }
  }, [timeline]);

  return {
    playing,
    playhead,
    speed,
    setPlaying,
    setSpeed,
    setPlayhead: handleSetPlayhead,
    play,
    pause,
    toggle,
  };
}
