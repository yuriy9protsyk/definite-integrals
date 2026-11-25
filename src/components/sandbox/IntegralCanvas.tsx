"use client";

import React, { useMemo } from "react";
import {
  Coordinates,
  Line,
  Mafs,
  Plot,
  Point,
  Polygon,
  Text,
} from "mafs";
import type { SandboxFunctionOption, SandboxMode } from "@/data/courseData";
import {
  buildSignedAreaPolygons,
  formatNum,
  type RiemannRect,
} from "@/lib/mathEngine";
import { selectEffectiveVar, useCourseStore } from "@/store/useCourseStore";

export interface IntegralCanvasProps {
  mode: SandboxMode;
  subMode: "additivity" | "mean-value";
  funcOption: SandboxFunctionOption;
  evaluateFn: (x: number) => number;
  evaluateBaseFn: (x: number) => number;
  evaluateAntiderivative: ((x: number) => number) | null;
  evaluateResidual: ((x: number) => number) | null;
  a: number;
  b: number;
  c: number;
  k: number;
  constC: number;
  rects: RiemannRect[];
  extrema: { min: number; max: number; mean: number };
}

const COLORS = {
  cyan: "#22d3ee",
  teal: "#2dd4bf",
  amber: "#f5b942",
  violet: "#8b5cf6",
  rose: "#fb7185",
  emerald: "#22c55e",
  slate: "#94a3c8",
};

export default function IntegralCanvas({
  mode,
  subMode,
  funcOption,
  evaluateFn,
  evaluateBaseFn,
  evaluateAntiderivative,
  evaluateResidual,
  a,
  b,
  c,
  k,
  constC,
  rects,
  extrema,
}: IntegralCanvasProps) {
  const effectiveVar = useCourseStore(selectEffectiveVar);

  const low = Math.min(a, b);
  const high = Math.max(a, b);

  const highlightA =
    effectiveVar === "var-a" ||
    effectiveVar === "var-alpha" ||
    effectiveVar === "var-sym";
  const highlightB =
    effectiveVar === "var-b" ||
    effectiveVar === "var-beta" ||
    effectiveVar === "var-sym";
  const highlightFx =
    effectiveVar === "var-fx" ||
    effectiveVar === "var-phi" ||
    effectiveVar === "var-dv" ||
    effectiveVar === "var-k";
  const highlightRects =
    effectiveVar === "var-sigma" ||
    effectiveVar === "var-dx" ||
    effectiveVar === "var-tau";
  const highlightXi = effectiveVar === "var-xi";
  const highlightC = effectiveVar === "var-c";
  const highlightMu = effectiveVar === "var-mu";
  const highlightF = effectiveVar === "var-F";
  const highlightDu = effectiveVar === "var-du";

  const clampedC = Math.max(low, Math.min(high, c));

  const mainSignedPolys = useMemo(() => {
    if (mode === "riemann") return [];
    return buildSignedAreaPolygons(evaluateFn, low, high, 96);
  }, [mode, evaluateFn, low, high]);

  const leftAdditivityPolys = useMemo(() => {
    if (mode !== "properties" || subMode !== "additivity") return [];
    return buildSignedAreaPolygons(evaluateFn, low, clampedC, 64);
  }, [mode, subMode, evaluateFn, low, clampedC]);

  const rightAdditivityPolys = useMemo(() => {
    if (mode !== "properties" || subMode !== "additivity") return [];
    return buildSignedAreaPolygons(evaluateFn, clampedC, high, 64);
  }, [mode, subMode, evaluateFn, clampedC, high]);

  const symLeftPolys = useMemo(() => {
    if (mode !== "symmetry" || low >= 0) return [];
    return buildSignedAreaPolygons(evaluateFn, low, Math.min(0, high), 72);
  }, [mode, evaluateFn, low, high]);

  const symRightPolys = useMemo(() => {
    if (mode !== "symmetry" || high <= 0) return [];
    return buildSignedAreaPolygons(evaluateFn, Math.max(0, low), high, 72);
  }, [mode, evaluateFn, low, high]);

  const hasNegativeRegion = useMemo(() => {
    if (mode === "riemann" || mode === "substitution") {
      return rects.some((r) => r.height < -1e-4);
    }
    if (mode === "symmetry") {
      return (
        symLeftPolys.some((p) => p.sign === "neg") ||
        symRightPolys.some((p) => p.sign === "neg")
      );
    }
    if (mode === "properties" && subMode === "additivity") {
      return (
        leftAdditivityPolys.some((p) => p.sign === "neg") ||
        rightAdditivityPolys.some((p) => p.sign === "neg")
      );
    }
    return mainSignedPolys.some((p) => p.sign === "neg");
  }, [
    mode,
    subMode,
    rects,
    symLeftPolys,
    symRightPolys,
    leftAdditivityPolys,
    rightAdditivityPolys,
    mainSignedPolys,
  ]);

  const shortEquationLabel = useMemo(() => {
    const cleaned = funcOption.label.replace(/\s*\([^)]*\)\s*/g, "").trim();
    return cleaned.startsWith("y =") || cleaned.startsWith("f(x)")
      ? cleaned
      : `f(x) = ${cleaned}`;
  }, [funcOption.label]);

  const safeY = (fn: (x: number) => number, x: number): number => {
    const y = fn(x);
    return Number.isFinite(y) ? y : 0;
  };

  const yAtA = safeY(evaluateFn, a);
  const yAtB = safeY(evaluateFn, b);
  const faVal = evaluateAntiderivative ? safeY(evaluateAntiderivative, a) + constC : 0;
  const fbVal = evaluateAntiderivative ? safeY(evaluateAntiderivative, b) + constC : 0;

  return (
    <div className="vyshmat-mafs relative w-full overflow-hidden rounded-xl border border-cyan-accent/25 bg-background/70">
      <Mafs
        height={295}
        viewBox={{ x: funcOption.xRange, y: funcOption.yRange }}
        preserveAspectRatio={false}
        pan={false}
        zoom={false}
      >
        <Coordinates.Cartesian
          xAxis={{ lines: 1, labels: (n) => (Number.isInteger(n) ? `${n}` : "") }}
          yAxis={{ lines: 1, labels: (n) => (Number.isInteger(n) ? `${n}` : "") }}
        />

        {/* MODE 1: RIEMANN SUM RECTANGLES */}
        {mode === "riemann" &&
          rects.map((rect) => {
            const isNeg = rect.height < 0;
            const fillColor = isNeg ? COLORS.rose : COLORS.teal;
            return (
              <React.Fragment key={rect.id}>
                <Polygon
                  points={[
                    [rect.x0, 0],
                    [rect.x1, 0],
                    [rect.x1, rect.height],
                    [rect.x0, rect.height],
                  ]}
                  color={fillColor}
                  fillOpacity={highlightRects ? 0.5 : 0.3}
                  strokeOpacity={highlightRects ? 0.95 : 0.72}
                  weight={highlightRects ? 2 : 1.2}
                />
                {highlightXi && (
                  <Point x={rect.xi} y={rect.height} color={COLORS.amber} />
                )}
              </React.Fragment>
            );
          })}

        {/* MODE 2A: PROPERTIES ADDITIVITY */}
        {mode === "properties" && subMode === "additivity" && (
          <>
            {leftAdditivityPolys.map((poly) => (
              <Polygon
                key={`left-${poly.id}`}
                points={poly.points}
                color={poly.sign === "neg" ? COLORS.rose : COLORS.cyan}
                fillOpacity={0.3}
                strokeOpacity={0.55}
              />
            ))}
            {rightAdditivityPolys.map((poly) => (
              <Polygon
                key={`right-${poly.id}`}
                points={poly.points}
                color={poly.sign === "neg" ? COLORS.rose : COLORS.violet}
                fillOpacity={0.32}
                strokeOpacity={0.55}
              />
            ))}
            {Math.abs(k - 1) > 0.01 && (
              <Plot.OfX
                y={(x) => safeY(evaluateBaseFn, x)}
                color={COLORS.slate}
                style="dashed"
                weight={1.5}
                opacity={0.55}
              />
            )}
            <Line.Segment
              point1={[clampedC, 0]}
              point2={[clampedC, safeY(evaluateFn, clampedC)]}
              color={COLORS.amber}
              weight={highlightC ? 3.5 : 2.2}
            />
            <Point
              x={clampedC}
              y={safeY(evaluateFn, clampedC)}
              color={COLORS.amber}
            />
            <Text
              x={clampedC}
              y={Math.min(0, safeY(evaluateFn, clampedC)) - 0.38}
              color={COLORS.amber}
              size={12}
            >
              c={formatNum(clampedC, 2)}
            </Text>
          </>
        )}

        {/* MODE 2B: MEAN VALUE THEOREM */}
        {mode === "properties" && subMode === "mean-value" && (
          <>
            {mainSignedPolys.map((poly) => (
              <Polygon
                key={`mv-${poly.id}`}
                points={poly.points}
                color={poly.sign === "neg" ? COLORS.rose : COLORS.teal}
                fillOpacity={0.24}
                strokeOpacity={0.4}
              />
            ))}
            {/* Mean-value rectangle [low, high] x [0, mu] */}
            <Polygon
              points={[
                [low, 0],
                [high, 0],
                [high, extrema.mean],
                [low, extrema.mean],
              ]}
              color={COLORS.amber}
              fillOpacity={highlightMu ? 0.34 : 0.18}
              strokeOpacity={highlightMu ? 1 : 0.85}
              weight={highlightMu ? 3 : 2}
            />
            <Line.Segment
              point1={[low, extrema.min]}
              point2={[high, extrema.min]}
              color={COLORS.slate}
              style="dashed"
              weight={1.3}
            />
            <Line.Segment
              point1={[low, extrema.max]}
              point2={[high, extrema.max]}
              color={COLORS.slate}
              style="dashed"
              weight={1.3}
            />
            <Text x={high + 0.25} y={extrema.mean} color={COLORS.amber} size={12}>
              μ={formatNum(extrema.mean, 2)}
            </Text>
            <Text x={high + 0.25} y={extrema.max} color={COLORS.slate} size={10}>
              M={formatNum(extrema.max, 2)}
            </Text>
            <Text x={high + 0.25} y={extrema.min} color={COLORS.slate} size={10}>
              m={formatNum(extrema.min, 2)}
            </Text>
          </>
        )}

        {/* MODE 3: NEWTON-LEIBNIZ DUAL f(x) + F(x)+C */}
        {mode === "newton-leibniz" && (
          <>
            {mainSignedPolys.map((poly) => (
              <Polygon
                key={`nl-${poly.id}`}
                points={poly.points}
                color={poly.sign === "neg" ? COLORS.rose : COLORS.teal}
                fillOpacity={0.28}
                strokeOpacity={0.55}
              />
            ))}
            {evaluateAntiderivative && (
              <>
                <Plot.OfX
                  y={(x) => safeY(evaluateAntiderivative, x) + constC}
                  color={COLORS.violet}
                  weight={highlightF ? 3.8 : 2.4}
                  opacity={0.95}
                />
                <Point x={a} y={faVal} color={COLORS.amber} />
                <Point x={b} y={fbVal} color={COLORS.violet} />
                <Line.Segment
                  point1={[b, faVal]}
                  point2={[b, fbVal]}
                  color={COLORS.amber}
                  weight={highlightF ? 3.5 : 2.2}
                />
                <Line.Segment
                  point1={[a, faVal]}
                  point2={[b, faVal]}
                  color={COLORS.violet}
                  style="dashed"
                  weight={1.2}
                  opacity={0.6}
                />
              </>
            )}
          </>
        )}

        {/* MODE 4: SUBSTITUTION (Signed rectangles + quarter circle radius) */}
        {mode === "substitution" && (
          <>
            {rects.map((rect) => (
              <Polygon
                key={rect.id}
                points={[
                  [rect.x0, 0],
                  [rect.x1, 0],
                  [rect.x1, rect.height],
                  [rect.x0, rect.height],
                ]}
                color={rect.height < 0 ? COLORS.rose : COLORS.teal}
                fillOpacity={highlightRects ? 0.42 : 0.28}
                strokeOpacity={0.65}
                weight={1}
              />
            ))}
            {funcOption.id === "quarter-circle" && (
              <Line.Segment
                point1={[0, 0]}
                point2={[Math.max(-1, Math.min(1, b)), safeY(evaluateFn, Math.max(-1, Math.min(1, b)))]}
                color={COLORS.amber}
                style="dashed"
                weight={2}
              />
            )}
          </>
        )}

        {/* MODE 5: INTEGRATION BY PARTS */}
        {mode === "by-parts" && (
          <>
            {mainSignedPolys.map((poly) => (
              <Polygon
                key={`bp-${poly.id}`}
                points={poly.points}
                color={poly.sign === "neg" ? COLORS.rose : COLORS.teal}
                fillOpacity={0.28}
                strokeOpacity={0.55}
              />
            ))}
            {evaluateResidual && (
              <Plot.OfX
                y={(x) => safeY(evaluateResidual, x)}
                color={COLORS.rose}
                style="dashed"
                weight={highlightDu ? 3.5 : 2}
                opacity={0.85}
              />
            )}
          </>
        )}

        {/* MODE 6: SYMMETRY (Even & Odd — exact sign-split polygons!) */}
        {mode === "symmetry" && (
          <>
            {symLeftPolys.map((poly) => (
              <Polygon
                key={`sym-l-${poly.id}`}
                points={poly.points}
                color={poly.sign === "neg" ? COLORS.rose : COLORS.cyan}
                fillOpacity={0.36}
                strokeOpacity={0.7}
              />
            ))}
            {symRightPolys.map((poly) => (
              <Polygon
                key={`sym-r-${poly.id}`}
                points={poly.points}
                color={poly.sign === "neg" ? COLORS.rose : COLORS.teal}
                fillOpacity={0.36}
                strokeOpacity={0.7}
              />
            ))}
            <Line.Segment
              point1={[0, funcOption.yRange[0]]}
              point2={[0, funcOption.yRange[1]]}
              color={COLORS.amber}
              style="dashed"
              weight={effectiveVar === "var-sym" ? 3 : 1.5}
              opacity={0.75}
            />
          </>
        )}

        {/* MAIN FUNCTION CURVE */}
        <Plot.OfX
          y={(x) => {
            if (
              funcOption.domainMin !== undefined &&
              x < funcOption.domainMin
            ) {
              return NaN;
            }
            if (
              funcOption.domainMax !== undefined &&
              x > funcOption.domainMax
            ) {
              return NaN;
            }
            return safeY(evaluateFn, x);
          }}
          color={COLORS.cyan}
          weight={highlightFx ? 4 : 2.6}
        />

        {/* VERTICAL BOUNDS x = a and x = b */}
        <Line.Segment
          point1={[a, 0]}
          point2={[a, yAtA]}
          color={COLORS.amber}
          weight={highlightA ? 3.5 : 1.8}
          opacity={highlightA ? 1 : 0.8}
        />
        <Line.Segment
          point1={[b, 0]}
          point2={[b, yAtB]}
          color={COLORS.cyan}
          weight={highlightB ? 3.5 : 1.8}
          opacity={highlightB ? 1 : 0.85}
        />

        <Point x={a} y={yAtA} color={COLORS.amber} />
        <Point x={b} y={yAtB} color={COLORS.cyan} />
      </Mafs>

      {/* Top-right compact equation pill (never clips) */}
      <div className="pointer-events-none absolute right-2.5 top-2.5 max-w-[calc(100%-1.5rem)] truncate rounded-lg border border-border/90 bg-card/90 px-2.5 py-1 font-mono text-xs font-medium text-foreground shadow-sm">
        {shortEquationLabel}
      </div>

      {/* Signed area legend when curve dips below X-axis */}
      {hasNegativeRegion && (
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex items-center gap-2.5 rounded-lg border border-border/80 bg-card/85 px-2 py-1 text-[10px] font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1 text-teal-accent">
            <span className="h-2 w-2 rounded-full bg-teal-accent" />
            f(x) &gt; 0
          </span>
          <span className="inline-flex items-center gap-1 text-rose-accent">
            <span className="h-2 w-2 rounded-full bg-rose-accent" />
            f(x) &lt; 0
          </span>
        </div>
      )}

      {/* Active X-Ray link badge */}
      {effectiveVar && (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-amber-accent/50 bg-popover/90 px-2.5 py-1 text-[11px] font-medium text-amber-accent shadow-sm">
          X-Ray активний на графіку
        </div>
      )}
    </div>
  );
}
