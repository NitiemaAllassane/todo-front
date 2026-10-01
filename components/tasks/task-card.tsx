import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskPriority, TaskStatus } from "@/types";

interface TaskCardProps {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  categoryName?: string;
  completed: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const priorityStyles: Record<TaskPriority, string> = {
  HIGH: "bg-red-100 text-red-700 hover:bg-red-100",
  MEDIUM: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  LOW: "bg-green-100 text-green-700 hover:bg-green-100",
};

const priorityLabels: Record<TaskPriority, string> = {
  HIGH: "haute",
  MEDIUM: "moyenne",
  LOW: "basse",
};

const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-muted text-muted-foreground hover:bg-muted",
  IN_PROGRESS: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  DONE: "bg-green-100 text-green-700 hover:bg-green-100",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "en attente",
  IN_PROGRESS: "en cours",
  DONE: "terminée",
};

export function TaskCard({
  title,
  description,
  priority,
  status,
  dueDate,
  categoryName,
  completed,
  onToggle,
  onEdit,
  onDelete,
}: TaskCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <Checkbox checked={completed} onCheckedChange={onToggle} className="mt-1" />
          <h3 className={cn("font-medium", completed && "text-muted-foreground line-through")}>
            {title}
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className={priorityStyles[priority]}>
          {priorityLabels[priority]}
        </Badge>
        <Badge variant="secondary" className={statusStyles[status]}>
          {statusLabels[status]}
        </Badge>
        {categoryName && <Badge variant="outline">{categoryName}</Badge>}
      </div>

      {description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
      )}

      <div className="flex items-center justify-between pt-2">
        {dueDate ? (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {dueDate}
          </span>
        ) : (
          <span />
        )}
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}