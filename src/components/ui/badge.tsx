import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/40 bg-primary/15 text-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
        cyan: "border-cyan-accent/40 bg-cyan-accent/15 text-cyan-accent",
        amber: "border-amber-accent/40 bg-amber-accent/15 text-amber-accent",
        violet: "border-violet-accent/40 bg-violet-accent/15 text-violet-accent",
        emerald: "border-emerald-accent/40 bg-emerald-accent/15 text-emerald-accent",
        rose: "border-rose-accent/40 bg-rose-accent/15 text-rose-accent",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
