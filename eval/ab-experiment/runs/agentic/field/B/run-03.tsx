"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Field primitives — follow the contracts described in CLAUDE.md exactly.
// ---------------------------------------------------------------------------

/** Stacks multiple Field components with consistent vertical spacing. */
function FieldGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-6", className)} {...props} />;
}

/** Wraps a single control with its label, helper text, and error message. */
function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { "data-invalid"?: "" | undefined }) {
  return (
    <div
      role="group"
      className={cn(
        "flex flex-col gap-1.5",
        // When data-invalid is present, cascade a red ring onto the child input
        // via the [data-invalid] CSS selector baked into the Tailwind class below.
        "[&[data-invalid]_input]:border-destructive [&[data-invalid]_textarea]:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

/** Label for a form control. htmlFor must match the control's id. */
function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <Label
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
}

/** Helper text rendered below the label, above the control. */
function FieldDescription({
  id,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      id={id}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

/** Validation error rendered after the control. Pass an empty array (or omit
 *  errors) once the field is valid so no stale message lingers. */
function FieldError({
  errors,
  id,
  className,
}: {
  errors?: string[];
  id?: string;
  className?: string;
}) {
  if (!errors?.length) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn("text-sm font-medium text-destructive", className)}
    >
      {errors[0]}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const profileSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Email must include @."),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or fewer.")
    .optional()
    .default(""),
});

type ProfileValues = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// ProfileEditForm
// ---------------------------------------------------------------------------

export function ProfileEditForm() {
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", bio: "" },
  });

  function onSubmit(values: ProfileValues) {
    // Replace with your real persistence logic.
    console.log("Saved:", values);
    setSaved(true);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md space-y-8"
    >
      <FieldGroup>
        {/* Name ---------------------------------------------------------- */}
        <Field {...(errors.name ? { "data-invalid": "" } : {})}>
          <FieldLabel htmlFor="profile-name">
            Full name{" "}
            <span className="font-normal text-muted-foreground">(required)</span>
          </FieldLabel>
          <Input
            id="profile-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "profile-name-error" : undefined}
            {...register("name")}
          />
          <FieldError
            id="profile-name-error"
            errors={errors.name ? [errors.name.message ?? ""] : []}
          />
        </Field>

        {/* Email --------------------------------------------------------- */}
        <Field {...(errors.email ? { "data-invalid": "" } : {})}>
          <FieldLabel htmlFor="profile-email">
            Email address{" "}
            <span className="font-normal text-muted-foreground">(required)</span>
          </FieldLabel>
          <FieldDescription id="profile-email-description">
            We'll use this address for account notifications only.
          </FieldDescription>
          <Input
            id="profile-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={[
              "profile-email-description",
              errors.email ? "profile-email-error" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            {...register("email")}
          />
          <FieldError
            id="profile-email-error"
            errors={errors.email ? [errors.email.message ?? ""] : []}
          />
        </Field>

        {/* Bio ----------------------------------------------------------- */}
        <Field {...(errors.bio ? { "data-invalid": "" } : {})}>
          <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
          <FieldDescription id="profile-bio-description">
            Tell us a little about yourself. Maximum 300 characters.
          </FieldDescription>
          <textarea
            id="profile-bio"
            rows={4}
            aria-invalid={!!errors.bio}
            aria-describedby={[
              "profile-bio-description",
              errors.bio ? "profile-bio-error" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            className={cn(
              "flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              errors.bio && "border-destructive",
            )}
            {...register("bio")}
          />
          <FieldError
            id="profile-bio-error"
            errors={errors.bio ? [errors.bio.message ?? ""] : []}
          />
        </Field>
      </FieldGroup>

      {saved && (
        <p className="text-sm text-green-600" role="status">
          Profile saved successfully.
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
