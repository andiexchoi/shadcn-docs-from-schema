"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Inline Textarea primitive (shadcn pattern — not yet installed in scaffold)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(80, "Name must be 80 characters or fewer"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or fewer")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Field wrapper for consistent label + error layout
// ---------------------------------------------------------------------------
function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProfileEditForm
// ---------------------------------------------------------------------------
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
      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          placeholder="Jane Smith"
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>

      <Field label="Bio" htmlFor="bio" error={errors.bio?.message}>
        <Textarea
          id="bio"
          placeholder="Tell us a little about yourself…"
          aria-invalid={!!errors.bio}
          {...register("bio")}
        />
        <p className="text-xs text-muted-foreground text-right">
          {bioValue.length} / 300
        </p>
      </Field>

      {isSubmitSuccessful && (
        <p className="text-sm text-green-600" role="status">
          Profile updated successfully.
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="self-end">
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
