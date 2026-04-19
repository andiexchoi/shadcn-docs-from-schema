"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Small reusable primitives (local only)
───────────────────────────────────────────── */

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pb-0">{children}</div>;
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
      {children}
    </h2>
  );
}

function CardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{children}</p>
  );
}

function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
      {children}
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return (
    <hr
      className={cn(
        "my-4 border-zinc-200 dark:border-zinc-800",
        className
      )}
    />
  );
}

/* ─────────────────────────────────────────────
   Toggle switch
───────────────────────────────────────────── */

function Switch({
  checked,
  onCheckedChange,
  id,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  id?: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-950",
        checked
          ? "bg-zinc-900 dark:bg-zinc-50"
          : "bg-zinc-200 dark:bg-zinc-800"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform dark:bg-zinc-950",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Tab trigger styles
───────────────────────────────────────────── */

const triggerBase =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50";

/* ─────────────────────────────────────────────
   Profile Tab
───────────────────────────────────────────── */

function ProfileTab() {
  const [form, setForm] = React.useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    username: "janedoe",
    bio: "Product designer and developer.",
    website: "https://janedoe.com",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your photo displayed across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-2xl font-bold text-white select-none">
            {form.firstName.charAt(0)}
            {form.lastName.charAt(0)}
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm">
              Upload photo
            </Button>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
              Remove photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name and public details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" value={form.firstName} onChange={set("firstName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" value={form.lastName} onChange={set("lastName")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="flex rounded-md">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                @
              </span>
              <Input
                id="username"
                value={form.username}
                onChange={set("username")}
                className="rounded-l-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={form.email} onChange={set("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" value={form.website} onChange={set("website")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={set("bio")}
              rows={3}
              className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300 resize-none"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {form.bio.length}/160 characters
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Notifications Tab
───────────────────────────────────────────── */

type NotifKey =
  | "emailMarketing"
  | "emailSecurity"
  | "emailUpdates"
  | "pushAll"
  | "pushMentions"
  | "pushReplies"
  | "digestWeekly";

const defaultNotifs: Record<NotifKey, boolean> = {
  emailMarketing: false,
  emailSecurity: true,
  emailUpdates: true,
  pushAll: false,
  pushMentions: true,
  pushReplies: true,
  digestWeekly: false,
};

function NotifRow({
  label,
  description,
  id,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = React.useState(defaultNotifs);
  const set = (key: NotifKey) => (v: boolean) =>
    setNotifs((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="space-y-6">
      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose which emails you&apos;d like to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <NotifRow
            id="emailSecurity"
            label="Security alerts"
            description="Get notified about login attempts and account changes."
            checked={notifs.emailSecurity}
            onChange={set("emailSecurity")}
          />
          <NotifRow
            id="emailUpdates"
            label="Product updates"
            description="News about features and releases."
            checked={notifs.emailUpdates}
            onChange={set("emailUpdates")}
          />
          <NotifRow
            id="emailMarketing"
            label="Marketing emails"
            description="Promotions, tips, and offers from our team."
            checked={notifs.emailMarketing}
            onChange={set("emailMarketing")}
          />
          <NotifRow
            id="digestWeekly"
            label="Weekly digest"
            description="A summary of your activity every Monday."
            checked={notifs.digestWeekly}
            onChange={set("digestWeekly")}
          />
        </CardContent>
        <CardFooter>
          <Button>Save preferences</Button>
        </CardFooter>
      </Card>

      {/* Push */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Manage in-app and browser push alerts.
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <NotifRow
            id="pushAll"
            label="All activity"
            description="Receive a notification for every activity."
            checked={notifs.pushAll}
            onChange={set("pushAll")}
          />
          <NotifRow
            id="pushMentions"
            label="Mentions"
            description="Only when someone mentions you directly."
            checked={notifs.pushMentions}
            onChange={set("pushMentions")}
          />
          <NotifRow
            id="pushReplies"
            label="Replies"
            description="When someone replies to your posts or comments."
            checked={notifs.pushReplies}
            onChange={set("pushReplies")}
          />
        </CardContent>
        <CardFooter>
          <Button>Save preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Security Tab
───────────────────────────────────────────── */

function SecurityTab() {
  const [pwForm, setPwForm] = React.useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [twoFa, setTwoFa] = React.useState(false);
  const [showSessions] = React.useState(true);

  const sessions = [
    { device: "Chrome on macOS", location: "San Francisco, US", current: true, lastSeen: "Now" },
    { device: "Safari on iPhone 15", location: "New York, US", current: false, lastSeen: "2 hours ago" },
    { device: "Firefox on Windows", location: "Austin, US", current: false, lastSeen: "3 days ago" },
  ];

  const pwStrength = (() => {
    const p = pwForm.next;
    if (p.length === 0) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

  return (
    <div className="space-y-6">
      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Use a strong password you don&apos;t use elsewhere.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pw">Current password</Label>
            <Input
              id="current-pw"
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-pw">New password</Label>
            <Input
              id="new-pw"
              type="password"
              value={pwForm.next}
              onChange={(e) => setPwForm((p) => ({ ...p, next: e.target.value }))}
              placeholder="••••••••"
            />
            {pwStrength !== null && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        i < pwStrength! ? strengthColor[pwStrength! - 1] : "bg-zinc-200 dark:bg-zinc-800"
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Strength:{" "}
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {strengthLabel[pwStrength - 1] ?? ""}
                  </span>
                </p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pw">Confirm new password</Label>
            <Input
              id="confirm-pw"
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="••••••••"
            />
            {pwForm.confirm && pwForm.next !== pwForm.confirm && (
              <p className="text-xs text-red-500">Passwords do not match.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={
              !pwForm.current ||
              !pwForm.next ||
              pwForm.next !== pwForm.confirm
            }
          >
            Update password
          </Button>
        </CardFooter>
      </Card>

      {/* 2FA */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {twoFa ? "2FA is enabled" : "2FA is disabled"}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {twoFa
                  ? "Your account is protected by an authenticator app."
                  : "Enable to require a code when signing in."}
              </p>
            </div>
            <Switch checked={twoFa} onCheckedChange={setTwoFa} />
          </div>
          {twoFa && (
            <>
              <Separator />
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-4 space-y-2">
                <p className="text-sm font-medium">Recovery codes</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Save these codes somewhere safe. Each can only be used once.
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs mt-2">
                  {["A1B2-C3D4", "E5F6-G7H8", "I9J0-K1L2", "M3N4-O5P6"].map((code) => (
                    <span
                      key={code}
                      className="rounded bg-white dark:bg-zinc-800 px-2 py-1 border border-zinc-200 dark:border-zinc-700"
                    >
                      {code}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  Regenerate codes
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sessions */}
      {showSessions && (
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Devices currently signed in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.map((session, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-4 rounded-lg border border-zinc-100 dark:border-zinc-800 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2">
                      {session.device}
                      {session.current && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {session.location} · {session.lastSeen}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900">
              Sign out all other sessions
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main SettingsTabs component
───────────────────────────────────────────── */

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your account preferences and security.
          </p>
        </div>

        <Tabs.Root defaultValue="profile" className="w-full">
          {/* Tab list */}
          <Tabs.List className="mb-6 inline-flex h-10 items-center justify-center rounded-md bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            <Tabs.Trigger value="profile" className={triggerBase}>
              Profile
            </Tabs.Trigger>
            <Tabs.Trigger value="notifications" className={triggerBase}>
              Notifications
            </Tabs.Trigger>
            <Tabs.Trigger value="security" className={triggerBase}>
              Security
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="profile" className="focus-visible:outline-none">
            <ProfileTab />
          </Tabs.Content>

          <Tabs.Content value="notifications" className="focus-visible:outline-none">
            <NotificationsTab />
          </Tabs.Content>

          <Tabs.Content value="security" className="focus-visible:outline-none">
            <SecurityTab />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}