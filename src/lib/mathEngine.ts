import { compile, type EvalFunction } from "mathjs";

export type RiemannMethod = "left" | "mid" | "right";

export interface RiemannRect {
  id: string;
  x0: number;
  x1: number;
  xi: number;
  height: number;
  area: number;
}

export interface CompiledExpressionResult {
  evaluate: (x: number, k?: number) => number;
  error: string | null;
}

export function compileMathExpression(expr: string): CompiledExpressionResult {
  try {
    const compiled: EvalFunction = compile(expr);
    // Smoke-test evaluation at x = 0.5 to detect undefined symbols early
    const testVal: unknown = compiled.evaluate({ x: 0.5, k: 2, pi: Math.PI, e: Math.E });
    if (typeof testVal !== "number" && typeof testVal !== "object") {
      return {
        evaluate: () => 0,
        error: "Вираз не повертає дійсне число.",
      };
    }

    return {
      evaluate: (x: number, k = 1): number => {
        try {
          const val: unknown = compiled.evaluate({ x, k, pi: Math.PI, e: Math.E });
          if (typeof val === "number" && Number.isFinite(val)) {
            return val;
          }
          return NaN;
        } catch {
          return NaN;
        }
      },
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Некоректний математичний вираз";
    return {
      evaluate: () => NaN,
      error: message,
    };
  }
}

export function computeRiemannSum(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  method: RiemannMethod,
): { sum: number; signedRects: RiemannRect[]; geometricArea: number; diameter: number } {
  const safeN = Math.max(1, Math.min(200, Math.round(n)));
  const dx = (b - a) / safeN;
  const diameter = Math.abs(dx);
  const rects: RiemannRect[] = [];
  let sum = 0;
  let geometricArea = 0;

  for (let i = 0; i < safeN; i++) {
    const x0 = a + i * dx;
    const x1 = a + (i + 1) * dx;
    const xi =
      method === "left" ? x0 : method === "right" ? x1 : (x0 + x1) / 2;
    const rawH = fn(xi);
    const height = Number.isFinite(rawH) ? rawH : 0;
    const area = height * dx;
    sum += area;
    geometricArea += Math.abs(height * Math.abs(dx));

    rects.push({
      id: `rect-${i}`,
      x0: Math.min(x0, x1),
      x1: Math.max(x0, x1),
      xi,
      height,
      area,
    });
  }

  return { sum, signedRects: rects, geometricArea, diameter };
}

/**
 * High-accuracy composite Simpson's rule (200 subintervals) for real-time exact integral comparison.
 */
export function computeSimpsonIntegral(
  fn: (x: number) => number,
  a: number,
  b: number,
  intervals = 200,
): number {
  if (Math.abs(b - a) < 1e-10) {
    return 0;
  }
  const n = intervals % 2 === 0 ? intervals : intervals + 1;
  const h = (b - a) / n;
  let total = 0;

  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    // Clamp slightly inside endpoints for functions like sqrt(1 - x^2)
    const clampedX =
      i === 0
        ? a + Math.sign(b - a) * 1e-9
        : i === n
          ? b - Math.sign(b - a) * 1e-9
          : x;
    const rawY = fn(clampedX);
    const y = Number.isFinite(rawY) ? rawY : 0;
    const weight = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
    total += weight * y;
  }

  return (h / 3) * total;
}

export function computeGeometricIntegral(
  fn: (x: number) => number,
  a: number,
  b: number,
  intervals = 200,
): number {
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  return computeSimpsonIntegral((x) => Math.abs(fn(x)), low, high, intervals);
}

export function computeExtremaOnInterval(
  fn: (x: number) => number,
  a: number,
  b: number,
  samples = 160,
): { min: number; max: number; mean: number } {
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  if (Math.abs(high - low) < 1e-9) {
    const val = fn(low);
    const safe = Number.isFinite(val) ? val : 0;
    return { min: safe, max: safe, mean: safe };
  }
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i <= samples; i++) {
    const x = low + ((high - low) * i) / samples;
    const y = fn(x);
    if (Number.isFinite(y)) {
      if (y < min) min = y;
      if (y > max) max = y;
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 0, mean: 0 };
  }
  const exact = computeSimpsonIntegral(fn, low, high, 200);
  const mean = exact / (high - low);
  return { min, max, mean };
}

export interface SignedAreaPolygon {
  id: string;
  sign: "pos" | "neg";
  points: [number, number][];
}

/**
 * Splits [fromX, toX] at every X-axis crossing (linear root interpolation)
 * so positive regions (y >= 0) and negative regions (y < 0) render as
 * distinct, accurately colored polygons without bleeding across y = 0.
 */
export function buildSignedAreaPolygons(
  fn: (x: number) => number,
  fromX: number,
  toX: number,
  steps = 96,
): SignedAreaPolygon[] {
  const low = Math.min(fromX, toX);
  const high = Math.max(fromX, toX);
  if (high - low < 1e-6) {
    return [];
  }

  const samples: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const x = low + ((high - low) * i) / steps;
    const clampedX = i === 0 ? low + 1e-7 : i === steps ? high - 1e-7 : x;
    const rawY = fn(clampedX);
    const y = Number.isFinite(rawY) ? rawY : 0;
    samples.push([x, Math.abs(y) < 1e-9 ? 0 : y]);
  }

  const polygons: SignedAreaPolygon[] = [];
  let currentSign: "pos" | "neg" | null = null;
  let segmentPts: [number, number][] = [];

  const flush = (endX: number) => {
    if (currentSign && segmentPts.length >= 2) {
      const startX = segmentPts[0][0];
      polygons.push({
        id: `seg-${polygons.length}-${currentSign}`,
        sign: currentSign,
        points: [[startX, 0], ...segmentPts, [endX, 0]],
      });
    }
    segmentPts = [];
    currentSign = null;
  };

  for (let i = 0; i < samples.length; i++) {
    const [x, y] = samples[i];
    const ptSign: "pos" | "neg" | "zero" =
      y > 0 ? "pos" : y < 0 ? "neg" : "zero";

    if (i === 0) {
      if (ptSign !== "zero") {
        currentSign = ptSign;
        segmentPts.push([x, y]);
      }
      continue;
    }

    const [prevX, prevY] = samples[i - 1];

    // Exact sign flip between prevY and y
    if ((prevY > 0 && y < 0) || (prevY < 0 && y > 0)) {
      const t = Math.abs(prevY) / (Math.abs(prevY) + Math.abs(y));
      const xZero = prevX + t * (x - prevX);
      segmentPts.push([xZero, 0]);
      flush(xZero);
      currentSign = y > 0 ? "pos" : "neg";
      segmentPts.push([xZero, 0], [x, y]);
    } else if (ptSign === "zero") {
      if (currentSign) {
        segmentPts.push([x, 0]);
        flush(x);
      }
    } else {
      if (!currentSign) {
        currentSign = ptSign;
        segmentPts.push([prevX, 0], [x, y]);
      } else {
        segmentPts.push([x, y]);
      }
    }
  }

  if (currentSign && segmentPts.length >= 2) {
    flush(samples[samples.length - 1][0]);
  }

  return polygons;
}

export function buildFilledPolygonPoints(
  fn: (x: number) => number,
  fromX: number,
  toX: number,
  steps = 72,
): [number, number][] {
  const low = Math.min(fromX, toX);
  const high = Math.max(fromX, toX);
  if (high - low < 1e-6) {
    return [];
  }
  const pts: [number, number][] = [[low, 0]];
  for (let i = 0; i <= steps; i++) {
    const x = low + ((high - low) * i) / steps;
    const clampedX =
      i === 0 ? low + 1e-7 : i === steps ? high - 1e-7 : x;
    const y = fn(clampedX);
    pts.push([x, Number.isFinite(y) ? y : 0]);
  }
  pts.push([high, 0]);
  return pts;
}

export function formatNum(val: number, decimals = 3): string {
  if (!Number.isFinite(val)) return "—";
  const threshold = 0.5 * Math.pow(10, -decimals);
  const safe = Math.abs(val) < threshold ? 0 : val;
  const formatted = safe
    .toFixed(decimals)
    .replace(/\.?0+$/, (m) => (m.startsWith(".") ? "" : m));
  return formatted === "-0" ? "0" : formatted;
}
