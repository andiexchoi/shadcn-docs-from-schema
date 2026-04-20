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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm font-medium text-destructive mt-1">
      {message}
    </p>
  );
}

function FieldDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground mt-1">{children}</p>
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
    // Simulate an async save operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile saved:", data);
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
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
          className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
        >
          Your profile has been saved successfully.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        {/* Name field */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="name"
            className={cn(errors.name && "text-destructive")}
          >
            Full name{" "}
            <span className="text-muted-foreground font-normal">(required)</span>
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(
              errors.name &&
                "border-destructive ring-destructive focus-visible:ring-destructive"
            )}
            {...register("name")}
          />
          {errors.name ? (
            <FieldError message={errors.name.message} />
          ) : (
            <FieldDescription>
              Enter the name others will see on your profile.
            </FieldDescription>
          )}
        </div>

        {/* Email field */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor="email"
            className={cn(errors.email && "text-destructive")}
          >
            Email address{" "}
            <span className="text-muted-foreground font-normal">(required)</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(
              errors.email &&
                "border-destructive ring-destructive focus-visible:ring-destructive"
            )}
            {...register("email")}
          />
          {errors.email ? (
            <FieldError message={errors.email.message} />
          ) : (
            <FieldDescription>
              We&apos;ll use this address to contact you.
            </FieldDescription>
          )}
        </div>

        {/* Bio field */}
        <div className="flex flex-col gap-1">
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
            aria-describedby={errors.bio ? "bio-error" : "bio-description"}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "resize-none",
              errors.bio &&
                "border-destructive ring-destructive focus-visible:ring-destructive"
            )}
            placeholder="Tell us a little about yourself…"
            {...register("bio")}
          />
          {errors.bio ? (
            <FieldError message={errors.bio.message} />
          ) : (
            <p
              id="bio-description"
              className="text-sm text-muted-foreground mt-1"
            >
              Up to 500 characters. This will appear on your public profile.
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