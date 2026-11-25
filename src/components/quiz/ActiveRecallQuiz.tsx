"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XRayFormula } from "@/components/math/XRayFormula";
import { useCourseStore } from "@/store/useCourseStore";
import type { QuizQuestion } from "@/data/courseData";
import { cn } from "@/lib/utils";

interface ActiveRecallQuizProps {
  questions: QuizQuestion[];
}

export function ActiveRecallQuiz({ questions }: ActiveRecallQuizProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const quizAnswers = useCourseStore((s) => s.quizAnswers);
  const completedQuizIds = useCourseStore((s) => s.completedQuizIds);
  const recordQuizAnswer = useCourseStore((s) => s.recordQuizAnswer);
  const resetQuizQuestion = useCourseStore((s) => s.resetQuizQuestion);

  const safeIndex = Math.min(activeIndex, Math.max(0, questions.length - 1));
  const question = questions[safeIndex];

  if (!question) {
    return null;
  }

  const solvedCount = questions.filter((q) => completedQuizIds[q.id]).length;
  const selectedOptionId = quizAnswers[question.id];
  const selectedOption = question.options.find((o) => o.id === selectedOptionId);
  const hasAnswered = Boolean(selectedOption);

  return (
    <Card className="border-border/90 bg-card/95">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-accent/20 text-violet-accent">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <CardTitle className="text-sm font-semibold">Перевір себе</CardTitle>
        </div>

        <Badge
          variant={solvedCount === questions.length ? "emerald" : "secondary"}
          className="font-mono"
        >
          {solvedCount} / {questions.length}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Question selector pills */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Задачі для перевірки">
          {questions.map((q, idx) => {
            const isCurrent = idx === safeIndex;
            const isSolved = Boolean(completedQuizIds[q.id]);
            return (
              <button
                key={q.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "flex h-7 flex-1 cursor-pointer items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : isSolved
                      ? "border-emerald-accent/45 bg-emerald-accent/15 text-emerald-accent"
                      : "border-border bg-card-elevated text-muted-foreground hover:text-foreground",
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ y: 6, opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0.4 }}
            transition={{ duration: 0.18 }}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                {question.promptText}
              </p>
              {question.promptLatex && (
                <div className="rounded-xl bg-background/60 px-3 py-2">
                  <XRayFormula latex={question.promptLatex} displayMode />
                </div>
              )}
            </div>

            {/* A / B / C / D Options (Reference Photo 1 styling) */}
            <div className="space-y-2">
              {question.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isRightSelected = isSelected && opt.isCorrect;
                const isWrongSelected = isSelected && !opt.isCorrect;
                const revealCorrect =
                  hasAnswered && !selectedOption?.isCorrect && opt.isCorrect;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      recordQuizAnswer(question.id, opt.id, opt.isCorrect)
                    }
                    className={cn(
                      "flex min-h-11 w-full cursor-pointer items-center justify-between gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isRightSelected
                        ? "border-emerald-accent bg-emerald-accent/18 text-foreground shadow-[0_0_16px_-4px_rgba(34,197,94,0.45)]"
                        : isWrongSelected
                          ? "border-rose-accent bg-rose-accent/15 text-foreground"
                          : revealCorrect
                            ? "border-emerald-accent/50 bg-emerald-accent/10 text-foreground"
                            : "border-border/80 bg-card-elevated text-foreground/90 hover:border-primary/60 hover:bg-secondary/70",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold",
                          isRightSelected
                            ? "bg-emerald-accent text-white"
                            : isWrongSelected
                              ? "bg-rose-accent text-white"
                              : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {opt.letter}
                      </span>
                      <div className="min-w-0 leading-snug">
                        {opt.labelLatex ? (
                          <XRayFormula latex={opt.labelLatex} size="compact" />
                        ) : (
                          <span>{opt.labelText}</span>
                        )}
                      </div>
                    </div>

                    {isRightSelected && (
                      <Check className="h-4 w-4 shrink-0 text-emerald-accent" aria-hidden="true" />
                    )}
                    {isWrongSelected && (
                      <X className="h-4 w-4 shrink-0 text-rose-accent" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback & Error Analysis */}
            {selectedOption && (
              <div
                role="status"
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-pretty text-xs leading-relaxed",
                  selectedOption.isCorrect
                    ? "border-emerald-accent/45 bg-emerald-accent/12 text-foreground"
                    : "border-rose-accent/45 bg-rose-accent/12 text-foreground",
                )}
              >
                <div className="mb-1 font-semibold">
                  {selectedOption.isCorrect
                    ? "Правильно!"
                    : "Розбір помилки:"}
                </div>
                <p className="text-muted-foreground">{selectedOption.feedback}</p>

                <div className="mt-2.5 flex items-center justify-between gap-2">
                  {!selectedOption.isCorrect ? (
                    <button
                      type="button"
                      onClick={() => resetQuizQuestion(question.id)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-card-elevated px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      Спробувати ще
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-emerald-accent">
                      Зараховано до прогресу
                    </span>
                  )}

                  {safeIndex < questions.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveIndex(safeIndex + 1)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-95"
                    >
                      Далі
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
