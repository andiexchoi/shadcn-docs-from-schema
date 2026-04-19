"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

type Plan = "free" | "pro" | "enterprise";

interface UserAccountMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    plan?: Plan;
  };
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

function Avatar({ src, name }: { src?: string | null; name?: string | null }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "User avatar"}
        className="h-8 w-8 rounded-full object-cover ring-2 ring-white"
      />
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-semibold text-white ring-2 ring-white">
      {initials}
    </div>
  );
}

function PlanBadge({ plan }: { plan: Plan }) {
  if (plan === "free") {
    return (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
        Free
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
      <Crown className="h-2.5 w-2.5" />
      {plan}
    </span>
  );
}

const menuItemBase =
  "relative flex cursor-pointer select-none items-center gap-2.5 rounded-md px-2.5 py-2 text-sm outline-none transition-colors";

export function UserAccountMenu({
  user = {
    name: "Jane Doe",
    email: "jane@example.com",
    image: null,
    plan: "free",
  },
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const plan: Plan = user.plan ?? "free";
  const isFree = plan === "free";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm",
            "transition-all hover:border-slate-300 hover:shadow",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
            "data-[state=open]:border-violet-300 data-[state=open]:ring-2 data-[state=open]:ring-violet-500/30"
          )}
          aria-label="Open user menu"
        >
          <Avatar src={user.image} name={user.name} />
          <span className="max-w-[120px] truncate text-sm font-medium text-slate-700">
            {user.name ?? "Account"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[240px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* User info header */}
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-3 mb-1">
            <Avatar src={user.image} name={user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user.name ?? "User"}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email ?? ""}</p>
            </div>
            <PlanBadge plan={plan} />
          </div>

          {/* Profile */}
          <DropdownMenu.Item
            className={cn(
              menuItemBase,
              "text-slate-700 hover:bg-slate-100 focus:bg-slate-100"
            )}
            onSelect={onProfile}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <User className="h-4 w-4" />
            </span>
            Profile
          </DropdownMenu.Item>

          {/* Settings */}
          <DropdownMenu.Item
            className={cn(
              menuItemBase,
              "text-slate-700 hover:bg-slate-100 focus:bg-slate-100"
            )}
            onSelect={onSettings}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <Settings className="h-4 w-4" />
            </span>
            Settings
          </DropdownMenu.Item>

          {/* Billing */}
          <DropdownMenu.Item
            disabled={isFree}
            className={cn(
              menuItemBase,
              isFree
                ? "cursor-not-allowed text-slate-400"
                : "text-slate-700 hover:bg-slate-100 focus:bg-slate-100"
            )}
            onSelect={isFree ? undefined : onBilling}
          >
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md",
                isFree ? "bg-slate-50 text-slate-300" : "bg-slate-100 text-slate-600"
              )}
            >
              <CreditCard className="h-4 w-4" />
            </span>
            <span className="flex-1">Billing</span>
            {isFree && (
              <span className="ml-auto rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-600">
                Upgrade
              </span>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1.5 h-px bg-slate-100" />

          {/* Sign out */}
          <DropdownMenu.Item
            className={cn(
              menuItemBase,
              "text-red-600 hover:bg-red-50 focus:bg-red-50"
            )}
            onSelect={onSignOut}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-red-500">
              <LogOut className="h-4 w-4" />
            </span>
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}