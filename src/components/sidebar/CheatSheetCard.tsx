"use client";

import React from "react";
import { Eye, EyeOff, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { XRayFormula } from "@/components/math/XRayFormula";
import { useCourseStore } from "@/store/useCourseStore";
import type { CheatSheetItem } from "@/data/courseData";
import { cn } from "@/lib/utils";

interface CheatSheetCardProps {
  items: CheatSheetItem[];
}

export function CheatSheetCard({ items }: CheatSheetCardProps) {
  const blindCheatSheet = useCourseStore((s) => s.blindCheatSheet);
  const revealedCheatIds = useCourseStore((s) => s.revealedCheatIds);
  const toggleBlindCheatSheet = useCourseStore((s) => s.toggleBlindCheatSheet);
  const toggleRevealCheat = useCourseStore((s) => s.toggleRevealCheat);

  return (
    <Card className="border-border/90 bg-card/95">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-accent/15 text-amber-accent">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
          </span>
          <CardTitle className="text-sm font-semibold">Шпаргалка</CardTitle>
        </div>

        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleBlindCheatSheet}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  blindCheatSheet
                    ? "border-violet-accent/55 bg-violet-accent/20 text-violet-accent"
                    : "border-border bg-card-elevated text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={blindCheatSheet}
              >
                {blindCheatSheet ? (
                  <>
                    <EyeOff className="h-3 w-3" aria-hidden="true" />
                    Сліпі зони
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" aria-hidden="true" />
                    Перевірити пам&apos;ять
                  </>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Приховати формули для тренування пам&apos;яті (Active Recall).
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {items.map((item) => {
          const isMasked = blindCheatSheet && !revealedCheatIds[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (blindCheatSheet) toggleRevealCheat(item.id);
              }}
              className={cn(
                "flex h-full flex-col justify-between rounded-xl border border-border/80 bg-card-elevated p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                blindCheatSheet
                  ? "cursor-pointer hover:border-violet-accent/55"
                  : "cursor-default hover:border-border",
              )}
            >
              <span className="text-[11px] font-medium text-muted-foreground">
                {item.title}
              </span>

              <div className="my-2 flex min-h-12 w-full flex-1 items-center justify-center overflow-hidden">
                {isMasked ? (
                  <span className="rounded-lg border border-dashed border-violet-accent/50 bg-violet-accent/10 px-2.5 py-1.5 text-center text-[11px] font-medium text-violet-accent">
                    Згадай і клікни
                  </span>
                ) : (
                  <XRayFormula
                    latex={item.formulaLatex}
                    size="xs"
                    className="max-w-full"
                  />
                )}
              </div>

              <span className="mt-auto text-[10px] leading-snug text-muted-foreground/90">
                {item.hint}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
