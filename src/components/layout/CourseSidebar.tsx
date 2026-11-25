"use client";

import React from "react";
import { BookOpen, Check, Circle } from "lucide-react";
import { COURSE_META, COURSE_MODULES } from "@/data/courseData";
import { useCourseStore } from "@/store/useCourseStore";
import { cn } from "@/lib/utils";

export function CourseSidebar() {
  const activeModuleId = useCourseStore((s) => s.activeModuleId);
  const setActiveModuleId = useCourseStore((s) => s.setActiveModuleId);
  const completedQuizIds = useCourseStore((s) => s.completedQuizIds);
  const visitedModules = useCourseStore((s) => s.visitedModules);

  const totalSolved = Object.values(completedQuizIds).filter(Boolean).length;
  const totalQuestions = COURSE_MODULES.reduce((acc, m) => acc + m.quiz.length, 0);

  return (
    <aside
      aria-label="Навігація по модулях лекції"
      className="flex flex-col gap-4"
    >
      {/* Course Modules Card */}
      <div className="rounded-2xl border border-border bg-card/95 p-3.5 shadow-[0_12px_32px_-16px_rgba(3,7,20,0.65)]">
        <div className="mb-3 flex items-center gap-2 border-b border-border/70 pb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cobalt-accent/20 text-cobalt-accent">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-foreground">
              Курс: Математичний аналіз
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {COURSE_META.lecturer}
            </div>
          </div>
        </div>

        <nav className="space-y-1.5" aria-label="Модулі Лекції 11">
          {COURSE_MODULES.map((mod) => {
            const isActive = mod.id === activeModuleId;
            const solvedInMod = mod.quiz.filter((q) => completedQuizIds[q.id]).length;
            const totalInMod = mod.quiz.length;
            const visited = Boolean(visitedModules[mod.id]);
            const modPercent =
              totalInMod > 0
                ? Math.round(
                    ((solvedInMod + (visited ? 0.5 : 0)) / (totalInMod + 0.5)) * 100,
                  )
                : 0;
            const isMastered = totalInMod > 0 && solvedInMod === totalInMod;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModuleId(mod.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex w-full cursor-pointer flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "border-violet-accent/70 bg-primary/18 shadow-[0_0_22px_-8px_rgba(124,92,255,0.7)]"
                    : "border-transparent bg-transparent hover:border-border hover:bg-card-elevated/80",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-xs font-medium",
                      isActive ? "font-semibold text-foreground" : "text-foreground/85",
                    )}
                  >
                    {mod.number}. {mod.shortTitle}
                  </span>

                  {isMastered ? (
                    <Check
                      className="h-4 w-4 shrink-0 text-emerald-accent"
                      aria-hidden="true"
                    />
                  ) : isActive ? (
                    <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-violet-accent border-t-cyan-accent" />
                  ) : (
                    <Circle
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Progress Bar + Percent */}
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        isMastered
                          ? "bg-emerald-accent"
                          : isActive
                            ? "bg-violet-accent"
                            : "bg-cobalt-accent/70",
                      )}
                      style={{ width: `${isMastered ? 100 : modPercent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">
                    {isMastered ? "100%" : `${modPercent}%`}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Motivational Card (Reference Photo 1 signature element!) */}
      <div className="card-surface-def relative overflow-hidden rounded-2xl border border-violet-accent/35 p-4">
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full opacity-25"
          viewBox="0 0 260 64"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 44 C 55 12, 110 56, 170 28 C 210 10, 238 36, 260 22"
            stroke="var(--accent-violet)"
            strokeWidth="2"
          />
          <path
            d="M0 54 C 70 24, 130 62, 195 36 C 225 22, 245 40, 260 34"
            stroke="var(--accent-cyan)"
            strokeWidth="1.5"
          />
        </svg>

        <div className="relative flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-accent/45 bg-violet-accent/15 font-serif text-3xl font-bold text-violet-accent shadow-[0_0_20px_-4px_rgba(139,92,246,0.65)]">
            Σ
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-snug text-foreground">
              {totalSolved === totalQuestions
                ? "Лекцію опановано!"
                : "Ти на правильному шляху!"}
            </div>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">
              {totalSolved === 0
                ? "Покрути графік і розв'яжи першу задачу праворуч."
                : `Вирішено ${totalSolved} із ${totalQuestions} тренувальних задач.`}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
