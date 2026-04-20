"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface Permission {
  id: "read" | "write" | "delete";
  label: string;
}

const PERMISSIONS: Permission[] = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

type CheckedState = boolean | "indeterminate";

function StyledCheckbox({
  id,
  checked,
  onCheckedChange,
  className,
}: {
  id: string;
  checked: CheckedState;
  onCheckedChange: (checked: CheckedState) => void;
  className?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        className
      )}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {checked === "indeterminate" ? (
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
    Record<Permission["id"], boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const allChecked = Object.values(permissions).every(Boolean);
  const noneChecked = Object.values(permissions).every((v) => !v);
  const masterState: CheckedState = allChecked
    ? true
    : noneChecked
    ? false
    : "indeterminate";

  function handleMasterChange(checked: CheckedState) {
    const newValue = checked === true;
    setPermissions({ read: newValue, write: newValue, delete: newValue });
  }

  function handlePermissionChange(id: Permission["id"], checked: CheckedState) {
    setPermissions((prev) => ({ ...prev, [id]: checked === true }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Manage what actions are allowed.
      </p>

      {/* Master checkbox */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
        <StyledCheckbox
          id="select-all"
          checked={masterState}
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

      {/* Divider */}
      <div className="mb-4 h-px bg-border" />

      {/* Individual permission checkboxes */}
      <div className="flex flex-col gap-3">
        {PERMISSIONS.map((permission) => (
          <div
            key={permission.id}
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 transition-colors hover:bg-muted/40"
          >
            <StyledCheckbox
              id={permission.id}
              checked={permissions[permission.id]}
              onCheckedChange={(checked) =>
                handlePermissionChange(permission.id, checked)
              }
            />
            <Label
              htmlFor={permission.id}
              className="flex-1 cursor-pointer text-sm text-foreground"
            >
              {permission.label}
            </Label>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                permissions[permission.id]
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {permissions[permission.id] ? "Enabled" : "Disabled"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PermissionsPanel;