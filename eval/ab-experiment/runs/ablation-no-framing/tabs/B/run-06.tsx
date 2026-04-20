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
  const [firstName, setFirstName] = React.useState("Jane");
  const [lastName, setLastName] = React.useState("Smith");
  const [email, setEmail] = React.useState("jane.smith@example.com");
  const [bio, setBio] = React.useState("Product designer based in San Francisco.");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your public profile information.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a little about yourself"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

type NotificationChannel = "email" | "push" | "sms";
type NotificationKey = "marketing" | "updates" | "security" | "reminders";

interface NotificationSetting {
  label: string;
  description: string;
  channels: Record<NotificationChannel, boolean>;
}

function NotificationsTab() {
  const [settings, setSettings] = React.useState<
    Record<NotificationKey, NotificationSetting>
  >({
    marketing: {
      label: "Marketing",
      description: "Promotions, offers, and announcements",
      channels: { email: true, push: false, sms: false },
    },
    updates: {
      label: "Product updates",
      description: "New features and improvements",
      channels: { email: true, push: true, sms: false },
    },
    security: {
      label: "Security alerts",
      description: "Sign-ins, password changes, and suspicious activity",
      channels: { email: true, push: true, sms: true },
    },
    reminders: {
      label: "Reminders",
      description: "Upcoming events and deadlines",
      channels: { email: false, push: true, sms: false },
    },
  });

  const toggle = (key: NotificationKey, channel: NotificationChannel) => {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        channels: {
          ...prev[key].channels,
          [channel]: !prev[key].channels[channel],
        },
      },
    }));
  };

  const channels: NotificationChannel[] = ["email", "push", "sms"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Choose how and when you receive notifications.
        </p>
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Notification type
              </th>
              {channels.map((ch) => (
                <th
                  key={ch}
                  className="px-4 py-3 text-center font-medium text-muted-foreground capitalize"
                >
                  {ch}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Object.keys(settings) as NotificationKey[]).map((key, idx, arr) => {
              const setting = settings[key];
              return (
                <tr
                  key={key}
                  className={cn(
                    "transition-colors hover:bg-muted/30",
                    idx < arr.length - 1 && "border-b border-border"
                  )}
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground">{setting.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {setting.description}
                    </p>
                  </td>
                  {channels.map((ch) => (
                    <td key={ch} className="px-4 py-4 text-center">
                      <button
                        role="switch"
                        aria-checked={setting.channels[ch]}
                        aria-label={`${setting.label} via ${ch}`}
                        onClick={() => toggle(key, ch)}
                        className={cn(
                          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          setting.channels[ch]
                            ? "bg-primary"
                            : "bg-input"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-lg ring-0 transition-transform",
                            setting.channels[ch]
                              ? "translate-x-4"
                              : "translate-x-0"
                          )}
                        />
                      </button>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
    newPassword.length === 0 ||
    confirmPassword.length === 0 ||
    newPassword === confirmPassword;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your password and account security options.
        </p>
      </div>

      {/* Change password */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Password
        </h3>
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!passwordsMatch}
            />
            {!passwordsMatch && (
              <p className="text-xs text-destructive" role="alert">
                Passwords do not match.
              </p>
            )}
          </div>
          <Button
            disabled={
              !currentPassword ||
              !newPassword ||
              !confirmPassword ||
              !passwordsMatch
            }
          >
            Update password
          </Button>
        </div>
      </section>

      <div className="border-t border-border" />

      {/* Two-factor authentication */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Two-factor authentication
        </h3>
        <div className="flex items-start gap-4 rounded-md border border-border bg-muted/30 p-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Authenticator app
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Use an authenticator app to generate one-time codes for an extra
              layer of security when signing in.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={twoFactor}
            aria-label="Enable two-factor authentication"
            onClick={() => setTwoFactor((v) => !v)}
            className={cn(
              "relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              twoFactor ? "bg-primary" : "bg-input"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-lg ring-0 transition-transform",
                twoFactor ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
        {twoFactor && (
          <p className="text-sm text-muted-foreground">
            Two-factor authentication is{" "}
            <span className="font-medium text-foreground">enabled</span>. You
            will be prompted for a code on each sign-in.
          </p>
        )}
      </section>

      <div className="border-t border-border" />

      {/* Active sessions */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Active sessions
        </h3>
        <ul className="space-y-3">
          {[
            {
              device: "MacBook Pro — Chrome",
              location: "San Francisco, CA",
              current: true,
              lastSeen: "Now",
            },
            {
              device: "iPhone 15 — Safari",
              location: "San Francisco, CA",
              current: false,
              lastSeen: "2 hours ago",
            },
            {
              device: "Windows PC — Edge",
              location: "New York, NY",
              current: false,
              lastSeen: "3 days ago",
            },
          ].map((session) => (
            <li
              key={session.device}
              className="flex items-center justify-between gap-4 rounded-md border border-border p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session.device}
                  {session.current && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.location} · {session.lastSeen}
                </p>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 w-full justify-start gap-1">
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