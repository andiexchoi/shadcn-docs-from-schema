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
  const [email, setEmail] = React.useState("jane.doe@example.com");
  const [bio, setBio] = React.useState("Software engineer & coffee enthusiast.");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your public profile information.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="profile-name">Full name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-email">Email address</Label>
          <Input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-bio">Bio</Label>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself"
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-website">Website</Label>
          <Input
            id="profile-website"
            type="url"
            placeholder="https://yourwebsite.com"
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
      description: "Receive product news and feature announcements via email.",
      enabled: true,
    },
    {
      id: "security-alerts",
      label: "Security alerts",
      description: "Get notified about suspicious activity on your account.",
      enabled: true,
    },
    {
      id: "marketing",
      label: "Marketing emails",
      description: "Receive tips, offers, and promotions from our team.",
      enabled: false,
    },
    {
      id: "weekly-digest",
      label: "Weekly digest",
      description: "A summary of your activity delivered every Monday.",
      enabled: false,
    },
    {
      id: "mentions",
      label: "Mentions",
      description: "Get notified when someone mentions you in a comment.",
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
          Choose how and when you want to be notified.
        </p>
      </div>
      <ul className="space-y-3">
        {settings.map((setting) => (
          <li
            key={setting.id}
            className="flex items-start justify-between gap-4 rounded-lg border border-border p-4"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">
                {setting.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <button
              role="switch"
              aria-checked={setting.enabled}
              aria-label={`Toggle ${setting.label}`}
              onClick={() => toggle(setting.id)}
              className={cn(
                "relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                setting.enabled ? "bg-primary" : "bg-input"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  setting.enabled ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactor, setTwoFactor] = React.useState(false);

  const passwordsMatch =
    newPassword === confirmPassword || confirmPassword === "";
  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your password and account security settings.
        </p>
      </div>

      {/* Change password */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Change password
        </h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
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
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            {newPassword.length > 0 && newPassword.length < 8 && (
              <p className="text-xs text-destructive">
                Password must be at least 8 characters.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
            {!passwordsMatch && (
              <p className="text-xs text-destructive">
                Passwords do not match.
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button disabled={!canSubmit}>Update password</Button>
        </div>
      </section>

      <hr className="border-border" />

      {/* Two-factor authentication */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Two-factor authentication
        </h3>
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Authenticator app
            </p>
            <p className="text-sm text-muted-foreground">
              Use an authenticator app to generate one-time codes for an extra
              layer of security.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={twoFactor}
            aria-label="Toggle two-factor authentication"
            onClick={() => setTwoFactor((v) => !v)}
            className={cn(
              "relative mt-0.5 inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              twoFactor ? "bg-primary" : "bg-input"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                twoFactor ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
        {twoFactor && (
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            Scan the QR code with your authenticator app to enable two-factor
            authentication. (QR code placeholder)
          </div>
        )}
      </section>

      <hr className="border-border" />

      {/* Danger zone */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-destructive">Danger zone</h3>
        <div className="rounded-lg border border-destructive/40 p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Delete account</p>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <Button variant="destructive" size="sm" className="mt-2">
            Delete account
          </Button>
        </div>
      </section>
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
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-2 w-full justify-start gap-1">
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