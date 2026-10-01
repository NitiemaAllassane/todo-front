/* eslint-disable react/no-unescaped-entities */
import { Plus, FolderKanban, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CategoryCard } from "@/components/categories/category-card";

// Données factices — à remplacer par GET /categories (avec le compte de tâches par catégorie)
const mockCategories = [
  { id: "1", name: "Refonte du site", taskCount: 2 },
  { id: "2", name: "Système d'authentification", taskCount: 1 },
  { id: "3", name: "Documentation API", taskCount: 1 },
];

export default function CategoriesPage() {
  const totalCategories = mockCategories.length;
  const totalCategorizedTasks = mockCategories.reduce((sum, c) => sum + c.taskCount, 0);
  const uncategorizedTasks = 0; // à calculer depuis GET /tasks une fois branché

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">Organise tes tâches par catégorie.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatsCard icon={FolderKanban} label="Total catégories" value={totalCategories} />
        <StatsCard
          icon={CheckCircle2}
          label="Tâches catégorisées"
          value={totalCategorizedTasks}
          valueClassName="text-green-600"
        />
        <StatsCard
          icon={AlertTriangle}
          label="Tâches sans catégorie"
          value={uncategorizedTasks}
          valueClassName="text-amber-600"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-6">Listes Des Catégories</h3>
        <div className="grid grid-cols-3 gap-4">
          {mockCategories.map((category) => (
            <CategoryCard key={category.id} name={category.name} taskCount={category.taskCount} />
          ))}
        </div>
      </div>

      {mockCategories.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <FolderKanban className="mx-auto mb-3 h-10 w-10 opacity-50" />
          <p>Aucune catégorie pour l'instant.</p>
        </div>
      )}
    </div>
  );
}