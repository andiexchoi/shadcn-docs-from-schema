"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Bell, X, Mail, MessageSquare, AlertCircle, Megaphone } from "lucide-react";
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
  channels: Record<string, boolean>;
}

const CHANNELS: NotificationChannel[] = [
  {
    id: "email",
    label: "Email",
    description: "Receive notifications via email",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "sms",
    label: "SMS",
    description: "Receive notifications via text message",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: "push",
    label: "Push",
    description: "Receive in-app push notifications",
    icon: <Bell className="h-4 w-4" />,
  },
];

const DEFAULT_CATEGORIES: NotificationCategory[] = [
  {
    id: "account",
    label: "Account Activity",
    description: "Login attempts, password changes, and security alerts",
    channels: { email: true, sms: true, push: true },
  },
  {
    id: "updates",
    label: "Product Updates",
    description: "New features, improvements, and announcements",
    channels: { email: true, sms: false, push: false },
  },
  {
    id: "alerts",
    label: "System Alerts",
    description: "Downtime, maintenance windows, and critical errors",
    channels: { email: true, sms: false, push: true },
  },
  {
    id: "marketing",
    label: "Marketing & Promotions",
    description: "Special offers, newsletters, and promotional content",
    channels: { email: false, sms: false, push: false },
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Task deadlines, follow-ups, and scheduled events",
    channels: { email: true, sms: false, push: true },
  },
];

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
}

function Toggle({ checked, onChange, id, disabled }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

interface FrequencySelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

function FrequencySelect({ value, onChange, id }: FrequencySelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
        "focus:outline-none focus:ring-1 focus:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50"
      )}
    >
      <option value="realtime">Real-time</option>
      <option value="hourly">Hourly digest</option>
      <option value="daily">Daily digest</option>
      <option value="weekly">Weekly digest</option>
    </select>
  );
}

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<NotificationCategory[]>(DEFAULT_CATEGORIES);
  const [globalEnabled, setGlobalEnabled] = React.useState(true);
  const [frequency, setFrequency] = React.useState("realtime");
  const [quietHoursEnabled, setQuietHoursEnabled] = React.useState(false);
  const [quietStart, setQuietStart] = React.useState("22:00");
  const [quietEnd, setQuietEnd] = React.useState("08:00");
  const [saved, setSaved] = React.useState(false);

  const handleChannelToggle = (categoryId: string, channelId: string, value: boolean) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, channels: { ...cat.channels, [channelId]: value } }
          : cat
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1200);
  };

  const handleReset = () => {
    setCategories(DEFAULT_CATEGORIES);
    setGlobalEnabled(true);
    setFrequency("realtime");
    setQuietHoursEnabled(false);
    setQuietStart("22:00");
    setQuietEnd("08:00");
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-background shadow-xl",
            "sm:max-w-[480px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold leading-none">
                  Notification Preferences
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-xs text-muted-foreground">
                  Manage how and when you receive notifications
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

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 px-6 py-5">

              {/* Global toggle */}
              <section className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="global-toggle" className="text-sm font-medium">
                      All Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Master switch to enable or disable all notifications
                    </p>
                  </div>
                  <Toggle
                    id="global-toggle"
                    checked={globalEnabled}
                    onChange={setGlobalEnabled}
                  />
                </div>
              </section>

              {/* Delivery frequency */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium">Delivery Frequency</h3>
                  <p className="text-xs text-muted-foreground">
                    Choose how often notifications are batched and delivered
                  </p>
                </div>
                <FrequencySelect
                  id="frequency"
                  value={frequency}
                  onChange={setFrequency}
                />
              </section>

              {/* Quiet hours */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Quiet Hours</h3>
                    <p className="text-xs text-muted-foreground">
                      Silence notifications during a set time window
                    </p>
                  </div>
                  <Toggle
                    checked={quietHoursEnabled}
                    onChange={setQuietHoursEnabled}
                  />
                </div>
                {quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="quiet-start" className="text-xs text-muted-foreground">
                        Start time
                      </Label>
                      <input
                        id="quiet-start"
                        type="time"
                        value={quietStart}
                        onChange={(e) => setQuietStart(e.target.value)}
                        className={cn(
                          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                          "focus:outline-none focus:ring-1 focus:ring-ring"
                        )}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quiet-end" className="text-xs text-muted-foreground">
                        End time
                      </Label>
                      <input
                        id="quiet-end"
                        type="time"
                        value={quietEnd}
                        onChange={(e) => setQuietEnd(e.target.value)}
                        className={cn(
                          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                          "focus:outline-none focus:ring-1 focus:ring-ring"
                        )}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Category preferences */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">Notification Categories</h3>
                </div>

                {/* Channel header */}
                <div className="grid grid-cols-[1fr_repeat(3,_40px)] items-center gap-2 px-1">
                  <span className="text-xs text-muted-foreground">Category</span>
                  {CHANNELS.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex flex-col items-center gap-0.5"
                      title={channel.label}
                    >
                      <span className="text-muted-foreground">{channel.icon}</span>
                      <span className="text-[10px] text-muted-foreground">{channel.label}</span>
                    </div>
                  ))}
                </div>

                <div className="divide-y rounded-lg border">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={cn(
                        "grid grid-cols-[1fr_repeat(3,_40px)] items-center gap-2 px-4 py-3",
                        !globalEnabled && "opacity-50 pointer-events-none"
                      )}
                    >
                      <div>
                        <p className="text-sm font-medium leading-none">{category.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-snug">
                          {category.description}
                        </p>
                      </div>
                      {CHANNELS.map((channel) => (
                        <div key={channel.id} className="flex items-center justify-center">
                          <Toggle
                            id={`${category.id}-${channel.id}`}
                            checked={category.channels[channel.id] ?? false}
                            onChange={(val) =>
                              handleChannelToggle(category.id, channel.id, val)
                            }
                            disabled={!globalEnabled}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>

              {/* Info note */}
              <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Changes to notification preferences may take a few minutes to propagate across all
                  devices and channels.
                </p>
              </div>

              {/* Announcement badge */}
              <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  You can manage email subscription preferences separately from your account email
                  settings page.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
              Reset to defaults
            </Button>
            <div className="flex gap-2">
              <Dialog.Close asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button size="sm" onClick={handleSave} disabled={saved} className="min-w-[80px]">
                {saved ? "Saved ✓" : "Save"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default NotificationSettingsSheet;