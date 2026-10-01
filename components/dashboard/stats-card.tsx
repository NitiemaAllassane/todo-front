import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  valueClassName?: string;
}

export function StatsCard({ icon: Icon, label, value, valueClassName }: StatsCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className={cn("text-3xl font-bold", valueClassName)}>{value}</div>
    </div>
  );
}