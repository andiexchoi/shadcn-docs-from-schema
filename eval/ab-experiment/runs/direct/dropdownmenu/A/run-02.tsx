"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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
    email: "jane@example.com",
    plan: "free",
  },
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isFreePlan = !user.plan || user.plan === "free";

  const initials = React.useMemo(() => {
    if (!user.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user.name]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto focus-visible:ring-2 focus-visible:ring-ring"
        >
          {/* Avatar */}
          <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-500">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? "User avatar"}
                className="aspect-square h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                {initials}
              </span>
            )}
          </span>

          {/* Name + plan */}
          <span className="hidden sm:flex flex-col items-start text-left leading-tight">
            <span className="text-sm font-medium text-foreground line-clamp-1">
              {user.name ?? "My Account"}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {user.plan ?? "free"} plan
            </span>
          </span>

          <ChevronDown className="hidden sm:block h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[220px] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* User info header */}
          <div className="px-3 py-2.5 border-b border-border mb-1">
            <p className="text-sm font-semibold text-foreground leading-none truncate">
              {user.name ?? "My Account"}
            </p>
            {user.email && (
              <p className="mt-1 text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            )}
            <span
              className={cn(
                "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                isFreePlan
                  ? "bg-muted text-muted-foreground"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
              )}
            >
              {!isFreePlan && <Crown className="h-2.5 w-2.5" />}
              {user.plan ?? "free"}
            </span>
          </div>

          {/* Profile */}
          <DropdownMenu.Item
            onSelect={onProfile}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2.5 rounded-md px-3 py-2 text-sm outline-none transition-colors",
              "text-foreground focus:bg-accent focus:text-accent-foreground"
            )}
          >
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
            Profile
          </DropdownMenu.Item>

          {/* Settings */}
          <DropdownMenu.Item
            onSelect={onSettings}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2.5 rounded-md px-3 py-2 text-sm outline-none transition-colors",
              "text-foreground focus:bg-accent focus:text-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
            Settings
          </DropdownMenu.Item>

          {/* Billing — disabled on free plan */}
          <DropdownMenu.Item
            onSelect={isFreePlan ? undefined : onBilling}
            disabled={isFreePlan}
            className={cn(
              "relative flex select-none items-center gap-2.5 rounded-md px-3 py-2 text-sm outline-none transition-colors",
              isFreePlan
                ? "cursor-not-allowed opacity-50 text-muted-foreground"
                : "cursor-pointer text-foreground focus:bg-accent focus:text-accent-foreground"
            )}
          >
            <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1">Billing</span>
            {isFreePlan && (
              <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                Pro
              </span>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          {/* Sign out */}
          <DropdownMenu.Item
            onSelect={onSignOut}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2.5 rounded-md px-3 py-2 text-sm outline-none transition-colors",
              "text-destructive focus:bg-destructive/10 focus:text-destructive"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}