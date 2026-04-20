"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Minimal Sheet built on Radix Dialog primitives
// ---------------------------------------------------------------------------

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
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "motion-reduce:transition-none",
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
  const sideClasses: Record<string, string> = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-sm border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "inset-y-0 left-0 h-full w-full max-w-sm border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top: "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
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
          "motion-reduce:duration-0",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose
            className={cn(
              "absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
              "disabled:pointer-events-none"
            )}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </SheetClose>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 px-6 pt-6 pb-4", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 border-t mt-auto", className)}
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
    className={cn("text-lg font-semibold text-slate-900 leading-none tracking-tight", className)}
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

// ---------------------------------------------------------------------------
// Toggle Switch component
// ---------------------------------------------------------------------------

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id: string;
  disabled?: boolean;
}

function Toggle({ checked, onCheckedChange, id, disabled }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-slate-900" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg",
          "transform transition-transform duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Notification preferences form state
// ---------------------------------------------------------------------------

interface NotificationPreferences {
  emailMarketing: boolean;
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;
  pushAll: boolean;
  pushDirectMessages: boolean;
  pushMentions: boolean;
  smsOrderUpdates: boolean;
  smsSecurityAlerts: boolean;
  inAppSounds: boolean;
  inAppBadges: boolean;
}

const defaultPreferences: NotificationPreferences = {
  emailMarketing: false,
  emailProductUpdates: true,
  emailSecurityAlerts: true,
  pushAll: false,
  pushDirectMessages: true,
  pushMentions: true,
  smsOrderUpdates: false,
  smsSecurityAlerts: false,
  inAppSounds: true,
  inAppBadges: true,
};

// ---------------------------------------------------------------------------
// Individual preference row
// ---------------------------------------------------------------------------

interface PreferenceRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function PreferenceRow({ id, label, description, checked, onCheckedChange }: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="text-sm font-medium text-slate-800 cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      <Toggle id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-slate-500">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [savedPrefs, setSavedPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  function setField(key: keyof NotificationPreferences) {
    return (value: boolean) => setPrefs((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    setSavedPrefs(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleCancel() {
    setPrefs(savedPrefs);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-sm overflow-y-auto">
        {/* Header */}
        <SheetHeader>
          <SheetTitle>Notification settings</SheetTitle>
          <SheetDescription>
            Choose how and when you want to be notified. Changes apply to your account immediately after saving.
          </SheetDescription>
        </SheetHeader>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 pb-2">
          {/* Email */}
          <section className="mb-5">
            <SectionHeader icon={<Mail className="h-4 w-4" />} title="Email" />
            <div className="divide-y divide-slate-100">
              <PreferenceRow
                id="emailMarketing"
                label="Marketing emails"
                description="Promotions, offers, and news about new features."
                checked={prefs.emailMarketing}
                onCheckedChange={setField("emailMarketing")}
              />
              <PreferenceRow
                id="emailProductUpdates"
                label="Product updates"
                description="Release notes and changelog summaries."
                checked={prefs.emailProductUpdates}
                onCheckedChange={setField("emailProductUpdates")}
              />
              <PreferenceRow
                id="emailSecurityAlerts"
                label="Security alerts"
                description="Sign-in activity and account security warnings."
                checked={prefs.emailSecurityAlerts}
                onCheckedChange={setField("emailSecurityAlerts")}
              />
            </div>
          </section>

          {/* Push */}
          <section className="mb-5">
            <SectionHeader icon={<Smartphone className="h-4 w-4" />} title="Push notifications" />
            <div className="divide-y divide-slate-100">
              <PreferenceRow
                id="pushAll"
                label="All push notifications"
                description="Receive every notification as a push alert."
                checked={prefs.pushAll}
                onCheckedChange={setField("pushAll")}
              />
              <PreferenceRow
                id="pushDirectMessages"
                label="Direct messages"
                description="Alerts when someone sends you a direct message."
                checked={prefs.pushDirectMessages}
                onCheckedChange={setField("pushDirectMessages")}
              />
              <PreferenceRow
                id="pushMentions"
                label="Mentions"
                description="Alerts when you're mentioned in a comment or thread."
                checked={prefs.pushMentions}
                onCheckedChange={setField("pushMentions")}
              />
            </div>
          </section>

          {/* SMS */}
          <section className="mb-5">
            <SectionHeader icon={<MessageSquare className="h-4 w-4" />} title="SMS" />
            <div className="divide-y divide-slate-100">
              <PreferenceRow
                id="smsOrderUpdates"
                label="Order updates"
                description="Text messages about your orders and deliveries."
                checked={prefs.smsOrderUpdates}
                onCheckedChange={setField("smsOrderUpdates")}
              />
              <PreferenceRow
                id="smsSecurityAlerts"
                label="Security alerts"
                description="One-time passcodes and security verification texts."
                checked={prefs.smsSecurityAlerts}
                onCheckedChange={setField("smsSecurityAlerts")}
              />
            </div>
          </section>

          {/* In-app */}
          <section className="mb-2">
            <SectionHeader icon={<AlertCircle className="h-4 w-4" />} title="In-app" />
            <div className="divide-y divide-slate-100">
              <PreferenceRow
                id="inAppSounds"
                label="Notification sounds"
                description="Play a sound when a new notification arrives."
                checked={prefs.inAppSounds}
                onCheckedChange={setField("inAppSounds")}
              />
              <PreferenceRow
                id="inAppBadges"
                label="Badge count"
                description="Show an unread count badge on the notification icon."
                checked={prefs.inAppBadges}
                onCheckedChange={setField("inAppBadges")}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <SheetFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="min-w-[80px]">
            {saved ? "Saved!" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}