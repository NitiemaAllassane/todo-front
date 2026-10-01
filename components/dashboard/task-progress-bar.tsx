import { Progress } from "@/components/ui/progress";

interface TaskProgressBarProps {
  completed: number;
  total: number;
}

export function TaskProgressBar({ completed, total }: TaskProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {completed} of {total} tasks completed
      </p>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}