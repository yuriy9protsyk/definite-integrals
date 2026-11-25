"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type SliderTone = "amber" | "cyan" | "violet";

const TRACK_FILL: Record<SliderTone, string> = {
  amber: "bg-amber-accent",
  cyan: "bg-cyan-accent",
  violet: "bg-violet-accent",
};

const THUMB_BORDER: Record<SliderTone, string> = {
  amber: "border-amber-accent bg-amber-100 shadow-[0_0_12px_rgba(245,185,66,0.65)]",
  cyan: "border-cyan-accent bg-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.65)]",
  violet: "border-violet-accent bg-violet-100 shadow-[0_0_12px_rgba(139,92,246,0.65)]",
};

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  tone?: SliderTone;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, tone = "amber", ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center py-2",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range
        className={cn("absolute h-full rounded-full", TRACK_FILL[tone])}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-5 w-5 cursor-grab rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:cursor-grabbing active:scale-110 disabled:pointer-events-none disabled:opacity-50",
        THUMB_BORDER[tone],
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
