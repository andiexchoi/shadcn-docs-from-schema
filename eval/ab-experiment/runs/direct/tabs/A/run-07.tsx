"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── tiny local helpers ──────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </h2>
  );
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{children}</p>
  );
}

function Divider() {
  return <hr className="my-6 border-gray-200 dark:border-gray-700" />;
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function ToggleRow({
  id,
  label,
  description,
  defaultChecked = false,
}: ToggleRowProps) {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-0.5">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
        >
          {label}
        </Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {/* Simple accessible toggle built with a checkbox */}
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          checked
            ? "bg-indigo-600"
            : "bg-gray-200 dark:bg-gray-600"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

/* ─── tab panels ──────────────────────────────────────────────────── */

function ProfileTab() {
  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Profile Information</SectionHeading>
        <SectionDescription>
          Update your personal details and public profile.
        </SectionDescription>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-2xl font-bold select-none">
          JD
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm">
            Change avatar
          </Button>
          <p className="text-xs text-gray-400">JPG, GIF or PNG. Max 2 MB.</p>
        </div>
      </div>

      <Divider />

      <FieldGroup>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldRow>
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
          </FieldRow>
          <FieldRow>
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Doe" defaultValue="Doe" />
          </FieldRow>
        </div>

        <FieldRow>
          <Label htmlFor="username">Username</Label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400 select-none">
              @
            </span>
            <Input
              id="username"
              className="rounded-l-none"
              placeholder="janedoe"
              defaultValue="janedoe"
            />
          </div>
        </FieldRow>

        <FieldRow>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            defaultValue="jane@example.com"
          />
        </FieldRow>

        <FieldRow>
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Tell us a little about yourself…"
            defaultValue="Full-stack developer & coffee enthusiast."
            className={cn(
              "flex w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm shadow-sm",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:bg-gray-900 dark:text-gray-100 resize-none"
            )}
          />
        </FieldRow>

        <FieldRow>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yoursite.com"
          />
        </FieldRow>
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Notification Preferences</SectionHeading>
        <SectionDescription>
          Choose how and when you want to be notified.
        </SectionDescription>
      </div>

      <Divider />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Email notifications
        </p>
        <ToggleRow
          id="notif-comments"
          label="Comments"
          description="Receive an email when someone comments on your post."
          defaultChecked={true}
        />
        <ToggleRow
          id="notif-mentions"
          label="Mentions"
          description="Receive an email when someone mentions you."
          defaultChecked={true}
        />
        <ToggleRow
          id="notif-follows"
          label="New followers"
          description="Receive an email when someone follows you."
        />
        <ToggleRow
          id="notif-digest"
          label="Weekly digest"
          description="A weekly roundup of activity on your account."
          defaultChecked={true}
        />
      </div>

      <Divider />

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Push notifications
        </p>
        <ToggleRow
          id="push-everything"
          label="Everything"
          description="Push notifications for all account activity."
        />
        <ToggleRow
          id="push-direct"
          label="Direct messages"
          description="Push notifications only for direct messages."
          defaultChecked={true}
        />
        <ToggleRow
          id="push-none"
          label="No push notifications"
          description="Turn off all push notifications."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline">Reset to defaults</Button>
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  function EyeIcon({ open }: { open: boolean }) {
    return open ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  function PasswordField({
    id,
    label,
    show,
    onToggle,
  }: {
    id: string;
    label: string;
    show: boolean;
    onToggle: () => void;
  }) {
    return (
      <FieldRow>
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <Input
            id={id}
            type={show ? "text" : "password"}
            className="pr-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={onToggle}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            aria-label={show ? "Hide password" : "Show password"}
          >
            <EyeIcon open={show} />
          </button>
        </div>
      </FieldRow>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionHeading>Security Settings</SectionHeading>
        <SectionDescription>
          Manage your password and account security options.
        </SectionDescription>
      </div>

      <Divider />

      {/* Change password */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Change password
        </p>
        <FieldGroup>
          <PasswordField
            id="current-password"
            label="Current password"
            show={showCurrent}
            onToggle={() => setShowCurrent((v) => !v)}
          />
          <PasswordField
            id="new-password"
            label="New password"
            show={showNew}
            onToggle={() => setShowNew((v) => !v)}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />
        </FieldGroup>

        {/* Password strength hint */}
        <div className="rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3 text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <p className="font-semibold">Password requirements:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One number or special character</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button>Update password</Button>
        </div>
      </div>

      <Divider />

      {/* 2FA */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Two-factor authentication
        </p>
        <ToggleRow
          id="2fa-toggle"
          label="Enable 2FA"
          description="Add an extra layer of security to your account via authenticator app."
          defaultChecked={false}
        />
      </div>

      <Divider />

      {/* Sessions */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Active sessions
        </p>
        {[
          { device: "MacBook Pro — Chrome", location: "New York, US", current: true },
          { device: "iPhone 15 — Safari", location: "New York, US", current: false },
          { device: "Windows PC — Firefox", location: "London, UK", current: false },
        ].map((session) => (
          <div
            key={session.device}
            className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {session.device}
                {session.current && (
                  <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                    Current
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {session.location}
              </p>
            </div>
            {!session.current && (
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950">
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>

      <Divider />

      {/* Danger zone */}
      <div className="rounded-lg border border-red-200 dark:border-red-800 p-4 space-y-3">
        <p className="text-sm font-semibold text-red-600 dark:text-red-400">
          Danger zone
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <Button variant="destructive" size="sm">
          Delete account
        </Button>
      </div>
    </div>
  );
}

/* ─── main export ─────────────────────────────────────────────────── */

const TAB_ITEMS = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
] as const;

type TabValue = (typeof TAB_ITEMS)[number]["value"];

export default function SettingsTabs() {
  const [active, setActive] = React.useState<TabValue>("profile");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs.Root
          value={active}
          onValueChange={(v) => setActive(v as TabValue)}
        >
          {/* Tab list */}
          <Tabs.List className="flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6">
            {TAB_ITEMS.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                  "text-gray-600 dark:text-gray-400",
                  "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900",
                  "data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400",
                  "data-[state=active]:shadow-sm"
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tab panels */}
          <div className="rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
            <Tabs.Content value="profile" className="focus:outline-none">
              <ProfileTab />
            </Tabs.Content>
            <Tabs.Content value="notifications" className="focus:outline-none">
              <NotificationsTab />
            </Tabs.Content>
            <Tabs.Content value="security" className="focus:outline-none">
              <SecurityTab />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}