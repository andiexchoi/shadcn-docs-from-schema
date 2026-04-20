"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox wrapper (mirrors shadcn/ui style)
// ---------------------------------------------------------------------------

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
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
        className="flex items-center justify-center text-current"
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
// Field / FieldLabel helpers (lightweight, no shadcn wrapper required)
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
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
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

export default function PermissionsPanel() {
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const selectedValues = Object.values(selected);
  const selectedCount = selectedValues.filter(Boolean).length;
  const allSelected = selectedCount === PERMISSIONS.length;
  const someSelected = selectedCount > 0 && !allSelected;

  function handleSelectAll() {
    const next = !allSelected;
    setSelected({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(id: Permission, value: boolean) {
    setSelected((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <h2 className="mb-1 text-base font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Choose which actions are allowed.
      </p>

      {/* Select all */}
      <Field
        className="mb-4 rounded-lg bg-muted/50 px-3 py-2.5"
        data-disabled={undefined}
      >
        <Checkbox
          id="select-all"
          indeterminate={someSelected}
          checked={allSelected}
          onCheckedChange={handleSelectAll}
          aria-label="Select all permissions"
        />
        <FieldLabel
          htmlFor="select-all"
          className="cursor-pointer font-semibold text-card-foreground"
        >
          Select all
        </FieldLabel>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {selectedCount} / {PERMISSIONS.length}
        </span>
      </Field>

      {/* Divider */}
      <div className="mb-4 h-px bg-border" />

      {/* Individual permissions */}
      <div className="flex flex-col gap-3">
        {PERMISSIONS.map(({ id, label }) => (
          <Field key={id}>
            <Checkbox
              id={id}
              checked={selected[id]}
              onCheckedChange={(checked) =>
                handlePermissionChange(id, checked === true)
              }
            />
            <FieldLabel
              htmlFor={id}
              className="cursor-pointer text-card-foreground"
            >
              {label}
            </FieldLabel>
          </Field>
        ))}
      </div>
    </div>
  );
}