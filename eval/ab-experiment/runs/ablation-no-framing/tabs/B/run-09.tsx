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
  const [bio, setBio] = React.useState("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information.
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
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
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          )}
        />
        <p className="text-xs text-muted-foreground">{bio.length}/200 characters</p>
      </div>
      <div className="flex gap-2">
        <Button>Save changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
}

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ id, checked, onChange }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function NotificationsTab() {
  const [emailDigest, setEmailDigest] = React.useState(true);
  const [productUpdates, setProductUpdates] = React.useState(false);
  const [securityAlerts, setSecurityAlerts] = React.useState(true);
  const [marketingEmails, setMarketingEmails] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(true);

  const notifications = [
    {
      id: "email-digest",
      label: "Weekly email digest",
      description: "Receive a summary of your activity every week.",
      checked: emailDigest,
      onChange: setEmailDigest,
    },
    {
      id: "product-updates",
      label: "Product updates",
      description: "Get notified about new features and improvements.",
      checked: productUpdates,
      onChange: setProductUpdates,
    },
    {
      id: "security-alerts",
      label: "Security alerts",
      description: "Receive alerts for suspicious sign-in attempts.",
      checked: securityAlerts,
      onChange: setSecurityAlerts,
    },
    {
      id: "marketing-emails",
      label: "Marketing emails",
      description: "Promotional offers, tips, and special announcements.",
      checked: marketingEmails,
      onChange: setMarketingEmails,
    },
    {
      id: "push-notifications",
      label: "Push notifications",
      description: "Get real-time notifications in your browser.",
      checked: pushNotifications,
      onChange: setPushNotifications,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how and when you want to be notified.
        </p>
      </div>
      <div className="divide-y divide-border rounded-lg border">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-4"
          >
            <div className="space-y-0.5">
              <Label
                htmlFor={item.id}
                className="text-sm font-medium cursor-pointer"
              >
                {item.label}
              </Label>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <Toggle
              id={item.id}
              checked={item.checked}
              onChange={item.onChange}
            />
          </div>
        ))}
      </div>
      <Button>Save preferences</Button>
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your password and account security settings.
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Change password</h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters.
            </p>
          </div>
          <div className="space-y-2">
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
          <Button type="submit">Update password</Button>
        </form>
      </section>

      <div className="border-t border-border" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Two-factor authentication
        </h3>
        <div className="flex items-start justify-between rounded-lg border p-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {twoFactor ? "Two-factor authentication is on" : "Two-factor authentication is off"}
            </p>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account by requiring a
              verification code in addition to your password.
            </p>
          </div>
          <Toggle
            id="two-factor"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Active sessions</h3>
        <div className="space-y-3">
          {[
            {
              device: "MacBook Pro — Chrome",
              location: "New York, US",
              time: "Active now",
              current: true,
            },
            {
              device: "iPhone 15 — Safari",
              location: "New York, US",
              time: "2 hours ago",
              current: false,
            },
            {
              device: "Windows PC — Firefox",
              location: "London, UK",
              time: "3 days ago",
              current: false,
            },
          ].map((session) => (
            <div
              key={session.device}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{session.device}</span>
                  {session.current && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {session.location} · {session.time}
                </p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
          Sign out all other sessions
        </Button>
      </section>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <ProfileTab />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <NotificationsTab />
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <SecurityTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}