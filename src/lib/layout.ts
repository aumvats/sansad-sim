/**
 * SVG layout math for SansadSim chamber visualizations.
 * Horseshoe (Lok Sabha) + Rectangle (Rajya Sabha) + SC Bench
 */

export interface SeatPosition {
  cx: number;
  cy: number;
  r: number;
}

// ── Lok Sabha: Horseshoe Layout ─────────────────────────

/**
 * Compute horseshoe seat positions for Lok Sabha.
 * Treasury bench (NDA) on the right, Opposition (INDIA) on the left.
 * Concentric arcs: inner = front bench (ministers), outer = backbenchers.
 *
 * @param members Array of { id, side } where side is 'treasury' | 'opposition'
 * @param dotRadius Base dot radius (4px desktop, 3px mobile)
 */
export function computeHorseshoeLayout(
  treasuryCount: number,
  oppositionCount: number,
  dotRadius: number
): { treasury: SeatPosition[]; opposition: SeatPosition[] } {
  const centerX = 400;
  const topY = 40; // Speaker's position
  const innerRadius = 80;
  const rowSpacing = dotRadius * 2.5;
  const arcGap = dotRadius * 1.5; // Gap between dots along arc
  const seatsPerRow = Math.floor((Math.PI * innerRadius) / (arcGap * 2 + dotRadius * 2));

  return {
    treasury: layoutSide(
      treasuryCount,
      centerX,
      topY,
      innerRadius,
      rowSpacing,
      arcGap,
      dotRadius,
      "right"
    ),
    opposition: layoutSide(
      oppositionCount,
      centerX,
      topY,
      innerRadius,
      rowSpacing,
      arcGap,
      dotRadius,
      "left"
    ),
  };
}

function layoutSide(
  count: number,
  centerX: number,
  topY: number,
  innerRadius: number,
  rowSpacing: number,
  arcGap: number,
  dotRadius: number,
  side: "left" | "right"
): SeatPosition[] {
  const positions: SeatPosition[] = [];
  let remaining = count;
  let row = 0;

  while (remaining > 0) {
    const radius = innerRadius + row * rowSpacing;
    // Each side covers roughly π/2 of the horseshoe (quarter arc + straight section)
    const arcLength = radius * Math.PI * 0.45; // ~45% of semicircle per side
    const seatsInRow = Math.min(
      remaining,
      Math.max(8, Math.floor(arcLength / (dotRadius * 2 + arcGap)))
    );

    for (let i = 0; i < seatsInRow; i++) {
      // Distribute seats along the arc
      const fraction = seatsInRow > 1 ? i / (seatsInRow - 1) : 0.5;

      // Arc from top to bottom on one side
      // Right side: angles from π/2 (top) to 0 (right) to -π/4 (bottom-right)
      // Left side: angles from π/2 (top) to π (left) to 5π/4 (bottom-left)
      let angle: number;
      if (side === "right") {
        angle = Math.PI * 0.5 - fraction * Math.PI * 0.85;
      } else {
        angle = Math.PI * 0.5 + fraction * Math.PI * 0.85;
      }

      const cx = centerX + Math.cos(angle) * radius;
      const cy = topY + 10 + radius - Math.sin(angle) * radius;

      positions.push({
        cx,
        cy,
        r: row === 0 ? dotRadius * 1.2 : dotRadius, // Front bench slightly larger
      });
    }

    remaining -= seatsInRow;
    row++;
  }

  return positions;
}

// ── Rajya Sabha: Rectangular Layout ─────────────────────

/**
 * Compute rectangular grid positions for Rajya Sabha.
 * Chairman at top, ruling on left, opposition on right.
 */
export function computeRectangleLayout(
  count: number,
  dotRadius: number,
  width: number,
  startY: number
): SeatPosition[] {
  const positions: SeatPosition[] = [];
  const cols = Math.floor(width / (dotRadius * 2.5));
  const rows = Math.ceil(count / cols);
  const colSpacing = width / (cols + 1);
  const rowSpacing = dotRadius * 3;

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    positions.push({
      cx: colSpacing + col * colSpacing,
      cy: startY + row * rowSpacing,
      r: dotRadius,
    });
  }

  return positions;
}

// ── Supreme Court Bench ─────────────────────────────────

/**
 * Linear bench layout for SC justices. CJI centered.
 */
export function computeBenchLayout(
  benchSize: number,
  centerX: number,
  centerY: number,
  spacing: number
): SeatPosition[] {
  const positions: SeatPosition[] = [];
  const startX = centerX - ((benchSize - 1) * spacing) / 2;

  for (let i = 0; i < benchSize; i++) {
    positions.push({
      cx: startX + i * spacing,
      cy: centerY,
      r: 8, // Larger dots for justices
    });
  }

  return positions;
}

// ── Viewbox Targets ─────────────────────────────────────

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function getViewboxTarget(
  stage: string,
  isMobile: boolean
): ViewBox {
  const targets: Record<string, ViewBox> = {
    idle: isMobile
      ? { x: -20, y: -20, w: 840, h: 600 }
      : { x: -40, y: -30, w: 900, h: 650 },
    lok_sabha: isMobile
      ? { x: 50, y: 0, w: 700, h: 550 }
      : { x: 30, y: -10, w: 750, h: 580 },
    rajya_sabha: isMobile
      ? { x: 50, y: 0, w: 700, h: 400 }
      : { x: 30, y: -10, w: 750, h: 450 },
    joint_sitting: isMobile
      ? { x: 0, y: -20, w: 800, h: 650 }
      : { x: -20, y: -30, w: 850, h: 700 },
    president: { x: 250, y: 100, w: 300, h: 300 },
    sc_review: { x: 200, y: 80, w: 400, h: 300 },
    outcome: isMobile
      ? { x: -20, y: -20, w: 840, h: 600 }
      : { x: -40, y: -30, w: 900, h: 650 },
  };

  return targets[stage] ?? targets.idle;
}

/** Lerp a viewbox toward a target */
export function lerpViewBox(
  current: ViewBox,
  target: ViewBox,
  factor: number
): ViewBox {
  return {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
    w: current.w + (target.w - current.w) * factor,
    h: current.h + (target.h - current.h) * factor,
  };
}
