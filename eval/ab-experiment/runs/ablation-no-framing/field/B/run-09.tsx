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
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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
    formState: { errors, isSubmitting, isSubmitSuccessful },
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
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Edit profile</h2>
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
          <Label htmlFor="name">
            Full name <span aria-hidden="true" className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
            {...register("name")}
          />
          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email address <span aria-hidden="true" className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? "email-error" : "email-description"
            }
            className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
            {...register("email")}
          />
          {!errors.email && (
            <p id="email-description" className="text-sm text-muted-foreground">
              We will never share your email with anyone.
            </p>
          )}
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Bio field */}
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={4}
            placeholder="Tell us a little about yourself."
            aria-invalid={!!errors.bio}
            aria-describedby={errors.bio ? "bio-error" : "bio-description"}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              errors.bio && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("bio")}
          />
          {!errors.bio && (
            <p id="bio-description" className="text-sm text-muted-foreground">
              Maximum 300 characters.
            </p>
          )}
          {errors.bio && (
            <p
              id="bio-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Required fields note */}
        <p className="text-xs text-muted-foreground">
          Fields marked with <span aria-hidden="true" className="text-destructive font-medium">*</span> are required.
        </p>

        {/* Success message */}
        {isSubmitSuccessful && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800"
          >
            Your profile has been updated successfully.
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
          <Button type="reset" variant="outline" disabled={isSubmitting}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}