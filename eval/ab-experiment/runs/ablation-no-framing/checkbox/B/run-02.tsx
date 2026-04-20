"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Local Checkbox wrapper (mirrors shadcn style)
───────────────────────────────────────────── */
interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, ...props }, ref) => (
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
    checked={indeterminate ? "indeterminate" : props.checked}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      {indeterminate ? (
        <Minus className="h-3 w-3" aria-hidden="true" />
      ) : (
        <Check className="h-3 w-3" aria-hidden="true" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = "Checkbox";

/* ─────────────────────────────────────────────
   Field helpers (minimal, self-contained)
───────────────────────────────────────────── */
function Field({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>{children}</div>
  );
}

function FieldLabel({
  htmlFor,
  children,
  className,
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none select-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
    >
      {children}
    </label>
  );
}

/* ─────────────────────────────────────────────
   Permissions Panel
───────────────────────────────────────────── */
type Permission = "read" | "write" | "delete";

const PERMISSIONS: { id: Permission; label: string }[] = [
  { id: "read", label: "Read" },
  { id: "write", label: "Write" },
  { id: "delete", label: "Delete" },
];

export function PermissionsPanel() {
  const [selected, setSelected] = React.useState<Record<Permission, boolean>>({
    read: false,
    write: false,
    delete: false,
  });

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const total = PERMISSIONS.length;
  const allChecked = selectedCount === total;
  const someChecked = selectedCount > 0 && selectedCount < total;

  function handleSelectAll() {
    const next = !allChecked;
    setSelected({ read: next, write: next, delete: next });
  }

  function handlePermission(id: Permission, value: boolean) {
    setSelected((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-1">
        <h2 className="text-base font-semibold text-card-foreground">
          Permissions
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose what actions are allowed.
        </p>
      </div>

      <div className="mt-4 space-y-1">
        {/* Select all row */}
        <Field className="rounded-md px-3 py-2.5 bg-muted/50">
          <Checkbox
            id="select-all"
            indeterminate={someChecked}
            checked={allChecked}
            onCheckedChange={handleSelectAll}
            aria-label="Select all permissions"
          />
          <FieldLabel
            htmlFor="select-all"
            className="font-semibold text-card-foreground cursor-pointer"
          >
            Select all
          </FieldLabel>
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            {selectedCount}/{total}
          </span>
        </Field>

        {/* Divider */}
        <div className="my-2 border-t border-border" />

        {/* Individual permissions */}
        {PERMISSIONS.map(({ id, label }) => (
          <Field key={id} className="rounded-md px-3 py-2.5 hover:bg-muted/40 transition-colors">
            <Checkbox
              id={id}
              checked={selected[id]}
              onCheckedChange={(checked) =>
                handlePermission(id, checked === true)
              }
            />
            <FieldLabel
              htmlFor={id}
              className="cursor-pointer text-card-foreground"
            >
              {label}
            </FieldLabel>
          </Field>
        ))}
      </div>
    </div>
  );
}

export default PermissionsPanel;