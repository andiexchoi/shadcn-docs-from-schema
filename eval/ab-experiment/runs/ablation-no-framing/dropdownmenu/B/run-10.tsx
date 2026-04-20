"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuitem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserAccountMenuProps {
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string;
  plan?: "free" | "pro" | "enterprise";
}

// ---------------------------------------------------------------------------
// Primitive re-exports styled to match shadcn/ui design tokens
// ---------------------------------------------------------------------------

const MenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuContent
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 min-w-[14rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
MenuContent.displayName = "MenuContent";

const MenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuitem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuitem> & {
    inset?: boolean;
    variant?: "default" | "destructive";
  }
>(({ className, inset, variant = "default", ...props }, ref) => (
  <DropdownMenuitem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      variant === "destructive" &&
        "text-destructive focus:bg-destructive/10 focus:text-destructive",
      className
    )}
    {...props}
  />
));
MenuItem.displayName = "MenuItem";

const MenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuLabel>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuLabel>
>(({ className, ...props }, ref) => (
  <DropdownMenuLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
MenuLabel.displayName = "MenuLabel";

const MenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuSeparator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>
>(({ className, ...props }, ref) => (
  <DropdownMenuSeparator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
MenuSeparator.displayName = "MenuSeparator";

// ---------------------------------------------------------------------------
// Avatar helper
// ---------------------------------------------------------------------------

function UserAvatar({
  src,
  name,
  size = 32,
}: {
  src?: string;
  name?: string;
  size?: number;
}) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-xs font-medium text-muted-foreground">
          {initials}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function UserAccountMenu({
  userName = "Jane Doe",
  userEmail = "jane@example.com",
  userAvatarUrl,
  plan = "free",
}: UserAccountMenuProps) {
  const isFree = plan === "free";

  const handleProfile = () => {
    console.log("Navigate to profile");
  };

  const handleSettings = () => {
    console.log("Navigate to settings");
  };

  const handleBilling = () => {
    console.log("Navigate to billing");
  };

  const handleSignOut = () => {
    console.log("Sign out");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-auto items-center gap-2 rounded-full px-2 py-1.5 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <UserAvatar src={userAvatarUrl} name={userName} />
          <span className="max-w-[120px] truncate text-sm font-medium">
            {userName}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <MenuContent align="end" className="w-56">
        {/* User info header */}
        <div className="flex items-center gap-2 px-2 py-2">
          <UserAvatar src={userAvatarUrl} name={userName} size={36} />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium leading-none">
              {userName}
            </span>
            <span className="mt-0.5 truncate text-xs text-muted-foreground">
              {userEmail}
            </span>
          </div>
        </div>

        <MenuSeparator />

        <DropdownMenuGroup>
          <MenuLabel className="text-xs font-normal text-muted-foreground">
            Account
          </MenuLabel>

          <MenuItem onSelect={handleProfile}>
            <User className="h-4 w-4" aria-hidden="true" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </MenuItem>

          <MenuItem onSelect={handleSettings}>
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </MenuItem>

          <MenuItem
            onSelect={handleBilling}
            disabled={isFree}
            className={cn(isFree && "cursor-not-allowed")}
          >
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1">Billing</span>
            {isFree ? (
              <span className="ml-auto rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                Pro only
              </span>
            ) : (
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            )}
          </MenuItem>
        </DropdownMenuGroup>

        <MenuSeparator />

        <MenuItem variant="destructive" onSelect={handleSignOut}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </MenuItem>
      </MenuContent>
    </DropdownMenu>
  );
}

export default UserAccountMenu;