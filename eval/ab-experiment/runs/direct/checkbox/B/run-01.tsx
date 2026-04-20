"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox wrapper (mirrors the shadcn/ui checkbox style)
// ---------------------------------------------------------------------------

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={indeterminate ? "indeterminate" : checked}
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
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {indeterminate ? (
        <Minus className="h-3 w-3" />
      ) : (
        <Check className="h-3 w-3" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field / FieldLabel helpers (lightweight layout wrappers)
// ---------------------------------------------------------------------------

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
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
      "text-sm font-medium leading-none select-none",
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

const PERMISSIONS: { id: Permission; label: string; description: string }[] = [
  {
    id: "read",
    label: "Read",
    description: "View resources and their contents",
  },
  {
    id: "write",
    label: "Write",
    description: "Create and update resources",
  },
  {
    id: "delete",
    label: "Delete",
    description: "Permanently remove resources",
  },
];

export function PermissionsPanel() {
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const allChecked = Object.values(selected).every(Boolean);
  const someChecked = Object.values(selected).some(Boolean);
  const isIndeterminate = someChecked && !allChecked;

  function handleSelectAll() {
    const next = !allChecked;
    setSelected({ read: next, write: next, delete: next });
  }

  function handlePermission(id: Permission, value: boolean) {
    setSelected((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold leading-tight">Permissions</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Control access to this resource
          </p>
        </div>
        <Field>
          <Checkbox
            id="select-all"
            checked={allChecked}
            indeterminate={isIndeterminate}
            onCheckedChange={handleSelectAll}
            aria-label="Select all permissions"
          />
          <FieldLabel
            htmlFor="select-all"
            className="text-xs text-muted-foreground cursor-pointer"
          >
            Select all
          </FieldLabel>
        </Field>
      </div>

      {/* Permission rows */}
      <ul className="divide-y divide-border" role="list">
        {PERMISSIONS.map(({ id, label, description }) => (
          <li key={id} className="flex items-center gap-4 px-5 py-4">
            <Checkbox
              id={id}
              checked={selected[id]}
              onCheckedChange={(value) =>
                handlePermission(id, value === true)
              }
            />
            <div className="flex-1 min-w-0">
              <FieldLabel
                htmlFor={id}
                className="block cursor-pointer font-medium"
              >
                {label}
              </FieldLabel>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {description}
              </p>
            </div>
            {/* Status badge */}
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium leading-none",
                selected[id]
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {selected[id] ? "Enabled" : "Disabled"}
            </span>
          </li>
        ))}
      </ul>

      {/* Footer summary */}
      <div className="border-t border-border px-5 py-3">
        <p className="text-xs text-muted-foreground">
          {someChecked
            ? `${Object.values(selected).filter(Boolean).length} of ${PERMISSIONS.length} permissions enabled`
            : "No permissions enabled"}
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;