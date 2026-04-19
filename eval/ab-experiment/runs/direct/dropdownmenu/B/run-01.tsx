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

type Plan = "free" | "pro" | "enterprise";

interface UserAccountMenuProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  plan?: Plan;
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 h-10 px-3 py-2"
        >
          <span
            className="flex items-center justify-center w-7 h-7 rounded-full bg-muted overflow-hidden shrink-0"
            aria-hidden="true"
          >
            {userImage ? (
              <img
                src={userImage}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            )}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight max-w-[140px]">
            <span className="text-sm font-medium truncate w-full">{userName}</span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {userEmail}
            </span>
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-1 shrink-0" aria-hidden="true" />
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
        {/* Account header */}
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold leading-none">{userName}</span>
            <span className="text-xs text-muted-foreground leading-none mt-1">
              {userEmail}
            </span>
            <span
              className={cn(
                "inline-flex items-center mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium w-fit",
                isFree
                  ? "bg-muted text-muted-foreground"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
              )}
            >
              {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 h-px bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer",
              "focus:bg-accent focus:text-accent-foreground outline-none select-none"
            )}
          >
            <User className="w-4 h-4 shrink-0" aria-hidden="true" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer",
              "focus:bg-accent focus:text-accent-foreground outline-none select-none"
            )}
          >
            <Settings className="w-4 h-4 shrink-0" aria-hidden="true" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={!isFree ? onBilling : undefined}
            disabled={isFree}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm outline-none select-none",
              isFree
                ? "cursor-not-allowed opacity-50 pointer-events-none"
                : "cursor-pointer focus:bg-accent focus:text-accent-foreground"
            )}
            aria-disabled={isFree}
          >
            <CreditCard className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="flex items-center gap-1.5">
              Billing
              {isFree && (
                <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-muted text-muted-foreground leading-none">
                  Upgrade
                </span>
              )}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 h-px bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onSignOut}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer",
              "text-destructive focus:bg-destructive focus:text-destructive-foreground outline-none select-none"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}