"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ── small local helpers ───────────────────────────────────────────── */

function FieldRow({
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
      />
    </div>
  );
}

function Toggle({
  id,
  label,
  description,
  defaultChecked = false,
}: {
  id: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium leading-none">{label}</span>
        {description && (
          <span className="text-xs text-gray-500">{description}</span>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
          checked ? "bg-gray-900" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-gray-900">{children}</h3>
  );
}

function Divider() {
  return <hr className="border-gray-200" />;
}

/* ── tab content panels ────────────────────────────────────────────── */

function ProfilePanel() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionHeading>Personal Information</SectionHeading>
        <p className="mt-1 text-sm text-gray-500">
          Update your name, email, and public profile details.
        </p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold text-gray-600 select-none">
          JD
        </div>
        <div className="flex flex-col gap-1">
          <Button variant="outline" size="sm" className="w-fit">
            Change avatar
          </Button>
          <span className="text-xs text-gray-500">
            JPG, GIF or PNG. Max 2 MB.
          </span>
        </div>
      </div>

      <Divider />

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldRow id="first-name" label="First name" defaultValue="Jane" />
        <FieldRow id="last-name" label="Last name" defaultValue="Doe" />
      </div>

      <FieldRow
        id="email"
        label="Email address"
        type="email"
        defaultValue="jane.doe@example.com"
      />

      <FieldRow
        id="username"
        label="Username"
        defaultValue="janedoe"
        placeholder="your-username"
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          rows={3}
          defaultValue="Product designer & occasional developer."
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 resize-none"
        />
        <span className="text-xs text-gray-500">
          Brief description for your profile. Max 200 characters.
        </span>
      </div>

      <FieldRow
        id="website"
        label="Website"
        type="url"
        placeholder="https://yoursite.com"
      />

      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionHeading>Notification Preferences</SectionHeading>
        <p className="mt-1 text-sm text-gray-500">
          Choose when and how you want to be notified.
        </p>
      </div>

      <Divider />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-700">Email notifications</p>
        <Toggle
          id="notif-comments"
          label="Comments"
          description="Receive an email when someone comments on your post."
          defaultChecked
        />
        <Toggle
          id="notif-mentions"
          label="Mentions"
          description="Receive an email when you are mentioned."
          defaultChecked
        />
        <Toggle
          id="notif-follows"
          label="New followers"
          description="Receive an email when someone follows you."
        />
        <Toggle
          id="notif-digest"
          label="Weekly digest"
          description="A weekly summary of your activity and stats."
          defaultChecked
        />
        <Toggle
          id="notif-marketing"
          label="Marketing emails"
          description="News, updates, and promotions from us."
        />
      </div>

      <Divider />

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-700">Push notifications</p>
        <Toggle
          id="push-all"
          label="Allow push notifications"
          description="Enable browser push notifications."
          defaultChecked
        />
        <Toggle
          id="push-dms"
          label="Direct messages"
          description="Push alert for new direct messages."
          defaultChecked
        />
        <Toggle
          id="push-reminders"
          label="Reminders"
          description="Push alert for scheduled reminders."
        />
      </div>

      <div className="flex justify-end">
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

function SecurityPanel() {
  const [show, setShow] = React.useState({
    current: false,
    next: false,
    confirm: false,
  });

  const toggle = (key: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  function PasswordField({
    id,
    label,
    fieldKey,
  }: {
    id: string;
    label: string;
    fieldKey: keyof typeof show;
  }) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <Input
            id={id}
            type={show[fieldKey] ? "text" : "password"}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => toggle(fieldKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={show[fieldKey] ? "Hide password" : "Show password"}
          >
            {show[fieldKey] ? (
              /* eye-off */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              /* eye */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Change password */}
      <div>
        <SectionHeading>Change Password</SectionHeading>
        <p className="mt-1 text-sm text-gray-500">
          Use a strong password you don't use elsewhere.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <PasswordField
          id="current-password"
          label="Current password"
          fieldKey="current"
        />
        <PasswordField
          id="new-password"
          label="New password"
          fieldKey="next"
        />
        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          fieldKey="confirm"
        />
      </div>

      <div className="flex justify-end">
        <Button>Update password</Button>
      </div>

      <Divider />

      {/* Two-factor */}
      <div>
        <SectionHeading>Two-Factor Authentication</SectionHeading>
        <p className="mt-1 text-sm text-gray-500">
          Add an extra layer of security to your account.
        </p>
      </div>

      <Toggle
        id="2fa-toggle"
        label="Enable two-factor authentication"
        description="Require a one-time code in addition to your password."
      />

      <Divider />

      {/* Sessions */}
      <div>
        <SectionHeading>Active Sessions</SectionHeading>
        <p className="mt-1 text-sm text-gray-500">
          Manage devices currently signed in to your account.
        </p>
      </div>

      {[
        {
          device: "MacBook Pro — Safari",
          location: "New York, US",
          time: "Active now",
          current: true,
        },
        {
          device: "iPhone 15 — Mobile Safari",
          location: "New York, US",
          time: "2 hours ago",
          current: false,
        },
        {
          device: "Windows PC — Chrome",
          location: "London, UK",
          time: "3 days ago",
          current: false,
        },
      ].map((s) => (
        <div
          key={s.device}
          className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
        >
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{s.device}</span>
              {s.current && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  This device
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {s.location} · {s.time}
            </span>
          </div>
          {!s.current && (
            <Button variant="outline" size="sm">
              Revoke
            </Button>
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <Button variant="destructive">Sign out all other devices</Button>
      </div>

      <Divider />

      {/* Danger zone */}
      <div>
        <SectionHeading>Danger Zone</SectionHeading>
        <p className="mt-1 text-sm text-gray-500">
          Irreversible and destructive actions.
        </p>
      </div>

      <div className="rounded-lg border border-red-200 p-4 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-red-600">
            Delete account
          </span>
          <span className="text-xs text-gray-500">
            Permanently delete your account and all associated data.
          </span>
        </div>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </div>
    </div>
  );
}

/* ── main exported component ───────────────────────────────────────── */

const TABS = [
  { value: "profile", label: "Profile", panel: <ProfilePanel /> },
  { value: "notifications", label: "Notifications", panel: <NotificationsPanel /> },
  { value: "security", label: "Security", panel: <SecurityPanel /> },
] as const;

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs.Root defaultValue="profile" className="flex flex-col gap-0">
          {/* Tab list */}
          <Tabs.List className="flex border-b border-gray-200 bg-transparent">
            {TABS.map(({ value, label }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className={cn(
                  "relative px-5 py-3 text-sm font-medium text-gray-500 transition-colors",
                  "hover:text-gray-900",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-900",
                  "data-[state=active]:text-gray-900",
                  // active indicator bar
                  "after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:rounded-full after:bg-gray-900 after:opacity-0",
                  "data-[state=active]:after:opacity-100"
                )}
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tab panels */}
          {TABS.map(({ value, panel }) => (
            <Tabs.Content
              key={value}
              value={value}
              className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm focus-visible:outline-none"
            >
              {panel}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </div>
  );
}