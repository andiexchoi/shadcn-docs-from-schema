"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const defaultSettings: NotificationSetting[] = [
  {
    id: "account_activity",
    label: "Account Activity",
    description: "Get notified about sign-ins, password changes, and other account events.",
    icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
    channels: { email: true, push: true, sms: false },
  },
  {
    id: "messages",
    label: "Messages",
    description: "Receive notifications when you get a new message.",
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
    channels: { email: true, push: true, sms: true },
  },
  {
    id: "updates",
    label: "Product Updates",
    description: "News about product and feature updates.",
    icon: <Bell className="h-4 w-4 text-purple-500" />,
    channels: { email: true, push: false, sms: false },
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Reminders about tasks, deadlines, and scheduled events.",
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    channels: { email: false, push: true, sms: false },
  },
  {
    id: "marketing",
    label: "Marketing & Promotions",
    description: "Promotional offers, surveys, and newsletters.",
    icon: <Mail className="h-4 w-4 text-pink-500" />,
    channels: { email: false, push: false, sms: false },
  },
];

type Channel = "email" | "push" | "sms";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

function Toggle({ checked, onChange, id }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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

interface NotificationSettingsSheetProps {
  children?: React.ReactNode;
}

export function NotificationSettingsSheet({ children }: NotificationSettingsSheetProps) {
  const [settings, setSettings] = React.useState<NotificationSetting[]>(defaultSettings);
  const [saved, setSaved] = React.useState(false);
  const [globalEmail, setGlobalEmail] = React.useState(true);
  const [globalPush, setGlobalPush] = React.useState(true);
  const [globalSms, setGlobalSms] = React.useState(false);

  const handleChannelToggle = (settingId: string, channel: Channel, value: boolean) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === settingId
          ? { ...s, channels: { ...s.channels, [channel]: value } }
          : s
      )
    );
    setSaved(false);
  };

  const handleGlobalToggle = (channel: Channel, value: boolean) => {
    if (channel === "email") setGlobalEmail(value);
    if (channel === "push") setGlobalPush(value);
    if (channel === "sms") setGlobalSms(value);
    setSettings((prev) =>
      prev.map((s) => ({ ...s, channels: { ...s.channels, [channel]: value } }))
    );
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setGlobalEmail(true);
    setGlobalPush(true);
    setGlobalSms(false);
    setSaved(false);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children ?? (
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Notification Settings
          </Button>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col bg-background shadow-2xl",
            "sm:max-w-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300 ease-in-out"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
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

          {/* Scrollable body */}
          <form onSubmit={handleSave} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Global toggles */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Global Channels
                </h3>
                <div className="rounded-xl border bg-muted/30 divide-y">
                  {(
                    [
                      { channel: "email" as Channel, label: "Email", value: globalEmail, setter: setGlobalEmail },
                      { channel: "push" as Channel, label: "Push Notifications", value: globalPush, setter: setGlobalPush },
                      { channel: "sms" as Channel, label: "SMS", value: globalSms, setter: setGlobalSms },
                    ]
                  ).map(({ channel, label, value }) => (
                    <div key={channel} className="flex items-center justify-between px-4 py-3">
                      <Label htmlFor={`global-${channel}`} className="text-sm font-medium cursor-pointer">
                        {label}
                      </Label>
                      <Toggle
                        id={`global-${channel}`}
                        checked={value}
                        onChange={(v) => handleGlobalToggle(channel, v)}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Toggling a channel here will update all notification types below.
                </p>
              </section>

              {/* Per-notification settings */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Notification Types
                </h3>
                <div className="space-y-3">
                  {settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/20"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                          {setting.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-tight">{setting.label}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                            {setting.description}
                          </p>
                        </div>
                      </div>

                      <div className="ml-10 grid grid-cols-3 gap-2">
                        {(["email", "push", "sms"] as Channel[]).map((channel) => (
                          <div key={channel} className="flex flex-col items-center gap-1.5">
                            <Toggle
                              id={`${setting.id}-${channel}`}
                              checked={setting.channels[channel]}
                              onChange={(v) => handleChannelToggle(setting.id, channel, v)}
                            />
                            <Label
                              htmlFor={`${setting.id}-${channel}`}
                              className="text-[10px] text-muted-foreground capitalize cursor-pointer"
                            >
                              {channel === "push" ? "Push" : channel.toUpperCase()}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quiet hours */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Quiet Hours
                </h3>
                <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="quiet-start" className="text-xs font-medium">
                        Start time
                      </Label>
                      <input
                        id="quiet-start"
                        type="time"
                        defaultValue="22:00"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quiet-end" className="text-xs font-medium">
                        End time
                      </Label>
                      <input
                        id="quiet-end"
                        type="time"
                        defaultValue="08:00"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Push and SMS notifications will be muted during these hours.
                  </p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex items-center justify-between gap-3 bg-background">
              <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                Reset defaults
              </Button>
              <div className="flex items-center gap-3">
                {saved && (
                  <span className="flex items-center gap-1.5 text-xs text-green-600 animate-in fade-in slide-in-from-right-2 duration-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
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

export default NotificationSettingsSheet;