"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────── small reusable helpers ─────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </h2>
  );
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{children}</p>
  );
}

function Divider() {
  return <hr className="my-6 border-gray-200 dark:border-gray-700" />;
}

function FormRow({
  id,
  label,
  type = "text",
  defaultValue,
  placeholder,
  description,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="max-w-sm"
      />
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}

/* ─────────────────────────── toggle switch ──────────────────────────────── */

function Toggle({
  id,
  defaultChecked = false,
}: {
  id: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => setChecked((v) => !v)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function ToggleRow({
  id,
  label,
  description,
  defaultChecked,
}: {
  id: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label
          htmlFor={id}
          className="text-sm font-medium cursor-pointer select-none"
        >
          {label}
        </Label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <Toggle id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

/* ─────────────────────────── tab panels ─────────────────────────────────── */

function ProfileTab() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Profile</SectionTitle>
        <SectionDescription>
          Manage your public profile information.
        </SectionDescription>
      </div>

      <Divider />

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300 select-none">
          JD
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm">
            Change avatar
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPG, GIF or PNG. Max 2 MB.
          </p>
        </div>
      </div>

      <Divider />

      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormRow
          id="first-name"
          label="First name"
          defaultValue="Jane"
          placeholder="Jane"
        />
        <FormRow
          id="last-name"
          label="Last name"
          defaultValue="Doe"
          placeholder="Doe"
        />
      </div>

      <FormRow
        id="email"
        label="Email address"
        type="email"
        defaultValue="jane.doe@example.com"
        placeholder="you@example.com"
        description="We'll never share your email with anyone."
      />

      <FormRow
        id="username"
        label="Username"
        defaultValue="janedoe"
        placeholder="janedoe"
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio" className="text-sm font-medium">
          Bio
        </Label>
        <textarea
          id="bio"
          rows={3}
          defaultValue="Product designer & coffee enthusiast."
          className="max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          A short bio about yourself.
        </p>
      </div>

      <FormRow
        id="website"
        label="Website"
        type="url"
        placeholder="https://yoursite.com"
      />

      <Divider />

      <div className="flex gap-3">
        <Button>Save changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Notifications</SectionTitle>
        <SectionDescription>
          Choose how and when you want to be notified.
        </SectionDescription>
      </div>

      <Divider />

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Email notifications
        </p>
        <div className="space-y-4">
          <ToggleRow
            id="notif-marketing"
            label="Marketing & promotions"
            description="Receive emails about new features and special offers."
            defaultChecked
          />
          <ToggleRow
            id="notif-security-email"
            label="Security alerts"
            description="Get notified about important account activity."
            defaultChecked
          />
          <ToggleRow
            id="notif-weekly"
            label="Weekly digest"
            description="A summary of your activity sent every Monday."
          />
          <ToggleRow
            id="notif-mentions"
            label="Mentions & replies"
            description="When someone mentions you or replies to your posts."
            defaultChecked
          />
        </div>
      </div>

      <Divider />

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Push notifications
        </p>
        <div className="space-y-4">
          <ToggleRow
            id="notif-push-all"
            label="Enable push notifications"
            description="Receive push notifications in supported browsers."
            defaultChecked
          />
          <ToggleRow
            id="notif-push-dnd"
            label="Do not disturb"
            description="Pause all push notifications."
          />
        </div>
      </div>

      <Divider />

      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          SMS notifications
        </p>
        <FormRow
          id="sms-phone"
          label="Phone number"
          type="tel"
          placeholder="+1 555 000 0000"
          description="Standard messaging rates may apply."
        />
        <div className="mt-4">
          <ToggleRow
            id="notif-sms"
            label="Enable SMS notifications"
            description="Receive critical alerts via text message."
          />
        </div>
      </div>

      <Divider />

      <Button>Save preferences</Button>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Security</SectionTitle>
        <SectionDescription>
          Keep your account safe and secure.
        </SectionDescription>
      </div>

      <Divider />

      {/* Change password */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Change password
        </p>
        <FormRow
          id="current-password"
          label="Current password"
          type="password"
          placeholder="••••••••"
        />
        <FormRow
          id="new-password"
          label="New password"
          type="password"
          placeholder="••••••••"
          description="Minimum 8 characters with at least one number and symbol."
        />
        <FormRow
          id="confirm-password"
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
        />
        <Button>Update password</Button>
      </div>

      <Divider />

      {/* 2FA */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Two-factor authentication (2FA)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Add an extra layer of security to your account.
          </p>
        </div>
        <ToggleRow
          id="2fa-app"
          label="Authenticator app"
          description="Use an app like Google Authenticator or Authy."
          defaultChecked
        />
        <ToggleRow
          id="2fa-sms"
          label="SMS verification"
          description="Receive a one-time code via text message."
        />
        <ToggleRow
          id="2fa-email"
          label="Email verification"
          description="Receive a one-time code via email."
        />
      </div>

      <Divider />

      {/* Sessions */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Active sessions
        </p>
        {[
          {
            device: "MacBook Pro – Chrome",
            location: "New York, US",
            current: true,
          },
          {
            device: "iPhone 15 – Safari",
            location: "New York, US",
            current: false,
          },
          {
            device: "Windows PC – Firefox",
            location: "London, UK",
            current: false,
          },
        ].map((session) => (
          <div
            key={session.device}
            className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                {session.device}
                {session.current && (
                  <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                    Current
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {session.location}
              </p>
            </div>
            {!session.current && (
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                Revoke
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" className="text-red-500 border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-950">
          Sign out all other sessions
        </Button>
      </div>

      <Divider />

      {/* Danger zone */}
      <div className="space-y-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-5">
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
          Danger zone
        </p>
        <p className="text-xs text-red-600 dark:text-red-500">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <Button variant="destructive" size="sm">
          Delete account
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────── root component ─────────────────────────────── */

const TAB_TRIGGER_CLASS = cn(
  "relative px-4 py-2.5 text-sm font-medium transition-colors",
  "text-gray-500 dark:text-gray-400",
  "hover:text-gray-900 dark:hover:text-gray-100",
  "data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400",
  "data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:rounded-full data-[state=active]:after:bg-indigo-600 dark:data-[state=active]:after:bg-indigo-400",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm"
);

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Card wrapper */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <Tabs.Root defaultValue="profile">
            {/* Tab list */}
            <div className="border-b border-gray-200 dark:border-gray-800 px-4">
              <Tabs.List className="flex gap-1 -mb-px" aria-label="Settings">
                <Tabs.Trigger value="profile" className={TAB_TRIGGER_CLASS}>
                  Profile
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="notifications"
                  className={TAB_TRIGGER_CLASS}
                >
                  Notifications
                </Tabs.Trigger>
                <Tabs.Trigger value="security" className={TAB_TRIGGER_CLASS}>
                  Security
                </Tabs.Trigger>
              </Tabs.List>
            </div>

            {/* Tab panels */}
            <Tabs.Content value="profile" className="p-6 focus:outline-none">
              <ProfileTab />
            </Tabs.Content>
            <Tabs.Content
              value="notifications"
              className="p-6 focus:outline-none"
            >
              <NotificationsTab />
            </Tabs.Content>
            <Tabs.Content value="security" className="p-6 focus:outline-none">
              <SecurityTab />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}