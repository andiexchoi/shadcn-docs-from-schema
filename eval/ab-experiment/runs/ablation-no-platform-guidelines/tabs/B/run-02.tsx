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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-6 pt-0">{children}</div>
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
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

function ProfileTab() {
  const [form, setForm] = React.useState({
    name: "Alex Johnson",
    username: "alexjohnson",
    email: "alex@example.com",
    bio: "Frontend engineer and design enthusiast.",
    website: "https://alexjohnson.dev",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Personal information"
        description="Update your name, username, and public profile details."
      >
        <div className="grid gap-5">
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
          </div>
          <div className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us a bit about yourself"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="flex justify-end">
            <Button>Save changes</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Profile photo"
        description="Upload a photo to personalise your account."
      >
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-2xl font-bold text-white select-none">
            AJ
          </div>
          <div className="space-y-2">
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                Upload photo
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                Remove
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, GIF or PNG. Max size 2 MB.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function NotificationsTab() {
  const [email, setEmail] = React.useState({
    marketing: true,
    security: true,
    updates: false,
    digest: true,
  });

  const [push, setPush] = React.useState({
    mentions: true,
    comments: false,
    reminders: true,
  });

  const emailItems: { key: keyof typeof email; label: string; description: string }[] = [
    {
      key: "marketing",
      label: "Marketing emails",
      description: "Receive emails about new features, tips, and promotions.",
    },
    {
      key: "security",
      label: "Security alerts",
      description: "Get notified about sign-ins and important account activity.",
    },
    {
      key: "updates",
      label: "Product updates",
      description: "Weekly round-up of what's new in the product.",
    },
    {
      key: "digest",
      label: "Activity digest",
      description: "A daily summary of activity relevant to you.",
    },
  ];

  const pushItems: { key: keyof typeof push; label: string; description: string }[] = [
    {
      key: "mentions",
      label: "Mentions",
      description: "Notify me when someone mentions me in a comment.",
    },
    {
      key: "comments",
      label: "Comments",
      description: "Notify me when someone replies to my posts.",
    },
    {
      key: "reminders",
      label: "Reminders",
      description: "Get reminders about tasks and deadlines.",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Email notifications"
        description="Choose which emails you want to receive."
      >
        <div className="divide-y">
          {emailItems.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="space-y-0.5">
                <label
                  htmlFor={`email-${key}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {label}
                </label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <ToggleSwitch
                id={`email-${key}`}
                checked={email[key]}
                onChange={(val) => setEmail((prev) => ({ ...prev, [key]: val }))}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Push notifications"
        description="Control in-app and browser push notifications."
      >
        <div className="divide-y">
          {pushItems.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="space-y-0.5">
                <label
                  htmlFor={`push-${key}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {label}
                </label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <ToggleSwitch
                id={`push-${key}`}
                checked={push[key]}
                onChange={(val) => setPush((prev) => ({ ...prev, [key]: val }))}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <Button>Save preferences</Button>
      </div>
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sessions = [
    { device: "MacBook Pro — Chrome", location: "San Francisco, US", current: true, lastSeen: "Active now" },
    { device: "iPhone 15 — Safari", location: "San Francisco, US", current: false, lastSeen: "2 hours ago" },
    { device: "Windows PC — Edge", location: "New York, US", current: false, lastSeen: "5 days ago" },
  ];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Change password"
        description="We recommend using a strong, unique password."
      >
        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              name="current"
              type="password"
              value={passwords.current}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
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
              placeholder="Enter new password"
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
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex justify-end">
            <Button>Update password</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Two-factor authentication"
        description="Add an extra layer of security to your account."
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {twoFactor ? "Two-factor authentication is enabled" : "Two-factor authentication is disabled"}
            </p>
            <p className="text-sm text-muted-foreground">
              {twoFactor
                ? "Your account is protected with an authenticator app."
                : "Enable 2FA to protect your account with a second verification step."}
            </p>
          </div>
          <ToggleSwitch
            id="two-factor"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>
        {twoFactor && (
          <div className="mt-4 rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Scan the QR code below with your authenticator app to get started.
            </p>
            <div className="mt-3 flex h-32 w-32 items-center justify-center rounded-md border bg-background text-xs text-muted-foreground">
              QR code
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Active sessions"
        description="Manage devices where you're currently signed in."
      >
        <div className="divide-y">
          {sessions.map((session, index) => (
            <div key={index} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{session.device}</span>
                  {session.current && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      This device
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {session.location} · {session.lastSeen}
                </p>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive shrink-0">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Danger zone"
        description="Permanent actions that cannot be undone."
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <Button variant="destructive" size="sm" className="shrink-0">
            Delete account
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1.5 text-muted-foreground">
            Manage your account preferences and security settings.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 w-full justify-start gap-1 bg-muted">
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