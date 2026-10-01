import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(50),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;