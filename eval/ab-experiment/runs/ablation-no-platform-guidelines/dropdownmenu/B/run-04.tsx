"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Radix-based DropdownMenu wrappers (no shadcn dialog or other wrapper
// components required — all built here from the Radix primitives directly).
// ---------------------------------------------------------------------------

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPortal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[200px] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
      {...props}
    />
  </DropdownMenuPortal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "focus:bg-zinc-100 focus:text-zinc-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      "dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400",
      inset && "pl-8",
      className
    )}
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
    className={cn("-mx-1 my-1 h-px bg-zinc-100 dark:bg-zinc-800", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// ---------------------------------------------------------------------------
// User Account Menu
// ---------------------------------------------------------------------------

type Plan = "free" | "pro" | "enterprise";

interface UserAccountMenuProps {
  /** Display name shown in the trigger button */
  userName?: string;
  /** Email shown in the header area */
  userEmail?: string;
  /** Avatar URL; falls back to initials when not provided */
  avatarUrl?: string;
  /** Current subscription plan — disables Billing when "free" */
  plan?: Plan;
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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
  const [open, setOpen] = React.useState(false);
  const isBillingDisabled = plan === "free";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full py-1 pl-1 pr-3",
            "border border-zinc-200 bg-white shadow-sm",
            "text-sm font-medium text-zinc-800 transition-colors",
            "hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          )}
          aria-label="Open account menu"
        >
          {/* Avatar */}
          <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {getInitials(userName)}
              </span>
            )}
          </span>

          <span className="max-w-[120px] truncate">{userName}</span>
          <ChevronDown
            size={14}
            className={cn(
              "ml-0.5 text-zinc-400 transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="bottom">
        {/* User info header */}
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                {getInitials(userName)}
              </span>
            )}
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {userName}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {userEmail}
            </span>
          </div>
        </div>

        {/* Plan badge */}
        <div className="px-2 pb-1.5">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              plan === "free"
                ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
            )}
          >
            {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>

          <DropdownMenuItem onSelect={onProfile}>
            <User size={15} className="text-zinc-500" aria-hidden />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSettings}>
            <Settings size={15} className="text-zinc-500" aria-hidden />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={isBillingDisabled ? undefined : onBilling}
            disabled={isBillingDisabled}
            aria-disabled={isBillingDisabled}
          >
            <CreditCard size={15} className="text-zinc-500" aria-hidden />
            <span className="flex-1">Billing</span>
            {isBillingDisabled && (
              <span className="ml-2 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                Upgrade
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onSignOut}
            className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/40 dark:focus:text-red-400"
          >
            <LogOut size={15} aria-hidden />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}