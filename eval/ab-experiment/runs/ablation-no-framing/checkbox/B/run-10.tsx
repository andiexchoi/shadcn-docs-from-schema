"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Minimal local Checkbox built directly from the Radix primitive so we can
// support the indeterminate visual state that the shadcn wrapper may not expose.
// ---------------------------------------------------------------------------

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={indeterminate ? "indeterminate" : props.checked}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {indeterminate ? (
        <Minus className="h-3 w-3" aria-hidden="true" />
      ) : (
        <Check className="h-3 w-3" aria-hidden="true" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field helpers — lightweight wrappers matching the component library contract
// ---------------------------------------------------------------------------

function Field({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>{children}</div>
  );
}

function FieldLabel({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
    >
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Permissions panel
// ---------------------------------------------------------------------------

type PermissionKey = "read" | "write" | "delete";

const PERMISSIONS: { key: PermissionKey; label: string }[] = [
  { key: "read", label: "Read" },
  { key: "write", label: "Write" },
  { key: "delete", label: "Delete" },
];

export function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<
    Record<PermissionKey, boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const values = Object.values(permissions);
  const checkedCount = values.filter(Boolean).length;
  const allChecked = checkedCount === values.length;
  const someChecked = checkedCount > 0 && !allChecked;

  function handleSelectAll() {
    const next = !allChecked;
    setPermissions({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(key: PermissionKey, checked: boolean) {
    setPermissions((prev) => ({ ...prev, [key]: checked }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <h2 className="mb-1 text-base font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Choose what actions are allowed
      </p>

      {/* Select all */}
      <Field className="mb-4 pb-4 border-b border-border">
        <Checkbox
          id="select-all"
          indeterminate={someChecked}
          checked={allChecked}
          onCheckedChange={handleSelectAll}
          aria-label="Select all permissions"
        />
        <FieldLabel
          htmlFor="select-all"
          className="font-semibold text-card-foreground"
        >
          Select all
        </FieldLabel>
      </Field>

      {/* Individual permissions */}
      <div className="flex flex-col gap-3">
        {PERMISSIONS.map(({ key, label }) => (
          <Field key={key}>
            <Checkbox
              id={key}
              checked={permissions[key]}
              onCheckedChange={(checked) =>
                handlePermissionChange(key, checked === true)
              }
            />
            <FieldLabel htmlFor={key}>{label}</FieldLabel>
          </Field>
        ))}
      </div>

      {/* Summary */}
      <p className="mt-5 text-xs text-muted-foreground">
        {checkedCount === 0
          ? "No permissions selected"
          : checkedCount === values.length
          ? "All permissions granted"
          : `${checkedCount} of ${values.length} permissions selected`}
      </p>
    </div>
  );
}

export default PermissionsPanel;