"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox built directly from Radix primitives (no shadcn wrapper file)
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
      "peer h-5 w-5 shrink-0 rounded-sm border border-gray-300 bg-white shadow-sm",
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "transition-colors",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
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
// Field / FieldLabel helpers for accessible layout
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

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none select-none cursor-pointer",
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
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const total = PERMISSIONS.length;

  const masterState: CheckboxPrimitive.CheckedState =
    selectedCount === 0
      ? false
      : selectedCount === total
      ? true
      : "indeterminate";

  const handleMasterChange = (checked: CheckboxPrimitive.CheckedState) => {
    const next = checked === true;
    setSelected({ read: next, write: next, delete: next });
  };

  const handlePermissionChange = (
    id: Permission,
    checked: CheckboxPrimitive.CheckedState
  ) => {
    setSelected((prev) => ({ ...prev, [id]: checked === true }));
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-xl bg-gray-50 px-5 py-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">
          Permissions
        </h2>
        <span className="text-xs text-gray-400 tabular-nums">
          {selectedCount} / {total} selected
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Select All */}
        <Field className="pb-3 border-b border-dashed border-gray-200">
          <Checkbox
            id="select-all"
            checked={masterState}
            onCheckedChange={handleMasterChange}
          />
          <FieldLabel
            htmlFor="select-all"
            className="font-semibold text-gray-800"
          >
            Select all
          </FieldLabel>
        </Field>

        {/* Individual Permissions */}
        <div className="space-y-3">
          {PERMISSIONS.map(({ id, label }) => (
            <Field key={id}>
              <Checkbox
                id={id}
                checked={selected[id]}
                onCheckedChange={(checked) =>
                  handlePermissionChange(id, checked)
                }
              />
              <FieldLabel htmlFor={id} className="text-gray-700">
                {label}
              </FieldLabel>
            </Field>
          ))}
        </div>
      </div>

      {/* Footer status */}
      <div className="rounded-b-xl bg-gray-50 border-t border-gray-200 px-5 py-3">
        <p className="text-xs text-gray-500">
          {selectedCount === 0 && "No permissions granted."}
          {selectedCount > 0 &&
            selectedCount < total &&
            `Partial access: ${PERMISSIONS.filter((p) => selected[p.id])
              .map((p) => p.label)
              .join(", ")}.`}
          {selectedCount === total && "Full access granted."}
        </p>
      </div>
    </div>
  );
}