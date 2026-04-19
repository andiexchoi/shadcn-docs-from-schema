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
  const isFree = plan === "free";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <Avatar
            name={userName}
            avatarUrl={userAvatarUrl}
            className="h-7 w-7 shrink-0"
          />
          <span className="hidden sm:block text-sm font-medium leading-none max-w-[120px] truncate">
            {userName}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
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
        {/* User info header */}
        <div className="px-2 py-2">
          <p className="text-sm font-semibold leading-none truncate">{userName}</p>
          <p className="mt-1 text-xs text-muted-foreground truncate">{userEmail}</p>
          <span
            className={cn(
              "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              isFree
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary/10 text-primary"
            )}
          >
            {plan}
          </span>
        </div>

        <DropdownMenuSeparator className="my-1 -mx-1 h-px bg-border" />

        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1 text-xs font-semibold text-muted-foreground">
            Account
          </DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={onProfile}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isFree}
            onSelect={!isFree ? onBilling : undefined}
            className={cn(
              "flex select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              !isFree && "cursor-pointer"
            )}
          >
            <CreditCard className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Billing</span>
            {isFree && (
              <span className="ml-auto text-[10px] font-medium text-muted-foreground">
                Upgrade to unlock
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 -mx-1 h-px bg-border" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onSignOut}
            className={cn(
              "flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "transition-colors",
              "focus:bg-destructive/10 focus:text-destructive",
              "text-destructive",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// Internal Avatar component
// ---------------------------------------------------------------------------

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  className?: string;
}

function Avatar({ name, avatarUrl, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold",
        className
      )}
    >
      {initials}
    </span>
  );
}