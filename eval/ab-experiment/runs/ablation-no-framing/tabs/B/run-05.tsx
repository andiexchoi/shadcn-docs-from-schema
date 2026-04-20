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

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-2">{children}</div>;
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="grid gap-5">{children}</div>
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
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="grid gap-0.5">
        <Label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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

function ProfileTab() {
  return (
    <div className="grid gap-6">
      <SectionHeading
        title="Profile"
        description="Update your personal information and how others see you."
      />
      <FormCard>
        <div className="grid gap-5 sm:grid-cols-2">
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="jane@example.com" defaultValue="jane@example.com" />
        </FieldRow>
        <FieldRow>
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="janedoe" defaultValue="janedoe" />
        </FieldRow>
        <FieldRow>
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Tell us a little about yourself"
            defaultValue="Product designer based in New York."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </FieldRow>
        <div className="flex justify-end">
          <Button>Save changes</Button>
        </div>
      </FormCard>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="grid gap-6">
      <SectionHeading
        title="Notifications"
        description="Choose how and when you want to be notified."
      />
      <FormCard>
        <h3 className="text-sm font-semibold text-foreground">Email notifications</h3>
        <div className="grid gap-5">
          <Toggle
            id="notif-activity"
            label="Activity"
            description="Receive emails about your account activity."
            defaultChecked
          />
          <Toggle
            id="notif-mentions"
            label="Mentions"
            description="Get notified when someone mentions you."
            defaultChecked
          />
          <Toggle
            id="notif-updates"
            label="Product updates"
            description="News and updates about new features."
          />
          <Toggle
            id="notif-digest"
            label="Weekly digest"
            description="A weekly summary of your activity and highlights."
          />
        </div>
      </FormCard>
      <FormCard>
        <h3 className="text-sm font-semibold text-foreground">Push notifications</h3>
        <div className="grid gap-5">
          <Toggle
            id="push-messages"
            label="Direct messages"
            description="Receive a push notification for new direct messages."
            defaultChecked
          />
          <Toggle
            id="push-reminders"
            label="Reminders"
            description="Get push reminders about upcoming deadlines."
          />
        </div>
      </FormCard>
      <div className="flex justify-end">
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
    <div className="grid gap-6">
      <SectionHeading
        title="Security"
        description="Manage your password and account security settings."
      />
      <FormCard>
        <h3 className="text-sm font-semibold text-foreground">Change password</h3>
        <FieldRow>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {showCurrent ? "Hide" : "Show"}
            </button>
          </div>
        </FieldRow>
        <FieldRow>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
        </FieldRow>
        <FieldRow>
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </FieldRow>
        <div className="flex justify-end">
          <Button>Update password</Button>
        </div>
      </FormCard>
      <FormCard>
        <h3 className="text-sm font-semibold text-foreground">Two-factor authentication</h3>
        <div className="grid gap-5">
          <Toggle
            id="2fa-app"
            label="Authenticator app"
            description="Use an authenticator app to generate one-time codes."
            defaultChecked
          />
          <Toggle
            id="2fa-sms"
            label="SMS authentication"
            description="Receive a one-time code via text message."
          />
        </div>
      </FormCard>
      <FormCard>
        <h3 className="text-sm font-semibold text-foreground">Sessions</h3>
        <p className="text-sm text-muted-foreground">
          You are currently signed in on 2 devices. Signing out of all other sessions will remove
          your account from all devices except this one.
        </p>
        <div className="flex justify-start">
          <Button variant="outline">Sign out other sessions</Button>
        </div>
      </FormCard>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <Tabs defaultValue="profile">
          <TabsList className="mb-6 w-full justify-start">
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