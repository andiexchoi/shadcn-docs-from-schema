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
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
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

export function ProfileEditForm({
  defaultValues,
  onSubmit,
  className,
}: ProfileEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      bio: defaultValues?.bio ?? "",
    },
  });

  const handleFormSubmit = async (values: ProfileFormValues) => {
    if (onSubmit) {
      await onSubmit(values);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm",
        className
      )}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Edit Profile</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your personal information below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="space-y-5"
      >
        {/* Name Field */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(
              "w-full",
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

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(
              "w-full",
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

        {/* Bio Field */}
        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Bio
          </Label>
          <div className="relative">
            <textarea
              id="bio"
              placeholder="Tell us a little about yourself…"
              rows={4}
              aria-describedby={
                errors.bio ? "bio-error" : "bio-hint"
              }
              className={cn(
                "flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                errors.bio &&
                  "border-red-400 focus-visible:ring-red-400"
              )}
              {...register("bio")}
            />
          </div>
          {errors.bio ? (
            <p id="bio-error" className="text-xs text-red-500" role="alert">
              {errors.bio.message}
            </p>
          ) : (
            <p id="bio-hint" className="text-xs text-gray-400">
              Maximum 500 characters.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting || !isDirty}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
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
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
                  />
                </svg>
                Saving…
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}