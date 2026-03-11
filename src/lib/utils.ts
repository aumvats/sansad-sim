/** Shuffle an array (Fisher-Yates) — returns a new array */
export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Clamp a value between min and max */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/** Deterministic hash of a string → number (for consistent lobbyist selection) */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Get last element of a filtered array, or undefined */
export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

/** Format number with commas (Indian numbering: 1,00,000) */
export function formatIndian(n: number): string {
  const str = n.toString();
  if (str.length <= 3) return str;
  const lastThree = str.slice(-3);
  const rest = str.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return formatted + "," + lastThree;
}
