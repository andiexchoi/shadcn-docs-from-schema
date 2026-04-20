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
  indeterminate = false,
  className,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  indeterminate?: boolean;
  className?: string;
}) {
  const checkedState: CheckboxPrimitive.CheckedState = indeterminate
    ? "indeterminate"
    : checked;

  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checkedState}
      onCheckedChange={(val) => onCheckedChange(val === true)}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        className
      )}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {indeterminate ? (
          <Minus className="h-3.5 w-3.5" />
        ) : (
          <Check className="h-3.5 w-3.5" />
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

  const allSelected = Object.values(permissions).every(Boolean);
  const noneSelected = Object.values(permissions).every((v) => !v);
  const someSelected = !allSelected && !noneSelected;

  function handleMasterChange(checked: boolean) {
    setPermissions({ read: checked, write: checked, delete: checked });
  }

  function handlePermissionChange(permission: Permission, checked: boolean) {
    setPermissions((prev) => ({ ...prev, [permission]: checked }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Configure access levels for this resource.
      </p>

      {/* Master checkbox */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
        <StyledCheckbox
          id="select-all"
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={handleMasterChange}
        />
        <Label
          htmlFor="select-all"
          className="cursor-pointer text-sm font-medium text-foreground"
        >
          Select all
        </Label>
        <span className="ml-auto text-xs text-muted-foreground">
          {Object.values(permissions).filter(Boolean).length} /{" "}
          {PERMISSIONS.length} selected
        </span>
      </div>

      <div className="space-y-1 pl-1">
        {PERMISSIONS.map(({ id, label }) => (
          <div
            key={id}
            className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted/40"
          >
            <StyledCheckbox
              id={id}
              checked={permissions[id]}
              onCheckedChange={(checked) =>
                handlePermissionChange(id, checked)
              }
            />
            <Label
              htmlFor={id}
              className="cursor-pointer text-sm text-foreground"
            >
              {label}
            </Label>
            <span className="ml-auto text-xs text-muted-foreground">
              {permissions[id] ? (
                <span className="font-medium text-primary">Enabled</span>
              ) : (
                "Disabled"
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PermissionsPanel;