"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox primitive (mirrors shadcn/ui style)
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
        "peer h-5 w-5 shrink-0 rounded-sm border border-primary shadow",
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
          <Minus className="h-3.5 w-3.5" strokeWidth={3} />
        ) : (
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

function Field({
  children,
  className,
  disabled,
  invalid,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
}) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
    >
      {children}
    </div>
  );
}

function FieldLabel({
  htmlFor,
  children,
  className,
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
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

const PERMISSIONS: { key: PermissionKey; label: string; description: string }[] =
  [
    { key: "read", label: "Read", description: "View resources and their contents" },
    { key: "write", label: "Write", description: "Create and modify resources" },
    { key: "delete", label: "Delete", description: "Permanently remove resources" },
  ];

type PermissionsState = Record<PermissionKey, boolean>;

const DEFAULT_STATE: PermissionsState = {
  read: false,
  write: false,
  delete: false,
};

export function PermissionsPanel() {
  const [permissions, setPermissions] =
    React.useState<PermissionsState>(DEFAULT_STATE);

  const checkedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allSelected = checkedCount === total;
  const noneSelected = checkedCount === 0;
  const isIndeterminate = !allSelected && !noneSelected;

  function handleSelectAll() {
    const next = !allSelected;
    setPermissions({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(key: PermissionKey, value: boolean) {
    setPermissions((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold tracking-tight">Permissions</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Control what actions are allowed for this role.
        </p>
      </div>

      {/* Select all row */}
      <div className="px-6 py-4 border-b border-border bg-muted/40">
        <Field>
          <Checkbox
            id="select-all"
            indeterminate={isIndeterminate}
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all permissions"
          />
          <div className="flex flex-col gap-0.5">
            <FieldLabel
              htmlFor="select-all"
              className="text-sm font-semibold"
            >
              Select all
            </FieldLabel>
            <span className="text-xs text-muted-foreground">
              {noneSelected
                ? "No permissions selected"
                : allSelected
                ? "All permissions selected"
                : `${checkedCount} of ${total} permissions selected`}
            </span>
          </div>
        </Field>
      </div>

      {/* Individual permissions */}
      <ul className="divide-y divide-border" role="list">
        {PERMISSIONS.map(({ key, label, description }) => (
          <li key={key} className="px-6 py-4">
            <Field>
              <Checkbox
                id={`permission-${key}`}
                checked={permissions[key]}
                onCheckedChange={(value) =>
                  handlePermissionChange(key, value === true)
                }
              />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor={`permission-${key}`}>{label}</FieldLabel>
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              </div>
            </Field>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border bg-muted/40 rounded-b-xl">
        <p className="text-xs text-muted-foreground">
          Changes take effect immediately upon saving your role configuration.
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;