"use client";

import React, { useEffect, useMemo } from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { CourseSidebar } from "@/components/layout/CourseSidebar";
import { ModuleWorkspace } from "@/components/course/ModuleWorkspace";
import { RightRail } from "@/components/sidebar/RightRail";
import { COURSE_MODULES } from "@/data/courseData";
import { useCourseStore } from "@/store/useCourseStore";
import { cn } from "@/lib/utils";

export function CourseDashboard() {
  const activeModuleId = useCourseStore((s) => s.activeModuleId);
  const setActiveModuleId = useCourseStore((s) => s.setActiveModuleId);
  const theme = useCourseStore((s) => s.theme);

  // Sync theme class on document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  const activeModule = useMemo(
    () =>
      COURSE_MODULES.find((m) => m.id === activeModuleId) ?? COURSE_MODULES[0],
    [activeModuleId],
  );

  return (
    <div className="min-h-screen">
      <TopNavBar />

      {/* Compact mobile/tablet horizontal module strip */}
      <div className="border-b border-border/70 bg-card/70 px-4 py-2.5 xl:hidden">
        <div className="mx-auto flex max-w-[1460px] gap-2 overflow-x-auto pb-0.5">
          {COURSE_MODULES.map((mod) => {
            const active = mod.id === activeModule.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModuleId(mod.id)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-violet-accent bg-primary text-primary-foreground"
                    : "border-border bg-card-elevated text-muted-foreground hover:text-foreground",
                )}
              >
                {mod.number}. {mod.shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3-Column Bento Grid matching Reference Photo 1 */}
      <div className="mx-auto grid max-w-[1460px] grid-cols-1 gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_330px] xl:grid-cols-[255px_minmax(0,1fr)_340px]">
        <div className="hidden xl:block">
          <div className="sticky top-20">
            <CourseSidebar />
          </div>
        </div>

        <ModuleWorkspace courseModule={activeModule} />

        <div>
          <div className="lg:sticky lg:top-20">
            <RightRail courseModule={activeModule} />
          </div>
        </div>
      </div>
    </div>
  );
}
