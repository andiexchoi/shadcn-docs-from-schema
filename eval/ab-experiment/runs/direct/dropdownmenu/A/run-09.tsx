"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserAccountMenuProps {
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    plan?: "free" | "pro" | "enterprise";
  };
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

export function UserAccountMenu({
  user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    plan: "free",
  },
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isPaidPlan = user.plan && user.plan !== "free";

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-semibold shrink-0 overflow-hidden">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? "User avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
            )}
          </div>
          <div className="flex flex-col items-start min-w-0 max-w-[140px]">
            <span className="text-sm font-medium leading-tight truncate w-full">
              {user.name ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground leading-tight truncate w-full">
              {user.email ?? ""}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-1 shrink-0" />
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
          <div className="px-3 py-2 mb-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-semibold shrink-0 overflow-hidden">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? "User avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold truncate">
                  {user.name ?? "User"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.email ?? ""}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  isPaidPlan
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isPaidPlan && <Crown className="w-3 h-3" />}
                {user.plan
                  ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
                  : "Free"}{" "}
                Plan
              </span>
            </div>
          </div>

          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-muted" />

          {/* Profile */}
          <DropdownMenuPrimitive.Item
            onSelect={onProfile}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User className="w-4 h-4 text-muted-foreground" />
            <span>Profile</span>
          </DropdownMenuPrimitive.Item>

          {/* Settings */}
          <DropdownMenuPrimitive.Item
            onSelect={onSettings}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span>Settings</span>
          </DropdownMenuPrimitive.Item>

          {/* Billing — disabled on free plan */}
          <DropdownMenuPrimitive.Item
            onSelect={isPaidPlan ? onBilling : undefined}
            disabled={!isPaidPlan}
            className={cn(
              "relative flex select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
              isPaidPlan
                ? "cursor-pointer focus:bg-accent focus:text-accent-foreground"
                : "cursor-not-allowed opacity-50",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span>Billing</span>
            {!isPaidPlan && (
              <span className="ml-auto text-xs text-muted-foreground font-medium">
                Pro only
              </span>
            )}
          </DropdownMenuPrimitive.Item>

          <DropdownMenuPrimitive.Separator className="my-1 h-px bg-muted" />

          {/* Sign out */}
          <DropdownMenuPrimitive.Item
            onSelect={onSignOut}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
              "focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/40 dark:focus:text-red-400",
              "text-red-600 dark:text-red-400",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}