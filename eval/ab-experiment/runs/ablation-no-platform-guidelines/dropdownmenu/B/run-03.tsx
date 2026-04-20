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
  const isBillingDisabled = plan === "free";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <Avatar url={userAvatarUrl} name={userName} />
          <div className="flex flex-col items-start text-left leading-tight max-w-[140px]">
            <span className="text-sm font-medium truncate w-full">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {userEmail}
            </span>
          </div>
          <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className={cn(
          "z-50 min-w-[220px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        )}
      >
        {/* Account header */}
        <DropdownMenuLabel className="px-2 py-1.5 select-none">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold leading-none">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground leading-none">
              {userEmail}
            </span>
          </div>
          <PlanBadge plan={plan} />
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 -mx-1 h-px bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className={menuItemClass()}
          >
            <User className="mr-2 h-4 w-4 shrink-0" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={menuItemClass()}
          >
            <Settings className="mr-2 h-4 w-4 shrink-0" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={isBillingDisabled ? undefined : onBilling}
            disabled={isBillingDisabled}
            className={menuItemClass(isBillingDisabled)}
          >
            <CreditCard className="mr-2 h-4 w-4 shrink-0" />
            <span>Billing</span>
            {isBillingDisabled && (
              <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Pro
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 -mx-1 h-px bg-muted" />

        <DropdownMenuItem
          onSelect={onSignOut}
          className={cn(
            menuItemClass(),
            "text-destructive focus:text-destructive focus:bg-destructive/10"
          )}
        >
          <LogOut className="mr-2 h-4 w-4 shrink-0" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function menuItemClass(disabled = false) {
  return cn(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
    "transition-colors focus:bg-accent focus:text-accent-foreground",
    disabled && "pointer-events-none opacity-50"
  );
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

interface AvatarProps {
  url?: string;
  name: string;
}

function Avatar({ url, name }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted items-center justify-center">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-xs font-semibold text-muted-foreground">
          {initials}
        </span>
      )}
    </span>
  );
}

// ─── Plan badge ─────────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: Plan }) {
  const label: Record<Plan, string> = {
    free: "Free plan",
    pro: "Pro plan",
    enterprise: "Enterprise",
  };

  const color: Record<Plan, string> = {
    free: "bg-muted text-muted-foreground",
    pro: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    enterprise:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  };

  return (
    <span
      className={cn(
        "mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
        color[plan]
      )}
    >
      {label[plan]}
    </span>
  );
}