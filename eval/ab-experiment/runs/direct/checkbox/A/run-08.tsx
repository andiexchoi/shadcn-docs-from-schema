"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface StyledCheckboxProps {
  id: string;
  checked: boolean | "indeterminate";
  onCheckedChange: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
}

function StyledCheckbox({
  id,
  checked,
  onCheckedChange,
  disabled,
}: StyledCheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "transition-colors"
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

type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string; description: string }[] = [
  {
    id: "read",
    label: "Read",
    description: "View and list resources",
  },
  {
    id: "write",
    label: "Write",
    description: "Create and modify resources",
  },
  {
    id: "delete",
    label: "Delete",
    description: "Remove resources permanently",
  },
];

export function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<
    Record<Permission, boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(permissions).filter(Boolean).length;
  const totalCount = PERMISSIONS.length;

  const masterChecked: boolean | "indeterminate" =
    selectedCount === 0
      ? false
      : selectedCount === totalCount
      ? true
      : "indeterminate";

  function handleMasterChange(checked: boolean | "indeterminate") {
    const next = checked === true;
    setPermissions({
      read: next,
      write: next,
      delete: next,
    });
  }

  function handlePermissionChange(
    id: Permission,
    checked: boolean | "indeterminate"
  ) {
    setPermissions((prev) => ({
      ...prev,
      [id]: checked === true,
    }));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            Permissions
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage access rights for this resource.
          </p>
        </div>

        {/* Select all row */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
            <StyledCheckbox
              id="select-all"
              checked={masterChecked}
              onCheckedChange={handleMasterChange}
            />
            <div className="flex flex-col">
              <Label
                htmlFor="select-all"
                className="cursor-pointer text-sm font-medium leading-none text-foreground"
              >
                Select all
              </Label>
              <span className="mt-1 text-xs text-muted-foreground">
                {selectedCount} of {totalCount} permissions enabled
              </span>
            </div>
          </div>
        </div>

        {/* Individual permissions */}
        <div className="px-6 py-4 space-y-1">
          {PERMISSIONS.map((permission, index) => (
            <div
              key={permission.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                "hover:bg-muted/40",
                index !== PERMISSIONS.length - 1 &&
                  "border-b border-border/50"
              )}
            >
              <StyledCheckbox
                id={permission.id}
                checked={permissions[permission.id]}
                onCheckedChange={(checked) =>
                  handlePermissionChange(permission.id, checked)
                }
              />
              <div className="flex flex-col">
                <Label
                  htmlFor={permission.id}
                  className="cursor-pointer text-sm font-medium leading-none text-foreground"
                >
                  {permission.label}
                </Label>
                <span className="mt-1 text-xs text-muted-foreground">
                  {permission.description}
                </span>
              </div>
              <div className="ml-auto">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    permissions[permission.id]
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {permissions[permission.id] ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Changes to permissions take effect immediately upon saving.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PermissionsPanel;