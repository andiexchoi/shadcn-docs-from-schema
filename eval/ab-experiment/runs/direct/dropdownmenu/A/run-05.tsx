"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Plan = "free" | "pro" | "enterprise";

interface UserAccountMenuProps {
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    plan?: Plan;
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
  const isPaidPlan = user.plan && user.plan !== "free";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <Avatar name={user.name} avatarUrl={user.avatarUrl} />
          <div className="flex flex-col items-start text-left leading-tight max-w-[120px]">
            {user.name && (
              <span className="text-sm font-medium truncate w-full">
                {user.name}
              </span>
            )}
            {user.plan && (
              <span
                className={cn(
                  "text-xs capitalize",
                  isPaidPlan ? "text-amber-500 font-semibold" : "text-muted-foreground"
                )}
              >
                {isPaidPlan && <Crown className="inline-block w-3 h-3 mr-0.5 mb-0.5" />}
                {user.plan}
              </span>
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-1 shrink-0" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
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
            <p className="text-sm font-semibold leading-none truncate">
              {user.name || "Account"}
            </p>
            {user.email && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {user.email}
              </p>
            )}
          </div>

          <DropdownMenu.Separator className="h-px bg-muted mx-1 mb-1" />

          {/* Profile */}
          <DropdownMenu.Item
            onSelect={onProfile}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Profile</span>
          </DropdownMenu.Item>

          {/* Settings */}
          <DropdownMenu.Item
            onSelect={onSettings}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </DropdownMenu.Item>

          {/* Billing — disabled on free plan */}
          <DropdownMenu.Item
            disabled={!isPaidPlan}
            onSelect={!isPaidPlan ? undefined : onBilling}
            className={cn(
              "relative flex select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
              isPaidPlan
                ? "cursor-pointer focus:bg-accent focus:text-accent-foreground"
                : "cursor-not-allowed opacity-50",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Billing</span>
            {!isPaidPlan && (
              <span className="ml-auto text-xs bg-muted text-muted-foreground rounded px-1.5 py-0.5 leading-none">
                Pro
              </span>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-muted mx-1 my-1" />

          {/* Sign out */}
          <DropdownMenu.Item
            onSelect={onSignOut}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none transition-colors",
              "focus:bg-destructive focus:text-destructive-foreground text-destructive",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
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

function Avatar({
  name,
  avatarUrl,
}: {
  name?: string;
  avatarUrl?: string;
}) {
  const initials = React.useMemo(() => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ?? "User avatar"}
        className="w-7 h-7 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 select-none">
      {initials}
    </div>
  );
}