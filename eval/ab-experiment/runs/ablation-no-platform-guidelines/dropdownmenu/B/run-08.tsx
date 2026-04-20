"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Radix-based DropdownMenu wrappers (no components/ui/dropdown-menu.tsx)
// ---------------------------------------------------------------------------

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPortal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[220px] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 shadow-lg",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "dark:border-neutral-800 dark:bg-neutral-950",
        className
      )}
      {...props}
    />
  </DropdownMenuPortal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    variant?: "default" | "destructive";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "focus:bg-neutral-100 dark:focus:bg-neutral-800",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      variant === "destructive"
        ? "text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-300"
        : "text-neutral-800 dark:text-neutral-200",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-neutral-200 dark:bg-neutral-800", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Plan = "free" | "pro" | "enterprise";

interface UserAccountMenuProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  plan?: Plan;
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

// ---------------------------------------------------------------------------
// Avatar helper
// ---------------------------------------------------------------------------

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white select-none">
      {initials}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Plan badge
// ---------------------------------------------------------------------------

function PlanBadge({ plan }: { plan: Plan }) {
  const styles: Record<Plan, string> = {
    free: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
    pro: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    enterprise:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  };

  return (
    <span
      className={cn(
        "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        styles[plan]
      )}
    >
      {plan}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function UserAccountMenu({
  user,
  plan = "free",
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isBillingDisabled = plan === "free";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
            "text-neutral-800 dark:text-neutral-200",
            "hover:bg-neutral-100 dark:hover:bg-neutral-800",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
            "transition-colors"
          )}
          aria-label="Open account menu"
        >
          <Avatar name={user.name} avatarUrl={user.avatarUrl} />
          <span className="hidden sm:block max-w-[120px] truncate">{user.name}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* User info header */}
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar name={user.name} avatarUrl={user.avatarUrl} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {user.name}
            </span>
            <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
              {user.email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Account group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>

          <DropdownMenuItem onSelect={onProfile}>
            <User className="h-4 w-4 shrink-0" aria-hidden />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSettings}>
            <Settings className="h-4 w-4 shrink-0" aria-hidden />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={isBillingDisabled ? undefined : onBilling}
            disabled={isBillingDisabled}
          >
            <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
            Billing
            <PlanBadge plan={plan} />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuItem variant="destructive" onSelect={onSignOut}>
          <LogOut className="h-4 w-4 shrink-0" aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}