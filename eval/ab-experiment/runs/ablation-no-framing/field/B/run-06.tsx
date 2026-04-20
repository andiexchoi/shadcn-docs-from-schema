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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile saved:", data);
  }

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Edit profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information below.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-6"
      >
        {/* Name field */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="name"
            className={cn(errors.name && "text-destructive")}
          >
            Full name <span aria-hidden="true" className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : "name-description"}
            placeholder="Jane Smith"
            {...register("name")}
            className={cn(
              errors.name &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.name ? (
            <FieldError message={errors.name.message} />
          ) : (
            <FieldDescription>
              Your publicly displayed name.
            </FieldDescription>
          )}
        </div>

        {/* Email field */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="email"
            className={cn(errors.email && "text-destructive")}
          >
            Email address <span aria-hidden="true" className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? "email-error" : "email-description"
            }
            placeholder="jane@example.com"
            {...register("email")}
            className={cn(
              errors.email &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.email ? (
            <FieldError message={errors.email.message} />
          ) : (
            <FieldDescription>
              We'll use this address to contact you.
            </FieldDescription>
          )}
        </div>

        {/* Bio field */}
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
            autoComplete="off"
            aria-invalid={!!errors.bio}
            aria-describedby={errors.bio ? "bio-error" : "bio-description"}
            placeholder="Tell us a little about yourself…"
            {...register("bio")}
            className={cn(
              "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y",
              errors.bio &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.bio ? (
            <FieldError message={errors.bio.message} />
          ) : (
            <FieldDescription>
              Up to 500 characters. Shown on your public profile.
            </FieldDescription>
          )}
        </div>

        {/* Success banner */}
        {isSubmitSuccessful && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800"
          >
            Your profile has been saved successfully.
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
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
  );
}