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
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({
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
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
          {label}
        </Label>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked((prev) => !prev)}
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

function ProfileTab() {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Personal information"
        description="Update your name, email address, and public profile details."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Jane" defaultValue="Jane" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Doe" defaultValue="Doe" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              defaultValue="jane@example.com"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell us a little about yourself…"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              defaultValue="Frontend engineer passionate about design systems."
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Save changes</Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Avatar"
        description="Upload a photo to personalise your profile."
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-muted text-2xl font-semibold text-muted-foreground select-none">
            JD
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm">
              Upload photo
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WebP — max 2 MB
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Email notifications"
        description="Choose which emails you want to receive."
      >
        <div className="divide-y divide-border">
          <Toggle
            id="notif-product"
            label="Product updates"
            description="News about new features and improvements."
            defaultChecked
          />
          <Toggle
            id="notif-security"
            label="Security alerts"
            description="Notifications about unusual sign-in activity."
            defaultChecked
          />
          <Toggle
            id="notif-newsletter"
            label="Newsletter"
            description="Monthly digest of tips and resources."
          />
          <Toggle
            id="notif-marketing"
            label="Promotional offers"
            description="Deals and special offers from our partners."
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Save preferences</Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Push notifications"
        description="Control browser and mobile push notifications."
      >
        <div className="divide-y divide-border">
          <Toggle
            id="push-mentions"
            label="Mentions"
            description="Get notified when someone mentions you."
            defaultChecked
          />
          <Toggle
            id="push-replies"
            label="Replies"
            description="Get notified when someone replies to your posts."
            defaultChecked
          />
          <Toggle
            id="push-digest"
            label="Weekly digest"
            description="A summary of your activity every Monday."
          />
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Save preferences</Button>
        </div>
      </SectionCard>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <div className="space-y-4">
      <SectionCard
        title="Change password"
        description="Use a strong password that you don't use elsewhere."
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Current password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                placeholder="••••••••"
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none"
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
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none"
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="pr-20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Update password</Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Two-factor authentication"
        description="Add an extra layer of security to your account."
      >
        <div className="divide-y divide-border">
          <Toggle
            id="2fa-app"
            label="Authenticator app"
            description="Use an app like Google Authenticator or Authy."
            defaultChecked
          />
          <Toggle
            id="2fa-sms"
            label="SMS authentication"
            description="Receive a one-time code via text message."
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Active sessions"
        description="Review the devices currently signed in to your account."
      >
        <ul className="divide-y divide-border">
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
              device: "Windows PC — Firefox",
              location: "London, UK",
              time: "3 days ago",
              current: false,
            },
          ].map((session) => (
            <li
              key={session.device}
              className="flex items-center justify-between py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {session.device}
                  {session.current && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      This device
                    </span>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {session.location} · {session.time}
                </span>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  Revoke
                </Button>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <Button variant="destructive" size="sm">
            Revoke all other sessions
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

export default function SettingsTabs() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences and security.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-2 w-full justify-start gap-1">
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