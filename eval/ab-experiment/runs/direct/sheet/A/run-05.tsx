"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
}

const channels: NotificationChannel[] = [
  {
    id: "email",
    label: "Email",
    description: "Receive notifications via email",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "push",
    label: "Push Notifications",
    description: "Browser & mobile push alerts",
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: "sms",
    label: "SMS",
    description: "Text message notifications",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: "inApp",
    label: "In-App",
    description: "Alerts within the application",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "sound",
    label: "Sound",
    description: "Play a sound with notifications",
    icon: <Volume2 className="h-4 w-4" />,
  },
];

const categories: NotificationCategory[] = [
  {
    id: "security",
    label: "Security Alerts",
    description: "Login attempts, password changes",
  },
  {
    id: "updates",
    label: "Product Updates",
    description: "New features and improvements",
  },
  {
    id: "billing",
    label: "Billing & Payments",
    description: "Invoices, charges, and receipts",
  },
  {
    id: "activity",
    label: "Account Activity",
    description: "Comments, mentions, and replies",
  },
  {
    id: "marketing",
    label: "Marketing & Promotions",
    description: "Offers, tips, and newsletters",
  },
];

type FrequencyOption = "realtime" | "daily" | "weekly" | "never";

interface NotificationPreferences {
  channels: Record<string, boolean>;
  categories: Record<string, boolean>;
  frequency: FrequencyOption;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
}

const defaultPrefs: NotificationPreferences = {
  channels: {
    email: true,
    push: true,
    sms: false,
    inApp: true,
    sound: false,
  },
  categories: {
    security: true,
    updates: true,
    billing: true,
    activity: false,
    marketing: false,
  },
  frequency: "realtime",
  quietHoursEnabled: false,
  quietStart: "22:00",
  quietEnd: "08:00",
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
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
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
  return <hr className="border-border my-5" />;
}

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPrefs);
  const [saved, setSaved] = React.useState(false);

  const setChannel = (id: string, val: boolean) =>
    setPrefs((p) => ({ ...p, channels: { ...p.channels, [id]: val } }));

  const setCategory = (id: string, val: boolean) =>
    setPrefs((p) => ({ ...p, categories: { ...p.categories, [id]: val } }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setPrefs(defaultPrefs);
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
            "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background shadow-2xl",
            "sm:max-w-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300 ease-in-out"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Notification Preferences
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm text-muted-foreground">
                Manage how and when you receive notifications.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <form
            onSubmit={handleSave}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Channels */}
              <section>
                <SectionHeading>Notification Channels</SectionHeading>
                <ul className="space-y-3">
                  {channels.map((ch) => (
                    <li
                      key={ch.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          {ch.icon}
                        </span>
                        <div>
                          <Label
                            htmlFor={`channel-${ch.id}`}
                            className="cursor-pointer text-sm font-medium"
                          >
                            {ch.label}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {ch.description}
                          </p>
                        </div>
                      </div>
                      <Toggle
                        id={`channel-${ch.id}`}
                        checked={!!prefs.channels[ch.id]}
                        onChange={(val) => setChannel(ch.id, val)}
                      />
                    </li>
                  ))}
                </ul>
              </section>

              <Divider />

              {/* Categories */}
              <section>
                <SectionHeading>Notification Categories</SectionHeading>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                    >
                      <div>
                        <Label
                          htmlFor={`cat-${cat.id}`}
                          className="cursor-pointer text-sm font-medium"
                        >
                          {cat.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {cat.description}
                        </p>
                      </div>
                      <Toggle
                        id={`cat-${cat.id}`}
                        checked={!!prefs.categories[cat.id]}
                        onChange={(val) => setCategory(cat.id, val)}
                      />
                    </li>
                  ))}
                </ul>
              </section>

              <Divider />

              {/* Frequency */}
              <section>
                <SectionHeading>Delivery Frequency</SectionHeading>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: "realtime", label: "Real-time" },
                      { value: "daily", label: "Daily Digest" },
                      { value: "weekly", label: "Weekly Summary" },
                      { value: "never", label: "Never" },
                    ] as { value: FrequencyOption; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setPrefs((p) => ({ ...p, frequency: opt.value }))
                      }
                      className={cn(
                        "rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                        prefs.frequency === opt.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              <Divider />

              {/* Quiet Hours */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <SectionHeading>Quiet Hours</SectionHeading>
                    <p className="text-xs text-muted-foreground -mt-2">
                      Suppress notifications during set hours.
                    </p>
                  </div>
                  <Toggle
                    id="quiet-toggle"
                    checked={prefs.quietHoursEnabled}
                    onChange={(val) =>
                      setPrefs((p) => ({ ...p, quietHoursEnabled: val }))
                    }
                  />
                </div>

                <div
                  className={cn(
                    "grid grid-cols-2 gap-4 transition-opacity duration-200",
                    prefs.quietHoursEnabled ? "opacity-100" : "opacity-40 pointer-events-none"
                  )}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="quiet-start" className="text-xs">
                      Start time
                    </Label>
                    <input
                      id="quiet-start"
                      type="time"
                      value={prefs.quietStart}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, quietStart: e.target.value }))
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="quiet-end" className="text-xs">
                      End time
                    </Label>
                    <input
                      id="quiet-end"
                      type="time"
                      value={prefs.quietEnd}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, quietEnd: e.target.value }))
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-4 flex items-center justify-between gap-3 bg-background">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground"
              >
                Reset defaults
              </Button>
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="text-sm text-green-600 font-medium animate-in fade-in slide-in-from-right-2 duration-200">
                    Saved!
                  </span>
                )}
                <Dialog.Close asChild>
                  <Button type="button" variant="outline" size="sm">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button type="submit" size="sm">
                  Save changes
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}