"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserAccountMenuProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  plan?: "free" | "pro" | "enterprise";
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

export function UserAccountMenu({
  userName = "Jane Doe",
  userEmail = "jane@example.com",
  userImage,
  plan = "free",
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isFree = plan === "free";

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 rounded-full border border-border bg-background hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open user account menu"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted overflow-hidden shrink-0">
            {userImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userImage}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            )}
          </span>
          <span className="text-sm font-medium text-foreground max-w-[120px] truncate hidden sm:inline">
            {userName}
          </span>
        </Button>
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          sideOffset={8}
          align="end"
          className={cn(
            "z-50 min-w-[220px] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* User info header */}
          <div className="px-3 py-2.5 mb-1">
            <p className="text-sm font-semibold text-foreground leading-tight truncate">
              {userName}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {userEmail}
            </p>
            <span
              className={cn(
                "inline-flex items-center mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide",
                isFree
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {plan} plan
            </span>
          </div>

          <DropdownMenuPrimitive.Separator className="h-px bg-border my-1 -mx-1" />

          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Label className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground select-none">
              Account
            </DropdownMenuPrimitive.Label>

            <DropdownMenuPrimitive.Item
              onSelect={onProfile}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm cursor-pointer outline-none select-none",
                "text-foreground hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground",
                "transition-colors"
              )}
            >
              <User className="w-4 h-4 shrink-0" aria-hidden="true" />
              Profile
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item
              onSelect={onSettings}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm cursor-pointer outline-none select-none",
                "text-foreground hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground",
                "transition-colors"
              )}
            >
              <Settings className="w-4 h-4 shrink-0" aria-hidden="true" />
              Settings
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Item
              onSelect={!isFree ? onBilling : undefined}
              disabled={isFree}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm outline-none select-none",
                "transition-colors",
                isFree
                  ? "opacity-50 cursor-not-allowed text-muted-foreground"
                  : "cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              )}
              aria-disabled={isFree}
            >
              <CreditCard className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">Billing</span>
              {isFree && (
                <span className="ml-auto text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded text-muted-foreground uppercase tracking-wide">
                  Upgrade
                </span>
              )}
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>

          <DropdownMenuPrimitive.Separator className="h-px bg-border my-1 -mx-1" />

          <DropdownMenuPrimitive.Group>
            <DropdownMenuPrimitive.Item
              onSelect={onSignOut}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm cursor-pointer outline-none select-none",
                "text-destructive hover:bg-destructive/10 hover:text-destructive",
                "focus:bg-destructive/10 focus:text-destructive",
                "transition-colors"
              )}
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              Sign out
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Group>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}