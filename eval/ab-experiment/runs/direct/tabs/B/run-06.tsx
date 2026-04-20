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
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function Divider() {
  return <hr className="my-6 border-gray-200" />;
}

function ProfileTab() {
  return (
    <div>
      <SectionHeading
        title="Profile"
        description="Update your personal information and public profile details."
      />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Smith" defaultValue="Smith" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            defaultValue="jane@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              @
            </span>
            <Input
              id="username"
              className="rounded-l-none"
              placeholder="janesmith"
              defaultValue="janesmith"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Tell us a little about yourself…"
            defaultValue="Product designer based in San Francisco."
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://example.com"
            defaultValue="https://janesmith.com"
          />
        </div>

        <Divider />

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="reset">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </div>
  );
}

type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  defaultChecked: boolean;
};

const emailNotifications: NotificationSetting[] = [
  {
    id: "notif-comments",
    label: "Comments",
    description: "Get notified when someone comments on your posts.",
    defaultChecked: true,
  },
  {
    id: "notif-mentions",
    label: "Mentions",
    description: "Get notified when someone mentions you.",
    defaultChecked: true,
  },
  {
    id: "notif-updates",
    label: "Product updates",
    description: "News about product and feature updates.",
    defaultChecked: false,
  },
  {
    id: "notif-digest",
    label: "Weekly digest",
    description: "A weekly summary of activity in your account.",
    defaultChecked: false,
  },
];

const pushNotifications: NotificationSetting[] = [
  {
    id: "push-all",
    label: "All new messages",
    description: "Receive push notifications for every new message.",
    defaultChecked: false,
  },
  {
    id: "push-direct",
    label: "Direct messages only",
    description: "Only notify me for direct messages.",
    defaultChecked: true,
  },
];

function ToggleRow({ setting }: { setting: NotificationSetting }) {
  const [checked, setChecked] = React.useState(setting.defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{setting.label}</p>
        <p className="mt-0.5 text-sm text-gray-500">{setting.description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span className="sr-only">Toggle {setting.label}</span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <SectionHeading
        title="Notifications"
        description="Choose what you want to be notified about and how."
      />

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Email notifications
        </h3>
        <div className="divide-y divide-gray-100">
          {emailNotifications.map((setting) => (
            <ToggleRow key={setting.id} setting={setting} />
          ))}
        </div>
      </div>

      <Divider />

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Push notifications
        </h3>
        <div className="divide-y divide-gray-100">
          {pushNotifications.map((setting) => (
            <ToggleRow key={setting.id} setting={setting} />
          ))}
        </div>
      </div>

      <Divider />

      <div className="flex justify-end">
        <Button type="button">Save preferences</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = React.useState(false);

  return (
    <div>
      <SectionHeading
        title="Security"
        description="Manage your password and account security settings."
      />

      {/* Change password */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Change password
        </h3>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="space-y-1.5">
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
                className="absolute inset-y-0 right-3 text-xs text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                placeholder="••••••••"
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute inset-y-0 right-3 text-xs text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Minimum 8 characters. Include uppercase, numbers, and symbols for a stronger password.
            </p>
          </div>

          <div className="space-y-1.5">
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
                className="absolute inset-y-0 right-3 text-xs text-gray-500 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="outline" type="reset">
              Cancel
            </Button>
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </div>

      <Divider />

      {/* Two-factor authentication */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Two-factor authentication
        </h3>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 p-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {twoFAEnabled ? "2FA is enabled" : "2FA is disabled"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {twoFAEnabled
                ? "Your account is protected with two-factor authentication."
                : "Add an extra layer of security by requiring a verification code when you sign in."}
            </p>
          </div>
          <Button
            variant={twoFAEnabled ? "outline" : "default"}
            size="sm"
            onClick={() => setTwoFAEnabled((v) => !v)}
          >
            {twoFAEnabled ? "Disable" : "Enable"}
          </Button>
        </div>
      </div>

      <Divider />

      {/* Active sessions */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Active sessions
        </h3>
        <div className="space-y-3">
          {[
            { device: "MacBook Pro — Chrome", location: "San Francisco, CA", current: true },
            { device: "iPhone 15 — Safari", location: "San Francisco, CA", current: false },
            { device: "Windows PC — Edge", location: "New York, NY", current: false },
          ].map(({ device, location, current }) => (
            <div
              key={device}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {device}
                  {current && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Current
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{location}</p>
              </div>
              {!current && (
                <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 w-full justify-start gap-1 bg-gray-100">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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