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

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Divider() {
  return <hr className="my-6 border-border" />;
}

function ProfileTab() {
  const [firstName, setFirstName] = React.useState("Jane");
  const [lastName, setLastName] = React.useState("Doe");
  const [email, setEmail] = React.useState("jane.doe@example.com");
  const [bio, setBio] = React.useState("Frontend engineer who loves building great UIs.");
  const [saved, setSaved] = React.useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} noValidate>
      <SectionHeading
        title="Profile"
        description="Update your personal information and how others see you."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Tell us a little about yourself"
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
        <p className="text-xs text-muted-foreground">{bio.length} / 160 characters</p>
      </div>

      <Divider />

      <div className="flex items-center gap-3">
        <Button type="submit">{saved ? "Saved!" : "Save changes"}</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}

type ToggleProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function Toggle({ id, label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="cursor-pointer font-medium">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        type="button"
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}

function NotificationsTab() {
  const [emailDigest, setEmailDigest] = React.useState(true);
  const [productUpdates, setProductUpdates] = React.useState(true);
  const [securityAlerts, setSecurityAlerts] = React.useState(true);
  const [marketingEmails, setMarketingEmails] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSave} noValidate>
      <SectionHeading
        title="Notifications"
        description="Choose what updates you want to receive and how."
      />

      <div className="rounded-md border border-border divide-y divide-border">
        <div className="px-4">
          <Toggle
            id="emailDigest"
            label="Weekly digest"
            description="Receive a weekly summary of activity in your workspace."
            checked={emailDigest}
            onChange={setEmailDigest}
          />
        </div>
        <div className="px-4">
          <Toggle
            id="productUpdates"
            label="Product updates"
            description="Get notified about new features and improvements."
            checked={productUpdates}
            onChange={setProductUpdates}
          />
        </div>
        <div className="px-4">
          <Toggle
            id="securityAlerts"
            label="Security alerts"
            description="Be alerted about suspicious sign-ins and account changes."
            checked={securityAlerts}
            onChange={setSecurityAlerts}
          />
        </div>
        <div className="px-4">
          <Toggle
            id="marketingEmails"
            label="Marketing emails"
            description="Receive tips, tutorials, and promotional offers."
            checked={marketingEmails}
            onChange={setMarketingEmails}
          />
        </div>
        <div className="px-4">
          <Toggle
            id="pushNotifications"
            label="Push notifications"
            description="Allow browser push notifications for real-time alerts."
            checked={pushNotifications}
            onChange={setPushNotifications}
          />
        </div>
      </div>

      <Divider />

      <div className="flex items-center gap-3">
        <Button type="submit">{saved ? "Saved!" : "Save preferences"}</Button>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [sessionTimeout, setSessionTimeout] = React.useState("30");
  const [error, setError] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  function getStrength(pwd: string): { label: string; color: string; width: string } {
    if (pwd.length === 0) return { label: "", color: "bg-border", width: "w-0" };
    if (pwd.length < 6) return { label: "Weak", color: "bg-destructive", width: "w-1/4" };
    if (pwd.length < 10) return { label: "Fair", color: "bg-yellow-500", width: "w-2/4" };
    if (pwd.length < 14) return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  }

  const strength = getStrength(newPassword);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!currentPassword) {
      setError("Current password is required.");
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
    setSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-8">
      {/* Change password */}
      <form onSubmit={handleSave} noValidate>
        <SectionHeading
          title="Security"
          description="Manage your password, two-factor authentication, and session settings."
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            {newPassword.length > 0 && (
              <div className="mt-1 space-y-1">
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      strength.color,
                      strength.width
                    )}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Strength:{" "}
                  <span className="font-medium text-foreground">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {saved && (
          <p className="mt-3 text-sm text-green-600 dark:text-green-400" role="status">
            Password updated successfully.
          </p>
        )}

        <Divider />

        <div className="flex items-center gap-3">
          <Button type="submit">Update password</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
              setError("");
            }}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Two-factor authentication */}
      <div className="rounded-md border border-border p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium text-sm">Two-factor authentication</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add an extra layer of security to your account by requiring a verification code on
              sign-in.
            </p>
          </div>
          <button
            role="switch"
            aria-checked={twoFactor}
            onClick={() => setTwoFactor((v) => !v)}
            type="button"
            className={cn(
              "relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              twoFactor ? "bg-primary" : "bg-input"
            )}
          >
            <span
              className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                twoFactor ? "translate-x-5" : "translate-x-0"
              )}
            />
            <span className="sr-only">Two-factor authentication</span>
          </button>
        </div>
        {twoFactor && (
          <div className="mt-4 rounded-md bg-muted px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Two-factor authentication is{" "}
              <span className="font-medium text-foreground">enabled</span>. You will be prompted
              for a code on your next sign-in.
            </p>
          </div>
        )}
      </div>

      {/* Session timeout */}
      <div className="rounded-md border border-border p-4">
        <p className="font-medium text-sm">Session timeout</p>
        <p className="text-sm text-muted-foreground mt-0.5 mb-3">
          Automatically sign out after a period of inactivity.
        </p>
        <div className="flex flex-col gap-1.5 max-w-xs">
          <Label htmlFor="sessionTimeout">Timeout duration</Label>
          <select
            id="sessionTimeout"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="240">4 hours</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-md border border-destructive/40 p-4">
        <p className="font-medium text-sm text-destructive">Danger zone</p>
        <p className="text-sm text-muted-foreground mt-0.5 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="destructive" type="button">
          Delete account
        </Button>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences and security options.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-2 w-full sm:w-auto">
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