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
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt=""
                className="w-full h-full object-cover"
                aria-hidden="true"
              />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            )}
          </span>
          <span className="flex flex-col items-start min-w-0 hidden sm:flex">
            <span className="text-sm font-medium leading-tight truncate max-w-[120px]">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground leading-tight truncate max-w-[120px]">
              {userEmail}
            </span>
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-1" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "min-w-[220px] rounded-md border border-border bg-popover p-1 shadow-md",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        )}
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm font-semibold text-foreground truncate">
              {userName}
            </span>
            <span className="text-xs font-normal text-muted-foreground truncate">
              {userEmail}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 h-px bg-border" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm cursor-pointer",
              "text-foreground outline-none select-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm cursor-pointer",
              "text-foreground outline-none select-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={!isBillingDisabled ? onBilling : undefined}
            disabled={isBillingDisabled}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm",
              "text-foreground outline-none select-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              isBillingDisabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            )}
          >
            <CreditCard className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Billing</span>
            {isBillingDisabled && (
              <span className="ml-auto text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                Pro
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 h-px bg-border" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onSignOut}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm cursor-pointer",
              "text-destructive outline-none select-none",
              "focus:bg-destructive/10 focus:text-destructive",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}