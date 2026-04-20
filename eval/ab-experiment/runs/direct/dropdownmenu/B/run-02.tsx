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
  const isBillingDisabled = plan === "free";

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full px-3 py-2 h-auto"
          aria-label="Open user account menu"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground overflow-hidden">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name ?? "User avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-4 w-4" aria-hidden="true" />
            )}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight max-w-[140px]">
            {user.name && (
              <span className="text-sm font-medium truncate w-full">
                {user.name}
              </span>
            )}
            {user.email && (
              <span className="text-xs text-muted-foreground truncate w-full">
                {user.email}
              </span>
            )}
          </span>
        </Button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[220px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2"
          )}
        >
          {/* User identity header */}
          <DropdownMenuPrimitive.Label className="px-2 py-1.5">
            <div className="flex flex-col gap-0.5">
              {user.name && (
                <span className="text-sm font-semibold leading-none">
                  {user.name}
                </span>
              )}
              {user.email && (
                <span className="text-xs text-muted-foreground leading-none">
                  {user.email}
                </span>
              )}
              <span
                className={cn(
                  "mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                  plan === "free"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {plan} plan
              </span>
            </div>
          </DropdownMenuPrimitive.Label>

          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-muted" />

          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Item
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
              onSelect={onProfile}
            >
              <User className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Profile</span>
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
              onSelect={onSettings}
            >
              <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Settings</span>
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item
              disabled={isBillingDisabled}
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-accent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
              onSelect={isBillingDisabled ? undefined : onBilling}
            >
              <CreditCard className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Billing</span>
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
              className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                "focus:bg-destructive/10 focus:text-destructive text-destructive",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              )}
              onSelect={onSignOut}
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Sign out</span>
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}