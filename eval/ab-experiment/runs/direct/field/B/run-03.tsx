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
  required?: boolean;
  children: React.ReactNode;
}

function FieldWrapper({
  id,
  label,
  description,
  error,
  required,
  children,
}: FieldWrapperProps) {
  return (
    <div
      role="group"
      data-invalid={error ? true : undefined}
      className="flex flex-col gap-1.5"
    >
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium text-foreground",
          error && "text-destructive"
        )}
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
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
          className="flex items-center gap-1.5 text-xs font-medium text-destructive"
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
              d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM8 5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 8 5Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default function ProfileEditForm() {
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
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile saved:", data);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
            Edit Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your personal information. Fields marked with * are required.
          </p>
        </div>

        {isSubmitSuccessful && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
          >
            Your profile has been saved successfully.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6"
        >
          <FieldWrapper
            id="name"
            label="Full name"
            description="Your display name visible to other users."
            error={errors.name?.message}
            required
          >
            <Input
              id="name"
              type="text"
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={
                [
                  "name-description",
                  errors.name ? "name-error" : "",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              placeholder="Jane Smith"
              className={cn(
                errors.name &&
                  "border-destructive focus-visible:ring-destructive/30"
              )}
              {...register("name")}
            />
          </FieldWrapper>

          <FieldWrapper
            id="email"
            label="Email address"
            description="Used for account notifications and login."
            error={errors.email?.message}
            required
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={
                [
                  "email-description",
                  errors.email ? "email-error" : "",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              placeholder="jane@example.com"
              className={cn(
                errors.email &&
                  "border-destructive focus-visible:ring-destructive/30"
              )}
              {...register("email")}
            />
          </FieldWrapper>

          <FieldWrapper
            id="bio"
            label="Bio"
            description="A short description about yourself. Maximum 500 characters."
            error={errors.bio?.message}
          >
            <textarea
              id="bio"
              rows={4}
              aria-invalid={!!errors.bio}
              aria-describedby={
                [
                  "bio-description",
                  errors.bio ? "bio-error" : "",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              placeholder="Tell us a little about yourself…"
              className={cn(
                "flex min-h-[96px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
                errors.bio &&
                  "border-destructive focus-visible:ring-destructive/30"
              )}
              {...register("bio")}
            />
          </FieldWrapper>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}