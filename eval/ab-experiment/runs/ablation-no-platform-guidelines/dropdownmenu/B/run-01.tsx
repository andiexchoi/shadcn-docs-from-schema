"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Minimal local wrappers around Radix primitives (no shadcn dialog installed)
// ---------------------------------------------------------------------------

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[200px] overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-semibold text-zinc-500", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-zinc-100", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  destructive?: boolean;
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, destructive = false, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
      "focus:bg-zinc-100 focus:text-zinc-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      destructive && "text-red-600 focus:bg-red-50 focus:text-red-700",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Plan = "free" | "pro" | "enterprise";

export interface UserAccountMenuProps {
  /** Display name shown in the trigger button */
  userName?: string;
  /** Email shown in the account header */
  userEmail?: string;
  /** URL for the user's avatar image */
  avatarUrl?: string;
  /** Current plan — Billing is disabled when "free" */
  plan?: Plan;
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

// ---------------------------------------------------------------------------
// Avatar helper
// ---------------------------------------------------------------------------

function Avatar({
  src,
  name,
  className,
}: {
  src?: string;
  name?: string;
  className?: string;
}) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "User avatar"}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-indigo-100 font-medium text-indigo-700",
        className
      )}
    >
      {initials}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Plan badge helper
// ---------------------------------------------------------------------------

const planLabels: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

const planBadgeColors: Record<Plan, string> = {
  free: "bg-zinc-100 text-zinc-600",
  pro: "bg-indigo-100 text-indigo-700",
  enterprise: "bg-amber-100 text-amber-700",
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function UserAccountMenu({
  userName = "Jane Doe",
  userEmail = "jane@example.com",
  avatarUrl,
  plan = "free",
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const billingDisabled = plan === "free";

  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors",
            "hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          )}
        >
          <Avatar src={avatarUrl} name={userName} className="h-6 w-6 text-xs" />
          <span className="max-w-[120px] truncate">{userName}</span>
          <ChevronDown className="h-4 w-4 text-zinc-400" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      {/* Content */}
      <DropdownMenuContent align="end">
        {/* Account header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar src={avatarUrl} name={userName} className="h-9 w-9 text-sm" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-zinc-900">
              {userName}
            </span>
            <span className="truncate text-xs text-zinc-500">{userEmail}</span>
          </div>
        </div>

        {/* Plan badge */}
        <div className="px-2 pb-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              planBadgeColors[plan]
            )}
          >
            {planLabels[plan]} plan
          </span>
        </div>

        <DropdownMenuSeparator />

        {/* Primary actions */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>

          <DropdownMenuItem onSelect={onProfile}>
            <User className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSettings}>
            <Settings className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={billingDisabled ? undefined : onBilling}
            disabled={billingDisabled}
            aria-disabled={billingDisabled}
          >
            <CreditCard className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            <span className="flex-1">Billing</span>
            {billingDisabled && (
              <span className="ml-auto text-xs text-zinc-400">Upgrade</span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Destructive */}
        <DropdownMenuGroup>
          <DropdownMenuItem destructive onSelect={onSignOut}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}