"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth.schema";
import { registerUser } from "@/lib/auth";



export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullname: "", email: "", phone: "", password: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    try {
      await registerUser(values);
      router.push("/")
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Une erreur est survenue")
    }
    
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Crée ton compte</h2>
        <p className="text-sm text-muted-foreground">
          Rejoins TaskFlow et reprends le contrôle de tes tâches.
        </p>
      </div>

      {serverError && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{serverError}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!errors.fullname}>
            <FieldLabel htmlFor="fullname">Nom complet</FieldLabel>
            <Input id="fullname" placeholder="Nitiema Allassane" {...register("fullname")} />
            {errors.fullname && <FieldError>{errors.fullname.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="toi@exemple.com" {...register("email")} />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
            <Input id="phone" placeholder="0799918349" {...register("phone")} />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <Input id="password" type="password" placeholder="Au moins 8 caracteres" {...register("password")} />
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </Field>

          <Button type="submit" className="w-full">
            Créer mon compte
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Connecte-toi
        </Link>
      </p>
    </div>
  );
}