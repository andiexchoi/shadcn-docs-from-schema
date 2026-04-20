"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserAccountMenuProps {
  userName?: string;
  userEmail?: string;
  userInitials?: string;
  plan?: "free" | "pro" | "enterprise";
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

export function UserAccountMenu({
  userName = "Jane Doe",
  userEmail = "jane@example.com",
  userInitials = "JD",
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
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
          aria-label="Open account menu"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold select-none">
            {userInitials}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
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
          {/* Account info header */}
          <div className="px-2 py-2 mb-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="mt-1 text-xs text-muted-foreground leading-none">{userEmail}</p>
            <span
              className={cn(
                "inline-flex items-center mt-2 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                plan === "free"
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {plan} plan
            </span>
          </div>

          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-muted" />

          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Label className="px-2 py-1 text-xs font-semibold text-muted-foreground">
              Account
            </DropdownMenuPrimitive.Label>

            <DropdownMenuPrimitive.Item
              onSelect={onProfile}
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <User className="h-4 w-4" aria-hidden="true" />
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
              <Settings className="h-4 w-4" aria-hidden="true" />
              Settings
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item
              onSelect={!isBillingDisabled ? onBilling : undefined}
              disabled={isBillingDisabled}
              className={cn(
                "relative flex select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                isBillingDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              <span className="flex-1">Billing</span>
              {isBillingDisabled && (
                <span className="ml-auto text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  Pro only
                </span>
              )}
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>

          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-muted" />

          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Item
              onSelect={onSignOut}
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "text-destructive focus:bg-destructive/10 focus:text-destructive",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}