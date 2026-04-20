"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Local Checkbox wrapper (no shadcn/ui checkbox installed) ─── */

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
      "peer h-5 w-5 shrink-0 rounded-sm border border-zinc-300 bg-white shadow-sm",
      "ring-offset-white transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 data-[state=checked]:text-white",
      "data-[state=indeterminate]:bg-zinc-900 data-[state=indeterminate]:border-zinc-900 data-[state=indeterminate]:text-white",
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

/* ─── Field wrapper helpers ─── */

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
  children,
}: {
  className?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none select-none cursor-pointer",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
    >
      {children}
    </label>
  );
}

/* ─── Permissions Panel ─── */

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string; description: string }[] = [
  { id: "read", label: "Read", description: "View resources and their contents." },
  { id: "write", label: "Write", description: "Create and modify resources." },
  { id: "delete", label: "Delete", description: "Permanently remove resources." },
];

export function PermissionsPanel() {
  const [checked, setChecked] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const total = PERMISSIONS.length;

  const masterState: CheckboxPrimitive.CheckedState =
    checkedCount === 0
      ? false
      : checkedCount === total
      ? true
      : "indeterminate";

  function handleMasterChange(value: CheckboxPrimitive.CheckedState) {
    const next = value === true;
    setChecked({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(id: Permission, value: CheckboxPrimitive.CheckedState) {
    setChecked((prev) => ({ ...prev, [id]: value === true }));
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-zinc-200 px-5 py-4">
        <h2 className="text-base font-semibold text-zinc-900">Permissions</h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          Choose which actions are allowed for this role.
        </p>
      </div>

      {/* Select All */}
      <div className="border-b border-zinc-200 px-5 py-4 bg-zinc-50 rounded-t-none">
        <Field>
          <Checkbox
            id="select-all"
            checked={masterState}
            onCheckedChange={handleMasterChange}
          />
          <div className="flex flex-col gap-0.5">
            <FieldLabel htmlFor="select-all" className="font-semibold text-zinc-900">
              Select all
            </FieldLabel>
            <span className="text-xs text-zinc-500">
              {checkedCount === 0
                ? "No permissions selected"
                : checkedCount === total
                ? "All permissions selected"
                : `${checkedCount} of ${total} permissions selected`}
            </span>
          </div>
        </Field>
      </div>

      {/* Individual Permissions */}
      <ul className="divide-y divide-zinc-100">
        {PERMISSIONS.map(({ id, label, description }) => (
          <li key={id} className="px-5 py-4">
            <Field>
              <Checkbox
                id={id}
                checked={checked[id]}
                onCheckedChange={(value) => handlePermissionChange(id, value)}
              />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor={id} className="text-zinc-900">
                  {label}
                </FieldLabel>
                <span className="text-xs text-zinc-500">{description}</span>
              </div>
            </Field>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="border-t border-zinc-200 px-5 py-3 bg-zinc-50 rounded-b-xl">
        <p className="text-xs text-zinc-400">
          Changes take effect the next time the user signs in.
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;