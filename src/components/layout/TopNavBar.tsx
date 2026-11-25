"use client";

import React, { useMemo, useState } from "react";
import { GraduationCap, Moon, Search, Sun, X } from "lucide-react";
import { COURSE_META, COURSE_MODULES } from "@/data/courseData";
import { useCourseStore } from "@/store/useCourseStore";
import { cn } from "@/lib/utils";

interface SearchHit {
  id: string;
  moduleId: string;
  moduleNumber: number;
  title: string;
  snippet: string;
  kind: "Модуль" | "Приклад" | "Шпаргалка";
}

export function TopNavBar() {
  const [searchFocused, setSearchFocused] = useState(false);

  const searchQuery = useCourseStore((s) => s.searchQuery);
  const setSearchQuery = useCourseStore((s) => s.setSearchQuery);
  const setActiveModuleId = useCourseStore((s) => s.setActiveModuleId);
  const theme = useCourseStore((s) => s.theme);
  const toggleTheme = useCourseStore((s) => s.toggleTheme);
  const completedQuizIds = useCourseStore((s) => s.completedQuizIds);
  const visitedModules = useCourseStore((s) => s.visitedModules);

  const progressPercent = useMemo(() => {
    const totalQuestions = COURSE_MODULES.reduce(
      (sum, m) => sum + m.quiz.length,
      0,
    );
    const solvedQuestions = Object.values(completedQuizIds).filter(Boolean).length;
    const visitedCount = Object.values(visitedModules).filter(Boolean).length;
    const totalUnits = totalQuestions + COURSE_MODULES.length;
    if (totalUnits === 0) return 0;
    return Math.round(((solvedQuestions + visitedCount) / totalUnits) * 100);
  }, [completedQuizIds, visitedModules]);

  const searchHits = useMemo<SearchHit[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const hits: SearchHit[] = [];

    for (const mod of COURSE_MODULES) {
      if (
        mod.title.toLowerCase().includes(q) ||
        mod.shortTitle.toLowerCase().includes(q) ||
        mod.hook.toLowerCase().includes(q) ||
        mod.definition.title.toLowerCase().includes(q) ||
        mod.theorem.title.toLowerCase().includes(q)
      ) {
        hits.push({
          id: `mod-${mod.id}`,
          moduleId: mod.id,
          moduleNumber: mod.number,
          title: mod.title,
          snippet: mod.definition.title,
          kind: "Модуль",
        });
      }

      for (const ex of mod.examples) {
        if (
          ex.title.toLowerCase().includes(q) ||
          ex.problemLatex.toLowerCase().includes(q)
        ) {
          hits.push({
            id: `ex-${ex.id}`,
            moduleId: mod.id,
            moduleNumber: mod.number,
            title: ex.title,
            snippet: ex.sourceRef,
            kind: "Приклад",
          });
        }
      }

      for (const cs of mod.cheatSheet) {
        if (
          cs.title.toLowerCase().includes(q) ||
          cs.hint.toLowerCase().includes(q) ||
          cs.formulaLatex.toLowerCase().includes(q)
        ) {
          hits.push({
            id: `cs-${cs.id}`,
            moduleId: mod.id,
            moduleNumber: mod.number,
            title: cs.title,
            snippet: cs.hint,
            kind: "Шпаргалка",
          });
        }
      }
    }

    return hits.slice(0, 8);
  }, [searchQuery]);

  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progressPercent / 100);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1460px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand mark */}
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary ring-1 ring-primary/40">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <span className="font-serif text-lg font-bold tracking-tight text-foreground">
              {COURSE_META.brand}
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              {COURSE_META.courseTitle}
            </span>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="relative max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук тем, теорем і формул..."
            aria-label="Пошук тем, теорем і формул"
            className="h-10 w-full rounded-full border border-border bg-card-elevated pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Очистити пошук"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}

          {/* Live Search Popover */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-2xl">
              {searchHits.length === 0 ? (
                <div className="px-3 py-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Нічого не знайдено за запитом «{searchQuery}».
                  </p>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setSearchQuery("")}
                    className="mt-2 cursor-pointer rounded-lg border border-border bg-card-elevated px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary"
                  >
                    Скинути пошук
                  </button>
                </div>
              ) : (
                <ul className="max-h-72 space-y-1 overflow-y-auto">
                  {searchHits.map((hit) => (
                    <li key={hit.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setActiveModuleId(hit.moduleId);
                          setSearchQuery("");
                          setSearchFocused(false);
                        }}
                        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-colors hover:bg-secondary"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold text-foreground">
                            {hit.moduleNumber}. {hit.title}
                          </div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            {hit.snippet}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                          {hit.kind}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Right Controls: Progress Ring + Theme Toggle + Scholar Emblem */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Circular Progress Ring (matches Reference Photo 1) */}
          <div
            className="relative flex h-11 w-11 items-center justify-center"
            title={`Загальний прогрес курсу: ${progressPercent}%`}
            aria-label={`Прогрес курсу ${progressPercent} відсотків`}
          >
            <svg className="h-11 w-11 -rotate-90" viewBox="0 0 42 42" aria-hidden="true">
              <circle
                cx="21"
                cy="21"
                r={radius}
                fill="none"
                stroke="var(--border)"
                strokeWidth="3.5"
              />
              <circle
                cx="21"
                cy="21"
                r={radius}
                fill="none"
                stroke="var(--accent-cyan)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-300"
              />
            </svg>
            <span className="absolute font-mono text-[10px] font-bold text-foreground">
              {progressPercent}%
            </span>
          </div>

          <div className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Увімкнути світлу тему"
                : "Увімкнути темну тему"
            }
            className={cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-card-elevated text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4 text-amber-accent" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4 text-amber-accent" aria-hidden="true" />
            )}
          </button>

          {/* Compact Student Monogram Avatar */}
          <div
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-cyan-accent/45 bg-secondary font-serif text-sm font-bold text-cyan-accent sm:flex"
            title={COURSE_META.lecturer}
          >
            ∫x
          </div>
        </div>
      </div>
    </header>
  );
}
