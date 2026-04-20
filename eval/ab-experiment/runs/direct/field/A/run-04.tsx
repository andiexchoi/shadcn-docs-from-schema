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
    formState: { errors, isSubmitting, isDirty, isSubmitSuccessful },
    watch,
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
        "w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm",
        className
      )}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Edit Profile
        </h2>
        <p className="mt-1 text-sm text-gray-500">
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
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(
              errors.name &&
                "border-red-400 focus-visible:ring-red-400"
            )}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-red-500" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(
              errors.email &&
                "border-red-400 focus-visible:ring-red-400"
            )}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio
            </Label>
            <span
              className={cn(
                "text-xs tabular-nums",
                bioValue.length > 450 ? "text-red-500" : "text-gray-400"
              )}
            >
              {bioValue.length} / 500
            </span>
          </div>
          <textarea
            id="bio"
            rows={4}
            placeholder="Tell us a little about yourself…"
            aria-describedby={errors.bio ? "bio-error" : undefined}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              errors.bio && "border-red-400 focus-visible:ring-red-400"
            )}
            {...register("bio")}
          />
          {errors.bio && (
            <p id="bio-error" className="text-xs text-red-500" role="alert">
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Success message */}
        {isSubmitSuccessful && (
          <p className="rounded-md bg-green-50 px-4 py-2 text-sm text-green-700" role="status">
            Profile updated successfully!
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}