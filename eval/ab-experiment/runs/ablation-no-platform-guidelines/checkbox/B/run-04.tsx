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
  className?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-sm border border-neutral-300 bg-white shadow-sm",
      "ring-offset-white transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900 data-[state=checked]:text-white",
      "data-[state=indeterminate]:bg-neutral-900 data-[state=indeterminate]:border-neutral-900 data-[state=indeterminate]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      {props.checked === "indeterminate" ? (
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      ) : (
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field / FieldLabel helpers
// ---------------------------------------------------------------------------

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-disabled"?: boolean | string;
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
  const noneChecked = checkedCount === 0;
  const masterState: CheckboxPrimitive.CheckedState = allChecked
    ? true
    : noneChecked
    ? false
    : "indeterminate";

  function handleMasterChange(value: CheckboxPrimitive.CheckedState) {
    const next = value === true;
    setChecked({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(id: Permission, value: CheckboxPrimitive.CheckedState) {
    setChecked((prev) => ({ ...prev, [id]: value === true }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100">
        <h2 className="text-base font-semibold text-neutral-900">Permissions</h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Control what actions are allowed.
        </p>
      </div>

      {/* Select all row */}
      <div className="px-5 py-4 border-b border-neutral-100">
        <Field>
          <Checkbox
            id="select-all"
            checked={masterState}
            onCheckedChange={handleMasterChange}
          />
          <FieldLabel
            htmlFor="select-all"
            className="text-sm font-semibold text-neutral-800 cursor-pointer"
          >
            Select all
          </FieldLabel>
        </Field>
      </div>

      {/* Individual permissions */}
      <ul className="px-5 py-3 space-y-3">
        {PERMISSIONS.map(({ id, label }) => (
          <li key={id}>
            <Field>
              <Checkbox
                id={id}
                checked={checked[id]}
                onCheckedChange={(value) => handlePermissionChange(id, value)}
              />
              <FieldLabel
                htmlFor={id}
                className="cursor-pointer text-neutral-700"
              >
                {label}
              </FieldLabel>
            </Field>
          </li>
        ))}
      </ul>

      {/* Footer summary */}
      <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50 rounded-b-xl">
        <p className="text-xs text-neutral-400">
          {checkedCount === 0
            ? "No permissions selected."
            : checkedCount === PERMISSIONS.length
            ? "All permissions granted."
            : `${checkedCount} of ${PERMISSIONS.length} permissions selected.`}
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;