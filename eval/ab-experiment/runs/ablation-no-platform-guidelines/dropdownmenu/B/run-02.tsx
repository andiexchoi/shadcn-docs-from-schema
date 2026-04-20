"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Radix wrappers (no components/ui/dropdown-menu.tsx installed)
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
        "z-50 min-w-[220px] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "dark:border-zinc-800 dark:bg-zinc-950",
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
    variant?: "default" | "destructive";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
      "focus:bg-zinc-100 dark:focus:bg-zinc-800",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
      variant === "destructive" &&
        "text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-500 dark:focus:bg-red-950 dark:focus:text-red-400",
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
    className={cn("-mx-1 my-1 h-px bg-zinc-200 dark:bg-zinc-800", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// ---------------------------------------------------------------------------
// User Account Menu component
// ---------------------------------------------------------------------------

export interface UserAccountMenuProps {
  /** Display name shown in the trigger button */
  userName?: string;
  /** Email shown below the name in the header area */
  userEmail?: string;
  /** Avatar URL — falls back to initials if omitted */
  avatarUrl?: string;
  /** When true, the Billing item is enabled; when false it is disabled */
  hasPaidPlan?: boolean;
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserAccountMenu({
  userName = "Jane Doe",
  userEmail = "jane@example.com",
  avatarUrl,
  hasPaidPlan = false,
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2",
            "text-sm font-medium text-zinc-800 shadow-sm transition-colors",
            "hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          )}
          aria-label="Open account menu"
        >
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-white dark:bg-zinc-600"
            >
              {getInitials(userName)}
            </span>
          )}

          <span className="max-w-[120px] truncate">{userName}</span>

          <ChevronDown
            size={14}
            className={cn(
              "shrink-0 text-zinc-400 transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      {/* Content */}
      <DropdownMenuContent align="end">
        {/* Account header */}
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {userName}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {userEmail}
          </p>
          {!hasPaidPlan && (
            <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              Free plan
            </span>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Account group */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>

          <DropdownMenuItem onSelect={onProfile}>
            <User size={15} aria-hidden="true" className="text-zinc-400" />
            View profile
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSettings}>
            <Settings size={15} aria-hidden="true" className="text-zinc-400" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={hasPaidPlan ? onBilling : undefined}
            disabled={!hasPaidPlan}
            aria-label={
              !hasPaidPlan
                ? "Billing — upgrade to a paid plan to access"
                : "Billing"
            }
          >
            <CreditCard
              size={15}
              aria-hidden="true"
              className="text-zinc-400"
            />
            Billing
            {!hasPaidPlan && (
              <span className="ml-auto text-[10px] text-zinc-400">
                Paid only
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuItem variant="destructive" onSelect={onSignOut}>
          <LogOut size={15} aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}