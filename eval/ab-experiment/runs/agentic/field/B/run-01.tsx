"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
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
    .max(300, "Bio must be 300 characters or fewer.")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ProfileEditForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", bio: "" },
  });

  async function onSubmit(values: ProfileFormValues) {
    // Replace with your actual save logic (e.g. a server action or API call).
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Profile saved:", values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Edit profile"
      className="w-full max-w-md space-y-6"
    >
      <FieldGroup>
        {/* Name ---------------------------------------------------------- */}
        <Field {...(errors.name ? { "data-invalid": "" } : {})}>
          <FieldLabel htmlFor="profile-name">
            Full name <span aria-hidden="true">(required)</span>
          </FieldLabel>
          <Input
            id="profile-name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={
              errors.name ? "profile-name-error" : "profile-name-hint"
            }
            {...register("name")}
          />
          {!errors.name && (
            <FieldDescription id="profile-name-hint">
              Enter your full name as you'd like it displayed.
            </FieldDescription>
          )}
          <FieldError
            id="profile-name-error"
            errors={errors.name ? [errors.name.message ?? ""] : []}
          />
        </Field>

        {/* Email --------------------------------------------------------- */}
        <Field {...(errors.email ? { "data-invalid": "" } : {})}>
          <FieldLabel htmlFor="profile-email">
            Email address <span aria-hidden="true">(required)</span>
          </FieldLabel>
          <Input
            id="profile-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              errors.email ? "profile-email-error" : "profile-email-hint"
            }
            {...register("email")}
          />
          {!errors.email && (
            <FieldDescription id="profile-email-hint">
              We'll use this address for account notifications.
            </FieldDescription>
          )}
          <FieldError
            id="profile-email-error"
            errors={errors.email ? [errors.email.message ?? ""] : []}
          />
        </Field>

        {/* Bio ----------------------------------------------------------- */}
        <Field {...(errors.bio ? { "data-invalid": "" } : {})}>
          <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
          <Textarea
            id="profile-bio"
            rows={4}
            aria-invalid={errors.bio ? true : undefined}
            aria-describedby={
              errors.bio ? "profile-bio-error" : "profile-bio-hint"
            }
            {...register("bio")}
          />
          {!errors.bio && (
            <FieldDescription id="profile-bio-hint">
              A short description about yourself — 300 characters max.
            </FieldDescription>
          )}
          <FieldError
            id="profile-bio-error"
            errors={errors.bio ? [errors.bio.message ?? ""] : []}
          />
        </Field>
      </FieldGroup>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
        {isSubmitSuccessful && (
          <p role="status" className="text-sm text-muted-foreground">
            Profile saved.
          </p>
        )}
      </div>
    </form>
  );
}
