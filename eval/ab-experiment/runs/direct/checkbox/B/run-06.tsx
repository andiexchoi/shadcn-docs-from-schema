"use client";

import { useState, useCallback } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Lightweight local Field / FieldLabel / FieldDescription wrappers ─── */

function Field({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-start gap-3", className)} {...props}>
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
        "text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}

function FieldDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-muted-foreground mt-0.5", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/* ─── Checkbox primitive styled to match shadcn/ui conventions ─── */

interface StyledCheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

function StyledCheckbox({
  indeterminate,
  className,
  checked,
  ...props
}: StyledCheckboxProps) {
  const resolvedChecked = indeterminate ? "indeterminate" : checked;

  return (
    <CheckboxPrimitive.Root
      checked={resolvedChecked}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
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
        {resolvedChecked === "indeterminate" ? (
          <Minus className="h-3 w-3" strokeWidth={3} />
        ) : (
          <Check className="h-3 w-3" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

/* ─── Permission definitions ─── */

type PermissionKey = "read" | "write" | "delete";

const PERMISSIONS: {
  key: PermissionKey;
  label: string;
  description: string;
}[] = [
  {
    key: "read",
    label: "Read",
    description: "View records and access data.",
  },
  {
    key: "write",
    label: "Write",
    description: "Create and edit records.",
  },
  {
    key: "delete",
    label: "Delete",
    description: "Permanently remove records.",
  },
];

/* ─── Main component ─── */

export default function PermissionsPanel() {
  const [permissions, setPermissions] = useState<
    Record<PermissionKey, boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allSelected = selectedCount === total;
  const someSelected = selectedCount > 0 && selectedCount < total;

  const handleSelectAll = useCallback(() => {
    const next = !allSelected;
    setPermissions({ read: next, write: next, delete: next });
  }, [allSelected]);

  const handlePermissionChange = useCallback(
    (key: PermissionKey, checked: boolean) => {
      setPermissions((prev) => ({ ...prev, [key]: checked }));
    },
    []
  );

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold">Permissions</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Control what actions are allowed.
        </p>
      </div>

      {/* Select all row */}
      <div className="px-5 py-4 border-b border-border">
        <Field className="group">
          <StyledCheckbox
            id="select-all"
            indeterminate={someSelected}
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all permissions"
          />
          <div className="flex flex-col">
            <FieldLabel htmlFor="select-all" className="font-semibold text-sm">
              Select all
            </FieldLabel>
            <FieldDescription>
              {allSelected
                ? "All permissions enabled"
                : someSelected
                ? `${selectedCount} of ${total} permissions enabled`
                : "No permissions enabled"}
            </FieldDescription>
          </div>
        </Field>
      </div>

      {/* Individual permissions */}
      <div className="px-5 py-4 flex flex-col gap-4">
        {PERMISSIONS.map(({ key, label, description }) => (
          <Field key={key} className="group">
            <StyledCheckbox
              id={`permission-${key}`}
              checked={permissions[key]}
              onCheckedChange={(val) =>
                handlePermissionChange(key, val === true)
              }
            />
            <div className="flex flex-col">
              <FieldLabel htmlFor={`permission-${key}`}>{label}</FieldLabel>
              <FieldDescription>{description}</FieldDescription>
            </div>
          </Field>
        ))}
      </div>

      {/* Footer summary */}
      <div className="px-5 py-3 border-t border-border rounded-b-xl bg-muted/40">
        <p className="text-xs text-muted-foreground">
          {allSelected
            ? "Full access granted."
            : someSelected
            ? `Partial access — ${PERMISSIONS.filter((p) => permissions[p.key])
                .map((p) => p.label)
                .join(", ")}.`
            : "No access granted."}
        </p>
      </div>
    </div>
  );
}