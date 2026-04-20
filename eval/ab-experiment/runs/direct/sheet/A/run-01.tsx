"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Info } from "lucide-react";
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
    id: "account",
    label: "Account Activity",
    description: "Sign-ins, password changes, and security alerts",
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    channels: { email: true, push: true, sms: false },
  },
  {
    id: "messages",
    label: "Messages",
    description: "New messages and replies from your inbox",
    icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
    channels: { email: true, push: false, sms: false },
  },
  {
    id: "newsletter",
    label: "Newsletter & Updates",
    description: "Product news, tips, and announcements",
    icon: <Mail className="h-4 w-4 text-green-500" />,
    channels: { email: false, push: false, sms: false },
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Task deadlines and scheduled event reminders",
    icon: <Bell className="h-4 w-4 text-yellow-500" />,
    channels: { email: true, push: true, sms: true },
  },
  {
    id: "system",
    label: "System Notices",
    description: "Maintenance windows and service status",
    icon: <Info className="h-4 w-4 text-purple-500" />,
    channels: { email: false, push: true, sms: false },
  },
];

type Channel = "email" | "push" | "sms";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
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
  const [settings, setSettings] =
    React.useState<NotificationSetting[]>(defaultSettings);
  const [saved, setSaved] = React.useState(false);

  const updateChannel = (id: string, channel: Channel, value: boolean) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, channels: { ...s.channels, [channel]: value } } : s
      )
    );
    setSaved(false);
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
            "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b px-6 py-5">
            <div>
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                Notification Preferences
              </Dialog.Title>
              <Dialog.Description className="mt-1.5 text-sm text-muted-foreground">
                Choose how and when you want to be notified.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-2 -mt-1 h-8 w-8 shrink-0"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSave}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Channel legend */}
              <div className="mb-4 grid grid-cols-[1fr_repeat(3,_56px)] gap-x-2 px-1">
                <span />
                {(["email", "push", "sms"] as Channel[]).map((ch) => (
                  <span
                    key={ch}
                    className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {ch}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                {settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/30"
                  >
                    <div className="grid grid-cols-[1fr_repeat(3,_56px)] items-start gap-x-2">
                      {/* Info */}
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0">{setting.icon}</span>
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

                      {/* Toggles */}
                      {(["email", "push", "sms"] as Channel[]).map((ch) => (
                        <div
                          key={ch}
                          className="flex items-center justify-center"
                        >
                          <Toggle
                            checked={setting.channels[ch]}
                            onChange={(v) => updateChannel(setting.id, ch, v)}
                            label={`${setting.label} — ${ch}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Global mute */}
              <div className="mt-6 rounded-lg border border-dashed bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Mute all notifications</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Temporarily silence every channel.
                    </p>
                  </div>
                  <Toggle
                    checked={settings.every(
                      (s) => !s.channels.email && !s.channels.push && !s.channels.sms
                    )}
                    onChange={(v) => {
                      setSettings((prev) =>
                        prev.map((s) => ({
                          ...s,
                          channels: v
                            ? { email: false, push: false, sms: false }
                            : defaultSettings.find((d) => d.id === s.id)!.channels,
                        }))
                      );
                      setSaved(false);
                    }}
                    label="Mute all notifications"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-background px-6 py-4">
              {saved && (
                <p className="mb-3 flex items-center gap-1.5 text-sm text-green-600">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  Preferences saved successfully.
                </p>
              )}
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Save preferences
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Reset defaults
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