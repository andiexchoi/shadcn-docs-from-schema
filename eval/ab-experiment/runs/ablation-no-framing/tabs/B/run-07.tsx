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
      "inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground",
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

function ProfileTab() {
  const [name, setName] = React.useState("Jane Doe");
  const [email, setEmail] = React.useState("jane.doe@example.com");
  const [bio, setBio] = React.useState("Product designer based in New York.");

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
      aria-label="Profile settings"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your personal information.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Tell us a little about yourself"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input
          id="avatar"
          type="url"
          placeholder="https://example.com/avatar.png"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save profile</Button>
      </div>
    </form>
  );
}

type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  defaultChecked: boolean;
};

const notificationSettings: NotificationSetting[] = [
  {
    id: "notif-email-updates",
    label: "Product updates",
    description: "Receive emails about new features and improvements.",
    defaultChecked: true,
  },
  {
    id: "notif-email-security",
    label: "Security alerts",
    description: "Get notified of sign-ins from new devices or locations.",
    defaultChecked: true,
  },
  {
    id: "notif-email-marketing",
    label: "Marketing",
    description: "Tips, offers, and promotions from our team.",
    defaultChecked: false,
  },
  {
    id: "notif-email-digest",
    label: "Weekly digest",
    description: "A summary of your activity delivered every Monday.",
    defaultChecked: false,
  },
];

function Toggle({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = React.useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        notificationSettings.map((s) => [s.id, s.defaultChecked])
      )
  );

  const handleChange = (id: string, val: boolean) => {
    setSettings((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
      aria-label="Notification settings"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Choose which emails you'd like to receive.
        </p>
      </div>
      <div className="divide-y divide-border rounded-lg border">
        {notificationSettings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between gap-4 px-4 py-4"
          >
            <div className="space-y-0.5">
              <Label
                htmlFor={setting.id}
                className="cursor-pointer font-medium"
              >
                {setting.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <Toggle
              id={setting.id}
              checked={settings[setting.id]}
              onChange={(val) => handleChange(setting.id, val)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save preferences</Button>
      </div>
    </form>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8" aria-label="Security settings">
      <div>
        <div className="space-y-1 mb-6">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <p className="text-sm text-muted-foreground">
            Manage your password and account security options.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Change password
          </h3>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="text-sm text-green-600">
              Password updated successfully.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Two-factor authentication
        </h3>
        <div className="flex items-center justify-between gap-4 rounded-lg border px-4 py-4">
          <div className="space-y-0.5">
            <Label htmlFor="two-factor" className="cursor-pointer font-medium">
              Authenticator app
            </Label>
            <p className="text-sm text-muted-foreground">
              Use an authenticator app to generate one-time codes.
            </p>
          </div>
          <Toggle
            id="two-factor"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>
        {twoFactor && (
          <p className="text-sm text-muted-foreground">
            Two-factor authentication is enabled. You will be prompted for a
            code on your next sign-in.
          </p>
        )}
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Active sessions
        </h3>
        <div className="divide-y divide-border rounded-lg border">
          {[
            {
              device: "MacBook Pro — Chrome",
              location: "New York, US",
              current: true,
            },
            {
              device: "iPhone 15 — Safari",
              location: "New York, US",
              current: false,
            },
          ].map((session) => (
            <div
              key={session.device}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {session.device}
                  {session.current && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
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
        </div>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Tabs defaultValue="profile">
        <TabsList className="mb-2 w-full justify-start">
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
  );
}