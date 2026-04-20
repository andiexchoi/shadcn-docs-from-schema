"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "z-50 min-w-[200px] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
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
    role="presentation"
    className={cn(
      "px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide select-none",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    variant?: "default" | "destructive";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none transition-colors",
      "focus:bg-neutral-100 focus:text-neutral-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      variant === "destructive" && "text-red-600 focus:bg-red-50 focus:text-red-700",
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
    className={cn("-mx-1 my-1 h-px bg-neutral-200", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// ─── User Account Menu ────────────────────────────────────────────────────────

type Plan = "free" | "pro" | "enterprise";

interface UserAccountMenuProps {
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
  plan?: Plan;
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

export function UserAccountMenu({
  user = { name: "Jane Doe", email: "jane@example.com" },
  plan = "free",
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isBillingDisabled = plan === "free";
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2",
            "text-sm font-medium text-neutral-800 shadow-sm",
            "hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
            "transition-colors"
          )}
          aria-label="Open account menu"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name ?? "User avatar"}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white select-none">
              {initials}
            </span>
          )}
          <span className="max-w-[120px] truncate">{user.name ?? user.email}</span>
          <ChevronDown className="ml-auto h-4 w-4 text-neutral-400 shrink-0" aria-hidden />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* User info header */}
        <div className="flex flex-col gap-0.5 px-2 py-2">
          {user.name && (
            <span className="text-sm font-semibold text-neutral-900 leading-tight">
              {user.name}
            </span>
          )}
          {user.email && (
            <span className="text-xs text-neutral-500 leading-tight truncate">
              {user.email}
            </span>
          )}
          <span
            className={cn(
              "mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              plan === "free"
                ? "bg-neutral-100 text-neutral-500"
                : plan === "pro"
                ? "bg-blue-100 text-blue-700"
                : "bg-violet-100 text-violet-700"
            )}
          >
            {plan} plan
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>

          <DropdownMenuItem onSelect={onProfile}>
            <User className="h-4 w-4 text-neutral-500 shrink-0" aria-hidden />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSettings}>
            <Settings className="h-4 w-4 text-neutral-500 shrink-0" aria-hidden />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onBilling}
            disabled={isBillingDisabled}
            aria-disabled={isBillingDisabled}
          >
            <CreditCard
              className={cn(
                "h-4 w-4 shrink-0",
                isBillingDisabled ? "text-neutral-300" : "text-neutral-500"
              )}
              aria-hidden
            />
            <span>Billing</span>
            {isBillingDisabled && (
              <span className="ml-auto text-[10px] font-medium text-neutral-400 bg-neutral-100 rounded px-1.5 py-0.5">
                Upgrade
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onSelect={onSignOut}>
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}