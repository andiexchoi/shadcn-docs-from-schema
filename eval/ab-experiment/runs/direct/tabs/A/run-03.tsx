"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Small reusable helpers                                              */
/* ------------------------------------------------------------------ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
      {children}
    </h2>
  );
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{children}</p>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

function Divider() {
  return <hr className="border-gray-200 dark:border-gray-700 my-6" />;
}

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function ToggleRow({ id, label, description, defaultChecked }: ToggleRowProps) {
  const [enabled, setEnabled] = React.useState(defaultChecked ?? false);

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {description}
        </p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((v) => !v)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          enabled
            ? "bg-indigo-600"
            : "bg-gray-200 dark:bg-gray-700"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab content panels                                                  */
/* ------------------------------------------------------------------ */

function ProfilePanel() {
  return (
    <div>
      <SectionHeading>Profile</SectionHeading>
      <SectionDescription>
        Manage your personal information and public profile.
      </SectionDescription>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-6">
        <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300 select-none">
          JD
        </div>
        <div className="flex flex-col gap-1.5">
          <Button variant="outline" size="sm">
            Change photo
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG or GIF · max 2 MB
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldRow>
          <Label htmlFor="first-name">First name</Label>
          <Input id="first-name" defaultValue="Jane" />
        </FieldRow>
        <FieldRow>
          <Label htmlFor="last-name">Last name</Label>
          <Input id="last-name" defaultValue="Doe" />
        </FieldRow>
        <FieldRow>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="jane@example.com" />
        </FieldRow>
        <FieldRow>
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="janedoe" />
        </FieldRow>
        <FieldRow className="sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            defaultValue="Product designer based in NYC."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none dark:bg-gray-950 dark:border-gray-700 dark:text-gray-100"
          />
        </FieldRow>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  return (
    <div>
      <SectionHeading>Notifications</SectionHeading>
      <SectionDescription>
        Choose how and when you want to be notified.
      </SectionDescription>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-1">
          Email
        </p>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          <ToggleRow
            id="email-comments"
            label="Comments"
            description="Get notified when someone comments on your posts."
            defaultChecked
          />
          <ToggleRow
            id="email-mentions"
            label="Mentions"
            description="Get notified when you are mentioned."
            defaultChecked
          />
          <ToggleRow
            id="email-updates"
            label="Product updates"
            description="Receive occasional product news and announcements."
          />
          <ToggleRow
            id="email-digest"
            label="Weekly digest"
            description="A summary of activity from the past week."
            defaultChecked
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-1">
          Push
        </p>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          <ToggleRow
            id="push-all"
            label="All activity"
            description="Get push notifications for all new activity."
          />
          <ToggleRow
            id="push-direct"
            label="Direct messages"
            description="Only notify me for direct messages."
            defaultChecked
          />
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to defaults</Button>
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

function SecurityPanel() {
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
        <path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.39 1 12a10.06 10.06 0 0 1 4.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.61 11 8a9.12 9.12 0 0 1-1.18 2.29" />
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
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            <EyeIcon open={show} />
          </button>
        </div>
      </FieldRow>
    );
  }

  return (
    <div>
      <SectionHeading>Security</SectionHeading>
      <SectionDescription>
        Update your password and manage account security settings.
      </SectionDescription>

      {/* Change password */}
      <div className="grid grid-cols-1 gap-4 max-w-sm">
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
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Use at least 8 characters including a number and a special character.
      </p>

      <Divider />

      {/* Two-factor auth */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
          Two-factor authentication
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Add an extra layer of security to your account.
        </p>
        <Button variant="outline">Enable 2FA</Button>
      </div>

      <Divider />

      {/* Sessions */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
          Active sessions
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          These devices are currently signed in to your account.
        </p>

        <div className="space-y-3">
          {[
            { device: "MacBook Pro · Chrome", location: "New York, US", current: true },
            { device: "iPhone 15 · Safari", location: "New York, US", current: false },
          ].map(({ device, location, current }) => (
            <div
              key={device}
              className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  {device}
                  {current && (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full px-2 py-0.5 font-normal">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {location}
                </p>
              </div>
              {!current && (
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Update password</Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */

const TABS = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export default function SettingsTabs() {
  const [active, setActive] = React.useState<TabValue>("profile");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs.Root
          value={active}
          onValueChange={(v) => setActive(v as TabValue)}
          className="flex flex-col sm:flex-row gap-6"
        >
          {/* Tab list (vertical on sm+) */}
          <Tabs.List className="flex sm:flex-col gap-1 sm:w-44 shrink-0 overflow-x-auto sm:overflow-visible">
            {TABS.map(({ value, label }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className={cn(
                  "flex-1 sm:flex-none text-left px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  active === value
                    ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tab panels */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <Tabs.Content value="profile" className="focus:outline-none">
              <ProfilePanel />
            </Tabs.Content>
            <Tabs.Content value="notifications" className="focus:outline-none">
              <NotificationsPanel />
            </Tabs.Content>
            <Tabs.Content value="security" className="focus:outline-none">
              <SecurityPanel />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}