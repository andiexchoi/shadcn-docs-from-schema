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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-foreground">{children}</h2>
  );
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function Divider() {
  return <hr className="border-border" />;
}

function ProfileTab() {
  const [name, setName] = React.useState("Jane Doe");
  const [email, setEmail] = React.useState("jane@example.com");
  const [username, setUsername] = React.useState("janedoe");
  const [bio, setBio] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <SectionHeading>Profile</SectionHeading>
        <SectionDescription>
          Manage your public profile information.
        </SectionDescription>
      </div>
      <Divider />

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <p className="text-xs text-muted-foreground">
            Your profile URL: example.com/@{username || "username"}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself"
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {bio.length}/160 characters
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">{saved ? "Saved!" : "Save changes"}</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setName("Jane Doe");
            setEmail("jane@example.com");
            setUsername("janedoe");
            setBio("");
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
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
      description: "Receive emails about your account activity.",
      enabled: true,
    },
    {
      id: "product-news",
      label: "Product news",
      description: "Stay informed about new features and improvements.",
      enabled: false,
    },
    {
      id: "security-alerts",
      label: "Security alerts",
      description: "Get notified about unusual activity on your account.",
      enabled: true,
    },
    {
      id: "weekly-digest",
      label: "Weekly digest",
      description: "A weekly summary of your activity and highlights.",
      enabled: false,
    },
    {
      id: "mentions",
      label: "Mentions",
      description: "Notify me when someone mentions me.",
      enabled: true,
    },
  ]);

  const [saved, setSaved] = React.useState(false);

  function toggle(id: string) {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <SectionHeading>Notifications</SectionHeading>
        <SectionDescription>
          Choose what you want to be notified about.
        </SectionDescription>
      </div>
      <Divider />

      <ul className="space-y-5">
        {settings.map((setting) => (
          <li key={setting.id} className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor={setting.id} className="text-sm font-medium cursor-pointer">
                {setting.label}
              </Label>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
            <Toggle
              id={setting.id}
              checked={setting.enabled}
              onChange={() => toggle(setting.id)}
            />
          </li>
        ))}
      </ul>

      <Divider />

      <Button type="submit">{saved ? "Saved!" : "Save preferences"}</Button>
    </form>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [sessionAlerts, setSessionAlerts] = React.useState(true);
  const [pwSaved, setPwSaved] = React.useState(false);
  const [pwError, setPwError] = React.useState("");

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      setPwError("Current password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }
    setPwError("");
    setPwSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPwSaved(false), 2000);
  }

  return (
    <div className="space-y-8">
      <div>
        <SectionHeading>Security</SectionHeading>
        <SectionDescription>
          Manage your password and account security settings.
        </SectionDescription>
      </div>
      <Divider />

      {/* Password section */}
      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h3 className="text-base font-medium text-foreground">Change password</h3>

        <div className="flex flex-col gap-1.5">
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

        <div className="flex flex-col gap-1.5">
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
            Must be at least 8 characters.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
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

        {pwError && (
          <p role="alert" className="text-sm text-destructive">
            {pwError}
          </p>
        )}

        <Button type="submit">{pwSaved ? "Password updated!" : "Update password"}</Button>
      </form>

      <Divider />

      {/* Two-factor auth */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-foreground">Two-factor authentication</h3>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <Label htmlFor="two-factor" className="text-sm font-medium cursor-pointer">
              Authenticator app
            </Label>
            <p className="text-sm text-muted-foreground">
              Use an authenticator app to generate one-time codes for sign-in.
            </p>
          </div>
          <Toggle
            id="two-factor"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>

        {twoFactor && (
          <div className="rounded-md border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            Open your authenticator app and scan the QR code to complete setup.
            (QR code would render here in a real implementation.)
          </div>
        )}
      </div>

      <Divider />

      {/* Session alerts */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-foreground">Sessions</h3>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <Label htmlFor="session-alerts" className="text-sm font-medium cursor-pointer">
              New sign-in alerts
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive an email when a new device signs into your account.
            </p>
          </div>
          <Toggle
            id="session-alerts"
            checked={sessionAlerts}
            onChange={setSessionAlerts}
          />
        </div>
      </div>

      <Divider />

      {/* Danger zone */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-destructive">Danger zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <Button
          type="button"
          variant="destructive"
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
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
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