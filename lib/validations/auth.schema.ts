import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().min(3, "Le nom complet doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().regex(/^\+?[0-9]{10}$/, "Le numéro doit contenir 10 chiffres"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;