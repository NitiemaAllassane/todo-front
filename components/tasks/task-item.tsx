import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskPriority, TaskStatus } from "@/types";

interface TaskItemProps {
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  categoryName?: string;
  completed: boolean;
  assigneeInitials?: string;
  onToggle?: () => void;
  onDelete?: () => void;
}

const priorityStyles: Record<TaskPriority, string> = {
  HIGH: "bg-red-100 text-red-700 hover:bg-red-100",
  MEDIUM: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  LOW: "bg-green-100 text-green-700 hover:bg-green-100",
};

const statusConfig: Record<TaskStatus, { label: string; className: string; icon: typeof Clock }> = {
  TODO: { label: "à faire", className: "text-muted-foreground", icon: Clock },
  IN_PROGRESS: { label: "in-progress", className: "text-blue-600", icon: Loader2 },
  DONE: { label: "completed", className: "text-green-600", icon: CheckCircle2 },
};

export function TaskItem({
  title,
  priority,
  status,
  dueDate,
  categoryName,
  completed,
  assigneeInitials = "JD",
  onToggle,
  onDelete,
}: TaskItemProps) {
  const StatusIcon = statusConfig[status].icon;

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Checkbox checked={completed} onCheckedChange={onToggle} />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("font-medium", completed && "text-muted-foreground line-through")}>
              {title}
            </span>
            <Badge variant="secondary" className={priorityStyles[priority]}>
              {priority.toLowerCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {dueDate && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {dueDate}
              </span>
            )}
            {categoryName && <Badge variant="outline">{categoryName}</Badge>}
            <span className={cn("flex items-center gap-1", statusConfig[status].className)}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig[status].label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs">{assigneeInitials}</AvatarFallback>
        </Avatar>
        <button onClick={onDelete} className="text-destructive hover:text-destructive/70">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}