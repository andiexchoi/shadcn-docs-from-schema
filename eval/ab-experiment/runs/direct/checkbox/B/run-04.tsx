"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Checkbox built on the Radix primitive (no wrapper component installed)
// ---------------------------------------------------------------------------

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  className?: string;
};

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
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {props.checked === "indeterminate" ? (
        <Minus className="h-3 w-3" />
      ) : (
        <Check className="h-3 w-3" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

// ---------------------------------------------------------------------------
// Field / FieldLabel helpers for accessible labeling
// ---------------------------------------------------------------------------

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  "data-disabled"?: boolean | string;
  "data-invalid"?: boolean | string;
}

function Field({ className, children, ...props }: FieldProps) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function FieldLabel({
  htmlFor,
  className,
  children,
}: {
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
    >
      {children}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Permissions Panel
// ---------------------------------------------------------------------------

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string }[] = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

export default function PermissionsPanel() {
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allChecked = selectedCount === total;
  const noneChecked = selectedCount === 0;
  const masterState: boolean | "indeterminate" = allChecked
    ? true
    : noneChecked
    ? false
    : "indeterminate";

  function handleMasterChange(value: boolean | "indeterminate") {
    const next = value === true;
    setSelected({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(id: Permission, value: boolean | "indeterminate") {
    setSelected((prev) => ({ ...prev, [id]: value === true }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="space-y-0.5">
        <h2 className="text-base font-semibold text-card-foreground">Permissions</h2>
        <p className="text-sm text-muted-foreground">
          Control what actions are allowed.
        </p>
      </div>

      {/* Divider */}
      <hr className="border-border" />

      {/* Master "Select all" */}
      <Field>
        <Checkbox
          id="select-all"
          checked={masterState}
          onCheckedChange={handleMasterChange}
        />
        <FieldLabel htmlFor="select-all" className="font-semibold text-card-foreground">
          Select all
        </FieldLabel>
      </Field>

      {/* Individual permissions */}
      <div className="pl-4 space-y-3 border-l-2 border-border">
        {PERMISSIONS.map(({ id, label }) => (
          <Field key={id}>
            <Checkbox
              id={id}
              checked={selected[id]}
              onCheckedChange={(value) => handlePermissionChange(id, value)}
            />
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
          </Field>
        ))}
      </div>

      {/* Footer summary */}
      <p className="text-xs text-muted-foreground pt-1">
        {selectedCount === 0
          ? "No permissions selected."
          : selectedCount === total
          ? "All permissions granted."
          : `${selectedCount} of ${total} permissions selected.`}
      </p>
    </div>
  );
}