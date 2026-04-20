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
  const [bio, setBio] = React.useState("Frontend engineer & design systems enthusiast.");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
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
        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yoursite.com"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

type NotificationKey =
  | "emailMarketing"
  | "emailSecurity"
  | "emailUpdates"
  | "pushAll"
  | "pushMentions"
  | "pushReminders";

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
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

function NotificationRow({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = React.useState<Record<NotificationKey, boolean>>({
    emailMarketing: false,
    emailSecurity: true,
    emailUpdates: true,
    pushAll: false,
    pushMentions: true,
    pushReminders: false,
  });

  const toggle = (key: NotificationKey) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Choose how and when you hear from us.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Email</h3>
        <div className="divide-y divide-border rounded-md border px-4">
          <NotificationRow
            id="emailSecurity"
            label="Security alerts"
            description="Receive emails about login attempts and account changes."
            checked={prefs.emailSecurity}
            onChange={() => toggle("emailSecurity")}
          />
          <NotificationRow
            id="emailUpdates"
            label="Product updates"
            description="Get notified about new features and improvements."
            checked={prefs.emailUpdates}
            onChange={() => toggle("emailUpdates")}
          />
          <NotificationRow
            id="emailMarketing"
            label="Marketing"
            description="Occasional tips, offers, and announcements."
            checked={prefs.emailMarketing}
            onChange={() => toggle("emailMarketing")}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Push</h3>
        <div className="divide-y divide-border rounded-md border px-4">
          <NotificationRow
            id="pushAll"
            label="All activity"
            description="Get a push notification for every action on your account."
            checked={prefs.pushAll}
            onChange={() => toggle("pushAll")}
          />
          <NotificationRow
            id="pushMentions"
            label="Mentions"
            description="Only notify when someone mentions you directly."
            checked={prefs.pushMentions}
            onChange={() => toggle("pushMentions")}
          />
          <NotificationRow
            id="pushReminders"
            label="Reminders"
            description="Scheduled digests and task reminders."
            checked={prefs.pushReminders}
            onChange={() => toggle("pushReminders")}
          />
        </div>
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
    newPassword === confirmPassword || confirmPassword === "";
  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your password and account security settings.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Change password
        </h3>
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">Current password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          {newPassword.length > 0 && newPassword.length < 8 && (
            <p className="text-xs text-destructive">
              Password must be at least 8 characters.
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!passwordsMatch}
          />
          {!passwordsMatch && (
            <p className="text-xs text-destructive">Passwords do not match.</p>
          )}
        </div>
        <div className="flex justify-end">
          <Button disabled={!canSubmit}>Update password</Button>
        </div>
      </div>

      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Two-factor authentication
        </h3>
        <div className="flex items-center justify-between rounded-md border px-4 py-3">
          <div className="space-y-0.5">
            <Label htmlFor="twoFactor" className="text-sm font-medium cursor-pointer">
              Authenticator app
            </Label>
            <p className="text-xs text-muted-foreground">
              Use an authenticator app to generate one-time codes.
            </p>
          </div>
          <Toggle
            id="twoFactor"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>
        {twoFactor && (
          <div className="rounded-md border border-dashed border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Scan the QR code in your authenticator app to complete setup. (QR
            code would appear here.)
          </div>
        )}
      </div>

      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Danger zone</h3>
        <div className="rounded-md border border-destructive/40 px-4 py-3 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              Delete account
            </p>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          <Button variant="destructive" className="shrink-0">
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences and security.
          </p>
        </div>
        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start">
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