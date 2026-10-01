/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { taskSchema, type TaskFormValues } from "@/lib/validations/task.schema";

const statusItems = [
  { value: "TODO", label: "À faire" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "DONE", label: "Terminée" },
];

const priorityItems = [
  { value: "LOW", label: "Basse" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HIGH", label: "Haute" },
];

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<TaskFormValues>;
  categories: { id: string; name: string }[];
  onSubmit: (values: TaskFormValues) => void;
}

const emptyValues: TaskFormValues = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  startDate: "",
  dueDate: "",
  categoryId: undefined,
};

export function TaskFormDialog({
  open,
  onOpenChange,
  defaultValues,
  categories,
  onSubmit,
}: TaskFormDialogProps) {
  const isEditing = !!defaultValues;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: emptyValues,
  });

  // Réinitialise le formulaire à chaque ouverture, avec les bonnes valeurs (création ou édition)
  useEffect(() => {
    if (open) {
      reset(defaultValues ?? emptyValues);
    }
  }, [open, defaultValues, reset]);

  const categoryItems = categories.map((c) => ({ value: c.id, label: c.name }));

  function handleFormSubmit(values: TaskFormValues) {
    onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Titre</FieldLabel>
              <Input id="title" placeholder="Rédiger le rapport de stage" {...register("title")} />
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" placeholder="Détails de la tâche (optionnel)" {...register("description")} />
              {errors.description && <FieldError>{errors.description.message}</FieldError>}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Priorité</FieldLabel>
                <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                    <Select items={priorityItems} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
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
                    )}
                />
              </Field>

              <Field>
                <FieldLabel>Statut</FieldLabel>
                <Select
                  items={statusItems}
                  value={watch("status")}
                  onValueChange={(v) => setValue("status", v as TaskFormValues["status"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="startDate">Date de début</FieldLabel>
                <Input id="startDate" type="date" {...register("startDate")} />
              </Field>

              <Field>
                <FieldLabel htmlFor="dueDate">Date d'échéance</FieldLabel>
                <Input id="dueDate" type="date" {...register("dueDate")} />
              </Field>
            </div>

            {categoryItems.length > 0 && (
              <Field>
                <FieldLabel>Catégorie</FieldLabel>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select items={categoryItems} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Aucune catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">{isEditing ? "Enregistrer" : "Créer la tâche"}</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}