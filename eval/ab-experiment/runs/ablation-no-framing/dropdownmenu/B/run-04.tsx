"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  plan = "free",
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isFreePlan = plan === "free";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm select-none">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium text-foreground">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </span>
          <ChevronDown
            className="w-4 h-4 text-muted-foreground ml-1"
            aria-hidden="true"
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
        {/* Account info label */}
        <DropdownMenuLabel className="px-2 py-1.5">
          <p className="text-sm font-semibold text-foreground">{userName}</p>
          <p className="text-xs font-normal text-muted-foreground truncate">
            {userEmail}
          </p>
          <span
            className={cn(
              "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              isFreePlan
                ? "bg-zinc-100 text-zinc-600"
                : "bg-indigo-100 text-indigo-700"
            )}
          >
            {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 h-px bg-border" />

        <DropdownMenuGroup>
          {/* Profile */}
          <DropdownMenuItem
            onSelect={onProfile}
            className={cn(
              "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer",
              "select-none outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            Profile
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem
            onSelect={onSettings}
            className={cn(
              "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer",
              "select-none outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings
              className="w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
            Settings
          </DropdownMenuItem>

          {/* Billing — disabled on free plan */}
          <DropdownMenuItem
            onSelect={isFreePlan ? undefined : onBilling}
            disabled={isFreePlan}
            className={cn(
              "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
              "select-none outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              isFreePlan ? "cursor-not-allowed" : "cursor-pointer"
            )}
          >
            <CreditCard
              className="w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="flex-1">Billing</span>
            {isFreePlan && (
              <span className="ml-auto text-xs text-muted-foreground font-normal">
                Upgrade to unlock
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 h-px bg-border" />

        {/* Sign out */}
        <DropdownMenuItem
          onSelect={onSignOut}
          className={cn(
            "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer",
            "select-none outline-none transition-colors",
            "text-destructive focus:bg-destructive/10 focus:text-destructive",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          )}
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}