"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/* ─────────────────────────────────────────────
   Local Sheet primitives built on Radix Dialog
   ───────────────────────────────────────────── */

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "left" | "right" | "top" | "bottom";
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
  const sideVariants: Record<string, string> = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left:
      "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top:
      "inset-x-0 top-0 w-full border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "inset-x-0 bottom-0 w-full border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-xl flex flex-col",
          "duration-300 ease-in-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          sideVariants[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 px-6 py-5 border-b", className)} {...props} />
);

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 border-t", className)}
    {...props}
  />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-slate-900", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

/* ─────────────────────────────────────────────
   Toggle Switch component
   ───────────────────────────────────────────── */

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
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        checked ? "bg-slate-900" : "bg-slate-200",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md",
          "transform transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Notification preference types & config
   ───────────────────────────────────────────── */

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  weeklyDigest: boolean;
  mentionsOnly: boolean;
  emailAddress: string;
  phoneNumber: string;
  digestFrequency: "daily" | "weekly" | "monthly";
}

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  inAppNotifications: true,
  marketingEmails: false,
  securityAlerts: true,
  weeklyDigest: true,
  mentionsOnly: false,
  emailAddress: "",
  phoneNumber: "",
  digestFrequency: "weekly",
};

interface ToggleRowProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleRow({ id, icon, label, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex items-start gap-3 min-w-0">
        <span className="mt-0.5 shrink-0 text-slate-500">{icon}</span>
        <div className="min-w-0">
          <Label
            htmlFor={id}
            className="text-sm font-medium text-slate-800 cursor-pointer leading-snug"
          >
            {label}
          </Label>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <ToggleSwitch id={id} checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  function toggle(key: keyof NotificationPreferences) {
    return (checked: boolean) => {
      setPrefs((prev) => ({ ...prev, [key]: checked }));
      setSaved(false);
    };
  }

  function handleTextChange(key: keyof NotificationPreferences) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrefs((prev) => ({ ...prev, [key]: e.target.value }));
      setSaved(false);
    };
  }

  function handleFrequencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPrefs((prev) => ({
      ...prev,
      digestFrequency: e.target.value as NotificationPreferences["digestFrequency"],
    }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
  }

  function handleReset() {
    setPrefs(defaultPreferences);
    setSaved(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col overflow-hidden">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-700" />
            <SheetTitle>Notification preferences</SheetTitle>
          </div>
          <SheetDescription>
            Choose how and when you want to be notified about activity.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto"
        >
          <div className="px-6 py-4 space-y-6">
            {/* Channels */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Channels
              </h3>
              <div className="divide-y divide-slate-100">
                <ToggleRow
                  id="emailNotifications"
                  icon={<Mail className="h-4 w-4" />}
                  label="Email notifications"
                  description="Receive updates and alerts via email."
                  checked={prefs.emailNotifications}
                  onChange={toggle("emailNotifications")}
                />
                <ToggleRow
                  id="pushNotifications"
                  icon={<Bell className="h-4 w-4" />}
                  label="Push notifications"
                  description="Get real-time alerts in your browser."
                  checked={prefs.pushNotifications}
                  onChange={toggle("pushNotifications")}
                />
                <ToggleRow
                  id="smsNotifications"
                  icon={<Smartphone className="h-4 w-4" />}
                  label="SMS notifications"
                  description="Receive text messages for critical alerts."
                  checked={prefs.smsNotifications}
                  onChange={toggle("smsNotifications")}
                />
                <ToggleRow
                  id="inAppNotifications"
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="In-app notifications"
                  description="See a notification badge inside the app."
                  checked={prefs.inAppNotifications}
                  onChange={toggle("inAppNotifications")}
                />
              </div>
            </section>

            {/* Contact details */}
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Contact details
              </h3>
              <div className="space-y-1.5">
                <Label htmlFor="emailAddress" className="text-sm">
                  Email address
                </Label>
                <Input
                  id="emailAddress"
                  type="email"
                  placeholder="you@example.com"
                  value={prefs.emailAddress}
                  onChange={handleTextChange("emailAddress")}
                  disabled={!prefs.emailNotifications}
                  className="text-sm"
                />
                {!prefs.emailNotifications && (
                  <p className="text-xs text-slate-400">Enable email notifications to edit.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-sm">
                  Phone number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={prefs.phoneNumber}
                  onChange={handleTextChange("phoneNumber")}
                  disabled={!prefs.smsNotifications}
                  className="text-sm"
                />
                {!prefs.smsNotifications && (
                  <p className="text-xs text-slate-400">Enable SMS notifications to edit.</p>
                )}
              </div>
            </section>

            {/* Preferences */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Preferences
              </h3>
              <div className="divide-y divide-slate-100">
                <ToggleRow
                  id="securityAlerts"
                  icon={<AlertCircle className="h-4 w-4" />}
                  label="Security alerts"
                  description="Always be notified of sign-ins and suspicious activity."
                  checked={prefs.securityAlerts}
                  onChange={toggle("securityAlerts")}
                />
                <ToggleRow
                  id="marketingEmails"
                  icon={<Mail className="h-4 w-4" />}
                  label="Marketing emails"
                  description="Receive product news, tips, and special offers."
                  checked={prefs.marketingEmails}
                  onChange={toggle("marketingEmails")}
                />
                <ToggleRow
                  id="weeklyDigest"
                  icon={<Bell className="h-4 w-4" />}
                  label="Activity digest"
                  description="A summary of activity rolled up into a single message."
                  checked={prefs.weeklyDigest}
                  onChange={toggle("weeklyDigest")}
                />
                <ToggleRow
                  id="mentionsOnly"
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="Mentions only"
                  description="Only notify me when someone mentions me directly."
                  checked={prefs.mentionsOnly}
                  onChange={toggle("mentionsOnly")}
                />
              </div>
            </section>

            {/* Digest frequency */}
            <section className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Digest frequency
              </h3>
              <div className="space-y-1.5">
                <Label htmlFor="digestFrequency" className="text-sm">
                  How often to send the digest
                </Label>
                <select
                  id="digestFrequency"
                  value={prefs.digestFrequency}
                  onChange={handleFrequencyChange}
                  disabled={!prefs.weeklyDigest}
                  className={cn(
                    "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                {!prefs.weeklyDigest && (
                  <p className="text-xs text-slate-400">Enable activity digest to choose frequency.</p>
                )}
              </div>
            </section>
          </div>
        </form>

        <SheetFooter>
          {saved && (
            <p className="text-xs text-emerald-600 self-center mr-auto flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Preferences saved
            </p>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={saving}
          >
            Reset to defaults
          </Button>
          <Button
            type="submit"
            form="notification-form"
            disabled={saving}
            className="min-w-[80px]"
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}