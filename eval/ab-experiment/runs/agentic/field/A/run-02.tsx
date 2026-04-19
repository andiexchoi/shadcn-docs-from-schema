"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or fewer"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  bio: z.string().max(500, "Bio must be 500 characters or fewer").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void | Promise<void>;
}

export function ProfileEditForm({ defaultValues, onSubmit }: ProfileEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
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
          autoComplete="name"
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
          autoComplete="email"
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
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us a little about yourself…"
          rows={4}
          aria-describedby={errors.bio ? "bio-error" : undefined}
          {...register("bio")}
        />
        {errors.bio && (
          <p id="bio-error" className="text-sm text-destructive">
            {errors.bio.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
