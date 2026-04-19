"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Local Checkbox wrapper (no shadcn/ui checkbox installed) ─── */

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  className?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    checked={checked}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-sm border border-slate-300 shadow-sm",
      "ring-offset-white transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white",
      "data-[state=indeterminate]:bg-slate-900 data-[state=indeterminate]:border-slate-900 data-[state=indeterminate]:text-white",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {checked === "indeterminate" ? (
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      ) : (
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

/* ─── Field helpers ─── */

function Field({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}

function FieldLabel({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
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

/* ─── Permission item type ─── */

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string }[] = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

/* ─── PermissionsPanel ─── */

export default function PermissionsPanel() {
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const total = PERMISSIONS.length;

  const masterChecked: boolean | "indeterminate" =
    selectedCount === 0 ? false : selectedCount === total ? true : "indeterminate";

  function handleMasterChange(value: boolean | "indeterminate") {
    const next = value === true;
    setSelected({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(id: Permission, value: boolean | "indeterminate") {
    setSelected((prev) => ({ ...prev, [id]: value === true }));
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Permissions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Control what actions are allowed for this resource.
          </p>
        </div>

        {/* Master "Select all" */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
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
              {selectedCount} / {total}
            </span>
          </Field>
        </div>

        {/* Individual permissions */}
        <ul className="px-6 py-4 space-y-4" role="group" aria-label="Permission options">
          {PERMISSIONS.map(({ id, label }) => {
            const isChecked = selected[id];
            return (
              <li key={id}>
                <Field>
                  <Checkbox
                    id={id}
                    checked={isChecked}
                    onCheckedChange={(val) => handlePermissionChange(id, val)}
                  />
                  <FieldLabel htmlFor={id} className="text-slate-700">
                    {label}
                  </FieldLabel>
                  <span
                    className={cn(
                      "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
                      isChecked
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {isChecked ? "Enabled" : "Disabled"}
                  </span>
                </Field>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
          <p className="text-xs text-slate-400">
            Changes apply immediately upon selection.
          </p>
        </div>
      </div>
    </div>
  );
}