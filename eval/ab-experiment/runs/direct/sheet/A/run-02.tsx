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
    id: "account",
    label: "Account Activity",
    description: "Logins, password changes, and security alerts",
    icon: <AlertCircle className="h-4 w-4" />,
    channels: { email: true, push: true, sms: false, inApp: true },
  },
  {
    id: "messages",
    label: "Messages",
    description: "New messages and replies from your contacts",
    icon: <MessageSquare className="h-4 w-4" />,
    channels: { email: false, push: true, sms: false, inApp: true },
  },
  {
    id: "marketing",
    label: "Marketing & Promotions",
    description: "News, offers, and product updates",
    icon: <Mail className="h-4 w-4" />,
    channels: { email: true, push: false, sms: false, inApp: false },
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Upcoming events and scheduled tasks",
    icon: <Bell className="h-4 w-4" />,
    channels: { email: true, push: true, sms: true, inApp: true },
  },
  {
    id: "mobile",
    label: "Mobile Updates",
    description: "App-specific alerts and device notifications",
    icon: <Smartphone className="h-4 w-4" />,
    channels: { email: false, push: true, sms: false, inApp: false },
  },
];

type Channel = keyof NotificationSetting["channels"];

const channelLabels: Record<Channel, string> = {
  email: "Email",
  push: "Push",
  sms: "SMS",
  inApp: "In-App",
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
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

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<NotificationSetting[]>(defaultSettings);
  const [saved, setSaved] = React.useState(false);

  const handleToggle = (settingId: string, channel: Channel, value: boolean) => {
    setSaved(false);
    setSettings((prev) =>
      prev.map((s) =>
        s.id === settingId
          ? { ...s, channels: { ...s.channels, [channel]: value } }
          : s
      )
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setSaved(false);
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
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

          {/* Form body */}
          <form onSubmit={handleSave} className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Channel header row */}
              <div className="mb-3 flex items-center">
                <span className="flex-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Notification Type
                </span>
                <div className="flex gap-5 pr-1">
                  {(Object.keys(channelLabels) as Channel[]).map((ch) => (
                    <span
                      key={ch}
                      className="w-10 text-center text-xs font-medium text-muted-foreground"
                    >
                      {channelLabels[ch]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                {settings.map((setting, index) => (
                  <div
                    key={setting.id}
                    className={cn(
                      "rounded-lg px-4 py-3 transition-colors hover:bg-muted/50",
                      index % 2 === 0 ? "bg-muted/20" : "bg-transparent"
                    )}
                  >
                    <div className="flex items-center">
                      <div className="flex flex-1 items-start gap-3 min-w-0">
                        <div className="mt-0.5 shrink-0 text-muted-foreground">
                          {setting.icon}
                        </div>
                        <div className="min-w-0">
                          <Label
                            htmlFor={`${setting.id}-email`}
                            className="cursor-pointer text-sm font-medium leading-none"
                          >
                            {setting.label}
                          </Label>
                          <p className="mt-1 text-xs text-muted-foreground leading-snug">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-5 pl-4 pr-1">
                        {(Object.keys(channelLabels) as Channel[]).map((ch) => (
                          <div key={ch} className="flex w-10 justify-center">
                            <Toggle
                              checked={setting.channels[ch]}
                              onChange={(val) => handleToggle(setting.id, ch, val)}
                              label={`${setting.label} – ${channelLabels[ch]}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Global toggles */}
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Quick Actions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(channelLabels) as Channel[]).map((ch) => {
                    const allOn = settings.every((s) => s.channels[ch]);
                    return (
                      <Button
                        key={ch}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() =>
                          setSettings((prev) =>
                            prev.map((s) => ({
                              ...s,
                              channels: { ...s.channels, [ch]: !allOn },
                            }))
                          )
                        }
                      >
                        {allOn ? "Disable" : "Enable"} All {channelLabels[ch]}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-background px-6 py-4">
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
                  Reset to Default
                </Button>
                <Button type="submit" className="flex-1">
                  Save Preferences
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}