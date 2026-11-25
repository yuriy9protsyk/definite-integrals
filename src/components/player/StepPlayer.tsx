"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  PencilLine,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { XRayFormula } from "@/components/math/XRayFormula";
import type { WorkedExample } from "@/data/courseData";

interface StepPlayerProps {
  examples: WorkedExample[];
}

export function StepPlayer({ examples }: StepPlayerProps) {
  const [selectedExampleId, setSelectedExampleId] = useState<string>(
    examples[0]?.id ?? "",
  );
  const [stepByExample, setStepByExample] = useState<Record<string, number>>({});

  const activeExample =
    examples.find((ex) => ex.id === selectedExampleId) ?? examples[0];

  if (!activeExample) {
    return null;
  }

  const totalSteps = activeExample.steps.length;
  const currentStepIndex = Math.min(
    stepByExample[activeExample.id] ?? 0,
    totalSteps - 1,
  );
  const visibleSteps = activeExample.steps.slice(0, currentStepIndex + 1);
  const isComplete = currentStepIndex === totalSteps - 1;

  const setStep = (next: number) => {
    const clamped = Math.max(0, Math.min(totalSteps - 1, next));
    setStepByExample((prev) => ({ ...prev, [activeExample.id]: clamped }));
  };

  return (
    <section
      aria-label="Покроковий розбір прикладів"
      className="card-surface-example rounded-2xl border border-cobalt-accent/35 p-4 sm:p-5"
    >
      {/* Top header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cobalt-accent/20 text-cobalt-accent">
            <PencilLine className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-balance text-sm font-semibold text-cobalt-accent">
              {activeExample.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {activeExample.sourceRef}
            </p>
          </div>
        </div>

        <Badge variant="secondary" className="font-mono">
          Крок {currentStepIndex + 1} / {totalSteps}
        </Badge>
      </div>

      {/* Example selector if multiple examples exist */}
      {examples.length > 1 && (
        <div className="mt-3">
          <Tabs value={activeExample.id} onValueChange={setSelectedExampleId}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {examples.map((ex) => (
                <TabsTrigger key={ex.id} value={ex.id} className="flex-1">
                  {ex.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Problem Statement */}
      <div className="mt-3.5 rounded-xl border border-border/80 bg-card/80 px-4 py-2.5">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Умова задачі
        </div>
        <XRayFormula latex={activeExample.problemLatex} displayMode />
      </div>

      {/* Step progress track */}
      <div
        className="mt-3 flex gap-1.5"
        role="progressbar"
        aria-valuenow={currentStepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label="Прогрес розв'язання прикладу"
      >
        {activeExample.steps.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setStep(idx)}
            aria-label={`Перейти до кроку ${idx + 1}`}
            className={
              idx <= currentStepIndex
                ? "h-1.5 flex-1 cursor-pointer rounded-full bg-cobalt-accent transition-all"
                : "h-1.5 flex-1 cursor-pointer rounded-full bg-secondary transition-all hover:bg-cobalt-accent/40"
            }
          />
        ))}
      </div>

      {/* Revealed steps list */}
      <div className="mt-3.5 space-y-2.5">
        <AnimatePresence initial={false}>
          {visibleSteps.map((step, idx) => {
            const isLatest = idx === currentStepIndex;
            return (
              <motion.div
                key={step.id}
                initial={{ y: 8, opacity: 0.2 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -6, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={
                  isLatest
                    ? "rounded-xl border border-cobalt-accent/55 bg-card-elevated p-3.5 shadow-sm"
                    : "rounded-xl border border-border/60 bg-card/65 p-3 opacity-85"
                }
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={
                      isLatest
                        ? "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cobalt-accent text-xs font-bold text-white"
                        : "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cobalt-accent/45 bg-cobalt-accent/15 text-xs font-semibold text-cobalt-accent"
                    }
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">
                        {step.tag}
                      </span>
                      {isLatest && (
                        <Badge variant="amber" className="text-[10px]">
                          Змінена частина підсвічена
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-pretty text-xs leading-relaxed text-muted-foreground">
                      {step.explanation}
                    </p>
                    <div className="mt-2 rounded-lg bg-background/60 px-3 py-1.5">
                      <XRayFormula latex={step.latex} displayMode size="compact" />
                    </div>
                    {step.note && (
                      <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-accent/35 bg-amber-accent/10 px-2.5 py-1.5 text-[11px] leading-relaxed text-foreground/90">
                        <Info
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-accent"
                          aria-hidden="true"
                        />
                        <span>{step.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Final Answer Banner when complete */}
      {isComplete && (
        <motion.div
          initial={{ y: 6 }}
          animate={{ y: 0 }}
          className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-accent/45 bg-emerald-accent/12 px-4 py-2.5"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-accent">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Фінальна відповідь:
          </div>
          <XRayFormula latex={activeExample.finalAnswerLatex} size="compact" />
        </motion.div>
      )}

      {/* Navigation controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={() => setStep(currentStepIndex - 1)}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-xl border border-border bg-card-elevated px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-cobalt-accent/50 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Назад
          </button>

          <button
            type="button"
            disabled={isComplete}
            onClick={() => setStep(currentStepIndex + 1)}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isComplete ? "Усі кроки відкрито" : "Наступний крок"}
            {!isComplete && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        {!isComplete && (
          <button
            type="button"
            onClick={() => setStep(totalSteps - 1)}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-border/80 bg-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-cobalt-accent/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            Показати все
          </button>
        )}
      </div>
    </section>
  );
}
