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

function ProfileTab() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Profile"
        description="Manage your public profile information."
      />
      <div className="grid gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Doe" defaultValue="Doe" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            defaultValue="jane.doe@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="janedoe" defaultValue="janedoe" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Tell us about yourself…"
            defaultValue="Frontend engineer who loves building great UIs."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://example.com"
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button>Save profile</Button>
      </div>
    </div>
  );
}

type ToggleRowProps = {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
};

function ToggleRow({ id, label, description, defaultChecked = false }: ToggleRowProps) {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
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
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Notifications"
        description="Choose how and when you want to be notified."
      />
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Email notifications</h3>
        <div className="space-y-2">
          <ToggleRow
            id="notify-marketing"
            label="Marketing emails"
            description="Receive emails about new features, offers, and updates."
            defaultChecked={false}
          />
          <ToggleRow
            id="notify-activity"
            label="Account activity"
            description="Get notified when there's activity on your account."
            defaultChecked={true}
          />
          <ToggleRow
            id="notify-security"
            label="Security alerts"
            description="Receive alerts about sign-ins and suspicious activity."
            defaultChecked={true}
          />
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Push notifications</h3>
        <div className="space-y-2">
          <ToggleRow
            id="notify-push-messages"
            label="Direct messages"
            description="Push notifications when you receive a direct message."
            defaultChecked={true}
          />
          <ToggleRow
            id="notify-push-mentions"
            label="Mentions"
            description="Push notifications when someone mentions you."
            defaultChecked={false}
          />
        </div>
      </div>
      <div className="flex justify-end pt-2">
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
    <div className="space-y-8">
      <div className="space-y-6">
        <SectionHeading
          title="Security"
          description="Manage your password and account security settings."
        />
        <div className="rounded-lg border border-border p-5 space-y-4">
          <h3 className="text-sm font-medium text-foreground">Change password</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  className="pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:underline"
                >
                  {showCurrent ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  className="pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:underline"
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:underline"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Button>Update password</Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium text-foreground">
              Two-factor authentication
            </h3>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account using an authenticator app.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Enable
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5 space-y-3">
        <h3 className="text-sm font-medium text-destructive">Danger zone</h3>
        <p className="text-xs text-muted-foreground">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="destructive" size="sm">
          Delete account
        </Button>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}