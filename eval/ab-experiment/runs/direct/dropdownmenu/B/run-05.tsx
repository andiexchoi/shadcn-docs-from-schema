"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserAccountMenuProps {
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string;
  plan?: "free" | "pro" | "enterprise";
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

export function UserAccountMenu({
  userName = "Jane Doe",
  userEmail = "jane@example.com",
  userAvatarUrl,
  plan = "free",
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isBillingDisabled = plan === "free";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          {userAvatarUrl ? (
            <img
              src={userAvatarUrl}
              alt=""
              aria-hidden="true"
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground select-none"
            >
              {userName.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="max-w-[120px] truncate text-sm font-medium">
            {userName}
          </span>
          <ChevronDown aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
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
        {/* User identity */}
        <DropdownMenuLabel className="px-2 py-1.5">
          <p className="text-sm font-semibold leading-none">{userName}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-none truncate">
            {userEmail}
          </p>
          <span
            className={cn(
              "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              plan === "free"
                ? "bg-muted text-muted-foreground"
                : "bg-primary/10 text-primary"
            )}
          >
            {plan}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 -mx-1 h-px bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User aria-hidden="true" className="h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings aria-hidden="true" className="h-4 w-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isBillingDisabled}
            onSelect={isBillingDisabled ? undefined : onBilling}
            className={cn(
              "flex select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              !isBillingDisabled && "cursor-pointer"
            )}
          >
            <CreditCard aria-hidden="true" className="h-4 w-4" />
            <span className="flex-1">Billing</span>
            {isBillingDisabled && (
              <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Upgrade
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 -mx-1 h-px bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onSignOut}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors",
              "text-destructive focus:bg-destructive/10 focus:text-destructive",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}