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

interface StyledCheckboxProps {
  id: string;
  checked: boolean | "indeterminate";
  onCheckedChange: (checked: boolean | "indeterminate") => void;
  className?: string;
}

function StyledCheckbox({
  id,
  checked,
  onCheckedChange,
  className,
}: StyledCheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-md border-2 border-primary ring-offset-background",
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

  const allSelected = Object.values(permissions).every(Boolean);
  const noneSelected = Object.values(permissions).every((v) => !v);
  const someSelected = !allSelected && !noneSelected;

  const masterChecked: boolean | "indeterminate" = allSelected
    ? true
    : someSelected
    ? "indeterminate"
    : false;

  function handleMasterChange(checked: boolean | "indeterminate") {
    const next = checked === true;
    setPermissions({ read: next, write: next, delete: next });
  }

  function handlePermissionChange(
    permission: Permission,
    checked: boolean | "indeterminate"
  ) {
    setPermissions((prev) => ({
      ...prev,
      [permission]: checked === true,
    }));
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Configure access levels for this resource.
      </p>

      {/* Master checkbox */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
        <StyledCheckbox
          id="select-all"
          checked={masterChecked}
          onCheckedChange={handleMasterChange}
        />
        <Label
          htmlFor="select-all"
          className="cursor-pointer text-sm font-semibold text-card-foreground"
        >
          Select all
        </Label>
        <span className="ml-auto text-xs text-muted-foreground">
          {allSelected
            ? "All selected"
            : noneSelected
            ? "None selected"
            : `${Object.values(permissions).filter(Boolean).length} of ${
                PERMISSIONS.length
              } selected`}
        </span>
      </div>

      {/* Divider */}
      <div className="mb-3 h-px bg-border" />

      {/* Individual permissions */}
      <div className="flex flex-col gap-3 pl-2">
        {PERMISSIONS.map(({ id, label }) => (
          <div key={id} className="flex items-center gap-3">
            <StyledCheckbox
              id={id}
              checked={permissions[id]}
              onCheckedChange={(val) => handlePermissionChange(id, val)}
            />
            <Label
              htmlFor={id}
              className="cursor-pointer text-sm text-card-foreground"
            >
              {label}
            </Label>
            <span className="ml-auto">
              {permissions[id] ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Enabled
                </span>
              ) : (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Disabled
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PermissionsPanel;