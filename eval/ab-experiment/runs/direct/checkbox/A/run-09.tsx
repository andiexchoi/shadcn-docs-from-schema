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
}: {
  className?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  indeterminate?: boolean;
}) {
  const checkedState: CheckboxPrimitive.CheckedState = indeterminate
    ? "indeterminate"
    : checked;

  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checkedState}
      onCheckedChange={(val) => {
        if (val === "indeterminate") {
          onCheckedChange(false);
        } else {
          onCheckedChange(val);
        }
      }}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background",
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

  const allSelected = PERMISSIONS.every((p) => permissions[p.id]);
  const noneSelected = PERMISSIONS.every((p) => !permissions[p.id]);
  const indeterminate = !allSelected && !noneSelected;

  function handleSelectAll(checked: boolean) {
    setPermissions({
      read: checked,
      write: checked,
      delete: checked,
    });
  }

  function handlePermissionChange(id: Permission, checked: boolean) {
    setPermissions((prev) => ({ ...prev, [id]: checked }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Manage access levels for this resource.
      </p>

      {/* Select All */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
        <Checkbox
          id="select-all"
          checked={allSelected}
          indeterminate={indeterminate}
          onCheckedChange={handleSelectAll}
        />
        <Label
          htmlFor="select-all"
          className="cursor-pointer text-sm font-semibold text-card-foreground"
        >
          Select all
        </Label>
        <span className="ml-auto text-xs text-muted-foreground">
          {PERMISSIONS.filter((p) => permissions[p.id]).length} /{" "}
          {PERMISSIONS.length} selected
        </span>
      </div>

      {/* Divider */}
      <div className="mb-4 h-px bg-border" />

      {/* Individual permissions */}
      <div className="flex flex-col gap-3">
        {PERMISSIONS.map(({ id, label }) => (
          <div
            key={id}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
              permissions[id]
                ? "border-primary/30 bg-primary/5"
                : "border-transparent bg-muted/30 hover:bg-muted/60"
            )}
          >
            <Checkbox
              id={id}
              checked={permissions[id]}
              onCheckedChange={(val) => handlePermissionChange(id, val)}
            />
            <Label
              htmlFor={id}
              className="cursor-pointer text-sm font-medium text-card-foreground"
            >
              {label}
            </Label>
            <PermissionBadge permission={id} active={permissions[id]} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 rounded-lg bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        {allSelected && (
          <span className="font-medium text-primary">
            Full access granted to this resource.
          </span>
        )}
        {noneSelected && <span>No permissions selected.</span>}
        {indeterminate && (
          <span>
            Partial access — some permissions are restricted.
          </span>
        )}
      </div>
    </div>
  );
}

function PermissionBadge({
  permission,
  active,
}: {
  permission: Permission;
  active: boolean;
}) {
  const descriptions: Record<Permission, string> = {
    read: "View only",
    write: "Create & edit",
    delete: "Remove data",
  };

  return (
    <span
      className={cn(
        "ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {descriptions[permission]}
    </span>
  );
}