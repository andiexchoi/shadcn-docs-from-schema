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
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void | Promise<void>;
  className?: string;
}

export function ProfileEditForm({
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
      name: "",
      email: "",
      bio: "",
      ...defaultValues,
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
        "w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm",
        className
      )}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-card-foreground">
          Edit Profile
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="space-y-5"
      >
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
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

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
            {...register("email")}
          />
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

        {/* Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="bio" className="text-sm font-medium">
              Bio
            </Label>
            <span
              className={cn(
                "text-xs tabular-nums",
                bioValue.length > 480
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {bioValue.length} / 500
            </span>
          </div>
          <textarea
            id="bio"
            rows={4}
            placeholder="Tell us a little about yourself…"
            aria-invalid={!!errors.bio}
            aria-describedby={errors.bio ? "bio-error" : undefined}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              errors.bio && "border-destructive focus-visible:ring-destructive"
            )}
            {...register("bio")}
          />
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

        {/* Success message */}
        {isSubmitSuccessful && (
          <p
            role="status"
            className="rounded-md bg-green-50 px-4 py-2.5 text-sm text-green-700 dark:bg-green-950 dark:text-green-300"
          >
            Profile updated successfully!
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Saving…" : "Save Changes"}
          </Button>
          <Button
            type="reset"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              /* react-hook-form reset is handled by the native reset event */
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}