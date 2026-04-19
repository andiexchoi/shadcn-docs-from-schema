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

export default function ProfileEditForm({
  defaultValues,
  onSubmit,
  className,
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

  const handleFormSubmit = async (values: ProfileFormValues) => {
    await onSubmit?.(values);
    reset(values);
  };

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your personal information below.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="px-6 py-6 space-y-6"
        >
          {/* Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              {...register("name")}
              className={cn(
                "transition-colors",
                errors.name
                  ? "border-red-400 focus-visible:ring-red-300"
                  : "focus-visible:ring-blue-300"
              )}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
              >
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              className={cn(
                "transition-colors",
                errors.email
                  ? "border-red-400 focus-visible:ring-red-300"
                  : "focus-visible:ring-blue-300"
              )}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-xs text-red-600 flex items-center gap-1 mt-1"
              >
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Bio Field */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio{" "}
              <span className="text-gray-400 font-normal text-xs">
                (optional)
              </span>
            </Label>
            <textarea
              id="bio"
              rows={4}
              placeholder="Tell us a little about yourself…"
              {...register("bio")}
              className={cn(
                "flex w-full rounded-md border bg-background px-3 py-2 text-sm",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "resize-none transition-colors",
                errors.bio
                  ? "border-red-400 focus-visible:ring-red-300"
                  : "border-input focus-visible:ring-blue-300"
              )}
              aria-invalid={!!errors.bio}
              aria-describedby={
                errors.bio ? "bio-error" : "bio-hint"
              }
            />
            <div className="flex items-start justify-between gap-2">
              {errors.bio ? (
                <p
                  id="bio-error"
                  role="alert"
                  className="text-xs text-red-600 flex items-center gap-1"
                >
                  <svg
                    className="w-3.5 h-3.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.bio.message}
                </p>
              ) : (
                <p id="bio-hint" className="text-xs text-gray-400">
                  Max 500 characters.
                </p>
              )}
            </div>
          </div>

          {/* Success Banner */}
          {isSubmitSuccessful && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              Profile updated successfully!
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting || !isDirty}
              className="min-w-[80px]"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
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
          </div>
        </form>
      </div>
    </div>
  );
}