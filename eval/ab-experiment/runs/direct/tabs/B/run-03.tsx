"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-1.5 mb-4">{children}</div>;
}

function Divider() {
  return <hr className="my-6 border-border" />;
}

function ToggleSwitch({
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
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((prev) => !prev)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}

function ProfileTab() {
  return (
    <div>
      <SectionHeading
        title="Profile"
        description="Update your personal information and public-facing details."
      />

      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
        <FormRow>
          <Label htmlFor="first-name">First name</Label>
          <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
        </FormRow>
        <FormRow>
          <Label htmlFor="last-name">Last name</Label>
          <Input id="last-name" placeholder="Doe" defaultValue="Doe" />
        </FormRow>
      </div>

      <FormRow>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" placeholder="jane@example.com" defaultValue="jane@example.com" />
      </FormRow>

      <FormRow>
        <Label htmlFor="username">Username</Label>
        <div className="flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden">
          <span className="px-3 text-sm text-muted-foreground bg-muted border-r border-input h-10 flex items-center select-none">
            @
          </span>
          <input
            id="username"
            defaultValue="janedoe"
            className="flex-1 h-10 px-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder="janedoe"
          />
        </div>
      </FormRow>

      <FormRow>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          rows={3}
          defaultValue="Product designer and coffee enthusiast."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          placeholder="Tell us a little about yourself"
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="website">Website</Label>
        <Input id="website" type="url" placeholder="https://yoursite.com" defaultValue="https://janedoe.com" />
      </FormRow>

      <Divider />

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <SectionHeading
        title="Notifications"
        description="Choose how and when you want to be notified."
      />

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Email notifications</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Manage the emails sent to your primary address.
        </p>
        <div className="rounded-lg border border-border divide-y divide-border">
          <div className="px-4">
            <ToggleSwitch
              id="notif-marketing"
              label="Product updates"
              description="News, announcements, and feature releases."
              defaultChecked={true}
            />
          </div>
          <div className="px-4">
            <ToggleSwitch
              id="notif-activity"
              label="Account activity"
              description="Sign-ins, password changes, and billing receipts."
              defaultChecked={true}
            />
          </div>
          <div className="px-4">
            <ToggleSwitch
              id="notif-comments"
              label="Comments and mentions"
              description="When someone mentions you or replies to your comment."
              defaultChecked={false}
            />
          </div>
          <div className="px-4">
            <ToggleSwitch
              id="notif-digest"
              label="Weekly digest"
              description="A summary of activity from the past week."
              defaultChecked={false}
            />
          </div>
        </div>
      </div>

      <Divider />

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">Push notifications</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Sent to your device when the app is in the background.
        </p>
        <div className="rounded-lg border border-border divide-y divide-border">
          <div className="px-4">
            <ToggleSwitch
              id="push-messages"
              label="Direct messages"
              description="Alerts when you receive a new direct message."
              defaultChecked={true}
            />
          </div>
          <div className="px-4">
            <ToggleSwitch
              id="push-reminders"
              label="Reminders"
              description="Task and event reminders you've scheduled."
              defaultChecked={true}
            />
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-2">
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

  return (
    <div>
      <SectionHeading
        title="Security"
        description="Manage your password and keep your account secure."
      />

      <h3 className="text-sm font-semibold text-foreground mb-3">Change password</h3>

      <FormRow>
        <Label htmlFor="current-password">Current password</Label>
        <div className="relative">
          <Input
            id="current-password"
            type={showCurrent ? "text" : "password"}
            placeholder="••••••••"
            className="pr-16"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCurrent ? "Hide" : "Show"}
          </button>
        </div>
      </FormRow>

      <FormRow>
        <Label htmlFor="new-password">New password</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            className="pr-16"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showNew ? "Hide" : "Show"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Minimum 8 characters. Use a mix of letters, numbers, and symbols.
        </p>
      </FormRow>

      <FormRow>
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            className="pr-16"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
      </FormRow>

      <div className="flex justify-end gap-2 mt-2">
        <Button>Update password</Button>
      </div>

      <Divider />

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Two-factor authentication
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Add an extra layer of security to your account by requiring a verification code in addition to your password.
        </p>
        <div className="rounded-lg border border-border px-4">
          <ToggleSwitch
            id="two-factor"
            label="Enable two-factor authentication"
            description="You'll be prompted for a code each time you sign in."
            defaultChecked={false}
          />
        </div>
      </div>

      <Divider />

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Sessions</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Sign out of all other active sessions on other browsers and devices.
        </p>
        <div className="space-y-2 mb-4">
          {[
            { device: "Chrome on macOS", location: "New York, US", current: true },
            { device: "Safari on iPhone", location: "Brooklyn, US", current: false },
            { device: "Firefox on Windows", location: "London, UK", current: false },
          ].map((session) => (
            <div
              key={session.device}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {session.device}
                  {session.current && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{session.location}</p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          Sign out all other sessions
        </Button>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start mb-2 bg-muted">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsTab />
            </TabsContent>
            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}