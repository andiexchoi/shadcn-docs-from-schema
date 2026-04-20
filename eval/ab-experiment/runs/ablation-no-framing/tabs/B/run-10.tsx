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

function ProfileTab() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Profile"
        description="Update your personal information and how others see you."
      />
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            defaultValue="jane.doe@example.com"
          />
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
            placeholder="Tell us a little about yourself…"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            defaultValue="Product designer and coffee enthusiast."
          />
        </FieldRow>
      </div>
      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function ToggleRow({ id, label, description, defaultChecked = false }: ToggleRowProps) {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((prev) => !prev)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Notifications"
        description="Choose what you want to be notified about and how."
      />
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Email
        </p>
        <ToggleRow
          id="notif-marketing"
          label="Marketing emails"
          description="Receive news, tips, and offers from our team."
          defaultChecked={false}
        />
        <ToggleRow
          id="notif-product"
          label="Product updates"
          description="Be the first to know about new features and improvements."
          defaultChecked={true}
        />
        <ToggleRow
          id="notif-security-email"
          label="Security alerts"
          description="Get notified about sign-ins and account changes."
          defaultChecked={true}
        />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Push
        </p>
        <ToggleRow
          id="notif-push-messages"
          label="Direct messages"
          description="Push notification when someone sends you a message."
          defaultChecked={true}
        />
        <ToggleRow
          id="notif-push-reminders"
          label="Reminders"
          description="Nudges about tasks and deadlines you have set."
          defaultChecked={false}
        />
      </div>
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
    <div className="space-y-8">
      <div className="space-y-6">
        <SectionHeading
          title="Security"
          description="Manage your password and keep your account secure."
        />
        <div className="space-y-4">
          <FieldRow>
            <Label htmlFor="current-password">Current password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
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
                placeholder="••••••••"
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters with a mix of letters, numbers, and symbols.
            </p>
          </FieldRow>
          <FieldRow>
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </FieldRow>
        </div>
        <div className="flex justify-end">
          <Button>Update password</Button>
        </div>
      </div>

      <div className="border-t border-border pt-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Two-factor authentication</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add an extra layer of security to your account by requiring a verification code in
            addition to your password.
          </p>
        </div>
        <ToggleRow
          id="2fa-toggle"
          label="Enable two-factor authentication"
          description="Use an authenticator app to generate one-time codes."
          defaultChecked={false}
        />
      </div>

      <div className="border-t border-border pt-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-destructive">Danger zone</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>
        <Button
          variant="destructive"
          className="w-full sm:w-auto"
        >
          Delete account
        </Button>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences and security.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <ProfileTab />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <NotificationsTab />
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <SecurityTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}