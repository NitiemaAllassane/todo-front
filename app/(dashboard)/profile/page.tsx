"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, X, Trash2, LoaderCircle, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/profile.schema";
import useSWR, { mutate as globalMutate } from "swr";
import { getCurrentUser, updateProfile, deleteAccount } from "@/lib/users.client";
import { useRouter } from "next/navigation";

function getInitials(fullname: string) {
  return fullname
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const { data: currentUser, error, isLoading, mutate } = useSWR("/users/profil", getCurrentUser);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: currentUser?.fullname,
      email: currentUser?.email,
      phone: currentUser?.phone,
    },
  });

  function handleEditClick() {
    reset({ fullname: currentUser?.fullname, email: currentUser?.email, phone: currentUser?.phone });
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
      await updateProfile(values);
      await mutate();
      await globalMutate("/users/profil");
      setIsEditing(false);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  }

  async function handleConfirmDelete() {
    try {
      await deleteAccount();
      router.push("/login");
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
            <AvatarFallback className="text-lg">{getInitials(currentUser?.fullname ?? "NA")}</AvatarFallback>
          </Avatar>
          {!isEditing && currentUser && (
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

        {isLoading && (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <LoaderCircle className="mx-auto mb-3 h-10 w-10 animate-spin opacity-50" />
            <p>Chargement en cours...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
            <CircleX className="mx-auto mb-3 h-10 w-10 text-destructive opacity-50" />
            <p>Impossible de charger le profil.</p>
          </div>
        )}

        {!isLoading && !error && currentUser && !isEditing && (
          // ---- MODE LECTURE SEULE ----
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-medium">{currentUser.fullname}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-medium">{currentUser.phone}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && currentUser && isEditing && (
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