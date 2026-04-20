"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Lightweight local wrappers matching shadcn/ui's dropdown-menu style
// ---------------------------------------------------------------------------

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[14rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 shadow-md",
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
    className={cn("-mx-1 my-1 h-px bg-zinc-200 dark:bg-zinc-800", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// ---------------------------------------------------------------------------
// UserAccountMenu
// ---------------------------------------------------------------------------

interface UserAccountMenuProps {
  /** Display name shown on the trigger button */
  displayName?: string;
  /** Email shown in the header area */
  email?: string;
  /** Avatar URL; falls back to initials if omitted */
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
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserAccountMenu({
  displayName = "Jane Doe",
  email = "jane@example.com",
  avatarUrl,
  isFreePlan = false,
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
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "bg-white hover:bg-zinc-100 border border-zinc-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
            "dark:bg-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-800",
            open && "bg-zinc-100 dark:bg-zinc-800"
          )}
          aria-label="Open account menu"
        >
          {/* Avatar */}
          <Avatar avatarUrl={avatarUrl} displayName={displayName} size="sm" />

          {/* Name */}
          <span className="hidden sm:block max-w-[10rem] truncate text-zinc-800 dark:text-zinc-100">
            {displayName}
          </span>

          {/* Chevron */}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-zinc-500 transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>
      </DropdownMenuTrigger>

      {/* Content */}
      <DropdownMenuContent align="end" className="w-60">
        {/* Account header */}
        <div className="flex items-center gap-3 px-2 py-2.5">
          <Avatar avatarUrl={avatarUrl} displayName={displayName} size="md" />
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {displayName}
            </span>
            <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Main actions */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>

          <DropdownMenuItem onSelect={onProfile}>
            <User className="h-4 w-4 text-zinc-500" aria-hidden />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSettings}>
            <Settings className="h-4 w-4 text-zinc-500" aria-hidden />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onBilling}
            disabled={isFreePlan}
            className={cn(
              isFreePlan && "cursor-not-allowed"
            )}
          >
            <CreditCard
              className={cn(
                "h-4 w-4",
                isFreePlan ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500"
              )}
              aria-hidden
            />
            <span className="flex-1">Billing</span>
            {isFreePlan && (
              <span className="ml-auto rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                Free plan
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onSignOut}
            className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950 dark:focus:text-red-300"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Avatar sub-component
// ---------------------------------------------------------------------------

interface AvatarProps {
  avatarUrl?: string;
  displayName: string;
  size: "sm" | "md";
}

function Avatar({ avatarUrl, displayName, size }: AvatarProps) {
  const sizeClasses = size === "sm" ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm";

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={displayName}
        className={cn(
          "rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0",
          sizeClasses
        )}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-zinc-700 font-semibold text-white dark:bg-zinc-600",
        sizeClasses
      )}
    >
      {getInitials(displayName)}
    </span>
  );
}