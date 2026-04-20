"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserAccountMenuProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  plan?: "free" | "pro" | "enterprise";
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

export function UserAccountMenu({
  userName = "Jane Doe",
  userEmail = "jane@example.com",
  userAvatar,
  plan = "free",
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isBillingDisabled = plan === "free";

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full p-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open account menu"
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold uppercase text-muted-foreground select-none">
              {userName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
          )}
        </Button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[220px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* User info header */}
          <div className="px-3 py-2.5">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="mt-1 text-xs text-muted-foreground">{userEmail}</p>
            <span
              className={cn(
                "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                plan === "free"
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {plan} plan
            </span>
          </div>

          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border" />

          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Item
              onSelect={onProfile}
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <User className="h-4 w-4 shrink-0" aria-hidden="true" />
              Profile
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item
              onSelect={onSettings}
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
              Settings
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item
              onSelect={!isBillingDisabled ? onBilling : undefined}
              disabled={isBillingDisabled}
              className={cn(
                "relative flex select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
                isBillingDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <CreditCard className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">Billing</span>
              {isBillingDisabled && (
                <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Upgrade
                </span>
              )}
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>

          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border" />

          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Item
              onSelect={onSignOut}
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
                "text-destructive focus:bg-destructive/10 focus:text-destructive",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              Sign out
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>

          <div className="h-1" />
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}