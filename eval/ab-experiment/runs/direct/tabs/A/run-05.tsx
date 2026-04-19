"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────── tiny toggle ─────────────────────────── */
function Toggle({
  id,
  defaultChecked = false,
  label,
  description,
}: {
  id: string;
  defaultChecked?: boolean;
  label: string;
  description?: string;
}) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

/* ─────────────────────────── section wrapper ─────────────────────── */
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold leading-6">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="rounded-lg border bg-card p-4 shadow-sm">{children}</div>
    </div>
  );
}

/* ─────────────────────────── Profile tab ─────────────────────────── */
function ProfileTab() {
  return (
    <div className="space-y-6">
      <Section
        title="Personal Information"
        description="Update your personal details."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" placeholder="Jane" defaultValue="Jane" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              defaultValue="jane@example.com"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell us a little about yourself…"
              defaultValue="Product designer & coffee enthusiast."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>
        </div>
      </Section>

      <Section title="Avatar" description="Upload a profile picture.">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-2xl font-bold text-muted-foreground select-none">
            JD
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm">
              Upload image
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, GIF or PNG. Max 2 MB.
            </p>
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

/* ──────────────────────── Notifications tab ──────────────────────── */
function NotificationsTab() {
  return (
    <div className="space-y-6">
      <Section
        title="Email Notifications"
        description="Choose which emails you want to receive."
      >
        <div className="divide-y">
          <Toggle
            id="notif-marketing"
            label="Marketing & promotions"
            description="News, offers, and announcements from our team."
          />
          <Toggle
            id="notif-account"
            defaultChecked
            label="Account activity"
            description="Important alerts about your account security and sign-ins."
          />
          <Toggle
            id="notif-updates"
            defaultChecked
            label="Product updates"
            description="Learn about new features and improvements."
          />
          <Toggle
            id="notif-newsletter"
            label="Weekly newsletter"
            description="A curated digest of content sent every Monday."
          />
        </div>
      </Section>

      <Section
        title="Push Notifications"
        description="Manage browser push notifications."
      >
        <div className="divide-y">
          <Toggle
            id="push-messages"
            defaultChecked
            label="Direct messages"
            description="Get notified when someone sends you a message."
          />
          <Toggle
            id="push-mentions"
            defaultChecked
            label="Mentions"
            description="Get notified when someone mentions you."
          />
          <Toggle
            id="push-reminders"
            label="Reminders"
            description="Scheduled reminders and follow-ups."
          />
        </div>
      </Section>

      <div className="flex justify-end">
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

/* ─────────────────────────── Security tab ────────────────────────── */
function SecurityTab() {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.74-1.57 1.93-3.14 3.43-4.43" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.11 11 8-.57 1.21-1.38 2.43-2.35 3.47" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1 12C2.73 8.11 7 5 12 5s9.27 3.11 11 7c-1.73 3.89-6 7-11 7S2.73 15.89 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );

  function PasswordField({
    id,
    label,
    show,
    toggle,
  }: {
    id: string;
    label: string;
    show: boolean;
    toggle: () => void;
  }) {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <Input
            id={id}
            type={show ? "text" : "password"}
            placeholder="••••••••"
            className="pr-10"
          />
          <button
            type="button"
            onClick={toggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            <EyeIcon open={show} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Section
        title="Change Password"
        description="Use a strong password you don't use elsewhere."
      >
        <div className="grid gap-4">
          <PasswordField
            id="current-password"
            label="Current password"
            show={showCurrent}
            toggle={() => setShowCurrent((v) => !v)}
          />
          <PasswordField
            id="new-password"
            label="New password"
            show={showNew}
            toggle={() => setShowNew((v) => !v)}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            show={showConfirm}
            toggle={() => setShowConfirm((v) => !v)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Update password</Button>
        </div>
      </Section>

      <Section
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account."
      >
        <div className="divide-y">
          <Toggle
            id="2fa-app"
            defaultChecked
            label="Authenticator app"
            description="Use an authenticator app to generate one-time codes."
          />
          <Toggle
            id="2fa-sms"
            label="SMS authentication"
            description="Receive a code via text message when you sign in."
          />
        </div>
      </Section>

      <Section
        title="Active Sessions"
        description="Manage where you're signed in."
      >
        <div className="space-y-3">
          {[
            {
              device: "MacBook Pro — Chrome",
              location: "San Francisco, CA",
              current: true,
            },
            {
              device: "iPhone 15 — Safari",
              location: "San Francisco, CA",
              current: false,
            },
            {
              device: "Windows PC — Firefox",
              location: "New York, NY",
              current: false,
            },
          ].map(({ device, location, current }) => (
            <div
              key={device}
              className="flex items-center justify-between gap-4 rounded-md border px-4 py-3 text-sm"
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  {device}
                  {current && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Current
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">{location}</span>
              </div>
              {!current && (
                <Button variant="ghost" size="sm" className="shrink-0 text-destructive hover:text-destructive">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ─────────────────────────── root component ──────────────────────── */
const TABS = [
  { value: "profile", label: "Profile" },
  { value: "notifications", label: "Notifications" },
  { value: "security", label: "Security" },
] as const;

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs.Root defaultValue="profile" className="space-y-6">
          {/* Tab list */}
          <Tabs.List className="flex gap-1 rounded-lg bg-muted p-1">
            {TABS.map(({ value, label }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  "text-muted-foreground hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                )}
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tab panels */}
          <Tabs.Content value="profile" className="focus-visible:outline-none">
            <ProfileTab />
          </Tabs.Content>
          <Tabs.Content
            value="notifications"
            className="focus-visible:outline-none"
          >
            <NotificationsTab />
          </Tabs.Content>
          <Tabs.Content value="security" className="focus-visible:outline-none">
            <SecurityTab />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}