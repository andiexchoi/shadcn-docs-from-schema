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
    .min(1, "Email address is required.")
    .email("Enter a valid email address."),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer.")
    .optional()
    .or(z.literal("")),
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
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (values: ProfileFormValues) => {
    await onSubmit?.(values);
    reset(values);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Edit Profile
        </h1>
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
            Full name
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            placeholder="Jane Smith"
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
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="jane@example.com"
            className={cn(
              errors.email &&
                "border-destructive focus-visible:ring-destructive"
            )}
            {...register("email")}
          />
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
              errors.bio ? "bio-error" : "bio-description"
            }
            placeholder="Tell us a little about yourself."
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              errors.bio &&
                "border-destructive focus-visible:ring-destructive"
            )}
            {...register("bio")}
          />
          {!errors.bio && (
            <p
              id="bio-description"
              className="text-xs text-muted-foreground"
            >
              Maximum 500 characters. Displayed publicly on your profile.
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

        {/* Success message */}
        {isSubmitSuccessful && (
          <p
            role="status"
            className="text-sm font-medium text-green-600 dark:text-green-400"
          >
            Profile updated successfully.
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="min-w-[120px]"
          >
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