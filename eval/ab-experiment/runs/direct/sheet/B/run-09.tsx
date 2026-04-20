"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NotificationPreferences {
  emailMarketing: boolean;
  emailUpdates: boolean;
  emailSecurity: boolean;
  pushAll: boolean;
  pushMentions: boolean;
  pushReminders: boolean;
  smsAlerts: boolean;
  inAppAll: boolean;
  inAppComments: boolean;
  digestFrequency: "realtime" | "daily" | "weekly" | "never";
}

const defaultPrefs: NotificationPreferences = {
  emailMarketing: false,
  emailUpdates: true,
  emailSecurity: true,
  pushAll: false,
  pushMentions: true,
  pushReminders: true,
  smsAlerts: false,
  inAppAll: true,
  inAppComments: true,
  digestFrequency: "daily",
};

interface ToggleRowProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ id, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1 min-w-0">
        <Label htmlFor={id} className="text-sm font-medium text-gray-900 cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
          checked ? "bg-gray-900" : "bg-gray-200"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm",
            "transform transition duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-500">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
}

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPrefs);
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  function update<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setTimeout(() => setSaved(false), 300);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/40",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />

        <Dialog.Content
          aria-describedby="notification-sheet-description"
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col bg-white shadow-xl",
            "sm:max-w-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300 ease-in-out",
            "focus-visible:outline-none"
          )}
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
            <div className="space-y-1 pr-8">
              <Dialog.Title className="text-base font-semibold text-gray-900">
                Notification preferences
              </Dialog.Title>
              <Dialog.Description
                id="notification-sheet-description"
                className="text-sm text-gray-500"
              >
                Choose how and when you want to be notified about activity.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                className={cn(
                  "rounded-md p-1.5 text-gray-400 transition-colors",
                  "hover:bg-gray-100 hover:text-gray-600",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1"
                )}
                aria-label="Close notification settings"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Scrollable form body */}
          <form
            id="notification-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
          >
            {/* Email */}
            <Section icon={<Mail className="h-4 w-4" />} title="Email">
              <ToggleRow
                id="email-marketing"
                label="Marketing emails"
                description="Product news, tips, and special offers."
                checked={prefs.emailMarketing}
                onChange={(v) => update("emailMarketing", v)}
              />
              <ToggleRow
                id="email-updates"
                label="Product updates"
                description="New features, releases, and improvements."
                checked={prefs.emailUpdates}
                onChange={(v) => update("emailUpdates", v)}
              />
              <ToggleRow
                id="email-security"
                label="Security alerts"
                description="Sign-ins, password changes, and account activity."
                checked={prefs.emailSecurity}
                onChange={(v) => update("emailSecurity", v)}
              />
            </Section>

            {/* Push */}
            <Section icon={<Smartphone className="h-4 w-4" />} title="Push notifications">
              <ToggleRow
                id="push-all"
                label="All push notifications"
                description="Master toggle for all push alerts."
                checked={prefs.pushAll}
                onChange={(v) => update("pushAll", v)}
              />
              <ToggleRow
                id="push-mentions"
                label="Mentions and replies"
                description="Notify when someone mentions or replies to you."
                checked={prefs.pushMentions}
                onChange={(v) => update("pushMentions", v)}
              />
              <ToggleRow
                id="push-reminders"
                label="Reminders"
                description="Scheduled and deadline reminders."
                checked={prefs.pushReminders}
                onChange={(v) => update("pushReminders", v)}
              />
            </Section>

            {/* SMS */}
            <Section icon={<MessageSquare className="h-4 w-4" />} title="SMS">
              <ToggleRow
                id="sms-alerts"
                label="Critical alerts via SMS"
                description="Only sent for urgent security or account issues."
                checked={prefs.smsAlerts}
                onChange={(v) => update("smsAlerts", v)}
              />
            </Section>

            {/* In-app */}
            <Section icon={<Bell className="h-4 w-4" />} title="In-app">
              <ToggleRow
                id="inapp-all"
                label="All in-app notifications"
                description="Show notifications inside the application."
                checked={prefs.inAppAll}
                onChange={(v) => update("inAppAll", v)}
              />
              <ToggleRow
                id="inapp-comments"
                label="Comments and reactions"
                description="Activity on items you created or follow."
                checked={prefs.inAppComments}
                onChange={(v) => update("inAppComments", v)}
              />
            </Section>

            {/* Digest frequency */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Digest frequency
                </h3>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-4 space-y-2">
                <p className="text-xs text-gray-500 mb-3">
                  How often should we bundle and send you a summary email?
                </p>
                {(
                  [
                    { value: "realtime", label: "Real-time" },
                    { value: "daily", label: "Daily digest" },
                    { value: "weekly", label: "Weekly digest" },
                    { value: "never", label: "Never" },
                  ] as const
                ).map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="digestFrequency"
                      value={value}
                      checked={prefs.digestFrequency === value}
                      onChange={() => update("digestFrequency", value)}
                      className={cn(
                        "h-4 w-4 border-gray-300 text-gray-900",
                        "focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1"
                      )}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-3 bg-white">
            {saved && (
              <p className="text-sm text-green-600 font-medium" role="status" aria-live="polite">
                Preferences saved.
              </p>
            )}
            {!saved && <span />}
            <div className="flex gap-2 ml-auto">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                form="notification-form"
                disabled={saving}
                className="min-w-[80px]"
              >
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}