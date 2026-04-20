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

function ToggleSwitch({
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
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

function ProfileTab() {
  const [form, setForm] = React.useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    username: "janedoe",
    bio: "Product designer and coffee enthusiast.",
  });
  const [saved, setSaved] = React.useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information and public profile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="username"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            placeholder="A short bio about yourself"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">Save changes</Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            Changes saved!
          </span>
        )}
      </div>
    </form>
  );
}

type NotificationKey =
  | "emailUpdates"
  | "productNews"
  | "securityAlerts"
  | "weeklyDigest"
  | "mentionAlerts";

const notificationItems: { key: NotificationKey; label: string; description: string }[] = [
  {
    key: "emailUpdates",
    label: "Email updates",
    description: "Receive emails about your account activity.",
  },
  {
    key: "productNews",
    label: "Product news",
    description: "Hear about new features and improvements.",
  },
  {
    key: "securityAlerts",
    label: "Security alerts",
    description: "Get notified about important security events.",
  },
  {
    key: "weeklyDigest",
    label: "Weekly digest",
    description: "A summary of your activity sent every Monday.",
  },
  {
    key: "mentionAlerts",
    label: "Mention alerts",
    description: "Notifications when someone mentions you.",
  },
];

function NotificationsTab() {
  const [prefs, setPrefs] = React.useState<Record<NotificationKey, boolean>>({
    emailUpdates: true,
    productNews: false,
    securityAlerts: true,
    weeklyDigest: false,
    mentionAlerts: true,
  });
  const [saved, setSaved] = React.useState(false);

  function toggle(key: NotificationKey) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which notifications you want to receive.
        </p>
      </div>

      <div className="divide-y divide-border rounded-lg border">
        {notificationItems.map(({ key, label, description }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 px-4 py-4"
          >
            <div>
              <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                {label}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
            <ToggleSwitch
              id={key}
              checked={prefs[key]}
              onChange={() => toggle(key)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">Save preferences</Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            Preferences saved!
          </span>
        )}
      </div>
    </form>
  );
}

function SecurityTab() {
  const [passwords, setPasswords] = React.useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [sessionAlerts, setSessionAlerts] = React.useState(true);
  const [error, setError] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwords.current) {
      setError("Please enter your current password.");
      return;
    }
    if (passwords.next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setError("New passwords do not match.");
      return;
    }
    setError("");
    setSaved(true);
    setPasswords({ current: "", next: "", confirm: "" });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your password and account security settings.
        </p>
      </div>

      {/* Password section */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Change password
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              name="current"
              type="password"
              value={passwords.current}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="next">New password</Label>
            <Input
              id="next"
              name="next"
              type="password"
              value={passwords.next}
              onChange={handlePasswordChange}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              value={passwords.confirm}
              onChange={handlePasswordChange}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}
          <div className="flex items-center gap-3">
            <Button type="submit">Update password</Button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">
                Password updated!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Two-factor & session */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Additional security
        </h3>
        <div className="divide-y divide-border rounded-lg border">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <Label
                htmlFor="two-factor"
                className="text-sm font-medium cursor-pointer"
              >
                Two-factor authentication
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add an extra layer of security to your account.
              </p>
            </div>
            <ToggleSwitch
              id="two-factor"
              checked={twoFactor}
              onChange={setTwoFactor}
            />
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div>
              <Label
                htmlFor="session-alerts"
                className="text-sm font-medium cursor-pointer"
              >
                Session alerts
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get notified when a new session is started.
              </p>
            </div>
            <ToggleSwitch
              id="session-alerts"
              checked={sessionAlerts}
              onChange={setSessionAlerts}
            />
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Danger zone
        </h3>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-red-800">Delete account</p>
            <p className="text-xs text-red-600 mt-0.5">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete your account? This cannot be undone."
                )
              ) {
                // handle deletion
              }
            }}
          >
            Delete account
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences and security.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 w-full justify-start gap-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <ProfileTab />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <NotificationsTab />
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <SecurityTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}