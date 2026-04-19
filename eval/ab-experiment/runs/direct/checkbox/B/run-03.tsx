"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Local Checkbox wrapper ─────────────────────────────────────── */

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
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {resolvedChecked === "indeterminate" ? (
          <Minus className="h-3.5 w-3.5" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";

/* ─── Field primitives ───────────────────────────────────────────── */

function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  htmlFor,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
}

/* ─── Permission row ─────────────────────────────────────────────── */

interface PermissionRowProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function PermissionRow({ id, label, checked, onCheckedChange }: PermissionRowProps) {
  return (
    <Field>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
    </Field>
  );
}

/* ─── Permissions panel ──────────────────────────────────────────── */

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string }[] = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

export default function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const checkedCount = Object.values(permissions).filter(Boolean).length;
  const allChecked = checkedCount === PERMISSIONS.length;
  const someChecked = checkedCount > 0 && !allChecked;

  function handleSelectAll(checked: boolean) {
    setPermissions({ read: checked, write: checked, delete: checked });
  }

  function handlePermission(id: Permission, checked: boolean) {
    setPermissions((prev) => ({ ...prev, [id]: checked }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold tracking-tight">Permissions</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Control what actions are allowed
        </p>
      </div>

      {/* Select all row */}
      <div className="px-6 py-4 border-b border-border bg-muted/40">
        <Field>
          <Checkbox
            id="select-all"
            checked={allChecked}
            indeterminate={someChecked}
            onCheckedChange={(value) => handleSelectAll(value === true)}
          />
          <FieldLabel htmlFor="select-all" className="font-semibold text-sm">
            Select all
          </FieldLabel>
        </Field>
      </div>

      {/* Individual permission rows */}
      <div className="px-6 py-4 flex flex-col gap-4">
        {PERMISSIONS.map(({ id, label }) => (
          <PermissionRow
            key={id}
            id={id}
            label={label}
            checked={permissions[id]}
            onCheckedChange={(checked) => handlePermission(id, checked)}
          />
        ))}
      </div>

      {/* Footer summary */}
      <div className="px-6 py-3 border-t border-border bg-muted/40 rounded-b-xl">
        <p className="text-xs text-muted-foreground">
          {checkedCount === 0
            ? "No permissions selected"
            : checkedCount === PERMISSIONS.length
            ? "All permissions granted"
            : `${checkedCount} of ${PERMISSIONS.length} permissions selected`}
        </p>
      </div>
    </div>
  );
}