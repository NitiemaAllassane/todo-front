"use client";

import { useState } from "react";
import { Plus, Filter, Target, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/tasks/task-card";

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
  {
    id: "2",
    title: "Mettre à jour le flux d'authentification",
    description: "Système d'auth avec sécurité renforcée",
    priority: "HIGH" as const,
    status: "IN_PROGRESS" as const,
    dueDate: "01/10/2026",
    categoryName: "Système d'authentification",
    completed: false,
  },
  {
    id: "3",
    title: "Rédiger la documentation de la nouvelle API",
    description: "Documentation complète de l'API",
    priority: "MEDIUM" as const,
    status: "TODO" as const,
    dueDate: "02/10/2026",
    categoryName: "Documentation API",
    completed: false,
  },
  {
    id: "4",
    title: "Déployer en préproduction",
    priority: "LOW" as const,
    status: "DONE" as const,
    dueDate: "28/09/2026",
    categoryName: "Refonte du site",
    completed: true,
  },
];


const priorityItems = [
  { value: "all", label: "Toutes les priorités" },
  { value: "HIGH", label: "Haute" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "LOW", label: "Basse" },
];

const categoryItems = [
  { value: "all", label: "Toutes les catégories" },
  // à remplir avec GET /categories une fois branché
];


export default function TasksPage() {
  const [tab, setTab] = useState<"active" | "completed">("active");

  const activeTasks = mockTasks.filter((t) => !t.completed);
  const completedTasks = mockTasks.filter((t) => t.completed);
  const visibleTasks = tab === "active" ? activeTasks : completedTasks;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tâches</h1>
          <p className="text-muted-foreground">Gère et suis tes tâches sur tous tes projets.</p>
        </div>
        <Button>
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
            <Select defaultValue="all" items={categoryItems}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryItems.map((item) => (
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
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
}