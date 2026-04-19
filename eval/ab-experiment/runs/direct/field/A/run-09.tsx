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
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void | Promise<void>;
  className?: string;
}

export default function ProfileEditForm({
  defaultValues,
  onSubmit,
  className,
}: ProfileEditFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      bio: defaultValues?.bio ?? "",
    },
  });

  const bioValue = watch("bio") ?? "";

  const handleFormSubmit = async (values: ProfileFormValues) => {
    if (onSubmit) {
      await onSubmit(values);
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg mx-auto rounded-2xl border border-border bg-card shadow-sm p-8",
        className
      )}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-card-foreground">
          Edit Profile
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="space-y-6"
      >
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(
              errors.name &&
                "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("name")}
          />
          {errors.name && (
            <p
              id="name-error"
              role="alert"
              className="text-xs text-destructive mt-1"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(
              errors.email &&
                "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="text-xs text-destructive mt-1"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Bio Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            <span
              className={cn(
                "text-xs tabular-nums",
                bioValue.length > 450
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {bioValue.length}/500
            </span>
          </div>
          <textarea
            id="bio"
            placeholder="Tell us a little about yourself…"
            rows={4}
            aria-describedby={errors.bio ? "bio-error" : undefined}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "resize-none transition-colors",
              errors.bio &&
                "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("bio")}
          />
          {errors.bio && (
            <p
              id="bio-error"
              role="alert"
              className="text-xs text-destructive mt-1"
            >
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Success Message */}
        {isSubmitSuccessful && (
          <div
            role="status"
            className="rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700"
          >
            Your profile has been updated successfully.
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
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
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Saving…
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
          <Button
            type="reset"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              /* react-hook-form reset handled via native reset + defaultValues */
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}