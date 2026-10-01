/* eslint-disable react/no-unescaped-entities */
import { Target, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { TaskProgressBar } from "@/components/dashboard/task-progress-bar";
import { TaskItem } from "@/components/tasks/task-item";
import { SchedulePanel } from "@/components/dashboard/schedule-panel";

// Données factices — à remplacer par l'appel API GET /tasks
const mockTasks = [
  {
    id: "1",
    title: "Review landing page designs",
    priority: "HIGH" as const,
    status: "IN_PROGRESS" as const,
    dueDate: "2 Oct",
    categoryName: "Website Redesign",
    completed: false,
  },
  {
    id: "2",
    title: "Team standup meeting",
    priority: "MEDIUM" as const,
    status: "DONE" as const,
    dueDate: "1 Oct",
    categoryName: "Website Redesign",
    completed: true,
  },
  {
    id: "3",
    title: "Update user authentication flow",
    priority: "HIGH" as const,
    status: "IN_PROGRESS" as const,
    dueDate: "3 Oct",
    categoryName: "Authentication System",
    completed: false,
  },
];

export default function DashboardPage() {
  const total = mockTasks.length;
  const completed = mockTasks.filter((t) => t.completed).length;
  const inProgress = mockTasks.filter((t) => t.status === "IN_PROGRESS").length;

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Aujourd'hui</h1>
        <p className="text-muted-foreground capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatsCard icon={Target} label="Tâches totales" value={total} />
        <StatsCard icon={CheckCircle2} label="Terminées" value={completed} valueClassName="text-green-600" />
        <StatsCard icon={Loader2} label="En cours" value={inProgress} valueClassName="text-blue-600" />
        <StatsCard icon={AlertTriangle} label="En retard" value={0} valueClassName="text-red-600" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4 rounded-xl border bg-card p-5">
          <div>
            <h2 className="font-semibold">Tâches du jour</h2>
          </div>

          <TaskProgressBar completed={completed} total={total} />

          <div className="space-y-3">
            {mockTasks.map((task) => (
              <TaskItem key={task.id} {...task} />
            ))}
          </div>
        </div>

        <SchedulePanel />
      </div>
    </div>
  );
}