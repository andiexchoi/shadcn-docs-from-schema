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

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex flex-col gap-1.5">{children}</div>;
}

function Divider() {
  return <hr className="my-6 border-border" />;
}

function ToggleRow({
  id,
  label,
  description,
  defaultChecked,
}: {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked ?? false);
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((v) => !v)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
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
      <SectionHeading
        title="Profile"
        description="Update your personal information and public profile details."
      />
      <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
        <FieldRow>
          <Label htmlFor="first-name">First name</Label>
          <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
        </FieldRow>
        <FieldRow>
          <Label htmlFor="last-name">Last name</Label>
          <Input id="last-name" placeholder="Smith" defaultValue="Smith" />
        </FieldRow>
      </div>
      <FieldRow>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="jane@example.com" defaultValue="jane@example.com" />
      </FieldRow>
      <FieldRow>
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="janesmith" defaultValue="janesmith" />
      </FieldRow>
      <FieldRow>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          rows={3}
          placeholder="Tell us a little about yourself…"
          defaultValue="Product designer based in Berlin."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </FieldRow>
      <FieldRow>
        <Label htmlFor="website">Website</Label>
        <Input id="website" type="url" placeholder="https://example.com" />
      </FieldRow>
      <Divider />
      <div className="flex justify-end">
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
        description="Choose what you want to be notified about and how."
      />

      <h3 className="mb-1 text-sm font-semibold text-foreground">Email notifications</h3>
      <div className="divide-y divide-border rounded-md border border-border px-4">
        <ToggleRow
          id="notif-account"
          label="Account activity"
          description="Receive emails about sign-ins and security events."
          defaultChecked
        />
        <ToggleRow
          id="notif-product"
          label="Product updates"
          description="News about features, improvements, and releases."
          defaultChecked
        />
        <ToggleRow
          id="notif-marketing"
          label="Marketing"
          description="Tips, offers, and promotions from our team."
        />
        <ToggleRow
          id="notif-digest"
          label="Weekly digest"
          description="A summary of your activity sent every Monday."
          defaultChecked
        />
      </div>

      <Divider />

      <h3 className="mb-1 text-sm font-semibold text-foreground">Push notifications</h3>
      <div className="divide-y divide-border rounded-md border border-border px-4">
        <ToggleRow
          id="push-mentions"
          label="Mentions"
          description="Get notified when someone mentions you."
          defaultChecked
        />
        <ToggleRow
          id="push-comments"
          label="Comments"
          description="Get notified about new comments on your posts."
        />
        <ToggleRow
          id="push-reminders"
          label="Reminders"
          description="Deadline and task reminders sent to your device."
          defaultChecked
        />
      </div>

      <Divider />
      <div className="flex justify-end">
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  function EyeIcon({ open }: { open: boolean }) {
    return open ? (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
        <path d="m10.748 13.93 2.523 2.524a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
      </svg>
    );
  }

  function PasswordField({
    id,
    label,
    show,
    onToggle,
  }: {
    id: string;
    label: string;
    show: boolean;
    onToggle: () => void;
  }) {
    return (
      <FieldRow>
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <Input id={id} type={show ? "text" : "password"} className="pr-10" />
          <button
            type="button"
            onClick={onToggle}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus-visible:outline-none"
          >
            <EyeIcon open={show} />
          </button>
        </div>
      </FieldRow>
    );
  }

  return (
    <div>
      <SectionHeading
        title="Security"
        description="Manage your password and account security settings."
      />

      <h3 className="mb-3 text-sm font-semibold text-foreground">Change password</h3>
      <PasswordField
        id="current-password"
        label="Current password"
        show={showCurrent}
        onToggle={() => setShowCurrent((v) => !v)}
      />
      <PasswordField
        id="new-password"
        label="New password"
        show={showNew}
        onToggle={() => setShowNew((v) => !v)}
      />
      <PasswordField
        id="confirm-password"
        label="Confirm new password"
        show={showConfirm}
        onToggle={() => setShowConfirm((v) => !v)}
      />
      <p className="mb-4 text-xs text-muted-foreground">
        Password must be at least 8 characters and include a number and a symbol.
      </p>
      <div className="flex justify-end">
        <Button>Update password</Button>
      </div>

      <Divider />

      <h3 className="mb-3 text-sm font-semibold text-foreground">Two-factor authentication</h3>
      <div className="rounded-md border border-border p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Authenticator app</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Use an authenticator app to generate one-time codes for sign-in.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Enable
          </Button>
        </div>
      </div>

      <Divider />

      <h3 className="mb-3 text-sm font-semibold text-foreground">Sessions</h3>
      <div className="space-y-3">
        {[
          { device: "MacBook Pro — Chrome", location: "Berlin, DE", current: true },
          { device: "iPhone 15 — Safari", location: "Berlin, DE", current: false },
          { device: "Windows PC — Firefox", location: "Hamburg, DE", current: false },
        ].map(({ device, location, current }) => (
          <div
            key={device}
            className="flex items-center justify-between rounded-md border border-border px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {device}
                {current && (
                  <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Current
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">{location}</p>
            </div>
            {!current && (
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                Revoke
              </Button>
            )}
          </div>
        ))}
      </div>

      <Divider />

      <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
        <h3 className="mb-1 text-sm font-semibold text-destructive">Danger zone</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="destructive" size="sm">
          Delete account
        </Button>
      </div>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="min-h-screen bg-background p-6 sm:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account, notifications, and security preferences.
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-2 w-full justify-start">
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