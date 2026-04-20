"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Local Checkbox wrapper (Radix primitive, styled to match shadcn/ui)       */
/* -------------------------------------------------------------------------- */

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  className?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
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
      {props.checked === "indeterminate" ? (
        <Minus className="h-3 w-3" />
      ) : (
        <Check className="h-3 w-3" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type PermissionKey = "read" | "write" | "delete";

interface Permission {
  key: PermissionKey;
  label: string;
  description: string;
}

const PERMISSIONS: Permission[] = [
  {
    key: "read",
    label: "Read",
    description: "View resources and their contents.",
  },
  {
    key: "write",
    label: "Write",
    description: "Create and modify existing resources.",
  },
  {
    key: "delete",
    label: "Delete",
    description: "Permanently remove resources.",
  },
];

/* -------------------------------------------------------------------------- */
/*  PermissionsPanel                                                           */
/* -------------------------------------------------------------------------- */

export default function PermissionsPanel() {
  const [permissions, setPermissions] = React.useState<
    Record<PermissionKey, boolean>
  >({
    read: false,
    write: false,
    delete: false,
  });

  const checkedCount = Object.values(permissions).filter(Boolean).length;
  const total = PERMISSIONS.length;

  const masterChecked: boolean | "indeterminate" =
    checkedCount === 0 ? false : checkedCount === total ? true : "indeterminate";

  const handleMasterChange = (checked: boolean | "indeterminate") => {
    const next = checked === true;
    setPermissions({ read: next, write: next, delete: next });
  };

  const handlePermissionChange =
    (key: PermissionKey) => (checked: boolean | "indeterminate") => {
      setPermissions((prev) => ({ ...prev, [key]: checked === true }));
    };

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <h2 className="mb-1 text-base font-semibold text-card-foreground">
        Permissions
      </h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Control what actions are allowed for this role.
      </p>

      {/* Master "Select all" row */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
        <Checkbox
          id="select-all"
          checked={masterChecked}
          onCheckedChange={handleMasterChange}
          aria-label="Select all permissions"
        />
        <label
          htmlFor="select-all"
          className="cursor-pointer select-none text-sm font-medium text-foreground"
        >
          Select all
        </label>
        <span className="ml-auto text-xs text-muted-foreground">
          {checkedCount} / {total} selected
        </span>
      </div>

      {/* Divider */}
      <div className="mb-4 h-px bg-border" />

      {/* Individual permissions */}
      <div className="flex flex-col gap-3">
        {PERMISSIONS.map(({ key, label, description }) => (
          <div
            key={key}
            className="flex items-start gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-muted/30"
          >
            <Checkbox
              id={key}
              checked={permissions[key]}
              onCheckedChange={handlePermissionChange(key)}
              className="mt-0.5"
              aria-label={label}
            />
            <div className="flex flex-col gap-0.5">
              <label
                htmlFor={key}
                className="cursor-pointer select-none text-sm font-medium leading-none text-foreground"
              >
                {label}
              </label>
              <span className="text-xs text-muted-foreground">{description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}