"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Sheet primitives built on top of @radix-ui/react-dialog
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
      "transition-all duration-300",
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
  const sideClasses: Record<NonNullable<SheetContentProps["side"]>, string> = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top: "inset-x-0 top-0 w-full border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
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
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2">
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
  <div className={cn("flex flex-col gap-1.5 p-6 pb-4 border-b", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-2 p-6 pt-4 border-t mt-auto", className)}
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
// Toggle Switch component
// ---------------------------------------------------------------------------

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ id, checked, onCheckedChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-gray-900" : "bg-gray-200"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg",
          "ring-0 transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Notification preference types & defaults
// ---------------------------------------------------------------------------

interface NotificationPreferences {
  email: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
    digest: boolean;
  };
  push: {
    mentions: boolean;
    reminders: boolean;
    teamActivity: boolean;
  };
  sms: {
    security: boolean;
    urgentAlerts: boolean;
  };
  inApp: {
    allNotifications: boolean;
    sounds: boolean;
    badges: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
  email: {
    marketing: false,
    security: true,
    updates: true,
    digest: false,
  },
  push: {
    mentions: true,
    reminders: true,
    teamActivity: false,
  },
  sms: {
    security: true,
    urgentAlerts: false,
  },
  inApp: {
    allNotifications: true,
    sounds: true,
    badges: true,
  },
};

// ---------------------------------------------------------------------------
// Section component
// ---------------------------------------------------------------------------

interface PreferenceSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function PreferenceSection({ icon, title, description, children }: PreferenceSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="space-y-3 pl-12">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Toggle row component
// ---------------------------------------------------------------------------

interface ToggleRowProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleRow({ id, label, description, checked, onCheckedChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <Label
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none cursor-pointer",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {label}
        </Label>
        {description && (
          <p className={cn("text-xs text-gray-500 mt-1", disabled && "opacity-50")}>
            {description}
          </p>
        )}
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
// Main NotificationSettingsSheet component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);

  function setNested<
    K extends keyof NotificationPreferences,
    SK extends keyof NotificationPreferences[K]
  >(section: K, key: SK, value: boolean) {
    setPrefs((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setIsDirty(true);
    setSaved(false);
  }

  function handleSave() {
    // In a real app, persist to an API here.
    setSaved(true);
    setIsDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setPrefs(defaultPreferences);
    setIsDirty(false);
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

      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to be notified about activity in your workspace.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">

          {/* Email */}
          <PreferenceSection
            icon={<Mail className="h-4 w-4" />}
            title="Email notifications"
            description="Emails are sent to your primary address on file."
          >
            <ToggleRow
              id="email-security"
              label="Security alerts"
              description="Sign-ins, password changes, and suspicious activity."
              checked={prefs.email.security}
              onCheckedChange={(v) => setNested("email", "security", v)}
            />
            <ToggleRow
              id="email-updates"
              label="Product updates"
              description="New features, improvements, and announcements."
              checked={prefs.email.updates}
              onCheckedChange={(v) => setNested("email", "updates", v)}
            />
            <ToggleRow
              id="email-digest"
              label="Weekly digest"
              description="A summary of your team's activity every Monday."
              checked={prefs.email.digest}
              onCheckedChange={(v) => setNested("email", "digest", v)}
            />
            <ToggleRow
              id="email-marketing"
              label="Marketing & tips"
              description="Helpful guides, webinars, and promotional offers."
              checked={prefs.email.marketing}
              onCheckedChange={(v) => setNested("email", "marketing", v)}
            />
          </PreferenceSection>

          <div className="border-t" />

          {/* Push */}
          <PreferenceSection
            icon={<Smartphone className="h-4 w-4" />}
            title="Push notifications"
            description="Sent to your browser or mobile device when you're active."
          >
            <ToggleRow
              id="push-mentions"
              label="Mentions & replies"
              description="When someone @mentions you or replies to your comment."
              checked={prefs.push.mentions}
              onCheckedChange={(v) => setNested("push", "mentions", v)}
            />
            <ToggleRow
              id="push-reminders"
              label="Reminders"
              description="Due dates, scheduled events, and follow-ups."
              checked={prefs.push.reminders}
              onCheckedChange={(v) => setNested("push", "reminders", v)}
            />
            <ToggleRow
              id="push-team"
              label="Team activity"
              description="New assignments, comments, and status changes."
              checked={prefs.push.teamActivity}
              onCheckedChange={(v) => setNested("push", "teamActivity", v)}
            />
          </PreferenceSection>

          <div className="border-t" />

          {/* SMS */}
          <PreferenceSection
            icon={<MessageSquare className="h-4 w-4" />}
            title="SMS notifications"
            description="Text messages are sent to your verified phone number."
          >
            <ToggleRow
              id="sms-security"
              label="Security codes"
              description="One-time passcodes for two-factor authentication."
              checked={prefs.sms.security}
              onCheckedChange={(v) => setNested("sms", "security", v)}
            />
            <ToggleRow
              id="sms-urgent"
              label="Urgent alerts"
              description="Critical incidents that need your immediate attention."
              checked={prefs.sms.urgentAlerts}
              onCheckedChange={(v) => setNested("sms", "urgentAlerts", v)}
            />
          </PreferenceSection>

          <div className="border-t" />

          {/* In-app */}
          <PreferenceSection
            icon={<AlertCircle className="h-4 w-4" />}
            title="In-app notifications"
            description="Notifications shown inside the application while you're using it."
          >
            <ToggleRow
              id="inapp-all"
              label="All notifications"
              description="Master toggle — turning this off disables sounds and badges too."
              checked={prefs.inApp.allNotifications}
              onCheckedChange={(v) => {
                setNested("inApp", "allNotifications", v);
                if (!v) {
                  setPrefs((prev) => ({
                    ...prev,
                    inApp: { allNotifications: false, sounds: false, badges: false },
                  }));
                }
              }}
            />
            <ToggleRow
              id="inapp-sounds"
              label="Notification sounds"
              description="Play a sound when a new notification arrives."
              checked={prefs.inApp.sounds}
              onCheckedChange={(v) => setNested("inApp", "sounds", v)}
              disabled={!prefs.inApp.allNotifications}
            />
            <ToggleRow
              id="inapp-badges"
              label="Badge count"
              description="Show an unread count on the notification bell."
              checked={prefs.inApp.badges}
              onCheckedChange={(v) => setNested("inApp", "badges", v)}
              disabled={!prefs.inApp.allNotifications}
            />
          </PreferenceSection>
        </div>

        {/* Footer */}
        <SheetFooter className="flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
          {saved && (
            <p className="text-xs text-green-600 font-medium mr-auto flex items-center gap-1">
              <span aria-hidden>✓</span> Preferences saved
            </p>
          )}
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-gray-600"
            disabled={!isDirty}
          >
            Reset to defaults
          </Button>
          <Button onClick={handleSave} disabled={!isDirty}>
            Save preferences
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}