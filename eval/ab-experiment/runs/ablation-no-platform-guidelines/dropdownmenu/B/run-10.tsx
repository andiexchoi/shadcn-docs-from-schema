"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Lightweight local wrappers around Radix primitives
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
        "z-50 min-w-[200px] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
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

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-xs font-semibold text-muted-foreground", className)}
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
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// ---------------------------------------------------------------------------
// User Account Menu
// ---------------------------------------------------------------------------

interface UserAccountMenuProps {
  /** Display name shown in the trigger */
  name?: string;
  /** Email shown in the header section */
  email?: string;
  /** Avatar URL; falls back to initials when omitted */
  avatarUrl?: string;
  /** When true, Billing item is disabled */
  isFreePlan?: boolean;
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export function UserAccountMenu({
  name = "Jane Doe",
  email = "jane@example.com",
  avatarUrl,
  isFreePlan = false,
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const initials = getInitials(name);

  return (
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
            "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "aria-expanded:bg-accent aria-expanded:text-accent-foreground"
          )}
        >
          {/* Avatar */}
          <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </span>

          <span className="max-w-[120px] truncate">{name}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      {/* Content */}
      <DropdownMenuContent align="end">
        {/* Account info header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-medium leading-tight">{name}</span>
            <span className="truncate text-xs text-muted-foreground leading-tight">{email}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Main actions */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>

          <DropdownMenuItem onSelect={onProfile}>
            <User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSettings}>
            <Settings className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={!isFreePlan ? onBilling : undefined}
            disabled={isFreePlan}
            className={cn(isFreePlan && "cursor-not-allowed")}
          >
            <CreditCard
              className={cn(
                "h-4 w-4 shrink-0",
                isFreePlan ? "text-muted-foreground/50" : "text-muted-foreground"
              )}
              aria-hidden="true"
            />
            <span className="flex-1">Billing</span>
            {isFreePlan && (
              <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground leading-none">
                Upgrade
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onSignOut}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}