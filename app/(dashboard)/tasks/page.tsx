"use client";

import { useState } from "react";
import { Plus, Filter, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import type { TaskFormValues } from "@/lib/validations/task.schema";

// Données factices — à remplacer par GET /tasks
const mockTasks = [
  {
    id: "1",
    title: "Revoir les maquettes de la landing page",
    description: "Revue et retour sur les maquettes de la landing page",
    priority: "HIGH" as const,
    status: "IN_PROGRESS" as const,
    dueDate: "01/10/2026",
    categoryName: "Refonte du site",
    completed: false,
  },
  // ... (le reste de tes mockTasks)
];

// Données factices — à remplacer par GET /categories
const mockCategories = [
  { id: "cat-1", name: "Refonte du site" },
  { id: "cat-2", name: "Système d'authentification" },
  { id: "cat-3", name: "Documentation API" },
];

const priorityItems = [
  { value: "all", label: "Toutes les priorités" },
  { value: "HIGH", label: "Haute" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "LOW", label: "Basse" },
];

const categoryFilterItems = [
  { value: "all", label: "Toutes les catégories" },
  ...mockCategories.map((c) => ({ value: c.id, label: c.name })),
];

export default function TasksPage() {
  const [tab, setTab] = useState<"active" | "completed">("active");

  // État pour la Dialog création/édition
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<(typeof mockTasks)[number] | null>(null);

  // État pour la confirmation de suppression
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const activeTasks = mockTasks.filter((t) => !t.completed);
  const completedTasks = mockTasks.filter((t) => t.completed);
  const visibleTasks = tab === "active" ? activeTasks : completedTasks;

  function handleCreateClick() {
    setEditingTask(null); // mode création → formulaire vide
    setDialogOpen(true);
  }

  function handleEditClick(task: (typeof mockTasks)[number]) {
    setEditingTask(task); // mode édition → formulaire pré-rempli
    setDialogOpen(true);
  }

  function handleDeleteClick(taskId: string) {
    setDeletingTaskId(taskId);
  }

  function handleFormSubmit(values: TaskFormValues) {
    if (editingTask) {
      // plus tard : PATCH /tasks/:id
      console.log("Modifier la tâche", editingTask.id, values);
    } else {
      // plus tard : POST /tasks
      console.log("Créer une tâche", values);
    }
  }

  function handleConfirmDelete() {
    // plus tard : DELETE /tasks/:id
    console.log("Supprimer la tâche", deletingTaskId);
    setDeletingTaskId(null);
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

      <Tabs value={tab} onValueChange={(v) => setTab(v as "active" | "completed")}>
        <TabsList>
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

      <div className="grid grid-cols-3 gap-4">
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            onEdit={() => handleEditClick(task)}
            onDelete={() => handleDeleteClick(task.id)}
          />
        ))}
      </div>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingTask ?? undefined}
        categories={mockCategories}
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