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

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

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
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function ProfileTab() {
  const [form, setForm] = React.useState({
    name: "Jane Doe",
    email: "jane@example.com",
    username: "janedoe",
    bio: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Personal information"
        description="Update your name, username, and bio."
      >
        <div className="grid gap-5 sm:grid-cols-2">
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
              placeholder="your_username"
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
              placeholder="Tell us a little about yourself"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background resize-none"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Save changes</Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Avatar"
        description="Upload a profile picture to personalise your account."
      >
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary select-none">
            {form.name.trim().charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm">
              Upload photo
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              Remove
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = React.useState({
    emailMarketing: true,
    emailSecurity: true,
    emailUpdates: false,
    pushAll: false,
    pushMentions: true,
    pushReplies: true,
  });

  function toggle(key: keyof typeof settings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const emailRows: { key: keyof typeof settings; label: string; desc: string }[] =
    [
      {
        key: "emailSecurity",
        label: "Security alerts",
        desc: "Receive emails for sign-ins and account changes.",
      },
      {
        key: "emailMarketing",
        label: "Product news",
        desc: "Tips, feature announcements, and offers.",
      },
      {
        key: "emailUpdates",
        label: "Activity summary",
        desc: "A weekly digest of your account activity.",
      },
    ];

  const pushRows: { key: keyof typeof settings; label: string; desc: string }[] =
    [
      {
        key: "pushAll",
        label: "All notifications",
        desc: "Push every notification to your device.",
      },
      {
        key: "pushMentions",
        label: "Mentions",
        desc: "Notify when someone mentions you.",
      },
      {
        key: "pushReplies",
        label: "Replies",
        desc: "Notify when someone replies to your content.",
      },
    ];

  function NotificationRow({
    id,
    label,
    desc,
    checked,
    onToggle,
  }: {
    id: string;
    label: string;
    desc: string;
    checked: boolean;
    onToggle: () => void;
  }) {
    return (
      <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
        <div>
          <Label htmlFor={id} className="cursor-pointer font-medium">
            {label}
          </Label>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
        <ToggleSwitch id={id} checked={checked} onChange={onToggle} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Email notifications"
        description="Choose which emails you'd like to receive."
      >
        <div>
          {emailRows.map((row) => (
            <NotificationRow
              key={row.key}
              id={`notif-${row.key}`}
              label={row.label}
              desc={row.desc}
              checked={settings[row.key]}
              onToggle={() => toggle(row.key)}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Push notifications"
        description="Manage push alerts sent to your devices."
      >
        <div>
          {pushRows.map((row) => (
            <NotificationRow
              key={row.key}
              id={`notif-${row.key}`}
              label={row.label}
              desc={row.desc}
              checked={settings[row.key]}
              onToggle={() => toggle(row.key)}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function SecurityTab() {
  const [passwords, setPasswords] = React.useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordError(null);
    setPasswordSuccess(false);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!passwords.current) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (passwords.next.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordSuccess(true);
    setPasswords({ current: "", next: "", confirm: "" });
  }

  const sessions = [
    { device: "MacBook Pro — Chrome", location: "New York, US", current: true },
    { device: "iPhone 15 — Safari", location: "New York, US", current: false },
    { device: "Windows 11 — Edge", location: "Chicago, US", current: false },
  ];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Change password"
        description="Use a strong password that you don't use elsewhere."
      >
        <form onSubmit={handlePasswordSubmit} noValidate>
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="current">Current password</Label>
              <Input
                id="current"
                name="current"
                type="password"
                value={passwords.current}
                onChange={handlePasswordChange}
                placeholder="••••••••"
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
                placeholder="••••••••"
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
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            {passwordError && (
              <p role="alert" className="text-sm text-destructive">
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p role="status" className="text-sm text-green-600">
                Password updated successfully.
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Two-factor authentication"
        description="Add an extra layer of security to your account."
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {twoFactor ? "2FA is enabled" : "2FA is disabled"}
            </p>
            <p className="text-sm text-muted-foreground">
              {twoFactor
                ? "Your account is protected by an authenticator app."
                : "Enable two-factor authentication to secure your account."}
            </p>
          </div>
          <ToggleSwitch
            id="two-factor"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>
        {twoFactor && (
          <div className="mt-4">
            <Button variant="outline" size="sm">
              View recovery codes
            </Button>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Active sessions"
        description="Devices that are currently signed in to your account."
      >
        <ul className="divide-y">
          {sessions.map((session, i) => (
            <li key={i} className="flex items-center justify-between gap-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {session.device}
                  </span>
                  {session.current && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      This device
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{session.location}</p>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive shrink-0">
                  Revoke
                </Button>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t pt-4">
          <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
            Sign out all other sessions
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 w-full justify-start">
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
  );
}