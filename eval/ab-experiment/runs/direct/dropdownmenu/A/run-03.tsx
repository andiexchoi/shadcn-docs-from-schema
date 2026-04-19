"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown, Lock } from "lucide-react";
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
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <Avatar name={user.name} avatarUrl={user.avatarUrl} />
          <div className="flex flex-col items-start text-left min-w-0 hidden sm:flex">
            <span className="text-sm font-medium leading-none truncate max-w-[120px]">
              {user.name ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground leading-none mt-1 truncate max-w-[120px]">
              {user.email ?? ""}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-1" />
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
            <div className="flex items-center gap-3">
              <Avatar name={user.name} avatarUrl={user.avatarUrl} size="lg" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold leading-tight truncate">
                  {user.name ?? "User"}
                </span>
                <span className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
                  {user.email ?? ""}
                </span>
                <PlanBadge plan={user.plan} />
              </div>
            </div>
          </div>

          <DropdownMenuPrimitive.Separator className="h-px bg-border my-1 -mx-1" />

          {/* Profile */}
          <DropdownMenuPrimitive.Item
            onSelect={onProfile}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-sm cursor-pointer select-none outline-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Profile</span>
          </DropdownMenuPrimitive.Item>

          {/* Settings */}
          <DropdownMenuPrimitive.Item
            onSelect={onSettings}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-sm cursor-pointer select-none outline-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span>Settings</span>
          </DropdownMenuPrimitive.Item>

          {/* Billing — disabled on free plan */}
          <DropdownMenuPrimitive.Item
            disabled={isFreePlan}
            onSelect={!isFreePlan ? onBilling : undefined}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-sm select-none outline-none",
              isFreePlan
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span>Billing</span>
            {isFreePlan && (
              <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Upgrade
              </span>
            )}
          </DropdownMenuPrimitive.Item>

          <DropdownMenuPrimitive.Separator className="h-px bg-border my-1 -mx-1" />

          {/* Sign out */}
          <DropdownMenuPrimitive.Item
            onSelect={onSignOut}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-sm cursor-pointer select-none outline-none",
              "text-destructive focus:bg-destructive/10 focus:text-destructive",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuPrimitive.Item>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

// ── Avatar helper ──────────────────────────────────────────────────────────────

interface AvatarProps {
  name?: string;
  avatarUrl?: string;
  size?: "sm" | "lg";
}

function Avatar({ name, avatarUrl, size = "sm" }: AvatarProps) {
  const initials = getInitials(name);
  const sizeClass = size === "lg" ? "h-9 w-9 text-sm" : "h-7 w-7 text-xs";

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name ?? "User avatar"}
        className={cn("rounded-full object-cover shrink-0", sizeClass)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold shrink-0 select-none",
        sizeClass
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Plan badge ─────────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan?: string }) {
  if (!plan) return null;

  const styles: Record<string, string> = {
    free: "bg-secondary text-secondary-foreground",
    pro: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    enterprise:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  };

  const label: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  return (
    <span
      className={cn(
        "mt-1 inline-block self-start rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
        styles[plan] ?? styles.free
      )}
    >
      {label[plan] ?? plan}
    </span>
  );
}