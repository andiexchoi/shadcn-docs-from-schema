"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Field primitives ────────────────────────────────────────────────────────
// Built to the Field component contract in CLAUDE.md:
//  - FieldLabel receives htmlFor matching the control's id
//  - Field receives data-invalid when the control is invalid
//  - The control itself receives aria-invalid (both must be set together)
//  - FieldError appears after the control
//  - FieldGroup stacks multiple Field components

const FieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-5", className)} {...props} />
));
FieldGroup.displayName = "FieldGroup";

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
));
Field.displayName = "Field";

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
FieldDescription.displayName = "FieldDescription";

interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  errors?: string[];
}

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, errors, ...props }, ref) => {
    if (!errors?.length) return null;
    return (
      <p
        ref={ref}
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium text-destructive",
          className,
        )}
        {...props}
      >
        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {errors[0]}
      </p>
    );
  },
);
FieldError.displayName = "FieldError";

// ─── Textarea (unstyled version not in scaffold; mirror Input styles) ────────

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[96px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
      "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// ─── Validation schema ───────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters long.")
    .max(80, "Full name must be 80 characters or fewer."),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Email address must include an @ symbol and a valid domain."),
  bio: z
    .string()
    .max(160, "Bio must be 160 characters or fewer.")
    .optional()
    .default(""),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ─── Profile edit form ───────────────────────────────────────────────────────

export function ProfileEditForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", bio: "" },
  });

  const bioValue = watch("bio") ?? "";

  async function onSubmit(data: ProfileFormValues) {
    // Simulate a network request
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    console.log("Profile saved:", data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md space-y-8"
    >
      {/* Heading */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Edit profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your public profile information.
        </p>
      </div>

      <FieldGroup>
        {/* ── Name ── */}
        <Field data-invalid={!!errors.name || undefined}>
          <FieldLabel htmlFor="profile-name">
            Full name{" "}
            <span className="font-normal text-muted-foreground">(required)</span>
          </FieldLabel>
          <Input
            id="profile-name"
            type="text"
            autoComplete="name"
            placeholder="Alex Johnson"
            aria-invalid={!!errors.name}
            aria-describedby={
              errors.name
                ? "profile-name-error"
                : "profile-name-description"
            }
            className={cn(
              errors.name &&
                "border-destructive focus-visible:ring-destructive/20",
            )}
            {...register("name")}
          />
          {!errors.name ? (
            <FieldDescription id="profile-name-description">
              This name appears on your public profile page.
            </FieldDescription>
          ) : (
            <FieldError
              id="profile-name-error"
              errors={[errors.name.message!]}
            />
          )}
        </Field>

        {/* ── Email ── */}
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="profile-email">
            Email address{" "}
            <span className="font-normal text-muted-foreground">(required)</span>
          </FieldLabel>
          <Input
            id="profile-email"
            type="email"
            autoComplete="email"
            placeholder="alex@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email
                ? "profile-email-error"
                : "profile-email-description"
            }
            className={cn(
              errors.email &&
                "border-destructive focus-visible:ring-destructive/20",
            )}
            {...register("email")}
          />
          {!errors.email ? (
            <FieldDescription id="profile-email-description">
              Used for account notifications and password resets.
            </FieldDescription>
          ) : (
            <FieldError
              id="profile-email-error"
              errors={[errors.email.message!]}
            />
          )}
        </Field>

        {/* ── Bio ── */}
        <Field data-invalid={!!errors.bio || undefined}>
          <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
          <Textarea
            id="profile-bio"
            rows={4}
            placeholder="Tell people a little about yourself."
            aria-invalid={!!errors.bio}
            aria-describedby={
              errors.bio ? "profile-bio-error" : "profile-bio-description"
            }
            {...register("bio")}
          />
          <div className="flex items-start justify-between gap-4">
            {!errors.bio ? (
              <FieldDescription id="profile-bio-description">
                Appears below your name on your public profile.
              </FieldDescription>
            ) : (
              <FieldError
                id="profile-bio-error"
                errors={[errors.bio.message!]}
              />
            )}
            {/* Character count — informational only, not a11y-critical */}
            <span
              className={cn(
                "shrink-0 text-xs tabular-nums text-muted-foreground",
                bioValue.length > 140 && "text-amber-600",
                bioValue.length > 160 && "text-destructive",
              )}
              aria-hidden="true"
            >
              {bioValue.length}/160
            </span>
          </div>
        </Field>
      </FieldGroup>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
        {isSubmitSuccessful && !isSubmitting && (
          <p className="text-sm text-muted-foreground" role="status">
            Profile saved successfully.
          </p>
        )}
      </div>
    </form>
  );
}
