/* eslint-disable react/no-unescaped-entities */
"use client";

import useSWR, { mutate as globalMutate } from "swr";
import { Target, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TaskProgressBar } from "@/components/dashboard/task-progress-bar";
import { TaskItem } from "@/components/tasks/task-item";
import { SchedulePanel } from "@/components/dashboard/schedule-panel";
import { getTasks, updateTask, deleteTask } from "@/lib/tasks";
import type { Task } from "@/types";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data: tasks, error, isLoading, mutate } = useSWR("/tasks", getTasks);

  const allTasks = tasks ?? [];
  const recentTasks = allTasks.slice(0, 5);

  const total = allTasks.length;
  const completed = allTasks.filter((t) => t.status === "DONE").length;
  const inProgress = allTasks.filter((t) => t.status === "TODO").length;

  const today = new Date();
  const overdue = allTasks.filter(
    (t) => t.status !== "DONE" && t.dueDate && new Date(t.dueDate) < today
  ).length;

  const dateLabel = today.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleToggleComplete(task: Task) {
    const newStatus = task.status === "DONE" ? "TODO" : "DONE";
    await updateTask(task.id, { status: newStatus });
    await mutate();
  }

  async function handleDelete(taskId: string) {
    await deleteTask(taskId);
    await mutate();
    await globalMutate("/categories");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Aujourd'hui</h1>
        <p className="capitalize text-muted-foreground">{dateLabel}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard icon={Target} label="Tâches totales" value={total} />
        <StatsCard icon={CheckCircle2} label="Terminées" value={completed} valueClassName="text-green-600" />
        <StatsCard icon={Loader2} label="A faire" value={inProgress} valueClassName="text-blue-600" />
        <StatsCard icon={AlertTriangle} label="En retard" value={overdue} valueClassName="text-red-600" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4 rounded-xl border bg-card p-5">
          <h2 className="font-semibold">Tâches récentes</h2>

          {isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
          {error && <p className="text-sm text-destructive">Une erreur est survenue.</p>}

          {!isLoading && !error && (
            <>
              <TaskProgressBar completed={completed} total={total} />

              {recentTasks.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Aucune tâche pour l'instant.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      title={task.title}
                      priority={task.priority}
                      status={task.status}
                      dueDate={formatDate(task.dueDate)}
                      categoryName={task.category?.name}
                      completed={task.status === "DONE"}
                      onToggle={() => handleToggleComplete(task)}
                      onDelete={() => handleDelete(task.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <SchedulePanel />
      </div>
    </div>
  );
}