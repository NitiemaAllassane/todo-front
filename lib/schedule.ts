import { apiFetch } from "./api";
import type { ScheduleItem } from "@/types";
import type { ScheduleItemFormValues } from "./validations/schedule.schema";

export async function getSchedules() {
  return apiFetch<ScheduleItem[]>("/schedules");
}

export async function createSchedule(data: ScheduleItemFormValues) {
  return apiFetch<ScheduleItem>("/schedules", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteSchedule(id: string) {
  return apiFetch<{ message: string }>(`/schedules/${id}`, {
    method: "DELETE",
  });
}