"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox built directly on Radix primitives (no shadcn wrapper needed)
// ---------------------------------------------------------------------------

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  className?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded border border-slate-300 bg-white shadow-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white",
      "data-[state=indeterminate]:bg-slate-900 data-[state=indeterminate]:border-slate-900 data-[state=indeterminate]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
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
// Field helpers
// ---------------------------------------------------------------------------

function Field({
  children,
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
      className={cn("flex items-center gap-3", className)}
      data-disabled={dataDisabled}
      data-invalid={dataInvalid}
      {...props}
    >
      {children}
    </div>
  );
}

function FieldLabel({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none text-slate-900",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
    >
      {children}
    </label>
  );
}

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

  const checkedValues = Object.values(checked);
  const allChecked = checkedValues.every(Boolean);
  const noneChecked = checkedValues.every((v) => !v);
  const masterState: CheckboxPrimitive.CheckedState = allChecked
    ? true
    : noneChecked
    ? false
    : "indeterminate";

  function handleMasterChange(next: CheckboxPrimitive.CheckedState) {
    const newValue = next === true;
    setChecked({ read: newValue, write: newValue, delete: newValue });
  }

  function handlePermissionChange(id: Permission, next: CheckboxPrimitive.CheckedState) {
    setChecked((prev) => ({ ...prev, [id]: next === true }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Permissions</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Choose which actions are allowed.
        </p>
      </div>

      {/* Select all */}
      <div className="px-5 py-4 border-b border-slate-100">
        <Field>
          <Checkbox
            id="select-all"
            checked={masterState}
            onCheckedChange={handleMasterChange}
          />
          <FieldLabel htmlFor="select-all" className="font-semibold text-slate-700">
            Select all
          </FieldLabel>
        </Field>
      </div>

      {/* Individual permissions */}
      <ul className="divide-y divide-slate-100">
        {PERMISSIONS.map(({ id, label }) => (
          <li key={id} className="px-5 py-4">
            <Field>
              <Checkbox
                id={id}
                checked={checked[id]}
                onCheckedChange={(next) => handlePermissionChange(id, next)}
              />
              <FieldLabel htmlFor={id}>{label}</FieldLabel>
            </Field>
          </li>
        ))}
      </ul>

      {/* Footer summary */}
      <div className="rounded-b-xl border-t border-slate-100 bg-slate-50 px-5 py-3">
        <p className="text-xs text-slate-500">
          {allChecked
            ? "All permissions granted."
            : noneChecked
            ? "No permissions granted."
            : `${checkedValues.filter(Boolean).length} of ${PERMISSIONS.length} permissions granted.`}
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;