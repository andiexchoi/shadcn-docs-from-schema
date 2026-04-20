"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NotificationOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  marketing: boolean;
  security: boolean;
  updates: boolean;
  digest: "never" | "daily" | "weekly";
}

const notificationChannels: NotificationOption[] = [
  {
    id: "email",
    label: "Email Notifications",
    description: "Receive notifications via email",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "push",
    label: "Push Notifications",
    description: "Browser push notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "sms",
    label: "SMS Notifications",
    description: "Text message alerts",
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: "inApp",
    label: "In-App Notifications",
    description: "Notifications within the app",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

const notificationTypes: NotificationOption[] = [
  {
    id: "marketing",
    label: "Marketing & Promotions",
    description: "News, offers, and product updates",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "security",
    label: "Security Alerts",
    description: "Login attempts and account changes",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    id: "updates",
    label: "Product Updates",
    description: "New features and improvements",
    icon: <Bell className="h-4 w-4" />,
  },
];

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

function OptionRow({
  option,
  checked,
  onChange,
}: {
  option: NotificationOption;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/30">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          {option.icon}
        </div>
        <div>
          <Label
            htmlFor={`toggle-${option.id}`}
            className="cursor-pointer text-sm font-medium text-foreground"
          >
            {option.label}
          </Label>
          <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
        </div>
      </div>
      <Toggle
        id={`toggle-${option.id}`}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
}

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const [prefs, setPrefs] = React.useState<NotificationPreferences>({
    email: true,
    push: true,
    sms: false,
    inApp: true,
    marketing: false,
    security: true,
    updates: true,
    digest: "weekly",
  });

  const setField = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
  };

  const handleReset = () => {
    setPrefs({
      email: true,
      push: true,
      sms: false,
      inApp: true,
      marketing: false,
      security: true,
      updates: true,
      digest: "weekly",
    });
    setSaved(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <Bell className="h-4 w-4" />
        Notification Settings
      </Button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

          <Dialog.Content
            className={cn(
              "fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-background shadow-2xl",
              "duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <Dialog.Title className="text-base font-semibold text-foreground">
                    Notification Preferences
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-muted-foreground">
                    Manage how you receive notifications
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

            {/* Scrollable Form Content */}
            <form
              onSubmit={handleSave}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {/* Channels */}
                <section className="mb-8">
                  <SectionHeader
                    title="Notification Channels"
                    description="Choose where you want to receive notifications"
                  />
                  <div className="flex flex-col gap-3">
                    {notificationChannels.map((option) => (
                      <OptionRow
                        key={option.id}
                        option={option}
                        checked={prefs[option.id as keyof NotificationPreferences] as boolean}
                        onChange={(val) =>
                          setField(option.id as keyof NotificationPreferences, val)
                        }
                      />
                    ))}
                  </div>
                </section>

                {/* Types */}
                <section className="mb-8">
                  <SectionHeader
                    title="Notification Types"
                    description="Select the types of notifications you'd like to receive"
                  />
                  <div className="flex flex-col gap-3">
                    {notificationTypes.map((option) => (
                      <OptionRow
                        key={option.id}
                        option={option}
                        checked={prefs[option.id as keyof NotificationPreferences] as boolean}
                        onChange={(val) =>
                          setField(option.id as keyof NotificationPreferences, val)
                        }
                      />
                    ))}
                  </div>
                </section>

                {/* Digest */}
                <section>
                  <SectionHeader
                    title="Email Digest"
                    description="How often would you like a summary email?"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {(["never", "daily", "weekly"] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setField("digest", freq)}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors",
                          prefs.digest === freq
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:bg-accent/40"
                        )}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="border-t border-border px-6 py-4">
                {saved && (
                  <p className="mb-3 text-center text-xs font-medium text-green-600 dark:text-green-400">
                    ✓ Preferences saved successfully
                  </p>
                )}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleReset}
                    disabled={saving}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        Saving…
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}