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
  user = {
    name: "Jane Doe",
    email: "jane@example.com",
  },
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
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1.5 h-auto focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar name={user.name} avatarUrl={user.avatarUrl} />
          <div className="flex flex-col items-start text-left min-w-0 max-w-[140px]">
            {user.name && (
              <span className="text-sm font-medium truncate w-full leading-tight">
                {user.name}
              </span>
            )}
            {user.email && (
              <span className="text-xs text-muted-foreground truncate w-full leading-tight">
                {user.email}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-1" />
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
          {/* User Info Header */}
          <div className="px-2 py-2 mb-1 border-b">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <span
              className={cn(
                "inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide",
                isFreePlan
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {plan} plan
            </span>
          </div>

          {/* Profile */}
          <DropdownMenu.Item
            onSelect={onProfile}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User className="h-4 w-4" />
            Profile
          </DropdownMenu.Item>

          {/* Settings */}
          <DropdownMenu.Item
            onSelect={onSettings}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenu.Item>

          {/* Billing — disabled on free plan */}
          <DropdownMenu.Item
            disabled={isFreePlan}
            onSelect={!isFreePlan ? onBilling : undefined}
            className={cn(
              "relative flex select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
              !isFreePlan && "cursor-pointer",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <CreditCard className="h-4 w-4" />
            <span className="flex-1">Billing</span>
            {isFreePlan && (
              <span className="text-[10px] font-medium bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full">
                Pro
              </span>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          {/* Sign Out */}
          <DropdownMenu.Item
            onSelect={onSignOut}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
              "text-destructive focus:bg-destructive/10 focus:text-destructive",
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

  return (
    <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name ?? "User avatar"}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {initials}
        </span>
      )}
    </span>
  );
}