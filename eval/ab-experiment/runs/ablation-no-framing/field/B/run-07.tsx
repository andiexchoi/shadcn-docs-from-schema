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
    .min(1, "Enter your full name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address."),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or fewer.")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
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
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      bio: defaultValues?.bio ?? "",
    },
  });

  async function handleFormSubmit(values: ProfileFormValues) {
    await onSubmit?.(values);
    reset(values);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="space-y-5"
      >
        {/* Name field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="name"
            className={cn(errors.name && "text-destructive")}
          >
            Full name <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(
              errors.name &&
                "border-destructive focus-visible:ring-destructive"
            )}
            {...register("name")}
          />
          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className={cn(errors.email && "text-destructive")}
          >
            Email address <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : "email-hint"}
            className={cn(
              errors.email &&
                "border-destructive focus-visible:ring-destructive"
            )}
            {...register("email")}
          />
          {!errors.email && (
            <p id="email-hint" className="text-xs text-muted-foreground">
              We'll never share your email with anyone else.
            </p>
          )}
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Bio field */}
        <div className="space-y-1.5">
          <Label
            htmlFor="bio"
            className={cn(errors.bio && "text-destructive")}
          >
            Bio
          </Label>
          <textarea
            id="bio"
            rows={4}
            aria-invalid={!!errors.bio}
            aria-describedby={
              errors.bio ? "bio-error" : "bio-hint"
            }
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              errors.bio &&
                "border-destructive focus-visible:ring-destructive"
            )}
            {...register("bio")}
          />
          {!errors.bio && (
            <p id="bio-hint" className="text-xs text-muted-foreground">
              A short description about yourself. Maximum 300 characters.
            </p>
          )}
          {errors.bio && (
            <p
              id="bio-error"
              role="alert"
              className="text-sm font-medium text-destructive"
            >
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Required fields note */}
        <p className="text-xs text-muted-foreground">
          Fields marked with <span aria-hidden="true">*</span>
          <span className="sr-only">an asterisk</span> are required.
        </p>

        {isSubmitSuccessful && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800"
          >
            Your profile has been updated successfully.
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || !isDirty}
            onClick={() => reset()}
          >
            Discard
          </Button>
        </div>
      </form>
    </div>
  );
}