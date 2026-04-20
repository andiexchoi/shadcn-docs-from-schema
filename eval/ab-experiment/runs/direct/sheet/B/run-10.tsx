"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  emailAddress: string;
  phoneNumber: string;
  marketingUpdates: boolean;
  securityAlerts: boolean;
  productNews: boolean;
  weeklySummary: boolean;
}

const defaultPreferences: NotificationPreferences = {
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
  inAppEnabled: true,
  emailAddress: "",
  phoneNumber: "",
  marketingUpdates: false,
  securityAlerts: true,
  productNews: true,
  weeklySummary: false,
};

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ id, checked, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

interface ToggleRowProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

function ToggleRow({ id, label, description, checked, onChange, icon, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="shrink-0 text-muted-foreground">{icon}</span>
        )}
        <div className="min-w-0">
          <Label
            htmlFor={id}
            className="text-sm font-medium leading-none cursor-pointer"
          >
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <ToggleSwitch id={id} checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  function update<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) {
    setSaved(false);
    setPrefs((prev) => ({ ...prev, [key]: value }));
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col bg-background shadow-xl",
            "max-w-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300 ease-in-out",
            "focus:outline-none"
          )}
          aria-describedby="sheet-description"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border px-6 py-5">
            <div className="space-y-1 pr-4">
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                Notification preferences
              </Dialog.Title>
              <Dialog.Description
                id="sheet-description"
                className="text-sm text-muted-foreground"
              >
                Choose how and when you receive notifications from us.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-sm opacity-70 hover:opacity-100"
                aria-label="Close settings panel"
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <form
            id="notification-settings-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto"
          >
            <div className="space-y-8 px-6 py-6">
              {/* Channels */}
              <Section
                title="Notification channels"
                description="Enable or disable the channels through which you receive notifications."
              >
                <ToggleRow
                  id="email-enabled"
                  label="Email"
                  description="Receive notifications in your inbox."
                  icon={<Mail className="h-4 w-4" />}
                  checked={prefs.emailEnabled}
                  onChange={(v) => update("emailEnabled", v)}
                />
                {prefs.emailEnabled && (
                  <div className="ml-4 pl-4 border-l border-border space-y-2">
                    <Label htmlFor="email-address" className="text-sm font-medium">
                      Email address
                    </Label>
                    <Input
                      id="email-address"
                      type="email"
                      placeholder="you@example.com"
                      value={prefs.emailAddress}
                      onChange={(e) => update("emailAddress", e.target.value)}
                      className="h-9"
                    />
                  </div>
                )}

                <ToggleRow
                  id="sms-enabled"
                  label="SMS"
                  description="Get text messages for important alerts."
                  icon={<MessageSquare className="h-4 w-4" />}
                  checked={prefs.smsEnabled}
                  onChange={(v) => update("smsEnabled", v)}
                />
                {prefs.smsEnabled && (
                  <div className="ml-4 pl-4 border-l border-border space-y-2">
                    <Label htmlFor="phone-number" className="text-sm font-medium">
                      Phone number
                    </Label>
                    <Input
                      id="phone-number"
                      type="tel"
                      placeholder="+1 555 000 0000"
                      value={prefs.phoneNumber}
                      onChange={(e) => update("phoneNumber", e.target.value)}
                      className="h-9"
                    />
                  </div>
                )}

                <ToggleRow
                  id="push-enabled"
                  label="Push notifications"
                  description="Receive alerts on your device even when the app is closed."
                  icon={<Smartphone className="h-4 w-4" />}
                  checked={prefs.pushEnabled}
                  onChange={(v) => update("pushEnabled", v)}
                />

                <ToggleRow
                  id="in-app-enabled"
                  label="In-app notifications"
                  description="Show notifications inside the application."
                  icon={<Bell className="h-4 w-4" />}
                  checked={prefs.inAppEnabled}
                  onChange={(v) => update("inAppEnabled", v)}
                />
              </Section>

              <div className="border-t border-border" />

              {/* Topics */}
              <Section
                title="Notification topics"
                description="Select the types of updates you want to receive."
              >
                <ToggleRow
                  id="security-alerts"
                  label="Security alerts"
                  description="Sign-in attempts, password changes, and suspicious activity."
                  icon={<AlertCircle className="h-4 w-4" />}
                  checked={prefs.securityAlerts}
                  onChange={(v) => update("securityAlerts", v)}
                />

                <ToggleRow
                  id="product-news"
                  label="Product news"
                  description="New features, improvements, and product announcements."
                  checked={prefs.productNews}
                  onChange={(v) => update("productNews", v)}
                />

                <ToggleRow
                  id="marketing-updates"
                  label="Marketing updates"
                  description="Promotions, offers, and newsletters from our team."
                  checked={prefs.marketingUpdates}
                  onChange={(v) => update("marketingUpdates", v)}
                />

                <ToggleRow
                  id="weekly-summary"
                  label="Weekly summary"
                  description="A digest of your activity and highlights from the past week."
                  checked={prefs.weeklySummary}
                  onChange={(v) => update("weeklySummary", v)}
                />
              </Section>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground"
            >
              Reset to defaults
            </Button>
            <div className="flex items-center gap-3">
              {saved && (
                <span className="text-sm text-green-600 font-medium animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                  Saved!
                </span>
              )}
              <Dialog.Close asChild>
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                form="notification-settings-form"
                size="sm"
              >
                Save preferences
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}