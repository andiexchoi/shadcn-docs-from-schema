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
      "inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground gap-1",
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

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function Divider() {
  return <hr className="my-6 border-border" />;
}

function ToggleSwitch({
  id,
  label,
  description,
  defaultChecked = false,
}: {
  id: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <Label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}

function ProfileTab() {
  return (
    <div>
      <SectionHeader
        title="Profile"
        description="Manage your personal information and how it appears to others."
      />

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Smith" defaultValue="Smith" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            defaultValue="jane@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <div className="flex items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background overflow-hidden">
            <span className="pl-3 pr-1 text-sm text-muted-foreground select-none">
              @
            </span>
            <input
              id="username"
              className="flex-1 py-2 pr-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="janesmith"
              defaultValue="janesmith"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Tell us a little about yourself…"
            defaultValue="Product designer & coffee enthusiast based in NYC."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
          <p className="text-xs text-muted-foreground">Max 160 characters.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Discard</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div>
      <SectionHeader
        title="Notifications"
        description="Choose how and when you receive notifications."
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Email notifications
          </h3>
          <div className="space-y-4">
            <ToggleSwitch
              id="notif-product-updates"
              label="Product updates"
              description="Receive emails about new features and improvements."
              defaultChecked={true}
            />
            <ToggleSwitch
              id="notif-account-activity"
              label="Account activity"
              description="Get notified about sign-ins, password changes, and more."
              defaultChecked={true}
            />
            <ToggleSwitch
              id="notif-weekly-digest"
              label="Weekly digest"
              description="A weekly summary of your activity and highlights."
              defaultChecked={false}
            />
            <ToggleSwitch
              id="notif-marketing"
              label="Marketing emails"
              description="Tips, promotions, and news from our team."
              defaultChecked={false}
            />
          </div>
        </div>

        <Divider />

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Push notifications
          </h3>
          <div className="space-y-4">
            <ToggleSwitch
              id="notif-push-mentions"
              label="Mentions"
              description="When someone mentions you in a comment or post."
              defaultChecked={true}
            />
            <ToggleSwitch
              id="notif-push-replies"
              label="Replies"
              description="When someone replies to your content."
              defaultChecked={true}
            />
            <ToggleSwitch
              id="notif-push-reminders"
              label="Reminders"
              description="Reminders for upcoming tasks and deadlines."
              defaultChecked={false}
            />
          </div>
        </div>

        <Divider />

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Notification frequency
          </h3>
          <div className="space-y-1.5">
            <Label htmlFor="frequency">Send me notifications</Label>
            <select
              id="frequency"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              defaultValue="realtime"
            >
              <option value="realtime">In real time</option>
              <option value="hourly">Once an hour (digest)</option>
              <option value="daily">Once a day (digest)</option>
              <option value="weekly">Once a week (digest)</option>
            </select>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to defaults</Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <div>
      <SectionHeader
        title="Security"
        description="Manage your password, two-factor authentication, and active sessions."
      />

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Change password
          </h3>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? "Hide" : "Show"}
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
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters. Use a mix of letters, numbers, and symbols.
              </p>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Update password</Button>
            </div>
          </div>
        </div>

        <Divider />

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Two-factor authentication
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add an extra layer of security to your account by requiring a verification code in addition to your password.
          </p>
          <div className="space-y-3">
            <ToggleSwitch
              id="2fa-authenticator"
              label="Authenticator app"
              description="Use an app like Google Authenticator or Authy."
              defaultChecked={true}
            />
            <ToggleSwitch
              id="2fa-sms"
              label="SMS verification"
              description="Receive a one-time code via text message."
              defaultChecked={false}
            />
          </div>
        </div>

        <Divider />

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Active sessions
          </h3>
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
                device: "Windows PC — Edge",
                location: "Chicago, US",
                time: "3 days ago",
                current: false,
              },
            ].map((session) => (
              <div
                key={session.device}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.device}
                    {session.current && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {session.location} · {session.time}
                  </p>
                </div>
                {!session.current && (
                  <Button variant="outline" size="sm" className="shrink-0">
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="destructive" size="sm">
              Revoke all other sessions
            </Button>
          </div>
        </div>

        <Divider />

        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
          <h3 className="text-sm font-semibold text-destructive mb-1">
            Danger zone
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="destructive" size="sm">
            Delete account
          </Button>
        </div>
      </div>
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
            Manage your account preferences and security settings.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-2 w-full sm:w-auto bg-muted">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="mt-4 rounded-xl border border-border bg-card p-6 shadow-sm">
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