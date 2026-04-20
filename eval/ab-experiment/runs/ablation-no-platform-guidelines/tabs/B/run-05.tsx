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
  return (
    <div>
      <SectionHeading
        title="Profile"
        description="Manage your public profile information."
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Doe" defaultValue="Doe" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            defaultValue="jane@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <div className="flex items-center rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <span className="select-none text-muted-foreground">@</span>
            <input
              id="username"
              defaultValue="janedoe"
              className="flex-1 bg-transparent py-2 pl-1 pr-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              placeholder="janedoe"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            defaultValue="Product designer & developer based in New York."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
            placeholder="Tell us a little about yourself"
          />
        </div>

        <Divider />

        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-xl font-bold text-white select-none">
              JD
            </div>
            <div className="space-y-1">
              <Button variant="outline" size="sm">
                Upload photo
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

type NotificationChannel = "email" | "push" | "sms";
type NotificationCategory = "marketing" | "security" | "updates" | "reminders";

const notificationItems: { id: NotificationCategory; label: string; description: string }[] = [
  {
    id: "marketing",
    label: "Marketing",
    description: "News, promotions, and product announcements.",
  },
  {
    id: "security",
    label: "Security alerts",
    description: "Login attempts, password changes, and suspicious activity.",
  },
  {
    id: "updates",
    label: "Product updates",
    description: "New features, improvements, and changelog.",
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Task deadlines and scheduled events.",
  },
];

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

function NotificationsTab() {
  const [channels, setChannels] = React.useState<Record<NotificationChannel, boolean>>({
    email: true,
    push: false,
    sms: false,
  });

  const [categories, setCategories] = React.useState<Record<NotificationCategory, boolean>>({
    marketing: false,
    security: true,
    updates: true,
    reminders: false,
  });

  const toggleChannel = (channel: NotificationChannel, value: boolean) =>
    setChannels((prev) => ({ ...prev, [channel]: value }));

  const toggleCategory = (category: NotificationCategory, value: boolean) =>
    setCategories((prev) => ({ ...prev, [category]: value }));

  return (
    <div>
      <SectionHeading
        title="Notifications"
        description="Choose how and when you receive notifications."
      />

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground">Channels</h3>
          <div className="space-y-3 rounded-md border border-border p-4">
            {(
              [
                { id: "email", label: "Email", description: "Receive notifications via email." },
                { id: "push", label: "Push notifications", description: "Browser or mobile push alerts." },
                { id: "sms", label: "SMS", description: "Text message alerts to your phone." },
              ] as { id: NotificationChannel; label: string; description: string }[]
            ).map((item, index, arr) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Toggle
                    id={`channel-${item.id}`}
                    checked={channels[item.id]}
                    onChange={(v) => toggleChannel(item.id, v)}
                  />
                </div>
                {index < arr.length - 1 && <hr className="border-border" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-foreground">Categories</h3>
          <div className="space-y-3 rounded-md border border-border p-4">
            {notificationItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Toggle
                    id={`category-${item.id}`}
                    checked={categories[item.id]}
                    onChange={(v) => toggleCategory(item.id, v)}
                  />
                </div>
                {index < notificationItems.length - 1 && <hr className="border-border" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="outline">Reset defaults</Button>
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = React.useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              strength >= level ? colors[strength] : "bg-muted"
            )}
          />
        ))}
      </div>
      {password && (
        <p className={cn("text-xs", strength <= 1 ? "text-red-500" : strength === 2 ? "text-yellow-600" : strength === 3 ? "text-blue-500" : "text-green-600")}>
          {labels[strength]}
        </p>
      )}
    </div>
  );
}

function SecurityTab() {
  const [newPassword, setNewPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(false);

  const sessions = [
    { device: "MacBook Pro — Chrome", location: "New York, US", current: true, lastActive: "Now" },
    { device: "iPhone 15 — Safari", location: "New York, US", current: false, lastActive: "2 hours ago" },
    { device: "Windows PC — Firefox", location: "Los Angeles, US", current: false, lastActive: "3 days ago" },
  ];

  return (
    <div>
      <SectionHeading
        title="Security"
        description="Manage your password, two-factor authentication, and active sessions."
      />

      <div className="space-y-8">
        {/* Change password */}
        <div>
          <h3 className="mb-4 text-sm font-medium text-foreground">Change password</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.698.074-1.38.213-2.037M6.53 6.53A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10a9.956 9.956 0 01-1.53 5.47M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.698.074-1.38.213-2.037M6.53 6.53A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10a9.956 9.956 0 01-1.53 5.47M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <PasswordStrengthBar password={newPassword} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.698.074-1.38.213-2.037M6.53 6.53A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10a9.956 9.956 0 01-1.53 5.47M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Update password</Button>
            </div>
          </div>
        </div>

        <Divider />

        {/* Two-factor auth */}
        <div>
          <h3 className="mb-4 text-sm font-medium text-foreground">Two-factor authentication</h3>
          <div className="flex items-start justify-between gap-6 rounded-md border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Authenticator app</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Use an authenticator app to generate one-time codes for an added layer of security.
              </p>
              {twoFactor && (
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Enabled
                </span>
              )}
            </div>
            <Button
              variant={twoFactor ? "outline" : "default"}
              size="sm"
              onClick={() => setTwoFactor((v) => !v)}
            >
              {twoFactor ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>

        <Divider />

        {/* Active sessions */}
        <div>
          <h3 className="mb-4 text-sm font-medium text-foreground">Active sessions</h3>
          <div className="space-y-3 rounded-md border border-border p-4">
            {sessions.map((session, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.location} · {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive">
                      Revoke
                    </Button>
                  )}
                </div>
                {index < sessions.length - 1 && <hr className="border-border" />}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30">
              Revoke all other sessions
            </Button>
          </div>
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account preferences and security settings.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-2 w-full justify-start gap-1">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsTab />
            </TabsContent>
            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}