"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox primitive (no shadcn wrapper installed)
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
        {resolvedChecked === "indeterminate" ? (
          <Minus className="h-3 w-3" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field helpers (lightweight wrappers for layout + label association)
// ---------------------------------------------------------------------------

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3",
      "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
      className
    )}
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
  { id: "read", label: "Read", description: "View existing content and data" },
  { id: "write", label: "Write", description: "Create and edit content" },
  { id: "delete", label: "Delete", description: "Permanently remove content" },
];

export function PermissionsPanel() {
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allSelected = selectedCount === total;
  const someSelected = selectedCount > 0 && selectedCount < total;

  const handleSelectAll = () => {
    const next = !allSelected;
    setSelected({ read: next, write: next, delete: next });
  };

  const handlePermission = (id: Permission, value: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-base font-semibold tracking-tight">Permissions</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Control what actions are allowed for this role.
        </p>
      </div>

      {/* Select all row */}
      <div className="border-b border-border bg-muted/40 px-6 py-4">
        <Field>
          <Checkbox
            id="select-all"
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all permissions"
          />
          <div className="flex flex-col gap-0.5">
            <FieldLabel htmlFor="select-all" className="font-semibold">
              Select all
            </FieldLabel>
            <p className="text-xs text-muted-foreground">
              {selectedCount} of {total} permissions enabled
            </p>
          </div>
        </Field>
      </div>

      {/* Individual permissions */}
      <ul className="divide-y divide-border px-6" role="group" aria-label="Individual permissions">
        {PERMISSIONS.map(({ id, label, description }) => (
          <li key={id} className="py-4">
            <Field>
              <Checkbox
                id={id}
                checked={selected[id]}
                onCheckedChange={(value) =>
                  handlePermission(id, value === true)
                }
              />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </Field>
          </li>
        ))}
      </ul>

      {/* Footer status */}
      <div className="rounded-b-xl border-t border-border bg-muted/40 px-6 py-3">
        <p className="text-xs text-muted-foreground">
          {allSelected
            ? "All permissions granted."
            : someSelected
            ? `${selectedCount} permission${selectedCount !== 1 ? "s" : ""} granted.`
            : "No permissions granted."}
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;