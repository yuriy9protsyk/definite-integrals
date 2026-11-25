"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  AlertTriangle,
  Lock,
  RotateCcw,
  Sparkles,
  Unlock,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EdgeCasePreset, SandboxConfig } from "@/data/courseData";
import {
  compileMathExpression,
  computeExtremaOnInterval,
  computeGeometricIntegral,
  computeRiemannSum,
  computeSimpsonIntegral,
  formatNum,
  type RiemannMethod,
} from "@/lib/mathEngine";

function GraphSkeleton() {
  return (
    <div
      className="flex h-[295px] w-full flex-col justify-between rounded-xl border border-cyan-accent/25 bg-background/70 p-4"
      aria-label="Завантаження інтерактивного графіка"
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 animate-pulse rounded bg-secondary" />
        <div className="h-6 w-20 animate-pulse rounded-lg bg-secondary" />
      </div>
      <div className="flex items-end gap-1.5 px-6 pb-4">
        <div className="h-8 flex-1 animate-pulse rounded-t bg-cyan-accent/20" />
        <div className="h-14 flex-1 animate-pulse rounded-t bg-cyan-accent/25" />
        <div className="h-20 flex-1 animate-pulse rounded-t bg-cyan-accent/30" />
        <div className="h-28 flex-1 animate-pulse rounded-t bg-cyan-accent/35" />
        <div className="h-36 flex-1 animate-pulse rounded-t bg-cyan-accent/40" />
      </div>
    </div>
  );
}

const IntegralCanvas = dynamic(() => import("./IntegralCanvas"), {
  ssr: false,
  loading: () => <GraphSkeleton />,
});

interface IntegralSandboxProps {
  config: SandboxConfig;
}

export function IntegralSandbox({ config }: IntegralSandboxProps) {
  const initialFunc =
    config.functions.find((f) => f.id === config.defaultFunctionId) ??
    config.functions[0];

  const [funcId, setFuncId] = useState<string>(initialFunc.id);
  const [a, setA] = useState<number>(initialFunc.defaultA);
  const [b, setB] = useState<number>(initialFunc.defaultB);
  const [n, setN] = useState<number>(config.defaultN);
  const [method, setMethod] = useState<RiemannMethod>(config.defaultMethod);
  const [c, setC] = useState<number>(
    config.defaultC ?? (initialFunc.defaultA + initialFunc.defaultB) / 2,
  );
  const [k, setK] = useState<number>(config.defaultK ?? 1);
  const [constC, setConstC] = useState<number>(0);
  const [subMode, setSubMode] = useState<"additivity" | "mean-value">(
    "additivity",
  );
  const [symmetricLock, setSymmetricLock] = useState<boolean>(
    config.mode === "symmetry",
  );
  const [activePresetNote, setActivePresetNote] = useState<string | null>(null);

  const funcOption = useMemo(
    () => config.functions.find((f) => f.id === funcId) ?? config.functions[0],
    [config.functions, funcId],
  );

  const compiledBase = useMemo(
    () => compileMathExpression(funcOption.expr),
    [funcOption.expr],
  );

  const compiledAnti = useMemo(
    () =>
      funcOption.antiderivativeExpr
        ? compileMathExpression(funcOption.antiderivativeExpr)
        : null,
    [funcOption.antiderivativeExpr],
  );

  const compiledResidual = useMemo(
    () =>
      funcOption.residualExpr
        ? compileMathExpression(funcOption.residualExpr)
        : null,
    [funcOption.residualExpr],
  );

  const compiledBoundary = useMemo(
    () =>
      funcOption.boundaryTermExpr
        ? compileMathExpression(funcOption.boundaryTermExpr)
        : null,
    [funcOption.boundaryTermExpr],
  );

  const evaluateBaseFn = useMemo(
    () => (x: number) => compiledBase.evaluate(x, k),
    [compiledBase, k],
  );

  const evaluateFn = useMemo(() => {
    if (config.mode === "properties") {
      return (x: number) => k * compiledBase.evaluate(x, 1);
    }
    return (x: number) => compiledBase.evaluate(x, k);
  }, [config.mode, compiledBase, k]);

  const evaluateAntiderivative = useMemo(
    () =>
      compiledAnti && !compiledAnti.error
        ? (x: number) => compiledAnti.evaluate(x, k)
        : null,
    [compiledAnti, k],
  );

  const evaluateResidual = useMemo(
    () =>
      compiledResidual && !compiledResidual.error
        ? (x: number) => compiledResidual.evaluate(x, k)
        : null,
    [compiledResidual, k],
  );

  const riemann = useMemo(
    () => computeRiemannSum(evaluateFn, a, b, n, method),
    [evaluateFn, a, b, n, method],
  );

  const exactIntegral = useMemo(
    () => computeSimpsonIntegral(evaluateFn, a, b, 200),
    [evaluateFn, a, b],
  );

  const geometricArea = useMemo(
    () => computeGeometricIntegral(evaluateFn, a, b, 200),
    [evaluateFn, a, b],
  );

  const extrema = useMemo(
    () => computeExtremaOnInterval(evaluateFn, a, b, 160),
    [evaluateFn, a, b],
  );

  const clampedC = Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));

  const additivityStats = useMemo(() => {
    if (config.mode !== "properties") return null;
    const leftVal = computeSimpsonIntegral(evaluateFn, a, clampedC, 120);
    const rightVal = computeSimpsonIntegral(evaluateFn, clampedC, b, 120);
    return { leftVal, rightVal };
  }, [config.mode, evaluateFn, a, b, clampedC]);

  const byPartsStats = useMemo(() => {
    if (config.mode !== "by-parts" || !compiledBoundary || !evaluateResidual) {
      return null;
    }
    const uvDiff =
      compiledBoundary.evaluate(b, k) - compiledBoundary.evaluate(a, k);
    const residualInt = computeSimpsonIntegral(evaluateResidual, a, b, 160);
    return { uvDiff, residualInt };
  }, [config.mode, compiledBoundary, evaluateResidual, a, b, k]);

  const symmetryStats = useMemo(() => {
    if (config.mode !== "symmetry") return null;
    const leftInt = a < 0 ? computeSimpsonIntegral(evaluateFn, a, Math.min(0, b), 120) : 0;
    const rightInt = b > 0 ? computeSimpsonIntegral(evaluateFn, Math.max(0, a), b, 120) : 0;
    return { leftInt, rightInt, isSymmetric: Math.abs(a + b) < 0.03 };
  }, [config.mode, evaluateFn, a, b]);

  const newtonStats = useMemo(() => {
    if (config.mode !== "newton-leibniz" || !evaluateAntiderivative) return null;
    const fA = evaluateAntiderivative(a) + constC;
    const fB = evaluateAntiderivative(b) + constC;
    return { fA, fB, diff: fB - fA };
  }, [config.mode, evaluateAntiderivative, a, b, constC]);

  const substitutionBounds = useMemo(() => {
    if (config.mode !== "substitution") return null;
    if (funcOption.id === "x-cos-x2") {
      return {
        rule: "y = x²",
        alpha: a * a,
        beta: b * b,
      };
    }
    const clampA = Math.max(-1, Math.min(1, a));
    const clampB = Math.max(-1, Math.min(1, b));
    return {
      rule: "x = sin t",
      alpha: Math.asin(clampA),
      beta: Math.asin(clampB),
    };
  }, [config.mode, funcOption.id, a, b]);

  const handleSelectFunction = (newId: string) => {
    const next = config.functions.find((f) => f.id === newId);
    if (!next) return;
    setFuncId(next.id);
    setA(next.defaultA);
    setB(next.defaultB);
    setC((next.defaultA + next.defaultB) / 2);
    setConstC(0);
    setActivePresetNote(null);
  };

  const handleApplyPreset = (preset: EdgeCasePreset) => {
    if (preset.functionId) {
      setFuncId(preset.functionId);
    }
    setA(preset.a);
    setB(preset.b);
    if (preset.n !== undefined) setN(preset.n);
    if (preset.method !== undefined) setMethod(preset.method);
    if (preset.c !== undefined) setC(preset.c);
    if (preset.k !== undefined) setK(preset.k);
    if (preset.constC !== undefined) setConstC(preset.constC);
    if (preset.subMode !== undefined) setSubMode(preset.subMode);
    if (preset.symmetricLock !== undefined) {
      setSymmetricLock(preset.symmetricLock);
    }
    setActivePresetNote(preset.description);
  };

  const handleReset = () => {
    setFuncId(initialFunc.id);
    setA(initialFunc.defaultA);
    setB(initialFunc.defaultB);
    setN(config.defaultN);
    setMethod(config.defaultMethod);
    setC(config.defaultC ?? (initialFunc.defaultA + initialFunc.defaultB) / 2);
    setK(config.defaultK ?? 1);
    setConstC(0);
    setSubMode("additivity");
    setSymmetricLock(config.mode === "symmetry");
    setActivePresetNote(null);
  };

  const domainMin = funcOption.domainMin ?? funcOption.xRange[0] + 0.1;
  const domainMax = funcOption.domainMax ?? funcOption.xRange[1] - 0.1;
  const absError = Math.abs(exactIntegral - riemann.sum);

  const handleSetSymmetricA = (val: number) => {
    const magnitude = Math.max(0.2, Math.abs(val));
    setA(-magnitude);
    setB(magnitude);
    setActivePresetNote(null);
  };

  return (
    <section
      aria-label={config.title}
      className="card-surface-graph rounded-2xl border border-cyan-accent/45 p-4 shadow-[0_0_28px_-12px_rgba(34,211,238,0.35)] sm:p-5"
    >
      {/* Header row */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-accent/15 text-cyan-accent">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-balance text-sm font-semibold text-cyan-accent">
              {config.title}
            </h2>
            <p className="text-pretty text-xs text-muted-foreground">
              {config.subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card-elevated px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-cyan-accent/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Скинути
        </button>
      </div>

      {/* Function switcher pills */}
      {config.functions.length > 1 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {config.functions.map((fn) => {
            const active = fn.id === funcOption.id;
            return (
              <button
                key={fn.id}
                type="button"
                onClick={() => handleSelectFunction(fn.id)}
                className={cn(
                  "cursor-pointer rounded-lg border px-2.5 py-1 font-mono text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-cyan-accent/60 bg-cyan-accent/15 text-cyan-accent"
                    : "border-border bg-card-elevated/80 text-muted-foreground hover:border-cyan-accent/40 hover:text-foreground",
                )}
              >
                {fn.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Error state if mathjs expression fails */}
      {compiledBase.error ? (
        <div
          role="alert"
          className="flex flex-col items-start gap-2 rounded-xl border border-rose-accent/50 bg-rose-accent/10 p-4 text-sm text-rose-accent"
        >
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Помилка обчислення функції
          </div>
          <p className="text-xs text-foreground/90">{compiledBase.error}</p>
          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer rounded-lg bg-rose-accent px-3 py-1.5 text-xs font-medium text-white"
          >
            Повернути стандартну функцію
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left: Interactive Mafs Graph */}
          <div className="lg:col-span-7">
            <IntegralCanvas
              mode={config.mode}
              subMode={subMode}
              funcOption={funcOption}
              evaluateFn={evaluateFn}
              evaluateBaseFn={evaluateBaseFn}
              evaluateAntiderivative={evaluateAntiderivative}
              evaluateResidual={evaluateResidual}
              a={a}
              b={b}
              c={clampedC}
              k={k}
              constC={constC}
              rects={riemann.signedRects}
              extrema={extrema}
            />
          </div>

          {/* Right: Controls & Numeric Comparison Readout (Reference Photo 1 style) */}
          <div className="flex flex-col justify-between gap-3 lg:col-span-5">
            {/* Primary slider & mode control */}
            <div className="space-y-3 rounded-xl border border-border/80 bg-card/75 p-3.5">
              {config.mode === "riemann" && (
                <>
                  <div>
                    <div className="mb-1 flex items-center justify-between font-mono text-sm">
                      <span className="text-foreground">
                        n = <strong className="text-amber-accent">{n}</strong>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        |τ| = {formatNum(riemann.diameter, 3)}
                      </span>
                    </div>
                    <Slider
                      value={[n]}
                      min={2}
                      max={48}
                      step={1}
                      tone="amber"
                      aria-label="Кількість прямокутників n"
                      onValueChange={(vals) => {
                        setN(vals[0] ?? 12);
                        setActivePresetNote(null);
                      }}
                    />
                  </div>

                  <Tabs
                    value={method}
                    onValueChange={(val) => {
                      setMethod(val as RiemannMethod);
                      setActivePresetNote(null);
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="left">Ліві</TabsTrigger>
                      <TabsTrigger value="mid">Середні</TabsTrigger>
                      <TabsTrigger value="right">Праві</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </>
              )}

              {config.mode === "properties" && (
                <>
                  <Tabs
                    value={subMode}
                    onValueChange={(val) => {
                      setSubMode(val as "additivity" | "mean-value");
                      setActivePresetNote(null);
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="additivity">Адитивність c</TabsTrigger>
                      <TabsTrigger value="mean-value">Середнє μ</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {subMode === "additivity" ? (
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-amber-accent">Точка c = {formatNum(clampedC, 2)}</span>
                          <span className="text-muted-foreground">a &lt; c &lt; b</span>
                        </div>
                        <Slider
                          value={[clampedC]}
                          min={Math.min(a, b)}
                          max={Math.max(a, b)}
                          step={0.05}
                          tone="amber"
                          aria-label="Проміжна точка c"
                          onValueChange={(vals) => {
                            setC(vals[0] ?? clampedC);
                            setActivePresetNote(null);
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-rose-accent">Множник k = {formatNum(k, 1)}</span>
                          <span className="text-muted-foreground">∫k·f(x)dx</span>
                        </div>
                        <Slider
                          value={[k]}
                          min={-1.5}
                          max={2}
                          step={0.1}
                          tone="violet"
                          aria-label="Сталий множник k"
                          onValueChange={(vals) => {
                            setK(vals[0] ?? 1);
                            setActivePresetNote(null);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">m = min f(x):</span>
                        <span className="text-foreground">{formatNum(extrema.min, 3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-accent">μ (середнє):</span>
                        <span className="font-semibold text-amber-accent">{formatNum(extrema.mean, 3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">M = max f(x):</span>
                        <span className="text-foreground">{formatNum(extrema.max, 3)}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {config.mode === "newton-leibniz" && (
                <div>
                  <div className="mb-1 flex items-center justify-between font-mono text-xs">
                    <span className="text-violet-accent">
                      Константа первісної +C = {constC >= 0 ? `+${formatNum(constC, 1)}` : formatNum(constC, 1)}
                    </span>
                    <span className="text-muted-foreground">F(x) + C</span>
                  </div>
                  <Slider
                    value={[constC]}
                    min={-1.5}
                    max={2}
                    step={0.1}
                    tone="violet"
                    aria-label="Константа інтегрування C"
                    onValueChange={(vals) => {
                      setConstC(vals[0] ?? 0);
                      setActivePresetNote(null);
                    }}
                  />
                  {newtonStats && (
                    <div className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                      <div className="rounded-lg bg-secondary/70 px-2 py-1">
                        <span className="text-muted-foreground">F(b)+C = </span>
                        <span className="text-violet-accent">{formatNum(newtonStats.fB, 3)}</span>
                      </div>
                      <div className="rounded-lg bg-secondary/70 px-2 py-1">
                        <span className="text-muted-foreground">F(a)+C = </span>
                        <span className="text-amber-accent">{formatNum(newtonStats.fA, 3)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {config.mode === "substitution" && substitutionBounds && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Підстановка:
                    </span>
                    <Badge variant="violet" className="font-mono">
                      {substitutionBounds.rule}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="rounded-lg border border-amber-accent/30 bg-amber-accent/10 p-2">
                      <div className="text-[10px] text-muted-foreground">Стара → Нова α</div>
                      <div className="font-semibold text-amber-accent">
                        {formatNum(a, 2)} → {formatNum(substitutionBounds.alpha, 3)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-cyan-accent/30 bg-cyan-accent/10 p-2">
                      <div className="text-[10px] text-muted-foreground">Стара → Нова β</div>
                      <div className="font-semibold text-cyan-accent">
                        {formatNum(b, 2)} → {formatNum(substitutionBounds.beta, 3)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span>Прямокутники n = {n}</span>
                      <span>Середні суми</span>
                    </div>
                    <Slider
                      value={[n]}
                      min={6}
                      max={40}
                      step={2}
                      tone="amber"
                      aria-label="Кількість смужок розбиття n"
                      onValueChange={(vals) => setN(vals[0] ?? 20)}
                    />
                  </div>
                </div>
              )}

              {config.mode === "by-parts" && (
                <div className="space-y-2">
                  {funcOption.id === "ex3-parts" && (
                    <div>
                      <div className="mb-1 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                        <span className="text-amber-accent">
                          Коефіцієнт k = {formatNum(k, 1)}
                        </span>
                        <span className="rounded bg-secondary/80 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          u = {formatNum(k, 1)}x + 1
                        </span>
                      </div>
                      <Slider
                        value={[k]}
                        min={0}
                        max={4}
                        step={0.5}
                        tone="amber"
                        aria-label="Коефіцієнт k у многочлені"
                        onValueChange={(vals) => {
                          setK(vals[0] ?? 2);
                          setActivePresetNote(null);
                        }}
                      />
                    </div>
                  )}
                  {byPartsStats && (
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="rounded-lg border border-amber-accent/30 bg-amber-accent/10 p-2">
                        <div className="text-[10px] text-muted-foreground">uv|ₐᵇ</div>
                        <div className="font-semibold text-amber-accent">
                          {formatNum(byPartsStats.uvDiff, 3)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-rose-accent/30 bg-rose-accent/10 p-2">
                        <div className="text-[10px] text-muted-foreground">−∫v·du</div>
                        <div className="font-semibold text-rose-accent">
                          {formatNum(-byPartsStats.residualInt, 3)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {config.mode === "symmetry" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Симетричні межі [−a, a]
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !symmetricLock;
                        setSymmetricLock(next);
                        if (next) {
                          const mag = Math.max(0.4, Math.abs(b));
                          setA(-mag);
                          setB(mag);
                        }
                      }}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                        symmetricLock
                          ? "border-emerald-accent/50 bg-emerald-accent/15 text-emerald-accent"
                          : "border-rose-accent/50 bg-rose-accent/15 text-rose-accent",
                      )}
                    >
                      {symmetricLock ? (
                        <>
                          <Lock className="h-3 w-3" aria-hidden="true" />
                          Увімкнено
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3 w-3" aria-hidden="true" />
                          Зламано
                        </>
                      )}
                    </button>
                  </div>
                  {symmetryStats && (
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="rounded-lg bg-secondary/75 p-2">
                        <div className="text-[10px] text-muted-foreground">Ліворуч [{formatNum(a, 1)}, 0]</div>
                        <div className="font-semibold text-foreground">
                          {formatNum(symmetryStats.leftInt, 3)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-secondary/75 p-2">
                        <div className="text-[10px] text-muted-foreground">Праворуч [0, {formatNum(b, 1)}]</div>
                        <div className="font-semibold text-foreground">
                          {formatNum(symmetryStats.rightInt, 3)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Glowing Numeric Readout Box (Reference Photo 1 signature element!) */}
            <div className="rounded-xl border border-cyan-accent/55 bg-background/85 px-4 py-3 text-center shadow-[inset_0_0_24px_rgba(34,211,238,0.12)]">
              <div className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                {config.mode === "riemann" ? (
                  <>
                    S ≈{" "}
                    <span className="font-mono text-cyan-accent">
                      {formatNum(riemann.sum, 3)}
                    </span>
                  </>
                ) : (
                  <>
                    I ={" "}
                    <span className="font-mono text-cyan-accent">
                      {formatNum(exactIntegral, 3)}
                    </span>
                  </>
                )}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
                {config.mode === "riemann" ? (
                  <>
                    <span>
                      Точний: <strong className="text-foreground">{formatNum(exactIntegral, 3)}</strong>
                    </span>
                    <span>
                      Похибка: <strong className="text-amber-accent">{formatNum(absError, 4)}</strong>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Сума Рімана (n={n}):{" "}
                      <strong className="text-foreground">{formatNum(riemann.sum, 3)}</strong>
                    </span>
                    {additivityStats && subMode === "additivity" && (
                      <span>
                        {formatNum(additivityStats.leftVal, 2)} + {formatNum(additivityStats.rightVal, 2)}
                      </span>
                    )}
                  </>
                )}
                {Math.abs(geometricArea - Math.abs(exactIntegral)) > 0.02 && (
                  <span className="text-rose-accent">
                    ∫|f|dx = {formatNum(geometricArea, 3)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sliders for bounds a and b */}
      <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-border/70 bg-card/60 p-3 sm:grid-cols-2">
        {config.mode === "symmetry" && symmetricLock ? (
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-emerald-accent">
                Симетрична півширина a = {formatNum(Math.abs(b), 2)}
              </span>
              <span className="text-muted-foreground">
                Відрізок [{formatNum(-Math.abs(b), 2)}, {formatNum(Math.abs(b), 2)}]
              </span>
            </div>
            <Slider
              value={[Math.abs(b)]}
              min={0.2}
              max={Math.min(Math.abs(domainMin), Math.abs(domainMax))}
              step={0.1}
              tone="cyan"
              aria-label="Симетрична межа a"
              onValueChange={(vals) => handleSetSymmetricA(vals[0] ?? 1.5)}
            />
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-amber-accent">Нижня межа a = {formatNum(a, 2)}</span>
                <span className="text-[11px] text-muted-foreground">ліва стінка</span>
              </div>
              <Slider
                value={[a]}
                min={domainMin}
                max={domainMax}
                step={0.05}
                tone="amber"
                aria-label="Нижня межа інтегрування a"
                onValueChange={(vals) => {
                  setA(vals[0] ?? 0);
                  setActivePresetNote(null);
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-cyan-accent">Верхня межа b = {formatNum(b, 2)}</span>
                <span className="text-[11px] text-muted-foreground">права стінка</span>
              </div>
              <Slider
                value={[b]}
                min={domainMin}
                max={domainMax}
                step={0.05}
                tone="cyan"
                aria-label="Верхня межа інтегрування b"
                onValueChange={(vals) => {
                  setB(vals[0] ?? 1);
                  setActivePresetNote(null);
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Edge-case presets ("А що як...?") */}
      <div className="mt-3.5">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-amber-accent" aria-hidden="true" />
          <span>Режим «А що як...?» (граничні випадки):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {config.presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="cursor-pointer rounded-lg border border-border bg-card-elevated px-2.5 py-1.5 text-xs font-medium text-foreground/90 transition-all hover:border-amber-accent/60 hover:bg-amber-accent/10 hover:text-amber-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {activePresetNote && (
          <div className="mt-2.5 rounded-xl border border-amber-accent/35 bg-amber-accent/10 px-3 py-2 text-pretty text-xs leading-relaxed text-foreground">
            {activePresetNote}
          </div>
        )}
      </div>
    </section>
  );
}
