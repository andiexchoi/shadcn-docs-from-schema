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
  const isFree = plan === "free";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium select-none">
            {userName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="w-4 h-4 text-muted-foreground ml-1"
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
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {userEmail}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 h-px bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User aria-hidden="true" className="w-4 h-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={cn(
              "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings aria-hidden="true" className="w-4 h-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isFree}
            onSelect={!isFree ? onBilling : undefined}
            className={cn(
              "relative flex select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              isFree ? "cursor-not-allowed" : "cursor-pointer"
            )}
          >
            <CreditCard aria-hidden="true" className="w-4 h-4" />
            <span className="flex-1">Billing</span>
            {isFree && (
              <span className="ml-auto text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 leading-tight">
                Pro only
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 h-px bg-muted" />

        <DropdownMenuItem
          onSelect={onSignOut}
          className={cn(
            "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
            "transition-colors focus:bg-accent focus:text-accent-foreground text-destructive",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          )}
        >
          <LogOut aria-hidden="true" className="w-4 h-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}