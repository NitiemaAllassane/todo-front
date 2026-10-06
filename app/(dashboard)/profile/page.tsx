"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/profile.schema";
import type { User } from "@/types";

// TODO (étape 1 — récupération) : remplacer par le vrai user chargé depuis GET /users/me
const mockUser: User = {
  id: "placeholder",
  fullname: "Nitiema Allassane",
  email: "allassane@example.com",
  phone: "0799918349",
};

function getInitials(fullname: string) {
  return fullname
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const [user, setUser] = useState<User>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
    },
  });

  function handleEditClick() {
    reset({ fullname: user.fullname, email: user.email, phone: user.phone });
    setServerError(null);
    setIsEditing(true);
  }

  function handleCancelClick() {
    setIsEditing(false);
    setServerError(null);
  }

  async function onSubmit(values: ProfileFormValues) {
    setServerError(null);
    try {
      // TODO (étape 2 — modification) : appeler updateProfile(values) ici
      // puis mettre à jour `user` avec la réponse, et fermer le mode édition
      console.log("À brancher :", values);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  }

  async function handleConfirmDelete() {
    try {
      // TODO (étape 3 — suppression) : appeler deleteAccount() ici,
      // puis rediriger vers /login (le compte n'existe plus, pas de logout séparé nécessaire)
      console.log("Suppression à brancher");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="text-muted-foreground">Consulte et modifie tes informations personnelles.</p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{getInitials(user.fullname)}</AvatarFallback>
          </Avatar>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEditClick} className="ml-auto">
              <Pencil className="h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>

        {serverError && (
          <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {serverError}
          </p>
        )}

        {!isEditing ? (
          // ---- MODE LECTURE SEULE ----
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-medium">{user.fullname}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
        ) : (
          // ---- MODE ÉDITION ----
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.fullname}>
                <FieldLabel htmlFor="fullname">Nom complet</FieldLabel>
                <Input id="fullname" {...register("fullname")} />
                {errors.fullname && <FieldError>{errors.fullname.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="phone">Téléphone</FieldLabel>
                <Input id="phone" {...register("phone")} />
                {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
              </Field>

              <div className="flex gap-2">
                <Button type="submit">Enregistrer</Button>
                <Button type="button" variant="outline" onClick={handleCancelClick}>
                  <X className="h-4 w-4" />
                  Annuler
                </Button>
              </div>
            </FieldGroup>
          </form>
        )}
      </div>

      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="mb-1 font-semibold text-destructive">Zone dangereuse</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Cette action supprimera définitivement ton compte et toutes tes données associées.
        </p>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="h-4 w-4" />
          Supprimer mon compte
        </Button>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Vous êtes sûr de vouloir nous abandonner 😢 ?"
        description="Cette action est irréversible. Toutes tes tâches, catégories et données seront définitivement supprimées."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}