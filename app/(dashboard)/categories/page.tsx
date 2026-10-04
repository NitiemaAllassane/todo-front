/* eslint-disable react/no-unescaped-entities */
"use client";

import { Plus, FolderX, CircleX, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/categories/category-card";
import { useState } from "react";
import type { CategoryFormValues } from "@/lib/validations/category.schema";
import { CategoryFormDialog } from "@/components/categories/category-form-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import useSWR from "swr";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/categories";
import type { Category } from "@/types";



export default function CategoriesPage() {
  const { data: categories, error, isLoading, mutate } = useSWR("/categories", getCategories);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const totalCategories = categories?.length ?? 0;

  function handleCreateClick() {
    setEditingCategory(null);
    setDialogOpen(true);
  }

  function handleEditClick(category: Category) {
    setEditingCategory(category);
    setDialogOpen(true);
  }

  function handleDeleteClick(categoryId: string) {
    setDeletingCategoryId(categoryId);
  }

  async function handleFormSubmit(values: CategoryFormValues) {
    if (editingCategory) {
      await updateCategory(editingCategory.id, values);
    } else {
      await createCategory(values);
    }
    await mutate(); // relance getCategories, rafraîchit la liste
  }

  async function handleConfirmDelete() {
    if (!deletingCategoryId) return;
    await deleteCategory(deletingCategoryId);
    await mutate();
    setDeletingCategoryId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">Organise tes tâches par catégorie.</p>
          <p className="text-muted-foreground">
            {totalCategories} {totalCategories > 1 ? "catégories" : "catégorie"}
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      {isLoading && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <LoaderCircle className="mx-auto mb-3 h-10 w-10 opacity-50 animate-spin" />
          <p>Chargement en cours...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <CircleX className="mx-auto mb-3 h-10 w-10 opacity-50 text-red-600" />
          <p>Une erreur est survenue</p>
        </div>
      )}

      {!isLoading && !error && categories && categories.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <FolderX className="mx-auto mb-3 h-10 w-10 opacity-50" />
          <p>Aucune catégorie pour l'instant.</p>
        </div>
      )}

      {!isLoading && categories && categories.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              taskCount={category.taskCount ?? 0}
              onEdit={() => handleEditClick(category)}
              onDelete={() => handleDeleteClick(category.id)}
            />
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultValues={editingCategory ?? undefined}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={!!deletingCategoryId}
        onOpenChange={() => setDeletingCategoryId(null)}
        title="Supprimer cette catégorie ?"
        description="Cette action est irréversible. La catégorie sera définitivement supprimée."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}