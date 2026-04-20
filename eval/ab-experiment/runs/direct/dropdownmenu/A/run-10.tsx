"use client";

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
  const isFree = plan === "free";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0 overflow-hidden">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? "User avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
            )}
          </span>
          <span className="flex flex-col items-start leading-tight hidden sm:flex">
            {user.name && (
              <span className="text-sm font-medium truncate max-w-[120px]">
                {user.name}
              </span>
            )}
            {user.email && (
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {user.email}
              </span>
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
            "z-50 min-w-[220px] rounded-md border bg-popover p-1 shadow-md",
            "text-popover-foreground",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* User info header */}
          <div className="px-3 py-2 border-b mb-1">
            <p className="text-sm font-semibold leading-none">
              {user.name ?? "User"}
            </p>
            {user.email && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {user.email}
              </p>
            )}
            <span
              className={cn(
                "inline-block mt-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wide",
                isFree
                  ? "bg-muted text-muted-foreground"
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
              "flex items-center gap-2 px-3 py-2 text-sm rounded-sm cursor-pointer outline-none select-none",
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              "transition-colors"
            )}
          >
            <User className="w-4 h-4" />
            Profile
          </DropdownMenu.Item>

          {/* Settings */}
          <DropdownMenu.Item
            onSelect={onSettings}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-sm cursor-pointer outline-none select-none",
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              "transition-colors"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </DropdownMenu.Item>

          {/* Billing — disabled on free plan */}
          <DropdownMenu.Item
            onSelect={!isFree ? onBilling : undefined}
            disabled={isFree}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-sm outline-none select-none",
              "transition-colors",
              isFree
                ? "cursor-not-allowed opacity-50 text-muted-foreground"
                : "cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            )}
          >
            <CreditCard className="w-4 h-4" />
            <span>Billing</span>
            {isFree && (
              <span className="ml-auto text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded-full">
                Pro
              </span>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          {/* Sign out */}
          <DropdownMenu.Item
            onSelect={onSignOut}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm rounded-sm cursor-pointer outline-none select-none",
              "text-destructive hover:bg-destructive/10 focus:bg-destructive/10",
              "transition-colors"
            )}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}