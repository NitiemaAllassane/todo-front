"use client";

import useSWR, { mutate as globalMutate} from "swr";
import { useState } from "react";
import { Plus, Filter, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import type { TaskFormValues } from "@/lib/validations/task.schema";
import type { Task } from "@/types";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/tasks";
import { getCategories } from "@/lib/categories";
import { FolderX, LoaderCircle, CircleX } from "lucide-react";

// Liste statique — pas besoin d'API, ce sont juste les libellés d'affichage
const priorityItems = [
  { value: "all", label: "Toutes les priorités" },
  { value: "HIGH", label: "Haute" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "LOW", label: "Basse" },
];

export default function TasksPage() {
  const { data: tasks, error, isLoading, mutate } = useSWR("/tasks", getTasks);
  const { data: categories } = useSWR("/categories", getCategories);

  const [tab, setTab] = useState<"all" | "active" | "completed">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const allTasks: Task[] = tasks ?? [];
  const activeTasks = tasks?.filter((t) => t.status !== "DONE") ?? [];
  const completedTasks = tasks?.filter((t) => t.status === "DONE") ?? [];
  const visibleTasks = tab === "all" ? allTasks : tab === "active" ?  activeTasks : completedTasks;
  const emptyStateMessages = {
    all: "Aucune tâche pour l'instant.",
    active: "Aucune tâche active. Tout est à jour !",
    completed: "Aucune tâche terminée pour l'instant.",
  };

  const categoryFilterItems = [
    { value: "all", label: "Toutes les catégories" },
    ...(categories ?? []).map((c) => ({ value: c.id, label: c.name })),
  ];

  function handleCreateClick() {
    setEditingTask(null);
    setDialogOpen(true);
  }

  function handleEditClick(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  function handleDeleteClick(taskId: string) {
    setDeletingTaskId(taskId);
  }

  async function handleFormSubmit(values: TaskFormValues) {
    if (editingTask) {
      await updateTask(editingTask.id, values);
    } else {
      await createTask(values);
    }
    await mutate();
    await globalMutate("/categories")
  }

  async function handleConfirmDelete() {
    if (!deletingTaskId) return;
    await deleteTask(deletingTaskId);
    await mutate();
    setDeletingTaskId(null);
  }

  async function handleToggleComplete(task: Task) {
    const newStatus = task.status === "DONE" ? "TODO" : "DONE";
    await updateTask(task.id, { status: newStatus });
    await mutate();
  } 

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tâches</h1>
          <p className="text-muted-foreground">Gère et suis tes tâches sur tous tes projets.</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Nouvelle tâche
        </Button>
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <Filter className="h-4 w-4" />
          Filtres
        </h2>
        <div className="flex items-center gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Priorité</label>
            <Select defaultValue="all" items={priorityItems}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorityItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Catégorie</label>
            <Select defaultValue="all" items={categoryFilterItems}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryFilterItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "active" | "completed")}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Target className="h-4 w-4" />
            Toutes les taches ({allTasks.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="gap-2">
            <Target className="h-4 w-4" />
            Actives ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Terminées ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <LoaderCircle className="mx-auto mb-3 h-10 w-10 animate-spin opacity-50" />
          <p>Chargement en cours...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <CircleX className="mx-auto mb-3 h-10 w-10 text-destructive opacity-50" />
          <p>Une erreur est survenue</p>
        </div>
      )}

      {!isLoading && !error && tasks && visibleTasks.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <FolderX className="mx-auto mb-3 h-10 w-10 opacity-50" />
          <p>{emptyStateMessages[tab]}</p>
        </div>
      )}


      {!isLoading && !error && (
        <div className="grid grid-cols-3 gap-4">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              status={task.status}
              dueDate={task.dueDate}
              categoryName={task.category?.name}
              completed={task.status === "DONE"}
              onEdit={() => handleEditClick(task)}
              onDelete={() => handleDeleteClick(task.id)}
              onToggle={() => handleToggleComplete(task)}
            />
          ))}
        </div>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingTask ?? undefined}
        categories={categories ?? []}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={!!deletingTaskId}
        onOpenChange={() => setDeletingTaskId(null)}
        title="Supprimer cette tâche ?"
        description="Cette action est irréversible. La tâche sera définitivement supprimée."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}