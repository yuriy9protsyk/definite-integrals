"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Landmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { XRayFormula } from "@/components/math/XRayFormula";
import { IntegralSandbox } from "@/components/sandbox/IntegralSandbox";
import { StepPlayer } from "@/components/player/StepPlayer";
import { COURSE_MODULES, type CourseModule } from "@/data/courseData";
import { useCourseStore } from "@/store/useCourseStore";

interface ModuleWorkspaceProps {
  courseModule: CourseModule;
}

export function ModuleWorkspace({ courseModule }: ModuleWorkspaceProps) {
  const setActiveModuleId = useCourseStore((s) => s.setActiveModuleId);

  const currentIdx = COURSE_MODULES.findIndex((m) => m.id === courseModule.id);
  const prevModule = currentIdx > 0 ? COURSE_MODULES[currentIdx - 1] : null;
  const nextModule =
    currentIdx >= 0 && currentIdx < COURSE_MODULES.length - 1
      ? COURSE_MODULES[currentIdx + 1]
      : null;

  return (
    <main className="min-w-0 space-y-5">
      {/* Module Title Header (matches Reference Photo 1) */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-accent">
          <span>{courseModule.sectionLabel}</span>
          <span className="h-px w-8 bg-violet-accent/55" aria-hidden="true" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {courseModule.title}
          </h1>
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            {courseModule.durationMinutes} хв
          </Badge>
        </div>

        {/* Concise 2-3 sentence Hook */}
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {courseModule.hook}
        </p>
      </header>

      {/* Definition Card with Violet Left Accent Bar (Reference Photo 1) */}
      <section
        aria-label={courseModule.definition.title}
        className="card-surface-def relative overflow-hidden rounded-2xl border border-violet-accent/35 p-4 pl-5 sm:p-5 sm:pl-6"
      >
        <div
          className="absolute inset-y-0 left-0 w-1.5 bg-violet-accent"
          aria-hidden="true"
        />

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-accent/25 text-violet-accent">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold text-violet-accent">
            {courseModule.definition.badge}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <h2 className="text-balance text-sm font-semibold text-foreground">
            {courseModule.definition.title}
          </h2>
        </div>

        <p className="mb-2 text-pretty text-xs leading-relaxed text-muted-foreground">
          {courseModule.definition.lead}
        </p>

        <XRayFormula
          latex={courseModule.definition.formulaLatex}
          displayMode
          size="lg"
          enableXRay
          showVariableChips
        />

        {courseModule.definition.secondaryFormulaLatex && (
          <div className="mt-2.5 border-t border-border/60 pt-2.5">
            <XRayFormula
              latex={courseModule.definition.secondaryFormulaLatex}
              displayMode
              size="compact"
              enableXRay
            />
          </div>
        )}

        {courseModule.definition.lectureNote && (
          <div className="mt-3 rounded-xl border border-violet-accent/30 bg-background/50 px-3 py-2 text-pretty text-xs leading-relaxed text-muted-foreground">
            {courseModule.definition.lectureNote}
          </div>
        )}
      </section>

      {/* Interactive Mafs Sandbox (unique prefixed key resets state cleanly on module change) */}
      <IntegralSandbox
        key={`sandbox-${courseModule.id}`}
        config={courseModule.sandbox}
      />

      {/* Key Formula / Theorem Card with Amber/Gold Left Accent Bar (Reference Photo 1) */}
      <section
        aria-label={courseModule.theorem.title}
        className="card-surface-theorem relative overflow-hidden rounded-2xl border border-amber-accent/35 p-4 pl-5 sm:p-5 sm:pl-6"
      >
        <div
          className="absolute inset-y-0 left-0 w-1.5 bg-amber-accent"
          aria-hidden="true"
        />

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-accent/20 text-amber-accent">
            <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="text-xs font-semibold text-amber-accent">
            {courseModule.theorem.badge}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <h2 className="text-balance text-sm font-semibold text-foreground">
            {courseModule.theorem.title}
          </h2>
        </div>

        <p className="mb-2 text-pretty text-xs leading-relaxed text-muted-foreground">
          {courseModule.theorem.statement}
        </p>

        <XRayFormula
          latex={courseModule.theorem.formulaLatex}
          displayMode
          size="lg"
          enableXRay
          showVariableChips
        />

        {courseModule.theorem.bullets && courseModule.theorem.bullets.length > 0 && (
          <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {courseModule.theorem.bullets.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-border/75 bg-card/75 px-3 py-2.5"
              >
                <span className="text-[11px] font-semibold text-amber-accent">
                  {item.label}
                </span>
                <div className="mt-1">
                  <XRayFormula latex={item.latex} size="compact" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Step-by-Step Worked Examples Player */}
      <StepPlayer
        key={`player-${courseModule.id}`}
        examples={courseModule.examples}
      />

      {/* Bottom Module Footer Navigation */}
      <nav
        aria-label="Перехід між модулями"
        className="flex items-center justify-between gap-3 pt-1"
      >
        {prevModule ? (
          <button
            type="button"
            onClick={() => setActiveModuleId(prevModule.id)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-left text-xs transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <div>
              <div className="text-[10px] text-muted-foreground">Попередній модуль</div>
              <div className="font-semibold text-foreground">
                {prevModule.number}. {prevModule.shortTitle}
              </div>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextModule && (
          <button
            type="button"
            onClick={() => setActiveModuleId(nextModule.id)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-primary/55 bg-primary/15 px-4 py-2 text-right text-xs transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div>
              <div className="text-[10px] text-muted-foreground">Наступний модуль</div>
              <div className="font-semibold text-foreground">
                {nextModule.number}. {nextModule.shortTitle}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-primary" aria-hidden="true" />
          </button>
        )}
      </nav>
    </main>
  );
}
