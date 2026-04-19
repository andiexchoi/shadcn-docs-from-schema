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
  const [name, setName] = React.useState("Jane Doe");
  const [email, setEmail] = React.useState("jane.doe@example.com");
  const [username, setUsername] = React.useState("janedoe");
  const [bio, setBio] = React.useState("Product designer & coffee enthusiast.");

  return (
    <div>
      <SectionHeading
        title="Profile"
        description="Update your personal information and how others see you."
      />
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
          <p className="text-xs text-muted-foreground">{bio.length}/160 characters</p>
        </div>
      </div>
      <Divider />
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => {
          setName("Jane Doe");
          setEmail("jane.doe@example.com");
          setUsername("janedoe");
          setBio("Product designer & coffee enthusiast.");
        }}>
          Cancel
        </Button>
        <Button>Save changes</Button>
      </div>
    </div>
  );
}

type NotifKey =
  | "emailMarketing"
  | "emailProduct"
  | "emailSecurity"
  | "pushComments"
  | "pushMentions"
  | "pushUpdates";

function Toggle({
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
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label htmlFor={id} className="cursor-pointer font-medium">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = React.useState<Record<NotifKey, boolean>>({
    emailMarketing: true,
    emailProduct: false,
    emailSecurity: true,
    pushComments: true,
    pushMentions: true,
    pushUpdates: false,
  });

  const toggle = (key: NotifKey) => (val: boolean) =>
    setNotifs((prev) => ({ ...prev, [key]: val }));

  return (
    <div>
      <SectionHeading
        title="Notifications"
        description="Choose how and when you want to be notified."
      />

      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Email notifications
        </h3>
        <div className="space-y-4">
          <NotifRow
            id="emailMarketing"
            label="Marketing emails"
            description="Receive emails about new products, features, and promotions."
            checked={notifs.emailMarketing}
            onChange={toggle("emailMarketing")}
          />
          <NotifRow
            id="emailProduct"
            label="Product updates"
            description="Get notified about major product releases and changelogs."
            checked={notifs.emailProduct}
            onChange={toggle("emailProduct")}
          />
          <NotifRow
            id="emailSecurity"
            label="Security alerts"
            description="Receive important alerts about your account security."
            checked={notifs.emailSecurity}
            onChange={toggle("emailSecurity")}
          />
        </div>
      </div>

      <Divider />

      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Push notifications
        </h3>
        <div className="space-y-4">
          <NotifRow
            id="pushComments"
            label="Comments"
            description="Get notified when someone comments on your posts."
            checked={notifs.pushComments}
            onChange={toggle("pushComments")}
          />
          <NotifRow
            id="pushMentions"
            label="Mentions"
            description="Get notified when someone mentions you."
            checked={notifs.pushMentions}
            onChange={toggle("pushMentions")}
          />
          <NotifRow
            id="pushUpdates"
            label="App updates"
            description="Receive push notifications about app updates."
            checked={notifs.pushUpdates}
            onChange={toggle("pushUpdates")}
          />
        </div>
      </div>

      <Divider />
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
  const [sessionWarning, setSessionWarning] = React.useState(true);

  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit = currentPassword.length > 0 && newPassword.length >= 8 && passwordsMatch;

  return (
    <div>
      <SectionHeading
        title="Security"
        description="Manage your password, two-factor authentication, and active sessions."
      />

      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Change password
        </h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            {newPassword.length > 0 && newPassword.length < 8 && (
              <p className="text-xs text-destructive">Password must be at least 8 characters.</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button disabled={!canSubmit}>Update password</Button>
        </div>
      </div>

      <Divider />

      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Two-factor authentication
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="two-factor" className="cursor-pointer font-medium">
                Authenticator app
              </Label>
              <p className="text-sm text-muted-foreground">
                Use an authenticator app to generate one-time codes.
              </p>
            </div>
            <Toggle id="two-factor" checked={twoFactor} onChange={setTwoFactor} />
          </div>
          {twoFactor && (
            <div className="rounded-md border border-border bg-muted/50 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Two-factor authentication is <span className="font-medium text-foreground">enabled</span>.
                You will be prompted for a code each time you sign in.
              </p>
            </div>
          )}
        </div>
      </div>

      <Divider />

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Sessions
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="session-warning" className="cursor-pointer font-medium">
                Inactive session alerts
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your account is accessed from a new device.
              </p>
            </div>
            <Toggle id="session-warning" checked={sessionWarning} onChange={setSessionWarning} />
          </div>
          <div className="rounded-md border border-border p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Sign out all other sessions</p>
              <p className="text-sm text-muted-foreground">
                Remove access from all devices except this one.
              </p>
            </div>
            <Button variant="outline" className="shrink-0 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
              Sign out all
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start mb-2">
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