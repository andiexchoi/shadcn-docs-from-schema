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
    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Profile saved:", data);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Edit profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information. Changes are saved to your account.
        </p>
      </div>

      {isSubmitSuccessful && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Your profile has been updated successfully.
        </div>
      )}

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
            Full name
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
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
              className="text-xs text-destructive"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email field */}
        <div className="flex flex-col gap-1.5">
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
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              errors.email ? "email-error" : "email-description"
            }
            className={cn(
              errors.email &&
                "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("email")}
          />
          {!errors.email && (
            <p id="email-description" className="text-xs text-muted-foreground">
              We'll never share your email with anyone else.
            </p>
          )}
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

        {/* Bio field */}
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="bio"
            className={cn(errors.bio && "text-destructive")}
          >
            Bio{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <textarea
            id="bio"
            rows={4}
            aria-invalid={errors.bio ? true : undefined}
            aria-describedby={
              errors.bio ? "bio-error" : "bio-description"
            }
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              errors.bio &&
                "border-destructive focus-visible:ring-destructive/30"
            )}
            placeholder="Tell us a little about yourself…"
            {...register("bio")}
          />
          {!errors.bio && (
            <p id="bio-description" className="text-xs text-muted-foreground">
              Up to 500 characters.
            </p>
          )}
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