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
    .min(1, "Email is required.")
    .email("Email must include @."),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer.")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface FieldWrapperProps {
  children: React.ReactNode;
  invalid?: boolean;
  className?: string;
}

function FieldWrapper({ children, invalid, className }: FieldWrapperProps) {
  return (
    <div
      role="group"
      data-invalid={invalid || undefined}
      className={cn("flex flex-col gap-1.5", className)}
    >
      {children}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-sm text-destructive flex items-center gap-1">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 shrink-0"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  );
}

function FieldDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

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
    // Simulate async save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Profile saved:", data);
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-card-foreground">
          Edit Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information below.
        </p>
      </div>

      {isSubmitSuccessful && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
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
        <FieldWrapper invalid={!!errors.name}>
          <Label htmlFor="name">
            Full name{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
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
                "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </FieldWrapper>

        {/* Email */}
        <FieldWrapper invalid={!!errors.email}>
          <Label htmlFor="email">
            Email address{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            placeholder="jane@example.com"
            className={cn(
              errors.email &&
                "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </FieldWrapper>

        {/* Bio */}
        <FieldWrapper invalid={!!errors.bio}>
          <Label htmlFor="bio">Bio</Label>
          <FieldDescription>
            Tell others a little about yourself. Up to 500 characters.
          </FieldDescription>
          <textarea
            id="bio"
            rows={4}
            aria-invalid={!!errors.bio}
            aria-describedby={
              errors.bio ? "bio-error" : "bio-description"
            }
            placeholder="I'm a product designer based in…"
            className={cn(
              "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              errors.bio &&
                "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("bio")}
          />
          <FieldError message={errors.bio?.message} />
        </FieldWrapper>

        <p className="text-xs text-muted-foreground">
          Fields marked with{" "}
          <span className="text-destructive" aria-hidden="true">
            *
          </span>{" "}
          are required.
        </p>

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
            {isSubmitting ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}