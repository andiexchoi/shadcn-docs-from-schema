"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox built directly on the Radix primitive (no shadcn wrapper needed)
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
      "peer h-5 w-5 shrink-0 rounded-sm border border-slate-300 bg-white shadow-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 data-[state=checked]:text-white",
      "data-[state=indeterminate]:bg-indigo-600 data-[state=indeterminate]:border-indigo-600 data-[state=indeterminate]:text-white",
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
// Field + FieldLabel helpers
// ---------------------------------------------------------------------------

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-disabled"?: boolean | string;
  "data-invalid"?: boolean | string;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3", className)}
      {...props}
    />
  )
);
Field.displayName = "Field";

interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
);
FieldLabel.displayName = "FieldLabel";

// ---------------------------------------------------------------------------
// Permissions panel
// ---------------------------------------------------------------------------

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { key: Permission; label: string }[] = [
  { key: "read", label: "Read" },
  { key: "write", label: "Write" },
  { key: "delete", label: "Delete" },
];

export function PermissionsPanel() {
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const total = PERMISSIONS.length;

  const masterChecked: boolean | "indeterminate" =
    selectedCount === total
      ? true
      : selectedCount === 0
      ? false
      : "indeterminate";

  function handleMasterChange(value: boolean | "indeterminate") {
    const next = value === true;
    setSelected({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(key: Permission, value: boolean | "indeterminate") {
    setSelected((prev) => ({ ...prev, [key]: value === true }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">Permissions</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Choose what actions are allowed.
        </p>
      </div>

      {/* Select all row */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 rounded-t-none">
        <Field>
          <Checkbox
            id="select-all"
            checked={masterChecked}
            onCheckedChange={handleMasterChange}
          />
          <FieldLabel
            htmlFor="select-all"
            className="font-semibold text-slate-800"
          >
            Select all
          </FieldLabel>
          <span className="ml-auto text-xs text-slate-400 tabular-nums">
            {selectedCount}/{total} selected
          </span>
        </Field>
      </div>

      {/* Individual permissions */}
      <ul className="divide-y divide-slate-100 px-5">
        {PERMISSIONS.map(({ key, label }) => (
          <li key={key} className="py-3.5">
            <Field>
              <Checkbox
                id={`perm-${key}`}
                checked={selected[key]}
                onCheckedChange={(val) => handlePermissionChange(key, val)}
              />
              <FieldLabel htmlFor={`perm-${key}`} className="text-slate-700">
                {label}
              </FieldLabel>
              {/* optional badge */}
              <span
                className={cn(
                  "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  selected[key]
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {selected[key] ? "Enabled" : "Disabled"}
              </span>
            </Field>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="border-t border-slate-200 px-5 py-3 bg-slate-50 rounded-b-xl">
        <p className="text-xs text-slate-400">
          Changes apply immediately to this session.
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;