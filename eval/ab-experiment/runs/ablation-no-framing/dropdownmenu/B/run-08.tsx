"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Plan = "free" | "pro" | "enterprise";

interface UserAccountMenuProps {
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string;
  plan?: Plan;
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
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          {/* Avatar */}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 overflow-hidden">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt={userName}
                className="h-full w-full object-cover"
              />
            ) : (
              <User aria-hidden="true" className="h-4 w-4 text-slate-600" />
            )}
          </span>

          {/* Name + email */}
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium text-foreground">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </span>

          <ChevronDown
            aria-hidden="true"
            className="ml-1 h-4 w-4 text-muted-foreground shrink-0"
          />
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
        {/* Account info header */}
        <DropdownMenuLabel className="flex flex-col px-2 py-1.5">
          <span className="text-sm font-semibold">{userName}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {userEmail}
          </span>
          <span
            className={cn(
              "mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
              plan === "free"
                ? "bg-slate-100 text-slate-600"
                : "bg-emerald-100 text-emerald-700"
            )}
          >
            {plan} plan
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 h-px bg-border" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User aria-hidden="true" className="h-4 w-4 shrink-0" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings aria-hidden="true" className="h-4 w-4 shrink-0" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isBillingDisabled}
            onSelect={!isBillingDisabled ? onBilling : undefined}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
            )}
          >
            <CreditCard aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="flex-1">Billing</span>
            {isBillingDisabled && (
              <span className="ml-auto text-[10px] font-medium text-muted-foreground">
                Upgrade to access
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 h-px bg-border" />

        <DropdownMenuItem
          onSelect={onSignOut}
          className={cn(
            "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
            "text-destructive focus:bg-destructive/10 focus:text-destructive",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          )}
        >
          <LogOut aria-hidden="true" className="h-4 w-4 shrink-0" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}