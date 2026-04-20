"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ── Inline Tabs wrappers (shadcn-style) ── */
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

/* ── Toggle Switch ── */
function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
  );
}

/* ── Section wrapper ── */
function Section({
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
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Field wrapper ── */
function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

/* ── Profile Tab ── */
function ProfileTab() {
  const [form, setForm] = React.useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    username: "janedoe",
    bio: "Frontend engineer & coffee enthusiast.",
    website: "https://janedoe.dev",
  });

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      <Section
        title="Personal Information"
        description="Update your name and public profile details."
      >
        <div className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First Name" htmlFor="firstName">
              <Input
                id="firstName"
                value={form.firstName}
                onChange={handleChange("firstName")}
              />
            </Field>
            <Field label="Last Name" htmlFor="lastName">
              <Input
                id="lastName"
                value={form.lastName}
                onChange={handleChange("lastName")}
              />
            </Field>
          </div>
          <Field label="Username" htmlFor="username">
            <Input
              id="username"
              value={form.username}
              onChange={handleChange("username")}
            />
          </Field>
          <Field label="Email Address" htmlFor="email">
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
            />
          </Field>
          <Field label="Website" htmlFor="website">
            <Input
              id="website"
              type="url"
              value={form.website}
              onChange={handleChange("website")}
            />
          </Field>
          <Field label="Bio" htmlFor="bio">
            <textarea
              id="bio"
              rows={3}
              value={form.bio}
              onChange={handleChange("bio")}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Avatar"
        description="Upload a profile picture visible to others."
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
            {form.firstName.charAt(0)}
            {form.lastName.charAt(0)}
          </div>
          <div className="space-y-1">
            <Button variant="outline" size="sm">
              Upload Image
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF · max 2 MB
            </p>
          </div>
        </div>
      </Section>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

/* ── Notifications Tab ── */
type NotifKey =
  | "emailMarketing"
  | "emailSecurity"
  | "emailUpdates"
  | "pushComments"
  | "pushMentions"
  | "pushReminders"
  | "digestWeekly";

const notifLabels: Record<NotifKey, { label: string; description: string }> = {
  emailMarketing: {
    label: "Marketing emails",
    description: "Promotions, offers, and product announcements.",
  },
  emailSecurity: {
    label: "Security alerts",
    description: "Sign-ins from new devices and suspicious activity.",
  },
  emailUpdates: {
    label: "Product updates",
    description: "New features and improvements to the platform.",
  },
  pushComments: {
    label: "Comments",
    description: "When someone comments on your posts.",
  },
  pushMentions: {
    label: "Mentions",
    description: "When someone @mentions you in a conversation.",
  },
  pushReminders: {
    label: "Reminders",
    description: "Scheduled reminders you've set up.",
  },
  digestWeekly: {
    label: "Weekly digest",
    description: "A summary of your activity sent every Monday.",
  },
};

function NotificationsTab() {
  const [prefs, setPrefs] = React.useState<Record<NotifKey, boolean>>({
    emailMarketing: false,
    emailSecurity: true,
    emailUpdates: true,
    pushComments: true,
    pushMentions: true,
    pushReminders: false,
    digestWeekly: false,
  });

  const toggle = (key: NotifKey) => (val: boolean) =>
    setPrefs((p) => ({ ...p, [key]: val }));

  const emailKeys: NotifKey[] = [
    "emailMarketing",
    "emailSecurity",
    "emailUpdates",
  ];
  const pushKeys: NotifKey[] = [
    "pushComments",
    "pushMentions",
    "pushReminders",
  ];

  return (
    <div className="space-y-6">
      <Section
        title="Email Notifications"
        description="Choose which emails you'd like to receive."
      >
        <div className="divide-y">
          {emailKeys.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">{notifLabels[key].label}</p>
                <p className="text-xs text-muted-foreground">
                  {notifLabels[key].description}
                </p>
              </div>
              <Toggle
                id={key}
                checked={prefs[key]}
                onChange={toggle(key)}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Push Notifications"
        description="Manage in-app and browser push alerts."
      >
        <div className="divide-y">
          {pushKeys.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">{notifLabels[key].label}</p>
                <p className="text-xs text-muted-foreground">
                  {notifLabels[key].description}
                </p>
              </div>
              <Toggle
                id={key}
                checked={prefs[key]}
                onChange={toggle(key)}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Digest" description="Periodic summary emails.">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {notifLabels.digestWeekly.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {notifLabels.digestWeekly.description}
            </p>
          </div>
          <Toggle
            id="digestWeekly"
            checked={prefs.digestWeekly}
            onChange={toggle("digestWeekly")}
          />
        </div>
      </Section>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}

/* ── Security Tab ── */
function SecurityTab() {
  const [passwords, setPasswords] = React.useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNext, setShowNext] = React.useState(false);

  const handlePw =
    (key: keyof typeof passwords) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setPasswords((p) => ({ ...p, [key]: e.target.value }));

  const sessions = [
    {
      id: 1,
      device: "MacBook Pro — Chrome",
      location: "New York, US",
      time: "Active now",
      current: true,
    },
    {
      id: 2,
      device: "iPhone 15 — Safari",
      location: "New York, US",
      time: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Windows PC — Firefox",
      location: "London, UK",
      time: "3 days ago",
      current: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Change password */}
      <Section
        title="Change Password"
        description="Use a strong password you don't use elsewhere."
      >
        <div className="grid gap-4">
          <Field label="Current Password" htmlFor="current">
            <div className="relative">
              <Input
                id="current"
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={handlePw("current")}
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? "Hide" : "Show"}
              </button>
            </div>
          </Field>
          <Field label="New Password" htmlFor="next">
            <div className="relative">
              <Input
                id="next"
                type={showNext ? "text" : "password"}
                value={passwords.next}
                onChange={handlePw("next")}
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowNext((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                {showNext ? "Hide" : "Show"}
              </button>
            </div>
            {/* Strength meter */}
            {passwords.next.length > 0 && (
              <div className="mt-1 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        passwords.next.length >= n * 3
                          ? passwords.next.length < 6
                            ? "bg-destructive"
                            : passwords.next.length < 10
                            ? "bg-yellow-400"
                            : "bg-green-500"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {passwords.next.length < 6
                    ? "Weak password"
                    : passwords.next.length < 10
                    ? "Moderate password"
                    : "Strong password"}
                </p>
              </div>
            )}
          </Field>
          <Field label="Confirm New Password" htmlFor="confirm">
            <Input
              id="confirm"
              type="password"
              value={passwords.confirm}
              onChange={handlePw("confirm")}
            />
            {passwords.confirm.length > 0 &&
              passwords.next !== passwords.confirm && (
                <p className="text-xs text-destructive">
                  Passwords do not match.
                </p>
              )}
          </Field>
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Update Password</Button>
        </div>
      </Section>

      {/* 2FA */}
      <Section
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account."
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">
              {twoFactor ? "2FA is enabled" : "2FA is disabled"}
            </p>
            <p className="text-xs text-muted-foreground">
              {twoFactor
                ? "Your account is protected by an authenticator app."
                : "Enable to require a code in addition to your password."}
            </p>
          </div>
          <Toggle
            id="twoFactor"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
        </div>
        {twoFactor && (
          <div className="mt-4 rounded-md border bg-muted/50 p-4 text-sm text-muted-foreground">
            Scan the QR code in your authenticator app (Google Authenticator,
            Authy, etc.) to complete setup.
            <div className="mt-3 flex h-28 w-28 items-center justify-center rounded-md border bg-background text-xs text-muted-foreground">
              QR Code
            </div>
          </div>
        )}
      </Section>

      {/* Active sessions */}
      <Section
        title="Active Sessions"
        description="Manage devices that are currently signed in."
      >
        <ul className="divide-y">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.location} · {s.time}
                  </p>
                </div>
              </div>
              {s.current ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  This device
                </span>
              ) : (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  Revoke
                </Button>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" className="text-destructive hover:text-destructive">
            Revoke All Other Sessions
          </Button>
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="Danger Zone" description="Irreversible account actions.">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-muted-foreground">
              Permanently remove your account and all associated data.
            </p>
          </div>
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </div>
      </Section>
    </div>
  );
}

/* ── Main Component ── */
export default function SettingsTabs() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account preferences and security options.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6 w-full justify-start gap-1 sm:w-auto">
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