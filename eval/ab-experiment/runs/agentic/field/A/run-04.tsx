"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ── Schema ────────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ── Textarea (unstyled → shadcn-matched) ─────────────────────────────────────

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface ProfileEditFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void | Promise<void>;
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

  const bio = watch("bio") ?? "";

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit?.(values);
  });

  return (
    <form
      onSubmit={handleFormSubmit}
      noValidate
      className="space-y-6 w-full max-w-md"
    >
      <div className="space-y-4">
        {/* Name */}
        <Field id="name" label="Name" error={errors.name?.message}>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </Field>

        {/* Email */}
        <Field id="email" label="Email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>

        {/* Bio */}
        <Field id="bio" label="Bio" error={errors.bio?.message}>
          <Textarea
            id="bio"
            placeholder="Tell us a little about yourself…"
            aria-invalid={!!errors.bio}
            {...register("bio")}
          />
          <p className="text-xs text-muted-foreground text-right">
            {bio.length} / 500
          </p>
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>

        {isSubmitSuccessful && (
          <p className="text-sm text-muted-foreground">Profile updated.</p>
        )}
      </div>
    </form>
  );
}
