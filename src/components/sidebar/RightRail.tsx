"use client";

import React from "react";
import { CheatSheetCard } from "@/components/sidebar/CheatSheetCard";
import { ActiveRecallQuiz } from "@/components/quiz/ActiveRecallQuiz";
import type { CourseModule } from "@/data/courseData";

interface RightRailProps {
  courseModule: CourseModule;
}

export function RightRail({ courseModule }: RightRailProps) {
  return (
    <aside
      aria-label="Шпаргалка та тренажер перевірки знань"
      className="flex flex-col gap-4"
    >
      <CheatSheetCard items={courseModule.cheatSheet} />

      <ActiveRecallQuiz key={courseModule.id} questions={courseModule.quiz} />

      {/* Handwritten Yellow Sticky Note (Reference Photo 1 signature element!) */}
      <div className="relative mx-auto mt-1 w-full max-w-[300px] px-2 pb-2 pt-1">
        <div className="-rotate-2 rounded-sm bg-sticky-bg px-5 py-4 text-center text-sticky-fg shadow-[0_14px_26px_-10px_rgba(0,0,0,0.65)] transition-transform duration-200 hover:rotate-0">
          {/* Corner sparkle marks */}
          <svg
            className="pointer-events-none absolute -right-3 -top-2.5 h-6 w-6 text-amber-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 10L9 4" />
            <path d="M11 13L18 9" />
            <path d="M13 18L19 17" />
          </svg>
          <p className="font-hand text-2xl font-bold leading-tight tracking-wide">
            {courseModule.stickyNote}
          </p>
        </div>
      </div>
    </aside>
  );
}
