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
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-sm text-destructive flex items-center gap-1 mt-1" role="alert">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  );
}

export default function ProfileEditForm() {
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
    // Simulate an async save
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Profile saved:", data);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Edit Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your name, email address, and bio below.
          </p>
        </div>

        {isSubmitSuccessful && (
          <div
            role="status"
            className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
          >
            Your profile has been saved successfully.
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {/* Name */}
          <div
            className="space-y-1"
            data-invalid={!!errors.name || undefined}
            role="group"
          >
            <Label
              htmlFor="name"
              className={cn(
                "text-sm font-medium",
                errors.name && "text-destructive"
              )}
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
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...register("name")}
            />
            {errors.name && (
              <div id="name-error">
                <FieldError message={errors.name.message} />
              </div>
            )}
          </div>

          {/* Email */}
          <div
            className="space-y-1"
            data-invalid={!!errors.email || undefined}
            role="group"
          >
            <Label
              htmlFor="email"
              className={cn(
                "text-sm font-medium",
                errors.email && "text-destructive"
              )}
            >
              Email address{" "}
              <span className="text-muted-foreground font-normal">(required)</span>
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "email-error" : undefined
              }
              className={cn(
                errors.email &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...register("email")}
            />
            {errors.email && (
              <div id="email-error">
                <FieldError message={errors.email.message} />
              </div>
            )}
          </div>

          {/* Bio */}
          <div
            className="space-y-1"
            data-invalid={!!errors.bio || undefined}
            role="group"
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
            <p id="bio-description" className="text-xs text-muted-foreground">
              A short description about yourself. Maximum 500 characters.
            </p>
            <textarea
              id="bio"
              rows={4}
              aria-invalid={!!errors.bio}
              aria-describedby={
                errors.bio ? "bio-error bio-description" : "bio-description"
              }
              className={cn(
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                errors.bio &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...register("bio")}
            />
            {errors.bio && (
              <div id="bio-error">
                <FieldError message={errors.bio.message} />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
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
                "Save changes"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}