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
      "inline-flex items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground",
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
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
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
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
  const [enabled, setEnabled] = React.useState(defaultChecked);

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled((prev) => !prev)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          enabled ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

function ProfileTab() {
  return (
    <div>
      <SectionHeading
        title="Profile"
        description="Manage your public profile information."
      />

      <div className="grid gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Doe" defaultValue="Doe" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            defaultValue="jane@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="username">Username</Label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground select-none">
              @
            </span>
            <Input
              id="username"
              className="rounded-l-none"
              placeholder="janedoe"
              defaultValue="janedoe"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Tell us a little about yourself…"
            defaultValue="Product designer and occasional developer."
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://example.com"
            defaultValue="https://janedoe.com"
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
      <SectionHeading
        title="Notifications"
        description="Choose how and when you want to be notified."
      />

      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email notifications
          </p>
          <div className="flex flex-col gap-4">
            <ToggleSwitch
              id="notif-product-updates"
              label="Product updates"
              description="Receive emails about new features and improvements."
              defaultChecked={true}
            />
            <ToggleSwitch
              id="notif-account-activity"
              label="Account activity"
              description="Get notified when someone signs into your account."
              defaultChecked={true}
            />
            <ToggleSwitch
              id="notif-marketing"
              label="Marketing"
              description="Tips, tutorials, and promotional offers."
              defaultChecked={false}
            />
            <ToggleSwitch
              id="notif-digest"
              label="Weekly digest"
              description="A summary of your activity delivered every Monday."
              defaultChecked={false}
            />
          </div>
        </div>

        <Divider />

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Push notifications
          </p>
          <div className="flex flex-col gap-4">
            <ToggleSwitch
              id="notif-push-mentions"
              label="Mentions"
              description="Notify when someone mentions you in a comment."
              defaultChecked={true}
            />
            <ToggleSwitch
              id="notif-push-reminders"
              label="Reminders"
              description="Task and deadline reminders delivered to your device."
              defaultChecked={true}
            />
            <ToggleSwitch
              id="notif-push-team"
              label="Team updates"
              description="Activity from people you collaborate with."
              defaultChecked={false}
            />
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to defaults</Button>
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

function PasswordStrengthBar({ password }: { password: string }) {
  const score = React.useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-transparent",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  return (
    <div className="mt-2 flex flex-col gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              i <= score ? colors[score] : "bg-muted"
            )}
          />
        ))}
      </div>
      {password && (
        <p className={cn("text-xs", score <= 1 ? "text-red-500" : score === 2 ? "text-yellow-600" : score === 3 ? "text-blue-600" : "text-green-600")}>
          {labels[score]}
        </p>
      )}
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <div>
      <SectionHeading
        title="Security"
        description="Keep your account safe by managing passwords and access."
      />

      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Change password
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password">Current password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus-visible:outline-none"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus-visible:outline-none"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              <PasswordStrengthBar password={newPassword} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className={cn(passwordMismatch && "border-red-500 focus-visible:ring-red-500")}
              />
              {passwordMismatch && (
                <p className="text-xs text-red-500">Passwords do not match.</p>
              )}
            </div>
          </div>
        </div>

        <Divider />

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Two-factor authentication
          </p>
          <div className="flex flex-col gap-4">
            <ToggleSwitch
              id="2fa-authenticator"
              label="Authenticator app"
              description="Use an app like Google Authenticator or Authy."
              defaultChecked={false}
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sessions
          </p>
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Current session</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Chrome on macOS · 192.168.1.1 · Active now
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Active
              </span>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" className="text-red-600 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30">
              Sign out all other sessions
            </Button>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button disabled={passwordMismatch}>Update password</Button>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-2 w-full justify-start gap-1 bg-muted">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
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