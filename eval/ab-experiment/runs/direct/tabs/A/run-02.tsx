"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Small local helpers
───────────────────────────────────────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </h2>
  );
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>
  );
}

function Divider() {
  return <hr className="border-gray-200 dark:border-gray-700" />;
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  autoComplete?: string;
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  defaultValue,
  autoComplete,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="max-w-md"
      />
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function ToggleRow({ label, description, defaultChecked = false }: ToggleRowProps) {
  const [enabled, setEnabled] = React.useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((v) => !v)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Tab panels
───────────────────────────────────────────────────────────────────────────── */

function ProfileTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionHeading>Profile</SectionHeading>
        <SectionDescription>
          Manage your public profile information.
        </SectionDescription>
      </div>

      <Divider />

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300 select-none">
          JD
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Profile photo
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Upload
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
              Remove
            </Button>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="first-name"
            label="First name"
            placeholder="Jane"
            defaultValue="Jane"
            autoComplete="given-name"
          />
          <Field
            id="last-name"
            label="Last name"
            placeholder="Doe"
            defaultValue="Doe"
            autoComplete="family-name"
          />
        </div>
        <Field
          id="username"
          label="Username"
          placeholder="janedoe"
          defaultValue="janedoe"
          autoComplete="username"
        />
        <Field
          id="email"
          label="Email address"
          type="email"
          placeholder="jane@example.com"
          defaultValue="jane@example.com"
          autoComplete="email"
        />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Tell us a little about yourself…"
            defaultValue="Frontend engineer & coffee enthusiast."
            className="max-w-md resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button>Save changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionHeading>Notifications</SectionHeading>
        <SectionDescription>
          Choose how and when you want to be notified.
        </SectionDescription>
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Email notifications
        </p>
        <div className="flex flex-col gap-3">
          <ToggleRow
            label="Product updates"
            description="Receive emails about new features and improvements."
            defaultChecked
          />
          <ToggleRow
            label="Account activity"
            description="Get notified about sign-ins and security events."
            defaultChecked
          />
          <ToggleRow
            label="Marketing"
            description="Occasional news, tips, and special offers."
          />
          <ToggleRow
            label="Weekly digest"
            description="A weekly summary of your activity."
            defaultChecked
          />
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Push notifications
        </p>
        <div className="flex flex-col gap-3">
          <ToggleRow
            label="Direct messages"
            description="Push alerts when someone messages you."
            defaultChecked
          />
          <ToggleRow
            label="Mentions"
            description="Push alerts when you are mentioned."
            defaultChecked
          />
          <ToggleRow
            label="Reminders"
            description="Receive reminders for upcoming events."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button>Save preferences</Button>
        <Button variant="outline">Reset to defaults</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [show, setShow] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SectionHeading>Security</SectionHeading>
        <SectionDescription>
          Keep your account safe with a strong password and two-factor
          authentication.
        </SectionDescription>
      </div>

      <Divider />

      {/* Change password */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Change password
        </p>
        <div className="flex flex-col gap-4">
          <Field
            id="current-password"
            label="Current password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
          />
          <Field
            id="new-password"
            label="New password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
          />
          <Field
            id="confirm-password"
            label="Confirm new password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
          />
          <div className="flex items-center gap-2">
            <input
              id="show-passwords"
              type="checkbox"
              checked={show}
              onChange={() => setShow((v) => !v)}
              className="h-4 w-4 rounded border-gray-300 accent-blue-600"
            />
            <label
              htmlFor="show-passwords"
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              Show passwords
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <Button>Update password</Button>
        </div>
      </div>

      <Divider />

      {/* Two-factor authentication */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Two-factor authentication (2FA)
        </p>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Authenticator app
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Use an authenticator app to generate one-time codes.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Enable
          </Button>
        </div>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              SMS verification
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Receive a one-time code via text message.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Enable
          </Button>
        </div>
      </div>

      <Divider />

      {/* Sessions */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Active sessions
        </p>
        {[
          { device: "MacBook Pro — Chrome", location: "New York, US", current: true },
          { device: "iPhone 15 — Safari", location: "New York, US", current: false },
          { device: "Windows PC — Firefox", location: "London, UK", current: false },
        ].map((session) => (
          <div
            key={session.device}
            className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
          >
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {session.device}
                {session.current && (
                  <span className="ml-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Current
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {session.location}
              </p>
            </div>
            {!session.current && (
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                Revoke
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" className="w-fit text-red-500 hover:text-red-600 border-red-200 hover:border-red-300">
          Revoke all other sessions
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────────────────────── */

const TABS = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
] as const;

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your account, notifications, and security preferences.
          </p>
        </div>

        <Tabs.Root defaultValue="profile" className="flex flex-col gap-0">
          {/* Tab list */}
          <Tabs.List
            aria-label="Settings sections"
            className="flex border-b border-gray-200 dark:border-gray-700"
          >
            {TABS.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "relative -mb-px px-4 py-2.5 text-sm font-medium transition-colors",
                  "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset",
                  "data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400",
                  "data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:rounded-full data-[state=active]:after:bg-blue-600 dark:data-[state=active]:after:bg-blue-400"
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Panels */}
          <div className="rounded-b-xl bg-white p-6 shadow-sm dark:bg-gray-900">
            <Tabs.Content value="profile" className="focus-visible:outline-none">
              <ProfileTab />
            </Tabs.Content>
            <Tabs.Content value="notifications" className="focus-visible:outline-none">
              <NotificationsTab />
            </Tabs.Content>
            <Tabs.Content value="security" className="focus-visible:outline-none">
              <SecurityTab />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}