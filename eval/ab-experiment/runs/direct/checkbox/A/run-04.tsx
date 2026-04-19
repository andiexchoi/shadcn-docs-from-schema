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

function StyledCheckbox({
  id,
  checked,
  onCheckedChange,
  className,
}: {
  id: string;
  checked: boolean | "indeterminate";
  onCheckedChange: (checked: boolean | "indeterminate") => void;
  className?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-[4px] border border-primary shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "transition-colors",
        className
      )}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {checked === "indeterminate" ? (
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

  const allChecked = Object.values(permissions).every(Boolean);
  const noneChecked = Object.values(permissions).every((v) => !v);
  const masterState: boolean | "indeterminate" = allChecked
    ? true
    : noneChecked
    ? false
    : "indeterminate";

  function handleMasterChange(checked: boolean | "indeterminate") {
    const next = checked === true;
    setPermissions({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(id: Permission, checked: boolean | "indeterminate") {
    setPermissions((prev) => ({ ...prev, [id]: checked === true }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <StyledCheckbox
          id="select-all"
          checked={masterState}
          onCheckedChange={handleMasterChange}
        />
        <Label
          htmlFor="select-all"
          className="cursor-pointer text-sm font-semibold text-card-foreground"
        >
          Select all
        </Label>
      </div>

      {/* Individual permissions */}
      <ul className="divide-y divide-border">
        {PERMISSIONS.map(({ id, label }) => (
          <li key={id} className="flex items-center gap-3 px-5 py-4">
            <StyledCheckbox
              id={id}
              checked={permissions[id]}
              onCheckedChange={(checked) => handlePermissionChange(id, checked)}
            />
            <Label
              htmlFor={id}
              className="cursor-pointer text-sm text-card-foreground"
            >
              {label}
            </Label>
            <span
              className={cn(
                "ml-auto rounded-full px-2 py-0.5 text-xs font-medium",
                permissions[id]
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {permissions[id] ? "Enabled" : "Disabled"}
            </span>
          </li>
        ))}
      </ul>

      {/* Footer summary */}
      <div className="rounded-b-xl border-t border-border bg-muted/50 px-5 py-3">
        <p className="text-xs text-muted-foreground">
          {allChecked
            ? "All permissions granted."
            : noneChecked
            ? "No permissions granted."
            : `${
                Object.values(permissions).filter(Boolean).length
              } of ${PERMISSIONS.length} permissions granted.`}
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;