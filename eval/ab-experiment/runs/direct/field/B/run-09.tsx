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
    .email("Email must include a valid address with @."),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer.")
    .optional()
    .or(z.literal("")),
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
      className={cn(
        "flex flex-col gap-1.5",
        error && "[&_input]:border-destructive [&_textarea]:border-destructive"
      )}
    >
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium leading-none",
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
          role="alert"
          className="flex items-center gap-1 text-xs text-destructive"
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
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
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
    watch,
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

  const bioValue = watch("bio") ?? "";

  async function onSubmit(data: ProfileFormValues) {
    // Simulate an async save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile saved:", data);
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your personal information. Fields marked with{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>{" "}
            are required.
          </p>
        </div>

        {isSubmitSuccessful && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clipRule="evenodd"
              />
            </svg>
            Profile saved successfully.
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
              placeholder="Jane Smith"
              aria-required="true"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
          </FieldWrapper>

          <FieldWrapper
            id="email"
            label="Email address"
            description="We'll never share your email with anyone else."
            error={errors.email?.message}
            required
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              aria-required="true"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={
                [
                  "email-description",
                  errors.email ? "email-error" : undefined,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              {...register("email")}
            />
          </FieldWrapper>

          <FieldWrapper
            id="bio"
            label="Bio"
            description="Tell others a little about yourself."
            error={errors.bio?.message}
          >
            <div className="relative">
              <textarea
                id="bio"
                rows={4}
                placeholder="I'm a product designer based in San Francisco…"
                aria-invalid={errors.bio ? true : undefined}
                aria-describedby={
                  [
                    "bio-description",
                    errors.bio ? "bio-error" : undefined,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                className={cn(
                  "flex min-h-[96px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.bio && "border-destructive"
                )}
                {...register("bio")}
              />
              <span
                aria-live="polite"
                aria-atomic="true"
                className={cn(
                  "absolute bottom-2 right-2 select-none text-xs tabular-nums text-muted-foreground",
                  bioValue.length > 500 && "text-destructive"
                )}
              >
                {bioValue.length}/500
              </span>
            </div>
          </FieldWrapper>

          <div className="flex items-center justify-between gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-28">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                    />
                  </svg>
                  Saving…
                </span>
              ) : (
                "Save profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}