"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, AlertCircle, Info } from "lucide-react";
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

const channels: NotificationChannel[] = [
  {
    id: "email",
    label: "Email",
    description: "Receive notifications via email",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "push",
    label: "Push",
    description: "Browser push notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "sms",
    label: "SMS",
    description: "Text message alerts",
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: "inapp",
    label: "In-App",
    description: "Notifications inside the app",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

const defaultCategories: NotificationCategory[] = [
  {
    id: "security",
    label: "Security Alerts",
    description: "Login attempts, password changes, and suspicious activity",
    channels: { email: true, push: true, sms: true, inapp: true },
  },
  {
    id: "updates",
    label: "Product Updates",
    description: "New features, improvements, and release notes",
    channels: { email: true, push: false, sms: false, inapp: true },
  },
  {
    id: "billing",
    label: "Billing & Payments",
    description: "Invoices, payment confirmations, and subscription changes",
    channels: { email: true, push: false, sms: false, inapp: true },
  },
  {
    id: "activity",
    label: "Account Activity",
    description: "Comments, mentions, and team activity",
    channels: { email: false, push: true, sms: false, inapp: true },
  },
  {
    id: "marketing",
    label: "Marketing & Promotions",
    description: "Special offers, newsletters, and tips",
    channels: { email: false, push: false, sms: false, inapp: false },
  },
];

type Frequency = "realtime" | "daily" | "weekly";

interface GlobalSettings {
  masterEnabled: boolean;
  frequency: Frequency;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
}

const Toggle = ({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  label?: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={cn(
      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      checked ? "bg-primary" : "bg-input",
      disabled && "cursor-not-allowed opacity-50"
    )}
  >
    <span
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
        checked ? "translate-x-4" : "translate-x-0"
      )}
    />
  </button>
);

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<NotificationCategory[]>(defaultCategories);
  const [global, setGlobal] = React.useState<GlobalSettings>({
    masterEnabled: true,
    frequency: "realtime",
    quietHoursEnabled: false,
    quietStart: "22:00",
    quietEnd: "08:00",
  });
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setCategories(defaultCategories);
    setGlobal({
      masterEnabled: true,
      frequency: "realtime",
      quietHoursEnabled: false,
      quietStart: "22:00",
      quietEnd: "08:00",
    });
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
            "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[480px] flex-col bg-background shadow-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300 ease-in-out"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bell className="h-4 w-4" />
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

          {/* Scrollable body */}
          <form onSubmit={handleSave} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

              {/* Master toggle */}
              <section className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">All Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        {global.masterEnabled ? "Notifications are enabled" : "All notifications are muted"}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={global.masterEnabled}
                    onChange={(val) => setGlobal((g) => ({ ...g, masterEnabled: val }))}
                    label="Toggle all notifications"
                  />
                </div>
              </section>

              {/* Delivery frequency */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold">Delivery Frequency</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose how often you want to be notified.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["realtime", "daily", "weekly"] as Frequency[]).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      disabled={!global.masterEnabled}
                      onClick={() => setGlobal((g) => ({ ...g, frequency: freq }))}
                      className={cn(
                        "rounded-md border px-3 py-2 text-xs font-medium capitalize transition-colors",
                        global.frequency === freq
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background text-foreground hover:bg-muted",
                        !global.masterEnabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {freq === "realtime" ? "Real-time" : freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </section>

              {/* Quiet hours */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Quiet Hours</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pause notifications during a set time window.
                    </p>
                  </div>
                  <Toggle
                    checked={global.quietHoursEnabled}
                    onChange={(val) => setGlobal((g) => ({ ...g, quietHoursEnabled: val }))}
                    disabled={!global.masterEnabled}
                    label="Toggle quiet hours"
                  />
                </div>
                {global.quietHoursEnabled && global.masterEnabled && (
                  <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/20 p-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="quiet-start" className="text-xs">
                        Start time
                      </Label>
                      <input
                        id="quiet-start"
                        type="time"
                        value={global.quietStart}
                        onChange={(e) => setGlobal((g) => ({ ...g, quietStart: e.target.value }))}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quiet-end" className="text-xs">
                        End time
                      </Label>
                      <input
                        id="quiet-end"
                        type="time"
                        value={global.quietEnd}
                        onChange={(e) => setGlobal((g) => ({ ...g, quietEnd: e.target.value }))}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Notification categories */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Notification Categories</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Choose which channels to use for each category.
                  </p>
                </div>

                {/* Channel header labels */}
                <div className="grid grid-cols-[1fr_repeat(4,_28px)] items-center gap-2 px-1">
                  <span />
                  {channels.map((ch) => (
                    <div
                      key={ch.id}
                      title={ch.label}
                      className="flex items-center justify-center text-muted-foreground"
                    >
                      {ch.icon}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={cn(
                        "grid grid-cols-[1fr_repeat(4,_28px)] items-center gap-2 rounded-lg border bg-card px-3 py-3 transition-opacity",
                        !global.masterEnabled && "opacity-50"
                      )}
                    >
                      <div className="min-w-0 pr-1">
                        <p className="truncate text-sm font-medium">{category.label}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                      {channels.map((ch) => (
                        <div key={ch.id} className="flex items-center justify-center">
                          <Toggle
                            checked={category.channels[ch.id] ?? false}
                            onChange={(val) => handleChannelToggle(category.id, ch.id, val)}
                            disabled={!global.masterEnabled}
                            label={`${category.label} ${ch.label}`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 rounded-md bg-muted/30 px-3 py-2">
                  {channels.map((ch) => (
                    <div key={ch.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {ch.icon}
                      <span>{ch.label}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Info note */}
              <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2.5 dark:border-blue-900 dark:bg-blue-950/30">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Some critical security notifications may still be sent regardless of your preferences.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t bg-background px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleReset}
              >
                Reset to defaults
              </Button>
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="text-xs font-medium text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-right-2">
                    Saved!
                  </span>
                )}
                <Button type="submit" size="sm" className="gap-2">
                  <Bell className="h-3.5 w-3.5" />
                  Save preferences
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}