"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------

const profileSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Email must include @."),
  bio: z
    .string()
    .max(300, "Bio must be 300 characters or fewer."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProfileEditForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", bio: "" },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    // TODO: persist profile changes
    console.log("profile saved", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-lg">
      <FieldGroup>
        {/* ── Name ── */}
        <Field data-invalid={errors.name ? true : undefined}>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            placeholder="Jane Smith"
            {...register("name")}
          />
          <FieldDescription>
            This name appears on your public profile.
          </FieldDescription>
          <FieldError
            errors={errors.name?.message ? [errors.name.message] : []}
          />
        </Field>

        {/* ── Email ── */}
        <Field data-invalid={errors.email ? true : undefined}>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            placeholder="jane@example.com"
            {...register("email")}
          />
          <FieldDescription>
            Used for account notifications and password resets.
          </FieldDescription>
          <FieldError
            errors={errors.email?.message ? [errors.email.message] : []}
          />
        </Field>

        {/* ── Bio ── */}
        <Field data-invalid={errors.bio ? true : undefined}>
          <FieldLabel htmlFor="bio">Bio</FieldLabel>
          <textarea
            id="bio"
            aria-invalid={!!errors.bio}
            placeholder="Tell us a little about yourself."
            className={cn(
              "flex min-h-[100px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-hidden focus-visible:ring-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            {...register("bio")}
          />
          <FieldDescription>
            A short description shown on your profile page. 300 characters max.
          </FieldDescription>
          <FieldError
            errors={errors.bio?.message ? [errors.bio.message] : []}
          />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="mt-6">
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
