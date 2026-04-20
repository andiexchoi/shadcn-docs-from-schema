"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required.")
    .max(100, "Full name must be 100 characters or fewer."),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Email must include @ and a valid domain."),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or fewer.")
    .optional()
    .default(""),
});

type ProfileValues = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Textarea (inline, no separate file needed)
// ---------------------------------------------------------------------------

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={4}
    className={cn(
      "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// ---------------------------------------------------------------------------
// ProfileEditForm
// ---------------------------------------------------------------------------

export function ProfileEditForm() {
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", bio: "" },
  });

  const bioValue = watch("bio") ?? "";

  async function onSubmit(values: ProfileValues) {
    // Simulate a network request.
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Saved profile:", values);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-lg space-y-6"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Edit profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your public profile information.
        </p>
      </div>

      <FieldGroup>
        {/* Name */}
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">
            Full name <span aria-hidden="true">(required)</span>
          </FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Jane Smith"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name ? (
            <FieldError id="name-error" errors={[errors.name.message ?? ""]} />
          ) : null}
        </Field>

        {/* Email */}
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">
            Email address <span aria-hidden="true">(required)</span>
          </FieldLabel>
          <FieldDescription>
            We&#39;ll use this address for account notifications.
          </FieldDescription>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={
              [
                "email-description",
                errors.email ? "email-error" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...register("email")}
          />
          {errors.email ? (
            <FieldError
              id="email-error"
              errors={[errors.email.message ?? ""]}
            />
          ) : null}
        </Field>

        {/* Bio */}
        <Field data-invalid={!!errors.bio}>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <FieldDescription id="bio-description">
            Write a short description about yourself. Visible on your public
            profile.
          </FieldDescription>
          <Textarea
            id="bio"
            placeholder="Tell us a little about yourself…"
            aria-invalid={!!errors.bio}
            aria-describedby={
              [
                "bio-description",
                errors.bio ? "bio-error" : "",
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            {...register("bio")}
          />
          <div className="flex items-center justify-between">
            {errors.bio ? (
              <FieldError
                id="bio-error"
                errors={[errors.bio.message ?? ""]}
              />
            ) : (
              <span />
            )}
            <p
              className={cn(
                "ml-auto text-xs tabular-nums",
                bioValue.length > 270
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
              aria-live="polite"
            >
              {bioValue.length}/300
            </p>
          </div>
        </Field>
      </FieldGroup>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>

        {saved ? (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Saved
          </span>
        ) : null}
      </div>
    </form>
  );
}
