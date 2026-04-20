"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── tiny local helpers ─────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </h3>
  );
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 mb-6">
      {children}
    </p>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

function Field({
  id,
  label,
  type = "text",
  defaultValue,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="max-w-sm"
      />
    </div>
  );
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
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((v) => !v)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500",
          enabled
            ? "bg-indigo-600"
            : "bg-gray-200 dark:bg-gray-700"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

/* ─── tab panels ─────────────────────────────────────────────── */

function ProfilePanel() {
  return (
    <div>
      <SectionHeading>Profile</SectionHeading>
      <SectionDescription>
        Manage your personal information and public profile.
      </SectionDescription>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300 select-none">
          JD
        </div>
        <div className="flex flex-col gap-1.5">
          <Button variant="outline" size="sm" className="w-fit">
            Change avatar
          </Button>
          <span className="text-xs text-gray-400">JPG, GIF or PNG. Max 2 MB.</span>
        </div>
      </div>

      <FieldGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <Field id="first-name" label="First name" defaultValue="Jane" />
          <Field id="last-name" label="Last name" defaultValue="Doe" />
        </div>
        <Field
          id="username"
          label="Username"
          defaultValue="janedoe"
          placeholder="your-handle"
        />
        <Field
          id="email"
          label="Email address"
          type="email"
          defaultValue="jane@example.com"
        />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            defaultValue="Building things on the web."
            className="max-w-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
      </FieldGroup>

      <div className="mt-8 flex gap-3">
        <Button>Save changes</Button>
        <Button variant="ghost">Cancel</Button>
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
        <p className="text-xs uppercase tracking-wide font-semibold text-gray-400 mb-2">
          Email notifications
        </p>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 px-4 divide-y divide-gray-100 dark:divide-gray-800">
          <ToggleRow
            id="notif-comments"
            label="Comments"
            description="Receive an email when someone comments on your posts."
            defaultChecked={true}
          />
          <ToggleRow
            id="notif-mentions"
            label="Mentions"
            description="Receive an email when you are mentioned."
            defaultChecked={true}
          />
          <ToggleRow
            id="notif-updates"
            label="Product updates"
            description="News about product and feature updates."
          />
          <ToggleRow
            id="notif-marketing"
            label="Marketing"
            description="Promotions, discounts and newsletters."
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide font-semibold text-gray-400 mb-2">
          Push notifications
        </p>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 px-4 divide-y divide-gray-100 dark:divide-gray-800">
          <ToggleRow
            id="push-all"
            label="Allow push notifications"
            description="Enable browser or mobile push alerts."
            defaultChecked={true}
          />
          <ToggleRow
            id="push-direct"
            label="Direct messages"
            description="Push alert for new direct messages."
            defaultChecked={true}
          />
          <ToggleRow
            id="push-reminders"
            label="Reminders"
            description="Get reminded about pending tasks."
          />
        </div>
      </div>

      <Button>Save preferences</Button>
    </div>
  );
}

function SecurityPanel() {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <SectionHeading>Security</SectionHeading>
      <SectionDescription>
        Keep your account safe with a strong password and two-factor authentication.
      </SectionDescription>

      {/* Change password */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Change password
        </p>
        <FieldGroup>
          <Field
            id="current-password"
            label="Current password"
            type={show ? "text" : "password"}
          />
          <Field
            id="new-password"
            label="New password"
            type={show ? "text" : "password"}
            placeholder="Min. 8 characters"
          />
          <Field
            id="confirm-password"
            label="Confirm new password"
            type={show ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline w-fit"
          >
            {show ? "Hide" : "Show"} passwords
          </button>
        </FieldGroup>
        <div className="mt-6 flex gap-3">
          <Button>Update password</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Two-factor authentication
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Add an extra layer of security to your account by enabling 2FA.
            </p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            Enable 2FA
          </Button>
        </div>
      </div>

      {/* Active sessions */}
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Active sessions
        </p>
        {[
          { device: "MacBook Pro · Chrome", location: "San Francisco, US", current: true },
          { device: "iPhone 15 · Safari", location: "San Francisco, US", current: false },
          { device: "Windows PC · Firefox", location: "New York, US", current: false },
        ].map((s) => (
          <div
            key={s.device}
            className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                {s.device}
                {s.current && (
                  <span className="text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-full px-2 py-0.5">
                    Current
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-400">{s.location}</p>
            </div>
            {!s.current && (
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────── */

const TABS = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
] as const;

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Manage your account preferences.
        </p>

        <Tabs.Root defaultValue="profile">
          {/* Tab list */}
          <Tabs.List className="flex gap-1 border-b border-gray-200 dark:border-gray-800 mb-8">
            {TABS.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium rounded-t-md transition-colors",
                  "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                  "data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400",
                  "data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 dark:data-[state=active]:border-indigo-400",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Panels */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <Tabs.Content value="profile" className="focus-visible:outline-none">
              <ProfilePanel />
            </Tabs.Content>
            <Tabs.Content value="notifications" className="focus-visible:outline-none">
              <NotificationsPanel />
            </Tabs.Content>
            <Tabs.Content value="security" className="focus-visible:outline-none">
              <SecurityPanel />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}