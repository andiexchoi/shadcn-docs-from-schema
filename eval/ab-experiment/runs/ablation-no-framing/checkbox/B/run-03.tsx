"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Minimal local Checkbox built directly on Radix (no shadcn wrapper needed)
// ---------------------------------------------------------------------------

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
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
      "peer h-5 w-5 shrink-0 rounded-[4px] border border-input shadow-sm ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
      "aria-invalid:border-destructive",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      {indeterminate ? (
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field / FieldLabel helpers (inline, no external shadcn component)
// ---------------------------------------------------------------------------

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean; invalid?: boolean }
>(({ className, disabled, invalid, ...props }, ref) => (
  <div
    ref={ref}
    data-disabled={disabled ? "" : undefined}
    data-invalid={invalid ? "" : undefined}
    className={cn("flex items-center gap-3", className)}
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
      "text-sm font-medium leading-none select-none cursor-pointer",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      "group-data-[disabled]:opacity-50 group-data-[disabled]:cursor-not-allowed",
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

// ---------------------------------------------------------------------------
// Permissions Panel
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

  const checkedValues = Object.values(checked);
  const allChecked = checkedValues.every(Boolean);
  const someChecked = checkedValues.some(Boolean) && !allChecked;

  const handleSelectAll = () => {
    const next = !allChecked;
    setChecked({ read: next, write: next, delete: next });
  };

  const handlePermission = (id: Permission) => (value: boolean | "indeterminate") => {
    setChecked((prev) => ({ ...prev, [id]: value === true }));
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card text-card-foreground shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold tracking-tight">Permissions</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage access rights for this resource.
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        {/* Select All */}
        <Field>
          <Checkbox
            id="select-all"
            indeterminate={someChecked}
            checked={allChecked}
            onCheckedChange={handleSelectAll}
          />
          <FieldLabel
            htmlFor="select-all"
            className="text-sm font-semibold text-foreground"
          >
            Select all
          </FieldLabel>
        </Field>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Individual permissions */}
        <div className="space-y-4">
          {PERMISSIONS.map(({ id, label }) => (
            <Field key={id}>
              <Checkbox
                id={id}
                checked={checked[id]}
                onCheckedChange={handlePermission(id)}
              />
              <FieldLabel htmlFor={id}>{label}</FieldLabel>
            </Field>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border bg-muted/40 rounded-b-xl">
        <p className="text-xs text-muted-foreground">
          {allChecked
            ? "All permissions granted."
            : someChecked
            ? `${checkedValues.filter(Boolean).length} of ${PERMISSIONS.length} permissions granted.`
            : "No permissions granted."}
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;