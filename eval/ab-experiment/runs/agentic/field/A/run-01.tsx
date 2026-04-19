"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Schema ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(80, "Name must be 80 characters or fewer"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or fewer")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ─── Field wrapper ────────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

interface ProfileEditFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => Promise<void> | void;
}

export function ProfileEditForm({
  defaultValues,
  onSubmit,
}: ProfileEditFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      ...defaultValues,
    },
  });

  const bioValue = watch("bio") ?? "";

  async function handleFormSubmit(values: ProfileFormValues) {
    await onSubmit?.(values);
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="flex flex-col gap-6"
    >
      {/* Name */}
      <Field id="name" label="Name" error={errors.name?.message}>
        <Input
          id="name"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
      </Field>

      {/* Email */}
      <Field id="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </Field>

      {/* Bio */}
      <Field id="bio" label="Bio" error={errors.bio?.message}>
        <textarea
          id="bio"
          rows={4}
          placeholder="Tell us a little about yourself…"
          aria-invalid={!!errors.bio}
          aria-describedby={errors.bio ? "bio-error" : undefined}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2",
            "text-sm ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-hidden focus-visible:ring-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none",
          )}
          {...register("bio")}
        />
        <p className="text-xs text-muted-foreground text-right">
          {bioValue.length} / 300
        </p>
      </Field>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {isSubmitSuccessful && (
          <p className="text-sm text-muted-foreground">Profile saved.</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
