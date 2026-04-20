"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, AlertCircle } from "lucide-react";
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
    inApp: boolean;
  };
}

const defaultSettings: NotificationSetting[] = [
  {
    id: "security",
    label: "Security Alerts",
    description: "Login attempts, password changes, and suspicious activity",
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    channels: { email: true, push: true, sms: true, inApp: true },
  },
  {
    id: "messages",
    label: "Messages",
    description: "New messages and replies in your conversations",
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
    channels: { email: true, push: true, sms: false, inApp: true },
  },
  {
    id: "updates",
    label: "Product Updates",
    description: "New features, improvements, and announcements",
    icon: <Bell className="h-4 w-4 text-purple-500" />,
    channels: { email: true, push: false, sms: false, inApp: true },
  },
  {
    id: "marketing",
    label: "Marketing & Promotions",
    description: "Special offers, newsletters, and promotional content",
    icon: <Mail className="h-4 w-4 text-green-500" />,
    channels: { email: false, push: false, sms: false, inApp: false },
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Task deadlines, upcoming events, and follow-ups",
    icon: <Smartphone className="h-4 w-4 text-orange-500" />,
    channels: { email: true, push: true, sms: false, inApp: true },
  },
];

type Channel = keyof NotificationSetting["channels"];

const channelLabels: Record<Channel, string> = {
  email: "Email",
  push: "Push",
  sms: "SMS",
  inApp: "In-App",
};

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

function Toggle({ checked, onChange, id }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

interface FrequencyOption {
  value: string;
  label: string;
}

const frequencyOptions: FrequencyOption[] = [
  { value: "instant", label: "Instant" },
  { value: "hourly", label: "Hourly Digest" },
  { value: "daily", label: "Daily Digest" },
  { value: "weekly", label: "Weekly Digest" },
];

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<NotificationSetting[]>(defaultSettings);
  const [globalMute, setGlobalMute] = React.useState(false);
  const [emailFrequency, setEmailFrequency] = React.useState("instant");
  const [quietHoursEnabled, setQuietHoursEnabled] = React.useState(false);
  const [quietStart, setQuietStart] = React.useState("22:00");
  const [quietEnd, setQuietEnd] = React.useState("08:00");
  const [saved, setSaved] = React.useState(false);

  const toggleChannel = (settingId: string, channel: Channel) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === settingId
          ? { ...s, channels: { ...s.channels, [channel]: !s.channels[channel] } }
          : s
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
    setSettings(defaultSettings);
    setGlobalMute(false);
    setEmailFrequency("instant");
    setQuietHoursEnabled(false);
    setQuietStart("22:00");
    setQuietEnd("08:00");
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        <Bell className="h-4 w-4" />
        Notification Settings
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
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
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <Dialog.Title className="text-lg font-semibold">
                  Notification Preferences
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </Dialog.Close>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 px-6 py-5">

                {/* Global Mute */}
                <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">Mute All Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Temporarily disable all notifications
                    </p>
                  </div>
                  <Toggle
                    id="global-mute"
                    checked={globalMute}
                    onChange={setGlobalMute}
                  />
                </div>

                {/* Notification Types */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Notification Types
                  </h3>

                  {/* Channel Headers */}
                  <div className="grid grid-cols-[1fr_repeat(4,_auto)] items-center gap-3 px-1">
                    <span />
                    {(Object.keys(channelLabels) as Channel[]).map((ch) => (
                      <span
                        key={ch}
                        className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-10"
                      >
                        {channelLabels[ch]}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {settings.map((setting) => (
                      <div
                        key={setting.id}
                        className={cn(
                          "rounded-lg border bg-card px-4 py-3 transition-opacity",
                          globalMute && "opacity-50 pointer-events-none"
                        )}
                      >
                        <div className="grid grid-cols-[1fr_repeat(4,_auto)] items-center gap-3">
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="mt-0.5 shrink-0">{setting.icon}</span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{setting.label}</p>
                              <p className="truncate text-xs text-muted-foreground">
                                {setting.description}
                              </p>
                            </div>
                          </div>
                          {(Object.keys(channelLabels) as Channel[]).map((ch) => (
                            <div key={ch} className="flex w-10 justify-center">
                              <Toggle
                                id={`${setting.id}-${ch}`}
                                checked={setting.channels[ch]}
                                onChange={() => toggleChannel(setting.id, ch)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Frequency */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Email Frequency
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {frequencyOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setEmailFrequency(opt.value)}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                          emailFrequency === opt.value
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quiet Hours */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Quiet Hours
                    </h3>
                    <Toggle
                      id="quiet-hours"
                      checked={quietHoursEnabled}
                      onChange={setQuietHoursEnabled}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Suppress notifications during the specified time range.
                  </p>
                  <div
                    className={cn(
                      "grid grid-cols-2 gap-4 transition-opacity",
                      !quietHoursEnabled && "opacity-50 pointer-events-none"
                    )}
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="quiet-start" className="text-xs">
                        Start Time
                      </Label>
                      <input
                        id="quiet-start"
                        type="time"
                        value={quietStart}
                        onChange={(e) => setQuietStart(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="quiet-end" className="text-xs">
                        End Time
                      </Label>
                      <input
                        id="quiet-end"
                        type="time"
                        value={quietEnd}
                        onChange={(e) => setQuietEnd(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-background px-6 py-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleReset}
                >
                  Reset to Default
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleSave}
                >
                  {saved ? (
                    <>
                      <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                      Saved!
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Changes apply to all devices connected to your account.
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}