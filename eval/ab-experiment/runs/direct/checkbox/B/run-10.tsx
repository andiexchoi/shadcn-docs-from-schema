"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Local Checkbox wrapper (Radix primitive, no shadcn dialog needed) ─── */

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
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {props.checked === "indeterminate" ? (
        <Minus className="h-3 w-3" />
      ) : (
        <Check className="h-3 w-3" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

/* ─── Field primitives ─────────────────────────────────────────────────── */

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-disabled"?: boolean | string;
  "data-invalid"?: boolean | string;
}

function Field({ className, children, ...props }: FieldProps) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function FieldLabel({
  className,
  htmlFor,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

/* ─── Permissions Panel ────────────────────────────────────────────────── */

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

  const allChecked = Object.values(checked).every(Boolean);
  const noneChecked = Object.values(checked).every((v) => !v);
  const masterState: CheckboxPrimitive.CheckedState = allChecked
    ? true
    : noneChecked
    ? false
    : "indeterminate";

  function handleMasterChange(value: CheckboxPrimitive.CheckedState) {
    const next = value === true;
    setChecked({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(id: Permission, value: CheckboxPrimitive.CheckedState) {
    setChecked((prev) => ({ ...prev, [id]: value === true }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-1">
        <h2 className="text-base font-semibold text-card-foreground">
          Permissions
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Control what actions are allowed.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {/* Master "Select all" checkbox */}
        <Field className="pb-3 border-b border-border">
          <Checkbox
            id="select-all"
            checked={masterState}
            onCheckedChange={handleMasterChange}
          />
          <FieldLabel htmlFor="select-all" className="font-semibold text-card-foreground">
            Select all
          </FieldLabel>
        </Field>

        {/* Individual permission checkboxes */}
        {PERMISSIONS.map(({ id, label }) => (
          <Field key={id}>
            <Checkbox
              id={id}
              checked={checked[id]}
              onCheckedChange={(value) => handlePermissionChange(id, value)}
            />
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
          </Field>
        ))}
      </div>

      {/* Footer summary */}
      <div className="mt-5 rounded-md bg-muted px-3 py-2">
        <p className="text-xs text-muted-foreground">
          {allChecked
            ? "All permissions granted."
            : noneChecked
            ? "No permissions granted."
            : `Permissions granted: ${Object.entries(checked)
                .filter(([, v]) => v)
                .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                .join(", ")}.`}
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;