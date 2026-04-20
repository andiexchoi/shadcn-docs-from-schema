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
>(({ className, indeterminate, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={indeterminate ? "indeterminate" : props.checked}
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
// Field / FieldLabel helpers (satisfies the aria contract from the docs)
// ---------------------------------------------------------------------------

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    "data-disabled"?: boolean | string;
    "data-invalid"?: boolean | string;
  }
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2", className)} {...props} />
));
Field.displayName = "Field";

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none cursor-pointer",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
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
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const allChecked = Object.values(selected).every(Boolean);
  const noneChecked = Object.values(selected).every((v) => !v);
  const isIndeterminate = !allChecked && !noneChecked;

  function handleSelectAll(checked: boolean | "indeterminate") {
    const next = checked === true;
    setSelected({ read: next, write: next, delete: next });
  }

  function handlePermission(id: Permission) {
    return (checked: boolean | "indeterminate") => {
      setSelected((prev) => ({ ...prev, [id]: checked === true }));
    };
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <h2 className="mb-1 text-base font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Choose what actions are allowed.
      </p>

      {/* Select all */}
      <Field className="mb-4 pb-4 border-b border-border">
        <Checkbox
          id="select-all"
          checked={allChecked}
          indeterminate={isIndeterminate}
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
        {PERMISSIONS.map(({ id, label }) => (
          <Field key={id}>
            <Checkbox
              id={id}
              checked={selected[id]}
              onCheckedChange={handlePermission(id)}
            />
            <FieldLabel htmlFor={id} className="text-card-foreground">
              {label}
            </FieldLabel>
          </Field>
        ))}
      </div>

      {/* Summary badge */}
      <div className="mt-6 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
        {noneChecked ? (
          <span>No permissions selected.</span>
        ) : allChecked ? (
          <span>All permissions granted.</span>
        ) : (
          <span>
            Selected:{" "}
            <span className="font-medium text-foreground">
              {PERMISSIONS.filter(({ id }) => selected[id])
                .map(({ label }) => label)
                .join(", ")}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

export default PermissionsPanel;