"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── local Checkbox primitive ── */

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-sm border border-slate-300 bg-white shadow-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600",
      "data-[state=indeterminate]:bg-violet-600 data-[state=indeterminate]:border-violet-600",
      "transition-colors",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      {props.checked === "indeterminate" ? (
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      ) : (
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

/* ── Field primitives ── */

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

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-slate-700 select-none cursor-pointer",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

/* ── types ── */

type Permission = "read" | "write" | "delete";

interface PermissionState {
  read: boolean;
  write: boolean;
  delete: boolean;
}

const PERMISSIONS: { key: Permission; label: string; description: string }[] = [
  { key: "read", label: "Read", description: "View resources and their contents" },
  { key: "write", label: "Write", description: "Create and update resources" },
  { key: "delete", label: "Delete", description: "Permanently remove resources" },
];

/* ── PermissionsPanel ── */

export function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<PermissionState>({
    read: false,
    write: false,
    delete: false,
  });

  const checkedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;

  const masterChecked: boolean | "indeterminate" =
    checkedCount === 0 ? false : checkedCount === total ? true : "indeterminate";

  function handleMasterChange(checked: boolean | "indeterminate") {
    const next = checked === true;
    setPermissions({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(key: Permission) {
    return (checked: boolean | "indeterminate") => {
      setPermissions((prev) => ({ ...prev, [key]: checked === true }));
    };
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Permissions</h2>
        <p className="mt-1 text-sm text-slate-500">
          Control what actions are allowed for this role.
        </p>
      </div>

      {/* Select all row */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-none">
        <Field>
          <Checkbox
            id="select-all"
            checked={masterChecked}
            onCheckedChange={handleMasterChange}
          />
          <FieldLabel htmlFor="select-all" className="font-semibold text-slate-800">
            Select all
          </FieldLabel>
          <span className="ml-auto text-xs text-slate-400 tabular-nums">
            {checkedCount} / {total} selected
          </span>
        </Field>
      </div>

      {/* Individual permissions */}
      <ul className="divide-y divide-slate-100">
        {PERMISSIONS.map(({ key, label, description }) => (
          <li key={key} className="px-6 py-4 hover:bg-slate-50 transition-colors">
            <Field>
              <Checkbox
                id={`perm-${key}`}
                checked={permissions[key]}
                onCheckedChange={handlePermissionChange(key)}
              />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor={`perm-${key}`}>{label}</FieldLabel>
                <span className="text-xs text-slate-400 leading-snug">
                  {description}
                </span>
              </div>
              <span
                className={cn(
                  "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
                  permissions[key]
                    ? "bg-violet-100 text-violet-700"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                {permissions[key] ? "On" : "Off"}
              </span>
            </Field>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
        <p className="text-xs text-slate-400">
          Changes to permissions take effect immediately for all users in this role.
        </p>
      </div>
    </div>
  );
}