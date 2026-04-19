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
      className="flex flex-col gap-1.5"
      role="group"
      {...(error ? { "data-invalid": "" } : {})}
    >
      <Label
        htmlFor={id}
        className={cn("text-sm font-medium", error && "text-destructive")}
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
          className="flex items-center gap-1 text-xs font-medium text-destructive"
          role="alert"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3.5 w-3.5 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile saved:", data);
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-card-foreground">
          Edit Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information below.
        </p>
      </div>

      {isSubmitSuccessful && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
        >
          Profile updated successfully.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5"
      >
        <FieldWrapper
          id="name"
          label="Full name"
          error={errors.name?.message}
          required
        >
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={
              errors.name ? "name-error" : undefined
            }
            placeholder="Jane Doe"
            className={cn(
              errors.name &&
                "border-destructive focus-visible:ring-destructive"
            )}
            {...register("name")}
          />
        </FieldWrapper>

        <FieldWrapper
          id="email"
          label="Email address"
          description="We'll never share your email with anyone."
          error={errors.email?.message}
          required
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={cn(
              "email-description",
              errors.email && "email-error"
            )}
            placeholder="jane@example.com"
            className={cn(
              errors.email &&
                "border-destructive focus-visible:ring-destructive"
            )}
            {...register("email")}
          />
        </FieldWrapper>

        <FieldWrapper
          id="bio"
          label="Bio"
          description="A short description about yourself. Up to 500 characters."
          error={errors.bio?.message}
        >
          <textarea
            id="bio"
            rows={4}
            aria-invalid={!!errors.bio}
            aria-describedby={cn(
              "bio-description",
              errors.bio && "bio-error"
            )}
            placeholder="Tell us a little about yourself…"
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "resize-none",
              errors.bio &&
                "border-destructive focus-visible:ring-destructive"
            )}
            {...register("bio")}
          />
        </FieldWrapper>

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

      <p className="mt-5 text-xs text-muted-foreground">
        Fields marked with{" "}
        <span className="text-destructive" aria-hidden="true">
          *
        </span>{" "}
        are required.
      </p>
    </div>
  );
}