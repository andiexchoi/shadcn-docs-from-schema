"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox wrapper (no components/ui/checkbox.tsx installed)
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
        "peer h-5 w-5 shrink-0 rounded border border-input shadow-sm ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary",
        "transition-colors",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {resolvedChecked === "indeterminate" ? (
          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field helpers (lightweight, no components/ui/checkbox.tsx dependency)
// ---------------------------------------------------------------------------

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-disabled"?: boolean | string;
  "data-invalid"?: boolean | string;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3", className)}
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
      "text-sm font-medium leading-none select-none cursor-pointer",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

// ---------------------------------------------------------------------------
// Permission items definition
// ---------------------------------------------------------------------------

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string; description: string }[] = [
  { id: "read", label: "Read", description: "View resources and their details" },
  { id: "write", label: "Write", description: "Create and update resources" },
  { id: "delete", label: "Delete", description: "Permanently remove resources" },
];

// ---------------------------------------------------------------------------
// PermissionsPanel
// ---------------------------------------------------------------------------

export function PermissionsPanel() {
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const selectedValues = Object.values(selected);
  const checkedCount = selectedValues.filter(Boolean).length;
  const allChecked = checkedCount === PERMISSIONS.length;
  const someChecked = checkedCount > 0 && !allChecked;

  function handleSelectAll(value: CheckboxPrimitive.CheckedState) {
    const next = value === true;
    setSelected({ read: next, write: next, delete: next });
  }

  function handlePermission(id: Permission) {
    return (value: CheckboxPrimitive.CheckedState) => {
      setSelected((prev) => ({ ...prev, [id]: value === true }));
    };
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-card-foreground">
          Permissions
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage access levels for this resource.
        </p>
      </div>

      {/* Select all row */}
      <div className="px-5 py-4 border-b border-border bg-muted/40">
        <Field>
          <Checkbox
            id="select-all"
            indeterminate={someChecked}
            checked={allChecked}
            onCheckedChange={handleSelectAll}
            aria-label="Select all permissions"
          />
          <FieldLabel htmlFor="select-all" className="font-semibold text-card-foreground">
            Select all
          </FieldLabel>
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {checkedCount}/{PERMISSIONS.length}
          </span>
        </Field>
      </div>

      {/* Individual permissions */}
      <ul className="divide-y divide-border" role="group" aria-label="Individual permissions">
        {PERMISSIONS.map(({ id, label, description }) => (
          <li key={id} className="px-5 py-4">
            <Field>
              <Checkbox
                id={`permission-${id}`}
                checked={selected[id]}
                onCheckedChange={handlePermission(id)}
              />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor={`permission-${id}`} className="text-card-foreground">
                  {label}
                </FieldLabel>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </Field>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border bg-muted/40 rounded-b-xl">
        <p className="text-xs text-muted-foreground">
          {checkedCount === 0
            ? "No permissions selected."
            : allChecked
            ? "All permissions granted."
            : `${checkedCount} of ${PERMISSIONS.length} permissions selected.`}
        </p>
      </div>
    </div>
  );
}