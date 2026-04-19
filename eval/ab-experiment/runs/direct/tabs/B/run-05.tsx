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

function ProfileTab() {
  const [name, setName] = React.useState("Jane Doe");
  const [email, setEmail] = React.useState("jane@example.com");
  const [bio, setBio] = React.useState("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your public profile information.
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-name">Full name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-bio">Bio</Label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself"
            rows={4}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profile-avatar">Avatar URL</Label>
          <Input
            id="profile-avatar"
            type="url"
            placeholder="https://example.com/avatar.png"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button>Save profile</Button>
      </div>
    </div>
  );
}

type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

function NotificationsTab() {
  const [settings, setSettings] = React.useState<NotificationSetting[]>([
    {
      id: "email-updates",
      label: "Email updates",
      description: "Receive product updates and news via email.",
      enabled: true,
    },
    {
      id: "security-alerts",
      label: "Security alerts",
      description: "Get notified about suspicious account activity.",
      enabled: true,
    },
    {
      id: "marketing",
      label: "Marketing",
      description: "Receive tips, promotions, and offers.",
      enabled: false,
    },
    {
      id: "weekly-digest",
      label: "Weekly digest",
      description: "A summary of your activity sent every Monday.",
      enabled: false,
    },
    {
      id: "comments",
      label: "Comments",
      description: "Notify me when someone comments on my posts.",
      enabled: true,
    },
  ]);

  const toggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Choose which notifications you want to receive.
        </p>
      </div>
      <div className="divide-y divide-border rounded-md border">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                {setting.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <button
              role="switch"
              aria-checked={setting.enabled}
              aria-label={`Toggle ${setting.label}`}
              onClick={() => toggle(setting.id)}
              className={cn(
                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                setting.enabled ? "bg-primary" : "bg-input"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  setting.enabled ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button>Save notifications</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setPasswordError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your password and account security settings.
        </p>
      </div>

      {/* Change password */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Change password
        </h3>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            autoComplete="current-password"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
        </div>
        {passwordError && (
          <p role="alert" className="text-sm text-destructive">
            {passwordError}
          </p>
        )}
        <div className="flex justify-end">
          <Button type="submit">Update password</Button>
        </div>
      </form>

      <hr className="border-border" />

      {/* Two-factor authentication */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Two-factor authentication
        </h3>
        <p className="text-sm text-muted-foreground">
          Add an extra layer of security to your account by requiring a
          one-time code in addition to your password when you sign in.
        </p>
        <div className="flex items-center gap-3">
          <button
            role="switch"
            aria-checked={twoFactor}
            aria-label="Toggle two-factor authentication"
            onClick={() => setTwoFactor((v) => !v)}
            className={cn(
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              twoFactor ? "bg-primary" : "bg-input"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                twoFactor ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
          <span className="text-sm text-foreground">
            {twoFactor ? "Enabled" : "Disabled"}
          </span>
        </div>
        {twoFactor && (
          <p className="text-xs text-muted-foreground">
            Two-factor authentication is active. You will be prompted for a
            code on each sign-in.
          </p>
        )}
      </div>

      <hr className="border-border" />

      {/* Danger zone */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <Button variant="destructive">Delete account</Button>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
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