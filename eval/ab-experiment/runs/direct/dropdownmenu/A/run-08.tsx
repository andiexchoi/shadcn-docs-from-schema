"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, Settings, CreditCard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAccountMenuProps {
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
  plan?: "free" | "pro" | "enterprise";
  onProfile?: () => void;
  onSettings?: () => void;
  onBilling?: () => void;
  onSignOut?: () => void;
}

export function UserAccountMenu({
  user = { name: "Jane Doe", email: "jane@example.com" },
  plan = "free",
  onProfile,
  onSettings,
  onBilling,
  onSignOut,
}: UserAccountMenuProps) {
  const isBillingDisabled = plan === "free";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-full px-3 py-1.5",
            "bg-white border border-gray-200 shadow-sm",
            "hover:bg-gray-50 transition-colors duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500",
            "text-sm font-medium text-gray-700"
          )}
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name ?? "User avatar"}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold text-xs select-none">
              {user.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "U"}
            </span>
          )}
          <span className="hidden sm:block max-w-[120px] truncate">
            {user.name ?? "Account"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 min-w-[220px] rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* User info header */}
          <div className="px-3 py-2.5 mb-1 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {user.name ?? "User"}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {user.email ?? ""}
            </p>
            <span
              className={cn(
                "inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                plan === "free"
                  ? "bg-gray-100 text-gray-500"
                  : plan === "pro"
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-amber-50 text-amber-600"
              )}
            >
              {plan}
            </span>
          </div>

          {/* Profile */}
          <DropdownMenu.Item
            onSelect={onProfile}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer select-none",
              "hover:bg-gray-50 focus:bg-gray-50 outline-none transition-colors"
            )}
          >
            <User className="h-4 w-4 text-gray-400 shrink-0" />
            Profile
          </DropdownMenu.Item>

          {/* Settings */}
          <DropdownMenu.Item
            onSelect={onSettings}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-pointer select-none",
              "hover:bg-gray-50 focus:bg-gray-50 outline-none transition-colors"
            )}
          >
            <Settings className="h-4 w-4 text-gray-400 shrink-0" />
            Settings
          </DropdownMenu.Item>

          {/* Billing */}
          <DropdownMenu.Item
            onSelect={!isBillingDisabled ? onBilling : undefined}
            disabled={isBillingDisabled}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm select-none outline-none transition-colors",
              isBillingDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            )}
          >
            <CreditCard
              className={cn(
                "h-4 w-4 shrink-0",
                isBillingDisabled ? "text-gray-300" : "text-gray-400"
              )}
            />
            <span>Billing</span>
            {isBillingDisabled && (
              <span className="ml-auto text-[10px] font-medium text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5 leading-none">
                Pro
              </span>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1.5 h-px bg-gray-100" />

          {/* Sign out */}
          <DropdownMenu.Item
            onSelect={onSignOut}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-pointer select-none outline-none transition-colors",
              "text-red-600 hover:bg-red-50 focus:bg-red-50"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}