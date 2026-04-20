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

/* ------------------------------------------------------------------ */
/*  Toggle switch (local, no extra deps)                               */
/* ------------------------------------------------------------------ */
interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

function Toggle({ id, checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Profile tab                                                        */
/* ------------------------------------------------------------------ */
function ProfileTab() {
  const [form, setForm] = React.useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    username: "janedoe",
    bio: "",
  });
  const [saved, setSaved] = React.useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last name"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <div className="flex items-center rounded-md border bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <span className="select-none px-3 text-sm text-muted-foreground border-r h-9 flex items-center">
            @
          </span>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="username"
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="space-y-1.5">
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

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Tell us a little about yourself…"
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">Save changes</Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            Changes saved!
          </span>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Notifications tab                                                  */
/* ------------------------------------------------------------------ */
interface NotificationPrefs {
  emailMarketing: boolean;
  emailProduct: boolean;
  emailSecurity: boolean;
  pushComments: boolean;
  pushMentions: boolean;
  pushReminders: boolean;
}

function NotificationsTab() {
  const [prefs, setPrefs] = React.useState<NotificationPrefs>({
    emailMarketing: false,
    emailProduct: true,
    emailSecurity: true,
    pushComments: true,
    pushMentions: true,
    pushReminders: false,
  });
  const [saved, setSaved] = React.useState(false);

  function toggle(key: keyof NotificationPrefs) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1">Email notifications</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Choose which emails you'd like to receive.
        </p>
        <div className="divide-y divide-border rounded-lg border px-4">
          <Toggle
            id="emailMarketing"
            checked={prefs.emailMarketing}
            onChange={() => toggle("emailMarketing")}
            label="Marketing & promotions"
            description="News, product updates, and special offers."
          />
          <Toggle
            id="emailProduct"
            checked={prefs.emailProduct}
            onChange={() => toggle("emailProduct")}
            label="Product updates"
            description="Feature announcements and changelogs."
          />
          <Toggle
            id="emailSecurity"
            checked={prefs.emailSecurity}
            onChange={() => toggle("emailSecurity")}
            label="Security alerts"
            description="Sign-ins, password changes, and suspicious activity."
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1">Push notifications</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Manage in-app and browser push alerts.
        </p>
        <div className="divide-y divide-border rounded-lg border px-4">
          <Toggle
            id="pushComments"
            checked={prefs.pushComments}
            onChange={() => toggle("pushComments")}
            label="Comments"
            description="When someone comments on your posts."
          />
          <Toggle
            id="pushMentions"
            checked={prefs.pushMentions}
            onChange={() => toggle("pushMentions")}
            label="Mentions"
            description="When you're mentioned in a thread."
          />
          <Toggle
            id="pushReminders"
            checked={prefs.pushReminders}
            onChange={() => toggle("pushReminders")}
            label="Reminders"
            description="Scheduled reminders and follow-ups."
          />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit">Save preferences</Button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">
            Preferences saved!
          </span>
        )}
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Security tab                                                       */
/* ------------------------------------------------------------------ */
function SecurityTab() {
  const [passwords, setPasswords] = React.useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [pwError, setPwError] = React.useState("");
  const [pwSaved, setPwSaved] = React.useState(false);

  const [twoFa, setTwoFa] = React.useState(false);
  const [sessions, setSessions] = React.useState([
    { id: "1", device: "Chrome on macOS", location: "New York, US", current: true },
    { id: "2", device: "Firefox on Windows", location: "London, UK", current: false },
    { id: "3", device: "Safari on iPhone", location: "Toronto, CA", current: false },
  ]);

  function handlePwChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPwError("");
    setPwSaved(false);
  }

  function handlePwSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    if (passwords.next.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setPasswords({ current: "", next: "", confirm: "" });
    setPwSaved(true);
  }

  function revokeSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Change password */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1">Change password</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Use a strong password you don't use elsewhere.
        </p>
        <form onSubmit={handlePwSubmit} className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              name="current"
              type="password"
              value={passwords.current}
              onChange={handlePwChange}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="next">New password</Label>
            <Input
              id="next"
              name="next"
              type="password"
              value={passwords.next}
              onChange={handlePwChange}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              value={passwords.confirm}
              onChange={handlePwChange}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          {pwError && <p className="text-sm text-red-600">{pwError}</p>}
          <div className="flex items-center gap-3">
            <Button type="submit">Update password</Button>
            {pwSaved && (
              <span className="text-sm text-green-600 font-medium">
                Password updated!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Two-factor authentication */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Two-factor authentication
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Add an extra layer of protection to your account.
        </p>
        <div className="rounded-lg border px-4">
          <Toggle
            id="twoFa"
            checked={twoFa}
            onChange={setTwoFa}
            label="Enable two-factor authentication"
            description="You'll be prompted for a code each time you sign in."
          />
        </div>
        {twoFa && (
          <p className="mt-2 text-xs text-muted-foreground">
            A setup wizard would appear here to configure your authenticator app.
          </p>
        )}
      </section>

      {/* Active sessions */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-1">Active sessions</h3>
        <p className="text-xs text-muted-foreground mb-4">
          These devices are currently signed in to your account.
        </p>
        <ul className="divide-y divide-border rounded-lg border">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  {session.device}
                  {session.current && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">{session.location}</span>
              </div>
              {!session.current && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => revokeSession(session.id)}
                  className="shrink-0"
                >
                  Revoke
                </Button>
              )}
            </li>
          ))}
          {sessions.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">
              No other active sessions.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root component                                                     */
/* ------------------------------------------------------------------ */
export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account preferences and security.
          </p>
        </header>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6 w-full justify-start gap-1 bg-muted">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-base font-semibold text-foreground mb-1">
                Profile information
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Update your personal details and public profile.
              </p>
              <ProfileTab />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-base font-semibold text-foreground mb-1">
                Notification preferences
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Decide how and when you hear from us.
              </p>
              <NotificationsTab />
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-base font-semibold text-foreground mb-1">
                Security settings
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Keep your account secure and monitor active sessions.
              </p>
              <SecurityTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}