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
    .min(1, "Enter your full name.")
    .max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address."),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer.")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (values: ProfileFormValues) => {
    if (onSubmit) {
      await onSubmit(values);
    }
    reset(values);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      className="w-full max-w-lg space-y-6"
    >
      <div className="space-y-1.5">
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
          aria-describedby={errors.name ? "name-error" : undefined}
          placeholder="Jane Smith"
          className={cn(
            errors.name &&
              "border-destructive focus-visible:ring-destructive"
          )}
          {...register("name")}
        />
        {errors.name && (
          <p
            id="name-error"
            role="alert"
            className="text-sm font-medium text-destructive"
          >
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
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
          className={cn(
            errors.email &&
              "border-destructive focus-visible:ring-destructive"
          )}
          {...register("email")}
        />
        {!errors.email && (
          <p id="email-description" className="text-sm text-muted-foreground">
            We'll never share your email with anyone else.
          </p>
        )}
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="text-sm font-medium text-destructive"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="bio"
          className={cn(errors.bio && "text-destructive")}
        >
          Bio
        </Label>
        <textarea
          id="bio"
          rows={4}
          aria-invalid={!!errors.bio}
          aria-describedby={
            errors.bio ? "bio-error" : "bio-description"
          }
          placeholder="Tell us a little about yourself."
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none",
            errors.bio &&
              "border-destructive focus-visible:ring-destructive"
          )}
          {...register("bio")}
        />
        {!errors.bio && (
          <p id="bio-description" className="text-sm text-muted-foreground">
            Maximum 500 characters.
          </p>
        )}
        {errors.bio && (
          <p
            id="bio-error"
            role="alert"
            className="text-sm font-medium text-destructive"
          >
            {errors.bio.message}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Fields marked with{" "}
        <span aria-hidden="true" className="text-destructive font-medium">
          *
        </span>{" "}
        are required.
      </p>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || !isDirty}
          onClick={() => reset()}
        >
          Discard
        </Button>
      </div>
    </form>
  );
}