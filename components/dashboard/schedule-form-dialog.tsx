"use client";

import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { scheduleItemSchema, type ScheduleItemFormValues } from "@/lib/validations/schedule.schema";

interface ScheduleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ScheduleItemFormValues) => Promise<void>;
}

export function ScheduleFormDialog({ open, onOpenChange, onSubmit }: ScheduleFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleItemFormValues>({
    resolver: zodResolver(scheduleItemSchema),
    defaultValues: { title: "", time: "", tag: "" },
  });

  async function handleFormSubmit(values: ScheduleItemFormValues) {
    await onSubmit(values);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter au planning</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Titre</FieldLabel>
              <Input id="title" placeholder="Réunion d'équipe" {...register("title")} />
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.time}>
              <FieldLabel htmlFor="time">Heure</FieldLabel>
              <Input id="time" type="time" {...register("time")} />
              {errors.time && <FieldError>{errors.time.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.tag}>
              <FieldLabel htmlFor="tag">Étiquette (optionnel)</FieldLabel>
              <Input id="tag" placeholder="réunion, appel, révision..." {...register("tag")} />
              {errors.tag && <FieldError>{errors.tag.message}</FieldError>}
            </Field>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}