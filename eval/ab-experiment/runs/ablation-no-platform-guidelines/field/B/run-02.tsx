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
    .email("Enter a valid email address."),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer.")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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
    // Simulate async save
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Profile saved:", data);
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
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
          className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Your profile has been saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Name field */}
        <div
          className={cn("flex flex-col gap-1.5", errors.name && "group/invalid")}
          data-invalid={errors.name ? true : undefined}
        >
          <Label
            htmlFor="name"
            className={cn(
              "text-sm font-medium",
              errors.name && "text-destructive"
            )}
          >
            Full name
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Jane Smith"
            className={cn(
              errors.name &&
                "border-destructive ring-destructive focus-visible:ring-destructive"
            )}
            {...register("name")}
          />
          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email field */}
        <div
          className={cn("flex flex-col gap-1.5")}
          data-invalid={errors.email ? true : undefined}
        >
          <Label
            htmlFor="email"
            className={cn(
              "text-sm font-medium",
              errors.email && "text-destructive"
            )}
          >
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              errors.email ? "email-error" : "email-description"
            }
            placeholder="jane@example.com"
            className={cn(
              errors.email &&
                "border-destructive ring-destructive focus-visible:ring-destructive"
            )}
            {...register("email")}
          />
          {!errors.email && (
            <p id="email-description" className="text-xs text-muted-foreground">
              We'll never share your email with anyone else.
            </p>
          )}
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Bio field */}
        <div
          className={cn("flex flex-col gap-1.5")}
          data-invalid={errors.bio ? true : undefined}
        >
          <Label
            htmlFor="bio"
            className={cn(
              "text-sm font-medium",
              errors.bio && "text-destructive"
            )}
          >
            Bio
          </Label>
          <textarea
            id="bio"
            rows={4}
            aria-invalid={errors.bio ? true : undefined}
            aria-describedby={errors.bio ? "bio-error" : "bio-description"}
            placeholder="Tell us a little about yourself…"
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              errors.bio &&
                "border-destructive ring-2 ring-destructive focus-visible:ring-destructive"
            )}
            {...register("bio")}
          />
          {!errors.bio && (
            <p id="bio-description" className="text-xs text-muted-foreground">
              Maximum 500 characters.
            </p>
          )}
          {errors.bio && (
            <p
              id="bio-error"
              role="alert"
              className="text-xs text-destructive"
            >
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
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