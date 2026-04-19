"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── tiny local helpers ─────────────────────────────────────── */

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
    <div className="space-y-1">
      <h3 className="text-sm font-semibold leading-none tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <div className="pt-3 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  defaultValue,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
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
    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
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
        onClick={() => setChecked((c) => !c)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

/* ─── tab panels ─────────────────────────────────────────────── */

function ProfileTab() {
  return (
    <div className="space-y-6">
      <Section
        title="Personal Information"
        description="Update your name and contact details."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="first-name" label="First name" defaultValue="Jane" />
          <Field id="last-name" label="Last name" defaultValue="Doe" />
        </div>
        <Field
          id="email"
          label="Email address"
          type="email"
          defaultValue="jane.doe@example.com"
        />
        <Field
          id="phone"
          label="Phone number"
          type="tel"
          placeholder="+1 (555) 000-0000"
        />
      </Section>

      <div className="border-t pt-6">
        <Section
          title="About"
          description="A short bio that appears on your public profile."
        >
          <div className="grid gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell us a little about yourself…"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              defaultValue="Product designer & part-time coffee enthusiast."
            />
          </div>
          <Field
            id="website"
            label="Website"
            type="url"
            placeholder="https://yoursite.com"
          />
        </Section>
      </div>

      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <Section
        title="Email Notifications"
        description="Choose which emails you'd like to receive."
      >
        <Toggle
          id="notif-marketing"
          label="Marketing & promotions"
          description="News, updates, and special offers."
          defaultChecked
        />
        <Toggle
          id="notif-account"
          label="Account activity"
          description="Sign-ins, password changes, and security alerts."
          defaultChecked
        />
        <Toggle
          id="notif-product"
          label="Product updates"
          description="New features and improvements."
        />
        <Toggle
          id="notif-newsletter"
          label="Weekly newsletter"
          description="A curated digest every Friday."
        />
      </Section>

      <div className="border-t pt-6">
        <Section
          title="Push Notifications"
          description="Manage in-app and browser push alerts."
        >
          <Toggle
            id="push-messages"
            label="Direct messages"
            description="Notify me when I receive a new message."
            defaultChecked
          />
          <Toggle
            id="push-mentions"
            label="Mentions"
            description="Notify me when someone mentions me."
            defaultChecked
          />
          <Toggle
            id="push-reminders"
            label="Reminders"
            description="Task and calendar reminders."
          />
        </Section>
      </div>

      <div className="flex justify-end">
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <Section
        title="Change Password"
        description="Use a strong password you don't use elsewhere."
      >
        <Field
          id="current-password"
          label="Current password"
          type="password"
          placeholder="••••••••"
        />
        <Field
          id="new-password"
          label="New password"
          type="password"
          placeholder="••••••••"
        />
        <Field
          id="confirm-password"
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
        />
        <div className="flex justify-end">
          <Button>Update password</Button>
        </div>
      </Section>

      <div className="border-t pt-6">
        <Section
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account."
        >
          <Toggle
            id="2fa-app"
            label="Authenticator app"
            description="Use an app like Google Authenticator or Authy."
          />
          <Toggle
            id="2fa-sms"
            label="SMS verification"
            description="Receive a code via text message."
          />
        </Section>
      </div>

      <div className="border-t pt-6">
        <Section
          title="Sessions"
          description="Manage devices that are currently signed in."
        >
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
          ].map((session) => (
            <div
              key={session.device}
              className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium flex items-center gap-2">
                  {session.device}
                  {session.current && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-primary/10 text-primary rounded px-1.5 py-0.5">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.location}
                </p>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <Button variant="destructive" size="sm">
              Sign out all other sessions
            </Button>
          </div>
        </Section>
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
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences and security settings.
          </p>
        </div>

        <Tabs.Root defaultValue="profile" className="space-y-6">
          {/* Tab list */}
          <Tabs.List className="inline-flex h-9 items-center rounded-lg bg-muted p-1 text-muted-foreground w-full sm:w-auto">
            {TABS.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "inline-flex flex-1 sm:flex-none items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Tab panels */}
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <Tabs.Content value="profile" className="outline-none">
              <ProfileTab />
            </Tabs.Content>
            <Tabs.Content value="notifications" className="outline-none">
              <NotificationsTab />
            </Tabs.Content>
            <Tabs.Content value="security" className="outline-none">
              <SecurityTab />
            </Tabs.Content>
          </div>
        </Tabs.Root>
      </div>
    </div>
  );
}