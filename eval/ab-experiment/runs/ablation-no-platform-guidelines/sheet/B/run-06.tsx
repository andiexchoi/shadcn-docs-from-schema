"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Minimal Sheet primitives (no components/ui/sheet.tsx installed)
// ---------------------------------------------------------------------------

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
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
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
  const sideClasses: Record<string, string> = {
    top: "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
    left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    right:
      "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-xl transition ease-in-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",
          "flex flex-col",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none">
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
  <div className={cn("flex flex-col gap-1.5 p-6 pb-0", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 p-6 pt-0 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
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
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// ---------------------------------------------------------------------------
// Toggle Switch (lightweight, no extra package needed)
// ---------------------------------------------------------------------------

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ id, checked, onCheckedChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-gray-900" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Notification preference types & defaults
// ---------------------------------------------------------------------------

interface NotificationPreferences {
  emailMarketing: boolean;
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;
  pushAll: boolean;
  pushMentions: boolean;
  pushReminders: boolean;
  smsOrderUpdates: boolean;
  smsVerification: boolean;
  inAppMessages: boolean;
  inAppActivity: boolean;
}

const defaultPreferences: NotificationPreferences = {
  emailMarketing: false,
  emailProductUpdates: true,
  emailSecurityAlerts: true,
  pushAll: false,
  pushMentions: true,
  pushReminders: true,
  smsOrderUpdates: false,
  smsVerification: true,
  inAppMessages: true,
  inAppActivity: true,
};

// ---------------------------------------------------------------------------
// Section header helper
// ---------------------------------------------------------------------------

interface SectionProps {
  icon: React.ReactNode;
  title: string;
}

function SectionHeading({ icon, title }: SectionProps) {
  return (
    <div className="flex items-center gap-2 pb-2">
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{title}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual preference row
// ---------------------------------------------------------------------------

interface PreferenceRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}

function PreferenceRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: PreferenceRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium text-gray-900">
          {label}
        </Label>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <ToggleSwitch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const setField = React.useCallback(
    <K extends keyof NotificationPreferences>(key: K) =>
      (value: NotificationPreferences[K]) => {
        setPrefs((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
      },
    []
  );

  const handleSave = React.useCallback(async () => {
    setSaving(true);
    // Simulate async save
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
  }, []);

  const handleReset = React.useCallback(() => {
    setPrefs(defaultPreferences);
    setSaved(false);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col overflow-hidden">
        {/* Header */}
        <SheetHeader className="pb-4">
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to be notified. Changes take effect immediately after
            saving.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form
            id="notification-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            aria-label="Notification preferences form"
            className="flex flex-col gap-6"
          >
            {/* Email */}
            <fieldset className="border-0 p-0 m-0">
              <legend className="w-full">
                <SectionHeading icon={<Mail className="h-4 w-4" />} title="Email" />
              </legend>
              <div className="divide-y divide-gray-100">
                <PreferenceRow
                  id="emailMarketing"
                  label="Marketing & promotions"
                  description="News, offers, and product announcements."
                  checked={prefs.emailMarketing}
                  onCheckedChange={setField("emailMarketing")}
                />
                <PreferenceRow
                  id="emailProductUpdates"
                  label="Product updates"
                  description="Release notes and feature announcements."
                  checked={prefs.emailProductUpdates}
                  onCheckedChange={setField("emailProductUpdates")}
                />
                <PreferenceRow
                  id="emailSecurityAlerts"
                  label="Security alerts"
                  description="Login attempts, password changes, and account activity."
                  checked={prefs.emailSecurityAlerts}
                  onCheckedChange={setField("emailSecurityAlerts")}
                />
              </div>
            </fieldset>

            {/* Push */}
            <fieldset className="border-0 p-0 m-0">
              <legend className="w-full">
                <SectionHeading icon={<Bell className="h-4 w-4" />} title="Push notifications" />
              </legend>
              <div className="divide-y divide-gray-100">
                <PreferenceRow
                  id="pushAll"
                  label="All push notifications"
                  description="Enable or disable push notifications globally."
                  checked={prefs.pushAll}
                  onCheckedChange={setField("pushAll")}
                />
                <PreferenceRow
                  id="pushMentions"
                  label="Mentions"
                  description="When someone mentions you in a comment or message."
                  checked={prefs.pushMentions}
                  onCheckedChange={setField("pushMentions")}
                  disabled={!prefs.pushAll}
                />
                <PreferenceRow
                  id="pushReminders"
                  label="Reminders"
                  description="Scheduled reminders you've set up."
                  checked={prefs.pushReminders}
                  onCheckedChange={setField("pushReminders")}
                  disabled={!prefs.pushAll}
                />
              </div>
            </fieldset>

            {/* SMS */}
            <fieldset className="border-0 p-0 m-0">
              <legend className="w-full">
                <SectionHeading icon={<Smartphone className="h-4 w-4" />} title="SMS" />
              </legend>
              <div className="divide-y divide-gray-100">
                <PreferenceRow
                  id="smsOrderUpdates"
                  label="Order updates"
                  description="Shipping and delivery status for your orders."
                  checked={prefs.smsOrderUpdates}
                  onCheckedChange={setField("smsOrderUpdates")}
                />
                <PreferenceRow
                  id="smsVerification"
                  label="Verification codes"
                  description="One-time passcodes for account verification."
                  checked={prefs.smsVerification}
                  onCheckedChange={setField("smsVerification")}
                />
              </div>
            </fieldset>

            {/* In-app */}
            <fieldset className="border-0 p-0 m-0">
              <legend className="w-full">
                <SectionHeading
                  icon={<MessageSquare className="h-4 w-4" />}
                  title="In-app notifications"
                />
              </legend>
              <div className="divide-y divide-gray-100">
                <PreferenceRow
                  id="inAppMessages"
                  label="Direct messages"
                  description="Notifications for new messages in your inbox."
                  checked={prefs.inAppMessages}
                  onCheckedChange={setField("inAppMessages")}
                />
                <PreferenceRow
                  id="inAppActivity"
                  label="Activity feed"
                  description="Updates on posts, reactions, and comments."
                  checked={prefs.inAppActivity}
                  onCheckedChange={setField("inAppActivity")}
                />
              </div>
            </fieldset>
          </form>
        </div>

        {/* Saved banner */}
        {saved && (
          <div
            role="status"
            aria-live="polite"
            className="mx-6 mb-2 flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            Preferences saved successfully.
          </div>
        )}

        {/* Footer */}
        <SheetFooter className="border-t border-gray-100 pt-4">
          <Button type="button" variant="ghost" onClick={handleReset} disabled={saving}>
            Reset to defaults
          </Button>
          <Button type="submit" form="notification-form" disabled={saving}>
            {saving ? "Saving…" : "Save preferences"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}