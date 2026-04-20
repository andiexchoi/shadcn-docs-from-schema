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
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface FieldWrapperProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}

function FieldWrapper({ id, label, description, error, children }: FieldWrapperProps) {
  return (
    <div
      className={cn("flex flex-col gap-1.5", error && "group/field-invalid")}
      data-invalid={error ? true : undefined}
    >
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium text-foreground",
          error && "text-destructive"
        )}
      >
        {label}
      </Label>
      {description && (
        <p id={`${id}-description`} className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function ProfileEditForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
    },
  });

  const bioValue = watch("bio") ?? "";

  async function onSubmit(data: ProfileFormValues) {
    // Simulate async save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile saved:", data);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Edit Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information below.
        </p>
      </div>

      {isSubmitSuccessful && (
        <div
          role="status"
          className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          Your profile has been saved successfully.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        {/* Name */}
        <FieldWrapper
          id="name"
          label="Full name"
          description="Your display name shown across the platform."
          error={errors.name?.message}
        >
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={
              [
                "name-description",
                errors.name ? "name-error" : undefined,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
            {...register("name")}
          />
        </FieldWrapper>

        {/* Email */}
        <FieldWrapper
          id="email"
          label="Email address"
          description="We'll use this address to send important notifications."
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              [
                "email-description",
                errors.email ? "email-error" : undefined,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
            {...register("email")}
          />
        </FieldWrapper>

        {/* Bio */}
        <FieldWrapper
          id="bio"
          label="Bio"
          description="A short description about yourself. Maximum 500 characters."
          error={errors.bio?.message}
        >
          <div className="relative">
            <textarea
              id="bio"
              rows={4}
              placeholder="Tell us a little about yourself…"
              aria-invalid={errors.bio ? true : undefined}
              aria-describedby={
                [
                  "bio-description",
                  errors.bio ? "bio-error" : undefined,
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              className={cn(
                "flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "resize-none",
                errors.bio && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("bio")}
            />
            <span
              aria-live="polite"
              className={cn(
                "absolute bottom-2 right-3 text-xs tabular-nums",
                bioValue.length > 450
                  ? bioValue.length >= 500
                    ? "text-destructive"
                    : "text-amber-600"
                  : "text-muted-foreground"
              )}
            >
              {bioValue.length}/500
            </span>
          </div>
        </FieldWrapper>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              /* navigate away or reset */
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}