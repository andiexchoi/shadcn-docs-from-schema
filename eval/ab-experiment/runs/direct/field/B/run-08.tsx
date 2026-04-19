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
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div
      className="flex flex-col gap-1.5"
      role="group"
      {...(error ? { "data-invalid": true } : {})}
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
        <p
          id={descriptionId}
          className="text-xs text-muted-foreground"
        >
          {description}
        </p>
      )}

      <div
        className="[&_input]:aria-[invalid=true]:border-destructive [&_textarea]:aria-[invalid=true]:border-destructive"
      >
        {children}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-xs font-medium text-destructive"
          role="alert"
        >
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
    // Simulate an API call
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
            Update your personal information below.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Fields marked with{" "}
            <span className="text-destructive font-semibold" aria-hidden="true">
              *
            </span>{" "}
            are required.
          </p>
        </div>

        {isSubmitSuccessful && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
          >
            ✓ Your profile has been saved successfully.
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
            required
            error={errors.name?.message}
            description="This is the name that will be displayed on your profile."
          >
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={
                [
                  errors.name ? "name-error" : "",
                  "name-description",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              {...register("name")}
            />
          </FieldWrapper>

          <FieldWrapper
            id="email"
            label="Email address"
            required
            error={errors.email?.message}
            description="We'll use this address to contact you."
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={
                [
                  errors.email ? "email-error" : "",
                  "email-description",
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
            error={errors.bio?.message}
            description="Tell others a little about yourself. Maximum 500 characters."
          >
            <textarea
              id="bio"
              rows={4}
              placeholder="I'm a designer who loves..."
              aria-invalid={!!errors.bio}
              aria-describedby={
                [
                  errors.bio ? "bio-error" : "",
                  "bio-description",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              className={cn(
                "flex w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.bio && "border-destructive"
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
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}