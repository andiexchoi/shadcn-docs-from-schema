"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer.")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void | Promise<void>;
}

/* ------------------------------------------------------------------ */
/* Primitive field wrappers (inline, no external Field component)      */
/* ------------------------------------------------------------------ */

function FieldRoot({
  className,
  invalid,
  children,
}: {
  className?: string;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("flex flex-col gap-1.5", className)}
      role="group"
      {...(invalid ? { "data-invalid": "" } : {})}
    >
      {children}
    </div>
  );
}

function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
      {required && (
        <span aria-hidden="true" className="ml-0.5 text-destructive">
          *
        </span>
      )}
    </Label>
  );
}

function FieldDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Profile Edit Form                                                    */
/* ------------------------------------------------------------------ */

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
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      bio: defaultValues?.bio ?? "",
    },
  });

  const bioValue = watch("bio") ?? "";

  async function handleFormSubmit(values: ProfileFormValues) {
    await onSubmit?.(values);
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Edit profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information. Fields marked with{" "}
          <span aria-hidden="true" className="text-destructive">
            *
          </span>{" "}
          are required.
        </p>
      </div>

      {isSubmitSuccessful && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Profile updated successfully.
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        {/* Name */}
        <FieldRoot invalid={!!errors.name}>
          <FieldLabel htmlFor="name" required>
            Full name
          </FieldLabel>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Jane Smith"
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </FieldRoot>

        {/* Email */}
        <FieldRoot invalid={!!errors.email}>
          <FieldLabel htmlFor="email" required>
            Email address
          </FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="jane@example.com"
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </FieldRoot>

        {/* Bio */}
        <FieldRoot invalid={!!errors.bio}>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <FieldDescription>
            A short description about yourself. Visible on your public profile.
          </FieldDescription>
          <textarea
            id="bio"
            rows={4}
            aria-invalid={!!errors.bio}
            aria-describedby={
              errors.bio
                ? "bio-error"
                : "bio-description bio-char-count"
            }
            placeholder="Tell us a bit about yourself…"
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "resize-none",
              errors.bio && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("bio")}
          />
          <div className="flex items-start justify-between gap-2">
            <FieldError message={errors.bio?.message} />
            <p
              id="bio-char-count"
              className={cn(
                "ml-auto shrink-0 text-xs tabular-nums",
                bioValue.length > 500
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
              aria-live="polite"
              aria-atomic="true"
            >
              {bioValue.length} / 500
            </p>
          </div>
        </FieldRoot>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}