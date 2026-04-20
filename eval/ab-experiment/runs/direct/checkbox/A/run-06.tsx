"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string }[] = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

function Checkbox({
  className,
  checked,
  onCheckedChange,
  id,
  indeterminate,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  indeterminate?: boolean;
}) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={indeterminate ? "indeterminate" : checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground transition-colors",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {indeterminate ? (
          <Minus className="h-3.5 w-3.5" strokeWidth={3} />
        ) : (
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<
    Record<Permission, boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allSelected = selectedCount === total;
  const someSelected = selectedCount > 0 && selectedCount < total;
  const noneSelected = selectedCount === 0;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    const next = checked === true;
    setPermissions({ read: next, write: next, delete: next });
  };

  const handlePermission = (id: Permission, checked: boolean | "indeterminate") => {
    setPermissions((prev) => ({ ...prev, [id]: checked === true }));
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-sm p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-card-foreground">
          Permissions
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage access controls for this resource.
        </p>
      </div>

      <div className="h-px bg-border" />

      {/* Master checkbox */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="select-all"
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={handleSelectAll}
        />
        <Label
          htmlFor="select-all"
          className="text-sm font-medium leading-none cursor-pointer select-none"
        >
          Select all
        </Label>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {selectedCount}/{total} selected
        </span>
      </div>

      <div className="h-px bg-border" />

      {/* Individual permissions */}
      <div className="space-y-4">
        {PERMISSIONS.map(({ id, label }) => (
          <div key={id} className="flex items-center gap-3">
            <Checkbox
              id={id}
              checked={permissions[id]}
              onCheckedChange={(checked) => handlePermission(id, checked)}
            />
            <Label
              htmlFor={id}
              className="text-sm leading-none cursor-pointer select-none"
            >
              {label}
            </Label>
            <span
              className={cn(
                "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
                permissions[id]
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {permissions[id] ? "Enabled" : "Disabled"}
            </span>
          </div>
        ))}
      </div>

      <div className="h-px bg-border" />

      <p className="text-xs text-muted-foreground">
        {noneSelected
          ? "No permissions are currently enabled."
          : allSelected
          ? "All permissions are enabled."
          : `${selectedCount} permission${selectedCount > 1 ? "s" : ""} enabled.`}
      </p>
    </div>
  );
}

export default PermissionsPanel;