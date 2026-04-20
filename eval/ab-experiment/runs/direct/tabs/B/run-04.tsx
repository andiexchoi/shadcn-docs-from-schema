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

function ToggleSwitch({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
  );
}

function ProfileTab() {
  const [firstName, setFirstName] = React.useState("Jane");
  const [lastName, setLastName] = React.useState("Doe");
  const [email, setEmail] = React.useState("jane.doe@example.com");
  const [bio, setBio] = React.useState("Product designer and occasional hiker.");
  const [saved, setSaved] = React.useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information and public profile.
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
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us a little about yourself"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background overflow-hidden">
          <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r border-input select-none">
            @
          </span>
          <input
            id="username"
            type="text"
            defaultValue="janedoe"
            placeholder="username"
            className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">{saved ? "Saved!" : "Save changes"}</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}

type NotificationKey =
  | "emailMarketing"
  | "emailProduct"
  | "emailSecurity"
  | "pushAll"
  | "pushMentions"
  | "pushUpdates";

function NotificationsTab() {
  const [prefs, setPrefs] = React.useState<Record<NotificationKey, boolean>>({
    emailMarketing: false,
    emailProduct: true,
    emailSecurity: true,
    pushAll: false,
    pushMentions: true,
    pushUpdates: false,
  });

  function toggle(key: NotificationKey) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const sections: {
    heading: string;
    description: string;
    items: { key: NotificationKey; label: string; description: string }[];
  }[] = [
    {
      heading: "Email notifications",
      description: "Choose which emails you'd like to receive.",
      items: [
        {
          key: "emailMarketing",
          label: "Marketing",
          description: "News, promotions, and featured content.",
        },
        {
          key: "emailProduct",
          label: "Product updates",
          description: "New features, improvements, and release notes.",
        },
        {
          key: "emailSecurity",
          label: "Security alerts",
          description: "Sign-in attempts and account changes.",
        },
      ],
    },
    {
      heading: "Push notifications",
      description: "Manage in-app and browser push notifications.",
      items: [
        {
          key: "pushAll",
          label: "All activity",
          description: "Every event in your account.",
        },
        {
          key: "pushMentions",
          label: "Mentions",
          description: "When someone mentions you in a comment or thread.",
        },
        {
          key: "pushUpdates",
          label: "System updates",
          description: "Maintenance windows and service announcements.",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control how and when you receive notifications.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.heading} className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {section.heading}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {section.description}
            </p>
          </div>
          <div className="divide-y divide-border rounded-md border border-border">
            {section.items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="space-y-0.5">
                  <Label
                    htmlFor={item.key}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {item.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ToggleSwitch
                  id={item.key}
                  checked={prefs[item.key]}
                  onChange={() => toggle(item.key)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button>Save preferences</Button>
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [sessionAlerts, setSessionAlerts] = React.useState(true);
  const [passwordSaved, setPasswordSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 2000);
  }

  const sessions = [
    {
      device: "MacBook Pro — Chrome",
      location: "San Francisco, CA",
      lastActive: "Active now",
      current: true,
    },
    {
      device: "iPhone 15 — Safari",
      location: "San Francisco, CA",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      device: "Windows PC — Firefox",
      location: "New York, NY",
      lastActive: "3 days ago",
      current: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your password, two-factor authentication, and active sessions.
        </p>
      </div>

      {/* Password */}
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Change password</h3>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}

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
          />
        </div>
        <Button type="submit">
          {passwordSaved ? "Password updated!" : "Update password"}
        </Button>
      </form>

      <hr className="border-border" />

      {/* Two-factor authentication */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">
          Two-factor authentication
        </h3>
        <div className="flex items-start justify-between gap-4 rounded-md border border-border px-4 py-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Authenticator app
            </p>
            <p className="text-xs text-muted-foreground">
              Use an authenticator app to generate one-time codes for sign-in.
            </p>
          </div>
          <ToggleSwitch
            id="two-factor"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>
        <div className="flex items-start justify-between gap-4 rounded-md border border-border px-4 py-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Session alerts
            </p>
            <p className="text-xs text-muted-foreground">
              Receive an email when a new device signs in to your account.
            </p>
          </div>
          <ToggleSwitch
            id="session-alerts"
            checked={sessionAlerts}
            onChange={setSessionAlerts}
          />
        </div>
      </div>

      <hr className="border-border" />

      {/* Active sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">
            Active sessions
          </h3>
          <Button variant="outline" size="sm">
            Revoke all
          </Button>
        </div>
        <div className="divide-y divide-border rounded-md border border-border">
          {sessions.map((session) => (
            <div
              key={session.device}
              className="flex items-center justify-between px-4 py-3 gap-4"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.device}
                  </p>
                  {session.current && (
                    <span className="shrink-0 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {session.location} · {session.lastActive}
                </p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="shrink-0">
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
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start gap-1 bg-muted">
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