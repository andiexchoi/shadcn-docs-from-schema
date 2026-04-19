"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ProfileEditFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void | Promise<void>;
}

export function ProfileEditForm({
  defaultValues,
  onSubmit,
}: ProfileEditFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      ...defaultValues,
    },
  });

  const bio = watch("bio") ?? "";

  const handleFormSubmit = async (values: ProfileFormValues) => {
    await onSubmit?.(values);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="space-y-6"
    >
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Jane Smith"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">
          Bio{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <textarea
          id="bio"
          rows={4}
          placeholder="Tell us a little about yourself…"
          aria-invalid={!!errors.bio}
          aria-describedby={
            errors.bio ? "bio-error" : "bio-count"
          }
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-hidden focus-visible:ring-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-y min-h-[96px]",
          )}
          {...register("bio")}
        />
        <div className="flex items-start justify-between gap-2">
          {errors.bio ? (
            <p id="bio-error" className="text-sm text-destructive">
              {errors.bio.message}
            </p>
          ) : (
            <span />
          )}
          <p
            id="bio-count"
            aria-live="polite"
            className={cn(
              "ml-auto text-xs tabular-nums",
              bio.length > 500 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {bio.length} / 500
          </p>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
