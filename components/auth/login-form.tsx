"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth.schema";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginFormValues) {
    // branché plus tard sur POST /auth/login
    console.log(values);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Content de te revoir 👋</h2>
        <p className="text-sm text-muted-foreground">
          Connecte-toi pour retrouver tes tâches.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="toi@exemple.com" {...register("email")} />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <Input id="password" type="password" placeholder="Au moins 8 caracteres" {...register("password")} />
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </Field>

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Inscris-toi
        </Link>
      </p>
    </div>
  );
}