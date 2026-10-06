import { z } from "zod";

export const profileSchema = z.object({
  fullname: z.string().min(3, "Le nom complet doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().regex(/^\+?[0-9]{10}$/, "Le numéro doit contenir 10 chiffres"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;