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

export default function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<
    Record<Permission, boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const allSelected = PERMISSIONS.every((p) => permissions[p.id]);
  const noneSelected = PERMISSIONS.every((p) => !permissions[p.id]);
  const masterState: boolean | "indeterminate" = allSelected
    ? true
    : noneSelected
    ? false
    : "indeterminate";

  function handleMasterChange(checked: boolean | "indeterminate") {
    const newValue = checked === true;
    setPermissions({
      read: newValue,
      write: newValue,
      delete: newValue,
    });
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
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-card-foreground">
            Permissions
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Configure access control settings.
          </p>
        </div>

        {/* Master checkbox */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <StyledCheckbox
              id="select-all"
              checked={masterState}
              onCheckedChange={handleMasterChange}
            />
            <Label
              htmlFor="select-all"
              className="cursor-pointer text-sm font-semibold text-foreground select-none"
            >
              Select all
            </Label>
            {masterState === "indeterminate" && (
              <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Partial
              </span>
            )}
            {masterState === true && (
              <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                All granted
              </span>
            )}
            {masterState === false && (
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                None
              </span>
            )}
          </div>
        </div>

        {/* Individual permissions */}
        <ul className="divide-y divide-border px-6">
          {PERMISSIONS.map(({ id, label }) => {
            const descriptions: Record<Permission, string> = {
              read: "View resources and data",
              write: "Create and modify resources",
              delete: "Remove resources permanently",
            };
            return (
              <li key={id} className="flex items-center gap-3 py-4">
                <StyledCheckbox
                  id={id}
                  checked={permissions[id]}
                  onCheckedChange={(val) => handlePermissionChange(id, val)}
                />
                <div className="flex flex-col">
                  <Label
                    htmlFor={id}
                    className="cursor-pointer text-sm font-medium text-foreground select-none"
                  >
                    {label}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {descriptions[id]}
                  </span>
                </div>
                <div className="ml-auto">
                  <span
                    className={cn(
                      "inline-block h-2 w-2 rounded-full",
                      permissions[id] ? "bg-green-500" : "bg-muted-foreground/30"
                    )}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="rounded-b-xl border-t border-border bg-muted/40 px-6 py-3">
          <p className="text-xs text-muted-foreground">
            {PERMISSIONS.filter((p) => permissions[p.id]).length} of{" "}
            {PERMISSIONS.length} permissions granted
          </p>
        </div>
      </div>
    </div>
  );
}