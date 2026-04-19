"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserAccountMenuProps {
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
  plan?: "free" | "pro" | "enterprise";
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
  const isFree = plan === "free";

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
          aria-label="Open user account menu"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              aria-hidden="true"
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium select-none"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          )}
          <span className="hidden sm:block text-sm font-medium leading-none max-w-[120px] truncate">
            {user.name ?? "Account"}
          </span>
        </Button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[220px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* User info header */}
          <div className="px-2 py-2 mb-1">
            <p className="text-sm font-medium leading-none truncate">
              {user.name ?? "Account"}
            </p>
            {user.email && (
              <p className="mt-1 text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            )}
            <span
              className={cn(
                "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                isFree
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {plan}
            </span>
          </div>

          <DropdownMenuPrimitive.Separator className="my-1 -mx-1 h-px bg-border" />

          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Item
              onSelect={onProfile}
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <User aria-hidden="true" className="h-4 w-4 shrink-0" />
              Profile
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item
              onSelect={onSettings}
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <Settings aria-hidden="true" className="h-4 w-4 shrink-0" />
              Settings
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item
              onSelect={!isFree ? onBilling : undefined}
              disabled={isFree}
              className={cn(
                "relative flex select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                isFree
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
              aria-describedby={isFree ? "billing-disabled-hint" : undefined}
            >
              <CreditCard aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="flex-1">Billing</span>
              {isFree && (
                <span
                  id="billing-disabled-hint"
                  className="ml-auto text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Upgrade
                </span>
              )}
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>

          <DropdownMenuPrimitive.Separator className="my-1 -mx-1 h-px bg-border" />

          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Item
              onSelect={onSignOut}
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-destructive/10 focus:text-destructive text-destructive",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <LogOut aria-hidden="true" className="h-4 w-4 shrink-0" />
              Sign out
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}