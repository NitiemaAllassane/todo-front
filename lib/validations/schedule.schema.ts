import { z } from "zod";

export const scheduleItemSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(100),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format attendu : HH:MM"),
  tag: z.string().max(30).optional().or(z.literal("")),
});

export type ScheduleItemFormValues = z.infer<typeof scheduleItemSchema>;