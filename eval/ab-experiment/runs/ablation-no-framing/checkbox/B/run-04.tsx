"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Local Checkbox primitive (no shadcn wrapper installed)
───────────────────────────────────────────── */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    indeterminate?: boolean;
  }
>(({ className, indeterminate, checked, ...props }, ref) => {
  const resolvedChecked = indeterminate ? "indeterminate" : checked;

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={resolvedChecked}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-[4px] border border-slate-300 bg-white ring-offset-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white",
        "data-[state=indeterminate]:bg-slate-900 data-[state=indeterminate]:border-slate-900 data-[state=indeterminate]:text-white",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {resolvedChecked === "indeterminate" ? (
          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";

/* ─────────────────────────────────────────────
   Field helpers (mirrors the component library contract)
───────────────────────────────────────────── */
interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-disabled"?: boolean | string;
  "data-invalid"?: boolean | string;
}

function Field({ className, ...props }: FieldProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 group",
        "[&[data-disabled]]:opacity-50 [&[data-disabled]]:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  htmlFor,
  children,
}: {
  className?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none text-slate-900 select-none cursor-pointer",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
    >
      {children}
    </label>
  );
}

function FieldDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn("text-xs text-slate-500 mt-0.5", className)}>{children}</p>
  );
}

/* ─────────────────────────────────────────────
   Permission types
───────────────────────────────────────────── */
type PermissionKey = "read" | "write" | "delete";

interface Permission {
  key: PermissionKey;
  label: string;
  description: string;
}

const PERMISSIONS: Permission[] = [
  {
    key: "read",
    label: "Read",
    description: "View resources and their contents",
  },
  {
    key: "write",
    label: "Write",
    description: "Create and modify existing resources",
  },
  {
    key: "delete",
    label: "Delete",
    description: "Permanently remove resources",
  },
];

/* ─────────────────────────────────────────────
   PermissionsPanel
───────────────────────────────────────────── */
export function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<Record<PermissionKey, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const checkedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allChecked = checkedCount === total;
  const someChecked = checkedCount > 0 && checkedCount < total;

  function handleSelectAll(value: CheckboxPrimitive.CheckedState) {
    const next = value === true;
    setPermissions({ read: next, write: next, delete: next });
  }

  function handlePermission(key: PermissionKey, value: CheckboxPrimitive.CheckedState) {
    setPermissions((prev) => ({ ...prev, [key]: value === true }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-900">Permissions</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Control what actions are allowed for this role.
        </p>
      </div>

      {/* Select all row */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 rounded-t-none">
        <Field>
          <Checkbox
            id="select-all"
            indeterminate={someChecked}
            checked={allChecked}
            onCheckedChange={handleSelectAll}
          />
          <div className="flex flex-col">
            <FieldLabel htmlFor="select-all" className="font-semibold">
              Select all
            </FieldLabel>
            <FieldDescription>
              {checkedCount === 0
                ? "No permissions selected"
                : allChecked
                ? "All permissions granted"
                : `${checkedCount} of ${total} permissions selected`}
            </FieldDescription>
          </div>
        </Field>
      </div>

      {/* Individual permissions */}
      <ul className="divide-y divide-slate-100">
        {PERMISSIONS.map(({ key, label, description }) => (
          <li key={key} className="px-5 py-4">
            <Field>
              <Checkbox
                id={key}
                checked={permissions[key]}
                onCheckedChange={(value) => handlePermission(key, value)}
              />
              <div className="flex flex-col">
                <FieldLabel htmlFor={key}>{label}</FieldLabel>
                <FieldDescription>{description}</FieldDescription>
              </div>
            </Field>
          </li>
        ))}
      </ul>

      {/* Footer summary */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {checkedCount} of {total} permissions enabled
        </span>
        <div className="flex gap-1.5">
          {PERMISSIONS.map(({ key, label }) => (
            <span
              key={key}
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset transition-colors",
                permissions[key]
                  ? "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-slate-400 ring-slate-200"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PermissionsPanel;