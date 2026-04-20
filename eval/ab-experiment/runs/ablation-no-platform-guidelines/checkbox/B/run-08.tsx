"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox built on the Radix primitive (no shadcn wrapper installed)
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
      "peer h-4 w-4 shrink-0 rounded-sm border border-slate-700 bg-slate-900",
      "ring-offset-slate-950 focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600",
      "data-[state=indeterminate]:bg-indigo-600 data-[state=indeterminate]:border-indigo-600",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      {props.checked === "indeterminate" ? (
        <Minus className="h-3 w-3" strokeWidth={3} />
      ) : (
        <Check className="h-3 w-3" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field + FieldLabel helpers for accessible layout
// ---------------------------------------------------------------------------

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-disabled"?: boolean | string;
  "data-invalid"?: boolean | string;
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

interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none text-slate-200",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
FieldLabel.displayName = "FieldLabel";

// ---------------------------------------------------------------------------
// Permissions data
// ---------------------------------------------------------------------------

type PermissionKey = "read" | "write" | "delete";

const PERMISSIONS: { key: PermissionKey; label: string; description: string }[] =
  [
    { key: "read", label: "Read", description: "View resources and content" },
    {
      key: "write",
      label: "Write",
      description: "Create and edit resources",
    },
    {
      key: "delete",
      label: "Delete",
      description: "Permanently remove resources",
    },
  ];

// ---------------------------------------------------------------------------
// PermissionsPanel
// ---------------------------------------------------------------------------

export function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<
    Record<PermissionKey, boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const allChecked = Object.values(permissions).every(Boolean);
  const someChecked = Object.values(permissions).some(Boolean);
  const masterState: boolean | "indeterminate" =
    allChecked ? true : someChecked ? "indeterminate" : false;

  const handleMasterChange = (checked: boolean | "indeterminate") => {
    const next = checked === true;
    setPermissions({ read: next, write: next, delete: next });
  };

  const handlePermissionChange = (
    key: PermissionKey,
    checked: boolean | "indeterminate"
  ) => {
    setPermissions((prev) => ({ ...prev, [key]: checked === true }));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-100">
            Permissions
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Control what actions are allowed for this role.
          </p>
        </div>

        {/* Select all */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <Field>
            <Checkbox
              id="select-all"
              checked={masterState}
              onCheckedChange={handleMasterChange}
            />
            <FieldLabel htmlFor="select-all" className="font-semibold text-slate-100 cursor-pointer">
              Select all
            </FieldLabel>
          </Field>
        </div>

        {/* Individual permissions */}
        <ul className="divide-y divide-slate-800">
          {PERMISSIONS.map(({ key, label, description }) => (
            <li key={key} className="px-6 py-4 hover:bg-slate-800/30 transition-colors">
              <Field>
                <Checkbox
                  id={key}
                  checked={permissions[key]}
                  onCheckedChange={(checked) =>
                    handlePermissionChange(key, checked)
                  }
                />
                <div className="flex flex-col gap-0.5">
                  <FieldLabel htmlFor={key} className="cursor-pointer">
                    {label}
                  </FieldLabel>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
              </Field>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {Object.values(permissions).filter(Boolean).length} of{" "}
            {PERMISSIONS.length} permissions selected
          </span>
          <button
            type="button"
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              "bg-indigo-600 text-white hover:bg-indigo-500",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ring-offset-slate-900"
            )}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default PermissionsPanel;