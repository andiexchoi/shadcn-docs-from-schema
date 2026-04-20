"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Minimal local Checkbox wrapper (no shadcn checkbox installed) ─── */

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
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
        "peer h-5 w-5 shrink-0 rounded border border-slate-300 bg-white shadow-sm",
        "ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white",
        "data-[state=indeterminate]:bg-slate-900 data-[state=indeterminate]:border-slate-900 data-[state=indeterminate]:text-white",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
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

/* ─── Field helpers (lightweight, no shadcn Field installed) ─── */

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-disabled"?: boolean | "";
  "data-invalid"?: boolean | "";
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
      "text-sm font-medium leading-none text-slate-800 select-none",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

/* ─── Permission types ─── */

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string }[] = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

/* ─── PermissionsPanel ─── */

export function PermissionsPanel() {
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allChecked = selectedCount === total;
  const isIndeterminate = selectedCount > 0 && selectedCount < total;

  function handleSelectAll(checked: boolean | "indeterminate") {
    const next = checked === true;
    setSelected({ read: next, write: next, delete: next });
  }

  function handlePermission(id: Permission, checked: boolean | "indeterminate") {
    setSelected((prev) => ({ ...prev, [id]: checked === true }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Permissions</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {selectedCount} of {total} selected
          </p>
        </div>

        {/* Select all */}
        <Field>
          <Checkbox
            id="select-all"
            indeterminate={isIndeterminate}
            checked={allChecked}
            onCheckedChange={handleSelectAll}
          />
          <FieldLabel htmlFor="select-all" className="font-semibold text-slate-700">
            Select all
          </FieldLabel>
        </Field>
      </div>

      {/* Individual permissions */}
      <ul className="divide-y divide-slate-100" role="list">
        {PERMISSIONS.map(({ id, label }) => (
          <li key={id} className="px-5 py-4">
            <Field>
              <Checkbox
                id={id}
                checked={selected[id]}
                onCheckedChange={(checked) => handlePermission(id, checked)}
              />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
                <span className="text-xs text-slate-400">
                  {id === "read" && "View resources and data"}
                  {id === "write" && "Create and update resources"}
                  {id === "delete" && "Permanently remove resources"}
                </span>
              </div>
            </Field>
          </li>
        ))}
      </ul>
    </div>
  );
}