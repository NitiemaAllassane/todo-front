import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderKanban, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface CategoryCardProps {
  name: string;
  taskCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CategoryCard({ name, taskCount, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <FolderKanban className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <Badge variant="secondary" className="mt-1">
            {taskCount} tâche{taskCount > 1 ? "s" : ""}
          </Badge>
        </div>
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
  );
}