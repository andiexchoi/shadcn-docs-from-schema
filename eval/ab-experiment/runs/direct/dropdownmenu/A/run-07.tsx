"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
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
  const isFreePlan = plan === "free";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold overflow-hidden shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? "User avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user.name?.charAt(0).toUpperCase() ?? "U"}</span>
            )}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            {user.name && (
              <span className="text-sm font-medium text-foreground">
                {user.name}
              </span>
            )}
            {user.email && (
              <span className="text-xs text-muted-foreground">{user.email}</span>
            )}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-1 shrink-0" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[220px] rounded-lg border border-border bg-popover p-1 shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* User info header */}
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-semibold text-foreground leading-none">
              {user.name ?? "User"}
            </p>
            {user.email && (
              <p className="text-xs text-muted-foreground mt-1 leading-none">
                {user.email}
              </p>
            )}
            <span
              className={cn(
                "inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full",
                plan === "free"
                  ? "bg-secondary text-secondary-foreground"
                  : plan === "pro"
                  ? "bg-primary/10 text-primary"
                  : "bg-amber-100 text-amber-700"
              )}
            >
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </span>
          </div>

          <DropdownMenu.Separator className="h-px bg-border my-1 -mx-1" />

          {/* Profile */}
          <DropdownMenu.Item
            onSelect={onProfile}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground cursor-pointer outline-none select-none",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground"
            )}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Profile</span>
          </DropdownMenu.Item>

          {/* Settings */}
          <DropdownMenu.Item
            onSelect={onSettings}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground cursor-pointer outline-none select-none",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:bg-accent focus:text-accent-foreground"
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </DropdownMenu.Item>

          {/* Billing */}
          <DropdownMenu.Item
            disabled={isFreePlan}
            onSelect={!isFreePlan ? onBilling : undefined}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm outline-none select-none",
              isFreePlan
                ? "text-muted-foreground cursor-not-allowed opacity-50"
                : "text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            )}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Billing</span>
            {isFreePlan && (
              <span className="ml-auto text-xs font-medium text-muted-foreground">
                Upgrade
              </span>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1 -mx-1" />

          {/* Sign out */}
          <DropdownMenu.Item
            onSelect={onSignOut}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer outline-none select-none",
              "text-destructive hover:bg-destructive/10 hover:text-destructive",
              "focus:bg-destructive/10 focus:text-destructive"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}