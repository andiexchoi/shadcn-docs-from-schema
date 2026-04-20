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
  const isPaidPlan = plan !== "free";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
          aria-label="Open user account menu"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            )}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
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
          "min-w-[220px] rounded-lg border border-border bg-popover p-1 shadow-md",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        )}
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground truncate">
              {userName}
            </span>
            <span className="text-xs font-normal text-muted-foreground truncate">
              {userEmail}
            </span>
            <span
              className={cn(
                "mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                plan === "free"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary/10 text-primary"
              )}
            >
              {plan} plan
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 h-px bg-border" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer",
              "text-foreground outline-none select-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User className="w-4 h-4 shrink-0" aria-hidden="true" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer",
              "text-foreground outline-none select-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings className="w-4 h-4 shrink-0" aria-hidden="true" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={isPaidPlan ? onBilling : undefined}
            disabled={!isPaidPlan}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm",
              "text-foreground outline-none select-none",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              isPaidPlan ? "cursor-pointer" : "cursor-not-allowed"
            )}
          >
            <CreditCard className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="flex-1">Billing</span>
            {!isPaidPlan && (
              <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-muted-foreground bg-muted rounded px-1.5 py-0.5">
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
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer",
              "text-destructive outline-none select-none",
              "focus:bg-destructive/10 focus:text-destructive",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
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