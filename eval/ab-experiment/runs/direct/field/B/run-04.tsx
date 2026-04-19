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
    .email("Email must include @."),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer.")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-sm text-destructive mt-1" role="alert">
      {message}
    </p>
  );
}

export default function ProfileEditForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Profile updated:", data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-background shadow-md border border-border p-8">
        <h1 className="text-2xl font-semibold text-foreground mb-1">
          Edit Profile
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Update your personal information below.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-6"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="name"
              className={cn(errors.name && "text-destructive")}
            >
              Full name{" "}
              <span className="text-muted-foreground font-normal">
                (required)
              </span>
            </Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={cn(
                errors.name &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...register("name")}
            />
            {errors.name && (
              <p
                id="name-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              className={cn(errors.email && "text-destructive")}
            >
              Email address{" "}
              <span className="text-muted-foreground font-normal">
                (required)
              </span>
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
              className={cn(
                errors.email &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...register("email")}
            />
            {!errors.email && (
              <p
                id="email-description"
                className="text-sm text-muted-foreground"
              >
                We'll never share your email with anyone.
              </p>
            )}
            {errors.email && (
              <p
                id="email-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="bio"
              className={cn(errors.bio && "text-destructive")}
            >
              Bio
            </Label>
            <textarea
              id="bio"
              rows={4}
              placeholder="Tell us a little about yourself."
              aria-invalid={!!errors.bio}
              aria-describedby={errors.bio ? "bio-error" : "bio-description"}
              className={cn(
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
                errors.bio &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              {...register("bio")}
            />
            {!errors.bio && (
              <p
                id="bio-description"
                className="text-sm text-muted-foreground"
              >
                Maximum 500 characters.
              </p>
            )}
            {errors.bio && (
              <p
                id="bio-error"
                className="text-sm text-destructive"
                role="alert"
              >
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* Success message */}
          {isSubmitSuccessful && (
            <p
              className="rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3"
              role="status"
            >
              ✓ Your profile has been updated successfully.
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}