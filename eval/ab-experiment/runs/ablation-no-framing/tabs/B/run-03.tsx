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
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:font-semibold",
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
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

function ToggleSwitch({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function NotificationRow({
  label,
  description,
  checked,
  onChange,
  id,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ToggleSwitch id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

function ProfileTab() {
  const [firstName, setFirstName] = React.useState("Jane");
  const [lastName, setLastName] = React.useState("Smith");
  const [email, setEmail] = React.useState("jane.smith@example.com");
  const [username, setUsername] = React.useState("janesmith");
  const [bio, setBio] = React.useState("");
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="username">Username</Label>
          <div className="flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <span className="select-none pl-3 text-sm text-muted-foreground">@</span>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="flex-1 bg-transparent py-2 pl-1 pr-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself"
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
          <p className="text-xs text-muted-foreground">{bio.length}/160 characters</p>
        </div>
      </div>
      <Divider />
      <div className="flex items-center gap-3">
        <Button type="submit">{saved ? "Saved!" : "Save changes"}</Button>
        <Button type="button" variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  );
}

function NotificationsTab() {
  const [emailMarketing, setEmailMarketing] = React.useState(true);
  const [emailSecurity, setEmailSecurity] = React.useState(true);
  const [emailUpdates, setEmailUpdates] = React.useState(false);
  const [pushComments, setPushComments] = React.useState(true);
  const [pushMentions, setPushMentions] = React.useState(true);
  const [pushFollows, setPushFollows] = React.useState(false);
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
        description="Choose how and when you want to be notified."
      />

      <h3 className="text-sm font-semibold text-foreground mb-1">Email notifications</h3>
      <p className="text-sm text-muted-foreground mb-2">
        Manage which emails we send to your inbox.
      </p>
      <div className="divide-y divide-border rounded-lg border border-border px-4">
        <NotificationRow
          id="email-marketing"
          label="Marketing"
          description="Receive news, product updates, and special offers."
          checked={emailMarketing}
          onChange={setEmailMarketing}
        />
        <NotificationRow
          id="email-security"
          label="Security alerts"
          description="Get notified about suspicious activity and login attempts."
          checked={emailSecurity}
          onChange={setEmailSecurity}
        />
        <NotificationRow
          id="email-updates"
          label="Product updates"
          description="Hear about new features and improvements."
          checked={emailUpdates}
          onChange={setEmailUpdates}
        />
      </div>

      <h3 className="text-sm font-semibold text-foreground mt-8 mb-1">Push notifications</h3>
      <p className="text-sm text-muted-foreground mb-2">
        These notifications are delivered directly to your device.
      </p>
      <div className="divide-y divide-border rounded-lg border border-border px-4">
        <NotificationRow
          id="push-comments"
          label="Comments"
          description="Someone commented on your post or reply."
          checked={pushComments}
          onChange={setPushComments}
        />
        <NotificationRow
          id="push-mentions"
          label="Mentions"
          description="Someone mentioned you in a comment or post."
          checked={pushMentions}
          onChange={setPushMentions}
        />
        <NotificationRow
          id="push-follows"
          label="New followers"
          description="Someone started following your profile."
          checked={pushFollows}
          onChange={setPushFollows}
        />
      </div>

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
  const [passwordError, setPasswordError] = React.useState("");
  const [passwordSaved, setPasswordSaved] = React.useState(false);

  function getStrength(password: string): { label: string; color: string; width: string } {
    if (password.length === 0) return { label: "", color: "", width: "0%" };
    if (password.length < 6) return { label: "Weak", color: "bg-destructive", width: "25%" };
    if (password.length < 10) return { label: "Fair", color: "bg-yellow-500", width: "50%" };
    if (password.length < 14) return { label: "Good", color: "bg-blue-500", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  }

  const strength = getStrength(newPassword);

  function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 2000);
  }

  return (
    <div className="space-y-8">
      <div>
        <SectionHeading
          title="Security"
          description="Keep your account secure by managing your password and authentication settings."
        />

        <form onSubmit={handlePasswordSave} noValidate className="space-y-5">
          <h3 className="text-sm font-semibold text-foreground">Change password</h3>
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {newPassword.length > 0 && (
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-300", strength.color)}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Strength: <span className="font-medium text-foreground">{strength.label}</span>
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
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
          {passwordError && (
            <p role="alert" className="text-sm text-destructive">
              {passwordError}
            </p>
          )}
          <Button type="submit">{passwordSaved ? "Password updated!" : "Update password"}</Button>
        </form>
      </div>

      <Divider />

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Two-factor authentication</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add an extra layer of security to your account. When enabled, you'll be asked for a
          verification code in addition to your password.
        </p>
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {twoFactor ? "Enabled" : "Disabled"}
            </p>
            <p className="text-sm text-muted-foreground">
              {twoFactor
                ? "Two-factor authentication is active on your account."
                : "Enable two-factor authentication for stronger security."}
            </p>
          </div>
          <ToggleSwitch id="two-factor" checked={twoFactor} onChange={setTwoFactor} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Session alerts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Receive an alert when a new device signs in to your account.
        </p>
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-4">
          <div>
            <p className="text-sm font-medium text-foreground">Login alerts</p>
            <p className="text-sm text-muted-foreground">
              Get notified when someone signs in from a new device.
            </p>
          </div>
          <ToggleSwitch id="session-alerts" checked={sessionAlerts} onChange={setSessionAlerts} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Active sessions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Review and revoke any sessions that you don't recognize.
        </p>
        <div className="divide-y divide-border rounded-lg border border-border">
          {[
            { device: "MacBook Pro — Chrome", location: "San Francisco, CA", current: true },
            { device: "iPhone 15 — Safari", location: "San Francisco, CA", current: false },
            { device: "Windows PC — Firefox", location: "New York, NY", current: false },
          ].map((session) => (
            <div
              key={session.device}
              className="flex items-center justify-between px-4 py-3 gap-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  {session.device}
                  {session.current && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{session.location}</p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences and security.
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