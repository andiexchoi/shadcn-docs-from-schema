"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Local Checkbox built on the Radix primitive
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
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
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {props.checked === "indeterminate" ? (
        <Minus className="h-3 w-3" />
      ) : (
        <Check className="h-3 w-3" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

// Field, FieldLabel helpers
function Field({
  className,
  "data-disabled": dataDisabled,
  "data-invalid": dataInvalid,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  "data-disabled"?: boolean | string;
  "data-invalid"?: boolean | string;
}) {
  return (
    <div
      data-disabled={dataDisabled}
      data-invalid={dataInvalid}
      className={cn("flex items-center gap-3", className)}
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
        "text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

// Permission keys
type PermissionKey = "read" | "write" | "delete";

const PERMISSIONS: { key: PermissionKey; label: string; id: string }[] = [
  { key: "read", label: "Read", id: "perm-read" },
  { key: "write", label: "Write", id: "perm-write" },
  { key: "delete", label: "Delete", id: "perm-delete" },
];

type PermissionsState = Record<PermissionKey, boolean>;

export function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<PermissionsState>({
    read: false,
    write: false,
    delete: false,
  });

  const checkedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;

  const masterChecked: CheckboxPrimitive.CheckedState =
    checkedCount === 0
      ? false
      : checkedCount === total
      ? true
      : "indeterminate";

  function handleMasterChange(value: CheckboxPrimitive.CheckedState) {
    const next = value === true;
    setPermissions({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(key: PermissionKey) {
    return (value: CheckboxPrimitive.CheckedState) => {
      setPermissions((prev) => ({ ...prev, [key]: value === true }));
    };
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Choose which actions are allowed.
      </p>

      {/* Master checkbox */}
      <Field className="pb-4 mb-4 border-b border-border">
        <Checkbox
          id="perm-select-all"
          checked={masterChecked}
          onCheckedChange={handleMasterChange}
          aria-label="Select all permissions"
        />
        <FieldLabel
          htmlFor="perm-select-all"
          className="font-semibold text-card-foreground"
        >
          Select all
        </FieldLabel>
      </Field>

      {/* Individual permission checkboxes */}
      <div className="flex flex-col gap-4">
        {PERMISSIONS.map(({ key, label, id }) => (
          <Field key={key}>
            <Checkbox
              id={id}
              checked={permissions[key]}
              onCheckedChange={handlePermissionChange(key)}
            />
            <FieldLabel htmlFor={id} className="text-card-foreground">
              {label}
            </FieldLabel>
          </Field>
        ))}
      </div>

      {/* Summary */}
      <p className="mt-5 text-xs text-muted-foreground">
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