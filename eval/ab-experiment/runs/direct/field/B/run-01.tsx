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
    .min(1, "Email is required.")
    .email("Email must include @."),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer.")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface FieldWrapperProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}

function FieldWrapper({ id, label, description, error, children }: FieldWrapperProps) {
  return (
    <div
      className="flex flex-col gap-1.5"
      role="group"
      {...(error ? { "data-invalid": "" } : {})}
    >
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium leading-none",
          error && "text-destructive"
        )}
      >
        {label}
      </Label>
      {description && (
        <p id={`${id}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1 text-xs font-medium text-destructive"
          aria-live="polite"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-3.25a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4.75Zm0 7a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export function ProfileEditForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    // Simulate an async save
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Profile saved:", data);
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Edit Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information. Changes will be saved immediately.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        {/* Name */}
        <FieldWrapper
          id="name"
          label="Full name (required)"
          description="Your display name visible to other users."
          error={errors.name?.message}
        >
          <Input
            id="name"
            type="text"
            placeholder="Jane Smith"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={
              [
                "name-description",
                errors.name ? "name-error" : undefined,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
            {...register("name")}
          />
        </FieldWrapper>

        {/* Email */}
        <FieldWrapper
          id="email"
          label="Email address (required)"
          description="We'll use this address to contact you."
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={
              [
                "email-description",
                errors.email ? "email-error" : undefined,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
            {...register("email")}
          />
        </FieldWrapper>

        {/* Bio */}
        <FieldWrapper
          id="bio"
          label="Bio"
          description="A short description about yourself. Maximum 500 characters."
          error={errors.bio?.message}
        >
          <textarea
            id="bio"
            rows={4}
            placeholder="Tell us a little about yourself…"
            aria-invalid={!!errors.bio}
            aria-describedby={
              [
                "bio-description",
                errors.bio ? "bio-error" : undefined,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(
              "flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              errors.bio && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("bio")}
          />
        </FieldWrapper>

        {/* Success message */}
        {isSubmitSuccessful && (
          <p
            className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            role="status"
            aria-live="polite"
          >
            Your profile has been saved successfully.
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}