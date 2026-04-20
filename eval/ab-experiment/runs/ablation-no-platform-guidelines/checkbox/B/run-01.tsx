"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Local Checkbox built on Radix primitive (no shadcn wrapper installed)
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded border border-zinc-300 bg-white shadow-sm",
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

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string; description: string }[] = [
  {
    id: "read",
    label: "Read",
    description: "View and list resources in this scope.",
  },
  {
    id: "write",
    label: "Write",
    description: "Create and modify resources in this scope.",
  },
  {
    id: "delete",
    label: "Delete",
    description: "Permanently remove resources from this scope.",
  },
];

export function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<
    Record<Permission, boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const checkedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;

  const masterState: boolean | "indeterminate" =
    checkedCount === 0 ? false : checkedCount === total ? true : "indeterminate";

  function handleMasterChange(value: boolean | "indeterminate") {
    const next = value === true;
    setPermissions({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(id: Permission, value: boolean | "indeterminate") {
    setPermissions((prev) => ({ ...prev, [id]: value === true }));
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4">
        <Checkbox
          id="select-all"
          checked={masterState}
          onCheckedChange={handleMasterChange}
          aria-label="Select all permissions"
        />
        <label
          htmlFor="select-all"
          className="cursor-pointer select-none text-sm font-semibold text-zinc-900"
        >
          {masterState === true
            ? "All permissions selected"
            : masterState === "indeterminate"
            ? "Some permissions selected"
            : "Select all permissions"}
        </label>
        <span
          className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500"
          aria-live="polite"
          aria-atomic="true"
        >
          {checkedCount} / {total}
        </span>
      </div>

      {/* Permission rows */}
      <ul className="divide-y divide-zinc-100" role="list">
        {PERMISSIONS.map(({ id, label, description }) => (
          <li key={id} className="flex items-start gap-3 px-5 py-4">
            <Checkbox
              id={id}
              checked={permissions[id]}
              onCheckedChange={(value) => handlePermissionChange(id, value)}
              className="mt-0.5"
              aria-describedby={`${id}-desc`}
            />
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor={id}
                className="cursor-pointer select-none text-sm font-medium text-zinc-900"
              >
                {label}
              </label>
              <p id={`${id}-desc`} className="text-xs text-zinc-500">
                {description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3">
        <button
          type="button"
          onClick={() =>
            setPermissions({ read: false, write: false, delete: false })
          }
          className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 rounded"
        >
          Clear all
        </button>
        <button
          type="button"
          onClick={() =>
            setPermissions({ read: true, write: true, delete: true })
          }
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
        >
          Grant all
        </button>
      </div>
    </div>
  );
}