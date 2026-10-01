import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(150),
  description: z.string().max(1000).optional().or(z.literal("")),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  startDate: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;