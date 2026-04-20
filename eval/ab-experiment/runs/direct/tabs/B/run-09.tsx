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
  const [lastName, setLastName] = React.useState("Doe");
  const [email, setEmail] = React.useState("jane.doe@example.com");
  const [bio, setBio] = React.useState("Frontend engineer and design systems enthusiast.");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your public profile information.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <Label htmlFor="email">Email address</Label>
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
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Tell us a little about yourself"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button>Save profile</Button>
      </div>
    </div>
  );
}

type NotificationChannel = "email" | "push" | "sms";
type NotificationTopic = "activity" | "updates" | "security" | "marketing";

const notificationTopics: { id: NotificationTopic; label: string; description: string }[] = [
  { id: "activity", label: "Activity", description: "Comments, mentions, and replies on your posts." },
  { id: "updates", label: "Product updates", description: "New features, improvements, and announcements." },
  { id: "security", label: "Security alerts", description: "Sign-ins from new devices and suspicious activity." },
  { id: "marketing", label: "Marketing", description: "Promotions, newsletters, and special offers." },
];

const notificationChannels: { id: NotificationChannel; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "push", label: "Push" },
  { id: "sms", label: "SMS" },
];

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = React.useState<Record<NotificationTopic, Record<NotificationChannel, boolean>>>({
    activity: { email: true, push: true, sms: false },
    updates: { email: true, push: false, sms: false },
    security: { email: true, push: true, sms: true },
    marketing: { email: false, push: false, sms: false },
  });

  function toggle(topic: NotificationTopic, channel: NotificationChannel) {
    setPrefs((prev) => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        [channel]: !prev[topic][channel],
      },
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how and when you want to be notified.
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-full">
                Notification type
              </th>
              {notificationChannels.map((ch) => (
                <th
                  key={ch.id}
                  className="px-4 py-3 text-center font-medium text-muted-foreground whitespace-nowrap"
                >
                  {ch.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {notificationTopics.map((topic) => (
              <tr key={topic.id} className="bg-background">
                <td className="px-4 py-4">
                  <div className="font-medium text-foreground">{topic.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{topic.description}</div>
                </td>
                {notificationChannels.map((ch) => {
                  const toggleId = `notif-${topic.id}-${ch.id}`;
                  return (
                    <td key={ch.id} className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Toggle
                          id={toggleId}
                          checked={prefs[topic.id][ch.id]}
                          onChange={() => toggle(topic.id, ch.id)}
                        />
                        <span className="sr-only">
                          {prefs[topic.id][ch.id] ? "Disable" : "Enable"} {ch.label} for {topic.label}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
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
  const [twoFAEnabled, setTwoFAEnabled] = React.useState(false);

  const sessions = [
    { device: "MacBook Pro — Chrome", location: "San Francisco, CA", time: "Active now", current: true },
    { device: "iPhone 15 — Safari", location: "San Francisco, CA", time: "2 hours ago", current: false },
    { device: "Windows PC — Edge", location: "New York, NY", time: "3 days ago", current: false },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your password, two-factor authentication, and active sessions.
        </p>
      </div>

      {/* Change password */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground border-b border-border pb-2">
          Change password
        </h3>
        <div className="space-y-3 max-w-md">
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
            <p className="text-xs text-muted-foreground">
              Minimum 8 characters. Use letters, numbers, and symbols.
            </p>
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
            />
          </div>
          <div className="flex justify-start pt-1">
            <Button>Update password</Button>
          </div>
        </div>
      </section>

      {/* Two-factor authentication */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground border-b border-border pb-2">
          Two-factor authentication
        </h3>
        <div className="flex items-center justify-between rounded-lg border border-border p-4 max-w-md">
          <div>
            <p className="text-sm font-medium text-foreground">
              {twoFAEnabled ? "2FA is enabled" : "2FA is disabled"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {twoFAEnabled
                ? "Your account is protected with two-factor authentication."
                : "Add an extra layer of security to your account."}
            </p>
          </div>
          <Toggle
            id="two-fa-toggle"
            checked={twoFAEnabled}
            onChange={setTwoFAEnabled}
          />
        </div>
        {twoFAEnabled && (
          <p className="text-xs text-muted-foreground max-w-md">
            Scan the QR code with your authenticator app to complete setup.
          </p>
        )}
      </section>

      {/* Active sessions */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground border-b border-border pb-2">
          Active sessions
        </h3>
        <ul className="space-y-3 max-w-lg">
          {sessions.map((session, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{session.device}</span>
                  {session.current && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {session.location} · {session.time}
                </p>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm" className="shrink-0 ml-4 text-destructive border-destructive/40 hover:bg-destructive/10">
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
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
        <Tabs defaultValue="profile">
          <TabsList className="mb-6 bg-muted">
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