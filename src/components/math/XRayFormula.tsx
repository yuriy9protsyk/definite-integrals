"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import katex from "katex";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  XRAY_VARIABLES,
  type VariableTone,
  type XRayVariableMeta,
} from "@/data/courseData";
import {
  selectEffectiveVar,
  useCourseStore,
  type XRayVarId,
} from "@/store/useCourseStore";

interface XRayFormulaProps {
  latex: string;
  displayMode?: boolean;
  size?: "xs" | "compact" | "default" | "lg";
  enableXRay?: boolean;
  showVariableChips?: boolean;
  className?: string;
}

const VALID_VAR_IDS = new Set<string>(Object.keys(XRAY_VARIABLES));

const CHIP_TONE_CLASSES: Record<VariableTone, string> = {
  amber:
    "border-amber-accent/40 bg-amber-accent/10 text-amber-accent hover:bg-amber-accent/20",
  cyan:
    "border-cyan-accent/40 bg-cyan-accent/10 text-cyan-accent hover:bg-cyan-accent/20",
  teal:
    "border-teal-accent/40 bg-teal-accent/10 text-teal-accent hover:bg-teal-accent/20",
  violet:
    "border-violet-accent/40 bg-violet-accent/10 text-violet-accent hover:bg-violet-accent/20",
  rose:
    "border-rose-accent/40 bg-rose-accent/10 text-rose-accent hover:bg-rose-accent/20",
};

const CHIP_ACTIVE_CLASSES: Record<VariableTone, string> = {
  amber: "ring-2 ring-amber-accent bg-amber-accent/25",
  cyan: "ring-2 ring-cyan-accent bg-cyan-accent/25",
  teal: "ring-2 ring-teal-accent bg-teal-accent/25",
  violet: "ring-2 ring-violet-accent bg-violet-accent/25",
  rose: "ring-2 ring-rose-accent bg-rose-accent/25",
};

function findVarIdFromElement(node: EventTarget | null): XRayVarId | null {
  if (!(node instanceof Element)) return null;
  let current: Element | null = node;
  while (current) {
    for (const cls of Array.from(current.classList)) {
      if (VALID_VAR_IDS.has(cls)) {
        return cls as XRayVarId;
      }
    }
    current = current.parentElement;
  }
  return null;
}

function extractFormulaVarIds(latex: string): XRayVarId[] {
  const matches = latex.match(/\\htmlClass\{(var-[a-zA-Z]+)\}/g);
  if (!matches) return [];
  const seen = new Set<XRayVarId>();
  const ordered: XRayVarId[] = [];
  for (const m of matches) {
    const id = m.replace("\\htmlClass{", "").replace("}", "");
    if (VALID_VAR_IDS.has(id) && !seen.has(id as XRayVarId)) {
      seen.add(id as XRayVarId);
      ordered.push(id as XRayVarId);
    }
  }
  return ordered;
}

export function XRayFormula({
  latex,
  displayMode = false,
  size = "default",
  enableXRay = false,
  showVariableChips = false,
  className,
}: XRayFormulaProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [localHoveredVar, setLocalHoveredVar] = useState<XRayVarId | null>(null);

  const effectiveVar = useCourseStore(selectEffectiveVar);
  const pinnedVar = useCourseStore((s) => s.pinnedVar);
  const setHoveredVar = useCourseStore((s) => s.setHoveredVar);
  const togglePinnedVar = useCourseStore((s) => s.togglePinnedVar);
  const clearActiveVar = useCourseStore((s) => s.clearActiveVar);

  const formulaVars = useMemo(
    () => (enableXRay ? extractFormulaVarIds(latex) : []),
    [enableXRay, latex],
  );

  // Render KaTeX imperatively into DOM ref with trust: true and throwOnError: false
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    katex.render(latex, el, {
      displayMode,
      trust: true,
      throwOnError: false,
      strict: false,
      macros: {
        "\\arctg": "\\operatorname{arctg}",
      },
    });
  }, [latex, displayMode]);

  // Synchronize active highlight styling on rendered KaTeX tokens
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enableXRay) return;
    const tokens = el.querySelectorAll('[class*="var-"]');
    tokens.forEach((token) => {
      if (effectiveVar && token.classList.contains(effectiveVar)) {
        token.classList.add("xray-active-token");
      } else {
        token.classList.remove("xray-active-token");
      }
    });
  }, [effectiveVar, enableXRay, latex]);

  const handleMouseOver = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (!enableXRay) return;
    const found = findVarIdFromElement(event.target);
    if (found) {
      setLocalHoveredVar(found);
      setHoveredVar(found);
    }
  };

  const handleMouseLeave = () => {
    if (!enableXRay) return;
    setLocalHoveredVar(null);
    setHoveredVar(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (!enableXRay) return;
    const found = findVarIdFromElement(event.target);
    if (found) {
      togglePinnedVar(found);
    }
  };

  const activeMeta: XRayVariableMeta | null = useMemo(() => {
    if (!enableXRay) return null;
    const candidate = localHoveredVar ?? (pinnedVar && formulaVars.includes(pinnedVar) ? pinnedVar : null);
    if (!candidate) return null;
    return XRAY_VARIABLES[candidate] ?? null;
  }, [enableXRay, localHoveredVar, pinnedVar, formulaVars]);

  const sizeClass =
    size === "xs"
      ? "katex-xs"
      : size === "compact"
        ? "katex-compact"
        : size === "lg"
          ? "katex-display-lg"
          : "";

  return (
    <div className={cn("relative", displayMode ? "w-full" : "inline-block", className)}>
      <span
        ref={containerRef}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={cn(
          "katex-xray-root block overflow-x-auto py-1",
          displayMode ? "text-center" : "inline-block align-middle",
          sizeClass,
        )}
      />

      {enableXRay && showVariableChips && formulaVars.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-cyan-accent" aria-hidden="true" />
            X-Ray:
          </span>
          {formulaVars.map((varId) => {
            const meta = XRAY_VARIABLES[varId];
            const isActive = effectiveVar === varId;
            return (
              <button
                key={varId}
                type="button"
                onMouseEnter={() => {
                  setLocalHoveredVar(varId);
                  setHoveredVar(varId);
                }}
                onMouseLeave={() => {
                  setLocalHoveredVar(null);
                  setHoveredVar(null);
                }}
                onClick={() => togglePinnedVar(varId)}
                className={cn(
                  "cursor-pointer rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  CHIP_TONE_CLASSES[meta.tone],
                  isActive && CHIP_ACTIVE_CLASSES[meta.tone],
                )}
                aria-pressed={pinnedVar === varId}
              >
                {meta.symbol}
              </button>
            );
          })}
        </div>
      )}

      {activeMeta && (
        <div
          role="status"
          className="mt-3 rounded-xl border border-cyan-accent/35 bg-popover/95 px-3.5 py-2.5 text-left shadow-lg"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-md border px-1.5 py-0.5 font-mono text-xs font-semibold",
                  CHIP_TONE_CLASSES[activeMeta.tone],
                )}
              >
                {activeMeta.symbol}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {activeMeta.label}
              </span>
            </div>
            {pinnedVar === activeMeta.id && (
              <button
                type="button"
                onClick={clearActiveVar}
                aria-label="Скинути закріплену підсвітку"
                className="cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="mt-1.5 text-pretty text-xs leading-relaxed text-muted-foreground">
            {activeMeta.description}
          </p>
          <p className="mt-1 text-[11px] font-medium text-cyan-accent">
            ↳ {activeMeta.graphHint}
          </p>
        </div>
      )}
    </div>
  );
}
