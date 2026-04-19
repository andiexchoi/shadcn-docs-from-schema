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
    email: "jane@example.com",
    plan: "free",
  },
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isFreePlan = !user.plan || user.plan === "free";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold overflow-hidden">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? "User avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>
                {user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "U"}
              </span>
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
          <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[220px] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* User info header */}
          <div className="px-2 py-2 mb-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {user.name ?? "Account"}
            </p>
            {user.email && (
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            )}
            <span
              className={cn(
                "inline-flex items-center mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                isFreePlan
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {user.plan ?? "free"} plan
            </span>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          {/* Profile */}
          <DropdownMenu.Item
            onSelect={onProfile}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </DropdownMenu.Item>

          {/* Settings */}
          <DropdownMenu.Item
            onSelect={onSettings}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            Settings
          </DropdownMenu.Item>

          {/* Billing — disabled on free plan */}
          <DropdownMenu.Item
            onSelect={!isFreePlan ? onBilling : undefined}
            disabled={isFreePlan}
            className={cn(
              "relative flex select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none transition-colors",
              !isFreePlan
                ? "cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                : "cursor-not-allowed opacity-50",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="flex-1">Billing</span>
            {isFreePlan && (
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                Pro
              </span>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          {/* Sign out */}
          <DropdownMenu.Item
            onSelect={onSignOut}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none transition-colors",
              "text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}