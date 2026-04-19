"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox primitive (no separate shadcn wrapper installed)
// ---------------------------------------------------------------------------

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, checked, ...props }, ref) => {
  const resolvedChecked = indeterminate ? "indeterminate" : checked;

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={resolvedChecked}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
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
        {resolvedChecked === "indeterminate" ? (
          <Minus className="h-3 w-3" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field / FieldLabel helpers
// ---------------------------------------------------------------------------

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-row items-center gap-2",
      "data-[disabled]:opacity-50",
      className
    )}
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
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none",
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

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

  const checkedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allChecked = checkedCount === total;
  const someChecked = checkedCount > 0 && checkedCount < total;

  const handleSelectAll = (value: CheckboxPrimitive.CheckedState) => {
    const next = value === true;
    setPermissions({ read: next, write: next, delete: next });
  };

  const handlePermission = (key: PermissionKey) => (value: CheckboxPrimitive.CheckedState) => {
    setPermissions((prev) => ({ ...prev, [key]: value === true }));
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-card-foreground">
          Permissions
        </h2>
        <p className="text-sm text-muted-foreground">
          Control what actions are allowed.
        </p>
      </div>

      {/* Divider */}
      <hr className="border-border" />

      {/* Select all */}
      <Field>
        <Checkbox
          id="select-all"
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={handleSelectAll}
          aria-label="Select all permissions"
        />
        <FieldLabel htmlFor="select-all" className="font-semibold text-card-foreground">
          Select all
        </FieldLabel>
      </Field>

      {/* Divider */}
      <hr className="border-border" />

      {/* Individual permissions */}
      <div className="space-y-4 pl-1">
        {PERMISSIONS.map(({ key, label }) => (
          <Field key={key}>
            <Checkbox
              id={`permission-${key}`}
              checked={permissions[key]}
              onCheckedChange={handlePermission(key)}
            />
            <FieldLabel htmlFor={`permission-${key}`} className="text-card-foreground">
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
  );
}

export default PermissionsPanel;