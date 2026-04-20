"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Minimal local Checkbox built on Radix primitives
// (no components/ui/checkbox.tsx exists in this project)
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
          <Minus className="h-3 w-3" aria-hidden="true" />
        ) : (
          <Check className="h-3 w-3" aria-hidden="true" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field / FieldLabel helpers (inline, no shadcn wrapper)
// ---------------------------------------------------------------------------

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-disabled"?: boolean | string;
  "data-invalid"?: boolean | string;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
);
Field.displayName = "Field";

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none select-none",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

// ---------------------------------------------------------------------------
// Permissions panel
// ---------------------------------------------------------------------------

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string }[] = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

export function PermissionsPanel() {
  const [checked, setChecked] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allChecked = checkedCount === total;
  const someChecked = checkedCount > 0 && checkedCount < total;

  function handleSelectAll() {
    const next = !allChecked;
    setChecked({ read: next, write: next, delete: next });
  }

  function handlePermission(id: Permission, value: boolean) {
    setChecked((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Choose what actions are allowed for this role.
      </p>

      {/* Select all */}
      <div className="mb-4 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
        <Field>
          <Checkbox
            id="select-all"
            indeterminate={someChecked}
            checked={allChecked}
            onCheckedChange={handleSelectAll}
            aria-label="Select all permissions"
          />
          <FieldLabel htmlFor="select-all" className="font-semibold">
            Select all
          </FieldLabel>
        </Field>
      </div>

      {/* Individual permissions */}
      <div className="flex flex-col gap-3 pl-1">
        {PERMISSIONS.map(({ id, label }) => (
          <Field key={id}>
            <Checkbox
              id={id}
              checked={checked[id]}
              onCheckedChange={(val) => handlePermission(id, val === true)}
            />
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
          </Field>
        ))}
      </div>

      {/* Status summary */}
      <p className="mt-5 text-xs text-muted-foreground" aria-live="polite">
        {checkedCount === 0
          ? "No permissions selected."
          : checkedCount === total
          ? "All permissions granted."
          : `${checkedCount} of ${total} permissions selected.`}
      </p>
    </div>
  );
}

export default PermissionsPanel;