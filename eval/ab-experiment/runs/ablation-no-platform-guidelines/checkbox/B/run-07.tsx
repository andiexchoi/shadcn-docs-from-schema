"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox wrapper built on the Radix primitive
// ---------------------------------------------------------------------------

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  className?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={checked}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {checked === "indeterminate" ? (
        <Minus className="h-3 w-3" />
      ) : (
        <Check className="h-3 w-3" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field / FieldLabel helpers for proper layout + a11y
// ---------------------------------------------------------------------------

function Field({
  className,
  "data-disabled": dataDisabled,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { "data-disabled"?: boolean }) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-disabled={dataDisabled || undefined}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Permission types
// ---------------------------------------------------------------------------

type PermissionKey = "read" | "write" | "delete";

const PERMISSIONS: { key: PermissionKey; label: string }[] = [
  { key: "read", label: "Read" },
  { key: "write", label: "Write" },
  { key: "delete", label: "Delete" },
];

// ---------------------------------------------------------------------------
// PermissionsPanel
// ---------------------------------------------------------------------------

export default function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<
    Record<PermissionKey, boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const checkedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;

  const masterChecked: boolean | "indeterminate" =
    checkedCount === 0 ? false : checkedCount === total ? true : "indeterminate";

  function handleMasterChange(value: boolean | "indeterminate") {
    const next = value === true;
    setPermissions({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(key: PermissionKey, value: boolean | "indeterminate") {
    setPermissions((prev) => ({ ...prev, [key]: value === true }));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-md space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-base font-semibold text-card-foreground">
            Permissions
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Choose what actions are allowed.
          </p>
        </div>

        {/* Divider */}
        <hr className="border-border" />

        {/* Master — Select all */}
        <Field>
          <Checkbox
            id="select-all"
            checked={masterChecked}
            onCheckedChange={handleMasterChange}
          />
          <FieldLabel
            htmlFor="select-all"
            className="font-semibold text-card-foreground cursor-pointer"
          >
            Select all
          </FieldLabel>
        </Field>

        {/* Divider */}
        <hr className="border-border" />

        {/* Individual permissions */}
        <div className="space-y-3 pl-2">
          {PERMISSIONS.map(({ key, label }) => (
            <Field key={key}>
              <Checkbox
                id={key}
                checked={permissions[key]}
                onCheckedChange={(value) => handlePermissionChange(key, value)}
              />
              <FieldLabel
                htmlFor={key}
                className="cursor-pointer text-card-foreground"
              >
                {label}
              </FieldLabel>
            </Field>
          ))}
        </div>

        {/* Footer summary */}
        <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
          {checkedCount === 0
            ? "No permissions selected."
            : checkedCount === total
            ? "All permissions granted."
            : `${checkedCount} of ${total} permission${checkedCount > 1 ? "s" : ""} selected.`}
        </div>
      </div>
    </div>
  );
}