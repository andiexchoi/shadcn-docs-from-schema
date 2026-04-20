"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Local Checkbox wrapper (no shadcn wrapper installed, so we build our own) */
/* -------------------------------------------------------------------------- */

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
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
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

/* -------------------------------------------------------------------------- */
/*  Field / FieldLabel helpers                                                  */
/* -------------------------------------------------------------------------- */

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    "data-disabled"?: boolean;
    "data-invalid"?: boolean;
  }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
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
      "text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

/* -------------------------------------------------------------------------- */
/*  Permissions Panel                                                           */
/* -------------------------------------------------------------------------- */

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
  const allChecked = checkedCount === PERMISSIONS.length;
  const someChecked = checkedCount > 0 && !allChecked;

  const handleSelectAll = React.useCallback(() => {
    const next = !allChecked;
    setChecked({ read: next, write: next, delete: next });
  }, [allChecked]);

  const handlePermission = React.useCallback(
    (id: Permission) => (value: boolean | "indeterminate") => {
      setChecked((prev) => ({ ...prev, [id]: value === true }));
    },
    []
  );

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-1">
        <h2 className="text-base font-semibold text-card-foreground">
          Permissions
        </h2>
        <p className="text-sm text-muted-foreground">
          Control what actions are allowed.
        </p>
      </div>

      <div className="my-4 h-px bg-border" />

      {/* Select all */}
      <Field className="mb-4">
        <Checkbox
          id="select-all"
          indeterminate={someChecked}
          checked={allChecked}
          onCheckedChange={handleSelectAll}
        />
        <FieldLabel htmlFor="select-all" className="font-semibold">
          Select all
        </FieldLabel>
      </Field>

      {/* Individual permissions */}
      <div className="flex flex-col gap-3 pl-1">
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

      {/* Footer status */}
      <div className="mt-5 rounded-md bg-muted px-3 py-2">
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

export default PermissionsPanel;