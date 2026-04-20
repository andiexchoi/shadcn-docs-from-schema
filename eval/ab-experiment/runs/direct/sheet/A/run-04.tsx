"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface NotificationPreferences {
  channels: NotificationChannel[];
  emailAddress: string;
  phoneNumber: string;
  frequency: "realtime" | "daily" | "weekly";
  quietHoursStart: string;
  quietHoursEnd: string;
  marketingEmails: boolean;
  securityAlerts: boolean;
  productUpdates: boolean;
  mentions: boolean;
}

const defaultPreferences: NotificationPreferences = {
  channels: [
    {
      id: "email",
      label: "Email",
      description: "Receive notifications via email",
      icon: <Mail className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "sms",
      label: "SMS",
      description: "Receive text message alerts",
      icon: <Smartphone className="h-4 w-4" />,
      enabled: false,
    },
    {
      id: "push",
      label: "Push Notifications",
      description: "Browser and mobile push alerts",
      icon: <Bell className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "inapp",
      label: "In-App",
      description: "Notifications inside the application",
      icon: <MessageSquare className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "webhook",
      label: "Webhook",
      description: "Send notifications to a custom URL",
      icon: <Globe className="h-4 w-4" />,
      enabled: false,
    },
  ],
  emailAddress: "user@example.com",
  phoneNumber: "",
  frequency: "realtime",
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  marketingEmails: false,
  securityAlerts: true,
  productUpdates: true,
  mentions: true,
};

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id?: string;
}) {
  return (
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
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
      {children}
    </h3>
  );
}

function Divider() {
  return <div className="border-t border-border my-6" />;
}

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] =
    React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  const toggleChannel = (id: string) => {
    setPrefs((prev) => ({
      ...prev,
      channels: prev.channels.map((ch) =>
        ch.id === id ? { ...ch, enabled: !ch.enabled } : ch
      ),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setPrefs(defaultPreferences);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification Settings
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl",
            "flex flex-col",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300 ease-in-out"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold leading-none">
                  Notification Preferences
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-xs text-muted-foreground">
                  Manage how and when you receive notifications.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </Dialog.Close>
          </div>

          {/* Scrollable form body */}
          <form
            onSubmit={handleSave}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-0">
              {/* Channels */}
              <SectionHeading>Notification Channels</SectionHeading>
              <div className="space-y-3">
                {prefs.channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{channel.icon}</span>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {channel.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {channel.description}
                        </p>
                      </div>
                    </div>
                    <Toggle
                      checked={channel.enabled}
                      onChange={() => toggleChannel(channel.id)}
                    />
                  </div>
                ))}
              </div>

              <Divider />

              {/* Contact Details */}
              <SectionHeading>Contact Details</SectionHeading>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-address" className="text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email-address"
                    type="email"
                    value={prefs.emailAddress}
                    onChange={(e) =>
                      setPrefs((p) => ({ ...p, emailAddress: e.target.value }))
                    }
                    placeholder="you@example.com"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number" className="text-sm">
                    Phone Number{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    value={prefs.phoneNumber}
                    onChange={(e) =>
                      setPrefs((p) => ({ ...p, phoneNumber: e.target.value }))
                    }
                    placeholder="+1 (555) 000-0000"
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <Divider />

              {/* Frequency */}
              <SectionHeading>Delivery Frequency</SectionHeading>
              <div className="grid grid-cols-3 gap-2">
                {(["realtime", "daily", "weekly"] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setPrefs((p) => ({ ...p, frequency: freq }))}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors capitalize",
                      prefs.frequency === freq
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {freq}
                  </button>
                ))}
              </div>

              <Divider />

              {/* Quiet Hours */}
              <SectionHeading>Quiet Hours</SectionHeading>
              <p className="text-xs text-muted-foreground mb-3">
                Pause notifications during specified hours.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start" className="text-sm">
                    Start Time
                  </Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={prefs.quietHoursStart}
                    onChange={(e) =>
                      setPrefs((p) => ({
                        ...p,
                        quietHoursStart: e.target.value,
                      }))
                    }
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end" className="text-sm">
                    End Time
                  </Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={prefs.quietHoursEnd}
                    onChange={(e) =>
                      setPrefs((p) => ({
                        ...p,
                        quietHoursEnd: e.target.value,
                      }))
                    }
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <Divider />

              {/* Notification Types */}
              <SectionHeading>Notification Types</SectionHeading>
              <div className="space-y-3">
                {(
                  [
                    {
                      key: "securityAlerts" as const,
                      label: "Security Alerts",
                      description: "Sign-ins, password changes, and suspicious activity",
                    },
                    {
                      key: "mentions" as const,
                      label: "Mentions & Replies",
                      description: "When someone mentions or replies to you",
                    },
                    {
                      key: "productUpdates" as const,
                      label: "Product Updates",
                      description: "New features and improvements",
                    },
                    {
                      key: "marketingEmails" as const,
                      label: "Marketing Emails",
                      description: "Promotions, tips and special offers",
                    },
                  ]
                ).map(({ key, label, description }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="pr-4">
                      <p className="text-sm font-medium leading-none">{label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <Toggle
                      checked={prefs[key]}
                      onChange={(val) => setPrefs((p) => ({ ...p, [key]: val }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border bg-background px-6 py-4">
              {saved && (
                <p className="mb-3 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  ✓ Preferences saved successfully
                </p>
              )}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleReset}
                >
                  Reset to Defaults
                </Button>
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}