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
      onCheckedChange={(value) => {
        onCheckedChange(value === true);
      }}
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
        {indeterminate ? (
          <Minus className="h-3.5 w-3.5 stroke-[3]" />
        ) : (
          <Check className="h-3.5 w-3.5 stroke-[3]" />
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

  const values = Object.values(permissions);
  const allChecked = values.every(Boolean);
  const someChecked = values.some(Boolean) && !allChecked;

  function handleSelectAll(checked: boolean) {
    setPermissions({ read: checked, write: checked, delete: checked });
  }

  function handlePermission(id: Permission, checked: boolean) {
    setPermissions((prev) => ({ ...prev, [id]: checked }));
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-md">
      <h2 className="mb-1 text-lg font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Manage access levels for this resource.
      </p>

      {/* Select All */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
        <StyledCheckbox
          id="select-all"
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={handleSelectAll}
        />
        <Label
          htmlFor="select-all"
          className="cursor-pointer text-sm font-semibold text-foreground"
        >
          Select all
        </Label>
      </div>

      <div className="h-px bg-border mb-4" />

      {/* Individual permissions */}
      <div className="flex flex-col gap-3">
        {PERMISSIONS.map(({ id, label }) => (
          <div key={id} className="flex items-center gap-3 px-4">
            <StyledCheckbox
              id={id}
              checked={permissions[id]}
              onCheckedChange={(checked) => handlePermission(id, checked)}
            />
            <Label
              htmlFor={id}
              className="cursor-pointer text-sm text-foreground"
            >
              {label}
            </Label>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Active:</span>{" "}
          {values.filter(Boolean).length === 0
            ? "No permissions granted"
            : PERMISSIONS.filter(({ id }) => permissions[id])
                .map(({ label }) => label)
                .join(", ")}
        </p>
      </div>
    </div>
  );
}

export default PermissionsPanel;