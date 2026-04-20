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

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function Divider() {
  return <hr className="my-6 border-border" />;
}

function ToggleRow({
  label,
  description,
  id,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  id: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col">
        <Label htmlFor={id} className="text-sm font-medium leading-none mb-1">
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
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

function ProfileTab() {
  return (
    <div>
      <SectionHeader
        title="Profile"
        description="Manage your personal information and how it appears to others."
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Doe" defaultValue="Doe" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            defaultValue="jane@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              @
            </span>
            <Input
              id="username"
              className="rounded-l-none"
              placeholder="janedoe"
              defaultValue="janedoe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Tell us a little about yourself…"
            defaultValue="Product designer based in San Francisco."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <SectionHeader
        title="Notifications"
        description="Choose what you want to be notified about and how."
      />

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground mb-2">Email</h3>
        <ToggleRow
          id="notif-email-comments"
          label="Comments"
          description="Receive an email when someone comments on your post."
          defaultChecked={true}
        />
        <ToggleRow
          id="notif-email-mentions"
          label="Mentions"
          description="Receive an email when someone mentions you."
          defaultChecked={true}
        />
        <ToggleRow
          id="notif-email-updates"
          label="Product updates"
          description="Receive emails about new features and improvements."
          defaultChecked={false}
        />
        <ToggleRow
          id="notif-email-digest"
          label="Weekly digest"
          description="Get a weekly summary of activity in your account."
          defaultChecked={false}
        />
      </div>

      <Divider />

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Push notifications
        </h3>
        <ToggleRow
          id="notif-push-comments"
          label="Comments"
          description="Get a push notification when someone comments on your post."
          defaultChecked={true}
        />
        <ToggleRow
          id="notif-push-mentions"
          label="Mentions"
          description="Get a push notification when someone mentions you."
          defaultChecked={true}
        />
        <ToggleRow
          id="notif-push-reminders"
          label="Reminders"
          description="Get reminders about tasks and deadlines."
          defaultChecked={false}
        />
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
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
      <SectionHeader
        title="Security"
        description="Keep your account safe by managing your password and active sessions."
      />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Change password
        </h3>

        <div className="space-y-2">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {showCurrent ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Use at least 8 characters, including a number and a symbol.
          </p>
        </div>

        <div className="space-y-2">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      <Divider />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Two-factor authentication
        </h3>
        <ToggleRow
          id="2fa-app"
          label="Authenticator app"
          description="Use an authenticator app to generate one-time codes."
          defaultChecked={false}
        />
        <ToggleRow
          id="2fa-sms"
          label="SMS verification"
          description="Receive a code by text message when signing in."
          defaultChecked={false}
        />
      </div>

      <Divider />

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Active sessions
        </h3>
        <div className="rounded-md border border-border divide-y divide-border">
          {[
            {
              device: "MacBook Pro — Chrome",
              location: "San Francisco, CA",
              time: "Active now",
              current: true,
            },
            {
              device: "iPhone 15 — Safari",
              location: "San Francisco, CA",
              time: "2 hours ago",
              current: false,
            },
            {
              device: "Windows PC — Firefox",
              location: "New York, NY",
              time: "3 days ago",
              current: false,
            },
          ].map((session) => (
            <div
              key={session.device}
              className="flex items-center justify-between px-4 py-3 gap-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  {session.device}
                  {session.current && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {session.location} · {session.time}
                </p>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Update password</Button>
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
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-2 w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
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