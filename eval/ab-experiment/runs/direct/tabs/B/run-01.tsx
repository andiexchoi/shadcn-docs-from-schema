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
  const [bio, setBio] = React.useState("Product designer based in New York.");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your public profile information.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />
      </div>
      <div className="space-y-1.5">
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
      <div className="flex justify-end">
        <Button type="button">Save changes</Button>
      </div>
    </div>
  );
}

type NotificationKey =
  | "emailUpdates"
  | "productNews"
  | "securityAlerts"
  | "weeklyDigest";

interface NotificationOption {
  key: NotificationKey;
  label: string;
  description: string;
}

const notificationOptions: NotificationOption[] = [
  {
    key: "emailUpdates",
    label: "Email updates",
    description: "Receive emails about your account activity.",
  },
  {
    key: "productNews",
    label: "Product news",
    description: "Get notified about new features and improvements.",
  },
  {
    key: "securityAlerts",
    label: "Security alerts",
    description: "Receive alerts about security activity on your account.",
  },
  {
    key: "weeklyDigest",
    label: "Weekly digest",
    description: "A weekly summary of your account activity.",
  },
];

function NotificationsTab() {
  const [prefs, setPrefs] = React.useState<Record<NotificationKey, boolean>>({
    emailUpdates: true,
    productNews: false,
    securityAlerts: true,
    weeklyDigest: false,
  });

  const toggle = (key: NotificationKey) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Choose how and when you want to be notified.
        </p>
      </div>
      <ul className="divide-y divide-border rounded-lg border">
        {notificationOptions.map(({ key, label, description }) => (
          <li
            key={key}
            className="flex items-center justify-between gap-4 px-4 py-4"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[key]}
              aria-label={label}
              onClick={() => toggle(key)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                prefs[key] ? "bg-primary" : "bg-input"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                  prefs[key] ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button type="button">Save preferences</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground">
          Keep your account secure by managing your password and authentication settings.
        </p>
      </div>

      {/* Password section */}
      <div className="rounded-lg border p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Change password</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use a strong password of at least 8 characters.
          </p>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4" noValidate>
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
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-1.5">
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

          <div className="flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </div>

      {/* Two-factor authentication section */}
      <div className="rounded-lg border p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Two-factor authentication
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add an extra layer of security to your account.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={twoFactor}
            aria-label="Two-factor authentication"
            onClick={() => setTwoFactor((v) => !v)}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              twoFactor ? "bg-primary" : "bg-input"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                twoFactor ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
        </div>
        {twoFactor && (
          <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
            Two-factor authentication is <span className="font-medium text-foreground">enabled</span>. 
            You will be prompted for a code each time you sign in.
          </div>
        )}
      </div>

      {/* Active sessions section */}
      <div className="rounded-lg border p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Active sessions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Devices currently signed in to your account.
          </p>
        </div>
        <ul className="space-y-3">
          {[
            { device: "MacBook Pro — Chrome", location: "New York, US", current: true },
            { device: "iPhone 15 — Safari", location: "New York, US", current: false },
          ].map(({ device, location, current }) => (
            <li
              key={device}
              className="flex items-center justify-between gap-4 rounded-md bg-muted/50 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  {device}
                  {current && (
                    <span className="text-xs font-normal text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{location}</p>
              </div>
              {!current && (
                <Button variant="outline" size="sm" type="button">
                  Revoke
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start gap-1">
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