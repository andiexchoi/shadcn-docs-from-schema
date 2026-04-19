"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertTriangle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NotificationPreferences {
  emailMarketing: boolean;
  emailSecurity: boolean;
  emailProductUpdates: boolean;
  pushMessages: boolean;
  pushAlerts: boolean;
  smsVerification: boolean;
  smsAlerts: boolean;
  inAppAll: boolean;
  inAppMentions: boolean;
}

const defaultPreferences: NotificationPreferences = {
  emailMarketing: false,
  emailSecurity: true,
  emailProductUpdates: true,
  pushMessages: true,
  pushAlerts: true,
  smsVerification: true,
  smsAlerts: false,
  inAppAll: true,
  inAppMentions: true,
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
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="text-sm font-medium leading-snug cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground leading-snug">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
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
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border rounded-lg border bg-muted/30 px-4">
        {children}
      </div>
    </div>
  );
}

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  function toggle(key: keyof NotificationPreferences) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setPrefs(defaultPreferences);
    setSaved(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />

        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col bg-background shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300 ease-in-out"
          )}
          aria-describedby="sheet-description"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b px-6 py-5">
            <div>
              <Dialog.Title className="text-base font-semibold leading-tight">
                Notification preferences
              </Dialog.Title>
              <Dialog.Description
                id="sheet-description"
                className="mt-1 text-sm text-muted-foreground"
              >
                Choose how and when you want to be notified.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                aria-label="Close settings panel"
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Scrollable form body */}
          <form
            id="notification-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto px-6 py-5"
          >
            <Section
              icon={<Mail className="h-4 w-4" />}
              title="Email notifications"
            >
              <ToggleRow
                id="emailSecurity"
                label="Security alerts"
                description="Sign-ins, password changes, and suspicious activity."
                checked={prefs.emailSecurity}
                onChange={() => toggle("emailSecurity")}
              />
              <ToggleRow
                id="emailProductUpdates"
                label="Product updates"
                description="New features, improvements, and announcements."
                checked={prefs.emailProductUpdates}
                onChange={() => toggle("emailProductUpdates")}
              />
              <ToggleRow
                id="emailMarketing"
                label="Marketing & promotions"
                description="Tips, offers, and newsletters from our team."
                checked={prefs.emailMarketing}
                onChange={() => toggle("emailMarketing")}
              />
            </Section>

            <Section
              icon={<Bell className="h-4 w-4" />}
              title="Push notifications"
            >
              <ToggleRow
                id="pushMessages"
                label="New messages"
                description="Get notified when someone sends you a message."
                checked={prefs.pushMessages}
                onChange={() => toggle("pushMessages")}
              />
              <ToggleRow
                id="pushAlerts"
                label="System alerts"
                description="Outages, maintenance windows, and critical events."
                checked={prefs.pushAlerts}
                onChange={() => toggle("pushAlerts")}
              />
            </Section>

            <Section
              icon={<Smartphone className="h-4 w-4" />}
              title="SMS notifications"
            >
              <ToggleRow
                id="smsVerification"
                label="Verification codes"
                description="One-time codes for two-factor authentication."
                checked={prefs.smsVerification}
                onChange={() => toggle("smsVerification")}
              />
              <ToggleRow
                id="smsAlerts"
                label="Urgent alerts"
                description="Only sent for critical account or billing issues."
                checked={prefs.smsAlerts}
                onChange={() => toggle("smsAlerts")}
              />
            </Section>

            <Section
              icon={<MessageSquare className="h-4 w-4" />}
              title="In-app notifications"
            >
              <ToggleRow
                id="inAppAll"
                label="All activity"
                description="Likes, comments, follows, and other interactions."
                checked={prefs.inAppAll}
                onChange={() => toggle("inAppAll")}
              />
              <ToggleRow
                id="inAppMentions"
                label="Mentions only"
                description="Only notify me when I am mentioned directly."
                checked={prefs.inAppMentions}
                onChange={() => toggle("inAppMentions")}
              />
            </Section>

            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <p>
                Disabling security alerts is not recommended. You may miss important
                account activity.
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-background px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              Reset to defaults
            </Button>
            <div className="flex items-center gap-3">
              {saved && (
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  Saved!
                </span>
              )}
              <Dialog.Close asChild>
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" form="notification-form" size="sm">
                Save changes
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}