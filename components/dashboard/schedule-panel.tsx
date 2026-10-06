/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import useSWR from "swr";
import { Calendar, CircleOff, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduleFormDialog } from "./schedule-form-dialog";
import { getSchedules, createSchedule, deleteSchedule } from "@/lib/schedule";
import type { ScheduleItemFormValues } from "@/lib/validations/schedule.schema";
import { LoaderCircle, CircleX } from "lucide-react";

export function SchedulePanel() {
  const { data: items, error, isLoading, mutate } = useSWR("/schedules", getSchedules);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sortedItems = [...(items ?? [])].sort((a, b) => a.time.localeCompare(b.time));

  async function handleAdd(values: ScheduleItemFormValues) {
    await createSchedule(values); 
    await mutate();
  }

  async function handleDelete(id: string) {
    await deleteSchedule(id);
    await mutate();
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold">
          <Calendar className="h-4 w-4" />
          Planning du jour
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

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

      {!isLoading && !error && sortedItems.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <CircleOff className="mx-auto mb-3 h-10 w-10 opacity-50" />
          <p>Rien de prévu pour l'instant.</p>
        </div>
      )}

      {!isLoading && sortedItems.length > 0 && (
        <div className="space-y-4">
          {sortedItems.map((item) => (
            <div key={item.id} className="group flex gap-3 text-sm">
              <span className="w-12 shrink-0 text-muted-foreground">{item.time}</span>
              <div className="flex-1 space-y-1">
                <p className="font-medium">{item.title}</p>
                {item.tag && (
                  <Badge variant="outline" className="text-xs">
                    {item.tag}
                  </Badge>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ScheduleFormDialog open={dialogOpen} onOpenChange={setDialogOpen} onSubmit={handleAdd} />
    </div>
  );
}