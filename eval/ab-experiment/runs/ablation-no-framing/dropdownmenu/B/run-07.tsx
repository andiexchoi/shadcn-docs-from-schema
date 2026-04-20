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
  const isFree = plan === "free";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
            {userAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userAvatarUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            ) : (
              <User aria-hidden="true" className="w-4 h-4 text-muted-foreground" />
            )}
          </span>
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium text-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground">{userEmail}</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="ml-1 w-4 h-4 text-muted-foreground shrink-0"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "z-50 min-w-[220px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        )}
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-none">{userEmail}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 -mx-1 h-px bg-muted" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={onProfile}
            className={cn(
              "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-default",
              "select-none outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <User aria-hidden="true" className="w-4 h-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onSettings}
            className={cn(
              "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-default",
              "select-none outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <Settings aria-hidden="true" className="w-4 h-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={!isFree ? onBilling : undefined}
            disabled={isFree}
            className={cn(
              "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-default",
              "select-none outline-none transition-colors",
              "focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            )}
          >
            <CreditCard aria-hidden="true" className="w-4 h-4" />
            <span className="flex-1">Billing</span>
            {isFree && (
              <span className="ml-auto text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5 leading-none">
                Pro
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 -mx-1 h-px bg-muted" />

        <DropdownMenuItem
          onSelect={onSignOut}
          className={cn(
            "flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-default",
            "select-none outline-none transition-colors",
            "text-destructive focus:bg-destructive focus:text-destructive-foreground",
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